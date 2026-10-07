'use client'

import { MAX_GUESSES } from '../domain/constants'
import { getDayDate } from '../domain/pickle-days'
import { loadDay } from '../domain/pickle-storage'
import type { SavedState } from '../domain/types'

export function ArchiveModal({
  currentDayNum,
  activeDayNum,
  onSelect,
  onClose,
}: {
  currentDayNum: number
  activeDayNum: number
  onSelect: (n: number) => void
  onClose: () => void
}) {
  const entries: Array<{ n: number; save: SavedState; label: string; dow: string; num: number }> =
    []
  for (let n = currentDayNum; n >= 0; n--) {
    const date = getDayDate(n)
    const save = loadDay(n)
    entries.push({
      n,
      save,
      dow: date.getDay() === 4 ? 'Thursday' : 'Saturday',
      label: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      num: n + 1,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl mt-24 mx-4 w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="font-display font-800 text-lg uppercase tracking-wide text-white">
            Previous Puzzles
          </h2>
          <button onClick={onClose} className="text-white/50 hover:text-white text-xl leading-none">
            ✕
          </button>
        </div>
        <div className="overflow-y-auto max-h-[60vh]">
          {entries.map(({ n, save, label, dow, num }) => {
            const played = save.guesses.length > 0
            const isActive = n === activeDayNum
            return (
              <button
                key={n}
                onClick={() => {
                  onSelect(n)
                  onClose()
                }}
                className={`w-full flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] last:border-0 transition-colors text-left ${isActive ? 'bg-[var(--accent)]/15' : 'hover:bg-[var(--card-hover)]'}`}
              >
                <div>
                  <p
                    className={`font-display font-800 text-sm uppercase tracking-wide ${isActive ? 'text-[var(--accent)]' : 'text-white'}`}
                  >
                    Pickle #{num}
                    {n === currentDayNum ? ' (Today)' : ''}
                  </p>
                  <p className="font-display font-700 text-[11px] text-white/40 uppercase tracking-wider mt-0.5">
                    {dow}, {label}
                  </p>
                  {played && (
                    <p
                      className={`font-display font-700 text-xs uppercase tracking-wider mt-0.5 ${save.won ? 'text-green-400' : save.lost ? 'text-red-400' : 'text-yellow-400'}`}
                    >
                      {save.won
                        ? `Won · ${save.guesses.length}/${MAX_GUESSES}`
                        : save.lost
                          ? 'Lost'
                          : `In progress · ${save.guesses.length}/${MAX_GUESSES}`}
                    </p>
                  )}
                </div>
                <span
                  className={`font-display font-700 text-xs uppercase tracking-widest shrink-0 ml-4 ${
                    played
                      ? save.won
                        ? 'text-green-400'
                        : save.lost
                          ? 'text-red-400'
                          : 'text-yellow-400'
                      : 'text-[var(--accent)]'
                  }`}
                >
                  {played ? (save.won ? '✓' : save.lost ? '✗' : '…') : 'Play →'}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
