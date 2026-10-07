export type GameStatus = 'scheduled' | 'live' | 'final' | 'postponed'

export type GameRow = {
  id: number
  external_id: string
  game_date: string
  game_time: string | null
  home_team_id: string
  away_team_id: string
  home_team_name: string
  away_team_name: string
  home_short: string
  away_short: string
  home_logo: string | null
  away_logo: string | null
  home_score: number | null
  away_score: number | null
  status: GameStatus
  venue: string | null
}
