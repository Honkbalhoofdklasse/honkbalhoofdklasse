export type HSHitter = {
  name: string
  teamId: string
  ab: number
  r: number
  h: number
  hr: number
  rbi: number
  sb: number
  avg: number
  obp: number
  slg: number
  ops: number
  opsAdj: number
  positions: string[]
}
export type HSPitcher = {
  name: string
  teamId: string
  role: 'SP' | 'RP'
  era: number
  whip: number
  so: number
  ip: number
  w: number
  sv: number
  eraAdj: number
}

export type SlotType = 'field' | 'dh' | 'SP' | 'RP'
export type Slot = { key: string; label: string; short: string; type: SlotType; pos?: string }

export type Data = {
  hitters: HSHitter[]
  pitchers: HSPitcher[]
  leagueOps: number
  leagueEra: number
}
export type Mode = 'free' | 'blind'
export type Phase = 'start' | 'draft' | 'result'
export type Filled = Record<string, HSHitter | HSPitcher>
export type SeriesResult = { a: number; b: number; won: boolean }
export type Sim = {
  cutoff: number
  wins: number
  losses: number
  madePlayoffs: boolean
  semi: SeriesResult | null
  final: SeriesResult | null
  champion: boolean
  rs: number
  staffEra: number
  lineupOps: number
  spEra: number
  rpEra: number
  talent: number
  titleOdds: number
  weakBat: { pos: string; name: string; ops: number }
}

export type Grade = 'A' | 'B' | 'C' | 'D' | 'F'

export type DraftSection = {
  title: string
  slotFilled: boolean
  players: (HSHitter | HSPitcher)[]
  directSlot?: string
}
