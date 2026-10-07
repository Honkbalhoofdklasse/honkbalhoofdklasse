'use client'

import { YOB_CLOSE } from '../domain/constants'

export function Legend() {
  return (
    <div className="mt-6 flex items-center gap-4 flex-wrap">
      {[
        { color: 'bg-green-700', label: 'Correct' },
        { color: 'bg-yellow-700', label: `±${YOB_CLOSE} years` },
        { color: 'bg-[#1a0808]', label: 'Wrong' },
      ].map((l) => (
        <div key={l.label} className="flex items-center gap-1.5">
          <div className={`w-3 h-3 rounded ${l.color}`} />
          <span className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-wider">
            {l.label}
          </span>
        </div>
      ))}
      <div className="flex items-center gap-1">
        <span className="text-blue-300 text-xs font-bold">↑</span>
        <span className="text-orange-300 text-xs font-bold ml-1">↓</span>
        <span className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-wider ml-1">
          YOB direction
        </span>
      </div>
    </div>
  )
}
