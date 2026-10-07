'use client'

export function RulesCard() {
  return (
    <div className="mt-6 bg-[var(--card)] border border-[var(--border)] rounded-xl px-5 py-4">
      <p className="font-display font-800 text-xs uppercase text-white mb-2">Rules</p>
      <ul className="space-y-1">
        {[
          'Name any Hoofdklasse 2026 player matching the row AND column criteria',
          'Each cell uses 1 guess — whether correct or not — you have 9 total',
          'New grid every Friday · play old grids anytime via Previous Grids',
        ].map((t, i) => (
          <li key={i} className="font-display font-700 text-xs text-[var(--muted)] flex gap-2">
            <span className="text-[var(--accent)]">·</span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}
