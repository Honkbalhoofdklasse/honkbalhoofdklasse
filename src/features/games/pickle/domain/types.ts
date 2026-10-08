import type { Player } from '@/shared/rosters/rosters-data'

export type PoolPlayer = Player & { teamId: string }

export type Hit = 'correct' | 'close' | 'wrong'
export type Dir = 'up' | 'down' | null

export type GuessFeedback = {
  player: PoolPlayer
  team: Hit
  pos: Hit
  bats: Hit
  throws: Hit
  yob: Hit
  yobDir: Dir
}

export type SavedState = { guesses: GuessFeedback[]; won: boolean; lost: boolean }
