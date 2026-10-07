import type { GameRow } from './types'

export function getForm(games: GameRow[], teamId: string): ('W' | 'L' | 'T')[] {
  return games
    .filter((g) => g.home_team_id === teamId || g.away_team_id === teamId)
    .slice(0, 5)
    .map((g) => {
      const isHome = g.home_team_id === teamId
      const mine = isHome ? g.home_score : g.away_score
      const opp = isHome ? g.away_score : g.home_score
      if (mine == null || opp == null) return 'T'
      return mine > opp ? 'W' : mine < opp ? 'L' : 'T'
    })
    .reverse() // oldest left → newest right
}
