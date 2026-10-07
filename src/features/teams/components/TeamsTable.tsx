'use client'

import { useState } from 'react'
import type { TeamBatting, TeamPitching } from '@/shared/teams/team-stats'
import {
  ASC_KEYS,
  BATTING_SORTS,
  getValue,
  PITCHING_SORTS,
  type SortKey,
  type Standing,
  type StatButton,
} from '../domain/teamsSort'
import TeamRow from './TeamRow'

export default function TeamsTable({
  standings,
  batting,
  pitching,
}: {
  standings: Standing[]
  batting: TeamBatting[]
  pitching: TeamPitching[]
}) {
  const [sortKey, setSortKey] = useState<SortKey>('standings')

  const batMap = Object.fromEntries(batting.map((b) => [b.teamId, b]))
  const pitMap = Object.fromEntries(pitching.map((p) => [p.teamId, p]))
  const stMap = Object.fromEntries(standings.map((s) => [s.team_id, s]))

  const allIds = Array.from(
    new Set([...standings.map((s) => s.team_id), ...batting.map((b) => b.teamId)]),
  )

  const sorted = [...allIds].sort((a, b) => {
    const va = getValue(sortKey, stMap[a], batMap[a], pitMap[a])
    const vb = getValue(sortKey, stMap[b], batMap[b], pitMap[b])
    return ASC_KEYS.includes(sortKey) ? va - vb : vb - va
  })

  const activeStat = sortKey !== 'standings' ? sortKey : null

  function SortBtn({ btn }: { btn: StatButton }) {
    const active = sortKey === btn.key
    return (
      <button
        onClick={() => setSortKey(btn.key)}
        className={`shrink-0 font-display font-700 text-xs uppercase tracking-wider transition-all px-3.5 py-2 rounded-full border ${
          active
            ? 'text-white bg-[var(--accent)] border-[var(--accent)]'
            : 'text-[var(--muted)] border-white/10 hover:text-white hover:border-white/30'
        }`}
      >
        {btn.label}
        {active && (
          <span className="ml-1 text-white/70">{ASC_KEYS.includes(btn.key) ? '↑' : '↓'}</span>
        )}
      </button>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => setSortKey('standings')}
          className={`shrink-0 font-display font-700 text-xs uppercase tracking-wider transition-all px-3.5 py-2 rounded-full border ${
            sortKey === 'standings'
              ? 'text-white bg-[var(--accent)] border-[var(--accent)]'
              : 'text-[var(--muted)] border-white/10 hover:text-white hover:border-white/30'
          }`}
        >
          Standings
        </button>
        <div className="shrink-0 w-px h-5 bg-white/10 mx-1" />
        {BATTING_SORTS.map((btn) => (
          <SortBtn key={btn.key} btn={btn} />
        ))}
        <div className="shrink-0 w-px h-5 bg-white/10 mx-1" />
        {PITCHING_SORTS.map((btn) => (
          <SortBtn key={btn.key} btn={btn} />
        ))}
      </div>

      <div className="space-y-3">
        {sorted.map((teamId, i) => (
          <TeamRow
            key={teamId}
            teamId={teamId}
            rank={i + 1}
            s={stMap[teamId]}
            bat={batMap[teamId]}
            pit={pitMap[teamId]}
            sortKey={sortKey}
            activeStat={activeStat}
          />
        ))}
      </div>
    </div>
  )
}
