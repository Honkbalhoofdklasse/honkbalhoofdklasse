export default function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="bg-[#0a1220] border border-[#1a2a3a] rounded-xl px-6 py-5">
      <p className="font-display font-700 text-xs uppercase text-[var(--muted)] tracking-wider mb-1">
        {label}
      </p>
      <p className="font-display font-800 text-3xl text-white">{value}</p>
      {sub && <p className="font-display font-700 text-xs text-[var(--muted)] mt-1">{sub}</p>}
    </div>
  )
}
