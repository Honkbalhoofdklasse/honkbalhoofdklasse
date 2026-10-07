export const PLATFORM_ICONS: Record<string, string> = {
  youtube: '▶',
  twitch: '◈',
  other: '◉',
}

export function formatDateTime(dt: string) {
  const d = new Date(dt)
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
export function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
}
