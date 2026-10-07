export type FinishedGame = { id: number; date: string }

// Monday (UTC) of the ISO week containing dateStr ('YYYY-MM-DD').
function mondayOf(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`)
  const diff = (d.getUTCDay() + 6) % 7 // days since Monday (Mon=0 … Sun=6)
  d.setUTCDate(d.getUTCDate() - diff)
  return d.toISOString().slice(0, 10)
}

// Group finished games into one series per calendar week (Mon–Sun). Returns
// series sorted by date, each keyed by its earliest game date; every game
// belongs to exactly one week, so series never overlap and the keys are stable
// as more games finish (no merging). GET (the list) and POST (the import) both
// use this, so a game can never be counted under two series_week values.
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

export const KNBSB_ID_TO_TEAM: Record<number, string> = {
  39583: 'pirates',
  39587: 'neptunus',
  39584: 'hcaw',
  39586: 'kinheim',
  39588: 'twins',
  39589: 'uvv',
  39585: 'pioniers',
}

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
