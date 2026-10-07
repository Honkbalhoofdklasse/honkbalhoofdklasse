'use client'

export function Stage({
  title,
  score,
  note,
  ok,
  dim,
}: {
  title: string
  score: string
  note: string
  ok: boolean
  dim?: boolean
}) {
  return (
    <div
      className={`bg-[var(--card)] border rounded-2xl p-5 ${ok ? 'border-[var(--accent)]/50' : 'border-[var(--border)]'} ${dim ? 'opacity-50' : ''}`}
    >
      <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest">
        {title}
      </p>
      <p className="font-display font-800 text-4xl text-white tabular-nums my-1">{score}</p>
      <p
        className={`font-display font-700 text-xs uppercase tracking-wide ${ok ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}
      >
        {note}
      </p>
    </div>
  )
}
