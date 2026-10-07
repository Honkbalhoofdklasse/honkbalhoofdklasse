export function mapTeamFromLabel(label: string): string | null {
  const l = (label ?? '').toLowerCase()
  if (l.includes('neptunus')) return 'neptunus'
  if (l.includes('pirate') || l.includes('amsterdam')) return 'pirates'
  if (l.includes('kinheim')) return 'kinheim'
  if (l.includes('hcaw')) return 'hcaw'
  if (l.includes('twin') || l.includes('oosterhout')) return 'twins'
  if (l.includes('pionier')) return 'pioniers'
  if (l.includes('uvv')) return 'uvv'
  return null
}
export function mapTeamFromIoc(ioc: string): string | null {
  const map: Record<string, string> = {
    TWI: 'twins',
    NEP: 'neptunus',
    HCA: 'hcaw',
    KIN: 'kinheim',
    PIO: 'pioniers',
    PIR: 'pirates',
    UVV: 'uvv',
    AMS: 'pirates',
  }
  return map[ioc] ?? null
}
export function formatPitcherName(fullName: string): string {
  const parts = (fullName ?? '').split(' ')
  if (parts.length < 2) return fullName
  const lastName = parts[0]
  const firstName = parts.slice(1).join(' ')
  const lastCap = lastName.charAt(0) + lastName.slice(1).toLowerCase()
  return `${firstName} ${lastCap}`
}
