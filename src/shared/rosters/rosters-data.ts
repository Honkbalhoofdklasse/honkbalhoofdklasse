import { hcaw } from './data/hcaw'
import { kinheim } from './data/kinheim'
import { neptunus } from './data/neptunus'
import { pioniers } from './data/pioniers'
import { pirates } from './data/pirates'
import { twins } from './data/twins'
import type { StaticRosters } from './data/types'
import { uvv } from './data/uvv'

export type { Coach, Player, StaticRosters, TeamRoster } from './data/types'
export { slugify } from './data/slugify'

export const ROSTERS: StaticRosters = {
  pirates,
  hcaw,
  kinheim,
  neptunus,
  pioniers,
  twins,
  uvv,
}

export default ROSTERS
