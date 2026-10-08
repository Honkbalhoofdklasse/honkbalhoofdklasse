import { TEAM_SHORT } from '@/shared/teams/teams'
import type { HomeData } from '@/features/home/api/getHomeData'
import { TeamLogo } from '@/shared/ui/TeamLogo'
import { SectionLabel } from '@/features/home/components/SectionLabel'
import { DAY_MONTH, formatGameDate } from '@/shared/dates/gameDate'

export function UpcomingGames({
  upcoming,
  standingsMap,
}: {
  upcoming: HomeData['upcoming']
  standingsMap: Record<string, HomeData['standings'][number]>
}) {
  return (
    <div className="lg:col-span-2 flex flex-col gap-3">
      <SectionLabel>Upcoming</SectionLabel>
      {upcoming.map((g) => (
        <div
          key={g.id}
          className="relative overflow-hidden border border-[var(--accent)]/40 bg-[#0f1e2e]"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--accent)]" />
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-display font-700 text-xs text-[#4a6a8a] uppercase tracking-widest">
                {formatGameDate(g.game_date, DAY_MONTH)}
                {g.game_time ? ` · ${g.game_time.slice(0, 5)}` : ''}
              </p>
              {g.venue && (
                <p className="font-display font-700 text-[10px] text-[#4a6a8a] uppercase tracking-widest truncate max-w-[45%] text-right">
                  {g.venue}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-center gap-1 flex-1">
                <TeamLogo teamId={g.away_team_id} size={36} useShortName />
                <span className="font-display font-800 text-[11px] uppercase text-white text-center">
                  {TEAM_SHORT[g.away_team_id]}
                </span>
                {standingsMap[g.away_team_id] && (
                  <span className="font-display font-600 text-[10px] text-[#4a6a8a] text-center">
                    {standingsMap[g.away_team_id].wins}-{standingsMap[g.away_team_id].losses}
                  </span>
                )}
              </div>
              <div className="text-center px-1">
                <p className="font-display font-800 italic text-lg text-[#4a6a8a]">VS</p>
              </div>
              <div className="flex flex-col items-center gap-1 flex-1">
                <TeamLogo teamId={g.home_team_id} size={36} useShortName />
                <span className="font-display font-800 text-[11px] uppercase text-white text-center">
                  {TEAM_SHORT[g.home_team_id]}
                </span>
                {standingsMap[g.home_team_id] && (
                  <span className="font-display font-600 text-[10px] text-[#4a6a8a] text-center">
                    {standingsMap[g.home_team_id].wins}-{standingsMap[g.home_team_id].losses}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
      {upcoming.length === 0 && (
        <div className="border border-[#0f1e2e] p-6 text-center">
          <p className="font-display font-700 text-[#4a6a8a] uppercase text-sm">
            No games scheduled
          </p>
        </div>
      )}
    </div>
  )
}
