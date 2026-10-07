'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { ROSTERS } from '@/shared/rosters/rosters-data'
import { ArchiveModal } from '../components/ArchiveModal'
import { DoneBanner } from '../components/DoneBanner'
import { GameCell } from '../components/GameCell'
import { GridHeader } from '../components/GridHeader'
import { HeaderCell } from '../components/HeaderCell'
import { InputModal } from '../components/InputModal'
import { RulesCard } from '../components/RulesCard'
import { CURRENT_FRIDAY_NUM } from '../domain/constants'
import { isValidAnswer } from '../domain/criteria'
import { getFridayDate, getGridForFridayNum, type GridConfig } from '../domain/grid-data'
import { loadWeek, migrateOldSave, saveWeekState } from '../domain/grid-storage'
import type { CellData } from '../domain/types'

export default function ImmaculateGridScreen() {
  const [selectedWeek, setSelectedWeek] = useState(CURRENT_FRIDAY_NUM)
  const [cells, setCells] = useState<CellData[]>(() => {
    migrateOldSave()
    return loadWeek(CURRENT_FRIDAY_NUM).cells
  })
  const [guessesLeft, setGuessesLeft] = useState(() => loadWeek(CURRENT_FRIDAY_NUM).guessesLeft)
  const [activeCell, setActiveCell] = useState<number | null>(null)
  const [flashes, setFlashes] = useState<Record<number, { ok: boolean }>>({})
  const [showArchive, setShowArchive] = useState(false)

  // Prevent the save effect from firing right after a week switch
  const skipNextSaveRef = useRef(false)

  const grid: GridConfig = getGridForFridayNum(selectedWeek)

  // When selectedWeek changes, load that week's state
  function handleWeekChange(week: number) {
    skipNextSaveRef.current = true
    setSelectedWeek(week)
    const saved = loadWeek(week)
    setCells(saved.cells)
    setGuessesLeft(saved.guessesLeft)
    setActiveCell(null)
    setFlashes({})
  }

  // Save whenever cells or guessesLeft change (but skip right after a week switch)
  useEffect(() => {
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false
      return
    }
    saveWeekState(selectedWeek, cells, guessesLeft)
  }, [cells, guessesLeft]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleGuess = useCallback(
    (cellIdx: number, playerName: string) => {
      const row = Math.floor(cellIdx / 3)
      const col = cellIdx % 3

      let teamId = ''
      for (const [tid, roster] of Object.entries(ROSTERS)) {
        if (roster.players.some((p) => p.name.toLowerCase() === playerName.toLowerCase())) {
          teamId = tid
          break
        }
      }

      const valid = isValidAnswer(playerName, teamId, grid.rows[row], grid.cols[col])

      setFlashes((f) => ({ ...f, [cellIdx]: { ok: valid } }))
      setTimeout(
        () =>
          setFlashes((f) => {
            const n = { ...f }
            delete n[cellIdx]
            return n
          }),
        700,
      )

      setCells((prev) => {
        const next = [...prev]
        next[cellIdx] = {
          state: valid ? 'correct' : 'wrong',
          guess: playerName,
          teamId: valid ? teamId : undefined,
        }
        return next
      })
      setGuessesLeft((g) => g - 1)
      setActiveCell(null)

      if (valid) {
        fetch(`/api/player-stats?name=${encodeURIComponent(playerName)}`)
          .then((r) => r.json())
          .then((data) => {
            const photoUrl = (data.photos?.banner_url ?? null) as string | null
            const focalX = (data.photos?.banner_focal_x ?? 50) as number
            const focalY = (data.photos?.banner_focal_y ?? 50) as number
            setCells((prev) => {
              const next = [...prev]
              if (next[cellIdx]?.state === 'correct') {
                next[cellIdx] = { ...next[cellIdx], photoUrl, focalX, focalY }
              }
              return next
            })
          })
          .catch(() => {})
      }
    },
    [grid],
  )

  const score = cells.filter((c) => c.state === 'correct').length
  const done = guessesLeft === 0 || score === 9
  const isArchive = selectedWeek < CURRENT_FRIDAY_NUM
  const gridDate = getFridayDate(selectedWeek)

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <GridHeader
        gridDate={gridDate}
        isArchive={isArchive}
        selectedWeek={selectedWeek}
        score={score}
        guessesLeft={guessesLeft}
        onOpenArchive={() => setShowArchive(true)}
        onWeekChange={handleWeekChange}
      />

      {done && <DoneBanner score={score} isArchive={isArchive} />}

      {/* The 4×4 grid */}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: 'auto auto auto auto' }}
      >
        <div
          className="bg-[var(--card)] border border-[var(--border)] rounded-xl flex items-center justify-center"
          style={{ minHeight: 110 }}
        >
          <Image
            src="https://res.cloudinary.com/dn8c5398m/image/upload/q_auto/f_auto/v1781607525/hk_logo_iets_groter_tumykq.png"
            alt="HK"
            width={56}
            height={56}
            className="object-contain opacity-60"
          />
        </div>
        {grid.cols.map((crit, i) => (
          <div
            key={i}
            className="bg-[var(--card)] border border-[var(--border)] rounded-xl"
            style={{ minHeight: 110 }}
          >
            <HeaderCell crit={crit} axis="col" />
          </div>
        ))}

        {grid.rows.map((rowCrit, row) => (
          <>
            <div
              key={`h${row}`}
              className="bg-[var(--card)] border border-[var(--border)] rounded-xl"
              style={{ minHeight: 110 }}
            >
              <HeaderCell crit={rowCrit} axis="row" />
            </div>
            {grid.cols.map((_, col) => {
              const idx = row * 3 + col
              return (
                <GameCell
                  key={idx}
                  cell={cells[idx]}
                  canClick={cells[idx].state !== 'correct' && guessesLeft > 0 && !done}
                  flash={flashes[idx] ?? null}
                  onClick={() => setActiveCell(idx)}
                />
              )
            })}
          </>
        ))}
      </div>

      {/* Rules */}
      <RulesCard />

      {activeCell !== null && (
        <InputModal
          rowCrit={grid.rows[Math.floor(activeCell / 3)]}
          colCrit={grid.cols[activeCell % 3]}
          onSubmit={(name) => handleGuess(activeCell, name)}
          onClose={() => setActiveCell(null)}
        />
      )}

      {showArchive && (
        <ArchiveModal
          currentWeek={CURRENT_FRIDAY_NUM}
          selectedWeek={selectedWeek}
          onSelect={handleWeekChange}
          onClose={() => setShowArchive(false)}
        />
      )}
    </div>
  )
}
