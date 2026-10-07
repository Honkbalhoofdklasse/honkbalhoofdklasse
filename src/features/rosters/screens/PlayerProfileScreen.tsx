import { ROSTERS, slugify } from '@/shared/rosters/rosters-data'
import { getAwardsByPlayer } from '@/shared/data/awards-data'
import { computeSeasonStats } from '@/shared/rosters/player-stats'
import Link from 'next/link'
import BackButton from '@/shared/ui/BackButton'
import PlayerSplits from '@/shared/ui/PlayerSplits'
import { notFound } from 'next/navigation'
import { TEAM_COLORS, TEAM_LOGOS, TEAM_NAMES } from '@/shared/teams/teams'
import { getCareerStats, getPlayerPhotos } from '../api/playerProfileData'
import CareerStatsSection from '../components/CareerStatsSection'
import InstagramFeedSection from '../components/InstagramFeedSection'
import PlayerAwardsSection from '../components/PlayerAwardsSection'
import PlayerProfileHeader from '../components/PlayerProfileHeader'
import SeasonStatsSection from '../components/SeasonStatsSection'
import { POS_LABELS } from '../domain/teamRosterMeta'

export default async function PlayerProfileScreen({
  params,
}: {
  params: Promise<{ teamId: string; playerSlug: string }>
}) {
  const { teamId, playerSlug } = await params
  const roster = ROSTERS[teamId]
  if (!roster) notFound()

  const player = roster.players.find((p) => slugify(p.name) === playerSlug)
  if (!player) notFound()

  const [awards, photos, career, season] = await Promise.all([
    Promise.resolve(getAwardsByPlayer(player.name)),
    getPlayerPhotos(player.name),
    player.bbref_id
      ? getCareerStats(player.bbref_id)
      : Promise.resolve({ batting: [], pitching: [] }),
    computeSeasonStats(player.name),
  ])
  const teamColor = TEAM_COLORS[teamId] ?? '#1e335a'
  const teamLogo = TEAM_LOGOS[teamId]
  const teamName = TEAM_NAMES[teamId] ?? teamId
  const age = new Date().getFullYear() - player.yob
  const posLabel = POS_LABELS[player.pos] ?? player.pos

  const personSchema = {
    '@context': 'https://schema.org',
    '@type': ['Person', 'Athlete'],
    name: player.name,
    url: `https://honkbalhoofdklasse.com/rosters/${teamId}/${playerSlug}`,
    sport: 'Baseball',
    description: `${player.name} is a ${posLabel} for ${teamName} in the 2026 KNBSB Honkbal Hoofdklasse. #${player.uniform}.`,
    birthDate: String(player.yob),
    affiliation: {
      '@type': 'SportsTeam',
      name: teamName,
      url: `https://honkbalhoofdklasse.com/rosters/${teamId}`,
      memberOf: {
        '@type': 'SportsOrganization',
        '@id': 'https://honkbalhoofdklasse.com/#league',
        name: 'KNBSB Honkbal Hoofdklasse',
      },
    },
    ...(player.instagram ? { sameAs: [`https://www.instagram.com/${player.instagram}/`] } : {}),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-8">
        {/* Terug knop + acties */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <BackButton fallback="/rosters" label="Back" />
          <Link
            href={`/compare?a=${encodeURIComponent(player.name)}`}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-800 text-sm uppercase tracking-wider bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] text-white transition-colors"
          >
            Compare
          </Link>
        </div>

        {/* Player header card */}
        <PlayerProfileHeader
          player={player}
          photos={photos}
          teamId={teamId}
          teamName={teamName}
          teamColor={teamColor}
          teamLogo={teamLogo}
          posLabel={posLabel}
        />

        {/* Splits — client component, fetches live after page load */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 shrink-0" style={{ backgroundColor: teamColor }} />
            <h2 className="font-display font-800 italic text-2xl uppercase text-white tracking-tight">
              <strong>Splits</strong>
            </h2>
          </div>
          <PlayerSplits playerName={player.name} teamId={teamId} />
        </section>

        {/* Career Stats */}
        {(career.batting.length > 0 || career.pitching.length > 0) && (
          <CareerStatsSection career={career} bbrefId={player.bbref_id} teamColor={teamColor} />
        )}

        {/* 2026 Season Stats */}
        <SeasonStatsSection season={season} teamColor={teamColor} />

        {/* Awards sectie */}
        <PlayerAwardsSection awards={awards} />

        {/* Instagram team feed */}
        <InstagramFeedSection />
      </div>
    </>
  )
}
