import { getGameDayDate } from './pickle-days'
import type { SavedState } from './types'

function dayKey(n: number) {
  return `pickle_d${n}`
}

export function loadDay(n: number): SavedState {
  try {
    const raw = localStorage.getItem(dayKey(n))
    if (raw) return JSON.parse(raw)
  } catch {}
  return { guesses: [], won: false, lost: false }
}

export function saveDayState(n: number, state: SavedState) {
  try {
    localStorage.setItem(dayKey(n), JSON.stringify(state))
  } catch {}
}

export function migrateOldSave(currentDayNum: number) {
  const gameDayDate = getGameDayDate()
  const oldKey = `pickle_${gameDayDate.getFullYear()}_${gameDayDate.getMonth()}_${gameDayDate.getDate()}`
  const newKey = dayKey(currentDayNum)
  if (localStorage.getItem(newKey)) return
  const old = localStorage.getItem(oldKey)
  if (old) {
    localStorage.setItem(newKey, old)
    localStorage.removeItem(oldKey)
  }
}
