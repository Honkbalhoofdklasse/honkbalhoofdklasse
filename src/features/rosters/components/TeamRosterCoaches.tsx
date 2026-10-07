import type { Coach } from '@/shared/rosters/rosters-data'

export default function TeamRosterCoaches({ coaches }: { coaches: Coach[] }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-1 h-5 bg-[var(--border)] shrink-0" />
        <h2 className="font-display font-800 italic text-xl uppercase text-white tracking-tight">
          <strong>Coaching Staff</strong>
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {coaches.map((coach) => (
          <div
            key={coach.name}
            className="flex items-center gap-4 bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3"
          >
            <span className="font-display font-800 text-lg w-8 text-center shrink-0 text-[var(--muted)]">
              #{coach.uniform}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-800 text-sm uppercase text-white truncate">
                <strong>{coach.name}</strong>
              </p>
              <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest">
                {coach.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
