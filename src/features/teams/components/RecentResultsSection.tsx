import Image from 'next/image'
import { TEAM_COLORS, TEAM_LOGOS, TEAM_SHORT } from '@/shared/teams/teams'
import type { Game } from '../domain/teamPage'
import Section from './Section'
import { WEEKDAY_DAY_MONTH, formatGameDate } from '@/shared/dates/gameDate'

export default function RecentResultsSection({ games, teamId }: { games: Game[]; teamId: string }) {
  return (
    <Section title="Recent Results">
      {games.slice(0, 6).map((g) => {
        const isHome = g.home_team_id === teamId
        const opp = isHome ? g.away_team_id : g.home_team_id
        const ourScore = isHome ? g.home_score : g.away_score
        const oppScore = isHome ? g.away_score : g.home_score
        const won = ourScore !== null && oppScore !== null && ourScore > oppScore
        const oppName = TEAM_SHORT[opp] ?? opp.toUpperCase()
        const oppLogo = TEAM_LOGOS[opp]
        const oppColor = TEAM_COLORS[opp] ?? '#1e335a'

        return (
          <div
            key={g.external_id}
            className={`flex items-center gap-3 px-2 py-2 rounded-lg ${won ? 'bg-green-900/10' : 'bg-red-900/10'}`}
          >
            <span
              className={`font-display font-800 text-xs w-3 ${won ? 'text-green-400' : 'text-red-400'}`}
            >
              {won ? 'W' : 'L'}
            </span>
            <span className="font-display font-700 text-xs text-[var(--muted)] w-24 shrink-0">
              {formatGameDate(g.game_date, WEEKDAY_DAY_MONTH)}
            </span>
            <div className="flex items-center gap-1.5 flex-1">
              <span className="font-display font-700 text-xs text-white/50">
                {isHome ? 'vs' : '@'}
              </span>
              <div
                className="w-5 h-5 rounded flex items-center justify-center p-0.5"
                style={{ backgroundColor: oppColor }}
              >
                {oppLogo ? (
                  <Image
                    src={oppLogo}
                    alt={oppName}
                    width={16}
                    height={16}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <span className="text-white text-[8px] font-bold">{oppName.slice(0, 3)}</span>
                )}
              </div>
              <span className="font-display font-700 text-xs text-white">{oppName}</span>
            </div>
            <span
              className={`font-display font-800 text-sm ${won ? 'text-green-400' : 'text-red-400'}`}
            >
              {ourScore}–{oppScore}
            </span>
          </div>
        )
      })}
    </Section>
  )
}
