export const BASE_URL = 'https://boxscore.stenwessel.nl/api'
export const COMPETITION = 'hb2026'

export type SteGame = {
  id: number
  gamestatus: number
  start: string // "2026-04-09 19:30:00" (Amsterdam local time)
  location: string | null
  homeruns: number
  awayruns: number
  homeioc: string
  awayioc: string
  home_team?: { groupwins: number; grouplosses: number; groupties: number; groupgb: number }
  away_team?: { groupwins: number; grouplosses: number; groupties: number; groupgb: number }
}

// sg.start is Amsterdam local time. Convert to UTC for comparison.
// Season runs Apr-Oct → CEST (UTC+2). Off-season → CET (UTC+1).
export function scheduledStartUtcMs(start: string): number {
  if (!start) return 0
  const month = parseInt(start.slice(5, 7), 10)
  const offsetHours = month >= 4 && month <= 10 ? 2 : 1
  return Date.parse(start.replace(' ', 'T') + 'Z') - offsetHours * 3_600_000
}

export function gameStatus(s: number): 'scheduled' | 'live' | 'final' {
  if (s === 1) return 'live'
  if (s === 2 || s === 3) return 'final'
  return 'scheduled'
}
