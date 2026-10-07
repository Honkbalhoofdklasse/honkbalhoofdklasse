'use client'

import { buildResultSummary } from '../domain/report'
import { fmt3 } from '../domain/sim'
import type { Data, Filled, Sim } from '../domain/types'
import { RosterBoard } from './RosterBoard'
import { ScoutUnit } from './ScoutUnit'
import { Shell } from './Shell'
import { Stage } from './Stage'

export function ResultScreen({
  s,
  data,
  filled,
  onPlayAgain,
}: {
  s: Sim
  data: Data
  filled: Filled
  onPlayAgain: () => void
}) {
  const { outcome, offG, rotG, bulG, report } = buildResultSummary(s, data)
  return (
    <Shell>
      <div
        className={`rounded-2xl p-6 md:p-8 mb-6 text-center border ${s.champion ? 'border-[var(--accent)] bg-[var(--accent)]/10' : 'border-[var(--border)] bg-[var(--card)]'}`}
      >
        <p className="font-display font-800 italic text-3xl md:text-4xl uppercase text-white leading-tight">
          <strong>{outcome}</strong>
        </p>
        <p className="font-display font-700 text-xs text-[var(--muted)] uppercase tracking-widest mt-3">
          Title odds were {Math.round(s.titleOdds * 100)}% · {s.rs.toFixed(1)} R/G ·{' '}
          {s.staffEra.toFixed(2)} staff ERA
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        <Stage
          title="Regular Season"
          score={`${s.wins}-${s.losses}`}
          ok={s.madePlayoffs}
          note={s.madePlayoffs ? 'Clinched a playoff spot' : `Needed ${s.cutoff} wins`}
        />
        <Stage
          title="Playoffs · Semifinal"
          score={s.semi ? `${s.semi.a}-${s.semi.b}` : '·'}
          ok={!!s.semi?.won}
          dim={!s.madePlayoffs}
          note={!s.madePlayoffs ? 'Did not qualify' : s.semi?.won ? 'Advanced' : 'Eliminated'}
        />
        <Stage
          title="Holland Series"
          score={s.final ? `${s.final.a}-${s.final.b}` : '·'}
          ok={s.champion}
          dim={!s.semi?.won}
          note={!s.semi?.won ? 'Did not reach' : s.champion ? 'Champions!' : 'Lost the final'}
        />
      </div>

      <p className="font-display font-700 text-[var(--muted)] text-xs uppercase tracking-widest mb-3">
        Scouting report
      </p>
      <div className="grid grid-cols-3 gap-3 mb-3">
        <ScoutUnit
          label="Offense"
          value={fmt3(s.lineupOps)}
          sub={`OPS · lg ${fmt3(data.leagueOps)}`}
          grade={offG}
        />
        <ScoutUnit
          label="Rotation"
          value={s.spEra.toFixed(2)}
          sub={`ERA · lg ${data.leagueEra.toFixed(2)}`}
          grade={rotG}
        />
        <ScoutUnit
          label="Bullpen"
          value={s.rpEra.toFixed(2)}
          sub={`ERA · lg ${data.leagueEra.toFixed(2)}`}
          grade={bulG}
        />
      </div>
      <p className="font-display font-700 text-white text-sm mb-8 leading-snug">{report}</p>

      <p className="font-display font-700 text-[var(--muted)] text-xs uppercase tracking-widest mb-3">
        Your team
      </p>
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 mb-8">
        <RosterBoard filled={filled} blind={false} />
      </div>
      <div className="flex justify-center">
        <button
          onClick={onPlayAgain}
          className="font-display font-800 uppercase tracking-wider bg-[var(--accent)] text-white px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Play again
        </button>
      </div>
    </Shell>
  )
}
