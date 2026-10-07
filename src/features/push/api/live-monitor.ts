import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/shared/supabase/legacy'
import { buildNewState, initialGameState } from '../domain/game-state'
import { BASE, KNBSB_TO_TEAM, TEAM_NAME } from '../domain/teams'
import type { GameState, LiveGameContext, ScheduledGame } from '../domain/types'
import { notifyFourHits, notifyHomeRuns } from './notify-batter-events'
import { notifyFinal, notifyGameStart, notifyInningScores } from './notify-game-events'
import { notifyNoHitters } from './notify-no-hitter'

async function processLiveGame(game: ScheduledGame, notifications: string[]) {
  const gameId: number = game.id
  const homeTeamId = KNBSB_TO_TEAM[game.homeid as number] ?? ''
  const awayTeamId = KNBSB_TO_TEAM[game.awayid as number] ?? ''
  const homeName = TEAM_NAME[homeTeamId] ?? homeTeamId
  const awayName = TEAM_NAME[awayTeamId] ?? awayTeamId
  const teams = [homeTeamId, awayTeamId].filter(Boolean)
  const gameUrl = `/livescores`
  const icon = `${BASE}/api/notification-icon/${homeTeamId}`

  const { data: stateRow } = await supabaseAdmin
    .from('push_game_state')
    .select('state_json')
    .eq('game_id', gameId)
    .maybeSingle()

  const prevState: GameState = stateRow?.state_json ?? initialGameState()

  const gdRes = await fetch(
    `https://boxscore.stenwessel.nl/api/fetchgamedata.php?competition=hb2026&game=${gameId}`,
    { cache: 'no-store' },
  )
  if (!gdRes.ok) return
  const gd = await gdRes.json()
  const gameData = gd.gameData
  const boxScore = gd.boxScore ?? {}

  const newState = buildNewState(prevState, gameData)

  const ctx: LiveGameContext = {
    game,
    gameId,
    gameData,
    boxScore,
    prevState,
    newState,
    homeTeamId,
    awayTeamId,
    homeName,
    awayName,
    teams,
    gameUrl,
    icon,
    notifications,
  }

  await notifyGameStart(ctx)
  await notifyHomeRuns(ctx)
  await notifyNoHitters(ctx)
  await notifyFourHits(ctx)
  await notifyInningScores(ctx)
  await notifyFinal(ctx)

  await supabaseAdmin
    .from('push_game_state')
    .upsert(
      { game_id: gameId, state_json: newState, updated_at: new Date().toISOString() },
      { onConflict: 'game_id' },
    )
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (secret && req.headers.get('Authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const schedRes = await fetch(
    'https://boxscore.stenwessel.nl/api/fetchschedule.php?competition=hb2026',
    { cache: 'no-store' },
  )
  const schedData = await schedRes.json()
  const liveGames = (schedData.games ?? []).filter(
    (g: Record<string, unknown>) => g.gamestatus === 1,
  )

  if (!liveGames.length) return NextResponse.json({ ok: true, live: 0 })

  const notifications: string[] = []

  for (const game of liveGames) {
    await processLiveGame(game, notifications)
  }

  return NextResponse.json({ ok: true, live: liveGames.length, sent: notifications })
}
