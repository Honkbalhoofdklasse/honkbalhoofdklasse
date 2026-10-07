export type BatSplit = {
  label: string
  found: number
  ab: number
  r: number
  h: number
  hr: number
  rbi: number
  bb: number
  so: number
  sb: number
  avg: string
}
export type PitSplit = {
  label: string
  found: number
  ip: string
  k: number
  bb: number
  er: number
  h: number
  w: number
  l: number
  era: string
}
export type BatGame = {
  date: string
  opponent: string
  ab: number
  r: number
  h: number
  hr: number
  rbi: number
  bb: number
  so: number
  sb: number
}
export type PitGame = {
  date: string
  opponent: string
  ip: string
  k: number
  bb: number
  er: number
  h: number
  w: number
  l: number
  era: string
}

export const BAT_COLS = ['AB', 'R', 'H', 'HR', 'RBI', 'BB', 'SO', 'SB'] as const
export const PIT_COLS = ['IP', 'W', 'L', 'K', 'BB', 'H', 'ER'] as const
