export function AudienceSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-sm mb-2">
            Onze community
          </p>
          <h2 className="font-display font-800 italic text-5xl uppercase text-white">
            <strong>Doelgroep</strong>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
            <p className="font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)] mb-6">
              Leeftijdsverdeling
            </p>
            <div className="space-y-5">
              {[
                { label: '25–34 jaar', pct: 34.3, highlight: true },
                { label: '18–24 jaar', pct: 25.2, highlight: false },
                { label: '35–44 jaar', pct: 14.9, highlight: false },
                { label: '45–54 jaar', pct: 12.5, highlight: false },
              ].map(({ label, pct, highlight }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`font-display font-800 text-sm uppercase tracking-wider ${highlight ? 'text-white' : 'text-white/70'}`}
                    >
                      {label}
                    </span>
                    <span
                      className={`font-display font-800 text-sm ${highlight ? 'text-[var(--accent)]' : 'text-white/50'}`}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${(pct / 34.3) * 100}%`,
                        background: highlight ? 'var(--accent)' : 'rgba(255,255,255,0.25)',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 flex-1">
              <p className="font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)] mb-5">
                Geslacht
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Man', pct: 73.6 },
                  { label: 'Vrouw', pct: 26.4 },
                ].map(({ label, pct }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1.5">
                      <span className="font-display font-800 text-sm uppercase tracking-wider text-white">
                        {label}
                      </span>
                      <span className="font-display font-800 text-sm text-[var(--accent)]">
                        {pct}%
                      </span>
                    </div>
                    <div className="h-2 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--accent)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/30 rounded-2xl p-6 text-center">
              <p className="font-display font-800 italic text-5xl text-[var(--accent)] leading-none mb-2">
                <strong>52%</strong>
              </p>
              <p className="font-display font-700 text-xs uppercase tracking-widest text-white/60 leading-snug">
                van de weergaven
                <br />
                van niet-volgers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
