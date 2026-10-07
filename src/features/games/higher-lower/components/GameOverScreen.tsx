'use client'

import type { STATS } from '../domain/stats'
import type { HLPlayer, StatKey } from '../domain/types'

export function GameOverScreen({
  score,
  highScore,
  left,
  right,
  stat,
  statKey,
  onRestart,
  onShare,
}: {
  score: number
  highScore: number
  left: HLPlayer | undefined
  right: HLPlayer | undefined
  stat: (typeof STATS)[number]
  statKey: StatKey
  onRestart: () => void
  onShare: () => void
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-8 text-center px-4 pt-20">
      <div>
        <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-xs mb-3">
          Honkbal Hoofdklasse
        </p>
        <h1 className="font-display font-800 italic text-4xl uppercase text-white mb-1">
          Higher <span className="text-[var(--accent)]">Lower</span>
        </h1>
        <p className="font-display font-700 text-[var(--muted)] uppercase tracking-widest text-xs">
          Game Over
        </p>
      </div>
      <div>
        <p className="font-display font-800 italic text-8xl text-white leading-none">{score}</p>
        <p className="font-display font-700 text-[var(--muted)] text-sm mt-2">
          {score > 0 && score >= highScore ? '🎉 New high score!' : `Best: ${highScore}`}
        </p>
      </div>
      {left && right && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl px-6 py-4 max-w-sm w-full">
          <p className="font-display font-700 text-[9px] uppercase tracking-widest text-[var(--muted)]/60 mb-3">
            {stat.label}
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-display font-700 text-sm text-white/80">{left.name}</span>
              <span className="font-display font-800 text-sm text-[var(--accent)]">
                {stat.fmt(left[statKey] as number)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-display font-700 text-sm text-white/80">{right.name}</span>
              <span className="font-display font-800 text-sm text-[var(--accent)]">
                {stat.fmt(right[statKey] as number)}
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="flex gap-3">
        <button
          onClick={onRestart}
          className="font-display font-800 text-sm uppercase tracking-wider bg-[var(--accent)] text-white px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity"
        >
          Play Again
        </button>
        <button
          onClick={onShare}
          className="font-display font-800 text-sm uppercase tracking-wider border border-[var(--border)] text-white/70 px-8 py-4 rounded-2xl hover:text-white hover:border-white/40 transition-colors"
        >
          Share
        </button>
      </div>
    </div>
  )
}
