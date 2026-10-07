import type { PageRow } from '@/features/admin/domain/gsc-analytics'

export default function PageTable({ rows }: { rows: PageRow[] }) {
  const max = rows[0]?.impressions ?? 1
  const short = (url: string) => url.replace(/^https?:\/\/[^/]+/, '') || '/'
  return (
    <div className="bg-[#0a1220] border border-[#1a2a3a] rounded-xl p-5">
      <p className="font-display font-800 text-sm uppercase text-white tracking-wide mb-4">
        Top Pages
      </p>
      <div className="space-y-2">
        {rows.slice(0, 15).map((r) => (
          <div key={r.page}>
            <div className="flex items-center justify-between mb-1 gap-3">
              <span className="font-display font-700 text-xs text-white/80 truncate flex-1">
                {short(r.page)}
              </span>
              <span className="font-display font-700 text-xs text-[var(--muted)] shrink-0">
                <span className="text-white">{r.clicks}</span> clicks · {r.impressions} impr
              </span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--accent)] rounded-full"
                style={{ width: `${(r.impressions / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="font-display font-700 text-xs text-[var(--muted)]">No data</p>
        )}
      </div>
    </div>
  )
}
