'use client'

export default function TabButton({
  active,
  disabled,
  onClick,
  children,
}: {
  active: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-display font-800 uppercase text-sm px-5 py-2.5 rounded-xl transition-all ${
        active
          ? 'bg-[var(--accent)] text-white'
          : disabled
            ? 'bg-[var(--card)] border border-[var(--border)] text-[var(--border)] cursor-not-allowed'
            : 'bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}
