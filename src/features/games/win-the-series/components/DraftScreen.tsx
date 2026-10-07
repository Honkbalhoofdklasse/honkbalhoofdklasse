'use client'

import { SLOTS } from '../domain/config'
import { pkey } from '../domain/sim'
import type { DraftSection, Filled, HSHitter, HSPitcher, Mode } from '../domain/types'
import { PlayerRow } from './PlayerRow'
import { PositionChooser } from './PositionChooser'
import { RosterBoard } from './RosterBoard'
import { Shell } from './Shell'
import { SpinGate } from './SpinGate'
import { TeamReel } from './TeamReel'

export function DraftScreen({
  sections,
  filled,
  mode,
  pickCount,
  cutoff,
  dealt,
  spinning,
  revealed,
  skips,
  canReroll,
  choosing,
  pctOf,
  onSpin,
  onReroll,
  onAssign,
  onClickPlayer,
  onCloseChooser,
}: {
  sections: DraftSection[]
  filled: Filled
  mode: Mode
  pickCount: number
  cutoff: number
  dealt: string
  spinning: boolean
  revealed: boolean
  skips: number
  canReroll: boolean
  choosing: HSHitter | null
  pctOf: (p: HSHitter | HSPitcher) => number
  onSpin: () => void
  onReroll: () => void
  onAssign: (player: HSHitter | HSPitcher, slotKey: string) => void
  onClickPlayer: (p: HSHitter | HSPitcher) => void
  onCloseChooser: () => void
}) {
  return (
    <Shell>
      {choosing && (
        <PositionChooser
          choosing={choosing}
          filled={filled}
          onAssign={onAssign}
          onClose={onCloseChooser}
        />
      )}

      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <p className="font-display font-800 text-[10px] uppercase tracking-widest text-[var(--muted)]">
          {pickCount}/{SLOTS.length} filled · {cutoff} wins for the playoffs
        </p>
        {mode === 'blind' && (
          <span className="font-display font-800 text-[10px] uppercase tracking-widest text-[var(--accent)] border border-[var(--accent)]/40 rounded-lg px-2 py-1">
            Blind
          </span>
        )}
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 mb-6">
        <RosterBoard filled={filled} blind={mode === 'blind'} />
      </div>

      {!revealed ? (
        <SpinGate
          round={pickCount + 1}
          total={SLOTS.length}
          dealt={dealt}
          spinning={spinning}
          onSpin={onSpin}
        />
      ) : (
        <>
          <div className="flex flex-col items-center gap-3 mb-6">
            <p className="font-display font-800 text-[11px] text-[var(--accent)] uppercase tracking-[0.3em]">
              You're on the clock
            </p>
            <TeamReel teamId={dealt} spinning={spinning} />
            <button
              onClick={onReroll}
              disabled={spinning || skips <= 0 || !canReroll}
              className="font-display font-800 text-xs uppercase tracking-wider bg-[var(--card)] border border-[var(--border)] text-white px-3 py-2 rounded-lg hover:border-[var(--accent)] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ↻ Reroll team ({skips} left)
            </button>
          </div>

          {!spinning && (
            <div className="space-y-5">
              {sections.map((sec) => (
                <div key={sec.title}>
                  <div className="flex items-center gap-2 mb-2">
                    <p
                      className={`font-display font-800 text-xs uppercase tracking-widest ${sec.slotFilled ? 'text-[var(--muted)]/50' : 'text-white'}`}
                    >
                      {sec.title}
                    </p>
                    {sec.slotFilled && (
                      <span className="font-display font-700 text-[9px] uppercase tracking-widest text-[var(--muted)]/50 border border-[var(--border)] rounded px-1.5 py-0.5">
                        Filled
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {sec.players.map((p) => (
                      <PlayerRow
                        key={pkey(p)}
                        player={p}
                        pct={pctOf(p)}
                        blind={mode === 'blind'}
                        disabled={sec.slotFilled}
                        onClick={() =>
                          sec.directSlot ? onAssign(p, sec.directSlot!) : onClickPlayer(p)
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Shell>
  )
}
