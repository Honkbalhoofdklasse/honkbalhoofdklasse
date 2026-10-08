import Link from 'next/link'
import type { BatterStat } from '@/shared/types/boxscore'
import { slugify } from '@/shared/rosters/rosters-data'

export function BattingTable({
  batters,
  teamColor,
  teamId,
}: {
  batters: BatterStat[]
  teamColor: string
  teamId: string
}) {
  if (!batters.length)
    return (
      <p className="font-display font-700 text-xs text-[var(--muted)] uppercase py-4 text-center">
        No data
      </p>
    )
  const cols = ['AB', 'H', 'R', 'RBI', 'BB', 'SO', 'HR']
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest py-2 pr-3 text-left">
              Batter
            </th>
            {cols.map((c) => (
              <th
                key={c}
                className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest py-2 px-2 text-center w-8"
              >
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border)]">
          {batters.map((b, i) => {
            const isPinch = b.isSubstitute || b.pos.startsWith('PH') || b.pos.startsWith('PR')
            return (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-1.5">
                    {isPinch && <span className="text-white/30 text-xs shrink-0 pl-2">↳</span>}
                    {b.pos && (
                      <span
                        className={`font-display font-700 text-[10px] uppercase text-center min-w-[24px] shrink-0 ${isPinch ? 'text-[var(--accent)]' : 'text-white/60'}`}
                      >
                        {b.pos}
                      </span>
                    )}
                    <Link
                      href={`/rosters/${teamId}/${slugify(b.name)}`}
                      className="font-display font-700 text-xs uppercase text-white hover:text-[var(--accent)] transition-colors"
                    >
                      {b.name}
                    </Link>
                  </div>
                </td>
                {[b.ab, b.h, b.r, b.rbi, b.bb, b.so, b.hr].map((v, j) => (
                  <td
                    key={j}
                    className="font-display font-700 text-xs text-center py-2 px-2 tabular-nums text-white"
                  >
                    {v}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
