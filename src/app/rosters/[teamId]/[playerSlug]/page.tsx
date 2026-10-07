import { ROSTERS, slugify } from '@/shared/rosters/rosters-data'
import type { Metadata } from 'next'
import { buildPlayerProfileMetadata } from '@/features/rosters/api/playerProfileMetadata'
import PlayerProfileScreen from '@/features/rosters/screens/PlayerProfileScreen'

export const revalidate = 86400

export async function generateMetadata({
  params,
}: {
  params: Promise<{ teamId: string; playerSlug: string }>
}): Promise<Metadata> {
  const { teamId, playerSlug } = await params
  return buildPlayerProfileMetadata(teamId, playerSlug)
}

export function generateStaticParams() {
  const params: { teamId: string; playerSlug: string }[] = []
  for (const [teamId, roster] of Object.entries(ROSTERS)) {
    for (const player of roster.players) {
      params.push({ teamId, playerSlug: slugify(player.name) })
    }
  }
  return params
}

export default function PlayerProfilePage({
  params,
}: {
  params: Promise<{ teamId: string; playerSlug: string }>
}) {
  return <PlayerProfileScreen params={params} />
}
