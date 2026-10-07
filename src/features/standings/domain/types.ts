export type StandingRow = {
  team_id: string
  games_played: number
  wins: number
  losses: number
  ties: number
  win_pct: number
  runs_scored: number
  runs_allowed: number
}

export type GameRow = {
  home_team_id: string
  away_team_id: string
  home_score: number | null
  away_score: number | null
  game_date: string
}
