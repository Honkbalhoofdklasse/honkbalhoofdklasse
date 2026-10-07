import type { Metadata } from 'next'
import { TEAM_IDS, TEAM_NAMES } from '@/shared/teams/teams'
import TeamScreen from '@/features/teams/screens/TeamScreen'

export const revalidate = 300

export async function generateStaticParams() {
  return TEAM_IDS.map((id) => ({ teamId: id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ teamId: string }>
}): Promise<Metadata> {
  const { teamId } = await params
  const name = TEAM_NAMES[teamId] ?? teamId
  return {
    title: `${name} | Honkbal Hoofdklasse 2026`,
    description: `Seizoensstatistieken voor ${name} in de KNBSB Honkbal Hoofdklasse 2026. Batting, pitching, roster en wedstrijdresultaten.`,
    alternates: { canonical: `https://honkbalhoofdklasse.com/teams/${teamId}` },
  }
}

export default function TeamPage({ params }: { params: Promise<{ teamId: string }> }) {
  return <TeamScreen params={params} />
}
