'use client'

import { TEAM_COLORS, TEAM_SHORT } from '@/shared/teams/teams'
import { formatFullName } from '../domain/names'
import type { Col, OnSelect, Row } from '../domain/types'

export default function LeaderTable<T extends Row>({
  title,
  rows,
  columns,
  statType,
  onSelect,
}: {
  title: string
  rows: T[]
  columns: Col<T>[]
  statType: 'batting' | 'pitching'
  onSelect: OnSelect
}) {
  const gridCols = `1rem 1fr ${columns.map(() => '3rem').join(' ')}`

  if (rows.length === 0) {
    return (
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
        <h2 className="font-display font-800 italic text-2xl uppercase text-white mb-2">
          <strong>{title}</strong>
        </h2>
        <p className="font-display text-[var(--muted)] text-sm uppercase">No data available</p>
      </div>
    )
  }

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <div
        className="grid items-center px-3 sm:px-5 pt-4 pb-2 gap-2 sm:gap-3"
        style={{ gridTemplateColumns: gridCols }}
      >
        <span />
        <div className="flex items-baseline gap-1.5">
          {(() => {
            const m = title.match(/^(.+?)(?:\s+\((.+?)\))?$/)
            const stat = m?.[1] ?? title
            const qual = m?.[2]
            return (
              <>
                <h2 className="font-display font-800 italic text-xl sm:text-2xl uppercase text-white">
                  <strong>{stat}</strong>
                </h2>
                {qual && (
                  <span className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-wider hidden sm:inline">
                    {qual}
                  </span>
                )}
              </>
            )
          })()}
        </div>
        {columns.map((col, ci) => (
          <p
            key={ci}
            className="font-display font-800 text-xs text-[var(--muted)] uppercase tracking-wider text-center"
          >
            {col.label}
          </p>
        ))}
      </div>
      <div className="divide-y divide-[var(--border)]">
        {rows.slice(0, 10).map((row, i) => {
          const isLeader = i === 0
          return (
            <button
              key={i}
              onClick={() =>
                onSelect(String(row.full_name ?? ''), String(row.team_id ?? ''), statType)
              }
              className={`w-full grid items-center px-3 sm:px-5 py-2 sm:py-2.5 gap-2 sm:gap-3 transition-colors text-left ${isLeader ? 'bg-[var(--accent)]' : 'hover:bg-[var(--card-hover)]'}`}
              style={{ gridTemplateColumns: gridCols }}
            >
              <span
                className={`font-display font-800 text-base ${isLeader ? 'text-white' : 'text-[var(--muted)]'}`}
              >
                {i + 1}
              </span>
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <span
                  className="font-display font-800 text-[10px] px-1 sm:px-1.5 py-0.5 rounded text-white shrink-0"
                  style={{
                    backgroundColor: isLeader
                      ? 'rgba(255,255,255,0.25)'
                      : (TEAM_COLORS[row.team_id as string] ?? '#1e335a'),
                  }}
                >
                  <strong>
                    {TEAM_SHORT[row.team_id as string] ??
                      String(row.team_id ?? '')
                        .slice(0, 3)
                        .toUpperCase()}
                  </strong>
                </span>
                {(() => {
                  const fn = formatFullName(String(row.full_name ?? ''))
                  return (
                    <p className="font-display font-800 text-sm sm:text-[1.1rem] uppercase leading-none truncate text-white">
                      <span className="hidden sm:inline">
                        <strong>{fn.split(' ')[0]} </strong>
                      </span>
                      <strong>{fn.split(' ').slice(1).join(' ')}</strong>
                    </p>
                  )
                })()}
              </div>
              {columns.map((col, ci) => {
                const isLast = ci === columns.length - 1
                return (
                  <p
                    key={ci}
                    className={`font-display font-800 text-sm sm:text-base text-center ${isLeader ? 'text-white' : isLast ? 'text-[var(--accent)]' : 'text-white'}`}
                  >
                    <strong>{col.value(row)}</strong>
                  </p>
                )
              })}
            </button>
          )
        })}
      </div>
    </div>
  )
}
