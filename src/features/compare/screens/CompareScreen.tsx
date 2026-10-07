'use client'

import { Suspense } from 'react'
import CompareContent from './CompareContent'

export default function CompareScreen() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="font-display font-700 text-sm uppercase text-[var(--muted)] tracking-wider animate-pulse">
            Laden…
          </p>
        </div>
      }
    >
      <CompareContent />
    </Suspense>
  )
}
