import type { Grade, Slot } from './types'

// ── Config ────────────────────────────────────────────────────────────────────
export const REG_GAMES = 36
export const CUTOFF_MIN = 22,
  CUTOFF_MAX = 25 // playoff line varies per game, fixed within a game
export const SEMI_WINS = 3 // best-of-5
export const FINAL_WINS = 4 // best-of-7
export const RA_FLOOR = 3.6 // a 5-man staff regresses over a full season
export const OFF_EXP = 1.55 // run scaling vs offense (kept realistic, not explosive)
export const OPP_SEMI = 0.62 // semifinal opponent: a top playoff team
export const OPP_FINAL = 0.75 // Holland Series opponent: the league's best
export const SKIPS = 3

export const SLOTS: Slot[] = [
  { key: 'C', label: 'Catcher', short: 'C', type: 'field', pos: 'C' },
  { key: '1B', label: 'First Base', short: '1B', type: 'field', pos: '1B' },
  { key: '2B', label: 'Second Base', short: '2B', type: 'field', pos: '2B' },
  { key: '3B', label: 'Third Base', short: '3B', type: 'field', pos: '3B' },
  { key: 'SS', label: 'Shortstop', short: 'SS', type: 'field', pos: 'SS' },
  { key: 'LF', label: 'Left Field', short: 'LF', type: 'field', pos: 'LF' },
  { key: 'CF', label: 'Center Field', short: 'CF', type: 'field', pos: 'CF' },
  { key: 'RF', label: 'Right Field', short: 'RF', type: 'field', pos: 'RF' },
  { key: 'DH', label: 'Designated Hitter', short: 'DH', type: 'dh' },
  { key: 'SP1', label: 'Starter 1', short: 'SP', type: 'SP' },
  { key: 'SP2', label: 'Starter 2', short: 'SP', type: 'SP' },
  { key: 'SP3', label: 'Starter 3', short: 'SP', type: 'SP' },
  { key: 'RP1', label: 'Reliever 1', short: 'RP', type: 'RP' },
  { key: 'RP2', label: 'Reliever 2', short: 'RP', type: 'RP' },
]
export const LINEUP_KEYS = ['C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH']
export const SP_KEYS = ['SP1', 'SP2', 'SP3']
export const RP_KEYS = ['RP1', 'RP2']
export const FIELD_SECTIONS = [
  { pos: 'C', title: 'Catchers' },
  { pos: '1B', title: 'First Base' },
  { pos: '2B', title: 'Second Base' },
  { pos: '3B', title: 'Third Base' },
  { pos: 'SS', title: 'Shortstop' },
  { pos: 'LF', title: 'Left Field' },
  { pos: 'CF', title: 'Center Field' },
  { pos: 'RF', title: 'Right Field' },
]

export const GRADE_COLOR: Record<Grade, string> = {
  A: '#22c55e',
  B: '#84cc16',
  C: '#eab308',
  D: '#f97316',
  F: '#ef4444',
}
export const GRADE_SCORE: Record<Grade, number> = { A: 4, B: 3, C: 2, D: 1, F: 0 }

export const POS_LABEL: Record<string, string> = {
  C: 'catcher',
  '1B': 'first base',
  '2B': 'second base',
  '3B': 'third base',
  SS: 'shortstop',
  LF: 'left field',
  CF: 'center field',
  RF: 'right field',
  DH: 'DH',
}
