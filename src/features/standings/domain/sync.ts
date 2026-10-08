export { scheduledStartUtcMs } from '@/shared/dates/amsterdamStart'

export const BASE_URL = 'https://boxscore.stenwessel.nl/api'
export const COMPETITION = 'hb2026'

export type SteGame = {
  id: number
  gamestatus: number
  start: string
  location: string | null
  homeruns: number
  awayruns: number
  homeioc: string
  awayioc: string
  home_team?: { groupwins: number; grouplosses: number; groupties: number; groupgb: number }
  away_team?: { groupwins: number; grouplosses: number; groupties: number; groupgb: number }
}

export function gameStatus(s: number): 'scheduled' | 'live' | 'final' {
  if (s === 1) return 'live'
  if (s === 2 || s === 3) return 'final'
  return 'scheduled'
}
