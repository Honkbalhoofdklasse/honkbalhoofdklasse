import type { GameRow } from '@/shared/types/game'
import type { StandingRow } from '@/shared/types/standing'

export type Game = Pick<
  GameRow,
  'id' | 'external_id' | 'game_date' | 'home_team_id' | 'away_team_id' | 'home_score' | 'away_score'
>

export type StandingsEntry = Pick<StandingRow, 'team_id' | 'wins' | 'losses'>
