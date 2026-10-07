import { ROSTERS } from '@/shared/rosters/rosters-data'

export const STATIC_PLAYERS = Object.entries(ROSTERS)
  .flatMap(([teamId, roster]) => roster.players.map((p) => ({ name: p.name, teamId })))
  .sort((a, b) => a.name.localeCompare(b.name))

export type PlayerPhoto = {
  player_name: string
  banner_url: string | null
  headshot_url: string | null
  banner_focal_x: number | null
  banner_focal_y: number | null
  banner_size_kb: number | null
  headshot_size_kb: number | null
}
