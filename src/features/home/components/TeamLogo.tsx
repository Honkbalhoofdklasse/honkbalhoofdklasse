import Image from 'next/image'
import { TEAM_COLORS, TEAM_LOGOS, TEAM_SHORT } from '@/shared/teams/teams'

export function TeamLogo({ teamId, size = 40 }: { teamId: string; size?: number }) {
  const logo = TEAM_LOGOS[teamId]
  const color = TEAM_COLORS[teamId] ?? '#1e335a'
  return (
    <div
      className="rounded-lg flex items-center justify-center shrink-0 p-1.5"
      style={{ backgroundColor: color, width: size, height: size }}
    >
      {logo ? (
        <Image
          src={logo}
          alt={teamId}
          width={size - 8}
          height={size - 8}
          className="object-contain w-full h-full"
        />
      ) : (
        <span className="font-display font-800 text-white" style={{ fontSize: size * 0.25 }}>
          {TEAM_SHORT[teamId] ?? teamId.slice(0, 3).toUpperCase()}
        </span>
      )}
    </div>
  )
}
