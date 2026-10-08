import { getRosterSupplement } from './rosterSupplementRoute'

export type NewPlayer = { name: string; pos: string; uniform: string; bt: string; yob: number }

const UNKNOWN_DETAILS = { uniform: '', bt: '', yob: 0 }

export async function getNewPlayers(teamId: string): Promise<NewPlayer[]> {
  try {
    const supplement = await getRosterSupplement(teamId)
    return supplement.map((player) => ({ ...player, ...UNKNOWN_DETAILS }))
  } catch {
    return []
  }
}
