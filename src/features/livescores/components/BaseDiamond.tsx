export default function BaseDiamond({ r1, r2, r3 }: { r1: boolean; r2: boolean; r3: boolean }) {
  const on = '#fe3d00',
    off = '#1a2a3a'
  return (
    <svg width="28" height="22" viewBox="0 0 28 22">
      <rect x="10" y="0" width="8" height="8" transform="rotate(45 14 4)" fill={r2 ? on : off} />
      <rect x="18" y="7" width="8" height="8" transform="rotate(45 22 11)" fill={r1 ? on : off} />
      <rect x="2" y="7" width="8" height="8" transform="rotate(45 6 11)" fill={r3 ? on : off} />
    </svg>
  )
}
