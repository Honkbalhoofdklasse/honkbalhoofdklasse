import type { Metadata } from 'next'
import { NotificatiesScreen } from '@/features/push/screens/NotificatiesScreen'

export const metadata: Metadata = {
  title: 'Set up notifications | Honkbal Hoofdklasse',
  description:
    'Get live push notifications for the Honkbal Hoofdklasse. Add the app to your home screen on iPhone or Android and never miss a home run.',
  alternates: { canonical: 'https://honkbalhoofdklasse.com/notificaties' },
}

export default function NotificatiesPage() {
  return <NotificatiesScreen />
}
