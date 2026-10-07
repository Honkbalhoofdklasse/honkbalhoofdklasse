'use client'

import { TeamReel } from './TeamReel'

export function SpinGate({
  round,
  total,
  dealt,
  spinning,
  onSpin,
}: {
  round: number
  total: number
  dealt: string
  spinning: boolean
  onSpin: () => void
}) {
  return (
    <div
      onClick={onSpin}
      role="button"
      tabIndex={0}
      className="cursor-pointer select-none py-12 flex flex-col items-center gap-6"
    >
      <p className="font-display font-700 text-xs text-[var(--muted)] uppercase tracking-[0.3em]">
        Pick {round} / {total}
      </p>
      <TeamReel teamId={dealt} spinning={spinning} question={!spinning} />
      {spinning ? (
        <p className="font-display font-800 text-[11px] text-[var(--accent)] uppercase tracking-[0.3em] animate-pulse">
          Spinning
        </p>
      ) : (
        <>
          <span className="font-display font-800 uppercase tracking-widest text-white text-lg bg-[var(--accent)] px-12 py-4 rounded-xl shadow-[0_0_35px_-5px_var(--accent)]">
            Spin
          </span>
          <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-[0.25em]">
            Click anywhere to spin
          </p>
        </>
      )}
    </div>
  )
}
