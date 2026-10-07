export type CellState = 'empty' | 'correct' | 'wrong'
export type CellData = {
  state: CellState
  guess: string
  teamId?: string
  photoUrl?: string | null
  focalX?: number | null
  focalY?: number | null
}

export type SavedState = { cells: CellData[]; guessesLeft: number }
