'use client'

import Image from 'next/image'
import { TEAM_COLORS, TEAM_LOGOS, TEAM_NAMES } from '@/shared/teams/teams'
import type { HLPlayer } from '../domain/types'

export function TeamBadge({ player }: { player: HLPlayer }) {
  const color = TEAM_COLORS[player.teamId] ?? '#1e335a'
  const logo = TEAM_LOGOS[player.teamId]
  const name = TEAM_NAMES[player.teamId] ?? player.teamId
  return (
    <div className="flex items-center gap-2 opacity-70">
      <div
        className="w-6 h-6 rounded-md flex items-center justify-center p-1 shrink-0"
        style={{ backgroundColor: color }}
      >
        {logo ? (
          <Image
            src={logo}
            alt={name}
            width={20}
            height={20}
            className="object-contain w-full h-full"
          />
        ) : (
          <span className="font-display font-800 text-[8px] text-white">
            {player.teamId.slice(0, 3).toUpperCase()}
          </span>
        )}
      </div>
      <span className="font-display font-700 text-xs uppercase tracking-wider text-white/60">
        {name}
      </span>
    </div>
  )
}
