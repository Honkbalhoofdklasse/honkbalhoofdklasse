export type Player = {
  uniform: string
  name: string
  pos: string
  bt: string
  yob: number
  instagram?: string
  bbref_id?: string
}
export type Coach = { uniform: string; name: string; role: string }
export type TeamRoster = { players: Player[]; coaches: Coach[] }
export type StaticRosters = Record<string, TeamRoster>
