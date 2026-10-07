'use client'

import Image from 'next/image'
import { TEAM_COLORS } from '@/shared/teams/teams'
import type { Criterion } from '../domain/criteria'

export function HeaderCell({ crit, axis }: { crit: Criterion; axis: 'row' | 'col' }) {
  const isTeam = crit.type === 'team'
  const size = axis === 'col' ? 64 : 56

  if (isTeam) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 h-full">
        <div
          className="rounded-xl flex items-center justify-center p-2 shrink-0"
          style={{ backgroundColor: TEAM_COLORS[crit.teamId], width: size, height: size }}
        >
          <Image
            src={crit.logo}
            alt={crit.label}
            width={size - 16}
            height={size - 16}
            className="object-contain w-full h-full"
          />
        </div>
        <p className="font-display font-800 text-[11px] uppercase text-white text-center leading-tight hidden md:block">
          {crit.label}
        </p>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center h-full px-2">
      <p className="font-display font-800 text-sm md:text-base uppercase text-white text-center leading-snug tracking-wide">
        {crit.label}
      </p>
    </div>
  )
}
