'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ALL_PLAYERS } from '../domain/constants'
import type { Criterion } from '../domain/criteria'

export function InputModal({
  rowCrit,
  colCrit,
  onSubmit,
  onClose,
}: {
  rowCrit: Criterion
  colCrit: Criterion
  onSubmit: (name: string) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<{ name: string; teamId: string }[]>([])
  const [selected, setSelected] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([])
      return
    }
    const q = query.toLowerCase()
    setSuggestions(ALL_PLAYERS.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 8))
    setSelected(-1)
  }, [query])

  const submit = useCallback(
    (name: string) => {
      if (!name.trim()) return
      onSubmit(name.trim())
    },
    [onSubmit],
  )

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelected((s) => Math.min(s + 1, suggestions.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelected((s) => Math.max(s - 1, -1))
    }
    if (e.key === 'Enter') {
      if (selected >= 0 && suggestions[selected]) submit(suggestions[selected].name)
      else submit(query)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm bg-[#0a1220] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[var(--border)] bg-[#060e1a]">
          <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mb-2">
            Name a player who is a…
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[var(--accent)]/20 border border-[var(--accent)]/40 rounded-lg px-3 py-1.5 font-display font-800 text-xs uppercase text-white">
              {rowCrit.label}
            </span>
            <span className="font-display font-700 text-xs text-[var(--muted)]">+</span>
            <span className="bg-[var(--accent)]/20 border border-[var(--accent)]/40 rounded-lg px-3 py-1.5 font-display font-800 text-xs uppercase text-white">
              {colCrit.label}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKey}
            placeholder="Type player name…"
            aria-label="Search for a player name"
            className="w-full bg-[#0d1b2e] border border-[var(--border)] focus:border-[var(--accent)] rounded-lg px-4 py-3 text-white placeholder:text-white/30 outline-none font-display font-700 text-sm [color-scheme:dark]"
          />

          {suggestions.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] overflow-hidden">
              {suggestions.map((p, i) => (
                <button
                  key={p.name}
                  onClick={() => submit(p.name)}
                  onMouseEnter={() => setSelected(i)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors border-b border-[var(--border)] last:border-0 ${
                    i === selected
                      ? 'bg-[var(--accent)]'
                      : 'bg-[var(--card)] hover:bg-[var(--card-hover)]'
                  }`}
                >
                  <span className="font-display font-800 text-sm text-white uppercase">
                    {p.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => submit(query)}
            disabled={!query.trim()}
            className="w-full bg-[var(--accent)] disabled:opacity-40 py-3 rounded-lg font-display font-800 text-sm uppercase tracking-wider text-white hover:bg-[var(--accent)]/80 transition-colors"
          >
            Submit →
          </button>
        </div>
      </div>
    </div>
  )
}
