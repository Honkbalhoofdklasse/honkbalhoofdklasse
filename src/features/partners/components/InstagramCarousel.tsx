'use client'

import { useState } from 'react'
import { IG_POSTS } from '../domain/ig-posts'

export function InstagramCarousel() {
  const [idx, setIdx] = useState(0)
  const post = IG_POSTS[idx]

  return (
    <div className="max-w-sm mx-auto">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <div className="w-9 h-9 rounded-full overflow-hidden bg-[var(--accent)]/20 flex items-center justify-center shrink-0 p-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/dn8c5398m/image/upload/q_auto/f_auto/v1780500111/573820232_17862847515514579_6349657726355167801_n_vs87hx.jpg"
              alt="HK"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-display font-800 text-xs text-white uppercase tracking-wider">
              honkbalhoofdklasse
            </p>
            <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-wider">
              Gesponsord door {post.partner}
            </p>
          </div>
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/30 shrink-0" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>

        <div
          className="relative bg-black border-b border-[var(--border)]"
          style={{ aspectRatio: '3/4' }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.image} alt={post.partner} className="w-full h-full object-cover" />
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm rounded-xl px-2.5 py-1.5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.partnerLogo}
              alt={post.partner}
              className="h-5 max-w-[80px] object-contain"
            />
          </div>
          {post.isVideo && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-7 h-7 text-white ml-1" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 divide-x divide-[var(--border)] border-b border-[var(--border)]">
          {[
            { label: 'Bereik', val: post.reach, accent: true },
            { label: 'Likes', val: post.likes, accent: false },
            { label: 'Doorgestuurd', val: post.shares, accent: false },
          ].map(({ label, val, accent }) => (
            <div key={label} className="flex flex-col items-center justify-center py-5 px-2 gap-1">
              <p
                className={`font-display font-800 italic text-2xl leading-none ${accent ? 'text-[var(--accent)]' : 'text-white'}`}
              >
                <strong>{val.toLocaleString('nl-NL')}</strong>
              </p>
              <p className="font-display font-700 text-[10px] uppercase tracking-widest text-[var(--muted)] text-center">
                {label}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          onClick={() => setIdx((i) => (i - 1 + IG_POSTS.length) % IG_POSTS.length)}
          className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-white/60 hover:text-white hover:border-[var(--accent)]/50 transition-all"
        >
          ←
        </button>
        <div className="flex gap-1.5">
          {IG_POSTS.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all ${i === idx ? 'w-6 bg-[var(--accent)]' : 'w-1.5 bg-white/20'}`}
            />
          ))}
        </div>
        <button
          onClick={() => setIdx((i) => (i + 1) % IG_POSTS.length)}
          className="w-10 h-10 rounded-xl bg-[var(--card)] border border-[var(--border)] flex items-center justify-center text-white/60 hover:text-white hover:border-[var(--accent)]/50 transition-all"
        >
          →
        </button>
      </div>
    </div>
  )
}
