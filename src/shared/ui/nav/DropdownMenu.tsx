'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import type { NavGroup } from './navEntries'

export default function DropdownMenu({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isActive = group.items.some((i) => i.href === pathname)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 font-display font-700 text-sm uppercase tracking-wider transition-colors hover:text-white ${isActive ? 'text-white' : 'text-white/60'}`}
      >
        {group.label}
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
        <div className="absolute top-full left-0 mt-2 bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-xl z-50 min-w-[160px]">
          {group.items.map((item) => {
            const cls = `block px-4 py-2.5 font-display font-700 text-sm uppercase tracking-wider transition-colors hover:bg-[var(--accent)] hover:text-white ${pathname === item.href ? 'text-[var(--accent)]' : 'text-white/70'}`
            return item.href.startsWith('http') ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className={cls}
              >
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={cls}>
                {item.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
