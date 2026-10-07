import Link from 'next/link'
import type { MiniLeaders as MiniLeadersData } from '@/features/home/api/getHomeData'
import { SectionLabel } from '@/features/home/components/SectionLabel'

export function MiniLeaders({ leaders }: { leaders: MiniLeadersData }) {
  return (
    <div className="lg:col-span-1">
      <SectionLabel>Leaders</SectionLabel>
      <div className="space-y-4">
        {/* Batting */}
        <div>
          <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mb-2">
            Batting AVG
          </p>
          <div className="space-y-1">
            {leaders.batters.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="font-display font-700 text-xs text-[#4a6a8a] w-4 shrink-0">
                  {i + 1}
                </span>
                <p className="font-display font-800 text-xs uppercase text-white truncate flex-1">
                  {p.name}
                </p>
                <span className="font-display font-800 text-xs text-[var(--accent)] shrink-0">
                  {p.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Pitching */}
        <div>
          <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mb-2">
            ERA
          </p>
          <div className="space-y-1">
            {leaders.pitchers.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="font-display font-700 text-xs text-[#4a6a8a] w-4 shrink-0">
                  {i + 1}
                </span>
                <p className="font-display font-800 text-xs uppercase text-white truncate flex-1">
                  {p.name}
                </p>
                <span className="font-display font-800 text-xs text-[var(--accent)] shrink-0">
                  {p.value}
                </span>
              </div>
            ))}
          </div>
        </div>
        <Link
          href="/leaders"
          className="block font-display font-700 text-xs text-[var(--accent)] uppercase tracking-widest hover:underline"
        >
          All leaders →
        </Link>
      </div>
    </div>
  )
}
