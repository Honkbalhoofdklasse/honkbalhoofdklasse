import { NextResponse } from 'next/server'
import { loadCronGames } from '@/shared/cron/loadCronGames'
import { shouldRunCron } from '@/shared/cron/shouldRunCron'
import { requireCronSecret } from '@/shared/http/requireCronSecret'
import { supabaseAdmin } from '@/shared/supabase/legacy'
import { buildNewState, initialGameState } from '../domain/game-state'
import { BASE, KNBSB_TO_TEAM, TEAM_NAME } from '../domain/teams'
import type { GameState, LiveGameContext, ScheduledGame } from '../domain/types'
import { notifyFourHits, notifyHomeRuns } from './notify-batter-events'
import { notifyFinal, notifyGameStart, notifyInningScores } from './notify-game-events'
import { notifyNoHitters } from './notify-no-hitter'
import { loadPushSubscriptions, type PushSubscriptionRow } from './send-to-teams'

async function processLiveGame(
  game: ScheduledGame,
  notifications: string[],
  subscriptions: PushSubscriptionRow[],
) {
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
    subscriptions,
  }

  await notifyGameStart(ctx)
  await notifyHomeRuns(ctx)
  await notifyNoHitters(ctx)
  await notifyFourHits(ctx)
  await notifyInningScores(ctx)
  await notifyFinal(ctx)

  if (JSON.stringify(newState) === JSON.stringify(prevState)) return

  await supabaseAdmin
    .from('push_game_state')
    .upsert(
      { game_id: gameId, state_json: newState, updated_at: new Date().toISOString() },
      { onConflict: 'game_id' },
    )
}

export async function GET(req: Request) {
  const unauthorized = requireCronSecret(req)
  if (unauthorized) return unauthorized

  if (!shouldRunCron(await loadCronGames())) {
    return NextResponse.json({ ok: true, skipped: true })
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
  const subscriptions = await loadPushSubscriptions()

  for (const game of liveGames) {
    await processLiveGame(game, notifications, subscriptions)
  }

  return NextResponse.json({ ok: true, live: liveGames.length, sent: notifications })
}
