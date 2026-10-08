export function formatTime(ts: string) {
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
