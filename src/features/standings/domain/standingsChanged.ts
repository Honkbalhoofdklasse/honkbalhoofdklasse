export type StandingRecord = {
  wins: number
  losses: number
  ties: number
  games_played: number
  games_behind: number
}

export function standingsChanged(
  current: StandingRecord | undefined,
  next: StandingRecord,
): boolean {
  if (!current) return true
  return (
    current.wins !== next.wins ||
    current.losses !== next.losses ||
    current.ties !== next.ties ||
    current.games_played !== next.games_played ||
    Number(current.games_behind) !== Number(next.games_behind)
  )
}
