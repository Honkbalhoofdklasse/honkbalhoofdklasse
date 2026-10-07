export type Game = {
  id: string
  gameDate: string
  gameTime: string | null
  homeId: string | null
  awayId: string | null
  status: 'live' | 'final' | 'scheduled'
  homeScore: number | null
  awayScore: number | null
  // live situation
  inning?: number
  isBottom?: boolean
  outs?: number
  runner1?: boolean
  runner2?: boolean
  runner3?: boolean
}

export type StandingsEntry = { wins: number; losses: number }

export type Data = {
  live: Game[]
  finished: Game[]
  upcoming: Game[]
  standings: Record<string, StandingsEntry>
  updatedAt: string
}
