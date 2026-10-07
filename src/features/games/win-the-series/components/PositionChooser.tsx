'use client'

import type { Filled, HSHitter } from '../domain/types'

export function PositionChooser({
  choosing,
  filled,
  onAssign,
  onClose,
}: {
  choosing: HSHitter
  filled: Filled
  onAssign: (player: HSHitter, slotKey: string) => void
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="font-display font-800 uppercase text-white text-lg mb-1">{choosing.name}</p>
        <p className="font-display font-700 text-xs text-[var(--muted)] uppercase tracking-widest mb-4">
          Choose a position
        </p>
        <div className="flex flex-wrap gap-2">
          {[...choosing.positions, 'DH'].map((pos) => {
            const open = !filled[pos]
            return open ? (
              <button
                key={pos}
                onClick={() => onAssign(choosing, pos)}
                className="font-display font-800 text-sm uppercase tracking-wider px-4 py-2 rounded-xl bg-[var(--accent)] text-white hover:opacity-90 transition-opacity"
              >
                {pos}
              </button>
            ) : (
              <span
                key={pos}
                className="font-display font-800 text-sm uppercase tracking-wider px-4 py-2 rounded-xl bg-[var(--card-hover)] text-[var(--muted)]/50 line-through"
              >
                {pos}
              </span>
            )
          })}
        </div>
        <button
          onClick={onClose}
          className="mt-4 font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)] hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
