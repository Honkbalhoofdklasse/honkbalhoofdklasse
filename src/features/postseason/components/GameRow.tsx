'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { TEAM_NAMES, teamAccent } from '@/shared/teams/teams'
import type { WinProbPoint } from '@/features/livescores/domain/winProbability'
import type { HSGame } from '@/features/postseason/api/holland-series'
import { fmtDateTime } from '@/features/postseason/domain/feedDate'
import { TeamBadge } from '@/features/postseason/components/TeamBadge'

const WinProbChart = dynamic(() => import('@/shared/ui/WinProbChart'), { ssr: false })

// ── Game row (inside the detail modal) ────────────────────────────────────────
export function GameRow({
  game,
  index,
  onOpenBox,
}: {
  game: HSGame
  index: number
  onOpenBox: (g: HSGame) => void
}) {
  const [wp, setWp] = useState<WinProbPoint[] | null>(null)
  const [wpOpen, setWpOpen] = useState(false)
  const hasResult = game.status !== 'scheduled' && game.homeScore != null && game.awayScore != null
  const realId = !game.id.startsWith('final-g')
  const toggleWp = async () => {
    const nx = !wpOpen
    setWpOpen(nx)
    if (nx && !wp) {
      try {
        const r = await fetch(`/api/win-probability/${game.id}`)
        setWp((await r.json()).points ?? [])
      } catch {
        setWp([])
      }
    }
  }
  const wHome = hasResult && (game.homeScore ?? 0) > (game.awayScore ?? 0)
  const wAway = hasResult && (game.awayScore ?? 0) > (game.homeScore ?? 0)
  return (
    <div className="bg-[var(--card-hover)] border border-[var(--border)] rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-2.5">
        <div className="shrink-0 w-24">
          <p className="font-display font-800 text-xs text-white uppercase">
            Game {index + 1}
            {game.ifNecessary ? '*' : ''}
          </p>
          {game.status === 'live' ? (
            <span className="inline-flex items-center gap-1 font-display font-800 text-[10px] text-[var(--accent)] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              Live
            </span>
          ) : (
            <p className="font-display font-700 text-[9px] text-[var(--muted)] uppercase leading-tight">
              {game.status === 'final' ? 'Final' : fmtDateTime(game.startISO)}
            </p>
          )}
          {game.location && game.status !== 'final' && (
            <p className="font-display font-700 text-[9px] text-[var(--muted)]/70 uppercase">
              {game.location}
            </p>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-1">
          {[
            { id: game.awayId, sc: game.awayScore, w: wAway },
            { id: game.homeId, sc: game.homeScore, w: wHome },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-2">
              <TeamBadge teamId={r.id} size={22} />
              <span
                className={`font-display font-800 uppercase text-xs flex-1 truncate ${r.w ? 'text-white' : 'text-[var(--muted)]'}`}
              >
                {TEAM_NAMES[r.id] ?? r.id}
              </span>
              {hasResult && (
                <span
                  className={`font-display font-800 tabular-nums text-sm ${r.w ? 'text-white' : 'text-[var(--muted)]'}`}
                >
                  {r.sc}
                </span>
              )}
            </div>
          ))}
        </div>
        {hasResult && realId && (
          <div className="flex flex-col items-end gap-1 shrink-0">
            <button
              onClick={() => onOpenBox(game)}
              className="font-display font-800 text-[10px] uppercase tracking-wider text-white bg-[var(--card)] border border-[var(--border)] hover:border-[var(--accent)] px-2.5 py-1 rounded-lg transition-colors"
            >
              Box
            </button>
            <button
              onClick={toggleWp}
              className="font-display font-700 text-[10px] uppercase tracking-wider text-[var(--muted)] hover:text-[var(--accent)]"
            >
              {wpOpen ? 'Hide WP' : 'Win prob.'}
            </button>
          </div>
        )}
      </div>
      {wpOpen &&
        (wp && wp.length >= 2 ? (
          <WinProbChart
            points={wp}
            homeId={game.homeId}
            awayId={game.awayId}
            homeColor={teamAccent(game.homeId)}
            awayColor={teamAccent(game.awayId)}
          />
        ) : (
          <p className="px-4 pb-3 font-display font-700 text-[var(--muted)] text-xs uppercase">
            No play-by-play data
          </p>
        ))}
    </div>
  )
}
