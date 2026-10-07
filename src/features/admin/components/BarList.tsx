export default function BarList({
  title,
  rows,
}: {
  title: string
  rows: { label: string; clicks: number; impressions: number }[]
}) {
  const max = rows[0]?.impressions ?? 1
  const totalClicks = rows.reduce((s, r) => s + r.clicks, 0)
  return (
    <div className="bg-[#0a1220] border border-[#1a2a3a] rounded-xl p-5">
      <p className="font-display font-800 text-sm uppercase text-white tracking-wide mb-4">
        {title}
      </p>
      <div className="space-y-2.5">
        {rows.slice(0, 10).map((r) => {
          const pct = totalClicks > 0 ? Math.round((r.clicks / totalClicks) * 100) : 0
          return (
            <div key={r.label}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-display font-700 text-xs text-white/80 truncate max-w-[55%]">
                  {r.label}
                </span>
                <span className="font-display font-700 text-xs text-[var(--muted)]">
                  {r.clicks} <span className="text-white/30">({pct}%)</span>
                </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] rounded-full"
                  style={{ width: `${(r.impressions / max) * 100}%` }}
                />
              </div>
            </div>
          )
        })}
        {rows.length === 0 && (
          <p className="font-display font-700 text-xs text-[var(--muted)]">No data</p>
        )}
      </div>
    </div>
  )
}
