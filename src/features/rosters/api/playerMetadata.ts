import type { Metadata } from 'next'
import { fetchPlayerPhotos } from '@/shared/rosters/player-stats'
import { TEAM_NAMES } from '@/shared/teams/teams'
import { findPlayer } from '../domain/findPlayer'

export async function buildPlayerMetadata(slug: string): Promise<Metadata> {
  const found = findPlayer(slug)
  if (!found) return {}
  const { player, teamId } = found
  const teamName = TEAM_NAMES[teamId] ?? teamId
  const photos = await fetchPlayerPhotos(player.name)
  const ogImage =
    photos?.headshot_url ?? photos?.banner_url ?? 'https://honkbalhoofdklasse.com/og-image.png'
  const description = `${player.name} · ${player.pos} · ${teamName} · Honkbal Hoofdklasse 2026`
  return {
    title: `${player.name} | Honkbal Hoofdklasse`,
    description,
    alternates: { canonical: `https://honkbalhoofdklasse.com/players/${slug}` },
    openGraph: {
      title: `${player.name} | Honkbal Hoofdklasse`,
      description,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title: player.name },
  }
}
