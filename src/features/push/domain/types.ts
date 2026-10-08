import type { PushSubscriptionRow } from '../api/send-to-teams'

export type GameState = {
  status: number
  homeruns: number
  awayruns: number
  innings: Record<string, { home: number; away: number }>
  playerHR: Record<string, number>
  notifiedStart: boolean
  notifiedFinal: boolean
  noHitterHome: boolean
  noHitterAway: boolean
}

export type PushPayload = { title: string; body: string; icon: string; url: string; tag: string }

export type ScheduledGame = {
  id: number
  homeid: number
  awayid: number
  start?: string | null
  gamestatus: number
}

export type LiveGameData = {
  gamestatus: number
  homeid: number
  awayid: number
  homeruns?: number | null
  awayruns?: number | null
  homehits?: number | null
  awayhits?: number | null
  innings?: number | string | null
  win?: string | null
} & Record<`runshome${number}` | `runsaway${number}`, number | null | undefined>

export type BoxScore = Record<string, unknown>

export type LiveGameContext = {
  game: ScheduledGame
  gameId: number
  gameData: LiveGameData
  boxScore: BoxScore
  prevState: GameState
  newState: GameState
  homeTeamId: string
  awayTeamId: string
  homeName: string
  awayName: string
  teams: string[]
  gameUrl: string
  icon: string
  notifications: string[]
  subscriptions: PushSubscriptionRow[]
}
