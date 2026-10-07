'use client'

export function EmptyRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="space-y-1" style={{ opacity: i === 0 ? 0.5 : 0.2 }}>
          <div
            className="bg-[#080f1a] border border-[var(--border)] rounded-xl"
            style={{ height: 36 }}
          />
          <div className="grid grid-cols-5 gap-1">
            {[...Array(5)].map((_, j) => (
              <div
                key={j}
                className="bg-[#060c14] border border-[var(--border)] rounded-xl"
                style={{ height: 60 }}
              />
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
