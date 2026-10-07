export function Step({
  n,
  title,
  children,
}: {
  n: number
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="flex gap-5">
      <div className="shrink-0 w-9 h-9 rounded-full bg-[var(--accent)] flex items-center justify-center font-display font-800 text-white text-sm mt-0.5">
        {n}
      </div>
      <div className="flex-1">
        <h3 className="font-display font-800 uppercase text-white text-base mb-2">
          <strong>{title}</strong>
        </h3>
        <div className="text-[var(--muted)] text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  )
}
