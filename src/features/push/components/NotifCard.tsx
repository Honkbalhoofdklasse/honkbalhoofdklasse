export function NotifCard({
  title,
  body,
  time,
  color,
}: {
  title: string
  body: string
  time: string
  color: string
}) {
  return (
    <div
      className="rounded-2xl px-4 py-3.5 w-[280px]"
      style={{
        background: 'rgba(10, 18, 32, 0.97)',
        border: '1px solid rgba(255,255,255,0.12)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: color + '25', border: `1.5px solid ${color}50` }}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
            style={{ color }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className="font-display font-700 text-[9px] uppercase tracking-widest text-white/35">
              Honkbal Hoofdklasse
            </p>
            <p className="font-display font-700 text-[9px] text-white/25 shrink-0">{time}</p>
          </div>
          <p className="font-display font-800 text-[13px] text-white leading-snug">{title}</p>
          <p className="font-display font-700 text-[11px] text-white/55 mt-0.5 leading-snug">
            {body}
          </p>
        </div>
      </div>
    </div>
  )
}
