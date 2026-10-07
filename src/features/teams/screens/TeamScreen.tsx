import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { supabase } from '@/shared/supabase/legacy'
import { TEAM_IDS, TEAM_COLORS, TEAM_LOGOS, TEAM_NAMES, teamAccent } from '@/shared/teams/teams'
import { fetchAllTeamStats } from '@/shared/teams/team-stats'
import { ROSTERS } from '@/shared/rosters/rosters-data'
import RecentResultsSection from '../components/RecentResultsSection'
import TeamRosterSection from '../components/TeamRosterSection'
import { TeamBattingSection, TeamPitchingSection } from '../components/TeamStatSections'
import { fmtRate, type Game, type Standing } from '../domain/teamPage'

export default async function TeamScreen({ params }: { params: Promise<{ teamId: string }> }) {
  const { teamId } = await params
  if (!TEAM_IDS.includes(teamId as never)) notFound()

  const name = TEAM_NAMES[teamId]
  const color = TEAM_COLORS[teamId] ?? '#1e335a'
  const logo = TEAM_LOGOS[teamId]
  const accent = teamAccent(teamId)
  const roster = ROSTERS[teamId]

  const [standingRes, gamesRes, { batting, pitching }] = await Promise.all([
    supabase
      .from('standings')
      .select('wins, losses, win_pct, runs_scored, runs_allowed, games_played')
      .eq('season', new Date().getFullYear())
      .eq('team_id', teamId)
      .maybeSingle(),
    supabase
      .from('games')
      .select('external_id, game_date, home_team_id, away_team_id, home_score, away_score')
      .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
      .not('home_score', 'is', null)
      .order('game_date', { ascending: false })
      .limit(6),
    fetchAllTeamStats(),
  ])

  const standing = standingRes.data as Standing | null
  const games = (gamesRes.data ?? []) as Game[]
  const bat = batting.find((b) => b.teamId === teamId)
  const pit = pitching.find((p) => p.teamId === teamId)

  const rd = standing ? standing.runs_scored - standing.runs_allowed : 0

  // All teams for league rank sorting
  const allTeams = [...batting].sort((a, b) => b.avg - a.avg)
  const avgRank = allTeams.findIndex((t) => t.teamId === teamId) + 1

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
      {/* Back */}
      <Link
        href="/teams"
        className="inline-flex items-center gap-2 font-display font-700 text-sm text-[var(--muted)] hover:text-white transition-colors uppercase tracking-wider"
      >
        ← All Teams
      </Link>

      {/* Hero header */}
      <div
        className="rounded-3xl overflow-hidden border border-[var(--border)] relative"
        style={{ backgroundColor: color }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            background: `radial-gradient(ellipse at 80% 50%, ${accent} 0%, transparent 70%)`,
          }}
        />
        <div className="relative flex items-center gap-6 px-6 md:px-10 py-8">
          {logo && (
            <div className="w-20 h-20 md:w-28 md:h-28 shrink-0 flex items-center justify-center">
              <Image
                src={logo}
                alt={name}
                width={112}
                height={112}
                className="object-contain w-full h-full drop-shadow-xl"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-display font-700 text-white/60 uppercase tracking-widest text-xs mb-1">
              Honkbal Hoofdklasse 2026
            </p>
            <h1 className="font-display font-800 italic text-4xl md:text-5xl uppercase tracking-tight text-white leading-none">
              <strong>{name}</strong>
            </h1>
            {standing && (
              <div className="flex items-center gap-4 mt-3 flex-wrap">
                <p className="font-display font-800 text-2xl text-white">
                  {standing.wins}–{standing.losses}
                  <span className="text-white/50 font-700 text-lg ml-2">
                    {fmtRate(standing.win_pct)}
                  </span>
                </p>
                <div className="flex items-center gap-3 text-white/70">
                  <span className="font-display font-700 text-sm">{standing.games_played} G</span>
                  <span className="font-display font-700 text-sm">RS {standing.runs_scored}</span>
                  <span className="font-display font-700 text-sm">RA {standing.runs_allowed}</span>
                  <span
                    className={`font-display font-800 text-sm ${rd >= 0 ? 'text-green-300' : 'text-red-300'}`}
                  >
                    {rd >= 0 ? '+' : ''}
                    {rd} RD
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Batting */}
        {bat && <TeamBattingSection bat={bat} />}

        {/* Pitching */}
        {pit && <TeamPitchingSection pit={pit} />}

        {/* Recent results */}
        {games.length > 0 && <RecentResultsSection games={games} teamId={teamId} />}

        {/* Roster */}
        {roster && <TeamRosterSection roster={roster} />}
      </div>

      {/* League rank teaser */}
      {bat && (
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl px-5 py-4">
          <p className="font-display font-700 text-xs uppercase text-[var(--muted)] tracking-wider mb-1">
            League Rank
          </p>
          <p className="font-display font-800 text-white">
            Batting average: <span style={{ color: accent }}>#{avgRank}</span> in the league
          </p>
          <p className="font-display font-700 text-xs text-[var(--muted)] mt-1">
            See individual player rankings on the{' '}
            <Link href="/leaders" className="text-[var(--accent)] hover:underline">
              Leaders page
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
