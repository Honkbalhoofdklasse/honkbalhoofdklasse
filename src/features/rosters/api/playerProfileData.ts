import { supabase } from '@/shared/supabase/legacy'
import type { BattingRow, PitchingRow } from '../domain/careerTypes'

export async function getCareerStats(
  bbrefId: string,
): Promise<{ batting: BattingRow[]; pitching: PitchingRow[] }> {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://honkbalhoofdklasse.com'
    const res = await fetch(`${base}/api/career-stats?id=${encodeURIComponent(bbrefId)}`, {
      next: { revalidate: 86400 },
    })
    if (!res.ok) return { batting: [], pitching: [] }
    return res.json()
  } catch {
    return { batting: [], pitching: [] }
  }
}

export async function getPlayerPhotos(playerName: string): Promise<{
  banner_url: string | null
  headshot_url: string | null
  banner_focal_x: number | null
  banner_focal_y: number | null
}> {
  const { data } = await supabase
    .from('player_photos')
    .select('banner_url, headshot_url, banner_focal_x, banner_focal_y')
    .ilike('player_name', playerName)
    .limit(1)
    .maybeSingle()
  return (
    data ?? { banner_url: null, headshot_url: null, banner_focal_x: null, banner_focal_y: null }
  )
}
