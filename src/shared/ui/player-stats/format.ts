export function n(v: unknown): number {
  return isNaN(Number(v)) ? 0 : Number(v)
}
export function d(v: unknown, decimals = 0): string {
  if (v === null || v === undefined || v === '') return '—'
  const x = Number(v)
  if (isNaN(x) || (decimals === 0 && x === 0 && String(v) === '0'))
    return decimals === 0 ? '0' : '—'
  // Keep leading zero for ERA/whole-number decimals (0.00, not .00)
  return decimals > 0 ? x.toFixed(decimals) : String(x)
}
export function avg(v: unknown): string {
  if (v === null || v === undefined || v === '') return '—'
  const x = Number(v)
  if (isNaN(x)) return '—'
  return x.toFixed(3).replace(/^0\./, '.')
}
export function ip(v: unknown): string {
  const s = String(v ?? '')
  if (!s || s === '0.0') return '0.0'
  if (s.includes('.')) return s
  const x = Number(s)
  if (!x) return '0.0'
  return `${Math.floor(x / 3)}.${x % 3}`
}
