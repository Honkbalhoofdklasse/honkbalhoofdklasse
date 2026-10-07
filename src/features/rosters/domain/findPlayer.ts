import { ROSTERS, slugify } from '@/shared/rosters/rosters-data'

export function findPlayer(slug: string) {
  for (const [teamId, roster] of Object.entries(ROSTERS)) {
    for (const player of roster.players) {
      if (slugify(player.name) === slug) {
        return { player, teamId }
      }
    }
  }
  return null
}

export function calcAge(yob: number): number {
  return new Date().getFullYear() - yob
}
