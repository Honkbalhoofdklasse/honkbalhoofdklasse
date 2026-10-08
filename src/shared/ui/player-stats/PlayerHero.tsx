import Image from 'next/image'
import { TEAM_LOGOS, TEAM_NAMES } from '@/shared/teams/teams'
import type { RosterPlayer } from './findRosterPlayer'

export function PlayerHero({
  playerName,
  teamId,
  teamColor,
  accentColor,
  rosterPlayer,
  bannerUrl,
  headshotUrl,
  bannerPosition,
  age,
  onClose,
}: {
  playerName: string
  teamId: string
  teamColor: string
  accentColor: string
  rosterPlayer: RosterPlayer
  bannerUrl: string | null
  headshotUrl: string | null
  bannerPosition: string
  age: number | null
  onClose: () => void
}) {
  return (
    <div className="relative shrink-0 overflow-hidden" style={{ height: 240 }}>
      {bannerUrl ? (
        <Image
          src={bannerUrl}
          alt={playerName}
          fill
          priority
          className="object-cover"
          style={{ objectPosition: bannerPosition, opacity: 0.55 }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(135deg, ${teamColor} 0%, #0a1220 100%)` }}
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, #060e1b 0%, rgba(6,14,27,0.5) 50%, rgba(6,14,27,0.1) 100%)',
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to right, ${teamColor}cc 0%, transparent 50%)` }}
      />

      {rosterPlayer?.uniform && (
        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-6 select-none pointer-events-none">
          <span
            className="font-display font-800 text-white/[0.06]"
            style={{ fontSize: 'clamp(120px, 22vw, 200px)', lineHeight: 1 }}
          >
            {rosterPlayer.uniform}
          </span>
        </div>
      )}

      <button
        onClick={onClose}
        className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-colors text-lg leading-none"
      >
        ×
      </button>

      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 flex items-end gap-4 z-10">
        {headshotUrl ? (
          <div
            className="relative shrink-0 rounded-xl overflow-hidden shadow-2xl"
            style={{ width: 88, height: 88, border: `3px solid ${accentColor}` }}
          >
            <Image
              src={headshotUrl}
              alt={playerName}
              fill
              className="object-cover object-center"
              priority
            />
          </div>
        ) : (
          <div
            className="shrink-0 rounded-xl flex flex-col items-center justify-center gap-0.5 shadow-2xl"
            style={{
              width: 88,
              height: 88,
              border: `3px solid ${accentColor}`,
              background: 'rgba(255,255,255,0.07)',
            }}
          >
            <span className="font-display font-800 text-3xl text-white leading-none">
              {rosterPlayer?.uniform ?? '?'}
            </span>
            {rosterPlayer?.pos && (
              <span className="font-display font-700 text-[9px] text-white/40 uppercase tracking-widest">
                {rosterPlayer.pos}
              </span>
            )}
          </div>
        )}

        <div className="flex-1 min-w-0 pb-1">
          <div className="flex items-center gap-1.5 mb-1">
            {TEAM_LOGOS[teamId] && (
              <div className="w-4 h-4 shrink-0 flex items-center justify-center">
                <Image
                  src={TEAM_LOGOS[teamId]}
                  alt={teamId}
                  width={16}
                  height={16}
                  className="object-contain w-full h-full"
                />
              </div>
            )}
            <span
              className="font-display font-700 text-[10px] uppercase tracking-widest"
              style={{ color: accentColor }}
            >
              {TEAM_NAMES[teamId] ?? teamId}
            </span>
          </div>

          <h2
            className="font-display font-800 uppercase text-white leading-none tracking-tight mb-1.5"
            style={{ fontSize: 'clamp(1.25rem, 4vw, 1.875rem)' }}
          >
            {playerName}
            {rosterPlayer?.uniform && (
              <span
                className="ml-2 font-display font-700"
                style={{ color: accentColor, opacity: 0.9 }}
              >
                #{rosterPlayer.uniform}
              </span>
            )}
          </h2>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-white/50 font-display font-700 uppercase tracking-widest text-[10px]">
            {rosterPlayer?.pos && <span className="text-white/75">{rosterPlayer.pos}</span>}
            {rosterPlayer?.bt && (
              <>
                <span className="text-white/25">|</span>
                <span>
                  B/T: <span className="text-white/75">{rosterPlayer.bt}</span>
                </span>
              </>
            )}
            {age && (
              <>
                <span className="text-white/25">|</span>
                <span>
                  YOB: <span className="text-white/75">{age}</span>
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
