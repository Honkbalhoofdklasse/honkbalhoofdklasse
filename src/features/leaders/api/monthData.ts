import { supabaseAdmin } from '@/shared/supabase/legacy'
import type { TabData } from '../domain/types'
import { KNBSB_NUMERIC_ID_MAP } from '@/shared/teams/teams'
import { ipToOuts } from '../domain/innings'
import { qualifiedAtBats } from '../domain/qualification'

function outsToIp(outs: number): string {
  return `${Math.floor(outs / 3)}.${outs % 3}`
}

function r3(n: number): number {
  return Math.round(n * 1000) / 1000
}

const KNBSB_ID_TO_TEAM = KNBSB_NUMERIC_ID_MAP

async function getTeamGamesInMonth(prefix: string): Promise<Record<string, number>> {
  try {
    const res = await fetch(
      'https://boxscore.stenwessel.nl/api/fetchschedule.php?competition=hb2026',
      { cache: 'no-store' },
    )
    const json = await res.json()
    const games: Array<{ start?: string; gamestatus?: number; homeid?: number; awayid?: number }> =
      json?.games ?? []
    const counts: Record<string, number> = {}
    for (const g of games) {
      if (!g.start?.startsWith(prefix)) continue
      if (g.gamestatus !== 2 && g.gamestatus !== 3) continue
      const home = g.homeid ? KNBSB_ID_TO_TEAM[g.homeid] : null
      const away = g.awayid ? KNBSB_ID_TO_TEAM[g.awayid] : null
      if (home) counts[home] = (counts[home] ?? 0) + 1
      if (away) counts[away] = (counts[away] ?? 0) + 1
    }
    return counts
  } catch {
    const fallback = 8
    return Object.fromEntries(Object.values(KNBSB_ID_TO_TEAM).map((t) => [t, fallback]))
  }
}

export async function getMonthData(monthPrefix?: string): Promise<TabData> {
  try {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const prefix = monthPrefix ?? `${year}-${String(month).padStart(2, '0')}`
    const [prefixYear, prefixMonth] = prefix.split('-').map(Number)
    const nextMonth = prefixMonth === 12 ? 1 : prefixMonth + 1
    const nextYear = prefixMonth === 12 ? prefixYear + 1 : prefixYear
    const nextPrefix = `${nextYear}-${String(nextMonth).padStart(2, '0')}`

    const [{ data: batRows }, { data: pitRows }, teamGames] = await Promise.all([
      supabaseAdmin
        .from('batting_stats')
        .select('full_name, team_id, at_bats, hits, home_runs, rbi, stolen_bases, obp')
        .eq('season', year)
        .neq('series_week', 'season')
        .gte('series_week', `${prefix}-01`)
        .lt('series_week', `${nextPrefix}-01`),
      supabaseAdmin
        .from('pitching_stats')
        .select(
          'full_name, team_id, innings_pitched, strikeouts, wins, saves, hits_allowed, walks, earned_runs',
        )
        .eq('season', year)
        .neq('series_week', 'season')
        .gte('series_week', `${prefix}-01`)
        .lt('series_week', `${nextPrefix}-01`),
      getTeamGamesInMonth(prefix),
    ])

    const normKey = (name: string, team: string) => {
      const w = String(name ?? '')
        .toLowerCase()
        .trim()
        .split(/\s+/)
      return `${w[0]}|${w[w.length - 1]}|${String(team ?? '').toLowerCase()}`
    }

    const batMap = new Map<
      string,
      {
        full_name: string
        team_id: string
        at_bats: number
        hits: number
        home_runs: number
        rbi: number
        stolen_bases: number
        obpSum: number
        obpWeight: number
      }
    >()
    for (const r of batRows ?? []) {
      const key = normKey(r.full_name, r.team_id)
      const e = batMap.get(key) ?? {
        full_name: r.full_name,
        team_id: r.team_id,
        at_bats: 0,
        hits: 0,
        home_runs: 0,
        rbi: 0,
        stolen_bases: 0,
        obpSum: 0,
        obpWeight: 0,
      }
      e.at_bats += r.at_bats ?? 0
      e.hits += r.hits ?? 0
      e.home_runs += r.home_runs ?? 0
      e.rbi += r.rbi ?? 0
      e.stolen_bases += r.stolen_bases ?? 0
      if (r.obp && r.at_bats) {
        e.obpSum += Number(r.obp) * r.at_bats
        e.obpWeight += r.at_bats
      }
      batMap.set(key, e)
    }
    const allBatters = [...batMap.values()]
      .filter((p) => p.at_bats >= 1)
      .map((p) => ({
        ...p,
        avg: p.at_bats > 0 ? p.hits / p.at_bats : null,
        obp: p.obpWeight > 0 ? r3(p.obpSum / p.obpWeight) : null,
        slg: null,
        ops: null,
      }))
      .sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0)) as Record<string, unknown>[]

    const battingQualified = allBatters.filter((p) => {
      const g = teamGames[p.team_id as string] ?? 8
      return (p.at_bats as number) >= qualifiedAtBats(g)
    }) as Record<string, unknown>[]

    const pitMap = new Map<
      string,
      {
        full_name: string
        team_id: string
        outs: number
        strikeouts: number
        wins: number
        saves: number
        hits_allowed: number
        walks: number
        earned_runs: number
      }
    >()
    for (const r of pitRows ?? []) {
      const key = normKey(r.full_name, r.team_id)
      const e = pitMap.get(key) ?? {
        full_name: r.full_name,
        team_id: r.team_id,
        outs: 0,
        strikeouts: 0,
        wins: 0,
        saves: 0,
        hits_allowed: 0,
        walks: 0,
        earned_runs: 0,
      }
      e.outs += ipToOuts(r.innings_pitched)
      e.strikeouts += r.strikeouts ?? 0
      e.wins += r.wins ?? 0
      e.saves += r.saves ?? 0
      e.hits_allowed += r.hits_allowed ?? 0
      e.walks += r.walks ?? 0
      e.earned_runs += r.earned_runs ?? 0
      pitMap.set(key, e)
    }
    const pitchers = [...pitMap.values()]
      .filter((p) => {
        const g = teamGames[p.team_id] ?? 8
        return p.outs >= Math.max(3, g * 3)
      })
      .map(({ outs, ...rest }) => ({ ...rest, innings_pitched: outsToIp(outs) }))
      .sort((a, b) => b.strikeouts - a.strikeouts) as Record<string, unknown>[]

    return { batters: allBatters, battingQualified, pitchers }
  } catch {
    return { batters: [], pitchers: [] }
  }
}
