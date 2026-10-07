export type Game = {
  id: number
  game_date: string
  game_time: string | null
  home_team_id: string
  away_team_id: string
  status: string
}

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
  const d = new Date(g.game_date + 'T12:00:00')
  const date = d.toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' })
  const time = g.game_time ? g.game_time.slice(0, 5) : ''
  return `${date}${time ? ' · ' + time : ''}`
}

export function detectPlatform(url: string) {
  if (url.includes('youtube') || url.includes('youtu.be')) return 'youtube'
  if (url.includes('twitch')) return 'twitch'
  return 'other'
}
