import { ROSTERS, slugify } from '@/shared/rosters/rosters-data'
import { TEAM_COLORS, TEAM_LOGOS, TEAM_NAMES } from '@/shared/teams/teams'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import BackButton from '@/shared/ui/BackButton'
import { getNewPlayers } from '../api/getNewPlayers'
import TeamRosterCoaches from '../components/TeamRosterCoaches'
import TeamRosterPlayerCard from '../components/TeamRosterPlayerCard'
import { TEAM_DESCRIPTIONS } from '../domain/teamRosterMeta'

export default async function TeamRosterScreen({
  params,
}: {
  params: Promise<{ teamId: string }>
}) {
  const { teamId } = await params
  const roster = ROSTERS[teamId]
  if (!roster) notFound()

  const teamName = TEAM_NAMES[teamId] ?? teamId
  const teamColor = TEAM_COLORS[teamId] ?? '#1e335a'
  const teamLogo = TEAM_LOGOS[teamId]

  const knownNames = new Set(roster.players.map((p) => p.name.toLowerCase()))
  const newPlayers = await getNewPlayers(teamId)
  const allPlayers = [
    ...roster.players,
    ...newPlayers.map((p) => ({ ...p, instagram: undefined, bbref_id: undefined })),
  ]

  const sportsTeamSchema = {
    '@context': 'https://schema.org',
    '@type': 'SportsTeam',
    name: teamName,
    sport: 'Baseball',
    url: `https://honkbalhoofdklasse.com/rosters/${teamId}`,
    logo: teamLogo,
    memberOf: {
      '@type': 'SportsOrganization',
      '@id': 'https://honkbalhoofdklasse.com/#league',
      name: 'KNBSB Honkbal Hoofdklasse',
    },
    athlete: roster.players.map((p) => ({
      '@type': 'Person',
      name: p.name,
      url: `https://honkbalhoofdklasse.com/rosters/${teamId}/${slugify(p.name)}`,
    })),
  }

  const sections = [
    { label: 'Pitchers', filter: (pos: string) => pos === 'P' },
    { label: 'Catchers', filter: (pos: string) => pos === 'C' || pos === 'C/IF' },
    { label: 'Infield', filter: (pos: string) => pos === 'IF' || pos === 'C/IF' },
    { label: 'Outfield', filter: (pos: string) => pos === 'OF' },
    { label: 'Utility', filter: (pos: string) => pos === 'UTL' || pos === 'DH' },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sportsTeamSchema) }}
      />
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-8 space-y-8">
        <BackButton fallback="/rosters" label="Back" />

        {/* Team header */}
        <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] p-6 md:p-8">
          <div className="absolute inset-0 opacity-10" style={{ backgroundColor: teamColor }} />
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: teamColor }}
          />
          <div className="relative flex items-center gap-6 flex-wrap">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 p-3"
              style={{ backgroundColor: teamColor }}
            >
              <Image
                src={teamLogo}
                alt={teamName}
                width={60}
                height={60}
                className="object-contain w-full h-full"
              />
            </div>
            <div>
              <p
                className="font-display font-700 text-xs uppercase tracking-widest mb-1"
                style={{ color: teamColor === '#121b31' ? 'var(--accent)' : teamColor }}
              >
                Honkbal Hoofdklasse · 2026
              </p>
              <h1 className="font-display font-800 italic text-4xl md:text-5xl uppercase text-white leading-none tracking-tight">
                <strong>{teamName}</strong>
              </h1>
              <p className="font-display font-700 text-sm text-[var(--muted)] mt-2">
                {TEAM_DESCRIPTIONS[teamId]}
              </p>
            </div>
          </div>
        </div>

        {/* Players by position */}
        {sections.map((sec) => {
          const players = allPlayers.filter((p) => sec.filter(p.pos))
          if (!players.length) return null
          return (
            <section key={sec.label}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-1 h-5 shrink-0" style={{ backgroundColor: teamColor }} />
                <h2 className="font-display font-800 italic text-xl uppercase text-white tracking-tight">
                  <strong>{sec.label}</strong>
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {players.map((player) => (
                  <TeamRosterPlayerCard
                    key={player.name}
                    player={player}
                    teamId={teamId}
                    teamColor={teamColor}
                    isNew={!knownNames.has(player.name.toLowerCase())}
                  />
                ))}
              </div>
            </section>
          )
        })}

        {/* Coaching staff */}
        {roster.coaches.length > 0 && <TeamRosterCoaches coaches={roster.coaches} />}
      </div>
    </>
  )
}
