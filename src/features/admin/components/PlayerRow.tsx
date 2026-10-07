'use client'

import { useState } from 'react'
import { TEAM_NAMES } from '@/shared/teams/teams'
import type { PlayerPhoto } from '@/features/admin/domain/photos'
import FocalPointEditor from '@/features/admin/components/FocalPointEditor'
import UploadButton from '@/features/admin/components/UploadButton'

export default function PlayerRow({
  name,
  teamId,
  photo,
  uploading,
  success,
  savedPw,
  onUpload,
  onRemove,
  onPhotoUpdate,
}: {
  name: string
  teamId: string
  photo: PlayerPhoto | null
  uploading: string | null
  success: string | null
  savedPw: string
  onUpload: (type: 'banner' | 'headshot', file: File) => void
  onRemove: (type: 'banner' | 'headshot') => void
  onPhotoUpdate: (focalX: number, focalY: number) => void
}) {
  const [editingFocal, setEditingFocal] = useState(false)
  const isSuccess = success === name

  const focalX = photo?.banner_focal_x ?? 50
  const focalY = photo?.banner_focal_y ?? 50

  return (
    <>
      <div
        className={`bg-[var(--card)] border rounded-xl px-4 py-3 flex items-center gap-4 flex-wrap transition-colors ${isSuccess ? 'border-green-500/50' : 'border-[var(--border)]'}`}
      >
        {/* Name */}
        <div className="flex-1 min-w-[160px]">
          <p className="font-display font-800 text-sm uppercase text-white leading-none">{name}</p>
          <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mt-0.5">
            {TEAM_NAMES[teamId] ?? teamId}
          </p>
        </div>

        {/* Banner */}
        <div className="flex items-center gap-2">
          {/* Thumbnail — clickable to edit focal if banner exists */}
          {photo?.banner_url ? (
            <button
              onClick={() => setEditingFocal(true)}
              className="relative group overflow-hidden rounded border border-[var(--border)] hover:border-[var(--accent)]/60 transition-colors shrink-0"
              style={{ width: 96, height: 32 }}
              title="Klik om positie aan te passen"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.banner_url}
                alt="Banner"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{ objectPosition: `${focalX}% ${focalY}%` }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                <span className="font-display font-700 text-[9px] text-white uppercase opacity-0 group-hover:opacity-100 transition-opacity tracking-widest">
                  Positie
                </span>
              </div>
            </button>
          ) : (
            <div
              className="bg-[#0f1e2e] border border-[var(--border)] flex items-center justify-center text-[10px] text-[var(--muted)] uppercase rounded shrink-0"
              style={{ width: 96, height: 32 }}
            >
              —
            </div>
          )}

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <UploadButton
                label="Banner"
                uploading={uploading === `${name}-banner`}
                onFile={(f) => onUpload('banner', f)}
              />
              {photo?.banner_size_kb != null && (
                <span
                  className={`font-display font-700 text-[10px] uppercase tracking-widest ${photo.banner_size_kb > 400 ? 'text-yellow-500' : 'text-green-400'}`}
                >
                  {photo.banner_size_kb} KB
                </span>
              )}
            </div>
            {photo?.banner_url && (
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingFocal(true)}
                  className="text-[10px] font-display font-700 text-[var(--accent)] hover:text-white uppercase tracking-widest transition-colors"
                >
                  Positie
                </button>
                <span className="text-[var(--border)]">·</span>
                <button
                  onClick={() => onRemove('banner')}
                  className="text-[10px] font-display font-700 text-[var(--muted)] hover:text-red-400 uppercase tracking-widest transition-colors"
                >
                  Verwijder
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Headshot */}
        <div className="flex items-center gap-2">
          {photo?.headshot_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo.headshot_url}
              alt="Headshot"
              className="w-10 h-10 object-cover rounded-full border border-[var(--border)] shrink-0"
            />
          ) : (
            <div className="bg-[#0f1e2e] border border-[var(--border)] flex items-center justify-center text-[10px] text-[var(--muted)] uppercase w-10 h-10 rounded-full shrink-0">
              —
            </div>
          )}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <UploadButton
                label="Headshot"
                uploading={uploading === `${name}-headshot`}
                onFile={(f) => onUpload('headshot', f)}
              />
              {photo?.headshot_size_kb != null && (
                <span
                  className={`font-display font-700 text-[10px] uppercase tracking-widest ${photo.headshot_size_kb > 400 ? 'text-yellow-500' : 'text-green-400'}`}
                >
                  {photo.headshot_size_kb} KB
                </span>
              )}
            </div>
            {photo?.headshot_url && (
              <button
                onClick={() => onRemove('headshot')}
                className="text-[10px] font-display font-700 text-[var(--muted)] hover:text-red-400 uppercase tracking-widest text-left transition-colors"
              >
                Verwijder
              </button>
            )}
          </div>
        </div>

        {isSuccess && (
          <span className="font-display font-700 text-xs text-green-400 uppercase tracking-widest shrink-0">
            Opgeslagen
          </span>
        )}
      </div>

      {/* Focal point editor modal */}
      {editingFocal && photo?.banner_url && (
        <FocalPointEditor
          playerName={name}
          url={photo.banner_url}
          initialX={focalX}
          initialY={focalY}
          savedPw={savedPw}
          onSaved={(x, y) => {
            onPhotoUpdate(x, y)
            setEditingFocal(false)
          }}
          onClose={() => setEditingFocal(false)}
        />
      )}
    </>
  )
}
