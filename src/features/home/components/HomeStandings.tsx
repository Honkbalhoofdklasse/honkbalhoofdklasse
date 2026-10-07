import Link from 'next/link'
import { TEAM_NAMES } from '@/shared/teams/teams'
import type { HomeData } from '@/features/home/api/getHomeData'
import { TeamLogo } from '@/features/home/components/TeamLogo'
import { SectionLabel } from '@/features/home/components/SectionLabel'

export function HomeStandings({ standings }: { standings: HomeData['standings'] }) {
  return (
    <div className="lg:col-span-3">
      <div className="flex items-end justify-between mb-6">
        <SectionLabel>Standings</SectionLabel>
        <Link
          href="/stand"
          className="font-display font-800 text-xs text-[var(--accent)] uppercase tracking-[0.2em] hover:underline hidden sm:block"
        >
          Volledig →
        </Link>
      </div>

      {/* Header row */}
      <div className="grid grid-cols-[1.5rem_1fr_4rem_3.5rem] md:grid-cols-[2rem_1fr_4rem_3.5rem_2.5rem] gap-2 px-4 pb-3 border-b border-[#0f1e2e]">
        {['#', 'Team', 'W-L', 'PCT'].map((h) => (
          <span
            key={h}
            className="font-display font-700 text-[10px] text-[#4a6a8a] uppercase tracking-widest text-center first:text-left"
          >
            {h}
          </span>
        ))}
        <span className="font-display font-700 text-[10px] text-[#4a6a8a] uppercase tracking-widest text-center hidden md:block">
          G
        </span>
      </div>

      <div className="divide-y divide-[#0a1620]">
        {standings.map((s, i) => {
          const pct = s.win_pct ? s.win_pct.toFixed(3).replace('0.', '.') : '.000'
          const isFirst = i === 0
          return (
            <Link
              key={s.team_id}
              href={`/rosters/${s.team_id}`}
              className={`grid grid-cols-[1.5rem_1fr_4rem_3.5rem] md:grid-cols-[2rem_1fr_4rem_3.5rem_2.5rem] gap-2 items-center px-4 py-3.5 transition-colors ${
                isFirst
                  ? 'bg-[var(--accent)]/10 border-l-[3px] border-[var(--accent)]'
                  : 'hover:bg-[#0a1620]'
              }`}
            >
              <span
                className={`font-display font-800 text-sm ${isFirst ? 'text-[var(--accent)]' : 'text-[#4a6a8a]'}`}
              >
                {i + 1}
              </span>
              <div className="flex items-center gap-2 min-w-0">
                <TeamLogo teamId={s.team_id} size={32} />
                <div className="min-w-0">
                  <p className="font-display font-800 text-sm uppercase text-white leading-none truncate">
                    {TEAM_NAMES[s.team_id] ?? s.team_id}
                  </p>
                  {isFirst && (
                    <p className="font-display font-700 text-[10px] text-[var(--accent)] uppercase tracking-widest mt-0.5">
                      Leader
                    </p>
                  )}
                </div>
              </div>
              <span className="font-display font-800 text-sm text-white text-center">
                {s.wins}-{s.losses}
              </span>
              <span
                className={`font-display font-800 text-sm text-center ${isFirst ? 'text-[var(--accent)]' : 'text-white'}`}
              >
                {pct}
              </span>
              <span className="font-display font-700 text-sm text-white text-center hidden md:block">
                {s.games_played}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
