import { ROSTERS } from '@/shared/rosters/rosters-data'

export function findRosterPlayer(name: string) {
  const norm = name.toLowerCase().trim()
  for (const [teamId, roster] of Object.entries(ROSTERS)) {
    const p = roster.players.find((p) => p.name.toLowerCase() === norm)
    if (p) return { ...p, teamId }
  }
  return null
}

export type RosterPlayer = ReturnType<typeof findRosterPlayer>
