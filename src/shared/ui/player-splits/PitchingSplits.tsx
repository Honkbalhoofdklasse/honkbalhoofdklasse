import { PIT_COLS, type PitGame, type PitSplit } from './types'
import { DAY_MONTH, formatGameDate } from '@/shared/dates/gameDate'

export function PitchingSplits({
  pitSplits,
  pitGames,
}: {
  pitSplits: PitSplit[]
  pitGames: PitGame[]
}) {
  return (
    <>
      {pitSplits.length > 0 && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)]">
                  Period
                </th>
                {[...PIT_COLS, 'ERA'].map((c) => (
                  <th
                    key={c}
                    className="text-center px-3 py-3 font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)]"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {pitSplits.map((s) => (
                <tr key={s.label} className="hover:bg-[var(--card-hover)] transition-colors">
                  <td className="px-4 py-3 font-display font-700 text-sm text-white whitespace-nowrap">
                    {s.label}
                  </td>
                  {[s.ip, s.w, s.l, s.k, s.bb, s.h, s.er].map((v, i) => (
                    <td
                      key={i}
                      className="px-3 py-3 text-center font-display font-700 text-sm text-white/80"
                    >
                      {v}
                    </td>
                  ))}
                  <td className="px-3 py-3 text-center font-display font-800 text-sm text-white">
                    {s.era}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pitGames.length > 0 && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-x-auto">
          <div className="px-4 pt-3 pb-1">
            <p className="font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)]">
              Last {pitGames.length} Games
            </p>
          </div>
          <table className="w-full text-sm min-w-[440px]">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-2 font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)]">
                  Date
                </th>
                <th className="text-left px-3 py-2 font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)]">
                  OPP
                </th>
                {[...PIT_COLS, 'ERA'].map((c) => (
                  <th
                    key={c}
                    className="text-center px-2 py-2 font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)]"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {pitGames.map((g, i) => (
                <tr key={i} className="hover:bg-[var(--card-hover)] transition-colors">
                  <td className="px-4 py-2.5 font-display font-700 text-xs text-white/60 whitespace-nowrap">
                    {formatGameDate(g.date, DAY_MONTH, 'nl-NL')}
                  </td>
                  <td className="px-3 py-2.5 font-display font-700 text-xs text-[var(--muted)] uppercase">
                    {g.opponent}
                  </td>
                  {[g.ip, g.w, g.l, g.k, g.bb, g.h, g.er].map((v, j) => (
                    <td
                      key={j}
                      className={`px-2 py-2.5 text-center font-display font-700 text-sm ${Number(v) > 0 || String(v).includes('.') ? 'text-white' : 'text-white/20'}`}
                    >
                      {v}
                    </td>
                  ))}
                  <td className="px-2 py-2.5 text-center font-display font-800 text-sm text-white">
                    {g.era}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
