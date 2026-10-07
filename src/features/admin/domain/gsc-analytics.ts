export type Totals = { clicks: number; impressions: number; ctr: number; position: number }
export type Point = { date: string; clicks: number; impressions: number }
export type QueryRow = {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}
export type PageRow = {
  page: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}
export type GeoRow = { country: string; clicks: number; impressions: number }
export type DeviceRow = { device: string; clicks: number; impressions: number }

export type GscData = {
  totals: Totals
  timeseries: Point[]
  queries: QueryRow[]
  pages: PageRow[]
  countries: GeoRow[]
  devices: DeviceRow[]
  error?: string
}

export const COUNTRY_NAMES: Record<string, string> = {
  nld: 'Netherlands',
  deu: 'Germany',
  bel: 'Belgium',
  jpn: 'Japan',
  usa: 'United States',
  gbr: 'United Kingdom',
  fra: 'France',
  abw: 'Aruba',
  ven: 'Venezuela',
  aus: 'Australia',
  can: 'Canada',
  esp: 'Spain',
  cur: 'Curaçao',
  ita: 'Italy',
  tha: 'Thailand',
  kor: 'South Korea',
}

export const DEVICE_NAMES: Record<string, string> = {
  MOBILE: 'Mobile',
  DESKTOP: 'Desktop',
  TABLET: 'Tablet',
}

export function fmtNum(n: number): string {
  return Math.round(n).toLocaleString()
}
