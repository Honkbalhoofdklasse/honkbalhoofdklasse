'use client'

import Image from 'next/image'
import { TEAM_COLORS, TEAM_LOGOS, TEAM_NAMES, TEAM_SHORT } from '@/shared/teams/teams'

// ── Slot machine ──────────────────────────────────────────────────────────────
// Fixed-size reel so nothing shifts as it spins; during the spin we render just
// the team abbreviation + colour (no image) so every frame swaps instantly.
export function TeamReel({
  teamId,
  spinning,
  question,
}: {
  teamId: string
  spinning: boolean
  question?: boolean
}) {
  const base =
    'w-64 h-20 rounded-2xl flex items-center justify-center gap-3 select-none overflow-hidden'
  if (question) {
    return (
      <div className={`${base} border-2 border-dashed border-[var(--accent)] bg-[var(--card)]`}>
        <span className="font-display font-800 text-4xl text-white leading-none">?</span>
      </div>
    )
  }
  const color = TEAM_COLORS[teamId] ?? '#1e335a'
  if (spinning) {
    return (
      <div className={base} style={{ backgroundColor: color }}>
        <span className="font-display font-800 italic text-4xl text-white leading-none">
          {TEAM_SHORT[teamId]}
        </span>
      </div>
    )
  }
  return (
    <div className={base} style={{ backgroundColor: color }}>
      <div className="w-11 h-11 flex items-center justify-center shrink-0">
        {TEAM_LOGOS[teamId] ? (
          <Image
            src={TEAM_LOGOS[teamId]}
            alt={teamId}
            width={44}
            height={44}
            className="object-contain w-full h-full"
          />
        ) : (
          <span className="font-display font-800 text-white">{TEAM_SHORT[teamId]}</span>
        )}
      </div>
      <span className="font-display font-800 italic uppercase text-white text-base truncate">
        {TEAM_NAMES[teamId] ?? teamId}
      </span>
    </div>
  )
}
