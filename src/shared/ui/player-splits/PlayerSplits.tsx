'use client'

import { useEffect, useState } from 'react'
import { BattingSplits } from './BattingSplits'
import { PitchingSplits } from './PitchingSplits'
import type { BatGame, BatSplit, PitGame, PitSplit } from './types'

export default function PlayerSplits({
  playerName,
  teamId,
  statType,
}: {
  playerName: string
  teamId: string
  statType?: 'batting' | 'pitching'
}) {
  const [apiType, setApiType] = useState<'batting' | 'pitching' | null>(null)
  const [batSplits, setBatSplits] = useState<BatSplit[]>([])
  const [pitSplits, setPitSplits] = useState<PitSplit[]>([])
  const [batGames, setBatGames] = useState<BatGame[]>([])
  const [pitGames, setPitGames] = useState<PitGame[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<'batting' | 'pitching' | null>(null)

  useEffect(() => {
    fetch(
      `/api/player-splits?player=${encodeURIComponent(playerName)}&team=${encodeURIComponent(teamId)}`,
    )
      .then((r) => r.json())
      .then((d) => {
        setApiType(d.type ?? null)
        if (d.type === 'pitching') {
          setPitSplits(d.splits ?? [])
          setPitGames(d.games ?? [])
          setActiveView('pitching')
        } else {
          setBatSplits(d.splits ?? [])
          setBatGames(d.games ?? [])
          if (d.pitching) {
            setPitSplits(d.pitching.splits ?? [])
            setPitGames(d.pitching.games ?? [])
          }
          // Use statType prop as initial view, default to batting
          setActiveView(statType === 'pitching' ? 'pitching' : 'batting')
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [playerName, teamId, statType])

  const isTwoWay = batSplits.length > 0 && pitSplits.length > 0
  const showPitching = activeView === 'pitching'

  if (loading)
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 text-center">
        <p className="font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)]">
          Loading splits…
        </p>
      </div>
    )

  const hasBat = batSplits.length > 0 || batGames.length > 0
  const hasPit = pitSplits.length > 0 || pitGames.length > 0
  if (!hasBat && !hasPit) return null

  return (
    <div className="space-y-4">
      {/* Toggle for two-way players */}
      {isTwoWay && (
        <div className="flex gap-1.5">
          <button
            onClick={() => setActiveView('batting')}
            className={`font-display font-800 text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all ${!showPitching ? 'bg-[var(--accent)] text-white' : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-white'}`}
          >
            Batting
          </button>
          <button
            onClick={() => setActiveView('pitching')}
            className={`font-display font-800 text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all ${showPitching ? 'bg-[var(--accent)] text-white' : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-white'}`}
          >
            Pitching
          </button>
        </div>
      )}

      {/* ── BATTING SPLITS ── */}
      {hasBat && !showPitching && <BattingSplits batSplits={batSplits} batGames={batGames} />}

      {/* ── PITCHING SPLITS ── */}
      {hasPit && showPitching && <PitchingSplits pitSplits={pitSplits} pitGames={pitGames} />}
    </div>
  )
}
