export function CasesSection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-sm mb-2">
            Mogelijkheden
          </p>
          <h2 className="font-display font-800 italic text-5xl uppercase text-white">
            <strong>Waar kun je aan denken?</strong>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4 hover:border-[var(--accent)]/40 transition-colors">
            <span className="font-display font-800 italic text-5xl text-[var(--accent)]/30 leading-none">
              <strong>01</strong>
            </span>
            <div>
              <h3 className="font-display font-800 uppercase text-white text-lg mb-2">
                <strong>Logo bij Hoofdklasse Pickle</strong>
              </h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">
                Terugkerende bezoekers met 1.000+ unieke bezoekers in de eerste 2 weken. Hoge
                zichtbaarheid bij een vaste, betrokken groep fans.
              </p>
            </div>
            <a
              href="#contact"
              className="mt-auto font-display font-800 text-xs uppercase tracking-wider text-[var(--accent)] hover:underline"
            >
              Meer weten →
            </a>
          </div>

          <div className="bg-[var(--accent)] border border-[var(--accent)] rounded-2xl p-6 flex flex-col gap-4">
            <span className="font-display font-800 italic text-5xl text-white/20 leading-none">
              <strong>02</strong>
            </span>
            <div>
              <h3 className="font-display font-800 uppercase text-white text-lg mb-2">
                <strong>Rankings, awards en content-series</strong>
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Jouw naam koppelen aan wekelijkse awards, statistiekoverzichten of vaste
                content-rubrieken. Structurele zichtbaarheid gedurende het hele seizoen.
              </p>
            </div>
            <a
              href="#contact"
              className="mt-auto font-display font-800 text-xs uppercase tracking-wider text-white hover:underline"
            >
              Meer weten →
            </a>
          </div>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 flex flex-col gap-4 hover:border-[var(--accent)]/40 transition-colors">
            <span className="font-display font-800 italic text-5xl text-[var(--accent)]/30 leading-none">
              <strong>03</strong>
            </span>
            <div>
              <h3 className="font-display font-800 uppercase text-white text-lg mb-2">
                <strong>Custom campagne</strong>
              </h3>
              <p className="text-[var(--muted)] text-sm leading-relaxed">
                Maatwerk is altijd mogelijk. Denk aan branded posts, exclusieve vermeldingen of een
                campagne die volledig aansluit op jouw merk en doelen.
              </p>
            </div>
            <a
              href="#contact"
              className="mt-auto font-display font-800 text-xs uppercase tracking-wider text-[var(--accent)] hover:underline"
            >
              Meer weten →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
