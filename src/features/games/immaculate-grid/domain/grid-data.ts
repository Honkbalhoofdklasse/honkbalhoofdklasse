import { C, type Criterion, getValidPlayers } from './criteria'

export {
  type Criterion,
  getValidPlayers,
  isValidAnswer,
  playerMatchesCriterion,
} from './criteria'

export type GridConfig = {
  week: number
  rows: [Criterion, Criterion, Criterion]
  cols: [Criterion, Criterion, Criterion]
}

export const WEEKLY_GRIDS: GridConfig[] = [
  {
    week: 1,
    rows: [C.neptunus, C.pirates, C.kinheim],
    cols: [C.pitcher, C.infielder, C.young],
  },
  {
    week: 2,
    rows: [C.outfielder, C.veteran, C.leftBatter],
    cols: [C.hcaw, C.uvv, C.pirates],
  },
  {
    week: 3,
    rows: [C.pioniers, C.neptunus, C.hcaw],
    cols: [C.catcher, C.leftBatter, C.rightBatter],
  },
  {
    week: 4,
    rows: [C.catcher, C.outfielder, C.nonPitcher],
    cols: [C.kinheim, C.uvv, C.twins],
  },
  {
    week: 5,
    rows: [C.twins, C.pioniers, C.neptunus],
    cols: [C.infielder, C.rightBatter, C.young],
  },
  {
    week: 6,
    rows: [C.pitcher, C.infielder, C.veteran],
    cols: [C.pirates, C.kinheim, C.hcaw],
  },
  {
    week: 7,
    rows: [C.uvv, C.twins, C.pioniers],
    cols: [C.veteran, C.young, C.outfielder],
  },
  {
    week: 8,
    rows: [C.pitcher, C.leftBatter, C.young],
    cols: [C.neptunus, C.uvv, C.pioniers],
  },
  {
    week: 9,
    rows: [C.neptunus, C.hcaw, C.kinheim],
    cols: [C.catcher, C.infielder, C.veteran],
  },
  {
    week: 10,
    rows: [C.nonPitcher, C.rightBatter, C.young],
    cols: [C.pirates, C.twins, C.uvv],
  },
]

export function gridIsValid(grid: GridConfig): boolean {
  for (const rowCrit of grid.rows) {
    for (const colCrit of grid.cols) {
      if (getValidPlayers(rowCrit, colCrit).length === 0) return false
    }
  }
  return true
}

const START_FRIDAY = new Date('2026-04-03')

export function getMostRecentFriday(): Date {
  const now = new Date()
  const dow = now.getDay()
  const daysBack = (dow - 5 + 7) % 7
  const d = new Date(now)
  d.setDate(d.getDate() - daysBack)
  return d
}

export function getCurrentFridayNum(): number {
  const lastFriday = getMostRecentFriday()
  return Math.max(
    0,
    Math.floor((lastFriday.getTime() - START_FRIDAY.getTime()) / (7 * 24 * 60 * 60 * 1000)),
  )
}

export function getFridayDate(fridayNum: number): Date {
  const d = new Date(START_FRIDAY)
  d.setDate(d.getDate() + fridayNum * 7)
  return d
}

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
