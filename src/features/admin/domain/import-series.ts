import { KNBSB_NUMERIC_ID_MAP } from '@/shared/teams/teams'

export type FinishedGame = { id: number; date: string }

function mondayOf(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`)
  const diff = (d.getUTCDay() + 6) % 7
  d.setUTCDate(d.getUTCDate() - diff)
  return d.toISOString().slice(0, 10)
}

export function clusterSeries(
  finished: FinishedGame[],
): { seriesDate: string; games: FinishedGame[] }[] {
  const sorted = [...finished].sort((a, b) => a.date.localeCompare(b.date))
  const byWeek = new Map<string, FinishedGame[]>()
  for (const g of sorted) {
    const wk = mondayOf(g.date)
    if (!byWeek.has(wk)) byWeek.set(wk, [])
    byWeek.get(wk)!.push(g)
  }
  return [...byWeek.values()]
    .map((games) => ({ seriesDate: games[0].date, games }))
    .sort((a, b) => a.seriesDate.localeCompare(b.seriesDate))
}

export const KNBSB_ID_TO_TEAM = KNBSB_NUMERIC_ID_MAP

const TUSSENVOEGSELS = new Set([
  'van',
  'de',
  'den',
  'der',
  'het',
  'op',
  'ten',
  'ter',
  't',
  'vd',
  'la',
  'le',
])

export function formatName(first: string, last: string): string {
  const firstName = first.trim().split(' ')[0]
  const lastName = last
    .trim()
    .split(' ')
    .map((w, i, arr) => {
      const lower = w.toLowerCase()
      if (i < arr.length - 1 && TUSSENVOEGSELS.has(lower)) return lower
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(' ')
  return `${firstName} ${lastName}`.trim()
}

export function ipToOuts(ip: unknown): number {
  const s = String(ip ?? '0')
  if (s.includes('.')) {
    const [full, frac] = s.split('.').map((n) => parseInt(n, 10) || 0)
    return full * 3 + Math.min(frac, 2)
  }
  return parseInt(s, 10) || 0
}

export function outsToIp(outs: number): string {
  return `${Math.floor(outs / 3)}.${outs % 3}`
}

export function r3(n: number): number {
  return Math.round(n * 1000) / 1000
}

export type Acc = {
  full_name: string
  team_id: string
  ab: number
  h: number
  r: number
  hr: number
  rbi: number
  sb: number
  doubles: number
  triples: number
  bb: number
  hbp: number
  sf: number
  pitch_outs: number
  k: number
  wins: number
  saves: number
  ha: number
  walks: number
  er: number
}
