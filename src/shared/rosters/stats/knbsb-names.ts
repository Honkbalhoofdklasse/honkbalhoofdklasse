import type { KnbsbCategory, Row } from './knbsb-fetch'

const TUSSENVOEGSELS = new Set([
  'van',
  'de',
  'den',
  'der',
  'het',
  'op',
  'aan',
  'ten',
  'ter',
  'in',
  'uit',
  'over',
  't',
  'vd',
  'la',
  'le',
  'los',
  'del',
])

export function fmtLast(raw: string): string {
  return raw
    .split(' ')
    .map((w, i, arr) => {
      const lower = w.toLowerCase()
      if (i < arr.length - 1 && TUSSENVOEGSELS.has(lower)) return lower
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(' ')
}

export function parseKnbsbName(p: Row): string {
  const html = String(p.name ?? '')
  if (html) {
    const parts = html
      .replace(/<[^>]+>/g, '|')
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean)
    if (parts.length >= 2) return `${parts[1]} ${fmtLast(parts[0])}`
  }
  const first = String(p.firstname ?? '').split(' ')[0]
  const last = fmtLast(String(p.lastname ?? ''))
  return `${first} ${last}`.trim()
}

export function normName(s: string) {
  return s.toLowerCase().trim().replace(/\s+/g, ' ')
}

export function findPlayer(categories: KnbsbCategory[], name: string): Row | null {
  const target = normName(name)
  const merged: Row = {}
  for (const cat of categories) {
    const found = (cat.data ?? []).find((p) => normName(parseKnbsbName(p)) === target)
    if (found) Object.assign(merged, found)
  }
  return Object.keys(merged).length > 0 ? merged : null
}

export function findInList(players: Row[], name: string): Row | null {
  const target = normName(name)
  return players.find((p) => normName(parseKnbsbName(p)) === target) ?? null
}
