'use client'

import { useState, useEffect } from 'react'
import { TEAM_NAMES } from '@/shared/teams/teams'
import AdminGate from '@/features/admin/components/AdminGate'
import PhotosHeader from '@/features/admin/components/PhotosHeader'
import PlayerRow from '@/features/admin/components/PlayerRow'
import { STATIC_PLAYERS, type PlayerPhoto } from '@/features/admin/domain/photos'

export default function PhotosScreen() {
  const [savedPw, setSavedPw] = useState('')
  const [photos, setPhotos] = useState<PlayerPhoto[]>([])
  const [uploading, setUploading] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [compressing, setCompressing] = useState<{ done: number; total: number } | null>(null)
  const [allPlayers, setAllPlayers] = useState(STATIC_PLAYERS)

  useEffect(() => {
    fetch('/api/all-players')
      .then((r) => r.json())
      .then((data: { name: string; teamId: string }[]) => {
        setAllPlayers(
          data
            .map((p) => ({ name: p.name, teamId: p.teamId }))
            .sort((a, b) => a.name.localeCompare(b.name)),
        )
      })
      .catch(() => {})
  }, [])

  async function loadPhotos(password: string) {
    const res = await fetch('/api/admin/photos', { headers: { 'x-admin-password': password } })
    if (!res.ok) return
    const list: PlayerPhoto[] = await res.json()
    setPhotos(list)

    // For photos without a stored size, fetch it via HEAD request (no recompression)
    const needsSize = list.filter(
      (p) =>
        (p.banner_url && p.banner_size_kb == null) ||
        (p.headshot_url && p.headshot_size_kb == null),
    )
    if (needsSize.length === 0) return

    const fetchSize = async (url: string): Promise<number | null> => {
      try {
        const r = await fetch(url, { method: 'HEAD' })
        const cl = r.headers.get('content-length')
        return cl ? Math.round(parseInt(cl) / 1024) : null
      } catch {
        return null
      }
    }

    // Fetch in parallel, update state as results come in
    await Promise.all(
      needsSize.map(async (p) => {
        const bannerKb =
          p.banner_url && p.banner_size_kb == null ? await fetchSize(p.banner_url) : undefined
        const headshotKb =
          p.headshot_url && p.headshot_size_kb == null ? await fetchSize(p.headshot_url) : undefined

        if (bannerKb != null || headshotKb != null) {
          setPhotos((prev) =>
            prev.map((x) =>
              x.player_name === p.player_name
                ? {
                    ...x,
                    ...(bannerKb != null ? { banner_size_kb: bannerKb } : {}),
                    ...(headshotKb != null ? { headshot_size_kb: headshotKb } : {}),
                  }
                : x,
            ),
          )
        }
      }),
    )
  }

  async function upload(
    playerName: string,
    teamId: string,
    photoType: 'banner' | 'headshot',
    file: File,
  ) {
    const key = `${playerName}-${photoType}`
    setUploading(key)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('playerName', playerName)
    fd.append('teamId', teamId)
    fd.append('photoType', photoType)

    const res = await fetch('/api/admin/upload-photo', {
      method: 'POST',
      headers: { 'x-admin-password': savedPw },
      body: fd,
    })

    if (res.ok) {
      setSuccess(playerName)
      setTimeout(() => setSuccess(null), 2000)
      await loadPhotos(savedPw)
    } else {
      const e = await res.json()
      alert(`Upload mislukt: ${e.error}`)
    }
    setUploading(null)
  }

  async function remove(playerName: string, photoType: 'banner' | 'headshot') {
    if (!confirm(`Verwijder ${photoType} van ${playerName}?`)) return
    await fetch('/api/admin/photos', {
      method: 'DELETE',
      headers: { 'x-admin-password': savedPw, 'content-type': 'application/json' },
      body: JSON.stringify({ playerName, photoType }),
    })
    await loadPhotos(savedPw)
  }

  async function compressAll() {
    const targets: { playerName: string; photoType: 'banner' | 'headshot' }[] = []
    for (const p of photos) {
      if (p.banner_url) targets.push({ playerName: p.player_name, photoType: 'banner' })
      if (p.headshot_url) targets.push({ playerName: p.player_name, photoType: 'headshot' })
    }
    if (targets.length === 0) return
    setCompressing({ done: 0, total: targets.length })

    for (let i = 0; i < targets.length; i++) {
      const { playerName, photoType } = targets[i]
      await fetch('/api/admin/compress-photo', {
        method: 'POST',
        headers: { 'x-admin-password': savedPw, 'content-type': 'application/json' },
        body: JSON.stringify({ playerName, photoType }),
      })
      setCompressing({ done: i + 1, total: targets.length })
    }

    setCompressing(null)
    await loadPhotos(savedPw)
  }

  function updateFocal(playerName: string, focalX: number, focalY: number) {
    setPhotos((prev) =>
      prev.map((p) =>
        p.player_name.toLowerCase() === playerName.toLowerCase()
          ? { ...p, banner_focal_x: focalX, banner_focal_y: focalY }
          : p,
      ),
    )
  }

  const filtered = filter
    ? allPlayers.filter(
        (p) =>
          p.name.toLowerCase().includes(filter.toLowerCase()) ||
          TEAM_NAMES[p.teamId]?.toLowerCase().includes(filter.toLowerCase()),
      )
    : allPlayers

  const withPhotos = filtered.filter((p) => {
    const ph = photos.find((x) => x.player_name.toLowerCase() === p.name.toLowerCase())
    return ph?.banner_url || ph?.headshot_url
  })
  const without = filtered.filter((p) => {
    const ph = photos.find((x) => x.player_name.toLowerCase() === p.name.toLowerCase())
    return !ph?.banner_url && !ph?.headshot_url
  })

  return (
    <AdminGate
      checkAuth={async (pw) => {
        const res = await fetch('/api/admin/photos', { headers: { 'x-admin-password': pw } })
        return res.ok
      }}
      onAuth={(pw) => {
        setSavedPw(pw)
        loadPhotos(pw)
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <PhotosHeader
          photos={photos}
          allPlayers={allPlayers}
          filter={filter}
          setFilter={setFilter}
          compressing={compressing}
          compressAll={compressAll}
        />

        {withPhotos.length > 0 && (
          <section>
            <p className="font-display font-700 text-xs uppercase tracking-widest text-[var(--accent)] mb-3">
              Met foto&apos;s
            </p>
            <div className="space-y-2">
              {withPhotos.map(({ name, teamId }) => {
                const photo = photos.find((p) => p.player_name.toLowerCase() === name.toLowerCase())
                return (
                  <PlayerRow
                    key={name}
                    name={name}
                    teamId={teamId}
                    photo={photo ?? null}
                    uploading={uploading}
                    success={success}
                    savedPw={savedPw}
                    onUpload={(type, file) => upload(name, teamId, type, file)}
                    onRemove={(type) => remove(name, type)}
                    onPhotoUpdate={(x, y) => updateFocal(name, x, y)}
                  />
                )
              })}
            </div>
          </section>
        )}

        {without.length > 0 && (
          <section>
            <p className="font-display font-700 text-xs uppercase tracking-widest text-[var(--muted)] mb-3">
              Zonder foto&apos;s
            </p>
            <div className="space-y-2">
              {without.map(({ name, teamId }) => (
                <PlayerRow
                  key={name}
                  name={name}
                  teamId={teamId}
                  photo={null}
                  uploading={uploading}
                  success={success}
                  savedPw={savedPw}
                  onUpload={(type, file) => upload(name, teamId, type, file)}
                  onRemove={(type) => remove(name, type)}
                  onPhotoUpdate={(x, y) => updateFocal(name, x, y)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </AdminGate>
  )
}
