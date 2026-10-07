import { avg, d, ip } from './format'
import type { SeasonStats } from './types'

export function buildBatRow(st: SeasonStats | null) {
  // Build batting stat row
  // G, PA, AB, R, H, 2B, 3B, HR, RBI, BB, IBB, HBP, SO, SB, CS, SF, SH, GDP, AVG, OBP, SLG, OPS
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
  // Build pitching stat row
  // App, GS, CG, SHO, IP, W, L, SV, BF, H, R, ER, BB, IBB, HBP, HR, SO, WP, BK, ERA, WHIP
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
