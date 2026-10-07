'use client'

import { useRef } from 'react'

export default function UploadButton({
  label,
  uploading,
  onFile,
}: {
  label: string
  uploading: boolean
  onFile: (f: File) => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  return (
    <label
      className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-display font-700 text-xs uppercase transition-colors ${uploading ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-white'}`}
    >
      {uploading ? (
        <span className="w-3 h-3 border border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
      ) : (
        <svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
      )}
      {label}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onFile(e.target.files[0])
            e.target.value = ''
          }
        }}
      />
    </label>
  )
}
