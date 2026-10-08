import type { KnbsbCategory, SeasonLeaders } from '../domain/types'

function buildOpsCategory(batting: KnbsbCategory[]): KnbsbCategory | null {
  const num = (v: unknown) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : 0
  }
  const pool = new Map<unknown, Record<string, unknown>>()
  for (const cat of batting) {
    if (!['avg', 'slg', 'obp'].includes(cat.type)) continue
    for (const r of cat.data) if (!pool.has(r.id)) pool.set(r.id, r)
  }
  if (pool.size === 0) return null

  const fmtOps = (n: number) => n.toFixed(3).replace(/^0\./, '.')
  const rows = [...pool.values()]
    .map((r) => {
      const ab = num(r.ab),
        h = num(r.h)
      const tb = h + num(r.double) + 2 * num(r.triple) + 3 * num(r.hr)
      const obpDenom = ab + num(r.bb) + num(r.hbp) + num(r.sf)
      const slg = ab > 0 ? tb / ab : 0
      const obp = obpDenom > 0 ? (h + num(r.bb) + num(r.hbp)) / obpDenom : 0
      return { ...r, opsValue: obp + slg }
    })
    .sort((a, b) => b.opsValue - a.opsValue)
    .slice(0, 10)

  let lastRank = 0,
    lastOps = -1
  const data = rows.map((r, i) => {
    const rounded = Math.round(r.opsValue * 1000)
    const isTie = i > 0 && rounded === lastOps
    if (!isTie) {
      lastRank = i + 1
      lastOps = rounded
    }
    return { ...r, position: isTie ? '-' : lastRank, ops: fmtOps(r.opsValue) }
  })

  return { type: 'ops', label: 'OPS (min 2.7 PA/G)', data }
}

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8',
  Origin: 'https://stats.knbsbstats.nl',
}

export async function getSeasonLeaders(): Promise<SeasonLeaders> {
  try {
    const [batRes, pitRes] = await Promise.all([
      fetch(
        'https://stats.knbsbstats.nl/api/v1/stats/events/2026-lucky-day-hoofdklasse/index?section=leaders&stats-section=batting&round=&team=&split=&language=en',
        {
          headers: {
            ...BROWSER_HEADERS,
            Referer:
              'https://stats.knbsbstats.nl/events/2026-lucky-day-hoofdklasse/stats/leaders/batting',
          },
          cache: 'no-store',
        },
      ),
      fetch(
        'https://stats.knbsbstats.nl/api/v1/stats/events/2026-lucky-day-hoofdklasse/index?section=leaders&stats-section=pitching&round=&team=&split=&language=en',
        {
          headers: {
            ...BROWSER_HEADERS,
            Referer:
              'https://stats.knbsbstats.nl/events/2026-lucky-day-hoofdklasse/stats/leaders/pitching',
          },
          cache: 'no-store',
        },
      ),
    ])
    const batting: KnbsbCategory[] = (await batRes.json()).data ?? []
    const ops = buildOpsCategory(batting)
    if (ops) {
      const slgIdx = batting.findIndex((c) => c.type === 'slg')
      batting.splice(slgIdx >= 0 ? slgIdx + 1 : batting.length, 0, ops)
    }
    return {
      batting,
      pitching: (await pitRes.json()).data ?? [],
    }
  } catch {
    return { batting: [], pitching: [] }
  }
}
