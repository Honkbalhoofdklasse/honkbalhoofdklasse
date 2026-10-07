import type { Metadata } from 'next'
import { NieuwsScreen } from '@/features/news/screens/NieuwsScreen'

export const metadata: Metadata = {
  title: 'Nieuws',
  description: 'Het laatste honkbalnieuws uit de KNBSB Hoofdklasse.',
  alternates: { canonical: 'https://honkbalhoofdklasse.com/nieuws' },
}

export const revalidate = 300

export default async function NieuwsPage() {
  return <NieuwsScreen />
}
