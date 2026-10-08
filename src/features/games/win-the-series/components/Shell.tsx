'use client'

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-8">
      <div className="mb-6">
        <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-sm mb-1">
          Postseason Game
        </p>
        <h1 className="font-display font-800 italic text-5xl uppercase tracking-tight text-white">
          <strong>Win the</strong>
          <span className="text-[var(--accent)]"> Holland Series</span>
        </h1>
      </div>
      {children}
    </div>
  )
}
