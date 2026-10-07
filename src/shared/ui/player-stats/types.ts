export type SeasonStats = Record<string, unknown>
export type Photos = {
  banner_url: string | null
  headshot_url: string | null
  banner_focal_x?: number | null
  banner_focal_y?: number | null
} | null
export type CareerBat = {
  year: string
  lg: string
  team: string
  g: string
  ab: string
  h: string
  hr: string
  rbi: string
  avg: string
  obp: string
  slg: string
}
export type CareerPit = {
  year: string
  lg: string
  team: string
  w: string
  l: string
  era: string
  ip: string
  so: string
  whip: string
}
export type Career = { batting: CareerBat[]; pitching: CareerPit[] }
