import { CURRENT_FRIDAY_NUM } from './constants'
import { fridayDateKey } from './grid-data'
import type { CellData, CellState, SavedState } from './types'

// ── localStorage helpers ───────────────────────────────────────────────────

export function saveKey(weekNum: number) {
  return `hk_grid_w${weekNum}`
}

export function loadWeek(weekNum: number): SavedState {
  try {
    const raw = localStorage.getItem(saveKey(weekNum))
    if (raw) return JSON.parse(raw) as SavedState
  } catch {
    /* ignore */
  }
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
  } catch {
    /* ignore */
  }
}

export function migrateOldSave() {
  // Move date-based save (old format) to week-based save for current week
  try {
    const newKey = saveKey(CURRENT_FRIDAY_NUM)
    if (!localStorage.getItem(newKey)) {
      const old = localStorage.getItem(`hk_grid_${fridayDateKey()}`)
      if (old) localStorage.setItem(newKey, old)
    }
  } catch {
    /* ignore */
  }
}
