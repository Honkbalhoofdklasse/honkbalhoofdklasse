import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/shared/supabase/legacy'
import { type FinishedGame, clusterSeries } from '@/features/admin/domain/import-series'

export async function GET() {
  const [schedRes, { data: existing }] = await Promise.all([
    fetch('https://boxscore.stenwessel.nl/api/fetchschedule.php?competition=hb2026', {
      cache: 'no-store',
    }),
    supabaseAdmin
      .from('batting_stats')
      .select('series_week')
      .eq('season', 2026)
      .neq('series_week', 'season'),
  ])
  const allGames: Array<{ id: number; start: string; gamestatus: number }> =
    (await schedRes.json()).games ?? []
  const importedWeeks = new Set((existing ?? []).map((r) => r.series_week))

  const finished: FinishedGame[] = allGames
    .filter((g) => g.gamestatus === 2 || g.gamestatus === 3)
    .map((g) => ({ id: g.id, date: g.start.slice(0, 10) }))

  const series = clusterSeries(finished).map((c) => ({
    seriesDate: c.seriesDate,
    gameDates: [...new Set(c.games.map((g) => g.date))],
    gameCount: c.games.length,
    imported: importedWeeks.has(c.seriesDate),
    importing: false,
    result: null,
  }))

  return NextResponse.json({ series })
}
