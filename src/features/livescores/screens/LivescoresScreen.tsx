'use client'

import { useEffect, useState, useCallback } from 'react'
import BoxscoreModal from '@/shared/ui/BoxscoreModal'
import NotifyButton from '@/shared/ui/NotifyButton'
import ScoreRow from '../components/ScoreRow'
import { formatTime } from '../domain/format'
import type { Data, LiveGame } from '../domain/types'

export default function LivescoresScreen() {
  const [data, setData] = useState<Data | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [selected, setSelected] = useState<LiveGame | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/livescores')
      if (!res.ok) throw new Error('API error')
      setData(await res.json())
      setLastRefresh(new Date())
      setError(false)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    const tick = () => {
      if (!document.hidden) fetchData()
    }
    const t = setInterval(tick, 60_000)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(t)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [fetchData])

  const hasLive = (data?.live?.length ?? 0) > 0

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-10">
      <div className="flex items-end justify-between">
        <div>
          <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-sm mb-1">
            Honkbal Hoofdklasse
          </p>
          <h1 className="font-display font-800 italic text-5xl uppercase tracking-tight text-white">
            <strong>Live</strong>
            <span className="text-[var(--accent)]"> Scores</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            {lastRefresh && (
              <p className="font-display font-700 text-xs text-[var(--muted)] uppercase tracking-widest">
                Updated at {formatTime(lastRefresh.toISOString())}
              </p>
            )}
            <p className="font-display font-700 text-xs text-[var(--muted)] uppercase tracking-widest mt-0.5">
              Refreshes every 60s
            </p>
          </div>
          <NotifyButton tooltip="Get an email the moment a game goes live." />
        </div>
      </div>

      {loading && (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-display font-700 text-[var(--muted)] uppercase text-sm tracking-widest">
            Loading scores…
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-20 space-y-4">
          <p className="font-display font-700 text-[var(--muted)] uppercase text-sm tracking-widest">
            Could not load scores
          </p>
          <button
            onClick={fetchData}
            className="font-display font-800 text-xs uppercase tracking-widest border border-[var(--border)] hover:border-[var(--accent)] text-[var(--muted)] hover:text-white transition-colors px-5 py-2.5 rounded-xl"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && data && (
        <>
          {data.live.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] animate-pulse" />
                <h2 className="font-display font-800 italic text-2xl uppercase text-white">
                  <strong>Live Now</strong>
                </h2>
              </div>
              <div className="space-y-3">
                {data.live.map((g) => (
                  <ScoreRow
                    key={g.id}
                    game={g}
                    isLive
                    standings={data.standings ?? {}}
                    onClick={() => setSelected(g)}
                  />
                ))}
              </div>
            </section>
          )}

          {!hasLive && (
            <div className="border border-[var(--border)] rounded-xl px-6 py-10 text-center">
              <p className="font-display font-800 text-xl uppercase text-[var(--muted)] italic mb-1">
                No live games
              </p>
              <p className="font-display font-700 text-xs text-[var(--muted)] uppercase tracking-widest">
                Scores appear here automatically on game days
              </p>
            </div>
          )}

          {data.finished.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-[var(--border)]" />
                <h2 className="font-display font-800 italic text-2xl uppercase text-white">
                  <strong>Results</strong>
                </h2>
              </div>
              <div className="space-y-2">
                {data.finished.map((g) => (
                  <ScoreRow
                    key={g.id}
                    game={g}
                    standings={data.standings ?? {}}
                    onClick={() => setSelected(g)}
                  />
                ))}
              </div>
            </section>
          )}

          {data.upcoming.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-6 bg-[var(--border)]" />
                <h2 className="font-display font-800 italic text-2xl uppercase text-white">
                  <strong>Upcoming</strong>
                </h2>
              </div>
              <div className="space-y-2">
                {data.upcoming.map((g) => (
                  <ScoreRow key={g.id} game={g} standings={data.standings ?? {}} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {selected && (
        <BoxscoreModal
          gameId={selected.id}
          awayId={selected.awayId ?? ''}
          homeId={selected.homeId ?? ''}
          awayScore={selected.awayScore}
          homeScore={selected.homeScore}
          gameDate={selected.gameDate}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}
