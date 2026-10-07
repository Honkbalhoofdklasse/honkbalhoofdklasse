'use client'

import Image from 'next/image'
import Link from 'next/link'
import { TEAM_COLORS, TEAM_LOGOS, TEAM_NAMES } from '@/shared/teams/teams'
import type { TeamBatting, TeamPitching } from '@/shared/teams/team-stats'
import { BATTING_SORTS, PITCHING_SORTS, type SortKey, type Standing } from '../domain/teamsSort'
import StatValue from './StatValue'

export default function TeamRow({
  teamId,
  rank,
  s,
  bat,
  pit,
  sortKey,
  activeStat,
}: {
  teamId: string
  rank: number
  s: Standing | undefined
  bat: TeamBatting | undefined
  pit: TeamPitching | undefined
  sortKey: SortKey
  activeStat: SortKey | null
}) {
  const color = TEAM_COLORS[teamId] ?? '#1e335a'
  const name = TEAM_NAMES[teamId] ?? teamId
  const logo = TEAM_LOGOS[teamId]
  const rd = s ? s.runs_scored - s.runs_allowed : 0

  return (
    <Link
      href={`/teams/${teamId}`}
      className="flex items-center gap-4 bg-[var(--card)] border border-[var(--border)] rounded-2xl px-5 py-4 hover:border-[var(--accent)]/40 hover:bg-[var(--card-hover)] transition-all group"
    >
      {/* Rank */}
      <span className="font-display font-800 text-2xl text-[var(--muted)] w-6 shrink-0 text-right">
        {rank}
      </span>

      {/* Logo */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 p-2"
        style={{ backgroundColor: color }}
      >
        {logo ? (
          <Image
            src={logo}
            alt={name}
            width={40}
            height={40}
            className="object-contain w-full h-full"
          />
        ) : (
          <span className="font-display font-800 text-xs text-white">
            {teamId.slice(0, 3).toUpperCase()}
          </span>
        )}
      </div>

      {/* Name + record */}
      <div className="flex-1 min-w-0">
        <p className="font-display font-800 text-base md:text-lg uppercase tracking-wide text-white leading-none truncate">
          {name}
        </p>
        {s && (
          <p className="font-display font-700 text-xs text-[var(--muted)] mt-1">
            {s.wins}–{s.losses}
            <span className="hidden sm:inline">
              {' '}
              &middot; {s.win_pct.toFixed(3).replace('0.', '.')}
            </span>
            <span className={`ml-1 ${rd >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {rd >= 0 ? '+' : ''}
              {rd}
            </span>
          </p>
        )}
      </div>

      {/* Batting stats (desktop) */}
      <div className="hidden md:flex gap-6 shrink-0">
        {BATTING_SORTS.map((btn) => (
          <div key={btn.key} className="text-center w-10">
            <p
              className={`font-display font-700 text-[10px] uppercase tracking-wider ${sortKey === btn.key ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}
            >
              {btn.label}
            </p>
            <p
              className={`font-display font-800 text-base ${sortKey === btn.key ? 'text-[var(--accent)]' : 'text-white'}`}
            >
              <StatValue sortKey={btn.key} bat={bat} pit={pit} />
            </p>
          </div>
        ))}
      </div>

      <div className="hidden md:block w-px h-8 bg-white/10 shrink-0" />

      {/* Pitching stats (desktop) */}
      <div className="hidden md:flex gap-6 shrink-0">
        {PITCHING_SORTS.map((btn) => (
          <div key={btn.key} className="text-center w-10">
            <p
              className={`font-display font-700 text-[10px] uppercase tracking-wider ${sortKey === btn.key ? 'text-[var(--accent)]' : 'text-[var(--muted)]'}`}
            >
              {btn.label}
            </p>
            <p
              className={`font-display font-800 text-base ${sortKey === btn.key ? 'text-[var(--accent)]' : 'text-white'}`}
            >
              <StatValue sortKey={btn.key} bat={bat} pit={pit} />
            </p>
          </div>
        ))}
      </div>

      {/* Active sort value on mobile */}
      {activeStat && (
        <div className="md:hidden text-center shrink-0">
          <p className="font-display font-700 text-[10px] uppercase text-[var(--accent)] tracking-wider">
            {BATTING_SORTS.concat(PITCHING_SORTS).find((b) => b.key === activeStat)?.label}
          </p>
          <p className="font-display font-800 text-lg text-[var(--accent)]">
            <StatValue sortKey={activeStat} bat={bat} pit={pit} />
          </p>
        </div>
      )}

      <span className="font-display font-800 text-[var(--accent)] text-xl group-hover:translate-x-1 transition-transform shrink-0">
        →
      </span>
    </Link>
  )
}
