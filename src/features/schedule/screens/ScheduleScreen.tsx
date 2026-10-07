import { getSchedule } from '@/features/schedule/api/getSchedule'
import { GameCard } from '@/features/schedule/components/GameCard'

export default async function ScheduleScreen() {
  const { games, standingsMap } = await getSchedule()

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <div>
        <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-sm mb-1">
          Season 2026
        </p>
        <h1 className="font-display font-800 italic text-5xl uppercase tracking-tight text-white">
          <strong>Schedule</strong>
        </h1>
      </div>

      {games.length === 0 ? (
        <p className="font-display font-700 text-[var(--muted)] text-xl uppercase">
          No games scheduled
        </p>
      ) : (
        <div className="space-y-2">
          {games.map((g) => (
            <GameCard key={g.id} game={g} standingsMap={standingsMap} />
          ))}
        </div>
      )}
    </div>
  )
}
