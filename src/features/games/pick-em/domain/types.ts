export type Game = {
  id: number
  game_date: string
  game_time: string | null
  home_team_id: string
  away_team_id: string
  status: string
  home_score: number | null
  away_score: number | null
}

export type Pick = {
  game_id: number
  picked_team_id: string
}

export type LeaderEntry = {
  token: string
  nickname: string
  correct: number
  total: number
  pct: number
}

export type UserInfo = { token: string; nickname: string }
