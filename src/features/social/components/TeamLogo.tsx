import Image from 'next/image'
import { TEAM_COLORS, TEAM_LOGOS } from '@/shared/teams/teams'

export function TeamLogo({ teamId }: { teamId: string }) {
  const logo = TEAM_LOGOS[teamId]
  const color = TEAM_COLORS[teamId] ?? '#1e335a'
  return (
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 p-1"
      style={{ backgroundColor: color }}
    >
      {logo ? (
        <Image
          src={logo}
          alt={teamId}
          width={28}
          height={28}
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
