export type CronGame = { status: string; startUtcMs: number }

export const UPCOMING_LEAD_MS = 30 * 60_000
const STALE_SCHEDULED_MS = 6 * 60 * 60_000

export function shouldRunCron(games: CronGame[], nowMs = Date.now()): boolean {
  return games.some((game) => {
    if (game.status === 'live') return true
    if (game.status !== 'scheduled' || game.startUtcMs <= 0) return false
    const untilStart = game.startUtcMs - nowMs
    return untilStart <= UPCOMING_LEAD_MS && untilStart >= -STALE_SCHEDULED_MS
  })
}
