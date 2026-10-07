'use client'

import Image from 'next/image'
import { TEAM_COLORS, TEAM_LOGOS, TEAM_NAMES } from '@/shared/teams/teams'
import type { HLPlayer } from '../domain/types'

export function PanelBg({
  player,
  flash,
}: {
  player: HLPlayer
  flash?: 'correct' | 'wrong' | null
}) {
  const color = TEAM_COLORS[player.teamId] ?? '#1e335a'
  const logo = TEAM_LOGOS[player.teamId]
  const name = TEAM_NAMES[player.teamId] ?? player.teamId

  return (
    <>
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(160deg, ${color}d0 0%, ${color}60 50%, #06101e 100%)`,
        }}
      />
      <div className="absolute inset-0 bg-[#06101e]/60" />
      {logo && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <Image
            src={logo}
            alt={name}
            width={400}
            height={400}
            className="object-contain opacity-[0.07] w-48 h-48 md:w-64 md:h-64"
          />
        </div>
      )}
      {flash && (
        <div
          className={`absolute inset-0 transition-colors duration-500 ${
            flash === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}
        />
      )}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ backgroundColor: color }} />
    </>
  )
}
