import type { CmpPlayer } from '../api/compareRoute'

export const RADAR_AXES: { key: keyof CmpPlayer; label: string }[] = [
  { key: 'avg', label: 'AVG' },
  { key: 'ops', label: 'OPS' },
  { key: 'hr', label: 'HR' },
  { key: 'rbi', label: 'RBI' },
  { key: 'sb', label: 'SB' },
]

function percentile(player: CmpPlayer, key: keyof CmpPlayer, all: CmpPlayer[]): number {
  const val = player[key] as number
  const below = all.filter((p) => (p[key] as number) < val).length
  return all.length > 1 ? below / (all.length - 1) : 0
}

export function radarPoints(
  player: CmpPlayer,
  all: CmpPlayer[],
  cx: number,
  cy: number,
  R: number,
): string {
  return RADAR_AXES.map(({ key }, i) => {
    const pct = percentile(player, key, all)
    const angle = (2 * Math.PI * i) / RADAR_AXES.length - Math.PI / 2
    const r = Math.max(pct * R, 4)
    return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
  }).join(' ')
}

export function gridPoints(level: number, cx: number, cy: number, R: number): string {
  return RADAR_AXES.map((_, i) => {
    const angle = (2 * Math.PI * i) / RADAR_AXES.length - Math.PI / 2
    return `${cx + level * R * Math.cos(angle)},${cy + level * R * Math.sin(angle)}`
  }).join(' ')
}

export const RADAR_C1 = '#fe3d00'
export const RADAR_C2 = '#38bdf8'
