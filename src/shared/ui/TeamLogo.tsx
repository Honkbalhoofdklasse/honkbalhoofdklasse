import Image from 'next/image'
import { TEAM_COLORS, TEAM_LOGOS, TEAM_SHORT } from '@/shared/teams/teams'

type TeamLogoProps = {
  teamId: string | null
  size?: number
  rounded?: 'lg' | 'xl'
  padding?: 'p-1' | 'p-1.5'
  imageInset?: number
  useShortName?: boolean
}

export function TeamLogo({
  teamId,
  size = 40,
  rounded = 'lg',
  padding = 'p-1.5',
  imageInset = 8,
  useShortName = false,
}: TeamLogoProps) {
  if (!teamId)
    return (
      <div style={{ width: size, height: size }} className="bg-[var(--card-hover)] rounded-lg" />
    )
  const logo = TEAM_LOGOS[teamId]
  const color = TEAM_COLORS[teamId] ?? '#1e335a'
  const radius = rounded === 'xl' ? 'rounded-xl' : 'rounded-lg'
  return (
    <div
      className={`${radius} flex items-center justify-center shrink-0 ${padding}`}
      style={{ backgroundColor: color, width: size, height: size }}
    >
      {logo ? (
        <Image
          src={logo}
          alt={teamId}
          width={size - imageInset}
          height={size - imageInset}
          className="object-contain w-full h-full"
        />
      ) : (
        <FallbackLabel teamId={teamId} size={size} useShortName={useShortName} />
      )}
    </div>
  )
}

function FallbackLabel({
  teamId,
  size,
  useShortName,
}: {
  teamId: string
  size: number
  useShortName: boolean
}) {
  if (useShortName)
    return (
      <span className="font-display font-800 text-white" style={{ fontSize: size * 0.25 }}>
        {TEAM_SHORT[teamId] ?? teamId.slice(0, 3).toUpperCase()}
      </span>
    )
  return (
    <span className="font-display font-800 text-white text-xs">
      {teamId.slice(0, 3).toUpperCase()}
    </span>
  )
}

export default TeamLogo
