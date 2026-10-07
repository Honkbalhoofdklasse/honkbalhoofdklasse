import { fetchAllTeamStats } from '@/shared/teams/team-stats'
import { getStandings } from '../api/getStandings'
import TeamsTable from '../components/TeamsTable'

export default async function TeamsScreen() {
  const [standings, { batting, pitching }] = await Promise.all([
    getStandings(),
    fetchAllTeamStats(),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-8">
        <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-sm mb-1">
          Season 2026
        </p>
        <h1 className="font-display font-800 italic text-5xl uppercase tracking-tight text-white">
          <strong>Teams</strong>
        </h1>
        <p className="text-[var(--muted)] text-sm mt-3 max-w-xl leading-relaxed">
          Season statistics for all seven clubs in the KNBSB Honkbal Hoofdklasse 2026. Sort by any
          stat, click a team for the full breakdown.
        </p>
      </div>

      <TeamsTable
        standings={standings as Parameters<typeof TeamsTable>[0]['standings']}
        batting={batting}
        pitching={pitching}
      />
    </div>
  )
}
