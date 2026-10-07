import type { Point } from '@/features/admin/domain/gsc-analytics'

export default function TimeChart({ data }: { data: Point[] }) {
  if (!data.length) return null
  const max = Math.max(...data.map((d) => d.impressions), 1)
  const maxClicks = Math.max(...data.map((d) => d.clicks), 1)
  const showEvery = data.length > 20 ? Math.ceil(data.length / 10) : 1
  const fmt = (key: string) => {
    const [, m, d] = key.split('-')
    return `${parseInt(m)}/${parseInt(d)}`
  }

  return (
    <div className="bg-[#0a1220] border border-[#1a2a3a] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-display font-800 text-sm uppercase text-white tracking-wide">
          Over Time
        </p>
        <div className="flex gap-4">
          <span className="font-display font-700 text-xs text-white/50 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--accent)]/40 inline-block" />{' '}
            Impressions
          </span>
          <span className="font-display font-700 text-xs text-white/50 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[var(--accent)] inline-block" /> Clicks
          </span>
        </div>
      </div>
      <div className="flex items-end gap-0.5 h-28">
        {data.map((b) => (
          <div
            key={b.date}
            className="flex-1 flex flex-col items-center justify-end gap-0 group relative h-full"
          >
            <div
              className="w-full bg-[var(--accent)]/30 group-hover:bg-[var(--accent)]/50 rounded-t-sm transition-colors relative"
              style={{
                height: `${(b.impressions / max) * 100}%`,
                minHeight: b.impressions > 0 ? '2px' : '0',
              }}
              title={`${fmt(b.date)}: ${b.impressions} impressions, ${b.clicks} clicks`}
            >
              <div
                className="w-full bg-[var(--accent)] rounded-t-sm absolute bottom-0 left-0"
                style={{ height: `${(b.clicks / b.impressions) * 100 || 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-0.5 mt-1 overflow-hidden">
        {data.map((b, i) => (
          <div key={b.date} className="flex-1 text-center">
            {i % showEvery === 0 && (
              <span className="font-display font-700 text-[9px] text-white/30">{fmt(b.date)}</span>
            )}
          </div>
        ))}
      </div>
      <span className="sr-only">{maxClicks}</span>
    </div>
  )
}
