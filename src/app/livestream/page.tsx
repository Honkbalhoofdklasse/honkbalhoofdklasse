import type { Metadata } from 'next'
import LivestreamScreen from '@/features/social/screens/LivestreamScreen'

export const metadata: Metadata = {
  title: 'Livestream',
  description:
    'Bekijk live honkbalwedstrijden van de Honkbal Hoofdklasse via de Hoofdklasse livestream.',
  alternates: { canonical: 'https://honkbalhoofdklasse.com/livestream' },
}

export const revalidate = 60

export default function LivestreamPage() {
  return <LivestreamScreen />
}
