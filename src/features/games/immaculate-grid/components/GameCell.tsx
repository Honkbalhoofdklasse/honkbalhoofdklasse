'use client'

import Image from 'next/image'
import { TEAM_COLORS, TEAM_LOGOS } from '@/shared/teams/teams'
import type { CellData } from '../domain/types'

export function GameCell({
  cell,
  canClick,
  flash,
  onClick,
}: {
  cell: CellData
  canClick: boolean
  flash: { ok: boolean } | null
  onClick: () => void
}) {
  const bg = flash?.ok
    ? 'border-green-500 bg-green-500/20'
    : flash && !flash.ok
      ? 'border-red-500 bg-red-500/20'
      : cell.state === 'correct'
        ? 'border-green-700/50 bg-green-900/20'
        : cell.state === 'wrong'
          ? 'border-red-900/40 bg-[#0f0a0a] cursor-pointer hover:border-red-600/60'
          : canClick
            ? 'border-[#1e2e42] bg-[#080f1a] hover:border-[var(--accent)]/50 hover:bg-[#0c1620] cursor-pointer'
            : 'border-[#1a2535] bg-[#080f1a] cursor-not-allowed'

  return (
    <div
      onClick={canClick ? onClick : undefined}
      className={`rounded-xl border flex flex-col items-center justify-center transition-all select-none relative overflow-hidden ${bg} ${flash ? 'scale-95' : ''}`}
      style={{ minHeight: 110 }}
    >
      {cell.state === 'correct' && cell.photoUrl && (
        <Image
          src={cell.photoUrl}
          alt={cell.guess}
          fill
          className="object-cover opacity-40"
          style={{ objectPosition: `${cell.focalX ?? 50}% ${cell.focalY ?? 50}%` }}
          sizes="200px"
        />
      )}

      <div className="relative z-10 flex flex-col items-center justify-center p-3 w-full h-full">
        {cell.state === 'correct' && cell.teamId && (
          <>
            {!cell.photoUrl && (
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-2 p-1.5 shrink-0"
                style={{ backgroundColor: TEAM_COLORS[cell.teamId] ?? '#1e335a' }}
              >
                <Image
                  src={TEAM_LOGOS[cell.teamId]}
                  alt={cell.teamId}
                  width={28}
                  height={28}
                  className="object-contain w-full h-full"
                />
              </div>
            )}
            <p className="font-display font-800 text-xs uppercase text-white text-center leading-tight drop-shadow">
              {cell.guess}
            </p>
            {cell.photoUrl && cell.teamId && (
              <div
                className="mt-1.5 w-6 h-6 rounded flex items-center justify-center p-0.5 shrink-0"
                style={{ backgroundColor: TEAM_COLORS[cell.teamId] ?? '#1e335a' }}
              >
                <Image
                  src={TEAM_LOGOS[cell.teamId]}
                  alt=""
                  width={16}
                  height={16}
                  className="object-contain w-full h-full"
                />
              </div>
            )}
          </>
        )}
        {cell.state === 'wrong' && (
          <>
            <p className="font-display font-700 text-[11px] text-red-400/60 uppercase text-center line-through leading-tight px-1">
              {cell.guess}
            </p>
            <p className="font-display font-700 text-[9px] text-red-400/40 uppercase tracking-widest mt-1">
              tap to retry
            </p>
          </>
        )}
      </div>
    </div>
  )
}
