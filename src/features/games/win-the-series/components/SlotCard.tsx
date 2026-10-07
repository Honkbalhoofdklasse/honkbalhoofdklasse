'use client'

import { TEAM_SHORT, teamAccent } from '@/shared/teams/teams'
import { fmt3, isPitcher } from '../domain/sim'
import type { HSHitter, HSPitcher, Slot } from '../domain/types'

export function SlotCard({
  slot,
  player,
  blind,
}: {
  slot: Slot
  player?: HSHitter | HSPitcher
  blind: boolean
}) {
  const filled = !!player
  const accent = player ? teamAccent(player.teamId) : 'var(--border)'
  return (
    <div
      className={`rounded-xl px-2.5 py-2 border transition-all ${filled ? 'bg-[var(--card-hover)] border-transparent' : 'border-dashed border-[var(--border)] bg-[var(--card)]'}`}
      style={filled ? { borderLeft: `3px solid ${accent}` } : undefined}
    >
      <p className="font-display font-800 text-[10px] uppercase tracking-widest text-[var(--muted)]">
        {slot.short}
      </p>
      {filled ? (
        <>
          <p className="font-display font-800 text-white text-xs uppercase leading-tight truncate">
            {player!.name}
          </p>
          <p
            className="font-display font-700 text-[10px] leading-none mt-0.5"
            style={{ color: accent }}
          >
            {TEAM_SHORT[player!.teamId]}
            {!blind &&
              ' · ' +
                (isPitcher(player!)
                  ? `${player!.era.toFixed(2)} ERA`
                  : `${fmt3((player as HSHitter).ops)} OPS`)}
          </p>
        </>
      ) : (
        <p className="font-display font-700 text-[10px] text-[var(--muted)]/60 uppercase leading-tight mt-0.5 truncate">
          {slot.label}
        </p>
      )}
    </div>
  )
}
