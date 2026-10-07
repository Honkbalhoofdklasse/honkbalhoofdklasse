import type { BoxscoreData } from './types'

export function PitchingDecisions({ data }: { data: BoxscoreData }) {
  return (
    <div className="border-t border-[var(--border)] px-5 py-3 flex gap-5 flex-wrap">
      {data.winPitcher && (
        <div>
          <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mb-0.5">
            W
          </p>
          <p className="font-display font-800 text-sm text-white uppercase">
            <strong>{data.winPitcher.name}</strong>
          </p>
          <p className="font-display font-700 text-xs text-[var(--accent)]">
            {data.winPitcher.era} ERA
          </p>
        </div>
      )}
      {data.lossPitcher && (
        <div>
          <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mb-0.5">
            L
          </p>
          <p className="font-display font-800 text-sm text-white uppercase">
            <strong>{data.lossPitcher.name}</strong>
          </p>
          <p className="font-display font-700 text-xs text-[var(--accent)]">
            {data.lossPitcher.era} ERA
          </p>
        </div>
      )}
      {data.savePitcher && (
        <div>
          <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mb-0.5">
            SV
          </p>
          <p className="font-display font-800 text-sm text-white uppercase">
            <strong>{data.savePitcher.name}</strong>
          </p>
          <p className="font-display font-700 text-xs text-[var(--accent)]">
            {data.savePitcher.era} ERA
          </p>
        </div>
      )}
    </div>
  )
}
