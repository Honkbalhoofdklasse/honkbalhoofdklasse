import type { SeasonStats } from '@/shared/rosters/player-stats'

export default function SeasonStatsSection({
  season,
  teamColor,
}: {
  season: SeasonStats
  teamColor: string
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-[var(--accent)] shrink-0" />
        <h2 className="font-display font-800 italic text-2xl uppercase text-white tracking-tight">
          <strong>2026 Stats</strong>
        </h2>
        <a
          href="https://stats.knbsbstats.nl/events/2026-lucky-day-hoofdklasse/stats/players/batting"
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto font-display font-700 text-[10px] text-[var(--muted)] hover:text-white uppercase tracking-widest transition-colors"
        >
          KNBSB →
        </a>
      </div>

      <>
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-3">
          {[
            { label: 'AVG', value: season.avg != null ? season.avg.toFixed(3) : '—' },
            { label: 'OBP', value: season.obp != null ? season.obp.toFixed(3) : '—' },
            { label: 'SLG', value: season.slg != null ? season.slg.toFixed(3) : '—' },
            { label: 'OPS', value: season.ops != null ? season.ops.toFixed(3) : '—' },
            { label: 'AB', value: season.ab },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 text-center"
            >
              <p
                className="font-display font-900 text-xl text-white"
                style={{
                  color:
                    s.label === 'AVG' || s.label === 'OPS'
                      ? teamColor === '#121b31'
                        ? 'var(--accent)'
                        : teamColor
                      : undefined,
                }}
              >
                {s.value}
              </p>
              <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['H', '2B', '3B', 'HR', 'RBI', 'R', 'BB', 'SO', 'SB', 'CS'].map((h) => (
                  <th
                    key={h}
                    className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest px-3 py-2 text-center"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {[
                  season.h,
                  season.double,
                  season.triple,
                  season.hr,
                  season.rbi,
                  season.r,
                  season.bb,
                  season.so,
                  season.sb,
                  season.cs,
                ].map((v, i) => (
                  <td key={i} className="font-display font-700 px-3 py-2.5 text-center text-white">
                    {v}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </>
    </section>
  )
}
