import type { GameRow } from '@/shared/types/game'
import type { StandingRow } from '@/shared/types/standing'

export type Standing = Pick<
  StandingRow,
  'wins' | 'losses' | 'win_pct' | 'runs_scored' | 'runs_allowed' | 'games_played'
>
export type Game = Pick<
  GameRow,
  'external_id' | 'game_date' | 'home_team_id' | 'away_team_id' | 'home_score' | 'away_score'
>

export function fmtRate(v: number): string {
  return v.toFixed(3).replace(/^0\./, '.')
}
