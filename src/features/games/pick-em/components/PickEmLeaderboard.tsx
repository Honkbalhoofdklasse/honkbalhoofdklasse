'use client'

import type { LeaderEntry, UserInfo } from '../domain/types'

export function PickEmLeaderboard({
  leaderboard,
  user,
}: {
  leaderboard: LeaderEntry[]
  user: UserInfo
}) {
  return (
    <div>
      {leaderboard.length === 0 ? (
        <div className="bg-[#0a1220] border border-[#1a2a3a] rounded-2xl p-8 text-center">
          <p className="font-display font-700 text-sm text-[var(--muted)] uppercase tracking-wider">
            Nog geen resultaten — kom terug na de eerste gespeelde wedstrijd.
          </p>
        </div>
      ) : (
        <div className="bg-[#0a1220] border border-[#1a2a3a] rounded-2xl overflow-hidden">
          <div
            className="grid px-5 py-3 border-b border-[#1a2a3a]"
            style={{ gridTemplateColumns: '40px 1fr 80px 80px 60px' }}
          >
            {['#', 'Naam', 'Goed', 'Totaal', '%'].map((h) => (
              <span
                key={h}
                className="font-display font-700 text-[10px] uppercase tracking-widest text-[var(--muted)] text-center first:text-left"
              >
                {h}
              </span>
            ))}
          </div>

          {leaderboard.map((entry, i) => {
            const isMe = entry.token === user?.token
            return (
              <div
                key={entry.token}
                className={`grid items-center px-5 py-3.5 border-b border-[#1a2a3a] last:border-0 ${isMe ? 'bg-[var(--accent)]/10' : i % 2 === 0 ? '' : 'bg-white/[0.02]'}`}
                style={{ gridTemplateColumns: '40px 1fr 80px 80px 60px' }}
              >
                <span
                  className={`font-display font-800 text-sm text-center ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-[var(--muted)]'}`}
                >
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                </span>
                <span
                  className={`font-display font-800 text-sm truncate ${isMe ? 'text-[var(--accent)]' : 'text-white'}`}
                >
                  {entry.nickname}
                  {isMe ? ' (jij)' : ''}
                </span>
                <span className="font-display font-800 text-sm text-green-400 text-center">
                  {entry.correct}
                </span>
                <span className="font-display font-700 text-sm text-[var(--muted)] text-center">
                  {entry.total}
                </span>
                <span className="font-display font-700 text-sm text-white text-center">
                  {entry.pct}%
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
