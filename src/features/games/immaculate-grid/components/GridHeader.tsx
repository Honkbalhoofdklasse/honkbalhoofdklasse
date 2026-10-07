'use client'

import NotifyButton from '@/shared/ui/NotifyButton'
import { CURRENT_FRIDAY_NUM } from '../domain/constants'

export function GridHeader({
  gridDate,
  isArchive,
  selectedWeek,
  score,
  guessesLeft,
  onOpenArchive,
  onWeekChange,
}: {
  gridDate: Date
  isArchive: boolean
  selectedWeek: number
  score: number
  guessesLeft: number
  onOpenArchive: () => void
  onWeekChange: (week: number) => void
}) {
  return (
    <div className="flex items-end justify-between mb-4 flex-wrap gap-4">
      <div>
        <div className="flex items-center gap-3 mb-1 flex-wrap">
          <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-sm">
            {gridDate.toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}{' '}
            · Season 2026
          </p>
          <span className="text-white/20 text-sm">·</span>
          <button
            onClick={onOpenArchive}
            className="font-display font-700 text-xs text-white/50 hover:text-white uppercase tracking-widest transition-colors"
          >
            Previous Grids ▾
          </button>
          {isArchive && (
            <>
              <span className="text-white/20 text-sm">·</span>
              <button
                onClick={() => onWeekChange(CURRENT_FRIDAY_NUM)}
                className="font-display font-700 text-xs text-[var(--accent)] hover:text-white uppercase tracking-widest transition-colors"
              >
                ← Current Grid
              </button>
            </>
          )}
        </div>
        <h1 className="font-display font-800 italic text-5xl uppercase tracking-tight text-white">
          {isArchive ? (
            <>
              <strong>Grid</strong>
              <span className="text-[var(--accent)]"> #{selectedWeek + 1}</span>
            </>
          ) : (
            <>
              <strong>Immaculate</strong>
              <span className="text-[var(--accent)]"> Grid</span>
            </>
          )}
        </h1>
        <p className="font-display font-700 text-[var(--muted)] text-sm mt-1 uppercase tracking-wider">
          Name a Hoofdklasse 2026 player matching both criteria
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest">
            Score
          </p>
          <p className="font-display font-800 text-4xl text-white">
            {score}
            <span className="text-[var(--muted)] text-xl">/9</span>
          </p>
        </div>
        <div className="h-12 w-px bg-[var(--border)]" />
        <div className="text-center">
          <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest">
            Guesses left
          </p>
          <p
            className={`font-display font-800 text-4xl ${guessesLeft <= 3 ? 'text-[var(--accent)]' : 'text-white'}`}
          >
            {guessesLeft}
          </p>
        </div>
        <div className="h-12 w-px bg-[var(--border)]" />
        <NotifyButton tooltip="Get an email when a new Immaculate Grid drops every Friday." />
      </div>
    </div>
  )
}
