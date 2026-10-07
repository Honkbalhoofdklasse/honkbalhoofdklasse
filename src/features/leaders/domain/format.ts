export const fmt = (v: unknown) => (v != null ? String(v) : '-')
export const fmtRate = (v: unknown) => (v != null ? Number(v).toFixed(3).replace('0.', '.') : '-')
export const fmtIp = (v: unknown) => (v != null ? String(v) : '-')

export function ipToDec(v: unknown): number {
  const s = String(v ?? '0')
  if (s.includes('.')) {
    const [f, o] = s.split('.').map((n) => parseInt(n, 10) || 0)
    return f + o / 3 // baseball: .1 = 1 out = 1/3 inning
  }
  return parseInt(s, 10) || 0 // integer = full innings (e.g. 19 = 19.0 IP)
}

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export function formatMonth(ym: string): string {
  const [year, m] = ym.split('-').map(Number)
  return `${MONTH_NAMES[m - 1]} ${year}`
}

export function currentMonthPrefix(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}
