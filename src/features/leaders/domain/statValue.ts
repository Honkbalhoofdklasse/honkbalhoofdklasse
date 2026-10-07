import type { Row } from './types'

const LABEL_OVERRIDE: Record<string, string> = {
  PITCH_APPEAR: 'App',
  PITCH_SHO: 'SHO',
  PITCH_SHA: 'SHA',
  PITCH_SFA: 'SFA',
  PITCH_WP: 'WP',
  PITCH_HBP: 'HBP',
  PITCH_IBB: 'IBB',
  PITCH_BK: 'BK',
}

export function parseLabel(raw: string): { stat: string; qualifier: string | null } {
  if (LABEL_OVERRIDE[raw]) return { stat: LABEL_OVERRIDE[raw], qualifier: null }
  const match = raw.match(/^(.+?)(?:\s+\((.+?)\))?$/)
  return { stat: match?.[1]?.trim() ?? raw, qualifier: match?.[2] ?? null }
}

function formatIp(v: unknown): string {
  const n = Number(v)
  if (!n && n !== 0) return '-'
  if (Number.isInteger(n)) return `${Math.floor(n / 3)}.${n % 3}`
  return n.toFixed(1)
}

export function getStatValue(type: string, p: Row): string {
  const s = (v: unknown) => (v != null && v !== '' ? String(v) : '-')
  const map: Record<string, () => string> = {
    avg: () => s(p.avg),
    slg: () => s(p.slg),
    obp: () => s(p.obp),
    ops: () => s(p.ops),
    bavg: () => s(p.bavg),
    r: () => s(p.r),
    h: () => s(p.h),
    rbi: () => s(p.rbi),
    double: () => s(p.double),
    triple: () => s(p.triple),
    hr: () => s(p.hr),
    bb: () => s(p.bb),
    hbp: () => s(p.hbp),
    sh: () => s(p.sh),
    sf: () => s(p.sf),
    sb: () => s(p.sb),
    pa: () => s(p.pa),
    ab: () => s(p.ab),
    cs: () => s(p.cs),
    so: () => s(p.so),
    kl: () => s(p.kl),
    gdp: () => s(p.gdp),
    era: () => s(p.era),
    pitch_ip: () => formatIp(p.pitch_ip),
    pitch_er: () => s(p.pitch_er),
    pitch_bb: () => s(p.pitch_bb),
    pitch_so: () => s(p.pitch_so),
    pitch_win: () => s(p.pitch_win),
    pitch_save: () => s(p.pitch_save),
    pitch_appear: () => s(p.pitch_appear),
    pitch_gs: () => s(p.pitch_gs),
    pitch_cg: () => s(p.pitch_cg),
    pitch_sho: () => s(p.pitch_sho),
    pitch_sha: () => s(p.pitch_sha),
    pitch_sfa: () => s(p.pitch_sfa),
    pitch_loss: () => s(p.pitch_loss),
    pitch_wp: () => s(p.pitch_wp),
    pitch_hbp: () => s(p.pitch_hbp),
    pitch_ibb: () => s(p.pitch_ibb),
    pitch_h: () => s(p.pitch_h),
    pitch_r: () => s(p.pitch_r),
    pitch_ab: () => s(p.pitch_ab),
    pitch_ground: () => s(p.pitch_ground),
    pitch_fly: () => s(p.pitch_fly),
    pitch_bk: () => s(p.pitch_bk),
  }
  return map[type]?.() ?? '-'
}

export function assignRanks(players: Row[]): string[] {
  const positions: (number | '-')[] = players.map((p) => {
    const pos = p.position
    return pos === '-' || pos === undefined ? '-' : Number(pos)
  })
  const hasTie = new Set<number>()
  let lastNum = 1
  for (const pos of positions) {
    if (pos === '-') hasTie.add(lastNum)
    else lastNum = pos
  }
  lastNum = 1
  return positions.map((pos) => {
    if (pos === '-') return `T${lastNum}`
    lastNum = pos
    return hasTie.has(lastNum) ? `T${lastNum}` : String(lastNum)
  })
}
