'use client'

import { useEffect, useState } from 'react'
import { feedDate } from '@/features/postseason/domain/feedDate'

// ── Countdown ─────────────────────────────────────────────────────────────────
export function Countdown({ targetISO }: { targetISO: string }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])
  const diff = Math.max(0, (feedDate(targetISO)?.getTime() ?? 0) - now)
  const d = Math.floor(diff / 86400000),
    h = Math.floor((diff % 86400000) / 3600000),
    m = Math.floor((diff % 3600000) / 60000),
    s = Math.floor((diff % 60000) / 1000)
  const unit = (v: number, l: string) => (
    <div className="flex flex-col items-center">
      <span className="font-display font-800 text-2xl text-white tabular-nums">
        {String(v).padStart(2, '0')}
      </span>
      <span className="font-display font-700 text-[9px] text-[var(--muted)] uppercase tracking-widest">
        {l}
      </span>
    </div>
  )
  return (
    <div className="flex items-center gap-4">
      {d > 0 && unit(d, 'Days')}
      {unit(h, 'Hrs')}
      {unit(m, 'Min')}
      {unit(s, 'Sec')}
    </div>
  )
}
