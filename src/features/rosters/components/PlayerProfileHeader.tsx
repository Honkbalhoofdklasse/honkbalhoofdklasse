import Image from 'next/image'
import type { Player } from '@/shared/rosters/rosters-data'
import InstagramIcon from './InstagramIcon'

type PlayerPhotos = {
  banner_url: string | null
  headshot_url: string | null
  banner_focal_x: number | null
  banner_focal_y: number | null
}

export default function PlayerProfileHeader({
  player,
  photos,
  teamId,
  teamName,
  teamColor,
  teamLogo,
  posLabel,
}: {
  player: Player
  photos: PlayerPhotos
  teamId: string
  teamName: string
  teamColor: string
  teamLogo: string
  posLabel: string
}) {
  return (
    <div className="relative rounded-2xl overflow-hidden border border-[var(--border)]">
      {photos.banner_url ? (
        <div className="relative">
          <div className="relative h-48 md:h-64 w-full overflow-hidden">
            <Image
              src={photos.banner_url}
              alt={player.name}
              fill
              className="object-cover"
              style={{
                objectPosition: `${photos.banner_focal_x ?? 50}% ${photos.banner_focal_y ?? 50}%`,
              }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a1220]" />
          </div>

          <div className="relative px-6 pb-6 -mt-16 flex items-end gap-5 flex-wrap">
            {photos.headshot_url && (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-[#0a1220] shrink-0 shadow-xl">
                <Image src={photos.headshot_url} alt={player.name} fill className="object-cover" />
              </div>
            )}

            <div className="flex-1 min-w-0 pb-1">
              <p
                className="font-display font-700 text-xs uppercase tracking-widest mb-1"
                style={{ color: teamColor === '#121b31' ? 'var(--accent)' : teamColor }}
              >
                {teamName}
              </p>
              <h1 className="font-display font-800 italic text-4xl md:text-5xl uppercase text-white leading-none tracking-tight">
                <strong>{player.name}</strong>
              </h1>
              <div className="flex items-center gap-4 mt-2 flex-wrap">
                <span className="font-display font-800 text-lg text-white/60">
                  #{player.uniform}
                </span>
                <span className="font-display font-700 text-sm text-[var(--muted)] uppercase tracking-wider">
                  {posLabel}
                </span>
                <span className="font-display font-700 text-sm text-[var(--muted)] uppercase tracking-wider">
                  B/T: {player.bt}
                </span>
                <span className="font-display font-700 text-sm text-[var(--muted)] uppercase tracking-wider">
                  Born {player.yob}
                </span>
              </div>
            </div>

            {player.instagram && (
              <a
                href={`https://instagram.com/${player.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-800 text-sm uppercase tracking-wider text-white transition-colors shrink-0 self-end"
                style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}
              >
                <InstagramIcon />@{player.instagram}
              </a>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="absolute inset-0" style={{ backgroundColor: teamColor, opacity: 0.15 }} />
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: teamColor }}
          />

          <div className="relative p-6 md:p-8 flex items-center gap-6 flex-wrap">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 p-3"
              style={{ backgroundColor: teamColor }}
            >
              <Image
                src={teamLogo}
                alt={teamId}
                width={60}
                height={60}
                className="object-contain w-full h-full"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p
                className="font-display font-700 text-xs uppercase tracking-widest mb-1"
                style={{ color: teamColor === '#121b31' ? 'var(--accent)' : teamColor }}
              >
                {teamName}
              </p>
              <h1 className="font-display font-800 italic text-4xl md:text-5xl uppercase text-white leading-none tracking-tight">
                <strong>{player.name}</strong>
              </h1>
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <span className="font-display font-800 text-lg text-white/60">
                  #{player.uniform}
                </span>
                <span className="font-display font-700 text-sm text-[var(--muted)] uppercase tracking-wider">
                  {posLabel}
                </span>
                <span className="font-display font-700 text-sm text-[var(--muted)] uppercase tracking-wider">
                  B/T: {player.bt}
                </span>
                <span className="font-display font-700 text-sm text-[var(--muted)] uppercase tracking-wider">
                  Born {player.yob}
                </span>
              </div>
            </div>

            {player.instagram && (
              <a
                href={`https://instagram.com/${player.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-display font-800 text-sm uppercase tracking-wider text-white transition-colors shrink-0"
                style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}
              >
                <InstagramIcon />@{player.instagram}
              </a>
            )}
          </div>
        </>
      )}
    </div>
  )
}
