'use client'

import { useEffect, useRef, useState } from 'react'
import { useCountUp } from '../hooks/useCountUp'

export function StatCard({
  value,
  suffix,
  label,
  delay = 0,
}: {
  value: number
  suffix: string
  label: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const count = useCountUp(value, 1800, active)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setActive(true), delay)
          obs.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  return (
    <div ref={ref} className="text-center">
      <p className="font-display font-800 italic text-5xl md:text-6xl text-white tracking-tight">
        <strong>
          {count.toLocaleString('nl-NL')}
          {suffix}
        </strong>
      </p>
      <p className="font-display font-700 text-xs uppercase tracking-widest text-white/50 mt-2">
        {label}
      </p>
    </div>
  )
}
