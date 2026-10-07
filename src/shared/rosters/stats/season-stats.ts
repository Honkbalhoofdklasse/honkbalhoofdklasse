export type SeasonStats = {
  ab: number
  h: number
  hr: number
  rbi: number
  r: number
  bb: number
  so: number
  double: number
  triple: number
  sb: number
  sf: number
  sh: number
  hbp: number
  pa: number
  ibb: number
  cs: number
  gdp: number
  avg: number | null
  obp: number | null
  slg: number | null
  ops: number | null
  pitch_ip: string
  pitch_gs: number
  pitch_er: number
  pitch_so: number
  pitch_bb: number
  pitch_h: number
  pitch_r: number
  pitch_win: number
  pitch_loss: number
  pitch_save: number
  pitch_appear: number
  pitch_cg: number
  pitch_sho: number
  pitch_bf: number
  pitch_hr: number
  pitch_hbp: number
  pitch_ibb: number
  pitch_wp: number
  pitch_bk: number
  era: number | null
  whip: number | null
  games: number
}

export const ZERO_STATS: SeasonStats = {
  ab: 0,
  h: 0,
  hr: 0,
  rbi: 0,
  r: 0,
  bb: 0,
  so: 0,
  double: 0,
  triple: 0,
  sb: 0,
  sf: 0,
  sh: 0,
  hbp: 0,
  pa: 0,
  ibb: 0,
  cs: 0,
  gdp: 0,
  games: 0,
  avg: null,
  obp: null,
  slg: null,
  ops: null,
  pitch_ip: '0.0',
  pitch_gs: 0,
  pitch_er: 0,
  pitch_so: 0,
  pitch_bb: 0,
  pitch_h: 0,
  pitch_r: 0,
  pitch_win: 0,
  pitch_loss: 0,
  pitch_save: 0,
  pitch_appear: 0,
  pitch_cg: 0,
  pitch_sho: 0,
  pitch_bf: 0,
  pitch_hr: 0,
  pitch_hbp: 0,
  pitch_ibb: 0,
  pitch_wp: 0,
  pitch_bk: 0,
  era: null,
  whip: null,
}

export type PlayerPhotos = {
  banner_url: string | null
  headshot_url: string | null
  banner_focal_x: number | null
  banner_focal_y: number | null
} | null
