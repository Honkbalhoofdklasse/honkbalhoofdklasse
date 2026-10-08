import { scheduledStartUtcMs } from '@/shared/dates/amsterdamStart'
import { supabaseAdmin } from '@/shared/supabase/legacy'
import type { CronGame } from './shouldRunCron'

const DAY_MS = 24 * 60 * 60_000

function isoDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10)
}

export async function loadCronGames(nowMs = Date.now()): Promise<CronGame[]> {
  const { data } = await supabaseAdmin
    .from('games')
    .select('status, game_date, game_time')
    .in('status', ['live', 'scheduled'])
    .gte('game_date', isoDate(nowMs - DAY_MS))
    .lte('game_date', isoDate(nowMs + DAY_MS))

  return (data ?? []).map((game) => ({
    status: game.status,
    startUtcMs:
      game.game_date && game.game_time
        ? scheduledStartUtcMs(`${game.game_date} ${game.game_time}`)
        : 0,
  }))
}
