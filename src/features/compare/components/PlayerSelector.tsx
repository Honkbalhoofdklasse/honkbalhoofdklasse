'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { TEAM_COLORS, TEAM_LOGOS, TEAM_NAMES } from '@/shared/teams/teams'
import type { CmpPlayer } from '../api/compareRoute'

// ── Player selector ───────────────────────────────────────────────────────────

export default function PlayerSelector({
  players,
  selected,
  other,
  onSelect,
  label,
}: {
  players: CmpPlayer[]
  selected: CmpPlayer | null
  other: CmpPlayer | null
  onSelect: (p: CmpPlayer | null) => void
  label: string
}) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = players
    .filter((p) => (other ? p.name !== other.name : true))
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 12)

  const color = selected ? (TEAM_COLORS[selected.teamId] ?? '#1e335a') : undefined
  const logo = selected ? TEAM_LOGOS[selected.teamId] : undefined
  const team = selected ? (TEAM_NAMES[selected.teamId] ?? selected.teamId) : undefined

  return (
    <div ref={ref} className="relative flex-1 min-w-0">
      {/* Trigger */}
      {selected ? (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl border-2 cursor-pointer transition-colors hover:opacity-90"
          style={{ borderColor: color, backgroundColor: `${color}18` }}
          onClick={() => {
            setOpen(true)
            setTimeout(() => inputRef.current?.focus(), 50)
          }}
        >
          {logo && (
            <div
              className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center p-1.5"
              style={{ backgroundColor: color }}
            >
              <Image
                src={logo}
                alt={team!}
                width={28}
                height={28}
                className="object-contain w-full h-full"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-display font-800 text-sm text-white truncate">{selected.name}</p>
            <p className="font-display font-700 text-xs text-white/50 uppercase tracking-wider">
              {team}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSelect(null)
              setQuery('')
            }}
            className="text-white/30 hover:text-white/70 transition-colors shrink-0 text-lg leading-none"
          >
            ×
          </button>
        </div>
      ) : (
        <button
          onClick={() => {
            setOpen(true)
            setTimeout(() => inputRef.current?.focus(), 50)
          }}
          className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-[var(--border)] hover:border-white/30 text-[var(--muted)] hover:text-white transition-colors"
        >
          <span className="text-lg leading-none">+</span>
          <span className="font-display font-700 text-sm uppercase tracking-wider">{label}</span>
        </button>
      )}

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl z-50">
          <div className="p-2 border-b border-[var(--border)]">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Zoek speler…"
              className="w-full bg-transparent px-3 py-2 font-display font-700 text-sm text-white placeholder:text-white/30 outline-none"
            />
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filtered.length === 0 && (
              <p className="px-4 py-3 font-display font-700 text-xs text-[var(--muted)] uppercase tracking-wider">
                Geen spelers gevonden
              </p>
            )}
            {filtered.map((p) => {
              const c = TEAM_COLORS[p.teamId] ?? '#1e335a'
              const l = TEAM_LOGOS[p.teamId]
              const t = TEAM_NAMES[p.teamId] ?? p.teamId
              return (
                <button
                  key={p.name}
                  onClick={() => {
                    onSelect(p)
                    setQuery('')
                    setOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[var(--card-hover)] transition-colors text-left"
                >
                  <div
                    className="w-7 h-7 rounded-lg shrink-0 flex items-center justify-center p-1"
                    style={{ backgroundColor: c }}
                  >
                    {l ? (
                      <Image
                        src={l}
                        alt={t}
                        width={20}
                        height={20}
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <span className="text-[8px] font-display font-800 text-white">
                        {p.teamId.slice(0, 3).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-display font-800 text-sm text-white">{p.name}</p>
                    <p className="font-display font-700 text-xs text-[var(--muted)] uppercase tracking-wider">
                      {t}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
