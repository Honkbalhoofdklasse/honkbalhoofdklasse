import type { Metadata } from 'next'
import ScheduleScreen from '@/features/schedule/screens/ScheduleScreen'

export const metadata: Metadata = {
  title: 'Speelschema 2026',
  description:
    'Het volledige speelschema van de Honkbal Hoofdklasse 2026. Alle wedstrijden, datums en locaties.',
  alternates: { canonical: 'https://honkbalhoofdklasse.com/schema' },
}

export const revalidate = 120

export default function SchemaPage() {
  return <ScheduleScreen />
}
