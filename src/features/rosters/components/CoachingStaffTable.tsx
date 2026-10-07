'use client'

import type { Coach } from '@/shared/rosters/rosters-data'

export default function CoachingStaffTable({
  coaches,
  color,
}: {
  coaches: Coach[]
  color: string
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: color }}
        >
          <span className="font-display font-800 text-white text-[9px]">STF</span>
        </div>
        <div>
          <h2 className="font-display font-800 italic text-2xl uppercase text-white leading-none">
            <strong>Coaching Staff</strong>
          </h2>
          <p className="font-display font-700 text-xs text-[var(--muted)] uppercase tracking-widest">
            {coaches.length} staff member{coaches.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="font-display font-700 text-[10px] uppercase tracking-widest text-[var(--muted)] text-center px-3 py-2 w-10">
                #
              </th>
              <th className="font-display font-700 text-[10px] uppercase tracking-widest text-[var(--muted)] text-left px-3 py-2">
                Name
              </th>
              <th className="font-display font-700 text-[10px] uppercase tracking-widest text-[var(--muted)] text-left px-3 py-2">
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {coaches.map((coach, i) => (
              <tr
                key={i}
                className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--card-hover)] transition-colors"
              >
                <td className="font-display font-800 text-sm text-center px-3 py-2.5 w-10 text-white">
                  {coach.uniform || '–'}
                </td>
                <td className="font-display font-800 text-sm text-white px-3 py-2.5">
                  {coach.name}
                </td>
                <td className="font-display font-700 text-xs text-[var(--muted)] px-3 py-2.5">
                  {coach.role}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
