'use client'

import type { RefObject } from 'react'
import Image from 'next/image'
import { TEAM_COLORS, TEAM_LOGOS, TEAM_NAMES } from '@/shared/teams/teams'
import type { PoolPlayer } from '../domain/types'

export function PlayerSearch({
  inputRef,
  query,
  setQuery,
  onKey,
  suggestions,
  selIdx,
  setSelIdx,
  submitGuess,
}: {
  inputRef: RefObject<HTMLInputElement | null>
  query: string
  setQuery: (value: string) => void
  onKey: (e: React.KeyboardEvent) => void
  suggestions: PoolPlayer[]
  selIdx: number
  setSelIdx: (i: number) => void
  submitGuess: (player: PoolPlayer) => void
}) {
  return (
    <div className="relative mb-5">
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={onKey}
        placeholder="Type a player name…"
        aria-label="Search for a player name"
        className="w-full bg-[#0d1b2e] border border-[var(--border)] focus:border-[var(--accent)] rounded-xl px-4 py-3.5 text-white placeholder:text-white/30 outline-none font-display font-700 text-sm [color-scheme:dark]"
      />
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-[#0a1220] border border-[var(--border)] rounded-xl overflow-hidden shadow-xl">
          {suggestions.map((p, i) => (
            <button
              key={p.name}
              onClick={() => submitGuess(p)}
              onMouseEnter={() => setSelIdx(i)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left border-b border-[var(--border)] last:border-0 transition-colors ${i === selIdx ? 'bg-[var(--accent)]' : 'hover:bg-[var(--card-hover)]'}`}
            >
              <div
                className="w-5 h-5 rounded flex items-center justify-center shrink-0 p-0.5"
                style={{ backgroundColor: TEAM_COLORS[p.teamId] }}
              >
                <Image
                  src={TEAM_LOGOS[p.teamId]}
                  alt=""
                  width={14}
                  height={14}
                  className="object-contain w-full h-full"
                />
              </div>
              <span className="font-display font-800 text-sm uppercase text-white">{p.name}</span>
              <span className="font-display font-700 text-xs text-white/40 uppercase ml-auto">
                {TEAM_NAMES[p.teamId]} · {p.pos}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
