import { supabaseAdmin as supabase } from '@/shared/supabase/legacy'

export type Stream = {
  id: number
  game_id: number | null
  title: string
  stream_url: string
  platform: string | null
  is_live: boolean
  scheduled_at: string | null
}

export type Game = {
  id: number
  game_date: string
  game_time: string | null
  home_team_id: string
  away_team_id: string
}

export async function getData() {
  const today = new Date().toISOString().split('T')[0]

  const [streamsRes, upcomingRes] = await Promise.all([
    supabase.from('streams').select('*').order('scheduled_at', { ascending: true }),
    supabase
      .from('games')
      .select('id,game_date,game_time,home_team_id,away_team_id')
      .eq('status', 'scheduled')
      .gte('game_date', today)
      .order('game_date', { ascending: true })
      .limit(20),
  ])

  return {
    streams: (streamsRes.data ?? []) as Stream[],
    upcoming: (upcomingRes.data ?? []) as Game[],
  }
}
