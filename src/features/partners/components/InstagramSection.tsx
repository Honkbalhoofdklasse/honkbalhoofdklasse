import { InstagramCarousel } from './InstagramCarousel'

export function InstagramSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-sm mb-3">
              Bewezen bereik
            </p>
            <h2 className="font-display font-800 italic text-4xl uppercase text-white mb-4">
              <strong>Zo presteren onze posts</strong>
            </h2>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              Elk stuk content dat wij plaatsen trekt duizenden fans. Jouw merk staat op het
              middelpunt van die aandacht.
            </p>
          </div>
          <InstagramCarousel />
        </div>
      </div>
    </section>
  )
}
