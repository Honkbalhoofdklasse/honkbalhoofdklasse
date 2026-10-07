import { TEAM_NAMES, TEAM_SHORT } from '@/shared/teams/teams'
import { formatDate } from '../domain/format'
import type { Game, StandingsEntry } from '../domain/types'
import TeamLogo from './TeamLogo'

export default function ResultCard({
  game,
  standingsMap,
  onClick,
}: {
  game: Game
  standingsMap: Record<string, StandingsEntry>
  onClick: () => void
}) {
  const homeWon =
    game.home_score !== null && game.away_score !== null && game.home_score > game.away_score
  const awayWon =
    game.home_score !== null && game.away_score !== null && game.away_score > game.home_score

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 hover:border-[var(--accent)]/50 hover:bg-[var(--card-hover)] transition-all cursor-pointer group"
    >
      <div className="flex items-center justify-between mb-2.5">
        <p className="font-display font-800 text-sm uppercase text-white leading-none">
          {formatDate(game.game_date)}
        </p>
        <p className="font-display font-700 text-xs text-[var(--muted)] uppercase tracking-widest group-hover:text-[var(--accent)] transition-colors">
          Boxscore →
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div
          className={`flex items-center gap-2 flex-1 min-w-0 justify-end ${awayWon ? '' : 'opacity-50'}`}
        >
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

        <div className="shrink-0 w-14 text-center">
          {game.away_score !== null && game.home_score !== null ? (
            <p className="font-display font-800 text-xl text-white tracking-tight">
              <span className={awayWon ? 'text-white' : 'text-[var(--muted)]'}>
                {game.away_score}
              </span>
              <span className="text-[var(--muted)] mx-0.5">–</span>
              <span className={homeWon ? 'text-white' : 'text-[var(--muted)]'}>
                {game.home_score}
              </span>
            </p>
          ) : (
            <p className="font-display font-800 text-lg text-[var(--muted)]">–</p>
          )}
        </div>

        <div className={`flex items-center gap-2 flex-1 min-w-0 ${homeWon ? '' : 'opacity-50'}`}>
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
    </button>
  )
}
