export type StandingRow = {
  team_id: string
  team_name: string
  short_name: string
  logo_url: string | null
  primary_color: string | null
  games_played: number
  wins: number
  losses: number
  ties: number
  win_pct: number
  runs_scored: number
  runs_allowed: number
  games_behind: number | null
}

export type WinLoss = Pick<StandingRow, 'wins' | 'losses'>
