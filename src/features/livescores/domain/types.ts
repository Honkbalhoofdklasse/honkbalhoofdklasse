import type { WinLoss } from '@/shared/types/standing'

export type LiveGame = {
  id: string
  gameDate: string
  gameTime: string | null
  homeId: string | null
  awayId: string | null
  status: 'live' | 'final' | 'scheduled'
  homeScore: number | null
  awayScore: number | null
  inning?: number
  isBottom?: boolean
  outs?: number
  runner1?: boolean
  runner2?: boolean
  runner3?: boolean
}

export type Data = {
  live: LiveGame[]
  finished: LiveGame[]
  upcoming: LiveGame[]
  standings: Record<string, WinLoss>
  updatedAt: string
}
