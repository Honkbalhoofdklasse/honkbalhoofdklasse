export function LoadingSkeleton() {
  return (
    <div className="px-5 pt-5 pb-4 animate-pulse">
      {/* Skeleton: stat section label */}
      <div className="h-2.5 w-24 bg-white/10 rounded mb-4" />
      {/* Skeleton: table header */}
      <div className="flex gap-2 pb-2 border-b border-[var(--border)] mb-1">
        <div className="h-2 w-20 bg-white/10 rounded" />
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-2 w-8 bg-white/10 rounded ml-auto" />
        ))}
      </div>
      {/* Skeleton: rows */}
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex gap-2 py-2.5 border-b border-[var(--border)]/40">
          <div className="h-2.5 w-20 bg-white/10 rounded" />
          {Array.from({ length: 7 }).map((_, j) => (
            <div key={j} className="h-2.5 w-8 bg-white/[0.06] rounded ml-auto" />
          ))}
        </div>
      ))}
    </div>
  )
}
