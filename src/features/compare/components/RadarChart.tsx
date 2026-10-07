'use client'

import type { CmpPlayer } from '../api/compareRoute'
import { RADAR_AXES, RADAR_C1, RADAR_C2, gridPoints, radarPoints } from '../domain/radar'

export default function RadarChart({
  p1,
  p2,
  all,
}: {
  p1: CmpPlayer
  p2: CmpPlayer
  all: CmpPlayer[]
}) {
  const SIZE = 280
  const cx = SIZE / 2
  const cy = SIZE / 2
  const R = 100
  const c1 = RADAR_C1
  const c2 = RADAR_C2

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} className="overflow-visible">
      {[0.25, 0.5, 0.75, 1].map((lvl) => (
        <polygon
          key={lvl}
          points={gridPoints(lvl, cx, cy, R)}
          fill="none"
          stroke="white"
          strokeOpacity={0.08}
          strokeWidth={1}
        />
      ))}

      {RADAR_AXES.map((_, i) => {
        const angle = (2 * Math.PI * i) / RADAR_AXES.length - Math.PI / 2
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + R * Math.cos(angle)}
            y2={cy + R * Math.sin(angle)}
            stroke="white"
            strokeOpacity={0.12}
            strokeWidth={1}
          />
        )
      })}

      <polygon
        points={radarPoints(p2, all, cx, cy, R)}
        fill={c2}
        fillOpacity={0.18}
        stroke={c2}
        strokeWidth={2}
        strokeOpacity={0.8}
      />

      <polygon
        points={radarPoints(p1, all, cx, cy, R)}
        fill={c1}
        fillOpacity={0.22}
        stroke={c1}
        strokeWidth={2.5}
        strokeOpacity={0.9}
      />

      {RADAR_AXES.map(({ label }, i) => {
        const angle = (2 * Math.PI * i) / RADAR_AXES.length - Math.PI / 2
        const lx = cx + (R + 20) * Math.cos(angle)
        const ly = cy + (R + 20) * Math.sin(angle)
        return (
          <text
            key={i}
            x={lx}
            y={ly}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={11}
            fontWeight="800"
            fill="white"
            fillOpacity={0.7}
            fontFamily="var(--font-display, monospace)"
            style={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}
          >
            {label}
          </text>
        )
      })}
    </svg>
  )
}
