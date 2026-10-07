import Image from 'next/image'
import { TEAM_COLORS, TEAM_LOGOS, TEAM_SHORT } from '@/shared/teams/teams'

// ── Team logo (used in detail) ────────────────────────────────────────────────
export function TeamBadge({
  teamId,
  seed,
  size = 40,
}: {
  teamId: string
  seed?: number
  size?: number
}) {
  return (
    <div className="relative shrink-0">
      <div
        className="rounded-xl flex items-center justify-center p-1.5"
        style={{ backgroundColor: TEAM_COLORS[teamId] ?? '#1e335a', width: size, height: size }}
      >
        {TEAM_LOGOS[teamId] ? (
          <Image
            src={TEAM_LOGOS[teamId]}
            alt={teamId}
            width={size - 12}
            height={size - 12}
            className="object-contain w-full h-full"
          />
        ) : (
          <span className="font-display font-800 text-white text-xs">{TEAM_SHORT[teamId]}</span>
        )}
      </div>
      {seed != null && (
        <span className="absolute -top-1.5 -left-1.5 w-5 h-5 rounded-md bg-[var(--card)] border border-[var(--border)] flex items-center justify-center font-display font-800 text-[10px] text-white">
          {seed}
        </span>
      )}
    </div>
  )
}
