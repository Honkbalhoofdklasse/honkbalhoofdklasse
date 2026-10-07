import Link from 'next/link'
import NotificationShowcase from '@/features/home/components/NotificationShowcase'

export function NotificationsPromo() {
  return (
    <section className="py-14 px-6 md:px-12 border-t border-[#0f1e2e]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-xs mb-3">
              Live updates
            </p>
            <h2 className="font-display font-800 italic text-4xl uppercase text-white mb-4 leading-tight">
              <strong>Never miss a home run</strong>
            </h2>
            <p className="text-[var(--muted)] text-sm leading-relaxed mb-6">
              Turn on push notifications and get instant alerts for home runs, scores and game
              updates from your favorite team, straight to your phone.
            </p>
            <Link
              href="/notificaties"
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-white font-display font-800 uppercase tracking-wider text-xs px-5 py-3 rounded-xl hover:opacity-90 transition-opacity"
            >
              How to set it up
            </Link>
          </div>
          <NotificationShowcase />
        </div>
      </div>
    </section>
  )
}
