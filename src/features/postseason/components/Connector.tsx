import type { CardState } from '@/features/postseason/domain/cardState'

// ── SVG connector (scales cleanly on every screen) ────────────────────────────
export function Connector({
  side,
  top,
  bot,
  out,
}: {
  side: 'left' | 'right'
  top: CardState
  bot: CardState
  out: CardState
}) {
  const c = (s: CardState) => (s === 'win' ? '#22c55e' : s === 'loss' ? '#ef4444' : '#3a4150')
  const p =
    side === 'left'
      ? { t: 'M0,22 H10 V50', b: 'M0,78 H10 V50', o: 'M10,50 H20' }
      : { t: 'M20,22 H10 V50', b: 'M20,78 H10 V50', o: 'M10,50 H0' }
  return (
    <svg
      viewBox="0 0 20 100"
      preserveAspectRatio="none"
      className="w-3 sm:w-6 self-stretch shrink-0"
    >
      <path d={p.t} fill="none" stroke={c(top)} strokeWidth={2.5} />
      <path d={p.b} fill="none" stroke={c(bot)} strokeWidth={2.5} />
      <path d={p.o} fill="none" stroke={c(out)} strokeWidth={2.5} />
    </svg>
  )
}
