import { notFound } from 'next/navigation'
import Image from 'next/image'
import { computeSeasonStats, fetchPlayerPhotos } from '@/shared/rosters/player-stats'
import { headshotFaceUrl } from '@/shared/media/cloudinary'
import { TEAM_COLORS, TEAM_NAMES, TEAM_LOGOS } from '@/shared/teams/teams'
import StatsTabs from '../components/StatsTabs'
import { calcAge, findPlayer } from '../domain/findPlayer'

export default async function PlayerScreen({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const found = findPlayer(slug)
  if (!found) notFound()

  const { player, teamId } = found
  const teamColor = TEAM_COLORS[teamId] ?? '#1e335a'
  const teamName = TEAM_NAMES[teamId] ?? teamId
  const teamLogo = TEAM_LOGOS[teamId]

  const [stats, photos] = await Promise.all([
    computeSeasonStats(player.name),
    fetchPlayerPhotos(player.name),
  ])

  const bannerUrl = photos?.banner_url ?? null
  const headshotUrl = headshotFaceUrl(photos?.headshot_url ?? null)
  const bannerPosition = `${photos?.banner_focal_x ?? 50}% ${photos?.banner_focal_y ?? 50}%`
  const age = calcAge(player.yob)

  const accentColor = teamColor === '#121b31' ? '#f59e0b' : teamColor

  return (
    <main className="min-h-screen" style={{ background: '#060e1b' }}>
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${teamColor} 0%, #060e1b 65%)`,
          }}
        />

        {bannerUrl && (
          <div className="absolute inset-0">
            <Image
              src={bannerUrl}
              alt={player.name}
              fill
              className="object-cover"
              style={{ opacity: 0.15, objectPosition: bannerPosition }}
              priority
            />
          </div>
        )}

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative flex-shrink-0">
              <span
                className="absolute -left-4 -top-6 font-display font-800 select-none pointer-events-none leading-none"
                style={{
                  fontSize: 'clamp(80px, 14vw, 160px)',
                  color: teamColor,
                  opacity: 0.1,
                  lineHeight: 1,
                }}
              >
                {player.uniform}
              </span>

              {headshotUrl ? (
                <div className="relative w-[200px] h-[200px] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl z-10">
                  <Image
                    src={headshotUrl}
                    alt={player.name}
                    fill
                    className="object-cover object-center"
                    priority
                  />
                </div>
              ) : (
                <div
                  className="w-[200px] h-[200px] rounded-2xl border-2 border-white/20 shadow-2xl z-10 flex items-center justify-center"
                  style={{ background: `${teamColor}40` }}
                >
                  <span className="font-display font-800 text-6xl text-white/30">
                    {player.uniform}
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0 z-10">
              <h1 className="font-display font-800 text-5xl sm:text-6xl uppercase text-white leading-none mb-3 tracking-tight">
                {player.name}
              </h1>

              <span
                className="inline-block font-display font-700 text-xs uppercase tracking-widest px-3 py-1 rounded-full mb-4"
                style={{
                  background: accentColor,
                  color: teamColor === '#121b31' ? '#000' : '#fff',
                }}
              >
                {player.pos}
              </span>

              <div className="flex items-center gap-2 mb-3">
                {teamLogo && (
                  <div
                    className="w-8 h-8 rounded-lg p-1 flex items-center justify-center shrink-0"
                    style={{ background: `${teamColor}80` }}
                  >
                    <Image
                      src={teamLogo}
                      alt={teamName}
                      width={24}
                      height={24}
                      className="object-contain w-full h-full"
                    />
                  </div>
                )}
                <span className="font-display font-700 text-sm text-white/70 uppercase tracking-widest">
                  {teamName}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-white/50 font-display font-700 uppercase tracking-widest">
                <span>
                  Bats/Throws: <span className="text-white/80">{player.bt}</span>
                </span>
                <span>
                  Born: <span className="text-white/80">{player.yob}</span>
                </span>
                <span>
                  Age: <span className="text-white/80">{age}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-8" style={{ height: 3, background: accentColor }} />
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {stats ? (
          <StatsTabs stats={stats} teamId={teamId} />
        ) : (
          <div className="text-center py-16">
            <p className="font-display font-700 text-white/40 uppercase tracking-widest text-sm">
              No stats available yet for this season.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}
