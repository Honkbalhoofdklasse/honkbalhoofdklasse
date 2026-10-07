import { StatTable } from './StatTable'
import type { Career } from './types'

export function PitchingSection({
  accentColor,
  pitRow,
  career,
}: {
  accentColor: string
  pitRow: string[]
  career: Career | null
}) {
  return (
    <div className="px-5 pt-5 pb-4">
      <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mb-3">
        2026 Pitching
      </p>
      <StatTable
        accentColor={accentColor}
        headers={[
          'App',
          'GS',
          'CG',
          'SHO',
          'IP',
          'W',
          'L',
          'SV',
          'BF',
          'H',
          'R',
          'ER',
          'BB',
          'IBB',
          'HBP',
          'HR',
          'SO',
          'WP',
          'BK',
          'ERA',
          'WHIP',
        ]}
        rows={[{ label: '2026 Season', values: pitRow }]}
      />
      {career?.pitching && career.pitching.length > 0 && (
        <div className="mt-4">
          <StatTable
            accentColor={accentColor}
            headers={['W', 'L', 'ERA', 'IP', 'SO', 'WHIP']}
            rows={career.pitching.map((r) => ({
              label: r.year === 'Career' ? 'Career' : `${r.year} ${r.lg}`,
              isAccent: r.year === 'Career',
              values: [r.w, r.l, r.era, r.ip, r.so, r.whip],
            }))}
          />
        </div>
      )}
    </div>
  )
}
