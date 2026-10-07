import type { Metadata } from 'next'
import RostersScreen from '@/features/rosters/screens/RostersScreen'

export const metadata: Metadata = {
  title: 'Rosters 2026',
  description:
    'Alle rosters van de Honkbal Hoofdklasse 2026. Spelers, posities en coaching staff per team.',
  alternates: { canonical: 'https://honkbalhoofdklasse.com/rosters' },
}

export const revalidate = false // static data — no revalidation needed

export default function RostersPage() {
  return <RostersScreen />
}
