export type Row = Record<string, unknown>
export type Period = 'week' | 'month' | 'season' | 'semi' | 'final'
export type Category = 'hitting' | 'pitching'
export type OnSelect = (name: string, teamId: string, statType: 'batting' | 'pitching') => void

export type KnbsbCategory = {
  type: string
  label: string
  data: Row[]
}

export type SeasonLeaders = {
  batting: KnbsbCategory[]
  pitching: KnbsbCategory[]
}

export type TabData = {
  batters: Row[]
  battingQualified?: Row[]
  pitchers: Row[]
}

export type Col<T> = { label: string; value: (r: T) => string | number }
