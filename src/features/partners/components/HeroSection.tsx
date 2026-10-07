import { RotatingWord } from './RotatingWord'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[var(--accent)]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-[var(--accent)]/15 border border-[var(--accent)]/30 rounded-full px-5 py-2 mb-8">
          <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full animate-pulse" />
          <span className="font-display font-700 text-xs uppercase tracking-widest text-[var(--accent)]">
            Seizoen 2026 · Hoofdklasse
          </span>
        </div>

        <h1 className="font-display font-800 italic text-6xl md:text-8xl uppercase tracking-tight text-white leading-none mb-6">
          <strong>Bereik elke fan van</strong>
          <br />
          <RotatingWord />
        </h1>

        <p className="text-[var(--muted)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Bereik een betrokken doelgroep van spelers, fans, coaches en clubs. Samen bouwen we aan de
          groei en zichtbaarheid van het Nederlandse honkbal.
        </p>

        <a
          href="#contact"
          className="inline-flex items-center gap-3 bg-[var(--accent)] text-white font-display font-800 uppercase tracking-wider text-sm px-8 py-4 rounded-2xl hover:opacity-90 transition-opacity shadow-lg shadow-[var(--accent)]/25"
        >
          Word partner →
        </a>
      </div>
    </section>
  )
}
