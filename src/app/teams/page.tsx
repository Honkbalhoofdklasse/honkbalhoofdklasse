import type { Metadata } from 'next'
import TeamsScreen from '@/features/teams/screens/TeamsScreen'

export const metadata: Metadata = {
  title: 'Teams | Honkbal Hoofdklasse 2026',
  description:
    'Teamstatistieken van alle 7 clubs in de KNBSB Honkbal Hoofdklasse 2026. Batting average, ERA, runs en meer per team.',
  alternates: { canonical: 'https://honkbalhoofdklasse.com/teams' },
}

export const revalidate = 300

export default function TeamsPage() {
  return <TeamsScreen />
}
