export type Game = {
  id: number
  external_id: string
  game_date: string
  home_team_id: string
  away_team_id: string
  home_score: number | null
  away_score: number | null
}

export type StandingsEntry = { team_id: string; wins: number; losses: number }
