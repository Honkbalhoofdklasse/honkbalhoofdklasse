import Link from 'next/link'
import { AWARD_CATEGORIES, type Award } from '@/shared/data/awards-data'

export default function PlayerAwardsSection({ awards }: { awards: Award[] }) {
  if (awards.length > 0) {
    return (
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-[var(--accent)] shrink-0" />
          <h2 className="font-display font-800 italic text-2xl uppercase text-white tracking-tight">
            <strong>Awards</strong>
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {awards.map((award, i) => {
            const cat = AWARD_CATEGORIES.find((c) => c.key === award.category)
            return (
              <div
                key={i}
                className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 flex items-center gap-4"
              >
                <div>
                  <p className="font-display font-800 text-base uppercase text-white leading-tight">
                    {cat?.en ?? cat?.nl ?? award.category}
                  </p>
                  {award.label && (
                    <p className="font-display font-700 text-xs text-[var(--accent)] uppercase tracking-widest mt-0.5">
                      {award.label}
                    </p>
                  )}
                  <p className="font-display font-700 text-xs text-[var(--muted)] uppercase tracking-widest mt-0.5">
                    Season {award.season}
                  </p>
                  {award.note && (
                    <p className="font-display font-700 text-xs text-[var(--muted)] mt-1 italic">
                      {award.note}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </section>
    )
  }
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-[var(--accent)] shrink-0" />
        <h2 className="font-display font-800 italic text-2xl uppercase text-white tracking-tight">
          <strong>Awards</strong>
        </h2>
      </div>
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-8 text-center">
        <p className="font-display font-800 text-xl uppercase text-[var(--muted)] italic">
          No awards yet
        </p>
        <p className="font-display font-700 text-sm text-[var(--muted)] uppercase tracking-widest mt-2">
          Awards will appear here once announced
        </p>
        <Link
          href="/awards"
          className="inline-block mt-4 font-display font-700 text-xs text-[var(--accent)] uppercase tracking-widest hover:underline"
        >
          View all awards →
        </Link>
      </div>
    </section>
  )
}
