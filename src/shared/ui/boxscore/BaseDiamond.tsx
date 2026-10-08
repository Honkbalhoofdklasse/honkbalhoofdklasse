export function BaseDiamond({
  r1,
  r2,
  r3,
  size = 10,
}: {
  r1: boolean
  r2: boolean
  r3: boolean
  size?: number
}) {
  const s = size
  const filled = '#fe3d00'
  const empty = '#1a2a3a'
  return (
    <svg width={s * 3} height={s * 2.4} viewBox="0 0 30 24">
      <rect
        x="11"
        y="0"
        width="8"
        height="8"
        transform="rotate(45 15 4)"
        fill={r2 ? filled : empty}
      />
      <rect
        x="20"
        y="8"
        width="8"
        height="8"
        transform="rotate(45 24 12)"
        fill={r1 ? filled : empty}
      />
      <rect
        x="2"
        y="8"
        width="8"
        height="8"
        transform="rotate(45 6 12)"
        fill={r3 ? filled : empty}
      />
    </svg>
  )
}
