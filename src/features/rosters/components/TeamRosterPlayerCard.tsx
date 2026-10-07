import Link from 'next/link'
import { slugify } from '@/shared/rosters/rosters-data'
import { POS_LABELS } from '../domain/teamRosterMeta'

type RosterPlayer = { name: string; pos: string; uniform: string; bt: string; yob: number }

export default function TeamRosterPlayerCard({
  player,
  teamId,
  teamColor,
  isNew,
}: {
  player: RosterPlayer
  teamId: string
  teamColor: string
  isNew: boolean
}) {
  if (isNew) {
    return (
      <div className="flex items-center gap-4 bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3">
        <span className="font-display font-800 text-lg w-8 text-center shrink-0 text-[var(--muted)]">
          —
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-display font-800 text-sm uppercase text-white truncate">
            <strong>{player.name}</strong>
          </p>
          <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest">
            {POS_LABELS[player.pos] ?? player.pos}
          </p>
        </div>
      </div>
    )
  }
  return (
    <Link
      href={`/rosters/${teamId}/${slugify(player.name)}`}
      className="flex items-center gap-4 bg-[var(--card)] border border-[var(--border)] rounded-xl px-4 py-3 hover:border-[var(--accent)]/60 hover:bg-[var(--card-hover)] transition-all group"
    >
      <span
        className="font-display font-800 text-lg w-8 text-center shrink-0"
        style={{ color: teamColor === '#121b31' ? '#f59e0b' : teamColor }}
      >
        #{player.uniform}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-display font-800 text-sm uppercase text-white group-hover:text-[var(--accent)] transition-colors truncate">
          <strong>{player.name}</strong>
        </p>
        <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest">
          {POS_LABELS[player.pos] ?? player.pos} · B/T {player.bt} ·{' '}
          {new Date().getFullYear() - player.yob} yrs
        </p>
      </div>
      <span className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors text-sm shrink-0">
        →
      </span>
    </Link>
  )
}
