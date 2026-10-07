export function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
  })
}
