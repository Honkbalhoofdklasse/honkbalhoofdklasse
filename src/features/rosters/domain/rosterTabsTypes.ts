export const TEAM_ORDER = ['neptunus', 'pirates', 'kinheim', 'hcaw', 'twins', 'pioniers', 'uvv']

export type Section = { label: string; short: string; filter: (pos: string) => boolean }

export const SECTIONS: Section[] = [
  { label: 'Pitchers', short: 'P', filter: (pos) => pos === 'P' },
  { label: 'Catchers', short: 'C', filter: (pos) => pos === 'C' },
  { label: 'Infield', short: 'IF', filter: (pos) => pos === 'IF' || pos === 'C/IF' },
  { label: 'Outfield', short: 'OF', filter: (pos) => pos === 'OF' },
  { label: 'Utility', short: 'UTL', filter: (pos) => pos === 'UTL' || pos === 'DH' },
]

export type SelectedPlayer = { name: string; teamId: string; statType: 'batting' | 'pitching' }

export type NewPlayer = { name: string; pos: string; uniform: string; bt: string; yob: number }
