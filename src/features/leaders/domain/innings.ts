const OUTS_PER_INNING = 3
const MAX_PARTIAL_OUTS = 2

export function ipToOuts(v: unknown): number {
  const s = String(v ?? '0').trim()
  if (!s || s === '0') return 0
  if (s.includes('.')) {
    const [full, frac] = s.split('.').map((n) => parseInt(n, 10) || 0)
    return full * OUTS_PER_INNING + Math.min(frac, MAX_PARTIAL_OUTS)
  }
  return (parseInt(s, 10) || 0) * OUTS_PER_INNING
}
