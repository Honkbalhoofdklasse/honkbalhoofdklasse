'use client'

import { useEffect, useState } from 'react'
import { TEAM_COLORS, TEAM_NAMES } from '@/shared/teams/teams'
import { BattingTable } from './BattingTable'
import { LinescoreTable } from './LinescoreTable'
import { PitchingDecisions } from './PitchingDecisions'
import { PitchingTable } from './PitchingTable'
import { SituationBar } from './SituationBar'
import { TeamLogo } from './TeamLogo'
import type { BoxscoreData } from './types'

export default function BoxscoreModal({
  gameId,
  awayId,
  homeId,
  awayScore,
  homeScore,
  gameDate,
  onClose,
}: {
  gameId: string
  awayId: string
  homeId: string
  awayScore: number | null
  homeScore: number | null
  gameDate: string
  onClose: () => void
}) {
  const [data, setData] = useState<BoxscoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'away' | 'home'>('away')

  useEffect(() => {
    setLoading(true)
    fetch(`/api/boxscore/${gameId}`)
      .then((r) => r.json())
      .then((d) => {
        setData(d)
        setTab(d?.awayId ?? 'away')
      })
      .finally(() => setLoading(false))
  }, [gameId])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const awayWon = (awayScore ?? 0) > (homeScore ?? 0)
  const homeWon = (homeScore ?? 0) > (awayScore ?? 0)
  const formattedDate = new Date(gameDate + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const activeId = tab === 'away' ? (data?.awayId ?? awayId) : (data?.homeId ?? homeId)
  const teamColor = TEAM_COLORS[activeId] ?? '#fe3d00'
  const batters = tab === 'away' ? (data?.awayBatters ?? []) : (data?.homeBatters ?? [])
  const pitchers = tab === 'away' ? (data?.awayPitchers ?? []) : (data?.homePitchers ?? [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div
        className="relative w-full max-w-2xl bg-[#0a1220] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] shrink-0">
          <p className="font-display font-700 text-xs text-[var(--muted)] uppercase tracking-widest">
            {formattedDate}
          </p>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[var(--card-hover)] flex items-center justify-center text-[var(--muted)] hover:text-white transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Score header */}
        <div className="px-5 py-5 flex items-center gap-4 shrink-0">
          <div
            className={`flex items-center gap-3 flex-1 min-w-0 justify-end ${!awayWon ? 'opacity-50' : ''}`}
          >
            <p className="font-display font-800 text-xl uppercase text-white text-right leading-none truncate">
              <strong>{TEAM_NAMES[data?.awayId ?? awayId] ?? awayId}</strong>
            </p>
            <TeamLogo teamId={data?.awayId ?? awayId} size={44} />
          </div>
          <div className="shrink-0 text-center">
            <p className="font-display font-800 text-3xl text-white tabular-nums">
              <span className={awayWon ? 'text-white' : 'text-[var(--muted)]'}>
                {awayScore ?? '–'}
              </span>
              <span className="text-[var(--muted)] mx-2">–</span>
              <span className={homeWon ? 'text-white' : 'text-[var(--muted)]'}>
                {homeScore ?? '–'}
              </span>
            </p>
            <p className="font-display font-700 text-[10px] text-[var(--accent)] uppercase tracking-widest mt-1">
              {data?.isLive ? 'Live' : 'Final'}
            </p>
          </div>
          <div className={`flex items-center gap-3 flex-1 min-w-0 ${!homeWon ? 'opacity-50' : ''}`}>
            <TeamLogo teamId={data?.homeId ?? homeId} size={44} />
            <p className="font-display font-800 text-xl uppercase text-white leading-none truncate">
              <strong>{TEAM_NAMES[data?.homeId ?? homeId] ?? homeId}</strong>
            </p>
          </div>
        </div>

        {loading && (
          <div className="px-5 pb-8 text-center shrink-0">
            <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        )}

        {!loading && data && (
          <div className="overflow-y-auto flex-1 min-h-0">
            {/* Inning score table */}
            <LinescoreTable data={data} awayWon={awayWon} homeWon={homeWon} />

            {/* Live situation */}
            {data.situation && <SituationBar sit={data.situation} />}

            {/* Pitching decision line */}
            {(data.winPitcher || data.lossPitcher) && <PitchingDecisions data={data} />}

            {/* Team tabs */}
            <div className="border-t border-[var(--border)] flex">
              {(
                [
                  ['away', data.awayId],
                  ['home', data.homeId],
                ] as const
              ).map(([side, id]) => (
                <button
                  key={side}
                  onClick={() => setTab(side)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 font-display font-800 text-xs uppercase tracking-widest transition-colors ${
                    tab === side ? 'text-white border-b-2' : 'text-[var(--muted)] hover:text-white'
                  }`}
                  style={tab === side ? { borderColor: TEAM_COLORS[id] ?? '#fe3d00' } : {}}
                >
                  <TeamLogo teamId={id} size={20} />
                  {id.slice(0, 3).toUpperCase()}
                </button>
              ))}
            </div>

            {/* Batting */}
            <div className="px-4 pt-4 pb-2">
              <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mb-2">
                Batting
              </p>
              <BattingTable batters={batters} teamColor={teamColor} teamId={activeId} />
            </div>

            {/* Pitching */}
            <div className="px-4 pt-3 pb-5">
              <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mb-2">
                Pitching
              </p>
              <PitchingTable pitchers={pitchers} teamColor={teamColor} teamId={activeId} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
