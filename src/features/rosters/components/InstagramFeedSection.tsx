import InstagramIcon from './InstagramIcon'

export default function InstagramFeedSection() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-6 bg-[var(--accent)] shrink-0" />
        <h2 className="font-display font-800 italic text-2xl uppercase text-white tracking-tight">
          <strong>Photos</strong>
        </h2>
      </div>
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="font-display font-800 text-base uppercase text-white">
            @honkbalhoofdklasse
          </p>
          <p className="font-display font-700 text-sm text-[var(--muted)] mt-1">
            Follow us on Instagram for the latest photos and videos
          </p>
        </div>
        <a
          href="https://www.instagram.com/honkbalhoofdklasse/"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg font-display font-800 text-sm uppercase tracking-wider text-white transition-opacity hover:opacity-80"
          style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)' }}
        >
          <InstagramIcon />
          Follow
        </a>
      </div>
    </section>
  )
}
