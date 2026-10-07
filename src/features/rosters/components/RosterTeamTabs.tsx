'use client'

import Image from 'next/image'
import { TEAM_COLORS, TEAM_LOGOS, TEAM_NAMES } from '@/shared/teams/teams'

export default function RosterTeamTabs({
  availableTeams,
  activeTeam,
  onSelect,
}: {
  availableTeams: string[]
  activeTeam: string
  onSelect: (teamId: string) => void
}) {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
      <div className="flex gap-2 min-w-max">
        {availableTeams.map((teamId) => {
          const active = teamId === activeTeam
          const tc = TEAM_COLORS[teamId] ?? '#1e335a'
          return (
            <button
              key={teamId}
              onClick={() => onSelect(teamId)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-display font-800 text-sm uppercase tracking-wide transition-all shrink-0 ${
                active
                  ? 'text-white'
                  : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-white'
              }`}
              style={active ? { backgroundColor: tc } : {}}
            >
              <div
                className="w-6 h-6 rounded flex items-center justify-center shrink-0 p-0.5"
                style={{ backgroundColor: active ? 'rgba(255,255,255,0.2)' : tc }}
              >
                <Image
                  src={TEAM_LOGOS[teamId]}
                  alt={teamId}
                  width={20}
                  height={20}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="hidden sm:inline">{TEAM_NAMES[teamId]}</span>
              <span className="sm:hidden">{teamId.slice(0, 3).toUpperCase()}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
