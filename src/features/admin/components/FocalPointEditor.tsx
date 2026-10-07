'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export default function FocalPointEditor({
  playerName,
  url,
  initialX,
  initialY,
  savedPw,
  onSaved,
  onClose,
}: {
  playerName: string
  url: string
  initialX: number
  initialY: number
  savedPw: string
  onSaved: (x: number, y: number) => void
  onClose: () => void
}) {
  const [focal, setFocal] = useState({ x: initialX, y: initialY })
  const [saving, setSaving] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updateFromPointer = useCallback((e: React.PointerEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100))
    setFocal({ x, y })
  }, [])

  async function save() {
    setSaving(true)
    await fetch('/api/admin/photos', {
      method: 'PATCH',
      headers: { 'x-admin-password': savedPw, 'content-type': 'application/json' },
      body: JSON.stringify({ playerName, focalX: focal.x, focalY: focal.y }),
    })
    onSaved(focal.x, focal.y)
    setSaving(false)
  }

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#060e1b] border border-[var(--border)] rounded-2xl w-full max-w-2xl flex flex-col gap-5 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="font-display font-700 text-[var(--accent)] text-[10px] uppercase tracking-widest mb-0.5">
            Bannerpositionering
          </p>
          <h2 className="font-display font-800 text-xl uppercase text-white leading-none">
            {playerName}
          </h2>
          <p className="font-display font-700 text-[11px] text-[var(--muted)] mt-1">
            Klik of sleep op de foto om het focuspunt in te stellen. De preview toont wat er getoond
            wordt.
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-xl cursor-crosshair select-none"
          style={{ maxHeight: 320 }}
          onPointerDown={(e) => {
            dragging.current = true
            e.currentTarget.setPointerCapture(e.pointerId)
            updateFromPointer(e)
          }}
          onPointerMove={(e) => {
            if (dragging.current) updateFromPointer(e)
          }}
          onPointerUp={() => {
            dragging.current = false
          }}
        >
          <img
            src={url}
            alt="Banner preview"
            draggable={false}
            className="w-full h-auto block pointer-events-none"
          />
          <div
            className="absolute pointer-events-none"
            style={{ left: `${focal.x}%`, top: `${focal.y}%`, transform: 'translate(-50%, -50%)' }}
          >
            <div
              className="w-9 h-9 rounded-full border-2 border-white shadow-lg"
              style={{ background: 'rgba(255,255,255,0.15)' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white shadow" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="absolute w-px h-5 bg-white/80"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              />
              <div
                className="absolute h-px w-5 bg-white/80"
                style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
              />
            </div>
          </div>
        </div>

        <div>
          <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mb-2">
            Preview (bannerformaat)
          </p>
          <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '3/1' }}>
            <img
              src={url}
              alt="Crop preview"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{ objectPosition: `${focal.x}% ${focal.y}%` }}
            />
            <div className="absolute inset-0 flex items-end justify-end p-2 pointer-events-none">
              <span className="font-display font-700 text-[9px] text-white/50 uppercase tracking-widest bg-black/40 px-2 py-1 rounded">
                Preview
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="flex-1 bg-[var(--accent)] py-2.5 rounded-xl font-display font-800 text-sm uppercase tracking-wider text-white hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? 'Opslaan…' : 'Opslaan'}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-display font-800 text-sm uppercase tracking-wider text-[var(--muted)] border border-[var(--border)] hover:text-white transition-colors"
          >
            Annuleren
          </button>
        </div>
      </div>
    </div>
  )
}
