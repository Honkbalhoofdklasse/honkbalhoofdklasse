import { avg, d, ip } from './format'
import type { SeasonStats } from './types'

export function buildBatRow(st: SeasonStats | null) {
  return st
    ? [
        d(st.games),
        d(st.pa),
        d(st.ab),
        d(st.r),
        d(st.h),
        d(st.double),
        d(st.triple),
        d(st.hr),
        d(st.rbi),
        d(st.bb),
        d(st.ibb),
        d(st.hbp),
        d(st.so),
        d(st.sb),
        d(st.cs),
        d(st.sf),
        d(st.sh),
        d(st.gdp),
        avg(st.avg),
        avg(st.obp),
        avg(st.slg),
        avg(st.ops),
      ]
    : []
}

export function buildPitRow(st: SeasonStats | null) {
  return st
    ? [
        d(st.pitch_appear),
        d(st.pitch_gs),
        d(st.pitch_cg),
        d(st.pitch_sho),
        ip(st.pitch_ip),
        d(st.pitch_win),
        d(st.pitch_loss),
        d(st.pitch_save),
        d(st.pitch_bf),
        d(st.pitch_h),
        d(st.pitch_r),
        d(st.pitch_er),
        d(st.pitch_bb),
        d(st.pitch_ibb),
        d(st.pitch_hbp),
        d(st.pitch_hr),
        d(st.pitch_so),
        d(st.pitch_wp),
        d(st.pitch_bk),
        d(st.era, 2),
        d(st.whip, 2),
      ]
    : []
}
