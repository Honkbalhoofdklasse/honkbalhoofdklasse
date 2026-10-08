'use client'

import { useState } from 'react'
import BoxscoreModal from '@/shared/ui/BoxscoreModal'
import { TEAM_COLORS, TEAM_NAMES } from '@/shared/teams/teams'
import { TeamLogo } from '@/shared/ui/TeamLogo'
import type { GameRow } from '@/shared/types/game'
import type { WinLoss } from '@/shared/types/standing'
import { DAY_MONTH, formatGameDate } from '@/shared/dates/gameDate'

type Game = Pick<
  GameRow,
  | 'id'
  | 'external_id'
  | 'game_date'
  | 'home_team_id'
  | 'away_team_id'
  | 'home_score'
  | 'away_score'
  | 'status'
>

export default function HomeRecentResults({
  results,
  standingsMap,
}: {
  results: Game[]
  standingsMap: Record<string, WinLoss>
}) {
  const [selected, setSelected] = useState<Game | null>(null)

  if (results.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {results.map((g) => {
          const homeWon = (g.home_score ?? 0) > (g.away_score ?? 0)
          const awayWon = (g.away_score ?? 0) > (g.home_score ?? 0)
          const winColor = TEAM_COLORS[homeWon ? g.home_team_id : g.away_team_id] ?? '#fe3d00'
          return (
            <div
              key={g.id}
              onClick={() => setSelected(g)}
              className="relative bg-[#0a1220] border border-[#1a2a3a] overflow-hidden group hover:border-[var(--accent)]/50 transition-colors cursor-pointer"
            >
              <div className="h-[3px]" style={{ backgroundColor: winColor }} />

              <div className="p-4">
                <div className={`flex items-center gap-2 mb-1.5 ${awayWon ? '' : 'opacity-35'}`}>
                  <TeamLogo teamId={g.away_team_id} size={32} useShortName />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-display font-800 text-[0.72rem] uppercase text-white truncate leading-tight">
                      {TEAM_NAMES[g.away_team_id] ?? g.away_team_id}
                    </span>
                    {standingsMap[g.away_team_id] && (
                      <span className="font-display font-600 text-[0.6rem] text-[#4a6a8a] leading-none mt-0.5">
                        {standingsMap[g.away_team_id].wins}-{standingsMap[g.away_team_id].losses}
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-display font-800 text-2xl tabular-nums ${awayWon ? 'text-white' : 'text-white/30'}`}
                  >
                    {g.away_score ?? '–'}
                  </span>
                </div>

                <div className={`flex items-center gap-2 ${homeWon ? '' : 'opacity-35'}`}>
                  <TeamLogo teamId={g.home_team_id} size={32} useShortName />
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-display font-800 text-[0.72rem] uppercase text-white truncate leading-tight">
                      {TEAM_NAMES[g.home_team_id] ?? g.home_team_id}
                    </span>
                    {standingsMap[g.home_team_id] && (
                      <span className="font-display font-600 text-[0.6rem] text-[#4a6a8a] leading-none mt-0.5">
                        {standingsMap[g.home_team_id].wins}-{standingsMap[g.home_team_id].losses}
                      </span>
                    )}
                  </div>
                  <span
                    className={`font-display font-800 text-2xl tabular-nums ${homeWon ? 'text-white' : 'text-white/30'}`}
                  >
                    {g.home_score ?? '–'}
                  </span>
                </div>
              </div>

              <div className="px-4 py-2 border-t border-[#1a2a3a] flex items-center justify-between">
                <span className="font-display font-700 text-[11px] text-[#4a6a8a] uppercase tracking-widest">
                  {formatGameDate(g.game_date, DAY_MONTH)}
                </span>
                <span className="font-display font-800 text-[11px] text-[var(--accent)] uppercase tracking-widest">
                  Final
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {selected && (
        <BoxscoreModal
          gameId={selected.external_id ?? String(selected.id)}
          awayId={selected.away_team_id}
          homeId={selected.home_team_id}
          awayScore={selected.away_score}
          homeScore={selected.home_score}
          gameDate={selected.game_date}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
