'use client'

import { TEAM_COLORS, TEAM_SHORT, KNBSB_TEAM_MAP } from '@/shared/teams/teams'
import { parseKnbsbName } from '../domain/names'
import { assignRanks, getStatValue, parseLabel } from '../domain/statValue'
import type { KnbsbCategory, OnSelect } from '../domain/types'

export default function CategoryCard({
  category,
  statType,
  onSelect,
}: {
  category: KnbsbCategory
  statType: 'batting' | 'pitching'
  onSelect: OnSelect
}) {
  const { stat, qualifier } = parseLabel(category.label)
  const ranks = assignRanks(category.data)
  const gridCols = '1.5rem 1fr 3.5rem'

  return (
    <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex items-baseline gap-2">
          <h2 className="font-display font-800 italic text-2xl uppercase text-white">
            <strong>{stat}</strong>
          </h2>
          {qualifier && (
            <span className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-wider">
              {qualifier}
            </span>
          )}
        </div>
        {category.type === 'sb' && (
          <div className="h-7 w-14 flex items-center justify-end shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/dqld625sq/image/upload/v1778604074/SSK_LOGO_hiu1wg.png"
              alt="SSK"
              className="max-h-full max-w-full object-contain opacity-90"
            />
          </div>
        )}
      </div>
      {category.data.length === 0 ? (
        <p className="px-5 py-3 font-display font-700 text-[var(--muted)] text-sm uppercase">
          No data
        </p>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {category.data.map((player, i) => {
            const rank = ranks[i]
            const isFirst = rank === '1' || rank === 'T1'
            const teamKey = KNBSB_TEAM_MAP[String(player.team ?? '')] ?? ''
            const name = parseKnbsbName(player)
            const value = getStatValue(category.type, player)

            return (
              <button
                key={i}
                onClick={() => onSelect(name, teamKey, statType)}
                className={`w-full grid items-center px-5 py-2.5 gap-3 transition-colors text-left ${
                  isFirst ? 'bg-[var(--accent)]' : 'hover:bg-[var(--card-hover)]'
                }`}
                style={{ gridTemplateColumns: gridCols }}
              >
                <span
                  className={`font-display font-800 text-lg ${isFirst ? 'text-white' : 'text-[var(--muted)]'}`}
                >
                  {rank}
                </span>
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="font-display font-800 text-xs px-1.5 py-0.5 rounded text-white shrink-0"
                    style={{
                      backgroundColor: isFirst
                        ? 'rgba(255,255,255,0.25)'
                        : (TEAM_COLORS[teamKey] ?? '#1e335a'),
                    }}
                  >
                    <strong>{TEAM_SHORT[teamKey] ?? String(player.team ?? '').slice(0, 3)}</strong>
                  </span>
                  <p className="font-display font-800 text-[1.2rem] uppercase leading-none truncate text-white">
                    <span className="hidden sm:inline">
                      <strong>{name.split(' ')[0]} </strong>
                    </span>
                    <strong>{name.split(' ').slice(1).join(' ')}</strong>
                  </p>
                </div>
                <p
                  className={`font-display font-800 text-lg text-center ${isFirst ? 'text-white' : 'text-[var(--accent)]'}`}
                >
                  <strong>{value}</strong>
                </p>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
