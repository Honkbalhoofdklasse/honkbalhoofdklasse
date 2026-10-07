import { StatTable } from './StatTable'
import type { Career } from './types'

export function BattingSection({
  accentColor,
  batRow,
  career,
  bbrefId,
}: {
  accentColor: string
  batRow: string[]
  career: Career | null
  bbrefId: string | undefined
}) {
  return (
    <div className="px-5 pt-5 pb-4">
      <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mb-3">
        2026 Batting
      </p>
      <StatTable
        accentColor={accentColor}
        headers={[
          'G',
          'PA',
          'AB',
          'R',
          'H',
          '2B',
          '3B',
          'HR',
          'RBI',
          'BB',
          'IBB',
          'HBP',
          'SO',
          'SB',
          'CS',
          'SF',
          'SH',
          'GDP',
          'AVG',
          'OBP',
          'SLG',
          'OPS',
        ]}
        rows={[
          { label: '2026 Season', values: batRow, isAccent: false },
          ...(career?.batting ?? []).map((r) => ({
            label: r.year === 'Career' ? 'Career' : `${r.year} ${r.lg}`,
            isAccent: r.year === 'Career',
            values: [
              r.g,
              '—',
              r.ab,
              '—',
              r.h,
              '—',
              '—',
              r.hr,
              r.rbi,
              '—',
              '—',
              '—',
              '—',
              '—',
              '—',
              '—',
              '—',
              '—',
              r.avg,
              r.obp,
              r.slg,
              '—',
            ],
          })),
        ]}
      />
      {bbrefId && (
        <a
          href={`https://www.baseball-reference.com/register/player.fcgi?id=${bbrefId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 font-display font-700 text-[10px] text-[var(--muted)] hover:text-white uppercase tracking-widest transition-colors"
        >
          Full career stats on Baseball Reference →
        </a>
      )}
    </div>
  )
}
