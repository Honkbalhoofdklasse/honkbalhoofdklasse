import { TeamLogo } from './TeamLogo'
import type { BoxscoreData } from './types'

export function LinescoreTable({
  data,
  awayWon,
  homeWon,
}: {
  data: BoxscoreData
  awayWon: boolean
  homeWon: boolean
}) {
  return (
    <div className="px-3 pb-2 overflow-x-auto shrink-0">
      <table className="border-collapse text-center mx-auto">
        <thead>
          <tr>
            <th className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest py-2 px-2 text-left w-24">
              Team
            </th>
            {data.displayInnings.map((i) => (
              <th
                key={i}
                className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest py-2 px-2 w-8"
              >
                {i}
              </th>
            ))}
            <th className="font-display font-800 text-[10px] text-white uppercase tracking-widest py-2 px-3 border-l border-[var(--border)]">
              R
            </th>
            <th className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest py-2 px-3">
              H
            </th>
            <th className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest py-2 px-3">
              E
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t border-[var(--border)]">
            <td className="py-3 px-2 text-left">
              <div className="flex items-center gap-1.5">
                <TeamLogo teamId={data.awayId} size={22} />
                <span className="font-display font-800 text-xs uppercase text-white">
                  {data.awayId.slice(0, 3).toUpperCase()}
                </span>
              </div>
            </td>
            {data.awayInnings.map((v, i) => (
              <td
                key={i}
                className={`font-display font-700 text-sm py-3 px-2 ${v === null ? 'text-[var(--muted)]' : 'text-white'}`}
              >
                {v === null ? '–' : String(v)}
              </td>
            ))}
            <td
              className={`font-display font-800 text-base py-3 px-3 border-l border-[var(--border)] ${awayWon ? 'text-white' : 'text-[var(--muted)]'}`}
            >
              {data.awayTotals.r}
            </td>
            <td className="font-display font-700 text-sm text-[var(--muted)] py-3 px-3">
              {data.awayTotals.h}
            </td>
            <td className="font-display font-700 text-sm text-[var(--muted)] py-3 px-3">
              {data.awayTotals.e}
            </td>
          </tr>
          <tr className="border-t border-[var(--border)]">
            <td className="py-3 px-2 text-left">
              <div className="flex items-center gap-1.5">
                <TeamLogo teamId={data.homeId} size={22} />
                <span className="font-display font-800 text-xs uppercase text-white">
                  {data.homeId.slice(0, 3).toUpperCase()}
                </span>
              </div>
            </td>
            {data.homeInnings.map((v, i) => (
              <td
                key={i}
                className={`font-display text-sm py-3 px-2 ${v === 'X' ? 'font-700 text-[var(--muted)] italic' : v === null ? 'text-[var(--muted)]' : 'font-700 text-white'}`}
              >
                {v === null ? '–' : String(v)}
              </td>
            ))}
            <td
              className={`font-display font-800 text-base py-3 px-3 border-l border-[var(--border)] ${homeWon ? 'text-white' : 'text-[var(--muted)]'}`}
            >
              {data.homeTotals.r}
            </td>
            <td className="font-display font-700 text-sm text-[var(--muted)] py-3 px-3">
              {data.homeTotals.h}
            </td>
            <td className="font-display font-700 text-sm text-[var(--muted)] py-3 px-3">
              {data.homeTotals.e}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
