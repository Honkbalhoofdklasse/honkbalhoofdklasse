const MIN_PLATE_APPEARANCES_PER_GAME = 2.7
const MIN_AT_BATS_FLOOR = 5

export function qualifiedAtBats(gamesPlayed: number): number {
  return Math.max(MIN_AT_BATS_FLOOR, Math.ceil(MIN_PLATE_APPEARANCES_PER_GAME * gamesPlayed))
}
