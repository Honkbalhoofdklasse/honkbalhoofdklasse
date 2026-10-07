'use client'

import type { PlayerPhoto } from '@/features/admin/domain/photos'

export default function PhotosHeader({
  photos,
  allPlayers,
  filter,
  setFilter,
  compressing,
  compressAll,
}: {
  photos: PlayerPhoto[]
  allPlayers: { name: string; teamId: string }[]
  filter: string
  setFilter: (value: string) => void
  compressing: { done: number; total: number } | null
  compressAll: () => void
}) {
  return (
    <div className="flex items-end justify-between gap-4 flex-wrap">
      <div>
        <p className="font-display font-700 text-[var(--accent)] text-xs uppercase tracking-widest mb-1">
          Admin
        </p>
        <h1 className="font-display font-800 italic text-4xl uppercase text-white">
          Player Photos
        </h1>
        <p className="font-display font-700 text-[var(--muted)] text-sm mt-1 uppercase tracking-wider">
          {photos.filter((p) => p.banner_url || p.headshot_url).length} van {allPlayers.length}{' '}
          spelers hebben foto&apos;s
        </p>
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        <input
          type="search"
          placeholder="Zoek speler of team..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[var(--card)] border border-[var(--border)] focus:border-[var(--accent)] rounded-lg px-4 py-2.5 text-white outline-none font-display font-700 text-sm w-64"
        />
        <button
          onClick={compressAll}
          disabled={!!compressing}
          className="flex items-center gap-2 border border-[var(--border)] hover:border-[var(--accent)] text-[var(--muted)] hover:text-white transition-colors rounded-lg px-4 py-2.5 font-display font-800 text-xs uppercase tracking-widest disabled:opacity-50"
        >
          {compressing ? (
            <>
              <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              {compressing.done}/{compressing.total} compressed…
            </>
          ) : (
            <>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Compress all photos
            </>
          )}
        </button>
      </div>
    </div>
  )
}
