export function WhySection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-sm mb-3">
              Waarom Honkbal Hoofdklasse?
            </p>
            <h2 className="font-display font-800 italic text-5xl uppercase text-white mb-8">
              <strong>Dedicated platform voor Nederlands topbaseball</strong>
            </h2>
            <ul className="space-y-4">
              {[
                'Dedicated platform voor Nederlands topbaseball',
                'Dagelijkse content',
                'Groeiend social bereik',
                'Focus op de complete competitie',
                'Directe toegang tot een niche maar zeer betrokken doelgroep',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[var(--accent)]/15 border border-[var(--accent)]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  </span>
                  <span className="font-display font-700 text-white/80 text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 space-y-6">
            {[
              { n: '2.25M+', l: 'Weergaven · 90 dagen' },
              { n: '68K+', l: 'Interacties · 90 dagen' },
              { n: '52%', l: 'Bereik buiten eigen volgers' },
              { n: '7', l: 'Clubs · 1 platform' },
            ].map(({ n, l }) => (
              <div
                key={l}
                className="flex items-center gap-4 border-b border-[var(--border)] last:border-0 pb-5 last:pb-0"
              >
                <p className="font-display font-800 italic text-3xl text-[var(--accent)] shrink-0 w-24 leading-none">
                  <strong>{n}</strong>
                </p>
                <p className="font-display font-700 text-sm uppercase tracking-wider text-white/60">
                  {l}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
