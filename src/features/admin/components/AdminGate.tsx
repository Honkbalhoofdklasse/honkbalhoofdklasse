'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import EyeIcon from '@/features/admin/components/EyeIcon'

type Props = {
  checkAuth: (pw: string) => Promise<boolean>
  onAuth: (pw: string) => void
  children: React.ReactNode
}
export default function AdminGate({ checkAuth, onAuth, children }: Props) {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [pw, setPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('admin-pw')
    if (stored) {
      checkAuth(stored).then((ok) => {
        if (ok) {
          onAuth(stored)
          setAuthed(true)
        }
        setChecking(false)
      })
    } else {
      setChecking(false)
    }
  }, [])

  const login = useCallback(async () => {
    if (!pw) return
    setLoading(true)
    setError('')
    const ok = await checkAuth(pw)
    if (ok) {
      localStorage.setItem('admin-pw', pw)
      onAuth(pw)
      setAuthed(true)
    } else {
      setError('Incorrect password')
    }
    setLoading(false)
  }, [pw, checkAuth, onAuth])

  if (checking) return null
  if (authed) return <>{children}</>

  return (
    <div className="min-h-screen flex bg-[#04080f]">
      <div className="hidden lg:flex w-[55%] relative overflow-hidden flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-[#04080f] via-[#07101e] to-[#0a1525]" />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="absolute rounded-full border border-[var(--accent)]/20 animate-ripple"
              style={{
                width: `${i * 160}px`,
                height: `${i * 160}px`,
                animationDelay: `${i * 0.6}s`,
                animationDuration: '4s',
              }}
            />
          ))}
        </div>

        <div className="absolute top-0 bottom-0 w-[3px] right-0 bg-gradient-to-b from-transparent via-[var(--accent)]/40 to-transparent" />

        <div className="relative z-10 flex flex-col items-center gap-8 px-12">
          <Image
            src="https://res.cloudinary.com/dn8c5398m/image/upload/q_auto/f_auto/v1781607525/hk_logo_iets_groter_tumykq.png"
            alt="Honkbal Hoofdklasse"
            width={90}
            height={90}
            className="opacity-90"
          />
          <div className="text-center">
            <p className="font-display font-700 text-[var(--accent)] uppercase tracking-[0.4em] text-sm mb-2">
              KNBSB · Season 2026
            </p>
            <h1
              className="font-display font-800 italic uppercase tracking-tight leading-none text-white"
              style={{ fontSize: 'clamp(3.5rem, 6vw, 6rem)', lineHeight: 0.88 }}
            >
              HONKBAL
              <br />
              <strong className="text-[var(--accent)]">HOOFD&shy;KLASSE</strong>
            </h1>
          </div>
          <div className="w-16 h-[2px] bg-[var(--accent)]/40 rounded-full" />
          <p className="font-display font-700 text-[var(--muted)] uppercase tracking-[0.3em] text-xs">
            Admin Panel
          </p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div
          className="lg:hidden flex flex-col items-center gap-3 mb-10 animate-fade-slide-up"
          style={{ animationDelay: '0ms' }}
        >
          <Image
            src="https://res.cloudinary.com/dn8c5398m/image/upload/q_auto/f_auto/v1781607525/hk_logo_iets_groter_tumykq.png"
            alt="Honkbal Hoofdklasse"
            width={60}
            height={60}
          />
          <p className="font-display font-700 text-[var(--accent)] uppercase tracking-[0.35em] text-xs">
            Admin Panel
          </p>
        </div>

        <div className="w-full max-w-sm space-y-8">
          <div className="animate-fade-slide-up" style={{ animationDelay: '60ms' }}>
            <p className="font-display font-700 text-[var(--accent)] uppercase tracking-[0.35em] text-xs mb-2">
              Restricted Access
            </p>
            <h2
              className="font-display font-800 italic uppercase text-white leading-none"
              style={{ fontSize: '2.8rem' }}
            >
              <strong>Admin</strong>
            </h2>
            <p className="font-display font-700 text-[var(--muted)] text-sm mt-2 uppercase tracking-wider">
              Enter your password to continue
            </p>
          </div>

          <div
            className="animate-fade-slide-up flex items-center gap-4"
            style={{ animationDelay: '120ms' }}
          >
            <div className="flex-1 h-px bg-[var(--border)]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]/60" />
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          <div className="animate-fade-slide-up space-y-2" style={{ animationDelay: '180ms' }}>
            <label className="font-display font-700 text-xs text-[var(--muted)] uppercase tracking-widest block">
              Password
            </label>
            <div className="relative group">
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-transparent via-[var(--accent)]/0 to-transparent group-focus-within:via-[var(--accent)]/50 transition-all duration-300" />
              <input
                type={showPw ? 'text' : 'password'}
                value={pw}
                onChange={(e) => {
                  setPw(e.target.value)
                  setError('')
                }}
                onKeyDown={(e) => e.key === 'Enter' && login()}
                placeholder="••••••••••••"
                autoComplete="current-password"
                className="relative w-full bg-[#0a1525] border border-[var(--border)] focus:border-[var(--accent)]/60 rounded-xl px-4 py-3.5 pr-12 text-white placeholder:text-white/20 outline-none font-display font-700 text-sm tracking-wider transition-colors [color-scheme:dark]"
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute inset-y-0 right-0 px-4 flex items-center text-[var(--muted)] hover:text-white transition-colors"
              >
                <EyeIcon open={showPw} />
              </button>
            </div>

            {error && (
              <p className="font-display font-700 text-xs text-red-400 uppercase tracking-widest flex items-center gap-2 pt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {error}
              </p>
            )}
          </div>

          <div className="animate-fade-slide-up" style={{ animationDelay: '240ms' }}>
            <button
              onClick={login}
              disabled={loading || !pw}
              className="relative w-full overflow-hidden bg-[var(--accent)] hover:bg-[var(--accent)]/85 disabled:opacity-40 disabled:cursor-not-allowed transition-all py-3.5 rounded-xl font-display font-800 text-sm uppercase tracking-[0.2em] text-white group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Checking…
                  </>
                ) : (
                  <>
                    Access Admin
                    <span className="group-hover:translate-x-1 transition-transform inline-block">
                      →
                    </span>
                  </>
                )}
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
