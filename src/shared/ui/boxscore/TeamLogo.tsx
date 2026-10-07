import Image from 'next/image'
import { TEAM_COLORS, TEAM_LOGOS } from '@/shared/teams/teams'

export function TeamLogo({ teamId, size = 44 }: { teamId: string; size?: number }) {
  const logo = TEAM_LOGOS[teamId]
  const color = TEAM_COLORS[teamId] ?? '#1e335a'
  return (
    <div
      className="rounded-xl flex items-center justify-center shrink-0 p-1.5"
      style={{ backgroundColor: color, width: size, height: size }}
    >
      {logo ? (
        <Image
          src={logo}
          alt={teamId}
          width={size - 10}
          height={size - 10}
          className="object-contain w-full h-full"
        />
      ) : (
        <span className="font-display font-800 text-white text-xs">
          {teamId.slice(0, 3).toUpperCase()}
        </span>
      )}
    </div>
  )
}
