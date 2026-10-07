import type { PitchingRow } from '../domain/careerTypes'

export default function CareerPitchingTable({
  rows,
  teamColor,
}: {
  rows: PitchingRow[]
  teamColor: string
}) {
  return (
    <div>
      <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mb-2">
        Pitching
      </p>
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-[var(--border)]">
              {[
                'Year',
                'Age',
                'Lg',
                'Team',
                'W',
                'L',
                'ERA',
                'G',
                'GS',
                'SV',
                'IP',
                'H',
                'BB',
                'SO',
                'WHIP',
              ].map((h) => (
                <th
                  key={h}
                  className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest px-2 py-2 text-center whitespace-nowrap first:text-left"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const isCareer = row.year === 'Career'
              return (
                <tr
                  key={i}
                  className={`border-b border-[var(--border)] last:border-0 ${isCareer ? 'bg-[var(--accent)]/5' : 'hover:bg-[var(--card-hover)]'} transition-colors`}
                >
                  <td
                    className={`font-display font-800 px-2 py-2 text-left whitespace-nowrap ${isCareer ? 'text-[var(--accent)]' : 'text-white'}`}
                  >
                    {row.year}
                  </td>
                  <td className="font-display font-700 px-2 py-2 text-center text-[var(--muted)]">
                    {row.age}
                  </td>
                  <td className="font-display font-700 px-2 py-2 text-center text-[var(--muted)] whitespace-nowrap">
                    {row.lg}
                  </td>
                  <td className="font-display font-800 px-2 py-2 text-center text-white whitespace-nowrap">
                    {row.team}
                  </td>
                  <td className="font-display font-800 px-2 py-2 text-center text-white">
                    {row.w || '–'}
                  </td>
                  <td className="font-display font-700 px-2 py-2 text-center text-white">
                    {row.l || '–'}
                  </td>
                  <td
                    className="font-display font-800 px-2 py-2 text-center"
                    style={{ color: teamColor }}
                  >
                    {row.era || '–'}
                  </td>
                  {[row.g, row.gs, row.sv, row.ip, row.h, row.bb, row.so, row.whip].map((v, j) => (
                    <td key={j} className="font-display font-700 px-2 py-2 text-center text-white">
                      {v || '–'}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
