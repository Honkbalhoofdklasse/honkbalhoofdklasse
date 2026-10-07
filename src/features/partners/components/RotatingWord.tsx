'use client'

import { useEffect, useState } from 'react'

const ROTATING_WORDS = ['Neptunus', 'Pirates', 'Kinheim', 'HCAW', 'Twins', 'Pioniers', 'UVV']

export function RotatingWord() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx((i) => (i + 1) % ROTATING_WORDS.length)
        setVisible(true)
      }, 300)
    }, 2000)
    return () => clearInterval(id)
  }, [])

  return (
    <span
      className="inline-block text-[var(--accent)] transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-12px)',
      }}
    >
      {ROTATING_WORDS[idx]}
    </span>
  )
}
