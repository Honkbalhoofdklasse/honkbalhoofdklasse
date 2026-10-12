'use client'

import type { HSGame, HSSeries } from '@/features/postseason/api/holland-series'
import { GameRow } from '@/features/postseason/components/GameRow'
import { TeamBadge } from '@/features/postseason/components/TeamBadge'
import { TEAM_SHORT } from '@/shared/teams/teams'
import { Modal } from '@/shared/ui/Modal'

export function SeriesDetailModal({
  openSeries,
  seeds,
  onClose,
  onOpenBox,
}: {
  openSeries: HSSeries
  seeds: Record<string, number>
  onClose: () => void
  onOpenBox: (g: HSGame) => void
}) {
  return (
    <Modal
      onClose={onClose}
      labelledBy="series-detail-title"
      overlayClassName="fixed inset-0 z-40 bg-black/60 flex items-start justify-center p-4 overflow-y-auto"
      panelClassName="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 max-w-lg w-full my-8"
    >
      <div className="flex items-center justify-between mb-4">
        <p
          id="series-detail-title"
          className="font-display font-800 italic text-xl uppercase text-white"
        >
          {openSeries.label}
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="font-display font-800 text-[var(--muted)] hover:text-white text-lg leading-none"
        >
          ✕
        </button>
      </div>
      <div className="flex items-center justify-center gap-4 mb-5">
        <div className="flex flex-col items-center gap-1">
          <TeamBadge teamId={openSeries.teamA} seed={seeds[openSeries.teamA]} size={48} />
          <span className="font-display font-800 text-xs uppercase text-white">
            {TEAM_SHORT[openSeries.teamA]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-display font-800 text-4xl tabular-nums text-white">
            {openSeries.winsA}
          </span>
          <span className="font-display font-700 text-[var(--muted)]">–</span>
          <span className="font-display font-800 text-4xl tabular-nums text-white">
            {openSeries.winsB}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <TeamBadge teamId={openSeries.teamB} seed={seeds[openSeries.teamB]} size={48} />
          <span className="font-display font-800 text-xs uppercase text-white">
            {TEAM_SHORT[openSeries.teamB]}
          </span>
        </div>
      </div>
      <div className="space-y-2">
        {openSeries.games.map((g, i) => (
          <GameRow key={g.id} game={g} index={i} onOpenBox={onOpenBox} />
        ))}
      </div>
      {openSeries.games.some((g) => g.ifNecessary) && (
        <p className="font-display font-700 text-[9px] text-[var(--muted)] uppercase tracking-wider mt-3">
          * if necessary
        </p>
      )}
    </Modal>
  )
}
