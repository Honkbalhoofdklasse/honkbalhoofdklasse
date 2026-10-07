import { BaseDiamond } from './BaseDiamond'
import type { Situation } from './types'

export function SituationBar({ sit }: { sit: Situation }) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-[#060e1b] border-t border-[var(--border)]">
      {/* Inning */}
      <div className="text-center shrink-0">
        <p className="font-display font-800 text-[10px] text-[var(--muted)] uppercase">
          {sit.isBottom ? 'Bot' : 'Top'}
        </p>
        <p className="font-display font-800 text-base text-white tabular-nums leading-none">
          {sit.inning}
        </p>
        <p className="font-display font-700 text-[9px] text-[var(--muted)] uppercase tracking-widest">
          Inning
        </p>
      </div>

      <div className="w-px h-8 bg-[var(--border)]" />

      {/* Outs */}
      <div className="text-center shrink-0">
        <div className="flex gap-1 justify-center mb-0.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${i < sit.outs ? 'bg-[var(--accent)]' : 'bg-[#1a2a3a]'}`}
            />
          ))}
        </div>
        <p className="font-display font-700 text-[9px] text-[var(--muted)] uppercase tracking-widest">
          Outs
        </p>
      </div>

      <div className="w-px h-8 bg-[var(--border)]" />

      {/* Bases */}
      <div className="flex flex-col items-center shrink-0">
        <BaseDiamond r1={sit.runner1} r2={sit.runner2} r3={sit.runner3} size={10} />
        <p className="font-display font-700 text-[9px] text-[var(--muted)] uppercase tracking-widest mt-0.5">
          Bases
        </p>
      </div>

      <div className="w-px h-8 bg-[var(--border)]" />

      {/* Count */}
      <div className="text-center shrink-0">
        <p className="font-display font-800 text-base text-white tabular-nums">
          {sit.balls}-{sit.strikes}
        </p>
        <p className="font-display font-700 text-[9px] text-[var(--muted)] uppercase tracking-widest">
          Count
        </p>
      </div>

      {/* Batter / Pitcher */}
      {(sit.currentBatter || sit.currentPitcher) && (
        <>
          <div className="w-px h-8 bg-[var(--border)]" />
          <div className="flex-1 min-w-0 space-y-0.5">
            {sit.currentBatter && (
              <p className="font-display font-700 text-xs text-white uppercase truncate">
                <span className="text-[var(--muted)] mr-1.5">AB</span>
                {sit.currentBatter}
              </p>
            )}
            {sit.currentPitcher && (
              <p className="font-display font-700 text-xs text-white uppercase truncate">
                <span className="text-[var(--muted)] mr-1.5">P</span>
                {sit.currentPitcher}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
