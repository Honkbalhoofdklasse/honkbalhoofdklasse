'use client'

import { LINEUP_KEYS, RP_KEYS, SLOTS, SP_KEYS } from '../domain/config'
import type { Filled } from '../domain/types'
import { SlotCard } from './SlotCard'

export function RosterBoard({ filled, blind }: { filled: Filled; blind: boolean }) {
  const group = (title: string, keys: string[]) => (
    <div>
      <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mb-1.5">
        {title}
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {keys.map((k) => (
          <SlotCard
            key={k}
            slot={SLOTS.find((s) => s.key === k)!}
            player={filled[k]}
            blind={blind}
          />
        ))}
      </div>
    </div>
  )
  return (
    <div className="space-y-3">
      {group('Lineup', LINEUP_KEYS)}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {group('Rotation', SP_KEYS)}
        {group('Bullpen', RP_KEYS)}
      </div>
    </div>
  )
}
