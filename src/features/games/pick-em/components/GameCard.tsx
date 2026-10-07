'use client'

import { fmtTime, getWinner, isLocked } from '../domain/pick-em-rules'
import type { Game } from '../domain/types'
import { TeamButton } from './TeamButton'

export function GameCard({
  game,
  myPick,
  saving,
  onPick,
}: {
  game: Game
  myPick: string | undefined
  saving: number | null
  onPick: (gameId: number, teamId: string) => void
}) {
  const locked = isLocked(game)
  const winner = getWinner(game)
  const isSaving = saving === game.id
  const isFinal = game.status === 'final'
  const isCorrect = isFinal && myPick && winner === myPick
  const isWrong = isFinal && myPick && winner && winner !== myPick

  return (
    <div
      key={game.id}
      className={`border rounded-2xl overflow-hidden transition-colors ${
        isCorrect
          ? 'border-green-500/40 bg-green-500/5'
          : isWrong
            ? 'border-red-500/20 bg-red-500/5'
            : myPick
              ? 'border-[var(--accent)]/40 bg-[var(--accent)]/5'
              : 'border-[#1a2a3a] bg-[#0a1220]'
      }`}
    >
      {/* Game time + status */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest">
          {fmtTime(game.game_time)}
        </span>
        <span
          className={`font-display font-700 text-[10px] uppercase tracking-widest ${
            game.status === 'live' ? 'text-[var(--accent)]' : isFinal ? 'text-[var(--muted)]' : ''
          }`}
        >
          {game.status === 'live'
            ? '● Live'
            : isFinal
              ? 'Gespeeld'
              : locked
                ? 'Gesloten'
                : isCorrect !== undefined && myPick
                  ? '✓ Ingevuld'
                  : ''}
        </span>
      </div>

      {/* Teams row */}
      <div className="flex items-stretch px-3 pb-3 gap-2">
        {/* Away team */}
        <TeamButton
          teamId={game.away_team_id}
          picked={myPick === game.away_team_id}
          winner={winner === game.away_team_id}
          locked={locked}
          isFinal={isFinal}
          isSaving={isSaving}
          score={isFinal ? game.away_score : null}
          onClick={() => onPick(game.id, game.away_team_id)}
        />

        {/* VS */}
        <div className="flex items-center justify-center px-1 shrink-0">
          <span className="font-display font-800 text-xs text-[var(--muted)]">VS</span>
        </div>

        {/* Home team */}
        <TeamButton
          teamId={game.home_team_id}
          picked={myPick === game.home_team_id}
          winner={winner === game.home_team_id}
          locked={locked}
          isFinal={isFinal}
          isSaving={isSaving}
          score={isFinal ? game.home_score : null}
          onClick={() => onPick(game.id, game.home_team_id)}
        />
      </div>

      {/* Result feedback */}
      {isFinal && myPick && (
        <div
          className={`px-4 py-2 text-center border-t ${isCorrect ? 'border-green-500/20 bg-green-500/10' : 'border-red-500/20 bg-red-500/10'}`}
        >
          <p
            className={`font-display font-800 text-xs uppercase tracking-widest ${isCorrect ? 'text-green-400' : 'text-red-400'}`}
          >
            {isCorrect ? '✓ Goed voorspeld!' : '✗ Helaas, fout voorspeld'}
          </p>
        </div>
      )}
    </div>
  )
}
