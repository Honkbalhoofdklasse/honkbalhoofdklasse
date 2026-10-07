'use client'

import Link from 'next/link'
import PushNotifications from '@/shared/ui/PushNotifications'
import DropdownMenu from './DropdownMenu'
import type { NavEntry } from './navEntries'

type Props = { entries: NavEntry[]; pathname: string; onSearchOpen: () => void }

export default function DesktopNav({ entries, pathname, onSearchOpen }: Props) {
  return (
    <div className="hidden xl:flex items-center gap-4">
      <Link
        href="/"
        className={`font-display font-700 text-sm uppercase tracking-wider transition-colors hover:text-white ${pathname === '/' ? 'text-white' : 'text-white/60'}`}
      >
        Home
      </Link>

      {entries.map((entry) =>
        entry.type === 'link' ? (
          <Link
            key={entry.href}
            href={entry.href}
            className={
              entry.highlight
                ? `font-display font-800 text-sm uppercase tracking-wider whitespace-nowrap transition-colors ${pathname === entry.href ? 'text-white' : 'text-[var(--accent)] hover:text-white'}`
                : `font-display font-700 text-sm uppercase tracking-wider whitespace-nowrap transition-colors hover:text-white ${pathname === entry.href ? 'text-white' : 'text-white/60'}`
            }
          >
            {entry.label}
          </Link>
        ) : (
          <DropdownMenu key={entry.label} group={entry} pathname={pathname} />
        ),
      )}

      <a
        href="https://app.honkbalsoftbal.tv/nl/home"
        target="_blank"
        rel="noopener noreferrer"
        className="font-display font-700 text-sm uppercase tracking-wider text-white/60 hover:text-white transition-colors"
      >
        Honkbalsoftbal.tv
      </a>

      <div className="flex items-center gap-2 ml-2 pl-4 border-l border-white/10">
        <PushNotifications />
        <button
          onClick={onSearchOpen}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5"
          aria-label="Search"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <kbd className="font-display font-700 text-[10px] text-white/30 border border-white/10 rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </button>
        <Link
          href="/partner-up"
          className="font-display font-800 text-xs uppercase tracking-wider bg-[var(--accent)] text-white px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          Partner up
        </Link>
      </div>
    </div>
  )
}
