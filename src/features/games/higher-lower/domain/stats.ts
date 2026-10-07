import type { HLPlayer, StatKey } from './types'

export const STATS: { key: StatKey; label: string; fmt: (v: number) => string }[] = [
  { key: 'avg', label: 'batting average', fmt: (v) => v.toFixed(3).replace(/^0\./, '.') },
  { key: 'ops', label: 'OPS', fmt: (v) => v.toFixed(3).replace(/^0\./, '.') },
  { key: 'rbi', label: 'RBIs', fmt: (v) => String(v) },
  { key: 'hr', label: 'home runs', fmt: (v) => String(v) },
  { key: 'sb', label: 'stolen bases', fmt: (v) => String(v) },
]

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr]
  let s = seed >>> 0
  for (let i = a.length - 1; i > 0; i--) {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0
    const j = s % (i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function buildStatSequence(seed: number, length: number): StatKey[] {
  const result: StatKey[] = []
  let s = seed
  while (result.length < length) {
    const shuffled = seededShuffle(
      STATS.map((st) => st.key),
      s++,
    )
    result.push(...shuffled)
  }
  return result
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 999983)
}

export function buildSequence(data: HLPlayer[], seed: number) {
  const rich = data.filter((p) => p.hr > 0 || p.sb > 0)
  const sparse = data.filter((p) => p.hr === 0 && p.sb === 0)
  return [...seededShuffle(rich, seed), ...seededShuffle(sparse, seed + 1)]
}
