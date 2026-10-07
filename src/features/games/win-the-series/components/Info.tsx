'use client'

export function Info({ n, l }: { n: string; l: string }) {
  return (
    <div className="bg-[var(--card-hover)] rounded-xl px-3 py-2">
      <p className="font-display font-800 text-white text-sm uppercase leading-none">{n}</p>
      <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-wider mt-1">
        {l}
      </p>
    </div>
  )
}
