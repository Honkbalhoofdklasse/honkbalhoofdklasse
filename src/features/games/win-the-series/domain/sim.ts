import {
  FINAL_WINS,
  LINEUP_KEYS,
  OFF_EXP,
  OPP_FINAL,
  OPP_SEMI,
  RA_FLOOR,
  REG_GAMES,
  RP_KEYS,
  SEMI_WINS,
  SP_KEYS,
} from './config'
import type { Data, Filled, Grade, HSHitter, HSPitcher, SeriesResult, Sim } from './types'

export const isPitcher = (x: HSHitter | HSPitcher): x is HSPitcher => 'era' in x
export const pkey = (p: { teamId: string; name: string }) => `${p.teamId}|${p.name}`
export const fmt3 = (v: number) => v.toFixed(3).replace(/^0\./, '.')
const winP = (rs: number, ra: number) => {
  const e = 1.83
  const a = rs ** e,
    b = ra ** e
  return a / (a + b)
}
const log5 = (a: number, b: number) => {
  const d = a + b - 2 * a * b
  return d <= 0 ? 0.5 : (a - a * b) / d
}
function simSeries(p: number, need: number): SeriesResult {
  let a = 0,
    b = 0
  while (a < need && b < need) Math.random() < p ? a++ : b++
  return { a, b, won: a >= need }
}
export function domColor(pct: number) {
  if (pct >= 0.85) return '#22c55e'
  if (pct >= 0.65) return '#84cc16'
  if (pct >= 0.45) return '#eab308'
  if (pct >= 0.25) return '#f97316'
  return '#ef4444'
}
export const firstOpen = (keys: string[], filled: Filled) => keys.find((k) => !filled[k]) ?? null

function champOdds(talent: number, cutoff: number, N = 2500): number {
  let ch = 0
  for (let i = 0; i < N; i++) {
    let w = 0
    for (let g = 0; g < REG_GAMES; g++) if (Math.random() < talent) w++
    if (w < cutoff) continue
    if (!simSeries(log5(talent, OPP_SEMI), SEMI_WINS).won) continue
    if (simSeries(log5(talent, OPP_FINAL), FINAL_WINS).won) ch++
  }
  return ch / N
}

export const offGrade = (r: number): Grade =>
  r >= 1.22 ? 'A' : r >= 1.1 ? 'B' : r >= 1.0 ? 'C' : r >= 0.92 ? 'D' : 'F'
export const armGrade = (era: number, lg: number): Grade => {
  const r = lg / era
  return r >= 1.38 ? 'A' : r >= 1.15 ? 'B' : r >= 1.0 ? 'C' : r >= 0.88 ? 'D' : 'F'
}

export const openHitterSlots = (h: HSHitter, filled: Filled) => [
  ...h.positions.filter((p) => !filled[p]),
  ...(!filled['DH'] ? ['DH'] : []),
]

export function simulateSeason(f: Filled, cut: number, data: Data): Sim {
  const hitters = LINEUP_KEYS.map((k) => f[k] as HSHitter)
  const sp = SP_KEYS.map((k) => f[k] as HSPitcher)
  const rp = RP_KEYS.map((k) => f[k] as HSPitcher)
  const lineupOps = hitters.reduce((s, h) => s + h.opsAdj, 0) / hitters.length
  const rs = data.leagueEra * (lineupOps / data.leagueOps) ** OFF_EXP
  const spEra = sp.reduce((s, p) => s + p.eraAdj, 0) / sp.length
  const rpEra = rp.reduce((s, p) => s + p.eraAdj, 0) / rp.length
  const staffEra = Math.max(RA_FLOOR, 0.7 * spEra + 0.3 * rpEra)
  const talent = winP(rs, staffEra)
  let wins = 0
  for (let i = 0; i < REG_GAMES; i++) if (Math.random() < talent) wins++
  const madePlayoffs = wins >= cut
  let semi: SeriesResult | null = null,
    fin: SeriesResult | null = null,
    champion = false
  if (madePlayoffs) {
    semi = simSeries(log5(talent, OPP_SEMI), SEMI_WINS)
    if (semi.won) {
      fin = simSeries(log5(talent, OPP_FINAL), FINAL_WINS)
      champion = fin.won
    }
  }
  let weakBat = { pos: LINEUP_KEYS[0], name: hitters[0].name, ops: hitters[0].ops }
  LINEUP_KEYS.forEach((k, i) => {
    if (hitters[i].ops < weakBat.ops)
      weakBat = { pos: k, name: hitters[i].name, ops: hitters[i].ops }
  })
  return {
    cutoff: cut,
    wins,
    losses: REG_GAMES - wins,
    madePlayoffs,
    semi,
    final: fin,
    champion,
    rs,
    staffEra,
    lineupOps,
    spEra,
    rpEra,
    talent,
    titleOdds: champOdds(talent, cut),
    weakBat,
  }
}
