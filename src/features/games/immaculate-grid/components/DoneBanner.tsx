'use client'

export function DoneBanner({ score, isArchive }: { score: number; isArchive: boolean }) {
  return (
    <div className="mb-6 bg-[var(--card)] border border-[var(--border)] rounded-xl px-5 py-4 text-center">
      <p className="font-display font-800 text-xl uppercase text-white">
        {score === 9
          ? 'Perfect — Immaculate!'
          : score >= 6
            ? `${score}/9 — Great game!`
            : score >= 3
              ? `${score}/9 — Good effort!`
              : `${score}/9 — Better luck next time!`}
      </p>
      <p className="font-display font-700 text-xs text-[var(--muted)] uppercase tracking-widest mt-1">
        {isArchive ? 'Select another grid from the archive →' : 'New grid every Friday'}
      </p>
    </div>
  )
}
