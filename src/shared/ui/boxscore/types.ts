import type { BatterStat, PitcherStat } from '@/shared/types/boxscore'

export type Situation = {
  inning: number
  isBottom: boolean
  outs: number
  balls: number
  strikes: number
  runner1: boolean
  runner2: boolean
  runner3: boolean
  currentBatter: string | null
  currentPitcher: string | null
}

export type BoxscoreData = {
  isLive: boolean
  displayInnings: number[]
  startInning: number
  awayId: string
  homeId: string
  awayInnings: (number | string | null)[]
  homeInnings: (number | string | null)[]
  awayTotals: { r: number; h: number; e: number }
  homeTotals: { r: number; h: number; e: number }
  winPitcher: { name: string; era: string } | null
  lossPitcher: { name: string; era: string } | null
  savePitcher: { name: string; era: string } | null
  awayBatters: BatterStat[]
  homeBatters: BatterStat[]
  awayPitchers: PitcherStat[]
  homePitchers: PitcherStat[]
  situation: Situation | null
}
