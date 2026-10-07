'use client'

import Image from 'next/image'
import { TEAM_COLORS, TEAM_LOGOS, TEAM_NAMES } from '@/shared/teams/teams'
import { MAX_GUESSES } from '../domain/constants'
import type { PoolPlayer } from '../domain/types'

export function ResultBanner({
  won,
  guessCount,
  target,
  shared,
  onShare,
}: {
  won: boolean
  guessCount: number
  target: PoolPlayer
  shared: boolean
  onShare: () => void
}) {
  return (
    <div
      className={`mb-5 rounded-2xl border overflow-hidden ${won ? 'border-green-600/60' : 'border-red-800/40'}`}
    >
      <div className={`h-1.5 ${won ? 'bg-green-500' : 'bg-red-600'}`} />
      <div
        className={`px-5 py-4 flex items-center justify-between gap-3 flex-wrap ${won ? 'bg-green-900/25' : 'bg-red-900/15'}`}
      >
        <div>
          <p
            className={`font-display font-800 text-2xl uppercase ${won ? 'text-green-400' : 'text-red-400'}`}
          >
            {won ? 'You got it!' : 'Game Over'}
          </p>
          <p className="font-display font-800 text-base uppercase text-white mt-0.5">
            {won ? `${guessCount}/${MAX_GUESSES} guesses` : target.name}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <div
              className="w-5 h-5 rounded flex items-center justify-center p-0.5"
              style={{ backgroundColor: TEAM_COLORS[target.teamId] }}
            >
              <Image
                src={TEAM_LOGOS[target.teamId]}
                alt=""
                width={14}
                height={14}
                className="object-contain w-full h-full"
              />
            </div>
            <p className="font-display font-700 text-xs text-white/60 uppercase">
              {TEAM_NAMES[target.teamId]} · {target.pos} · {target.bt} · {target.yob}
            </p>
          </div>
        </div>
        <button
          onClick={onShare}
          className="shrink-0 bg-[var(--accent)] px-5 py-2.5 rounded-xl font-display font-800 text-sm uppercase tracking-wider text-white hover:bg-[var(--accent)]/80 transition-colors"
        >
          {shared ? '✓ Copied!' : 'Share'}
        </button>
      </div>
    </div>
  )
}
