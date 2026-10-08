import { KNBSB_NUMERIC_ID_MAP } from '@/shared/teams/teams'

export const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

export const FRIENDLY_TO_KNBSB: Record<string, number> = Object.fromEntries(
  Object.entries(KNBSB_NUMERIC_ID_MAP).map(([k, v]) => [v, Number(k)]),
)

export const IOC_SHORT: Record<string, string> = {
  NEP: 'NEP',
  HCA: 'HCA',
  KIN: 'KIN',
  PIO: 'PIO',
  PIR: 'PIR',
  TWI: 'TWI',
  UVV: 'UVV',
  AMS: 'PIR',
}

export function fmtAvg(h: number, ab: number) {
  if (ab === 0) return '.---'
  return (h / ab).toFixed(3).replace('0.', '.')
}

export const ipToOuts = (v: unknown) => {
  const s = String(v ?? '0')
  if (!s || s === '0' || s === '0.0') return 0
  if (s.includes('.')) {
    const [f, o] = s.split('.').map((n) => parseInt(n, 10) || 0)
    return f * 3 + Math.min(o, 2)
  }
  return (parseInt(s, 10) || 0) * 3
}
export const outsToIp = (o: number) => `${Math.floor(o / 3)}.${o % 3}`

export type BatGame = {
  date: string
  opponent: string
  ab: number
  r: number
  h: number
  hr: number
  rbi: number
  bb: number
  so: number
  sb: number
}
export type PitGame = {
  date: string
  opponent: string
  outs: number
  k: number
  bb: number
  er: number
  h: number
  w: number
  l: number
}

export const fmtEra = (er: number, outs: number) =>
  outs === 0 ? '-.--' : ((er / outs) * 27).toFixed(2)
