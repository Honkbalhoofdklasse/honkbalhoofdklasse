import type { Metadata } from 'next'
import AwardsScreen from '@/features/awards/screens/AwardsScreen'

export const metadata: Metadata = {
  title: 'Awards 2026',
  description:
    'De awards van de Honkbal Hoofdklasse 2026. Hottest Player, Pitcher en Hitter of the Month.',
  alternates: { canonical: 'https://honkbalhoofdklasse.com/awards' },
}

export const revalidate = false

export default function AwardsPage() {
  return <AwardsScreen />
}
