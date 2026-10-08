'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ArchiveModal } from '../components/ArchiveModal'
import { EmptyRows } from '../components/EmptyRows'
import { GuessRow } from '../components/GuessRow'
import { Legend } from '../components/Legend'
import { PickleHeader } from '../components/PickleHeader'
import { PlayerSearch } from '../components/PlayerSearch'
import { ResultBanner } from '../components/ResultBanner'
import { ALL_PLAYERS, MAX_GUESSES } from '../domain/constants'
import { getCurrentDayNum, getDayDate, getPlayerForDayNum } from '../domain/pickle-days'
import { buildShareText, evaluate } from '../domain/pickle-rules'
import { loadDay, migrateOldSave, saveDayState } from '../domain/pickle-storage'
import type { GuessFeedback, PoolPlayer } from '../domain/types'

export default function PickleScreen() {
  const currentDayNum = getCurrentDayNum()
  const [activeDayNum, setActiveDayNum] = useState(currentDayNum)
  const [guesses, setGuesses] = useState<GuessFeedback[]>([])
  const [won, setWon] = useState(false)
  const [lost, setLost] = useState(false)
  const [query, setQuery] = useState('')
  const [suggestions, setSugg] = useState<PoolPlayer[]>([])
  const [selIdx, setSelIdx] = useState(-1)
  const [shared, setShared] = useState(false)
  const [showArchive, setShowArchive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const skipNextSaveRef = useRef(false)

  const target = getPlayerForDayNum(activeDayNum)

  useEffect(() => {
    migrateOldSave(currentDayNum)
    const s = loadDay(currentDayNum)
    setGuesses(s.guesses)
    setWon(s.won)
    setLost(s.lost)
  }, [currentDayNum])

  useEffect(() => {
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false
      return
    }
    if (guesses.length > 0 || won || lost) saveDayState(activeDayNum, { guesses, won, lost })
  }, [guesses, won, lost, activeDayNum])

  const handleDayChange = useCallback((n: number) => {
    skipNextSaveRef.current = true
    const s = loadDay(n)
    setActiveDayNum(n)
    setGuesses(s.guesses)
    setWon(s.won)
    setLost(s.lost)
    setQuery('')
    setSugg([])
    setSelIdx(-1)
  }, [])

  useEffect(() => {
    if (query.length < 2) {
      setSugg([])
      return
    }
    const q = query.toLowerCase()
    const already = new Set(guesses.map((g) => g.player.name))
    setSugg(
      ALL_PLAYERS.filter((p) => p.name.toLowerCase().includes(q) && !already.has(p.name)).slice(
        0,
        7,
      ),
    )
    setSelIdx(-1)
  }, [query, guesses])

  const submitGuess = useCallback(
    (player: PoolPlayer) => {
      if (won || lost) return
      const fb = evaluate(player, target)
      const next = [...guesses, fb]
      const didWin = player.name.toLowerCase() === target.name.toLowerCase()
      const didLose = !didWin && next.length >= MAX_GUESSES
      setGuesses(next)
      setWon(didWin)
      setLost(didLose)
      setQuery('')
      setSugg([])
    },
    [guesses, won, lost, target],
  )

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelIdx((s) => Math.min(s + 1, suggestions.length - 1))
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelIdx((s) => Math.max(s - 1, -1))
    }
    if (e.key === 'Enter') {
      const pick =
        selIdx >= 0
          ? suggestions[selIdx]
          : ALL_PLAYERS.find((p) => p.name.toLowerCase() === query.toLowerCase())
      if (pick) submitGuess(pick)
    }
  }

  const share = () => {
    const dateStr = getDayDate(activeDayNum).toLocaleDateString('nl-NL')
    navigator.clipboard.writeText(buildShareText(guesses, won, dateStr))
    setShared(true)
    setTimeout(() => setShared(false), 2000)
  }

  const remaining = MAX_GUESSES - guesses.length
  const isViewingArchive = activeDayNum < currentDayNum

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
      {showArchive && (
        <ArchiveModal
          currentDayNum={currentDayNum}
          activeDayNum={activeDayNum}
          onSelect={handleDayChange}
          onClose={() => setShowArchive(false)}
        />
      )}

      <PickleHeader
        activeDayNum={activeDayNum}
        currentDayNum={currentDayNum}
        isViewingArchive={isViewingArchive}
        remaining={remaining}
        onOpenArchive={() => setShowArchive(true)}
        onDayChange={handleDayChange}
      />

      {(won || lost) && (
        <ResultBanner
          won={won}
          guessCount={guesses.length}
          target={target}
          shared={shared}
          onShare={share}
        />
      )}

      {!won && !lost && (
        <PlayerSearch
          inputRef={inputRef}
          query={query}
          setQuery={setQuery}
          onKey={onKey}
          suggestions={suggestions}
          selIdx={selIdx}
          setSelIdx={setSelIdx}
          submitGuess={submitGuess}
        />
      )}

      <div className="grid grid-cols-5 gap-1 mb-1 px-0">
        {['Team', 'Pos', 'Bats', 'Throws', 'YOB'].map((h) => (
          <p
            key={h}
            className="font-display font-700 text-[10px] uppercase tracking-widest text-[var(--muted)] text-center"
          >
            {h}
          </p>
        ))}
      </div>

      <div className="space-y-2">
        {guesses.map((fb, i) => (
          <GuessRow key={i} fb={fb} target={target} />
        ))}
        <EmptyRows count={MAX_GUESSES - guesses.length} />
      </div>

      <Legend />
    </div>
  )
}
