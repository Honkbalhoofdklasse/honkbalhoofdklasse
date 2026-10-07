'use client'

import { useEffect, useRef, useState } from 'react'
import { getAwardsByPlayer } from '@/shared/data/awards-data'
import { headshotFaceUrl } from '@/shared/media/cloudinary'
import { TEAM_COLORS } from '@/shared/teams/teams'
import PlayerSplits from '@/shared/ui/PlayerSplits'
import { AwardsSection } from './AwardsSection'
import { BattingSection } from './BattingSection'
import { findRosterPlayer } from './findRosterPlayer'
import { n } from './format'
import { LoadingSkeleton } from './LoadingSkeleton'
import { PitchingSection } from './PitchingSection'
import { PlayerHero } from './PlayerHero'
import { buildBatRow, buildPitRow } from './statRows'
import type { Career, Photos, SeasonStats } from './types'
import { useModalFocusTrap } from './useModalFocusTrap'

// ── Main modal ─────────────────────────────────────────────────────────────
export default function PlayerStatsModal({
  playerName,
  teamId,
  statType,
  onClose,
}: {
  playerName: string
  teamId: string
  statType: 'batting' | 'pitching'
  onClose: () => void
}) {
  const [st, setSt] = useState<SeasonStats | null>(null)
  const [photos, setPhotos] = useState<Photos>(null)
  const [career, setCareer] = useState<Career | null>(null)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'batting' | 'pitching'>(statType)
  const modalRef = useRef<HTMLDivElement>(null)

  const rosterPlayer = findRosterPlayer(playerName)
  const bbrefId = rosterPlayer?.bbref_id
  const awards = getAwardsByPlayer(playerName)
  const teamColor = TEAM_COLORS[teamId] ?? '#1e335a'
  const accentColor = teamColor === '#121b31' ? '#f59e0b' : teamColor

  useEffect(() => {
    setLoading(true)
    setSt(null)
    setPhotos(null)
    setCareer(null)
    const jobs: Promise<void>[] = [
      fetch(`/api/player-stats?name=${encodeURIComponent(playerName)}&type=${statType}`)
        .then((r) => r.json())
        .then((d) => {
          setSt(d.seasonStats)
          setPhotos(d.photos)
        }),
    ]
    if (bbrefId) {
      jobs.push(
        fetch(`/api/career-stats?id=${encodeURIComponent(bbrefId)}`)
          .then((r) => r.json())
          .then((d) => {
            if (Array.isArray(d?.batting)) setCareer(d)
          })
          .catch(() => {}),
      )
    }
    Promise.all(jobs).finally(() => setLoading(false))
  }, [playerName, statType, bbrefId])

  useModalFocusTrap(modalRef, onClose)

  const hasBatting = true
  const hasPitching = n(st?.pitch_appear) > 0
  const age = rosterPlayer?.yob ?? null

  const bannerUrl = photos?.banner_url ?? null
  const headshotUrl = headshotFaceUrl(photos?.headshot_url ?? null)
  const bannerPosition = `${photos?.banner_focal_x ?? 50}% ${photos?.banner_focal_y ?? 50}%`

  const batRow = buildBatRow(st)
  const pitRow = buildPitRow(st)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={playerName}
        className="relative w-full max-w-3xl bg-[#060e1b] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        style={{ maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <PlayerHero
          playerName={playerName}
          teamId={teamId}
          teamColor={teamColor}
          accentColor={accentColor}
          rosterPlayer={rosterPlayer}
          bannerUrl={bannerUrl}
          headshotUrl={headshotUrl}
          bannerPosition={bannerPosition}
          age={age}
          onClose={onClose}
        />

        {/* Accent line */}
        <div style={{ height: 3, background: accentColor, flexShrink: 0 }} />

        {/* ── BODY ──────────────────────────────────────────────────────── */}
        <div className="overflow-y-auto flex-1">
          {/* Tab strip */}
          {!loading && st && hasBatting && hasPitching && (
            <div className="flex border-b border-[var(--border)] px-1">
              {(['batting', 'pitching'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-3 font-display font-800 text-xs uppercase tracking-widest transition-colors border-b-2 -mb-px ${
                    tab === t
                      ? 'text-white'
                      : 'text-[var(--muted)] hover:text-white border-transparent'
                  }`}
                  style={tab === t ? { borderColor: accentColor } : {}}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <LoadingSkeleton />
          ) : (
            <>
              {/* ── BATTING ── */}
              {(tab === 'batting' || !hasPitching) && (
                <BattingSection
                  accentColor={accentColor}
                  batRow={batRow}
                  career={career}
                  bbrefId={bbrefId}
                />
              )}

              {/* ── PITCHING ── */}
              {(tab === 'pitching' || (!hasBatting && hasPitching)) && hasPitching && (
                <PitchingSection accentColor={accentColor} pitRow={pitRow} career={career} />
              )}

              {/* ── SPLITS ── */}
              <div className="px-5 pb-5 border-t border-[var(--border)] pt-4">
                <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mb-3">
                  Splits
                </p>
                <PlayerSplits playerName={playerName} teamId={teamId} statType={statType} />
              </div>

              {/* ── AWARDS ── */}
              {awards.length > 0 && <AwardsSection awards={awards} accentColor={accentColor} />}
            </>
          )}
        </div>

        {/* ── FOOTER ──────────────────────────────────────────────────────── */}
        <div className="shrink-0 border-t border-[var(--border)] px-5 py-2.5 flex items-center justify-between">
          <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest">
            KNBSB Hoofdklasse · Season 2026
          </p>
          {rosterPlayer?.instagram && (
            <a
              href={`https://instagram.com/${rosterPlayer.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display font-700 text-[10px] text-[var(--muted)] hover:text-white transition-colors uppercase tracking-widest"
            >
              @{rosterPlayer.instagram}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
