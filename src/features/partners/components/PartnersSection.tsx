import { PARTNERS } from '../domain/partners'

export function PartnersSection() {
  return (
    <section className="py-20 px-4 bg-[var(--card)]/30">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-sm mb-2">
            Huidige partners
          </p>
          <h2 className="font-display font-800 italic text-4xl uppercase text-white">
            <strong>Ze gingen je voor</strong>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PARTNERS.map((p) => (
            <div
              key={p.name}
              className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 flex items-center justify-center hover:border-[var(--accent)]/40 transition-colors group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.logo}
                alt={p.name}
                className="max-h-10 max-w-[140px] object-contain opacity-60 group-hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
