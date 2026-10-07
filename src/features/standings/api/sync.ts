import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/shared/supabase/legacy'
import { sendLiveNotification } from '@/shared/email/email'
import { IOC_TO_TEAM } from '@/shared/teams/teams'
import {
  BASE_URL,
  COMPETITION,
  gameStatus,
  scheduledStartUtcMs,
  type SteGame,
} from '../domain/sync'

const LIVE_NOTIFY_TOLERANCE_MS = 5 * 60_000
const STREAM_GO_LIVE_LEAD_MS = 15 * 60_000

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('Authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const res = await fetch(`${BASE_URL}/fetchschedule.php?competition=${COMPETITION}`, {
      cache: 'no-store',
    })
    if (!res.ok) throw new Error(`Schedule fetch failed: ${res.status}`)

    const json = await res.json()
    const steGames: SteGame[] = json?.games ?? []
    if (!steGames.length) throw new Error('No games returned from schedule')

    const { data: sbGames, error: sbErr } = await supabaseAdmin
      .from('games')
      .select(
        'id, external_id, status, home_score, away_score, live_notified, home_team_id, away_team_id',
      )
      .eq('season', 2026)

    if (sbErr) throw sbErr

    const sbByExtId = new Map((sbGames ?? []).map((g) => [String(g.external_id), g]))

    const gameUpdates: { id: number; patch: Record<string, unknown> }[] = []
    const newlyLive: { homeTeamId: string; awayTeamId: string; dbId: number }[] = []
    let newFinals = 0

    for (const sg of steGames) {
      const sb = sbByExtId.get(String(sg.id))
      if (!sb) continue

      const newStatus = gameStatus(sg.gamestatus)
      const needsScore = newStatus !== 'scheduled'

      const patch: Record<string, unknown> = {}

      if (sb.status !== newStatus) patch.status = newStatus
      if (needsScore && sb.home_score !== sg.homeruns) patch.home_score = sg.homeruns
      if (needsScore && sb.away_score !== sg.awayruns) patch.away_score = sg.awayruns

      if (Object.keys(patch).length > 0) {
        patch.updated_at = new Date().toISOString()
        gameUpdates.push({ id: sb.id, patch })
        if (newStatus === 'final' && sb.status !== 'final') newFinals++
      }

      if (
        newStatus === 'live' &&
        sb.status !== 'live' &&
        !sb.live_notified &&
        Date.now() >= scheduledStartUtcMs(String(sg.start ?? '')) - LIVE_NOTIFY_TOLERANCE_MS
      ) {
        newlyLive.push({ homeTeamId: sb.home_team_id, awayTeamId: sb.away_team_id, dbId: sb.id })
      }
    }

    let gameErrors = 0
    for (const { id, patch } of gameUpdates) {
      try {
        await supabaseAdmin.from('games').update(patch).eq('id', id)
      } catch (e) {
        console.error(`[sync] game update failed id=${id}:`, e)
        gameErrors++
      }
    }

    const teamBest: Record<
      string,
      {
        wins: number
        losses: number
        ties: number
        gp: number
        gb: number
      }
    > = {}

    for (const sg of steGames) {
      for (const [ioc, side] of [
        [sg.homeioc, sg.home_team],
        [sg.awayioc, sg.away_team],
      ] as [string, typeof sg.home_team][]) {
        if (!side) continue
        const teamId = IOC_TO_TEAM[ioc]
        if (!teamId) continue

        const gp = side.groupwins + side.grouplosses + side.groupties
        const cur = teamBest[teamId]
        if (!cur || gp > cur.gp) {
          teamBest[teamId] = {
            wins: side.groupwins,
            losses: side.grouplosses,
            ties: side.groupties,
            gp,
            gb: side.groupgb,
          }
        }
      }
    }

    let standingsUpdated = 0
    for (const [teamId, s] of Object.entries(teamBest)) {
      const winPct = s.gp > 0 ? s.wins / s.gp : 0
      try {
        const { error } = await supabaseAdmin
          .from('standings')
          .update({
            wins: s.wins,
            losses: s.losses,
            ties: s.ties,
            games_played: s.gp,
            win_pct: winPct,
            games_behind: s.gb,
            updated_at: new Date().toISOString(),
          })
          .eq('team_id', teamId)
          .eq('season', 2026)
        if (!error) standingsUpdated++
      } catch (e) {
        console.error(`[sync] standings update failed team=${teamId}:`, e)
      }
    }

    const { data: currentGames } = await supabaseAdmin
      .from('games')
      .select('id, status, game_date, game_time')
      .eq('season', 2026)

    const gameMap = new Map((currentGames ?? []).map((g) => [g.id as number, g]))

    const { data: linkedStreams } = await supabaseAdmin
      .from('streams')
      .select('id, game_id, is_live')
      .not('game_id', 'is', null)

    let streamsToggled = 0
    for (const s of linkedStreams ?? []) {
      const game = gameMap.get(s.game_id as number)
      if (!game) continue

      const shouldOff = game.status === 'final'

      let shouldLive = game.status === 'live'
      if (!shouldLive && game.status === 'scheduled' && game.game_date && game.game_time) {
        const startUtcMs = scheduledStartUtcMs(`${game.game_date} ${game.game_time}`)
        shouldLive = startUtcMs > 0 && Date.now() >= startUtcMs - STREAM_GO_LIVE_LEAD_MS
      }

      if (shouldLive && !s.is_live) {
        await supabaseAdmin.from('streams').update({ is_live: true }).eq('id', s.id)
        streamsToggled++
      } else if (shouldOff && s.is_live) {
        await supabaseAdmin.from('streams').update({ is_live: false }).eq('id', s.id)
        streamsToggled++
      }
    }

    let notificationsSent = 0
    if (newlyLive.length > 0) {
      const { data: subscribers } = await supabaseAdmin.from('subscribers').select('email, token')

      if (subscribers && subscribers.length > 0) {
        await sendLiveNotification(
          subscribers as { email: string; token: string }[],
          newlyLive.map((g) => ({ homeTeamId: g.homeTeamId, awayTeamId: g.awayTeamId })),
        )
        notificationsSent = subscribers.length
      }

      for (const g of newlyLive) {
        await supabaseAdmin.from('games').update({ live_notified: true }).eq('id', g.dbId)
      }
    }

    return NextResponse.json({
      ok: true,
      gamesChecked: steGames.length,
      gamesUpdated: gameUpdates.length,
      gameErrors,
      newFinals,
      standingsUpdated,
      streamsToggled,
      notificationsSent,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[sync]', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
