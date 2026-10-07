'use client'

import { useState, useEffect } from 'react'
import type { Dir, Hit } from '../domain/types'

export function FlipCell({
  hit,
  delay,
  children,
  arrow,
}: {
  hit: Hit
  delay: number
  children: React.ReactNode
  arrow?: Dir
}) {
  const [flipped, setFlipped] = useState(false)
  const [showColor, setShowColor] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setFlipped(true), delay * 250)
    const t2 = setTimeout(
      () => {
        setShowColor(true)
        setFlipped(false)
      },
      delay * 250 + 300,
    )
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [delay])

  const bg = !showColor
    ? 'bg-[#0d1b2e] border-[var(--border)]'
    : hit === 'correct'
      ? 'bg-green-700 border-green-600'
      : hit === 'close'
        ? 'bg-yellow-700 border-yellow-600'
        : 'bg-[#1a0808] border-red-900/60'

  return (
    <div
      className={`flex flex-col items-center justify-center rounded-xl border px-1 py-2 gap-0.5 transition-colors ${bg} ${flipped ? 'cell-flip' : ''}`}
      style={{ minHeight: 60 }}
    >
      {children}
      {showColor && arrow && (
        <span
          className={`text-sm font-bold leading-none ${arrow === 'up' ? 'text-blue-200' : 'text-orange-200'}`}
        >
          {arrow === 'up' ? '↑' : '↓'}
        </span>
      )}
    </div>
  )
}
