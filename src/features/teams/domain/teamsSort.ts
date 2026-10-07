import type { TeamBatting, TeamPitching } from '@/shared/teams/team-stats'
import type { StandingRow } from '@/shared/types/standing'

export type Standing = Pick<
  StandingRow,
  'team_id' | 'wins' | 'losses' | 'win_pct' | 'runs_scored' | 'runs_allowed' | 'games_played'
>

export type SortKey = 'standings' | 'avg' | 'hr' | 'r' | 'era' | 'so' | 'whip' | 'ops' | 'sb'
export const ASC_KEYS: SortKey[] = ['era', 'whip']

export type StatButton = { key: SortKey; label: string }
export const BATTING_SORTS: StatButton[] = [
  { key: 'avg', label: 'BA' },
  { key: 'ops', label: 'OPS' },
  { key: 'hr', label: 'HR' },
  { key: 'r', label: 'R' },
  { key: 'sb', label: 'SB' },
]
export const PITCHING_SORTS: StatButton[] = [
  { key: 'era', label: 'ERA' },
  { key: 'whip', label: 'WHIP' },
  { key: 'so', label: 'SO' },
]

export function fmtRate(v: number): string {
  return v.toFixed(3).replace(/^0\./, '.')
}

export function getValue(
  key: SortKey,
  standing: Standing | undefined,
  bat: TeamBatting | undefined,
  pit: TeamPitching | undefined,
): number {
  switch (key) {
    case 'standings':
      return standing ? standing.wins * 1000 + standing.win_pct : 0
    case 'avg':
      return bat?.avg ?? 0
    case 'ops':
      return bat?.ops ?? 0
    case 'hr':
      return bat?.hr ?? 0
    case 'r':
      return bat?.r ?? 0
    case 'sb':
      return bat?.sb ?? 0
    case 'era':
      return pit?.era ?? 99
    case 'so':
      return pit?.pitch_so ?? 0
    case 'whip':
      return pit?.whip ?? 99
  }
}
