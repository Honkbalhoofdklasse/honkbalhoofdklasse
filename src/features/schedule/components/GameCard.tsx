import PredictionWidget from '@/features/schedule/components/PredictionWidget'
import { TEAM_NAMES, TEAM_SHORT } from '@/shared/teams/teams'
import type { Game, StandingsEntry } from '@/features/schedule/api/getSchedule'
import { TeamLogo } from '@/features/schedule/components/TeamLogo'

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function GameCard({
  game,
  standingsMap,
}: {
  game: Game
  standingsMap: Record<string, StandingsEntry>
}) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
      <div className="px-4 pt-3 pb-1">
        {/* Datum + tijd + locatie */}
        <div className="flex items-center justify-between mb-3">
          <p className="font-display font-800 text-sm uppercase text-white leading-none">
            {formatDate(game.game_date)}
            {game.game_time && (
              <span className="text-[var(--muted)] ml-2">{game.game_time.slice(0, 5)}</span>
            )}
          </p>
          {game.venue && (
            <p className="font-display font-700 text-xs text-[var(--muted)] truncate max-w-[40%] text-right">
              {game.venue}
            </p>
          )}
        </div>

        {/* Teams */}
        <div className="flex items-center gap-2">
          {/* Away */}
          <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
            <div className="flex flex-col items-end min-w-0 flex-1">
              <p className="font-display font-800 text-base md:text-xl uppercase text-white text-right leading-none truncate">
                <strong>
                  <span className="hidden sm:inline">
                    {TEAM_NAMES[game.away_team_id] ?? game.away_team_id}
                  </span>
                  <span className="sm:hidden">
                    {TEAM_SHORT[game.away_team_id] ?? game.away_team_id}
                  </span>
                </strong>
              </p>
              {standingsMap[game.away_team_id] && (
                <span className="font-display font-600 text-xs text-[var(--muted)]">
                  {standingsMap[game.away_team_id].wins}-{standingsMap[game.away_team_id].losses}
                </span>
              )}
            </div>
            <TeamLogo teamId={game.away_team_id} />
          </div>

          <div className="shrink-0 w-10 text-center">
            <p className="font-display font-800 italic text-base text-[var(--muted)]">VS</p>
          </div>

          {/* Home */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <TeamLogo teamId={game.home_team_id} />
            <div className="flex flex-col min-w-0 flex-1">
              <p className="font-display font-800 text-base md:text-xl uppercase text-white leading-none truncate">
                <strong>
                  <span className="hidden sm:inline">
                    {TEAM_NAMES[game.home_team_id] ?? game.home_team_id}
                  </span>
                  <span className="sm:hidden">
                    {TEAM_SHORT[game.home_team_id] ?? game.home_team_id}
                  </span>
                </strong>
              </p>
              {standingsMap[game.home_team_id] && (
                <span className="font-display font-600 text-xs text-[var(--muted)]">
                  {standingsMap[game.home_team_id].wins}-{standingsMap[game.home_team_id].losses}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-3">
        <PredictionWidget
          gameId={game.id}
          homeTeamId={game.home_team_id}
          awayTeamId={game.away_team_id}
        />
      </div>
    </div>
  )
}
