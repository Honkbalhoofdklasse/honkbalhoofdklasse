import { TEAM_NAMES } from '@/shared/teams/teams'
import type { Game } from '@/features/social/api/getLivestreamData'
import { TeamLogo } from '@/shared/ui/TeamLogo'
import { WEEKDAY_DAY_MONTH, formatGameDate } from '@/shared/dates/gameDate'

export function GamesWithoutStreamSection({ gamesWithoutStream }: { gamesWithoutStream: Game[] }) {
  return (
    <section>
      <h2 className="font-display font-800 italic text-2xl uppercase text-white mb-2">
        <strong>Upcoming Games</strong>
      </h2>
      <p className="font-display font-700 text-[var(--muted)] text-sm uppercase tracking-wider mb-4">
        No stream announced yet — follow us for updates
      </p>
      <div className="space-y-2">
        {gamesWithoutStream.slice(0, 8).map((g) => (
          <div
            key={g.id}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden opacity-70"
          >
            <div className="px-4 pt-3 pb-3">
              <div className="flex items-center justify-between mb-3">
                <p className="font-display font-800 text-sm uppercase text-white leading-none">
                  {formatGameDate(g.game_date, WEEKDAY_DAY_MONTH)}
                  {g.game_time && (
                    <span className="text-[var(--muted)] ml-2">{g.game_time.slice(0, 5)}</span>
                  )}
                </p>
                <p className="font-display font-700 text-xs text-[var(--muted)] uppercase tracking-widest">
                  Upcoming
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                  <p className="font-display font-800 text-base md:text-xl uppercase text-white text-right leading-none truncate">
                    <strong>{TEAM_NAMES[g.away_team_id] ?? g.away_team_id}</strong>
                  </p>
                  <TeamLogo teamId={g.away_team_id} size={36} padding="p-1" />
                </div>
                <div className="shrink-0 w-10 text-center">
                  <p className="font-display font-800 italic text-base text-[var(--muted)]">VS</p>
                </div>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <TeamLogo teamId={g.home_team_id} size={36} padding="p-1" />
                  <p className="font-display font-800 text-base md:text-xl uppercase text-white leading-none truncate">
                    <strong>{TEAM_NAMES[g.home_team_id] ?? g.home_team_id}</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
