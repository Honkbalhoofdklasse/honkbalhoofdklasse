import Image from 'next/image'
import { TEAM_COLORS, TEAM_LOGOS, TEAM_SHORT, teamAccent } from '@/shared/teams/teams'
import type { CardState } from '@/features/postseason/domain/cardState'

// ── Bracket card ──────────────────────────────────────────────────────────────
export function BracketCard({
  teamId,
  seed,
  wins,
  showWins,
  state,
  onClick,
}: {
  teamId: string | null
  seed?: number
  wins?: number
  showWins?: boolean
  state: CardState
  onClick?: () => void
}) {
  const color = teamId ? (TEAM_COLORS[teamId] ?? '#1e335a') : '#232833'
  return (
    <button
      onClick={onClick}
      disabled={!teamId || !onClick}
      className={`relative w-full h-full flex flex-col rounded-md overflow-hidden transition-transform ${onClick && teamId ? 'hover:scale-[1.03]' : ''} ${state === 'loss' ? 'opacity-65' : ''}`}
      style={{
        backgroundColor: color,
        boxShadow:
          state === 'win'
            ? `0 0 0 2px ${teamAccent(teamId!)}`
            : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
      }}
    >
      {seed != null && (
        <span className="absolute top-0.5 left-1.5 font-display font-800 text-white/90 text-[10px] sm:text-sm">
          {seed}
        </span>
      )}
      <div className="flex-1 flex items-center justify-center p-1.5 min-h-0">
        {teamId && TEAM_LOGOS[teamId] ? (
          <Image
            src={TEAM_LOGOS[teamId]}
            alt={teamId}
            width={44}
            height={44}
            className="object-contain max-h-full w-auto"
          />
        ) : (
          <span className="font-display font-800 text-white/40 text-xl">?</span>
        )}
      </div>
      <div className="bg-black/40 px-1.5 py-1 flex items-center justify-between gap-1">
        <span className="font-display font-800 text-white text-[9px] sm:text-[11px] uppercase truncate">
          {teamId ? (TEAM_SHORT[teamId] ?? teamId) : 'TBD'}
        </span>
        {showWins && (
          <span className="font-display font-800 text-white text-[11px] sm:text-sm tabular-nums leading-none">
            {wins}
          </span>
        )}
      </div>
    </button>
  )
}
