import { ROSTERS, type Player } from '@/shared/rosters/rosters-data'
import { TEAM_LOGOS } from '@/shared/teams/teams'

// ── Criterion types ────────────────────────────────────────────────────────────

export type Criterion =
  | { type: 'team'; teamId: string; label: string; logo: string }
  | { type: 'position'; positions: string[]; label: string; icon: string }
  | { type: 'bats'; value: string; label: string; icon: string }
  | { type: 'throws'; value: string; label: string; icon: string }
  | { type: 'yob_max'; year: number; label: string; icon: string }
  | { type: 'yob_min'; year: number; label: string; icon: string }

function team(id: string, label: string): Criterion {
  return { type: 'team', teamId: id, label, logo: TEAM_LOGOS[id] }
}

// Pre-built criteria
export const C = {
  // Teams
  neptunus: team('neptunus', 'Neptunus'),
  pirates: team('pirates', 'Amsterdam Pirates'),
  kinheim: team('kinheim', 'Kinheim'),
  hcaw: team('hcaw', 'HCAW'),
  twins: team('twins', 'Oosterhout Twins'),
  pioniers: team('pioniers', 'Hoofddorp Pioniers'),
  uvv: team('uvv', 'UVV'),

  // Position groups
  pitcher: { type: 'position', positions: ['P'], label: 'Pitcher', icon: '⚾' } as Criterion,
  catcher: {
    type: 'position',
    positions: ['C', 'C/IF'],
    label: 'Catcher',
    icon: '🧤',
  } as Criterion,
  infielder: {
    type: 'position',
    positions: ['IF', 'C/IF'],
    label: 'Infielder',
    icon: '🔷',
  } as Criterion,
  outfielder: {
    type: 'position',
    positions: ['OF', 'UTL', 'DH'],
    label: 'Outfielder',
    icon: '🌿',
  } as Criterion,
  nonPitcher: {
    type: 'position',
    positions: ['C', 'IF', 'OF', 'C/IF', 'UTL', 'DH'],
    label: 'Position Player',
    icon: '🏏',
  } as Criterion,

  // Handedness
  switchHitter: { type: 'bats', value: 'S', label: 'Switch Hitter', icon: '↔️' } as Criterion,
  leftBatter: { type: 'bats', value: 'L', label: 'Left-handed Batter', icon: '🫲' } as Criterion,
  rightBatter: { type: 'bats', value: 'R', label: 'Right-handed Batter', icon: '🫱' } as Criterion,
  leftThrower: {
    type: 'throws',
    value: 'L',
    label: 'Left-handed Pitcher',
    icon: '🤜',
  } as Criterion,
  rightThrower: {
    type: 'throws',
    value: 'R',
    label: 'Right-handed Pitcher',
    icon: '🤛',
  } as Criterion,

  // Age
  veteran: { type: 'yob_max', year: 1997, label: "Born '97 or Earlier", icon: '📅' } as Criterion,
  young: { type: 'yob_min', year: 2002, label: "Born '02 or Later", icon: '🌱' } as Criterion,
  mid: { type: 'yob_max', year: 2001, label: "Born '98–'01", icon: '📆' } as Criterion,
}

// ── Validity check ─────────────────────────────────────────────────────────────

export function playerMatchesCriterion(player: Player, teamId: string, crit: Criterion): boolean {
  switch (crit.type) {
    case 'team':
      return teamId === crit.teamId
    case 'position':
      return crit.positions.includes(player.pos)
    case 'bats':
      return player.bt.startsWith(crit.value)
    case 'throws':
      return player.bt.endsWith(crit.value)
    case 'yob_max':
      return player.yob <= crit.year
    case 'yob_min':
      return player.yob >= crit.year
  }
}

export function isValidAnswer(
  playerName: string,
  teamId: string,
  rowCrit: Criterion,
  colCrit: Criterion,
): boolean {
  const roster = ROSTERS[teamId]
  if (!roster) return false
  const player = roster.players.find((p) => p.name.toLowerCase() === playerName.toLowerCase())
  if (!player) return false
  return (
    playerMatchesCriterion(player, teamId, rowCrit) &&
    playerMatchesCriterion(player, teamId, colCrit)
  )
}

// Find all valid answers for a cell (used for autocomplete)
export function getValidPlayers(
  rowCrit: Criterion,
  colCrit: Criterion,
): { name: string; teamId: string }[] {
  const results: { name: string; teamId: string }[] = []
  for (const [teamId, roster] of Object.entries(ROSTERS)) {
    for (const player of roster.players) {
      if (
        playerMatchesCriterion(player, teamId, rowCrit) &&
        playerMatchesCriterion(player, teamId, colCrit)
      ) {
        results.push({ name: player.name, teamId })
      }
    }
  }
  return results
}
