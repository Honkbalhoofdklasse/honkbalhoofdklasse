'use client'

import { useState, useEffect, useCallback } from 'react'
import type { StaticRosters } from '@/shared/rosters/rosters-data'
import PlayerStatsModal from '@/shared/ui/PlayerStatsModal'
import { TEAM_COLORS } from '@/shared/teams/teams'
import CoachingStaffTable from '../components/CoachingStaffTable'
import RosterSectionTable from '../components/RosterSectionTable'
import RosterTeamTabs from '../components/RosterTeamTabs'
import {
  type NewPlayer,
  SECTIONS,
  type SelectedPlayer,
  TEAM_ORDER,
} from '../domain/rosterTabsTypes'

export default function RosterTabs({ rosters }: { rosters: StaticRosters }) {
  const availableTeams = TEAM_ORDER.filter((t) => rosters[t])
  const [activeTeam, setActiveTeam] = useState(availableTeams[0] ?? '')
  const [selectedPlayer, setSelectedPlayer] = useState<SelectedPlayer | null>(null)
  const [newPlayers, setNewPlayers] = useState<NewPlayer[]>([])
  const [loadedTeam, setLoadedTeam] = useState('')

  const loadSupplemental = useCallback(
    (teamId: string) => {
      if (loadedTeam === teamId) return
      fetch(`/api/roster-supplement/${teamId}`)
        .then((r) => r.json())
        .then((data: NewPlayer[]) => {
          setNewPlayers(data)
          setLoadedTeam(teamId)
        })
        .catch(() => {})
    },
    [loadedTeam],
  )

  useEffect(() => {
    loadSupplemental(activeTeam)
  }, [activeTeam, loadSupplemental])

  const team = rosters[activeTeam]
  const staticPlayers = team?.players ?? []
  const knownNames = new Set(staticPlayers.map((p) => p.name.toLowerCase()))
  const supplemental = newPlayers.filter((p) => !knownNames.has(p.name.toLowerCase()))
  const players = [...staticPlayers, ...supplemental]
  const coaches = team?.coaches ?? []
  const color = TEAM_COLORS[activeTeam] ?? '#1e335a'

  return (
    <>
      {selectedPlayer && (
        <PlayerStatsModal
          playerName={selectedPlayer.name}
          teamId={selectedPlayer.teamId}
          statType={selectedPlayer.statType}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
      <div className="space-y-6">
        <RosterTeamTabs
          availableTeams={availableTeams}
          activeTeam={activeTeam}
          onSelect={setActiveTeam}
        />

        <div className="space-y-6">
          {SECTIONS.map((section) => {
            const sectionPlayers = players
              .filter((p) => section.filter(p.pos))
              .sort((a, b) => (Number(a.uniform) || 99) - (Number(b.uniform) || 99))
            if (sectionPlayers.length === 0) return null

            return (
              <RosterSectionTable
                key={section.short}
                section={section}
                sectionPlayers={sectionPlayers}
                color={color}
                activeTeam={activeTeam}
                onSelectPlayer={setSelectedPlayer}
              />
            )
          })}

          {coaches.length > 0 && <CoachingStaffTable coaches={coaches} color={color} />}
        </div>
      </div>
    </>
  )
}
