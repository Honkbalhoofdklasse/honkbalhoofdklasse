import { ALL_PLAYERS } from './constants'
import type { PoolPlayer } from './types'

// ── Day numbering ─────────────────────────────────────────────────────────────

// Game days: Thursday (4) and Saturday (6), alternating each week.
// Day 0 = Thursday April 2, 2026 (day 1 = Sat Apr 4, day 2 = Thu Apr 9, …)
const START_PICKLE_THU = new Date('2026-04-02')

export function getGameDayDate(): Date {
  const now = new Date()
  const dow = now.getDay() // 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat
  const daysBack = [1, 2, 3, 4, 0, 1, 0][dow]
  const d = new Date(now)
  d.setDate(d.getDate() - daysBack)
  return d
}

export function getDayDate(n: number): Date {
  const weekIdx = Math.floor(n / 2)
  const dayInWeek = n % 2 // 0=Thu, 1=Sat
  const d = new Date(START_PICKLE_THU)
  d.setDate(d.getDate() + weekIdx * 7 + (dayInWeek === 1 ? 2 : 0))
  return d
}

function dateToDayNum(date: Date): number {
  const daysSinceStart = Math.floor((date.getTime() - START_PICKLE_THU.getTime()) / 86400000)
  if (daysSinceStart < 0) return 0
  const weekIdx = Math.floor(daysSinceStart / 7)
  const dayInWeek = date.getDay() === 6 ? 1 : 0
  return weekIdx * 2 + dayInWeek
}

export function getCurrentDayNum(): number {
  return Math.max(0, dateToDayNum(getGameDayDate()))
}

export function getPlayerForDayNum(n: number): PoolPlayer {
  const date = getDayDate(n)
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  // Simple seeded hash from date string
  let seed = 5381
  for (let i = 0; i < dateStr.length; i++) {
    seed = ((seed << 5) + seed) ^ dateStr.charCodeAt(i)
  }

  const arr = [...ALL_PLAYERS]
  // Fisher-Yates shuffle with seeded RNG
  for (let i = arr.length - 1; i > 0; i--) {
    seed = (seed * 1103515245 + 12345) & 0xffffffff
    const j = Math.abs(seed) % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr[0]
}
