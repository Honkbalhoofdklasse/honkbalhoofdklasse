import Link from 'next/link'
import { TEAM_NAMES } from '@/shared/teams/teams'
import type { HomeData } from '@/features/home/api/getHomeData'
import { TeamLogo } from '@/features/home/components/TeamLogo'

export function LeaderCallout({ leader }: { leader: HomeData['standings'][number] }) {
  return (
    <section className="bg-[var(--accent)] py-10 px-6 md:px-12">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 flex-wrap">
        <div className="flex items-center gap-5">
          <TeamLogo teamId={leader.team_id} size={64} />
          <div>
            <p className="font-display font-700 text-white/70 uppercase tracking-[0.3em] text-xs mb-1">
              Current Leader
            </p>
            <p className="font-display font-800 italic text-4xl uppercase text-white leading-none">
              <strong>{TEAM_NAMES[leader.team_id] ?? leader.team_id}</strong>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          {[
            { label: 'Wins', value: leader.wins },
            { label: 'Losses', value: leader.losses },
            {
              label: 'PCT',
              value: leader.win_pct ? leader.win_pct.toFixed(3).replace('0.', '.') : '.000',
            },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display font-800 text-4xl text-white">
                <strong>{stat.value}</strong>
              </p>
              <p className="font-display font-700 text-white/60 text-xs uppercase tracking-widest mt-1">
                {stat.label}
              </p>
            </div>
          ))}
          <Link
            href="/stand"
            className="border-2 border-white px-6 py-3 font-display font-800 text-sm uppercase text-white hover:bg-white hover:text-[var(--accent)] transition-colors tracking-widest"
          >
            Full Standings
          </Link>
        </div>
      </div>
    </section>
  )
}
