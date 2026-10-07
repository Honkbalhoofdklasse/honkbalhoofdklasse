import { ROSTERS } from '@/shared/rosters/rosters-data'
import { getCurrentFridayNum } from './grid-data'

export const ALL_PLAYERS = Object.entries(ROSTERS)
  .flatMap(([teamId, r]) => r.players.map((p) => ({ name: p.name, teamId })))
  .sort((a, b) => a.name.localeCompare(b.name))

export const CURRENT_FRIDAY_NUM = getCurrentFridayNum()
