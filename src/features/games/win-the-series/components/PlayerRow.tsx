'use client'

import { TEAM_COLORS, TEAM_SHORT, teamAccent } from '@/shared/teams/teams'
import { domColor, fmt3, isPitcher } from '../domain/sim'
import type { HSHitter, HSPitcher } from '../domain/types'

// ── Player row (in a position section) ────────────────────────────────────────
export function PlayerRow({
  player,
  pct,
  blind,
  disabled,
  onClick,
}: {
  player: HSHitter | HSPitcher
  pct: number
  blind: boolean
  disabled: boolean
  onClick: () => void
}) {
  const pit = isPitcher(player)
  const head = pit ? player.era.toFixed(2) : fmt3(player.ops)
  const headLabel = pit ? 'ERA' : 'OPS'
  const strip: [string, string | number][] = pit
    ? [
        ['W', player.w],
        ['SV', player.sv],
        ['WHIP', player.whip.toFixed(2)],
        ['K', player.so],
      ]
    : [
        ['AVG', fmt3(player.avg)],
        ['HR', player.hr],
        ['RBI', player.rbi],
        ['SB', player.sb],
      ]
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group w-full text-left rounded-lg border px-3 py-2.5 transition-all ${disabled ? 'opacity-40 cursor-not-allowed border-[var(--border)]' : 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--card-hover)]'}`}
      style={!disabled ? { borderLeft: `3px solid ${teamAccent(player.teamId)}` } : undefined}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="font-display font-800 text-[10px] px-1.5 py-0.5 rounded text-white shrink-0"
            style={{ backgroundColor: TEAM_COLORS[player.teamId] ?? '#1e335a' }}
          >
            {TEAM_SHORT[player.teamId]}
          </span>
          <span className="font-display font-800 uppercase text-white text-sm truncate">
            {player.name}
          </span>
        </div>
        {!blind && (
          <div className="flex items-baseline gap-1 shrink-0">
            <span className="font-display font-800 text-white text-base tabular-nums leading-none">
              {head}
            </span>
            <span className="font-display font-700 text-[9px] text-[var(--muted)] uppercase">
              {headLabel}
            </span>
          </div>
        )}
      </div>
      {!blind && (
        <div className="flex items-center gap-3 mt-2">
          {strip.map(([l, v]) => (
            <span key={l} className="flex items-baseline gap-1">
              <span className="font-display font-800 text-white/90 text-xs tabular-nums leading-none">
                {v}
              </span>
              <span className="font-display font-700 text-[8px] text-[var(--muted)] uppercase tracking-wider">
                {l}
              </span>
            </span>
          ))}
          <span className="ml-auto w-12 h-1 rounded-full bg-[var(--card-hover)] overflow-hidden hidden sm:block">
            <span
              className="block h-full rounded-full"
              style={{ width: `${Math.max(8, pct * 100)}%`, backgroundColor: domColor(pct) }}
            />
          </span>
        </div>
      )}
    </button>
  )
}
