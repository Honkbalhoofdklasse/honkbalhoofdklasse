import type { GameRow } from '@/shared/types/game'

export type Game = Omit<
  GameRow,
  | 'external_id'
  | 'home_team_name'
  | 'away_team_name'
  | 'home_short'
  | 'away_short'
  | 'home_logo'
  | 'away_logo'
  | 'venue'
>

export type Pick = {
  game_id: number
  picked_team_id: string
}

export type LeaderEntry = {
  rank: number
  isMe: boolean
  nickname: string
  correct: number
  total: number
  pct: number
}

export type UserInfo = { token: string; nickname: string }
