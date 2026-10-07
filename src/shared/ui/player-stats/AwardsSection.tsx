import { type Award, AWARD_CATEGORIES } from '@/shared/data/awards-data'

export function AwardsSection({ awards, accentColor }: { awards: Award[]; accentColor: string }) {
  return (
    <div className="px-5 pb-5 border-t border-[var(--border)] pt-4">
      <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mb-3">
        Awards
      </p>
      <div className="space-y-2">
        {awards.map((award, i) => {
          const cat = AWARD_CATEGORIES.find((c) => c.key === award.category)
          return (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 border border-[var(--border)] bg-white/[0.02]"
            >
              <div>
                <p className="font-display font-800 text-sm uppercase text-white leading-none">
                  {cat?.en ?? award.category}
                </p>
                {award.label && (
                  <p
                    className="font-display font-700 text-[10px] uppercase tracking-widest mt-0.5"
                    style={{ color: accentColor }}
                  >
                    {award.label}
                  </p>
                )}
              </div>
              <p className="font-display font-700 text-xs text-[var(--muted)] uppercase">
                Season {award.season}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
