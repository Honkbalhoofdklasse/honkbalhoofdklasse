import Link from 'next/link'
import { AndroidSteps } from '../components/AndroidSteps'
import { IphoneSteps } from '../components/IphoneSteps'
import { NotifCard } from '../components/NotifCard'

export function NotificatiesScreen() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-display font-700 text-xs text-[var(--muted)] hover:text-white uppercase tracking-widest transition-colors mb-10"
      >
        Back
      </Link>

      <div className="relative mb-14">
        <div
          className="absolute -right-4 top-0 opacity-60 hidden sm:block"
          style={{ transform: 'rotate(3deg)' }}
        >
          <NotifCard
            title="Twins @ Pioniers — 6th inning"
            body="Nando Mostaert hits a 2-run home run! TWI 4 – PIO 1"
            time="now"
            color="#E05929"
          />
        </div>
        <div className="relative z-10 pt-2 pb-4 max-w-sm">
          <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-sm mb-3">
            Push notifications
          </p>
          <h1 className="font-display font-800 italic text-5xl uppercase text-white leading-tight mb-4">
            <strong>Never miss</strong>
            <br />
            <span className="text-[var(--accent)]">a pitch</span>
          </h1>
          <p className="text-[var(--muted)] text-sm leading-relaxed">
            Get instant alerts for home runs, scores, and game updates. Set up the app on your phone
            in two minutes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
        {[
          { label: 'Home runs', desc: 'Every home run, instantly on your screen' },
          { label: 'Live scores', desc: 'Inning-by-inning updates from your team' },
          { label: 'Final score', desc: 'Game result as soon as it ends' },
        ].map(({ label, desc }) => (
          <div
            key={label}
            className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5"
          >
            <p className="font-display font-800 uppercase text-white text-sm mb-1.5">
              <strong>{label}</strong>
            </p>
            <p className="text-[var(--muted)] text-xs leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      <IphoneSteps />

      <AndroidSteps />

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 text-center">
        <p className="font-display font-800 italic text-2xl uppercase text-white mb-2">
          <strong>Ready to start?</strong>
        </p>
        <p className="text-[var(--muted)] text-sm mb-6">
          Follow the steps above and never miss a home run again.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[var(--accent)] text-white font-display font-800 uppercase tracking-wider text-xs px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          Go to the app
        </Link>
      </div>
    </div>
  )
}
