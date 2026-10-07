export default function StatRow({
  label,
  value,
  highlight,
}: {
  label: string
  value: string | number
  highlight?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-2.5 rounded-lg ${highlight ? 'bg-white/5' : ''}`}
    >
      <span className="font-display font-700 text-xs uppercase text-[var(--muted)] tracking-wider">
        {label}
      </span>
      <span className="font-display font-800 text-sm text-white">{value}</span>
    </div>
  )
}
