import { ROSTERS } from '@/shared/rosters/rosters-data'
import type { PoolPlayer } from './types'

export const POS_LABEL: Record<string, string> = {
  P: 'Pitcher',
  C: 'Catcher',
  IF: 'Infielder',
  OF: 'Outfielder',
  'C/IF': 'C/IF',
  UTL: 'Utility',
  DH: 'DH',
}

export const MAX_GUESSES = 8
export const YOB_CLOSE = 2

export const ALL_PLAYERS: PoolPlayer[] = Object.entries(ROSTERS)
  .flatMap(([teamId, r]) => r.players.map((p) => ({ ...p, teamId })))
  .sort((a, b) => a.name.localeCompare(b.name))
