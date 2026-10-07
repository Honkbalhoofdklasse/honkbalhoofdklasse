import { CURRENT_FRIDAY_NUM } from './constants'
import { fridayDateKey } from './grid-data'
import type { CellData, CellState, SavedState } from './types'

export function saveKey(weekNum: number) {
  return `hk_grid_w${weekNum}`
}

export function loadWeek(weekNum: number): SavedState {
  try {
    const raw = localStorage.getItem(saveKey(weekNum))
    if (raw) return JSON.parse(raw) as SavedState
  } catch {}
  return {
    cells: Array(9)
      .fill(null)
      .map(() => ({ state: 'empty' as CellState, guess: '' })),
    guessesLeft: 9,
  }
}

export function saveWeekState(weekNum: number, cells: CellData[], guessesLeft: number) {
  try {
    localStorage.setItem(saveKey(weekNum), JSON.stringify({ cells, guessesLeft }))
  } catch {}
}

export function migrateOldSave() {
  try {
    const newKey = saveKey(CURRENT_FRIDAY_NUM)
    if (!localStorage.getItem(newKey)) {
      const old = localStorage.getItem(`hk_grid_${fridayDateKey()}`)
      if (old) localStorage.setItem(newKey, old)
    }
  } catch {}
}
