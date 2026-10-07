// Postseason runs late Aug / Sep (CEST = UTC+2): a fixed offset gives a correct instant for every viewer.
export function feedDate(iso: string | null): Date | null {
  if (!iso) return null
  const d = new Date(`${iso.replace(' ', 'T')}+02:00`)
  return isNaN(d.getTime()) ? null : d
}
export const fmtDateTime = (iso: string | null) => {
  const d = feedDate(iso)
  if (!d) return 'TBD'
  return d.toLocaleString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Amsterdam',
  })
}
