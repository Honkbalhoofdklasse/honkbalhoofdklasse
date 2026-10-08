import type { Metadata } from 'next'
import { ROSTERS } from '@/shared/rosters/rosters-data'
import { buildTeamRosterMetadata } from '@/features/rosters/api/teamRosterMetadata'
import TeamRosterScreen from '@/features/rosters/screens/TeamRosterScreen'

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ teamId: string }>
}): Promise<Metadata> {
  const { teamId } = await params
  return buildTeamRosterMetadata(teamId)
}

export function generateStaticParams() {
  return Object.keys(ROSTERS).map((teamId) => ({ teamId }))
}

export default function TeamRosterPage({ params }: { params: Promise<{ teamId: string }> }) {
  return <TeamRosterScreen params={params} />
}
