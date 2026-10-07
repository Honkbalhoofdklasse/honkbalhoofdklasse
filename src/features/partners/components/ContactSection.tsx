import { PartnerForm } from './PartnerForm'

export function ContactSection() {
  return (
    <section id="contact" className="py-20 px-4 border-t border-[var(--border)]">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-sm mb-2">
            Klaar om te starten?
          </p>
          <h2 className="font-display font-800 italic text-5xl uppercase text-white mb-4">
            <strong>Neem contact op</strong>
          </h2>
          <p className="text-[var(--muted)] text-sm leading-relaxed">
            Vul het formulier in en we nemen binnen 2 werkdagen contact op voor een kennismaking.
          </p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 md:p-8">
          <PartnerForm />
        </div>
      </div>
    </section>
  )
}
