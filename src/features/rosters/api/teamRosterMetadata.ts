import type { Metadata } from 'next'
import { ROSTERS } from '@/shared/rosters/rosters-data'
import { TEAM_NAMES } from '@/shared/teams/teams'

export function buildTeamRosterMetadata(teamId: string): Metadata {
  const roster = ROSTERS[teamId]
  if (!roster) return {}
  const teamName = TEAM_NAMES[teamId] ?? teamId
  const playerNames = roster.players
    .slice(0, 6)
    .map((p) => p.name)
    .join(', ')
  const description = `${teamName} roster for the 2026 KNBSB Honkbal Hoofdklasse season. Players include ${playerNames} and more.`
  const canonical = `https://honkbalhoofdklasse.com/rosters/${teamId}`
  return {
    title: `${teamName} Roster 2026 | Honkbal Hoofdklasse`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${teamName} · Honkbal Hoofdklasse 2026`,
      description,
      url: canonical,
    },
  }
}
