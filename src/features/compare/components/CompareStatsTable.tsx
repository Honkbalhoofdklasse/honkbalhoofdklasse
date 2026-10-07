'use client'

import Image from 'next/image'
import { TEAM_LOGOS } from '@/shared/teams/teams'
import type { CmpPlayer } from '../api/compareRoute'
import { RADAR_C1, RADAR_C2 } from '../domain/radar'
import { STAT_ROWS, fmtStat } from '../domain/statRows'

export default function CompareStatsTable({
  p1,
  p2,
  tc1,
  tc2,
}: {
  p1: CmpPlayer
  p2: CmpPlayer
  tc1: string
  tc2: string
}) {
  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
      {/* Table header */}
      <div className="grid grid-cols-[1fr_auto_1fr] border-b border-[var(--border)]">
        <div
          className="px-4 py-3 flex items-center gap-2"
          style={{ borderLeft: `3px solid ${RADAR_C1}` }}
        >
          {TEAM_LOGOS[p1.teamId] && (
            <div
              className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center p-1"
              style={{ backgroundColor: tc1 }}
            >
              <Image
                src={TEAM_LOGOS[p1.teamId]!}
                alt=""
                width={16}
                height={16}
                className="object-contain w-full h-full"
              />
            </div>
          )}
          <p className="font-display font-800 text-sm text-white truncate">{p1.name}</p>
        </div>
        <div className="px-4 py-3 flex items-center justify-center">
          <span className="font-display font-700 text-[10px] uppercase tracking-widest text-[var(--muted)]">
            Stat
          </span>
        </div>
        <div
          className="px-4 py-3 flex items-center justify-end gap-2"
          style={{ borderRight: `3px solid ${RADAR_C2}` }}
        >
          <p className="font-display font-800 text-sm text-white truncate">{p2.name}</p>
          {TEAM_LOGOS[p2.teamId] && (
            <div
              className="w-6 h-6 rounded-md shrink-0 flex items-center justify-center p-1"
              style={{ backgroundColor: tc2 }}
            >
              <Image
                src={TEAM_LOGOS[p2.teamId]!}
                alt=""
                width={16}
                height={16}
                className="object-contain w-full h-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* Rows */}
      {STAT_ROWS.map((row, i) => {
        const v1 = p1[row.key] as number
        const v2 = p2[row.key] as number
        const p1Better = row.lowerBetter ? v1 < v2 : v1 > v2
        const p2Better = row.lowerBetter ? v2 < v1 : v2 > v1
        const tie = v1 === v2

        return (
          <div
            key={row.key}
            className={`grid grid-cols-[1fr_auto_1fr] ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}
          >
            <div className="px-4 py-2.5 flex items-center">
              <span
                className={`font-display font-800 text-sm tabular-nums ${
                  !tie && p1Better ? 'text-white' : 'text-white/40'
                }`}
              >
                {fmtStat(row, v1)}
              </span>
              {!tie && p1Better && (
                <div
                  className="ml-2 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: RADAR_C1 }}
                />
              )}
            </div>
            <div className="px-4 py-2.5 flex items-center justify-center min-w-[52px]">
              <span className="font-display font-700 text-[10px] uppercase tracking-widest text-[var(--muted)]">
                {row.label}
              </span>
            </div>
            <div className="px-4 py-2.5 flex items-center justify-end">
              {!tie && p2Better && (
                <div
                  className="mr-2 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: RADAR_C2 }}
                />
              )}
              <span
                className={`font-display font-800 text-sm tabular-nums ${
                  !tie && p2Better ? 'text-white' : 'text-white/40'
                }`}
              >
                {fmtStat(row, v2)}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
