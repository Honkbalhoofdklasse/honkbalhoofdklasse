import Link from 'next/link'
import HeroSlideshow from '@/features/home/components/HeroSlideshow'
import HomeRecentResults from '@/features/home/components/HomeRecentResults'
import { getData } from '@/features/home/api/getHomeData'
import { SectionLabel } from '@/features/home/components/SectionLabel'
import { NewsTicker } from '@/features/home/components/NewsTicker'
import { NotificationsPromo } from '@/features/home/components/NotificationsPromo'
import { HomeStandings } from '@/features/home/components/HomeStandings'
import { UpcomingGames } from '@/features/home/components/UpcomingGames'
import { MiniLeaders } from '@/features/home/components/MiniLeaders'
import { MediaGrid } from '@/features/home/components/MediaGrid'
import { LeaderCallout } from '@/features/home/components/LeaderCallout'

export default async function HomeScreen() {
  const { standings, results, upcoming, media, news, leaders } = await getData()
  const nextGame = upcoming[0]
  const leader = standings[0]
  const standingsMap = Object.fromEntries(standings.map((s) => [s.team_id, s]))

  return (
    <div>
      <HeroSlideshow />

      {news.length > 0 && <NewsTicker news={news} />}

      {results.length > 0 && (
        <section className="bg-[#04080f] pt-20 pb-14 px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <SectionLabel>Recent Results</SectionLabel>
              <Link
                href="/uitslagen"
                className="font-display font-800 text-xs text-[var(--accent)] uppercase tracking-[0.2em] hover:underline hidden sm:block"
              >
                All results →
              </Link>
            </div>

            <HomeRecentResults results={results} standingsMap={standingsMap} />
          </div>
        </section>
      )}

      <NotificationsPromo />

      <section className="py-14 px-6 md:px-12 border-t border-[#0f1e2e]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-6 gap-8">
          <HomeStandings standings={standings} />

          <UpcomingGames upcoming={upcoming} standingsMap={standingsMap} />

          <MiniLeaders leaders={leaders} />
        </div>
      </section>

      {media.length > 0 && <MediaGrid media={media} />}

      {leader && <LeaderCallout leader={leader} />}

      <div className="h-1" />
    </div>
  )
}
