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

const CEST_OFFSET_HOURS = 2
const CET_OFFSET_HOURS = 1
const FIRST_SUMMER_TIME_MONTH = 4
const LAST_SUMMER_TIME_MONTH = 10

function amsterdamOffsetHours(month: number): number {
  return month >= FIRST_SUMMER_TIME_MONTH && month <= LAST_SUMMER_TIME_MONTH
    ? CEST_OFFSET_HOURS
    : CET_OFFSET_HOURS
}

export function scheduledStartUtcMs(amsterdamLocalStart: string): number {
  if (!amsterdamLocalStart) return 0
  const month = parseInt(amsterdamLocalStart.slice(5, 7), 10)
  return (
    Date.parse(amsterdamLocalStart.replace(' ', 'T') + 'Z') -
    amsterdamOffsetHours(month) * 3_600_000
  )
}

export function gameStatus(s: number): 'scheduled' | 'live' | 'final' {
  if (s === 1) return 'live'
  if (s === 2 || s === 3) return 'final'
  return 'scheduled'
}
