import type { Stream } from '@/features/social/api/getLivestreamData'
import { PLATFORM_ICONS, formatDateTime } from '@/features/social/domain/livestreamFormat'

export function ScheduledStreamsSection({ scheduled }: { scheduled: Stream[] }) {
  return (
    <section>
      <h2 className="font-display font-800 italic text-2xl uppercase text-white mb-4">
        <strong>Scheduled Streams</strong>
      </h2>
      <div className="space-y-3">
        {scheduled.map((stream) => (
          <a
            key={stream.id}
            href={stream.stream_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 bg-[var(--card)] border border-[var(--border)] rounded-xl px-5 py-4 hover:border-[var(--accent)] transition-colors group"
          >
            <span className="font-display font-800 text-2xl text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors">
              {PLATFORM_ICONS[stream.platform ?? 'other']}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-800 text-lg uppercase text-white leading-none">
                <strong>{stream.title}</strong>
              </p>
              {stream.scheduled_at && (
                <p className="font-display font-700 text-[var(--muted)] text-sm mt-0.5 uppercase">
                  {formatDateTime(stream.scheduled_at)}
                </p>
              )}
            </div>
            <div className="shrink-0">
              <span className="font-display font-700 text-xs text-[var(--muted)] uppercase bg-[var(--card-hover)] px-3 py-1.5 rounded-lg border border-[var(--border)]">
                {(stream.platform ?? 'stream').toUpperCase()}
              </span>
            </div>
            <span className="font-display font-800 text-[var(--accent)] text-lg shrink-0">→</span>
          </a>
        ))}
      </div>
    </section>
  )
}
