import type { Metadata } from 'next'
import { ROSTERS, slugify } from '@/shared/rosters/rosters-data'
import { TEAM_NAMES } from '@/shared/teams/teams'
import { POS_LABELS } from '../domain/teamRosterMeta'

export function buildPlayerProfileMetadata(teamId: string, playerSlug: string): Metadata {
  const roster = ROSTERS[teamId]
  if (!roster) return {}
  const player = roster.players.find((p) => slugify(p.name) === playerSlug)
  if (!player) return {}
  const teamName = TEAM_NAMES[teamId] ?? teamId
  const posLabel = POS_LABELS[player.pos] ?? player.pos
  const description = `${player.name} is a ${posLabel} for ${teamName} in the 2026 KNBSB Honkbal Hoofdklasse. #${player.uniform} · B/T ${player.bt} · Born ${player.yob}.`
  const canonical = `https://honkbalhoofdklasse.com/rosters/${teamId}/${playerSlug}`
  return {
    title: `${player.name} – ${posLabel} | ${teamName} | Honkbal Hoofdklasse 2026`,
    description,
    alternates: { canonical },
    openGraph: {
      title: `${player.name} · ${teamName} · Honkbal Hoofdklasse`,
      description,
      url: canonical,
    },
  }
}
