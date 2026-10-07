'use client'

import { fmtDate } from '../domain/pick-em-rules'
import type { Game } from '../domain/types'
import { GameCard } from './GameCard'

export function WeekSection({
  week,
  weekGames,
  isCurrentWeek,
  picks,
  saving,
  onPick,
}: {
  week: string
  weekGames: Game[]
  isCurrentWeek: boolean
  picks: Map<number, string>
  saving: number | null
  onPick: (gameId: number, teamId: string) => void
}) {
  const dates = [...new Set(weekGames.map((g) => g.game_date))].sort()

  return (
    <div key={week}>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-1 h-5 bg-[var(--accent)] shrink-0" />
        <h2 className="font-display font-800 text-sm uppercase text-white tracking-wide">
          {isCurrentWeek ? 'Huidige ronde' : `Week ${week}`}
        </h2>
        {(() => {
          const total = weekGames.length
          const done = weekGames.filter((g) => picks.has(g.id)).length
          if (done === 0) return null
          return (
            <span
              className={`font-display font-700 text-xs uppercase tracking-wider ${done === total ? 'text-green-400' : 'text-[var(--accent)]'}`}
            >
              {done}/{total} ingevuld
            </span>
          )
        })()}
      </div>

      {dates.map((date) => (
        <div key={date} className="mb-4">
          <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mb-2 pl-1">
            {fmtDate(date)}
          </p>
          <div className="space-y-2">
            {weekGames
              .filter((g) => g.game_date === date)
              .map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  myPick={picks.get(game.id)}
                  saving={saving}
                  onPick={onPick}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
