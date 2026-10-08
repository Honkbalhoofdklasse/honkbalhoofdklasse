export function getAvailableMonths(): string[] {
  const now = new Date()
  const curYear = now.getFullYear()
  const curMonth = now.getMonth() + 1
  const months: string[] = []
  const d = new Date(2026, 3, 1)
  while (
    d.getFullYear() < curYear ||
    (d.getFullYear() === curYear && d.getMonth() + 1 <= curMonth)
  ) {
    months.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    d.setMonth(d.getMonth() + 1)
  }
  return months
}
