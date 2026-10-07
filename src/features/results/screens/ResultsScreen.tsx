'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/shared/supabase/legacy'
import BoxscoreModal from '@/shared/ui/BoxscoreModal'
import ResultCard from '../components/ResultCard'
import type { Game, StandingsEntry } from '../domain/types'

export default function ResultsScreen() {
  const [results, setResults] = useState<Game[]>([])
  const [standingsMap, setStandingsMap] = useState<Record<string, StandingsEntry>>({})
  const [selected, setSelected] = useState<Game | null>(null)

  useEffect(() => {
    Promise.all([
      supabase
        .from('games')
        .select('id, external_id, game_date, home_team_id, away_team_id, home_score, away_score')
        .eq('status', 'final')
        .order('game_date', { ascending: false })
        .limit(30),
      supabase.from('standings').select('team_id, wins, losses').eq('season', 2026),
    ]).then(([gamesRes, standingsRes]) => {
      setResults((gamesRes.data ?? []) as Game[])
      const map: Record<string, StandingsEntry> = {}
      for (const s of (standingsRes.data ?? []) as StandingsEntry[]) {
        map[s.team_id] = s
      }
      setStandingsMap(map)
    })
  }, [])

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-8">
        <div>
          <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-sm mb-1">
            Season 2026
          </p>
          <h1 className="font-display font-800 italic text-5xl uppercase tracking-tight text-white">
            <strong>Results</strong>
          </h1>
        </div>

        {results.length === 0 ? (
          <div className="flex items-center gap-3 py-8">
            <div className="w-5 h-5 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
            <p className="font-display font-700 text-[var(--muted)] uppercase text-sm tracking-widest">
              Loading…
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {results.map((g) => (
              <ResultCard
                key={g.id}
                game={g}
                standingsMap={standingsMap}
                onClick={() => setSelected(g)}
              />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <BoxscoreModal
          gameId={selected.external_id}
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
