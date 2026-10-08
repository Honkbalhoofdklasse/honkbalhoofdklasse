import { getData, type Stream } from '@/features/social/api/getLivestreamData'
import { LiveNowSection } from '@/features/social/components/LiveNowSection'
import { ScheduledStreamsSection } from '@/features/social/components/ScheduledStreamsSection'
import { GamesWithoutStreamSection } from '@/features/social/components/GamesWithoutStreamSection'

export default async function LivestreamScreen() {
  const { streams, upcoming } = await getData()

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const LIVE_LEAD_MS = 15 * 60 * 1000
  const LIVE_MAX_MS = 6 * 60 * 60 * 1000
  const isActuallyLive = (s: Stream) => {
    if (!s.is_live || !s.scheduled_at) return false
    const start = new Date(s.scheduled_at).getTime()
    return now.getTime() >= start - LIVE_LEAD_MS && now.getTime() < start + LIVE_MAX_MS
  }

  const liveNow = streams.filter(isActuallyLive)
  const scheduled = streams.filter((s) => {
    if (isActuallyLive(s)) return false
    if (!s.scheduled_at) return true
    return new Date(s.scheduled_at) >= startOfToday
  })

  const gamesWithoutStream = upcoming.filter((g) => !streams.find((s) => s.game_id === g.id))

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-10">
      <div>
        <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-sm mb-1">
          Season 2026
        </p>
        <h1 className="font-display font-800 italic text-5xl uppercase tracking-tight text-white">
          <strong>Livestream</strong>
          <span className="text-[var(--accent)]"> Hub</span>
        </h1>
        <p className="font-display font-700 text-[var(--muted)] text-sm mt-2 uppercase tracking-wider">
          All KNBSB Hoofdklasse streams in one place
        </p>
      </div>

      {liveNow.length > 0 && <LiveNowSection liveNow={liveNow} />}

      {scheduled.length > 0 && <ScheduledStreamsSection scheduled={scheduled} />}

      {gamesWithoutStream.length > 0 && (
        <GamesWithoutStreamSection gamesWithoutStream={gamesWithoutStream} />
      )}

      {streams.length === 0 && liveNow.length === 0 && (
        <div className="text-center py-20">
          <p className="font-display font-800 text-2xl uppercase text-[var(--muted)] italic">
            No streams available yet
          </p>
          <p className="font-display font-700 text-[var(--muted)] text-sm uppercase tracking-widest mt-2">
            Streams will be added here as soon as they are announced
          </p>
        </div>
      )}
    </div>
  )
}
