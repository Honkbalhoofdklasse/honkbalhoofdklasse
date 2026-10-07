'use client'

import Link from 'next/link'
import MobileGroup from './MobileGroup'
import type { NavEntry } from './navEntries'

type Props = {
  open: boolean
  entries: NavEntry[]
  pathname: string
  openGroup: string | null
  setOpenGroup: (label: string | null) => void
  onSearch: () => void
}

export default function MobileMenu({
  open,
  entries,
  pathname,
  openGroup,
  setOpenGroup,
  onSearch,
}: Props) {
  return (
    <div
      className={`xl:hidden transition-all duration-300 ${open ? 'max-h-[85vh] overflow-y-auto' : 'max-h-0 overflow-hidden'}`}
    >
      <div className="bg-[var(--card)] border-t border-[var(--border)] px-4 py-4 space-y-1">
        <Link
          href="/"
          className={`block font-display font-800 text-sm uppercase tracking-wider px-4 py-3 rounded-xl transition-colors ${pathname === '/' ? 'bg-[var(--accent)] text-white' : 'text-white/60 hover:text-white hover:bg-[var(--card-hover)]'}`}
        >
          Home
        </Link>

        {entries.map((entry) =>
          entry.type === 'link' ? (
            <Link
              key={entry.href}
              href={entry.href}
              className={`block font-display font-800 text-sm uppercase tracking-wider px-4 py-3 rounded-xl transition-colors ${
                pathname === entry.href
                  ? 'bg-[var(--accent)] text-white'
                  : entry.highlight
                    ? 'text-[var(--accent)] hover:text-white hover:bg-[var(--card-hover)]'
                    : 'text-white/60 hover:text-white hover:bg-[var(--card-hover)]'
              }`}
            >
              {entry.label}
            </Link>
          ) : (
            <MobileGroup
              key={entry.label}
              entry={entry}
              pathname={pathname}
              expanded={openGroup === entry.label}
              onToggle={() => setOpenGroup(openGroup === entry.label ? null : entry.label)}
            />
          ),
        )}

        <a
          href="https://app.honkbalsoftbal.tv/nl/home"
          target="_blank"
          rel="noopener noreferrer"
          className="block font-display font-800 text-sm uppercase tracking-wider px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-[var(--card-hover)] transition-colors"
        >
          Honkbalsoftbal.tv
        </a>

        <button
          onClick={onSearch}
          className="w-full flex items-center gap-3 font-display font-800 text-sm uppercase tracking-wider px-4 py-3 rounded-xl text-white/60 hover:text-white hover:bg-[var(--card-hover)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search
        </button>
      </div>
    </div>
  )
}
