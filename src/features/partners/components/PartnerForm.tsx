'use client'

import { useState } from 'react'

export function PartnerForm() {
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ company: '', name: '', email: '', phone: '', message: '' })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch('/api/partner-contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) setSent(true)
    } catch {
      /* ignore */
    }
    setSending(false)
  }

  if (sent)
    return (
      <div className="text-center py-16 px-8">
        <div className="text-5xl mb-4">⚾</div>
        <h3 className="font-display font-800 italic text-3xl uppercase text-white mb-3">
          <strong>Bedankt!</strong>
        </h3>
        <p className="text-[var(--muted)] font-display font-700 text-sm uppercase tracking-wider">
          We nemen binnen 2 werkdagen contact met je op.
        </p>
      </div>
    )

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)] mb-2">
            Bedrijfsnaam *
          </label>
          <input
            required
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-display font-700 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
            placeholder="Jouw bedrijf BV"
          />
        </div>
        <div>
          <label className="block font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)] mb-2">
            Contactpersoon *
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-display font-700 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
            placeholder="Naam"
          />
        </div>
        <div>
          <label className="block font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)] mb-2">
            E-mailadres *
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-display font-700 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
            placeholder="info@bedrijf.nl"
          />
        </div>
        <div>
          <label className="block font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)] mb-2">
            Telefoonnummer
          </label>
          <input
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-display font-700 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors"
            placeholder="+31 6 00 00 00 00"
          />
        </div>
      </div>

      <div>
        <label className="block font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)] mb-2">
          Bericht
        </label>
        <textarea
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-display font-700 text-sm focus:outline-none focus:border-[var(--accent)] transition-colors resize-none"
          placeholder="Vertel ons over je merk en doelen..."
        />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="w-full bg-[var(--accent)] text-white font-display font-800 uppercase tracking-wider text-sm py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
      >
        {sending ? 'Versturen…' : 'Verstuur aanvraag →'}
      </button>
    </form>
  )
}
