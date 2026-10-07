import type { BattingRow, PitchingRow } from '../domain/careerTypes'
import CareerBattingTable from './CareerBattingTable'
import CareerPitchingTable from './CareerPitchingTable'

export default function CareerStatsSection({
  career,
  bbrefId,
  teamColor,
}: {
  career: { batting: BattingRow[]; pitching: PitchingRow[] }
  bbrefId?: string
  teamColor: string
}) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-1 h-6 bg-[var(--accent)] shrink-0" />
        <h2 className="font-display font-800 italic text-2xl uppercase text-white tracking-tight">
          <strong>Career Stats</strong>
        </h2>
        {bbrefId && (
          <a
            href={`https://www.baseball-reference.com/register/player.fcgi?id=${bbrefId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto font-display font-700 text-[10px] text-[var(--muted)] hover:text-white uppercase tracking-widest transition-colors"
          >
            Baseball Reference →
          </a>
        )}
      </div>

      {career.batting.length > 0 && (
        <CareerBattingTable rows={career.batting} teamColor={teamColor} />
      )}

      {career.pitching.length > 0 && (
        <CareerPitchingTable rows={career.pitching} teamColor={teamColor} />
      )}
    </section>
  )
}
