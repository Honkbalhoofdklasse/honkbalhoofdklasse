import type { Stream } from '@/features/social/api/getLivestreamData'
import { PLATFORM_ICONS } from '@/features/social/domain/livestreamFormat'

export function LiveNowSection({ liveNow }: { liveNow: Stream[] }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-4">
        <span className="w-3 h-3 rounded-full bg-[var(--accent)] animate-pulse" />
        <h2 className="font-display font-800 italic text-3xl uppercase text-white">
          <strong>Live Now</strong>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {liveNow.map((stream) => (
          <a
            key={stream.id}
            href={stream.stream_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-[var(--accent)] rounded-2xl p-5 hover:opacity-90 transition-opacity"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <span className="font-display font-800 text-3xl text-white/60">
                {PLATFORM_ICONS[stream.platform ?? 'other']}
              </span>
              <span className="font-display font-800 text-xs text-white bg-white/20 px-2 py-1 rounded-full uppercase tracking-widest">
                Live
              </span>
            </div>
            <p className="font-display font-800 text-xl uppercase text-white leading-tight">
              <strong>{stream.title}</strong>
            </p>
            <p className="font-display font-700 text-white/70 text-sm mt-1 uppercase">
              {(stream.platform ?? 'Stream').toUpperCase()} · Click to watch →
            </p>
          </a>
        ))}
      </div>
    </section>
  )
}
