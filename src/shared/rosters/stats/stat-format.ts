export function num(v: unknown): number {
  const x = Number(v)
  return isNaN(x) ? 0 : x
}

export function fmtIp(v: unknown): string {
  const raw = String(v ?? '')
  if (raw.includes('.')) return raw === '0.0' ? '0.0' : raw
  const n = Number(raw)
  if (isNaN(n) || n === 0) return '0.0'
  return `${Math.floor(n / 3)}.${n % 3}`
}

export function ipToInnings(v: unknown): number {
  const raw = String(v ?? '').trim()
  if (!raw || raw === '0' || raw === '0.0') return 0
  if (raw.includes('.')) {
    const [full, outs] = raw.split('.').map((s) => Number(s) || 0)
    return full + outs / 3
  }
  const n = Number(raw)
  if (isNaN(n) || n === 0) return 0
  return Math.floor(n / 3) + (n % 3) / 3
}
