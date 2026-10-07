import type { Metadata } from 'next'
import HomeScreen from '@/features/home/screens/HomeScreen'

export const metadata: Metadata = {
  title: 'Honkbal Hoofdklasse 2026 | Live Scores, Standen & Stats',
  description:
    'Alles over de KNBSB Honkbal Hoofdklasse 2026: live scores, standen, statistieken, rosters en nieuws van Neptunus, Pirates, Kinheim, HCAW, Twins, Pioniers en UVV.',
  alternates: { canonical: 'https://honkbalhoofdklasse.com' },
  openGraph: {
    title: 'Honkbal Hoofdklasse 2026 | Live Scores, Standen & Stats',
    description:
      'Alles over de KNBSB Honkbal Hoofdklasse: live scores, standen, statistieken en nieuws.',
    url: 'https://honkbalhoofdklasse.com',
    images: [
      'https://res.cloudinary.com/dn8c5398m/image/upload/q_auto/f_auto/v1781607525/hk_logo_iets_groter_tumykq.png',
    ],
  },
}

export const revalidate = 120

export default function HomePage() {
  return <HomeScreen />
}
