export type Standing = {
  wins: number
  losses: number
  win_pct: number
  runs_scored: number
  runs_allowed: number
  games_played: number
}
export type Game = {
  external_id: string
  game_date: string
  home_team_id: string
  away_team_id: string
  home_score: number | null
  away_score: number | null
}

export function fmtRate(v: number): string {
  return v.toFixed(3).replace(/^0\./, '.')
}
export function fmtDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}
