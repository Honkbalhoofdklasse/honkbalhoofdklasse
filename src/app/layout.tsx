import type { Metadata } from 'next'
import { Barlow_Condensed, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import NavBar from '@/shared/ui/NavBar'
import SiteFooter from '@/shared/ui/footer/SiteFooter'
import SponsorMarquee from '@/shared/ui/footer/SponsorMarquee'
import ServiceWorkerRegistrar from '@/shared/ui/ServiceWorkerRegistrar'
import { LanguageProvider } from '@/shared/i18n/language'
import './globals.css'

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://honkbalhoofdklasse.com'),
  title: {
    default: 'Honkbal Hoofdklasse | Standen, Scores & Stats',
    template: '%s | Honkbal Hoofdklasse',
  },
  description:
    'Alles over de KNBSB Honkbal Hoofdklasse: live scores, standen, statistieken, rosters en nieuws van Neptunus, Pirates, Kinheim, HCAW, Twins, Pioniers en UVV.',
  keywords: [
    'honkbal hoofdklasse',
    'KNBSB hoofdklasse',
    'honkbal nederland',
    'hoofdklasse standen',
    'hoofdklasse scores',
    'neptunus honkbal',
    'amsterdam pirates',
    'kinheim',
    'HCAW',
    'oosterhout twins',
    'hoofddorp pioniers',
    'UVV honkbal',
  ],
  authors: [{ name: 'Honkbal Hoofdklasse' }],
  creator: 'Honkbal Hoofdklasse',
  publisher: 'Honkbal Hoofdklasse',
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: 'website',
    locale: 'nl_NL',
    url: 'https://honkbalhoofdklasse.com',
    siteName: 'Honkbal Hoofdklasse',
    title: 'Honkbal Hoofdklasse | Standen, Scores & Stats',
    description:
      'Alles over de KNBSB Honkbal Hoofdklasse: live scores, standen, statistieken en nieuws.',
    images: [
      {
        url: 'https://res.cloudinary.com/dn8c5398m/image/upload/q_auto/f_auto/v1781607525/hk_logo_iets_groter_tumykq.png',
        width: 1200,
        height: 630,
        alt: 'Honkbal Hoofdklasse',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Honkbal Hoofdklasse | Standen, Scores & Stats',
    description: 'Live scores, standen en statistieken van de KNBSB Honkbal Hoofdklasse.',
    images: [
      'https://res.cloudinary.com/dn8c5398m/image/upload/q_auto/f_auto/v1781607525/hk_logo_iets_groter_tumykq.png',
    ],
  },
  alternates: { canonical: 'https://honkbalhoofdklasse.com' },
}

const schemaOrg = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SportsOrganization',
      '@id': 'https://honkbalhoofdklasse.com/#league',
      name: 'KNBSB Honkbal Hoofdklasse',
      alternateName: 'Honkbal Hoofdklasse',
      url: 'https://honkbalhoofdklasse.com',
      logo: 'https://res.cloudinary.com/dn8c5398m/image/upload/q_auto/f_auto/v1781607525/hk_logo_iets_groter_tumykq.png',
      sport: 'Baseball',
      description:
        'The highest baseball competition in the Netherlands, organised by the KNBSB. Teams: Curaçao Neptunus, Amsterdam Pirates, Kinheim, HCAW, Oosterhout Twins, Hoofddorp Pioniers and UVV.',
      location: { '@type': 'Country', name: 'Netherlands' },
      memberOf: { '@type': 'SportsOrganization', name: 'KNBSB', url: 'https://knbsb.nl' },
      sameAs: [
        'https://www.instagram.com/honkbalhoofdklasse/',
        'https://www.tiktok.com/@honkbalhoofdklasse',
        'https://www.youtube.com/@Honkbalhoofdklasse',
        'https://www.facebook.com/profile.php?id=61579476197609',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://honkbalhoofdklasse.com/#website',
      url: 'https://honkbalhoofdklasse.com',
      name: 'Honkbal Hoofdklasse',
      description:
        'Live scores, standings, statistics and news from the KNBSB Honkbal Hoofdklasse.',
      inLanguage: 'en',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://honkbalhoofdklasse.com/leaders?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlowCondensed.variable} ${inter.variable}`}>
      <head>
        <link
          rel="apple-touch-icon"
          href="https://res.cloudinary.com/dn8c5398m/image/upload/q_auto,w_180,h_180,c_fill/f_auto/v1781608197/APP_LOGO_juysrd.png"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Hoofdklasse" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-85LWJHPVS1"></script>
        <script async src="/gtag.js"></script>
      </head>
      <body>
        <LanguageProvider>
          <NavBar />

          <main className="pt-20">{children}</main>

          {/* Sponsor balk */}
          <SponsorMarquee />
        </LanguageProvider>
        <SiteFooter />
        <Analytics />
        <ServiceWorkerRegistrar />
      </body>
    </html>
  )
}
