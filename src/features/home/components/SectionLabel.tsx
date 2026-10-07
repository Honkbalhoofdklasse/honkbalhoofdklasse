export function SectionLabel({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1 h-6 bg-[var(--accent)] shrink-0" />
      <span className="font-display font-800 italic text-3xl md:text-4xl uppercase text-white tracking-tight">
        <strong>{children}</strong>
      </span>
    </div>
  )
}
