import type { TeamRoster } from '@/shared/rosters/rosters-data'
import Section from './Section'

export default function TeamRosterSection({ roster }: { roster: TeamRoster }) {
  return (
    <Section title={`Roster (${roster.players.length} players)`}>
      {roster.players.map((p) => (
        <div
          key={p.name}
          className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <span className="font-display font-700 text-[10px] text-[var(--muted)] w-5 text-right shrink-0">
            #{p.uniform}
          </span>
          <span className="font-display font-700 text-xs text-white flex-1">{p.name}</span>
          <span className="font-display font-700 text-[10px] uppercase text-[var(--muted)] shrink-0">
            {p.pos}
          </span>
          <span className="font-display font-700 text-[10px] text-[var(--muted)]/60 shrink-0">
            {p.bt}
          </span>
        </div>
      ))}
    </Section>
  )
}
