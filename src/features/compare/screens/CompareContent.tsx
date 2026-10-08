'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { TEAM_COLORS } from '@/shared/teams/teams'
import type { CmpPlayer } from '../api/compareRoute'
import CompareStatsTable from '../components/CompareStatsTable'
import PlayerSelector from '../components/PlayerSelector'
import RadarChart from '../components/RadarChart'
import { RADAR_C1, RADAR_C2 } from '../domain/radar'

export default function CompareContent() {
  const searchParams = useSearchParams()
  const nav = useRouter()
  const [players, setPlayers] = useState<CmpPlayer[]>([])
  const [p1, setP1] = useState<CmpPlayer | null>(null)
  const [p2, setP2] = useState<CmpPlayer | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/compare')
      .then((r) => r.json())
      .then((data: CmpPlayer[]) => {
        setPlayers(data)
        const a = searchParams.get('a')
        const b = searchParams.get('b')
        if (a) setP1(data.find((p) => p.name === a) ?? null)
        if (b) setP2(data.find((p) => p.name === b) ?? null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [searchParams])

  const updateUrl = useCallback(
    (np1: CmpPlayer | null, np2: CmpPlayer | null) => {
      const params = new URLSearchParams()
      if (np1) params.set('a', np1.name)
      if (np2) params.set('b', np2.name)
      nav.replace(`/compare${params.size ? '?' + params.toString() : ''}`, { scroll: false })
    },
    [nav],
  )

  function selectP1(p: CmpPlayer | null) {
    setP1(p)
    updateUrl(p, p2)
  }
  function selectP2(p: CmpPlayer | null) {
    setP2(p)
    updateUrl(p1, p)
  }

  const both = p1 && p2

  const tc1 = p1 ? (TEAM_COLORS[p1.teamId] ?? '#1e335a') : '#1e335a'
  const tc2 = p2 ? (TEAM_COLORS[p2.teamId] ?? '#1e335a') : '#1e335a'

  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
      <div className="text-center mb-8">
        <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-xs mb-1">
          Honkbal Hoofdklasse
        </p>
        <h1 className="font-display font-800 italic text-4xl uppercase text-white">
          Player <span className="text-[var(--accent)]">Comparison</span>
        </h1>
      </div>

      <div className="flex gap-3 items-center mb-8">
        <PlayerSelector
          players={players}
          selected={p1}
          other={p2}
          onSelect={selectP1}
          label="Speler 1"
        />
        <div className="shrink-0 font-display font-800 text-xs text-white/20 uppercase tracking-widest">
          vs
        </div>
        <PlayerSelector
          players={players}
          selected={p2}
          other={p1}
          onSelect={selectP2}
          label="Speler 2"
        />
      </div>

      {!both && !loading && (
        <div className="text-center py-20 text-[var(--muted)]">
          <p className="font-display font-700 text-sm uppercase tracking-wider">
            Selecteer twee spelers om te vergelijken
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <p className="font-display font-700 text-sm uppercase text-[var(--muted)] tracking-wider animate-pulse">
            Laden…
          </p>
        </div>
      )}

      {both && (
        <div className="flex flex-col gap-8">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 flex flex-col items-center gap-5">
            <RadarChart p1={p1} p2={p2} all={players} />

            <div className="flex gap-6">
              {[
                { p: p1, c: RADAR_C1 },
                { p: p2, c: RADAR_C2 },
              ].map(({ p, c }) => (
                <div key={p.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c }} />
                  <span className="font-display font-700 text-xs text-white/70 uppercase tracking-wider">
                    {p.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <CompareStatsTable p1={p1} p2={p2} tc1={tc1} tc2={tc2} />

          <div className="flex justify-center">
            <button
              onClick={() => {
                const url = window.location.href
                if (navigator.share)
                  navigator.share({ title: `${p1.name} vs ${p2.name}`, url }).catch(() => {})
                else navigator.clipboard.writeText(url).catch(() => {})
              }}
              className="font-display font-800 text-sm uppercase tracking-wider border border-[var(--border)] text-white/60 px-6 py-3 rounded-xl hover:text-white hover:border-white/40 transition-colors"
            >
              Vergelijking delen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
