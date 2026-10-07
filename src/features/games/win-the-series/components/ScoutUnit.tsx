'use client'

import { GRADE_COLOR } from '../domain/config'
import type { Grade } from '../domain/types'

export function ScoutUnit({
  label,
  value,
  sub,
  grade,
}: {
  label: string
  value: string
  sub: string
  grade: Grade
}) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-3 sm:p-4">
      <div className="flex items-center justify-between gap-1 mb-1">
        <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest truncate">
          {label}
        </p>
        <span
          className="font-display font-800 text-sm w-6 h-6 flex items-center justify-center rounded-md shrink-0"
          style={{ color: GRADE_COLOR[grade], border: `1.5px solid ${GRADE_COLOR[grade]}` }}
        >
          {grade}
        </span>
      </div>
      <p className="font-display font-800 text-2xl text-white tabular-nums leading-none">{value}</p>
      <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-wider mt-1">
        {sub}
      </p>
    </div>
  )
}
