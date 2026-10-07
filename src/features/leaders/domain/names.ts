import type { Row } from './types'

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

export function formatDutchLastname(raw: string): string {
  const words = raw.split(' ')
  return words
    .map((word, i) => {
      const lower = word.toLowerCase()
      if (i < words.length - 1 && TUSSENVOEGSELS.has(lower)) return lower
      return lower.charAt(0).toUpperCase() + lower.slice(1)
    })
    .join(' ')
}

export function formatFullName(full: string): string {
  const words = full.trim().split(/\s+/)
  if (words.length === 0) return full
  const first = words[0].toLowerCase()
  const firstCapitalized = first.charAt(0).toUpperCase() + first.slice(1)
  if (words.length === 1) return firstCapitalized
  return `${firstCapitalized} ${formatDutchLastname(words.slice(1).join(' '))}`
}

export function parseKnbsbName(player: Row): string {
  const nameHtml = String(player.name ?? '')
  if (nameHtml) {
    const parts = nameHtml
      .replace(/<[^>]+>/g, '|')
      .split('|')
      .map((s) => s.trim())
      .filter(Boolean)
    if (parts.length >= 2) return `${parts[1]} ${formatDutchLastname(parts[0])}`
  }
  const first = String(player.firstname ?? '').split(' ')[0]
  const last = formatDutchLastname(String(player.lastname ?? ''))
  return `${first} ${last}`.trim()
}
