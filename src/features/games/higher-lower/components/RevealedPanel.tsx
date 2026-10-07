'use client'

import type { STATS } from '../domain/stats'
import type { HLPlayer } from '../domain/types'
import { PanelBg } from './PanelBg'
import { TeamBadge } from './TeamBadge'

export function RevealedPanel({
  left,
  leftVal,
  score,
  stat,
}: {
  left: HLPlayer
  leftVal: number
  score: number
  stat: (typeof STATS)[number]
}) {
  return (
    <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden px-8 py-12 md:py-0 min-h-[45dvh] md:min-h-0">
      <PanelBg player={left} />

      {/* Score — top-left overlay */}
      <div className="absolute top-4 left-5 z-10 text-left">
        <p className="font-display font-700 text-[9px] uppercase tracking-widest text-white/40">
          Score
        </p>
        <p className="font-display font-800 text-xl text-white leading-none">{score}</p>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center gap-3 max-w-xs">
        <TeamBadge player={left} />
        <p className="font-display font-800 text-3xl md:text-4xl text-white leading-tight drop-shadow-md">
          &ldquo;{left.name}&rdquo;
        </p>
        <p className="font-display font-700 text-sm text-white/70 uppercase tracking-wider">has</p>
        <p className="font-display font-800 text-8xl md:text-9xl text-white leading-none tabular-nums drop-shadow-xl">
          {stat.fmt(leftVal)}
        </p>
        <p className="font-display font-800 text-base text-white/80 uppercase tracking-widest">
          {stat.label}
        </p>
      </div>
    </div>
  )
}
