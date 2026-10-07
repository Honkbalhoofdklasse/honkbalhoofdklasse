'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/shared/i18n/language'

export default function LangDropdown() {
  const { lang, toggle } = useLanguage()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const options = [
    { code: 'en', flag: '🇬🇧', label: 'English' },
    { code: 'nl', flag: '🇳🇱', label: 'Nederlands' },
  ]
  const current = options.find((o) => o.code === lang)!

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 font-display font-700 text-sm text-white/70 hover:text-white transition-colors border border-white/20 hover:border-white/40 rounded-lg px-2.5 py-1.5"
      >
        <span>{current.flag}</span>
        <span className="uppercase tracking-wider text-xs">{current.code.toUpperCase()}</span>
        <svg
          className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-xl z-50 min-w-[150px]">
          {options.map((opt) => (
            <button
              key={opt.code}
              onClick={() => {
                if (opt.code !== lang) toggle()
                setOpen(false)
              }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 font-display font-700 text-sm transition-colors hover:bg-[var(--card-hover)] ${opt.code === lang ? 'text-[var(--accent)]' : 'text-white/70 hover:text-white'}`}
            >
              <span>{opt.flag}</span>
              <span>{opt.label}</span>
              {opt.code === lang && <span className="ml-auto text-[var(--accent)]">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
