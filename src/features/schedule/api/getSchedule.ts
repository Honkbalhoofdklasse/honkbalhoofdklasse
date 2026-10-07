import { supabase } from '@/shared/supabase/legacy'
import type { GameRow } from '@/shared/types/game'
import type { StandingRow } from '@/shared/types/standing'

export type Game = Pick<
  GameRow,
  'id' | 'game_date' | 'game_time' | 'home_team_id' | 'away_team_id' | 'status' | 'venue'
>

export type StandingsEntry = Pick<StandingRow, 'team_id' | 'wins' | 'losses'>

export async function getSchedule() {
  const today = new Date().toISOString().split('T')[0]
  const [gamesRes, standingsRes] = await Promise.all([
    supabase
      .from('games')
      .select('*')
      .eq('status', 'scheduled')
      .gte('game_date', today)
      .order('game_date', { ascending: true })
      .limit(30),
    supabase.from('standings').select('team_id, wins, losses').eq('season', 2026),
  ])
  const standingsMap: Record<string, StandingsEntry> = {}
  for (const s of (standingsRes.data ?? []) as StandingsEntry[]) {
    standingsMap[s.team_id] = s
  }
  return { games: gamesRes.data ?? [], standingsMap }
}
