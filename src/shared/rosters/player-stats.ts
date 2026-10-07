import { supabase } from '@/shared/supabase/legacy'
import { fetchAllPlayerStats, fetchKnbsbCategories, type Row } from './stats/knbsb-fetch'
import { findInList, findPlayer } from './stats/knbsb-names'
import { type PlayerPhotos, type SeasonStats, ZERO_STATS } from './stats/season-stats'
import { fmtIp, ipToInnings, num } from './stats/stat-format'

export type { PlayerPhotos, SeasonStats } from './stats/season-stats'

// ── computeSeasonStats ────────────────────────────────────────────────────────
// Uses section=players (no threshold) for individual pages.
// Falls back to section=leaders categories (for players who appear there but
// have a different name format in section=players).
export async function computeSeasonStats(name: string): Promise<SeasonStats> {
  const [batList, pitList, batCats, pitCats] = await Promise.all([
    fetchAllPlayerStats('batting'),
    fetchAllPlayerStats('pitching'),
    fetchKnbsbCategories('batting'),
    fetchKnbsbCategories('pitching'),
  ])

  // Prefer section=players (all players, no threshold)
  let bat: Row | null = findInList(batList, name)
  let pit: Row | null = findInList(pitList, name)

  // Fall back to section=leaders categories (catches edge-case name format diffs)
  if (!bat) bat = findPlayer(batCats, name)
  if (!pit) pit = findPlayer(pitCats, name)

  if (!bat && !pit) return { ...ZERO_STATS }

  // section=players stores rates as integers (219 = .219); section=leaders uses decimals (0.219)
  function normalizeRate(v: unknown): number | null {
    if (v == null || v === '') return null
    const x = Number(v)
    if (isNaN(x)) return null
    return x > 1 ? x / 1000 : x
  }

  const rawAvg = normalizeRate(bat?.avg)
  const rawObp = normalizeRate(bat?.obp)
  const rawSlg = normalizeRate(bat?.slg)

  const pitBb = num(pit?.pitch_bb)
  const pitH = num(pit?.pitch_h)
  const pitIp = ipToInnings(pit?.pitch_ip)

  return {
    ab: num(bat?.ab),
    h: num(bat?.h),
    hr: num(bat?.hr),
    rbi: num(bat?.rbi),
    r: num(bat?.r),
    bb: num(bat?.bb),
    so: num(bat?.so),
    double: num(bat?.double),
    triple: num(bat?.triple),
    sb: num(bat?.sb),
    sf: num(bat?.sf),
    sh: num(bat?.sh),
    hbp: num(bat?.hbp),
    pa: num(bat?.pa),
    ibb: num(bat?.ibb),
    cs: num(bat?.cs),
    gdp: num(bat?.gdp),
    avg: rawAvg != null ? Number(rawAvg.toFixed(3)) : null,
    obp: rawObp != null ? Number(rawObp.toFixed(3)) : null,
    slg: rawSlg != null ? Number(rawSlg.toFixed(3)) : null,
    ops: rawObp != null && rawSlg != null ? Number((rawObp + rawSlg).toFixed(3)) : null,
    games: num(bat?.g ?? bat?.pa ?? 0),
    pitch_ip: fmtIp(pit?.pitch_ip),
    pitch_gs: num(pit?.pitch_gs),
    pitch_er: num(pit?.pitch_er),
    pitch_so: num(pit?.pitch_so),
    pitch_bb: pitBb,
    pitch_h: pitH,
    pitch_r: num(pit?.pitch_r),
    pitch_win: num(pit?.pitch_win),
    pitch_loss: num(pit?.pitch_loss),
    pitch_save: num(pit?.pitch_save),
    pitch_appear: num(pit?.pitch_appear),
    pitch_cg: num(pit?.pitch_cg),
    pitch_sho: num(pit?.pitch_sho),
    pitch_bf: num(pit?.pitch_bf),
    pitch_hr: num(pit?.pitch_hr),
    pitch_hbp: num(pit?.pitch_hbp),
    pitch_ibb: num(pit?.pitch_ibb),
    pitch_wp: num(pit?.pitch_wp),
    pitch_bk: num(pit?.pitch_bk),
    era: pit?.era != null ? Number(Number(pit.era).toFixed(2)) : null,
    whip: pitIp > 0 ? Number(((pitBb + pitH) / pitIp).toFixed(2)) : null,
  }
}

export async function fetchPlayerPhotos(playerName: string): Promise<PlayerPhotos> {
  const { data } = await supabase
    .from('player_photos')
    .select('banner_url, headshot_url, banner_focal_x, banner_focal_y')
    .ilike('player_name', playerName)
    .maybeSingle()
  return data ?? null
}
