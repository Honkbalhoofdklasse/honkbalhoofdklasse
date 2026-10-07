'use client'

import NotifyButton from '@/shared/ui/NotifyButton'
import { getDayDate } from '../domain/pickle-days'

export function PickleHeader({
  activeDayNum,
  currentDayNum,
  isViewingArchive,
  remaining,
  onOpenArchive,
  onDayChange,
}: {
  activeDayNum: number
  currentDayNum: number
  isViewingArchive: boolean
  remaining: number
  onOpenArchive: () => void
  onDayChange: (n: number) => void
}) {
  return (
    <div className="mb-5">
      <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-xs mb-2">
        Pickle #{activeDayNum + 1} ·{' '}
        {getDayDate(activeDayNum).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
      <h1 className="font-display font-800 italic text-4xl md:text-5xl uppercase tracking-tight text-white mb-3">
        <strong>Hoofdklasse</strong>
        <span className="text-[var(--accent)]"> Pickle</span>
      </h1>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenArchive}
            className="font-display font-700 text-xs text-white/60 hover:text-white uppercase tracking-wider transition-colors border border-white/20 hover:border-white/40 rounded-lg px-2.5 py-1.5"
          >
            Archive ▾
          </button>
          {isViewingArchive && (
            <button
              onClick={() => onDayChange(currentDayNum)}
              className="font-display font-700 text-xs text-white/60 hover:text-white uppercase tracking-wider transition-colors"
            >
              ← Today&apos;s Puzzle
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest">
              Guesses left
            </p>
            <p
              className={`font-display font-800 text-3xl ${remaining <= 3 ? 'text-[var(--accent)]' : 'text-white'}`}
            >
              {remaining}
            </p>
          </div>
          <NotifyButton tooltip="Get an email when a new Pickle drops (Thu & Sat)." />
        </div>
      </div>
    </div>
  )
}
