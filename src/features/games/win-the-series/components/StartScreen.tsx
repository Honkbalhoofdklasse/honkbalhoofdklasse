'use client'

import { SKIPS } from '../domain/config'
import type { Mode } from '../domain/types'
import { Info } from './Info'
import { Shell } from './Shell'

export function StartScreen({ onStart }: { onStart: (m: Mode) => void }) {
  return (
    <Shell>
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2 mb-8">
          {['Draft', 'Playoffs', 'Title'].map((step, i) => (
            <span key={step} className="flex items-center gap-2">
              <span
                className={`font-display font-800 uppercase text-sm tracking-wider ${i === 2 ? 'text-[var(--accent)]' : 'text-white'}`}
              >
                {step}
              </span>
              {i < 2 && <span className="text-[var(--muted)]">→</span>}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-8">
          <Info n="9 + 5" l="Roster" />
          <Info n="Bo5" l="Semifinal" />
          <Info n="Bo7" l="Holland Series" />
        </div>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={() => onStart('free')}
            className="font-display font-800 uppercase tracking-widest bg-[var(--accent)] text-white px-6 py-4 rounded-xl hover:opacity-90 transition-opacity text-lg"
          >
            Play
          </button>
          <button
            onClick={() => onStart('blind')}
            className="font-display font-800 uppercase tracking-widest bg-[var(--card)] border border-[var(--border)] text-white px-6 py-3 rounded-xl hover:border-[var(--accent)] transition-colors"
          >
            Blind Mode
          </button>
        </div>
        <p className="text-center font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mt-5">
          {SKIPS} skips · playoff line shifts each game
        </p>
      </div>
    </Shell>
  )
}
