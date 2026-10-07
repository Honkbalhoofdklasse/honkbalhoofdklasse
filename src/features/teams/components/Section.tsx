export default function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="px-5 py-3.5 border-b border-[var(--border)]">
        <p className="font-display font-800 text-sm uppercase text-white tracking-wide">{title}</p>
      </div>
      <div className="p-3 space-y-0.5">{children}</div>
    </div>
  )
}
