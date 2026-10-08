import type { CmpPlayer } from '../api/compareRoute'

export type StatRow = {
  label: string
  key: keyof CmpPlayer
  fmt?: (v: number) => string
  lowerBetter?: boolean
}

export const STAT_ROWS: StatRow[] = [
  { label: 'AVG', key: 'avg', fmt: (v) => v.toFixed(3).replace(/^0\./, '.') },
  { label: 'OBP', key: 'obp', fmt: (v) => v.toFixed(3).replace(/^0\./, '.') },
  { label: 'SLG', key: 'slg', fmt: (v) => v.toFixed(3).replace(/^0\./, '.') },
  { label: 'OPS', key: 'ops', fmt: (v) => v.toFixed(3).replace(/^0\./, '.') },
  { label: 'AB', key: 'ab' },
  { label: 'H', key: 'h' },
  { label: '2B', key: 'double' },
  { label: '3B', key: 'triple' },
  { label: 'HR', key: 'hr' },
  { label: 'RBI', key: 'rbi' },
  { label: 'R', key: 'r' },
  { label: 'BB', key: 'bb' },
  { label: 'SO', key: 'so', lowerBetter: true },
  { label: 'SB', key: 'sb' },
  { label: 'CS', key: 'cs', lowerBetter: true },
]

export function fmtStat(row: StatRow, val: number): string {
  if (row.fmt) return row.fmt(val)
  return String(val)
}
