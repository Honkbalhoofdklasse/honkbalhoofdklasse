'use client'

import { useEffect, useState, useCallback } from 'react'
import BoxscoreModal from '@/shared/ui/BoxscoreModal'
import { TEAM_NAMES } from '@/shared/teams/teams'
import type { PostseasonData, HSGame, HSSeries } from '@/features/postseason/api/holland-series'
import { fmtDateTime } from '@/features/postseason/domain/feedDate'
import { stateOf } from '@/features/postseason/domain/cardState'
import { Countdown } from '@/features/postseason/components/Countdown'
import { TeamBadge } from '@/features/postseason/components/TeamBadge'
import { BracketCard } from '@/features/postseason/components/BracketCard'
import { SemiColumn } from '@/features/postseason/components/SemiColumn'
import { SeriesDetailModal } from '@/features/postseason/components/SeriesDetailModal'

export default function PostseasonBracket({ initial }: { initial: PostseasonData }) {
  const [data, setData] = useState(initial)
  const [openSeries, setOpenSeries] = useState<HSSeries | null>(null)
  const [box, setBox] = useState<HSGame | null>(null)

  const refresh = useCallback(async () => {
    try {
      const r = await fetch('/api/holland-series', { cache: 'no-store' })
      if (r.ok) setData(await r.json())
    } catch {}
  }, [])
  useEffect(() => {
    const t = setInterval(refresh, 30_000)
    const onVis = () => {
      if (!document.hidden) refresh()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      clearInterval(t)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [refresh])

  const { semifinals, final, finalScheduled, seeds } = data
  const semiA = semifinals[0]
  const semiB = semifinals[1]
  const isLive = (s: HSSeries | null | undefined) => !!s?.games.some((g) => g.status === 'live')

  const finalLeft = final?.teamA ?? semiA?.clinchedBy ?? null
  const finalRight = final?.teamB ?? semiB?.clinchedBy ?? null
  const showFinalWins = !!final && (final.winsA > 0 || final.winsB > 0 || isLive(final))
  const nextGame =
    final && !final.clinchedBy
      ? final.nextGame && final.nextGame.status === 'scheduled'
        ? final.nextGame
        : null
      : null

  return (
    <div className="max-w-4xl mx-auto px-3 md:px-8 py-8">
      {box && (
        <BoxscoreModal
          gameId={box.id}
          awayId={box.awayId}
          homeId={box.homeId}
          awayScore={box.awayScore}
          homeScore={box.homeScore}
          gameDate={fmtDateTime(box.startISO)}
          onClose={() => setBox(null)}
        />
      )}

      {openSeries && (
        <SeriesDetailModal
          openSeries={openSeries}
          seeds={seeds}
          onClose={() => setOpenSeries(null)}
          onOpenBox={setBox}
        />
      )}

      <div className="mb-6">
        <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-sm mb-1">
          Season 2026
        </p>
        <h1 className="font-display font-800 italic text-4xl sm:text-5xl uppercase tracking-tight text-white">
          <strong>Postseason</strong>
          <span className="text-[var(--accent)]"> Bracket</span>
        </h1>
      </div>

      {final?.clinchedBy && (
        <div className="rounded-2xl border border-[var(--accent)] bg-[var(--accent)]/10 p-4 mb-6 flex items-center justify-center gap-3">
          <TeamBadge teamId={final.clinchedBy} size={40} />
          <p className="font-display font-800 italic text-xl sm:text-2xl uppercase text-white">
            🏆 {TEAM_NAMES[final.clinchedBy]} Champions
          </p>
        </div>
      )}

      <div className="relative pt-11">
        <p className="absolute top-0 left-1/2 -translate-x-1/2 font-display font-800 italic text-sm sm:text-lg uppercase text-white text-center leading-none z-10">
          Holland
          <br />
          Series
        </p>
        <div className="flex items-center justify-center gap-0.5 sm:gap-1">
          <SemiColumn s={semiA} side="left" seeds={seeds} setOpenSeries={setOpenSeries} />
          <div className="flex items-center gap-0.5 shrink-0">
            <div className="w-11 sm:w-20 h-14 sm:h-24">
              <BracketCard
                teamId={finalLeft}
                seed={finalLeft ? seeds[finalLeft] : undefined}
                wins={final?.winsA}
                showWins={showFinalWins}
                state={stateOf(final, finalLeft)}
                onClick={final ? () => setOpenSeries(final) : undefined}
              />
            </div>
            <div className="w-11 sm:w-20 h-14 sm:h-24">
              <BracketCard
                teamId={finalRight}
                seed={finalRight ? seeds[finalRight] : undefined}
                wins={final?.winsB}
                showWins={showFinalWins}
                state={stateOf(final, finalRight)}
                onClick={final ? () => setOpenSeries(final) : undefined}
              />
            </div>
          </div>
          <SemiColumn s={semiB} side="right" seeds={seeds} setOpenSeries={setOpenSeries} />
        </div>
      </div>

      {final && !final.clinchedBy && (
        <div className="flex flex-col items-center gap-2 mt-6">
          {isLive(final) ? (
            <span className="inline-flex items-center gap-2 font-display font-800 text-xs uppercase tracking-widest text-[var(--accent)]">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
              Game in progress
            </span>
          ) : nextGame ? (
            <>
              <p className="font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest text-center">
                {finalScheduled ? 'Game 1' : 'Next game'} · {fmtDateTime(nextGame.startISO)}
                {nextGame.location ? ` · ${nextGame.location}` : ''}
              </p>
              <Countdown targetISO={nextGame.startISO!} />
            </>
          ) : null}
        </div>
      )}

      <p className="text-center font-display font-700 text-[10px] text-[var(--muted)] uppercase tracking-widest mt-8">
        Tap a team for game-by-game scores, boxscores &amp; win probability
      </p>
    </div>
  )
}
