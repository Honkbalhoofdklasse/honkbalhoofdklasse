import { supabase } from '@/shared/supabase/legacy'
import { KNBSB_TEAM_MAP } from '@/shared/teams/teams'

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8230;/g, '…')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, ' ')
}

export type NewsItem = { title: string; link: string }
export type LeaderEntry = { name: string; team: string; value: string }
export type MiniLeaders = { batters: LeaderEntry[]; pitchers: LeaderEntry[] }

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'nl-NL,nl;q=0.9',
  Origin: 'https://stats.knbsbstats.nl',
}

async function getNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(
      'https://honkbalsoftbal.nl/wp-json/wp/v2/posts?categories=544&per_page=3&_fields=title,link',
      { next: { revalidate: 1800 } },
    )
    const data = await res.json()
    return (data as { title: { rendered: string }; link: string }[]).map((p) => ({
      title: decodeHtmlEntities(p.title.rendered),
      link: p.link,
    }))
  } catch {
    return []
  }
}

async function getMiniLeaders(): Promise<MiniLeaders> {
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
          next: { revalidate: 300 },
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
          next: { revalidate: 300 },
        },
      ),
    ])
    const batData = (await batRes.json()).data ?? []
    const pitData = (await pitRes.json()).data ?? []
    const avgCat = batData.find((c: { type: string }) => c.type === 'avg')?.data ?? []
    const eraCat = pitData.find((c: { type: string }) => c.type === 'era')?.data ?? []
    const toEntry = (p: Record<string, unknown>, value: string): LeaderEntry => ({
      name:
        String(p.lastname ?? '').charAt(0) +
        String(p.lastname ?? '')
          .slice(1)
          .toLowerCase(),
      team: KNBSB_TEAM_MAP[String(p.team)] ?? String(p.team),
      value,
    })
    return {
      batters: avgCat
        .slice(0, 4)
        .map((p: Record<string, unknown>) => toEntry(p, String(p.avg ?? ''))),
      pitchers: eraCat
        .slice(0, 4)
        .map((p: Record<string, unknown>) => toEntry(p, String(p.era ?? ''))),
    }
  } catch {
    return { batters: [], pitchers: [] }
  }
}

export async function getData() {
  const today = new Date().toISOString().split('T')[0]
  const [standRes, resultsRes, upcomingRes, mediaRes, news, leaders] = await Promise.all([
    supabase
      .from('standings')
      .select('*')
      .eq('season', new Date().getFullYear())
      .order('wins', { ascending: false })
      .order('win_pct', { ascending: false }),
    supabase
      .from('games')
      .select('*')
      .eq('status', 'final')
      .order('game_date', { ascending: false })
      .limit(6),
    supabase
      .from('games')
      .select('*')
      .eq('status', 'scheduled')
      .gte('game_date', today)
      .order('game_date', { ascending: true })
      .limit(3),
    supabase
      .from('media')
      .select('id,type,title,url,thumbnail_url,published_at')
      .order('published_at', { ascending: false })
      .limit(8),
    getNews(),
    getMiniLeaders(),
  ])
  return {
    standings: standRes.data ?? [],
    results: resultsRes.data ?? [],
    upcoming: upcomingRes.data ?? [],
    media: mediaRes.data ?? [],
    news,
    leaders,
  }
}

export type HomeData = Awaited<ReturnType<typeof getData>>
