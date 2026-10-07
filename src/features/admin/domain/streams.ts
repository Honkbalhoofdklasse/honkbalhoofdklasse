import type { GameRow } from '@/shared/types/game'
import { WEEKDAY_DAY_MONTH, formatGameDate } from '@/shared/dates/gameDate'

export type Game = Pick<
  GameRow,
  'id' | 'game_date' | 'game_time' | 'home_team_id' | 'away_team_id' | 'status'
>

export type Stream = {
  id: number
  game_id: number | null
  title: string
  stream_url: string
  platform: string | null
  is_live: boolean
}

export const TEAM_NAME: Record<string, string> = {
  neptunus: 'Neptunus',
  pirates: 'Pirates',
  kinheim: 'Kinheim',
  hcaw: 'HCAW',
  twins: 'Twins',
  pioniers: 'Pioniers',
  uvv: 'UVV',
}

export function fmtGame(g: Game) {
  const date = formatGameDate(g.game_date, WEEKDAY_DAY_MONTH, 'nl-NL')
  const time = g.game_time ? g.game_time.slice(0, 5) : ''
  return `${date}${time ? ' · ' + time : ''}`
}

export function detectPlatform(url: string) {
  if (url.includes('youtube') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('twitch')) return 'twitch'
  return 'other'
}
