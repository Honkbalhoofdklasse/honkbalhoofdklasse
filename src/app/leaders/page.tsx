import type { Metadata } from 'next'
import LeadersScreen from '@/features/leaders/screens/LeadersScreen'

export const metadata: Metadata = {
  title: 'Honkbal Hoofdklasse Statistieken 2026 | League Leaders',
  description:
    'Statistieken van de KNBSB Honkbal Hoofdklasse 2026. Batting average, home runs, RBI, ERA en meer per speler. Top batters en pitchers van Nederland.',
  alternates: { canonical: 'https://honkbalhoofdklasse.com/leaders' },
  openGraph: {
    title: 'Honkbal Hoofdklasse Statistieken 2026',
    description: 'Statistieken — batting, pitching, league leaders.',
    url: 'https://honkbalhoofdklasse.com/leaders',
  },
}

export const revalidate = 300

export default function LeadersPage() {
  return <LeadersScreen />
}
