import Link from 'next/link'
import type { PitcherStat } from '@/shared/types/boxscore'
import { slugify } from '@/shared/rosters/rosters-data'

export function PitchingTable({
  pitchers,
  teamColor,
  teamId,
}: {
  pitchers: PitcherStat[]
  teamColor: string
  teamId: string
}) {
  if (!pitchers.length)
    return (
      <p className="font-display font-700 text-xs text-[var(--muted)] uppercase py-4 text-center">
        No data
      </p>
    )
  const cols = ['IP', 'H', 'R', 'ER', 'BB', 'SO']
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest py-2 pr-3 text-left">
              Pitcher
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
          {pitchers.map((p, i) => {
            const decision = p.win ? 'W' : p.loss ? 'L' : p.save ? 'S' : null
            return (
              <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-2 pr-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/rosters/${teamId}/${slugify(p.name)}`}
                      className="font-display font-700 text-xs uppercase text-white hover:text-[var(--accent)] transition-colors"
                    >
                      {p.name}
                    </Link>
                    {decision && (
                      <span
                        className="font-display font-800 text-[10px] px-1.5 py-0.5 rounded"
                        style={{ backgroundColor: teamColor + '33', color: teamColor }}
                      >
                        {decision}
                      </span>
                    )}
                  </div>
                </td>
                {[p.ip, p.h, p.r, p.er, p.bb, p.so].map((v, j) => (
                  <td
                    key={j}
                    className="font-display font-700 text-xs text-center py-2 px-2 text-white"
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
