import { C, type Criterion, getValidPlayers } from './criteria'

export {
  type Criterion,
  getValidPlayers,
  isValidAnswer,
  playerMatchesCriterion,
} from './criteria'

// ── Weekly grids ───────────────────────────────────────────────────────────────

export type GridConfig = {
  week: number
  rows: [Criterion, Criterion, Criterion]
  cols: [Criterion, Criterion, Criterion]
}

export const WEEKLY_GRIDS: GridConfig[] = [
  {
    // Teams as rows — classic opener
    week: 1,
    rows: [C.neptunus, C.pirates, C.kinheim],
    cols: [C.pitcher, C.infielder, C.young],
  },
  {
    // Teams as cols — inverted layout
    week: 2,
    rows: [C.outfielder, C.veteran, C.leftBatter],
    cols: [C.hcaw, C.uvv, C.pirates],
  },
  {
    // Teams as rows — handedness focus
    week: 3,
    rows: [C.pioniers, C.neptunus, C.hcaw],
    cols: [C.catcher, C.leftBatter, C.rightBatter],
  },
  {
    // Teams as cols — position players only
    week: 4,
    rows: [C.catcher, C.outfielder, C.nonPitcher],
    cols: [C.kinheim, C.uvv, C.twins],
  },
  {
    // Teams as rows — age + handedness
    week: 5,
    rows: [C.twins, C.pioniers, C.neptunus],
    cols: [C.infielder, C.rightBatter, C.young],
  },
  {
    // Teams as cols — pitcher spotlight
    week: 6,
    rows: [C.pitcher, C.infielder, C.veteran],
    cols: [C.pirates, C.kinheim, C.hcaw],
  },
  {
    // Teams as rows — veteran vs young
    week: 7,
    rows: [C.uvv, C.twins, C.pioniers],
    cols: [C.veteran, C.young, C.outfielder],
  },
  {
    // Teams as cols — mixed criteria
    week: 8,
    rows: [C.pitcher, C.leftBatter, C.young],
    cols: [C.neptunus, C.uvv, C.pioniers],
  },
  {
    // Teams as rows — catcher + infielder
    week: 9,
    rows: [C.neptunus, C.hcaw, C.kinheim],
    cols: [C.catcher, C.infielder, C.veteran],
  },
  {
    // Teams as cols — position players focus
    week: 10,
    rows: [C.nonPitcher, C.rightBatter, C.young],
    cols: [C.pirates, C.twins, C.uvv],
  },
]

// Returns false if any of the 9 cells has zero valid answers
export function gridIsValid(grid: GridConfig): boolean {
  for (const rowCrit of grid.rows) {
    for (const colCrit of grid.cols) {
      if (getValidPlayers(rowCrit, colCrit).length === 0) return false
    }
  }
  return true
}

const START_FRIDAY = new Date('2026-04-03') // First Friday of 2026 season

// Grid changes every Friday — find the most recent Friday
export function getMostRecentFriday(): Date {
  const now = new Date()
  const dow = now.getDay() // 0=Sun … 5=Fri … 6=Sat
  const daysBack = (dow - 5 + 7) % 7 // Fri→0 Sat→1 Sun→2 Mon→3 Tue→4 Wed→5 Thu→6
  const d = new Date(now)
  d.setDate(d.getDate() - daysBack)
  return d
}

// How many Fridays have passed since the season started (0-indexed)
export function getCurrentFridayNum(): number {
  const lastFriday = getMostRecentFriday()
  return Math.max(
    0,
    Math.floor((lastFriday.getTime() - START_FRIDAY.getTime()) / (7 * 24 * 60 * 60 * 1000)),
  )
}

// The calendar date of a given fridayNum
export function getFridayDate(fridayNum: number): Date {
  const d = new Date(START_FRIDAY)
  d.setDate(d.getDate() + fridayNum * 7)
  return d
}

// Get the grid config for a specific fridayNum (rotates through valid grids)
export function getGridForFridayNum(fridayNum: number): GridConfig {
  const validGrids = WEEKLY_GRIDS.filter(gridIsValid)
  if (validGrids.length === 0) return WEEKLY_GRIDS[0]
  return validGrids[fridayNum % validGrids.length]
}

export function getCurrentWeekGrid(): GridConfig {
  return getGridForFridayNum(getCurrentFridayNum())
}

export function fridayDateKey(): string {
  const d = getMostRecentFriday()
  return `${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`
}
