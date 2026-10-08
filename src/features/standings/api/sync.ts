import { NextResponse } from 'next/server'
import { loadCronGames } from '@/shared/cron/loadCronGames'
import { shouldRunCron } from '@/shared/cron/shouldRunCron'
import { sendLiveNotification } from '@/shared/email/email'
import { requireCronSecret } from '@/shared/http/requireCronSecret'
import { supabaseAdmin } from '@/shared/supabase/legacy'
import { IOC_TO_TEAM } from '@/shared/teams/teams'
import { standingsChanged, type StandingRecord } from '../domain/standingsChanged'
import {
  BASE_URL,
  COMPETITION,
  gameStatus,
  scheduledStartUtcMs,
  type SteGame,
} from '../domain/sync'

const LIVE_NOTIFY_TOLERANCE_MS = 5 * 60_000
const STREAM_GO_LIVE_LEAD_MS = 15 * 60_000

type DbGame = {
  id: number
  external_id: string | number
  status: string
  home_score: number | null
  away_score: number | null
  live_notified: boolean
  home_team_id: string
  away_team_id: string
  game_date: string | null
  game_time: string | null
}

type GamePatch = { id: number; patch: Record<string, unknown> }
type NewlyLive = { homeTeamId: string; awayTeamId: string; dbId: number }

function diffGames(steGames: SteGame[], sbGames: DbGame[]) {
  const sbByExtId = new Map(sbGames.map((g) => [String(g.external_id), g]))
  const gameUpdates: GamePatch[] = []
  const newlyLive: NewlyLive[] = []
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
  return { gameUpdates, newlyLive, newFinals }
}

function bestStandings(steGames: SteGame[]): Record<string, StandingRecord> {
  const teamBest: Record<string, StandingRecord> = {}
  for (const sg of steGames) {
    const sides = [
      [sg.homeioc, sg.home_team],
      [sg.awayioc, sg.away_team],
    ] as [string, typeof sg.home_team][]
    for (const [ioc, side] of sides) {
      if (!side) continue
      const teamId = IOC_TO_TEAM[ioc]
      if (!teamId) continue
      const gp = side.groupwins + side.grouplosses + side.groupties
      const cur = teamBest[teamId]
      if (!cur || gp > cur.games_played) {
        teamBest[teamId] = {
          wins: side.groupwins,
          losses: side.grouplosses,
          ties: side.groupties,
          games_played: gp,
          games_behind: side.groupgb,
        }
      }
    }
  }
  return teamBest
}

async function applyGameUpdates(gameUpdates: GamePatch[]): Promise<number> {
  const results = await Promise.allSettled(
    gameUpdates.map(({ id, patch }) => supabaseAdmin.from('games').update(patch).eq('id', id)),
  )
  let gameErrors = 0
  results.forEach((result, index) => {
    if (result.status === 'rejected' || result.value.error) {
      console.error(`[sync] game update failed id=${gameUpdates[index].id}`)
      gameErrors++
    }
  })
  return gameErrors
}

async function applyStandings(teamBest: Record<string, StandingRecord>): Promise<number> {
  const { data: currentRows } = await supabaseAdmin
    .from('standings')
    .select('team_id, wins, losses, ties, games_played, games_behind')
    .eq('season', 2026)
  const currentByTeam = new Map((currentRows ?? []).map((row) => [row.team_id, row]))

  const changed = Object.entries(teamBest).filter(([teamId, next]) =>
    standingsChanged(currentByTeam.get(teamId), next),
  )
  const results = await Promise.allSettled(
    changed.map(([teamId, s]) =>
      supabaseAdmin
        .from('standings')
        .update({
          ...s,
          win_pct: s.games_played > 0 ? s.wins / s.games_played : 0,
          updated_at: new Date().toISOString(),
        })
        .eq('team_id', teamId)
        .eq('season', 2026),
    ),
  )
  return results.filter((r) => r.status === 'fulfilled' && !r.value.error).length
}

async function toggleStreams(sbGames: DbGame[], gameUpdates: GamePatch[]): Promise<number> {
  const statusById = new Map(sbGames.map((g) => [g.id, g]))
  for (const { id, patch } of gameUpdates) {
    const game = statusById.get(id)
    if (game && typeof patch.status === 'string') game.status = patch.status
  }
  const { data: linkedStreams } = await supabaseAdmin
    .from('streams')
    .select('id, game_id, is_live')
    .not('game_id', 'is', null)

  const toggles: { id: number; is_live: boolean }[] = []
  for (const s of linkedStreams ?? []) {
    const game = statusById.get(s.game_id as number)
    if (!game) continue
    let shouldLive = game.status === 'live'
    if (!shouldLive && game.status === 'scheduled' && game.game_date && game.game_time) {
      const startUtcMs = scheduledStartUtcMs(`${game.game_date} ${game.game_time}`)
      shouldLive = startUtcMs > 0 && Date.now() >= startUtcMs - STREAM_GO_LIVE_LEAD_MS
    }
    const shouldOff = game.status === 'final'
    if (shouldLive && !s.is_live) toggles.push({ id: s.id, is_live: true })
    else if (shouldOff && s.is_live) toggles.push({ id: s.id, is_live: false })
  }
  await Promise.allSettled(
    toggles.map((t) => supabaseAdmin.from('streams').update({ is_live: t.is_live }).eq('id', t.id)),
  )
  return toggles.length
}

async function notifyNewlyLive(newlyLive: NewlyLive[]): Promise<number> {
  if (newlyLive.length === 0) return 0
  const { data: subscribers } = await supabaseAdmin.from('subscribers').select('email, token')
  if (subscribers && subscribers.length > 0) {
    await sendLiveNotification(
      subscribers as { email: string; token: string }[],
      newlyLive.map((g) => ({ homeTeamId: g.homeTeamId, awayTeamId: g.awayTeamId })),
    )
  }
  await Promise.allSettled(
    newlyLive.map((g) =>
      supabaseAdmin.from('games').update({ live_notified: true }).eq('id', g.dbId),
    ),
  )
  return subscribers?.length ?? 0
}

export async function GET(req: Request) {
  const unauthorized = requireCronSecret(req)
  if (unauthorized) return unauthorized

  try {
    if (!shouldRunCron(await loadCronGames())) {
      return NextResponse.json({ ok: true, skipped: true })
    }

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
        'id, external_id, status, home_score, away_score, live_notified, home_team_id, away_team_id, game_date, game_time',
      )
      .eq('season', 2026)
    if (sbErr) throw sbErr
    const dbGames = (sbGames ?? []) as DbGame[]

    const { gameUpdates, newlyLive, newFinals } = diffGames(steGames, dbGames)
    const [gameErrors, standingsUpdated, streamsToggled, notificationsSent] = await Promise.all([
      applyGameUpdates(gameUpdates),
      applyStandings(bestStandings(steGames)),
      toggleStreams(dbGames, gameUpdates),
      notifyNewlyLive(newlyLive),
    ])

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
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
