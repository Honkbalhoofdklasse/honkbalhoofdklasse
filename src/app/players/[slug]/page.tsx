import type { Metadata } from 'next'
import { ROSTERS, slugify } from '@/shared/rosters/rosters-data'
import { buildPlayerMetadata } from '@/features/rosters/api/playerMetadata'
import PlayerScreen from '@/features/rosters/screens/PlayerScreen'

export const revalidate = 1800

export function generateStaticParams() {
  const params: { slug: string }[] = []
  for (const roster of Object.values(ROSTERS)) {
    for (const player of roster.players) {
      params.push({ slug: slugify(player.name) })
    }
  }
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  return buildPlayerMetadata(slug)
}

export default function PlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  return <PlayerScreen params={params} />
}
