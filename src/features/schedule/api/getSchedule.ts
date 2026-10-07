import { supabase } from '@/shared/supabase/legacy'

export type Game = {
  id: number
  game_date: string
  game_time: string | null
  home_team_id: string
  away_team_id: string
  status: string
  venue: string | null
}

export type StandingsEntry = { team_id: string; wins: number; losses: number }

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
