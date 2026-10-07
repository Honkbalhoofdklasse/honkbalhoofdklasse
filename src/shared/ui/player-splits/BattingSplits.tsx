import { BAT_COLS, type BatGame, type BatSplit } from './types'

export function BattingSplits({
  batSplits,
  batGames,
}: {
  batSplits: BatSplit[]
  batGames: BatGame[]
}) {
  return (
    <>
      {batSplits.length > 0 && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-x-auto">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="border-b border-[var(--border)]">
                <th className="text-left px-4 py-3 font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)]">
                  Period
                </th>
                {[...BAT_COLS, 'AVG'].map((c) => (
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
              {batSplits.map((s) => (
                <tr key={s.label} className="hover:bg-[var(--card-hover)] transition-colors">
                  <td className="px-4 py-3 font-display font-700 text-sm text-white whitespace-nowrap">
                    {s.label}
                  </td>
                  {([s.ab, s.r, s.h, s.hr, s.rbi, s.bb, s.so, s.sb] as number[]).map((v, i) => (
                    <td
                      key={i}
                      className="px-3 py-3 text-center font-display font-700 text-sm text-white/80"
                    >
                      {v}
                    </td>
                  ))}
                  <td className="px-3 py-3 text-center font-display font-800 text-sm text-white">
                    {s.avg}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {batGames.length > 0 && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-x-auto">
          <div className="px-4 pt-3 pb-1">
            <p className="font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)]">
              Last {batGames.length} Games
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
                {BAT_COLS.map((c) => (
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
              {batGames.map((g, i) => (
                <tr key={i} className="hover:bg-[var(--card-hover)] transition-colors">
                  <td className="px-4 py-2.5 font-display font-700 text-xs text-white/60 whitespace-nowrap">
                    {new Date(g.date + 'T12:00:00').toLocaleDateString('nl-NL', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </td>
                  <td className="px-3 py-2.5 font-display font-700 text-xs text-[var(--muted)] uppercase">
                    {g.opponent}
                  </td>
                  {([g.ab, g.r, g.h, g.hr, g.rbi, g.bb, g.so, g.sb] as number[]).map((v, j) => (
                    <td
                      key={j}
                      className={`px-2 py-2.5 text-center font-display font-700 text-sm ${v > 0 ? 'text-white' : 'text-white/20'}`}
                    >
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
