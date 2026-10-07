import { supabase } from '@/shared/supabase/legacy'
import type { GameRow, StandingRow } from '../domain/types'

export async function getStandings(): Promise<StandingRow[]> {
  const { data, error } = await supabase
    .from('standings')
    .select('team_id, games_played, wins, losses, ties, win_pct, runs_scored, runs_allowed')
    .eq('season', new Date().getFullYear())
    .order('wins', { ascending: false })
    .order('win_pct', { ascending: false })

  if (error || !data) return []
  return data
}

export async function getRecentGames(): Promise<GameRow[]> {
  const { data } = await supabase
    .from('games')
    .select('home_team_id, away_team_id, home_score, away_score, game_date')
    .eq('season', new Date().getFullYear())
    .eq('status', 'final')
    .order('game_date', { ascending: false })
    .limit(150)
  return (data ?? []) as GameRow[]
}
