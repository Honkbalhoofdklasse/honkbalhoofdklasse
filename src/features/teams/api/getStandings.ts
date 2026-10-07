import { supabase } from '@/shared/supabase/legacy'

export async function getStandings() {
  const { data } = await supabase
    .from('standings')
    .select('team_id, wins, losses, win_pct, runs_scored, runs_allowed, games_played')
    .eq('season', new Date().getFullYear())
    .order('wins', { ascending: false })
    .order('win_pct', { ascending: false })
  return data ?? []
}
