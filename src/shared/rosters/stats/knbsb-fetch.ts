// ── KNBSB stats API (same source as /leaders page) ───────────────────────────
const KNBSB_BASE =
  'https://stats.knbsbstats.nl/api/v1/stats/events/2026-lucky-day-hoofdklasse/index'
const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'nl-NL,nl;q=0.9,en;q=0.8',
  Origin: 'https://stats.knbsbstats.nl',
}

export type Row = Record<string, unknown>
export type KnbsbCategory = { type: string; label: string; data: Row[] }

// section=players → one row per player with all stats, no minimum threshold
export async function fetchAllPlayerStats(section: 'batting' | 'pitching'): Promise<Row[]> {
  try {
    const res = await fetch(
      `${KNBSB_BASE}?section=players&stats-section=${section}&round=&team=&split=&language=en`,
      {
        headers: {
          ...BROWSER_HEADERS,
          Referer: `https://stats.knbsbstats.nl/events/2026-lucky-day-hoofdklasse/stats/players/${section}`,
        },
        next: { revalidate: 300 },
      },
    )
    if (!res.ok) return []
    const data = (await res.json()).data ?? []
    if (!Array.isArray(data) || data.length === 0) return []
    // If items have a nested 'data' array it's category structure → flatten
    if (Array.isArray((data[0] as KnbsbCategory)?.data)) {
      return (data as KnbsbCategory[]).flatMap((cat) => cat.data ?? [])
    }
    return data as Row[]
  } catch {
    return []
  }
}

// section=leaders → used by the leaders page; also a category-based fallback
export async function fetchKnbsbCategories(
  section: 'batting' | 'pitching',
): Promise<KnbsbCategory[]> {
  try {
    const res = await fetch(
      `${KNBSB_BASE}?section=leaders&stats-section=${section}&round=&team=&split=&language=en`,
      {
        headers: {
          ...BROWSER_HEADERS,
          Referer: `https://stats.knbsbstats.nl/events/2026-lucky-day-hoofdklasse/stats/leaders/${section}`,
        },
        next: { revalidate: 300 },
      },
    )
    if (!res.ok) return []
    return (await res.json()).data ?? []
  } catch {
    return []
  }
}
