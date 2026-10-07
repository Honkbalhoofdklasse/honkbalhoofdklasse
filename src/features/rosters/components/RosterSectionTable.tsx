'use client'

import type { NewPlayer, Section, SelectedPlayer } from '../domain/rosterTabsTypes'

export default function RosterSectionTable({
  section,
  sectionPlayers,
  color,
  activeTeam,
  onSelectPlayer,
}: {
  section: Section
  sectionPlayers: NewPlayer[]
  color: string
  activeTeam: string
  onSelectPlayer: (player: SelectedPlayer) => void
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: color }}
        >
          <span className="font-display font-800 text-white text-xs">{section.short}</span>
        </div>
        <div>
          <h2 className="font-display font-800 italic text-2xl uppercase text-white leading-none">
            <strong>{section.label}</strong>
          </h2>
          <p className="font-display font-700 text-xs text-[var(--muted)] uppercase tracking-widest">
            {sectionPlayers.length} player{sectionPlayers.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)]">
              <th className="font-display font-700 text-[10px] uppercase tracking-widest text-[var(--muted)] text-center px-3 py-2 w-10">
                #
              </th>
              <th className="font-display font-700 text-[10px] uppercase tracking-widest text-[var(--muted)] text-left px-3 py-2">
                Name
              </th>
              <th className="font-display font-700 text-[10px] uppercase tracking-widest text-[var(--muted)] text-center px-3 py-2 w-14">
                POS
              </th>
              <th className="font-display font-700 text-[10px] uppercase tracking-widest text-[var(--muted)] text-center px-3 py-2 w-14">
                B/T
              </th>
              <th className="font-display font-700 text-[10px] uppercase tracking-widest text-[var(--muted)] text-center px-3 py-2 w-14">
                YOB
              </th>
            </tr>
          </thead>
          <tbody>
            {sectionPlayers.map((player, i) => (
              <tr
                key={i}
                onClick={() =>
                  onSelectPlayer({
                    name: player.name,
                    teamId: activeTeam,
                    statType: player.pos === 'P' ? 'pitching' : 'batting',
                  })
                }
                className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--card-hover)] transition-colors group cursor-pointer"
              >
                <td className="font-display font-800 text-sm text-center px-3 py-2.5 w-10 text-white">
                  {player.uniform || '–'}
                </td>
                <td className="font-display font-800 text-base text-white px-3 py-2.5 group-hover:text-[var(--accent)] transition-colors">
                  {player.name}
                </td>
                <td className="text-center px-3 py-2.5 w-14">
                  <span
                    className="font-display font-800 text-[10px] px-1.5 py-0.5 rounded text-white"
                    style={{ backgroundColor: color }}
                  >
                    {player.pos}
                  </span>
                </td>
                <td className="font-display font-700 text-xs text-[var(--muted)] text-center px-3 py-2.5 w-14">
                  {player.bt}
                </td>
                <td className="font-display font-700 text-xs text-[var(--muted)] text-center px-3 py-2.5 w-14">
                  {player.yob}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
