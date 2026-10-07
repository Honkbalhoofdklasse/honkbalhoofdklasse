export function getAvailableMonths(): string[] {
  const now = new Date()
  const curYear = now.getFullYear()
  const curMonth = now.getMonth() + 1 // 1-indexed
  // Season starts April 2026 — include all months up to and including the current one
  const months: string[] = []
  const d = new Date(2026, 3, 1) // April 2026
  while (
    d.getFullYear() < curYear ||
    (d.getFullYear() === curYear && d.getMonth() + 1 <= curMonth)
  ) {
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    d.setMonth(d.getMonth() + 1)
  }
  return months
}
