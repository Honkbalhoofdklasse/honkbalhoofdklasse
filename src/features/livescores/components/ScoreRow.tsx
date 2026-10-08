import { TEAM_NAMES } from '@/shared/teams/teams'
import type { LiveGame } from '../domain/types'
import type { WinLoss } from '@/shared/types/standing'
import BaseDiamond from './BaseDiamond'
import { TeamLogo } from '@/shared/ui/TeamLogo'
import { WEEKDAY_DAY_MONTH, formatGameDate } from '@/shared/dates/gameDate'

export default function ScoreRow({
  game,
  isLive = false,
  standings = {},
  onClick,
}: {
  game: LiveGame
  isLive?: boolean
  standings?: Record<string, WinLoss>
  onClick?: () => void
}) {
  const homeWon = (game.homeScore ?? 0) > (game.awayScore ?? 0)
  const awayWon = (game.awayScore ?? 0) > (game.homeScore ?? 0)
  const isFinal = game.status === 'final'
  const clickable = game.status !== 'scheduled'

  return (
    <div
      onClick={clickable ? onClick : undefined}
      className={`relative rounded-xl overflow-hidden border transition-all ${
        isLive
          ? 'border-[var(--accent)]/60 bg-[#0f1e2e]'
          : 'border-[var(--border)] bg-[var(--card)]'
      } ${clickable ? 'cursor-pointer hover:border-[var(--accent)]/60 hover:bg-[#0d1a2a]' : ''}`}
    >
      {isLive && (
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--accent)] animate-pulse" />
      )}

      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <p className="font-display font-700 text-xs text-[var(--muted)] uppercase tracking-widest">
            {formatGameDate(game.gameDate, WEEKDAY_DAY_MONTH)}
            {game.gameTime && ` · ${game.gameTime.slice(0, 5)}`}
          </p>
          <div className="flex items-center gap-2">
            {isLive && (
              <span className="flex items-center gap-1.5 bg-[var(--accent)] px-2 py-0.5 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="font-display font-800 text-[10px] text-white uppercase tracking-widest">
                  Live
                </span>
              </span>
            )}
            {isFinal && (
              <span className="font-display font-800 text-[10px] text-[var(--accent)] uppercase tracking-widest">
                Final
              </span>
            )}
            {game.status === 'scheduled' && (
              <span className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest">
                Upcoming
              </span>
            )}
            {clickable && (
              <span className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest">
                Boxscore →
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className={`flex items-center gap-2 flex-1 min-w-0 justify-end ${isFinal && !awayWon ? 'opacity-40' : ''}`}
          >
            <div className="text-right min-w-0">
              <p className="font-display font-800 text-base md:text-lg uppercase text-white leading-tight truncate">
                <strong>{TEAM_NAMES[game.awayId ?? ''] ?? game.awayId ?? '–'}</strong>
              </p>
              {game.awayId && standings[game.awayId] && (
                <p className="font-display font-600 text-[11px] text-[var(--muted)] leading-none mt-0.5">
                  {standings[game.awayId].wins}-{standings[game.awayId].losses}
                </p>
              )}
            </div>
            <TeamLogo teamId={game.awayId} size={40} />
          </div>

          <div className="shrink-0 w-16 text-center">
            {game.homeScore !== null && game.awayScore !== null ? (
              <p className="font-display font-800 text-2xl text-white tracking-tight tabular-nums">
                <span className={awayWon ? 'text-white' : isFinal ? 'text-white/40' : 'text-white'}>
                  {game.awayScore}
                </span>
                <span className="text-[var(--muted)] mx-1">–</span>
                <span className={homeWon ? 'text-white' : isFinal ? 'text-white/40' : 'text-white'}>
                  {game.homeScore}
                </span>
              </p>
            ) : (
              <p className="font-display font-800 italic text-lg text-[var(--muted)]">VS</p>
            )}
          </div>

          <div
            className={`flex items-center gap-2 flex-1 min-w-0 ${isFinal && !homeWon ? 'opacity-40' : ''}`}
          >
            <TeamLogo teamId={game.homeId} size={40} />
            <div className="min-w-0">
              <p className="font-display font-800 text-base md:text-lg uppercase text-white leading-tight truncate">
                <strong>{TEAM_NAMES[game.homeId ?? ''] ?? game.homeId ?? '–'}</strong>
              </p>
              {game.homeId && standings[game.homeId] && (
                <p className="font-display font-600 text-[11px] text-[var(--muted)] leading-none mt-0.5">
                  {standings[game.homeId].wins}-{standings[game.homeId].losses}
                </p>
              )}
            </div>
          </div>
        </div>

        {isLive && game.inning != null && (
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[var(--border)]/50">
            <span className="font-display font-800 text-xs text-[var(--accent)] uppercase tracking-widest">
              {game.isBottom ? 'Bot' : 'Top'} {game.inning}
            </span>
            <div className="flex items-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i < (game.outs ?? 0) ? 'bg-[var(--accent)]' : 'bg-[var(--border)]'}`}
                />
              ))}
              <span className="font-display font-700 text-[10px] text-[var(--muted)] uppercase ml-1">
                out
              </span>
            </div>
            <BaseDiamond
              r1={game.runner1 ?? false}
              r2={game.runner2 ?? false}
              r3={game.runner3 ?? false}
            />
          </div>
        )}
      </div>
    </div>
  )
}
