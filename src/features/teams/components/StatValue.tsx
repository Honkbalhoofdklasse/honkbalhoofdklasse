'use client'

import type { TeamBatting, TeamPitching } from '@/shared/teams/team-stats'
import { fmtRate, type SortKey } from '../domain/teamsSort'

export default function StatValue({
  sortKey,
  bat,
  pit,
}: {
  sortKey: SortKey
  bat?: TeamBatting
  pit?: TeamPitching
}) {
  switch (sortKey) {
    case 'avg':
      return <>{bat ? fmtRate(bat.avg) : '—'}</>
    case 'ops':
      return <>{bat ? fmtRate(bat.ops) : '—'}</>
    case 'hr':
      return <>{bat?.hr ?? '—'}</>
    case 'r':
      return <>{bat?.r ?? '—'}</>
    case 'sb':
      return <>{bat?.sb ?? '—'}</>
    case 'era':
      return <>{pit ? pit.era.toFixed(2) : '—'}</>
    case 'so':
      return <>{pit?.pitch_so ?? '—'}</>
    case 'whip':
      return <>{pit ? pit.whip.toFixed(2) : '—'}</>
    default:
      return null
  }
}
