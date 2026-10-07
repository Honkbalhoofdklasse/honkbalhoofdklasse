import type { Metadata } from 'next'
import StandingsScreen from '@/features/standings/screens/StandingsScreen'

export const metadata: Metadata = {
  title: 'Stand Honkbal Hoofdklasse 2026 | Actuele Klassement',
  description:
    'De actuele stand van de KNBSB Honkbal Hoofdklasse 2026. Bekijk wins, losses en winning percentage van Neptunus, Pirates, Kinheim, HCAW, Twins, Pioniers en UVV.',
  alternates: { canonical: 'https://honkbalhoofdklasse.com/stand' },
  openGraph: {
    title: 'Stand Honkbal Hoofdklasse 2026',
    description: 'Actuele klassement van de KNBSB Honkbal Hoofdklasse.',
    url: 'https://honkbalhoofdklasse.com/stand',
  },
}

export const revalidate = 300

export default function StandPage() {
  return <StandingsScreen />
}
