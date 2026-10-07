'use client'

import Link from 'next/link'
import type { NavGroup } from './navEntries'

type Props = { entry: NavGroup; pathname: string; expanded: boolean; onToggle: () => void }

export default function MobileGroup({ entry, pathname, expanded, onToggle }: Props) {
  return (
    <div>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between font-display font-800 text-sm uppercase tracking-wider px-4 py-3 rounded-xl transition-colors ${entry.items.some((i) => i.href === pathname) ? 'bg-[var(--accent)] text-white' : 'text-white/60 hover:text-white hover:bg-[var(--card-hover)]'}`}
      >
        {entry.label}
        <svg
          className={`w-3 h-3 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="grid grid-cols-2 gap-1 pl-2">
          {entry.items.map((item) => {
            const cls = `font-display font-800 text-sm uppercase tracking-wider px-4 py-3 rounded-xl transition-colors ${pathname === item.href ? 'bg-[var(--accent)] text-white' : 'text-white/60 hover:text-white hover:bg-[var(--card-hover)]'}`
            return item.external || item.href.startsWith('http') ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cls}
              >
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href} className={cls}>
                {item.label}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
