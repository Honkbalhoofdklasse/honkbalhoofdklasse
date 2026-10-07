import Image from 'next/image'
import Link from 'next/link'
import { TEAM_COLORS, TEAM_LOGOS, TEAM_NAMES } from '@/shared/teams/teams'
import { getRecentGames, getStandings } from '../api/standings'
import { getForm } from '../domain/form'

export default async function StandingsScreen() {
  const [standings, recentGames] = await Promise.all([getStandings(), getRecentGames()])
  const leader = standings[0]

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Table',
    about: {
      '@type': 'SportsOrganization',
      name: 'KNBSB Honkbal Hoofdklasse',
      sport: 'Baseball',
    },
    description: `Honkbal Hoofdklasse 2026 standings. Leader: ${TEAM_NAMES[leader?.team_id] ?? ''}. ${standings.length} teams.`,
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Header */}
      <div className="mb-8">
        <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-sm mb-1">
          Season 2026
        </p>
        <h1 className="font-display font-800 italic text-5xl uppercase tracking-tight text-white">
          <strong>Standings</strong>
        </h1>
        <p className="text-[var(--muted)] text-sm mt-3 max-w-xl leading-relaxed">
          Current standings for the KNBSB Honkbal Hoofdklasse 2026. Seven clubs compete in a
          round-robin format for the Dutch baseball championship. Updated after every game.
        </p>
      </div>

      {/* Tabel */}
      <div className="rounded-2xl overflow-hidden border border-[var(--border)]">
        {/* Kolomkoppen */}
        <div className="grid grid-cols-[1.25rem_1fr_1.75rem_1.75rem_2.75rem] md:grid-cols-[2rem_1fr_3rem_3rem_3rem_6rem_4rem] gap-2 md:gap-2 px-3 md:px-5 py-3 bg-[var(--navy)] text-white/60 font-display font-700 uppercase text-[10px] md:text-xs tracking-widest">
          <span>#</span>
          <span>Team</span>
          <span className="text-center">W</span>
          <span className="text-center">L</span>
          <span className="text-center">PCT</span>
          <span className="text-center hidden md:block">Last 5</span>
          <span className="text-center hidden md:block">G</span>
        </div>

        {standings.map((s, i) => {
          const isLeader = i === 0
          const gb = leader ? (leader.wins - s.wins - (leader.losses - s.losses)) / 2 : 0
          const logo = TEAM_LOGOS[s.team_id]
          const color = TEAM_COLORS[s.team_id] ?? '#1e335a'
          const name = TEAM_NAMES[s.team_id] ?? s.team_id
          const pct = s.win_pct ? s.win_pct.toFixed(3).replace('0.', '.') : '.000'
          const form = getForm(recentGames, s.team_id)

          return (
            <Link
              key={s.team_id}
              href={`/rosters/${s.team_id}`}
              className={`
                grid grid-cols-[1.25rem_1fr_1.75rem_1.75rem_2.75rem] md:grid-cols-[2rem_1fr_3rem_3rem_3rem_6rem_4rem] gap-2 px-3 md:px-5 py-3.5 md:py-4
                items-center border-b border-[var(--border)] last:border-0
                transition-colors cursor-pointer
                ${
                  isLeader
                    ? 'bg-[var(--accent)] hover:opacity-95'
                    : 'bg-[var(--card)] hover:bg-[var(--card-hover)]'
                }
              `}
            >
              {/* Rang */}
              <span
                className={`font-display font-800 text-base md:text-lg ${isLeader ? 'text-white' : 'text-[var(--muted)]'}`}
              >
                {i + 1}
              </span>

              {/* Team */}
              <div className="flex items-center gap-2.5 md:gap-3 min-w-0">
                <div
                  className="w-9 h-9 md:w-10 md:h-10 rounded-lg flex items-center justify-center shrink-0 p-1.5"
                  style={{ backgroundColor: color }}
                >
                  {logo ? (
                    <Image
                      src={logo}
                      alt={name}
                      width={32}
                      height={32}
                      className="object-contain w-full h-full"
                    />
                  ) : (
                    <span className="font-display font-800 text-xs text-white">
                      {s.team_id.slice(0, 3).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-display font-800 text-base md:text-lg uppercase tracking-wide leading-none text-white truncate">
                    <strong>{name}</strong>
                  </p>
                  {!isLeader && gb > 0 && (
                    <p className="text-[var(--muted)] text-xs mt-0.5">
                      -{gb % 1 === 0 ? gb : gb.toFixed(1)} GB
                    </p>
                  )}
                  {isLeader && (
                    <p className="text-white text-xs mt-0.5 font-display font-800 uppercase tracking-wider">
                      Leader
                    </p>
                  )}
                </div>
              </div>

              {/* Stats */}
              <span
                className={`text-center font-display font-800 text-sm md:text-base ${isLeader ? 'text-white' : 'text-white'}`}
              >
                {s.wins}
              </span>
              <span className="text-center font-display font-600 text-sm md:text-base text-white">
                {s.losses}
              </span>
              <span
                className={`text-center font-display font-700 text-sm md:text-base ${isLeader ? 'text-white' : 'text-[var(--accent)]'}`}
              >
                {pct}
              </span>

              {/* Last 5 form dots */}
              <div className="hidden md:flex items-center justify-center gap-1">
                {form.map((result, fi) => (
                  <span
                    key={fi}
                    className={`inline-flex items-center justify-center w-5 h-5 rounded font-display font-800 text-[10px] text-white ${
                      result === 'W'
                        ? 'bg-green-500'
                        : result === 'L'
                          ? 'bg-red-500'
                          : 'bg-white/20'
                    }`}
                  >
                    {result}
                  </span>
                ))}
                {form.length === 0 && <span className="text-white/20 text-xs">—</span>}
              </div>

              <span
                className={`text-center font-display font-600 text-base hidden md:block ${isLeader ? 'text-white' : 'text-white'}`}
              >
                {s.games_played}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
