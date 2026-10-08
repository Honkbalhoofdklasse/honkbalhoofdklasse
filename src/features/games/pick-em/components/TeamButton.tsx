'use client'

import Image from 'next/image'
import { TEAM_LOGOS, TEAM_COLORS, TEAM_SHORT } from '@/shared/teams/teams'

export function TeamButton({
  teamId,
  picked,
  winner,
  locked,
  isFinal,
  isSaving,
  score,
  onClick,
}: {
  teamId: string
  picked: boolean
  winner: boolean
  locked: boolean
  isFinal: boolean
  isSaving: boolean
  score: number | null
  onClick: () => void
}) {
  const color = TEAM_COLORS[teamId] ?? '#1e335a'

  return (
    <button
      onClick={onClick}
      disabled={locked || isSaving}
      className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
        !locked ? 'active:scale-95' : ''
      } ${
        picked && winner
          ? 'ring-2 ring-green-400'
          : picked && isFinal
            ? 'ring-2 ring-red-400/50'
            : picked
              ? 'ring-2 ring-[var(--accent)]'
              : winner
                ? 'ring-1 ring-green-400/40'
                : 'ring-1 ring-transparent'
      }`}
      style={picked ? { background: color + '22' } : {}}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center p-2"
        style={{ backgroundColor: color }}
      >
        <Image
          src={TEAM_LOGOS[teamId]}
          alt={teamId}
          width={36}
          height={36}
          className="object-contain w-full h-full"
        />
      </div>

      <span
        className={`font-display font-800 text-xs uppercase tracking-wide ${picked ? 'text-white' : 'text-white/70'}`}
      >
        {TEAM_SHORT[teamId] ?? teamId.toUpperCase()}
      </span>

      {isFinal && score !== null && (
        <span
          className={`font-display font-900 text-xl ${winner ? 'text-white' : 'text-white/40'}`}
        >
          {score}
        </span>
      )}

      {picked && !isFinal && (
        <span className="font-display font-700 text-[9px] text-[var(--accent)] uppercase tracking-widest">
          Jouw keuze
        </span>
      )}
    </button>
  )
}
