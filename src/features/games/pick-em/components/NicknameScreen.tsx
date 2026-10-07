'use client'

export function NicknameScreen({
  nickInput,
  setNickInput,
  saveUser,
}: {
  nickInput: string
  setNickInput: (value: string) => void
  saveUser: () => void
}) {
  return (
    <div className="min-h-screen bg-[#06101e] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-xs mb-2">
            Honkbal Hoofdklasse
          </p>
          <h1 className="font-display font-800 italic text-5xl uppercase text-white leading-none">
            Pick <span className="text-[var(--accent)]">'em</span>
          </h1>
          <p className="font-display font-700 text-sm text-[var(--muted)] mt-3 uppercase tracking-wider">
            Voorspel elke ronde de uitslagen
          </p>
        </div>

        <div className="bg-[#0a1220] border border-[#1a2a3a] rounded-2xl p-6">
          <p className="font-display font-800 text-sm uppercase text-white tracking-wide mb-4">
            Kies een bijnaam
          </p>
          <input
            type="text"
            value={nickInput}
            onChange={(e) => setNickInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && saveUser()}
            placeholder="Jouw naam…"
            maxLength={20}
            className="w-full bg-[#06101e] border border-[#1a2a3a] rounded-xl px-4 py-3 font-display font-700 text-white placeholder:text-[var(--muted)] outline-none focus:border-[var(--accent)] transition-colors mb-3"
          />
          <button
            onClick={saveUser}
            disabled={!nickInput.trim()}
            className="w-full bg-[var(--accent)] text-white font-display font-800 text-sm uppercase tracking-wider py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            Spelen →
          </button>
        </div>
      </div>
    </div>
  )
}
