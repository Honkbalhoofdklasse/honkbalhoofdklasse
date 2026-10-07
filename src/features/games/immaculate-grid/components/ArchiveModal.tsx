'use client'

import { getFridayDate } from '../domain/grid-data'
import { saveKey } from '../domain/grid-storage'
import type { SavedState } from '../domain/types'

export function ArchiveModal({
  currentWeek,
  selectedWeek,
  onSelect,
  onClose,
}: {
  currentWeek: number
  selectedWeek: number
  onSelect: (week: number) => void
  onClose: () => void
}) {
  // Build list of all past weeks (newest first, excluding current)
  const weeks = Array.from({ length: currentWeek }, (_, i) => currentWeek - 1 - i)

  function getScore(week: number): number | null {
    try {
      const raw = localStorage.getItem(saveKey(week))
      if (!raw) return null
      const s = JSON.parse(raw) as SavedState
      return s.cells.filter((c) => c.state === 'correct').length
    } catch {
      return null
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xs bg-[#0a1220] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        style={{ maxHeight: '80vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between shrink-0">
          <p className="font-display font-800 text-sm uppercase text-white tracking-widest">
            Grid Archive
          </p>
          <button onClick={onClose} className="text-white/60 hover:text-white text-xl leading-none">
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-2">
          {weeks.length === 0 && (
            <p className="px-4 py-8 text-center font-display font-700 text-xs text-[var(--muted)] uppercase tracking-widest">
              No previous grids yet
            </p>
          )}
          {weeks.map((week) => {
            const score = getScore(week)
            const date = getFridayDate(week).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
            const isActive = week === selectedWeek

            return (
              <button
                key={week}
                onClick={() => {
                  onSelect(week)
                  onClose()
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-[var(--accent)]/20 border border-[var(--accent)]/30' : 'hover:bg-[var(--card-hover)]'}`}
              >
                <div className="text-left">
                  <p className="font-display font-800 text-sm uppercase text-white">
                    Grid #{week + 1}
                  </p>
                  <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest">
                    {date}
                  </p>
                </div>
                {score !== null ? (
                  <span
                    className="font-display font-800 text-sm"
                    style={{
                      color:
                        score === 9 ? '#22c55e' : score >= 6 ? '#f59e0b' : 'rgba(255,255,255,0.45)',
                    }}
                  >
                    {score}/9
                  </span>
                ) : (
                  <span className="font-display font-700 text-[10px] text-[var(--accent)] uppercase tracking-widest">
                    Play →
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
