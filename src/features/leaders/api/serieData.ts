import { supabaseAdmin } from '@/shared/supabase/legacy'
import type { TabData } from '../domain/types'

export async function getLatestSeriesWeek(): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from('batting_stats')
    .select('series_week')
    .eq('season', new Date().getFullYear())
    .neq('series_week', 'season')
    .order('series_week', { ascending: false })
    .limit(1)
  return data?.[0]?.series_week ?? null
}

function deduplicateByPlayer<T extends { full_name?: unknown; team_id?: unknown }>(rows: T[]): T[] {
  const seen = new Set<string>()
  return rows.filter((r) => {
    const words = String(r.full_name ?? '')
      .toLowerCase()
      .trim()
      .split(/\s+/)
    const key = `${words[0]}|${words[words.length - 1]}|${String(r.team_id ?? '').toLowerCase()}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export async function getSerieData(seriesWeek: string): Promise<TabData> {
  const [{ data: batters }, { data: pitchers }] = await Promise.all([
    supabaseAdmin
      .from('batting_stats')
      .select(
        'full_name, team_id, at_bats, hits, runs, doubles, home_runs, rbi, stolen_bases, avg, obp, slg, ops',
      )
      .eq('season', new Date().getFullYear())
      .eq('series_week', seriesWeek)
      .gte('at_bats', 1)
      .order('avg', { ascending: false })
      .limit(60),
    supabaseAdmin
      .from('pitching_stats')
      .select(
        'full_name, team_id, innings_pitched, strikeouts, wins, saves, hits_allowed, walks, earned_runs',
      )
      .eq('season', new Date().getFullYear())
      .eq('series_week', seriesWeek)
      .gte('innings_pitched', 0.1)
      .order('strikeouts', { ascending: false })
      .limit(60),
  ])
  return {
    batters: deduplicateByPlayer((batters ?? []) as Record<string, unknown>[]),
    pitchers: deduplicateByPlayer((pitchers ?? []) as Record<string, unknown>[]),
  }
}
