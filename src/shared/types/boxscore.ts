export type RawPlayer = Record<string, unknown>

export type BatterStat = {
  name: string
  pos: string
  isSubstitute: boolean
  ab: number
  h: number
  r: number
  rbi: number
  bb: number
  so: number
  hr: number
  double: number
  triple: number
}

export type PitcherStat = {
  name: string
  ip: string
  h: number
  r: number
  er: number
  bb: number
  so: number
  win: boolean
  loss: boolean
  save: boolean
}
