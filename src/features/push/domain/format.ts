export function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export const ipToDecimal = (v: unknown) => {
  const s = String(v ?? '0')
  if (!s.includes('.')) return parseInt(s, 10) || 0
  const [f, o] = s.split('.').map((n) => parseInt(n, 10) || 0)
  return f + o / 3
}
