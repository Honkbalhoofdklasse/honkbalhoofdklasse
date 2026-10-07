import type { Game } from './types'

export function getWeekKey(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(d.setDate(diff))
  return monday.toISOString().split('T')[0]
}

export function fmtDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function fmtTime(t: string | null) {
  return t ? t.slice(0, 5) : ''
}

export function isLocked(game: Game) {
  if (game.status !== 'scheduled') return true
  const lock = new Date(`${game.game_date}T${game.game_time ?? '23:59:00'}`)
  return new Date() >= lock
}

export function getWinner(game: Game): string | null {
  if (game.status !== 'final' || game.home_score == null || game.away_score == null) return null
  if (game.home_score > game.away_score) return game.home_team_id
  if (game.away_score > game.home_score) return game.away_team_id
  return null
}
