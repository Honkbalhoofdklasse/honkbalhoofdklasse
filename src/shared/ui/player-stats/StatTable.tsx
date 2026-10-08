export function StatTable({
  headers,
  rows,
  accentColor,
}: {
  headers: string[]
  rows: { label: string; values: string[]; isAccent?: boolean }[]
  accentColor: string
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs min-w-max">
        <thead>
          <tr className="border-b border-[var(--border)]">
            <th className="font-display font-700 text-[var(--muted)] uppercase tracking-widest px-3 py-2 text-left whitespace-nowrap w-28">
              Year
            </th>
            {headers.map((h) => (
              <th
                key={h}
                className="font-display font-700 text-[var(--muted)] uppercase tracking-widest px-2 py-2 text-right whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className="border-b border-[var(--border)]/40 last:border-0 hover:bg-white/[0.02]"
            >
              <td
                className="font-display font-800 px-3 py-2.5 text-left whitespace-nowrap text-[11px]"
                style={{ color: row.isAccent ? accentColor : 'rgba(255,255,255,0.5)' }}
              >
                {row.label}
              </td>
              {row.values.map((val, j) => {
                const isRate =
                  headers[j] === 'AVG' ||
                  headers[j] === 'OBP' ||
                  headers[j] === 'SLG' ||
                  headers[j] === 'OPS' ||
                  headers[j] === 'ERA' ||
                  headers[j] === 'WHIP'
                return (
                  <td
                    key={j}
                    className="px-2 py-2.5 text-right whitespace-nowrap"
                    style={{
                      color: isRate && val !== '—' ? accentColor : 'rgba(255,255,255,0.85)',
                      fontFamily: 'inherit',
                    }}
                  >
                    <span className="font-display font-800 text-xs">{val}</span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
