export type GameDateLocale = 'en-US' | 'nl-NL'

export const DAY_MONTH: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
export const WEEKDAY_DAY_MONTH: Intl.DateTimeFormatOptions = {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
}
export const LONG_DAY_MONTH: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}
export const LONG_DATE: Intl.DateTimeFormatOptions = { ...LONG_DAY_MONTH, year: 'numeric' }

export function toLocalNoon(dateStr: string): Date {
  return new Date(dateStr + 'T12:00:00')
}

export function formatGameDate(
  dateStr: string,
  options: Intl.DateTimeFormatOptions,
  locale: GameDateLocale = 'en-US',
): string {
  return toLocalNoon(dateStr).toLocaleDateString(locale, options)
}
