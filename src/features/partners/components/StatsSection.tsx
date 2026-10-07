import { StatCard } from './StatCard'

export function StatsSection() {
  return (
    <section
      className="py-20 px-4 border-y border-white/5"
      style={{
        background: 'linear-gradient(180deg, transparent, rgba(255,107,0,0.05), transparent)',
      }}
    >
      <div className="max-w-5xl mx-auto">
        <p className="font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)] text-center mb-12">
          Ons bereik in cijfers
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          <StatCard value={5400} suffix="+" label="Volgers op socials" delay={0} />
          <StatCard value={3400000} suffix="+" label="Weergaven afgelopen 90 dagen" delay={150} />
          <StatCard value={82000} suffix="+" label="Interacties afgelopen 90 dagen" delay={300} />
          <StatCard value={7} suffix="" label="Clubs · 1 platform" delay={450} />
        </div>
      </div>
    </section>
  )
}
