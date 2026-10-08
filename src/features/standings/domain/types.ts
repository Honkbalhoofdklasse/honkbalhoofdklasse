import type { GameRow as SharedGameRow } from '@/shared/types/game'
import type { StandingRow as SharedStandingRow } from '@/shared/types/standing'

export type StandingRow = Pick<
  SharedStandingRow,
  | 'team_id'
  | 'games_played'
  | 'wins'
  | 'losses'
  | 'ties'
  | 'win_pct'
  | 'runs_scored'
  | 'runs_allowed'
>

export type GameRow = Pick<
  SharedGameRow,
  'home_team_id' | 'away_team_id' | 'home_score' | 'away_score' | 'game_date'
>
