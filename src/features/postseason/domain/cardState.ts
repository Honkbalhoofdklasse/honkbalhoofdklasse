import type { HSSeries } from '@/features/postseason/api/holland-series'

export type CardState = 'win' | 'loss' | 'neutral'

export const stateOf = (s: HSSeries | undefined | null, team: string | null): CardState =>
  !s || !s.clinchedBy || !team ? 'neutral' : s.clinchedBy === team ? 'win' : 'loss'
