'use client'

import { useState, useEffect, useCallback } from 'react'
import { GameOverScreen } from '../components/GameOverScreen'
import { PanelBg } from '../components/PanelBg'
import { RevealedPanel } from '../components/RevealedPanel'
import { TeamBadge } from '../components/TeamBadge'
import { STATS, buildSequence, buildStatSequence, randomSeed } from '../domain/stats'
import type { HLPlayer, Phase, StatKey } from '../domain/types'

export default function HigherLowerScreen() {
  const [players, setPlayers] = useState<HLPlayer[]>([])
  const [sequence, setSequence] = useState<HLPlayer[]>([])
  const [statSequence, setStatSequence] = useState<StatKey[]>([])
  const [statStep, setStatStep] = useState(0)
  const [leftIdx, setLeftIdx] = useState(0)
  const [rightIdx, setRightIdx] = useState(1)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [phase, setPhase] = useState<Phase>('loading')
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null)

  const statKey = statSequence[statStep] ?? 'avg'
  const stat = STATS.find((s) => s.key === statKey)!

  useEffect(() => {
    fetch('/api/higher-lower')
      .then((r) => r.json())
      .then((data: HLPlayer[]) => {
        setPlayers(data)
        const seed = randomSeed()
        const seq = buildSequence(data, seed)
        const statSeq = buildStatSequence(seed + 42, 200)
        setSequence(seq)
        setStatSequence(statSeq)
        setStatStep(0)
        setPhase('playing')
      })
      .catch(() => setPhase('gameover'))

    setHighScore(Number(localStorage.getItem('hl-highscore') ?? 0))
  }, [])

  const left = sequence[leftIdx]
  const right = sequence[rightIdx]

  const guess = useCallback(
    (guessHigher: boolean) => {
      if (phase !== 'playing' || !left || !right) return

      const lv = left[statKey] as number
      const rv = right[statKey] as number
      const correct = guessHigher ? rv >= lv : rv <= lv

      setLastResult(correct ? 'correct' : 'wrong')
      setPhase('reveal')

      setTimeout(() => {
        if (correct) {
          const newScore = score + 1
          setScore(newScore)
          if (newScore > highScore) {
            setHighScore(newScore)
            localStorage.setItem('hl-highscore', String(newScore))
          }

          const newStatStep = newScore % 2 === 0 ? statStep + 1 : statStep
          if (newScore % 2 === 0) setStatStep(newStatStep)
          const upcomingStat = statSequence[newStatStep] ?? 'avg'

          const newLeftIdx = rightIdx
          let newRightIdx = rightIdx + 1
          for (let skip = 0; skip < 4; skip++) {
            const candidate = sequence[newRightIdx]
            if (!candidate || (candidate[upcomingStat] as number) > 0) break
            newRightIdx++
          }

          if (newRightIdx >= sequence.length) {
            setPhase('gameover')
          } else {
            setLeftIdx(newLeftIdx)
            setRightIdx(newRightIdx)
            setLastResult(null)
            setPhase('playing')
          }
        } else {
          setPhase('gameover')
        }
      }, 1500)
    },
    [
      phase,
      left,
      right,
      statKey,
      statSequence,
      score,
      highScore,
      leftIdx,
      rightIdx,
      statStep,
      sequence,
    ],
  )

  function restart() {
    const seed = randomSeed()
    const seq = buildSequence(players, seed)
    const statSeq = buildStatSequence(seed + 42, 200)
    setSequence(seq)
    setStatSequence(statSeq)
    setStatStep(0)
    setLeftIdx(0)
    setRightIdx(1)
    setScore(0)
    setLastResult(null)
    setPhase('playing')
  }

  function shareResult() {
    const text = `Honkbal Hoofdklasse Higher/Lower\nScore: ${score} 🎯\nhonkbalhoofdklasse.com/higher-lower`
    if (navigator.share) navigator.share({ text }).catch(() => {})
    else navigator.clipboard.writeText(text).catch(() => {})
  }

  if (phase === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="font-display font-700 text-sm uppercase text-[var(--muted)] tracking-wider animate-pulse">
          Loading…
        </p>
      </div>
    )
  }

  if (phase === 'gameover') {
    return (
      <GameOverScreen
        score={score}
        highScore={highScore}
        left={left}
        right={right}
        stat={stat}
        statKey={statKey}
        onRestart={restart}
        onShare={shareResult}
      />
    )
  }

  const leftVal = left ? (left[statKey] as number) : 0
  const rightVal = right ? (right[statKey] as number) : 0

  return (
    <div className="relative flex flex-col md:flex-row pt-20" style={{ minHeight: '100dvh' }}>
      {left && <RevealedPanel left={left} leftVal={leftVal} score={score} stat={stat} />}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
        <div className="w-14 h-14 rounded-full bg-[#06101e] border-2 border-white/20 flex items-center justify-center shadow-xl">
          <span className="font-display font-800 text-xs uppercase tracking-widest text-white/60">
            vs
          </span>
        </div>
      </div>

      {right && (
        <div className="relative flex-1 flex flex-col items-center justify-center overflow-hidden px-8 py-12 md:py-0 min-h-[45dvh] md:min-h-0">
          <PanelBg player={right} flash={phase === 'reveal' ? lastResult : null} />

          <div className="absolute top-4 right-5 z-10 text-right">
            <p className="font-display font-700 text-[9px] uppercase tracking-widest text-white/40">
              Best
            </p>
            <p className="font-display font-800 text-xl text-[var(--accent)] leading-none">
              {highScore}
            </p>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center gap-4 max-w-xs w-full">
            <TeamBadge player={right} />
            <p className="font-display font-800 text-3xl md:text-4xl text-white leading-tight drop-shadow-md">
              &ldquo;{right.name}&rdquo;
            </p>
            <p className="font-display font-700 text-sm text-white/70 uppercase tracking-wider">
              has
            </p>

            {phase === 'reveal' ? (
              <p
                className={`font-display font-800 text-8xl md:text-9xl leading-none tabular-nums drop-shadow-xl ${
                  lastResult === 'correct' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {stat.fmt(rightVal)}
              </p>
            ) : (
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => guess(true)}
                  className="w-full font-display font-800 text-base uppercase tracking-wider
                             border-2 border-white/30 bg-white/5 hover:bg-white/15 hover:border-white/60
                             text-white rounded-full px-6 py-3.5
                             transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <span>Higher</span>
                  <span className="text-[var(--accent)]">▲</span>
                </button>
                <button
                  onClick={() => guess(false)}
                  className="w-full font-display font-800 text-base uppercase tracking-wider
                             border-2 border-white/30 bg-white/5 hover:bg-white/15 hover:border-white/60
                             text-white rounded-full px-6 py-3.5
                             transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  <span>Lower</span>
                  <span className="text-[var(--accent)]">▼</span>
                </button>
              </div>
            )}

            <p className="font-display font-800 text-sm text-white/70 uppercase tracking-widest">
              {stat.label} than {left?.name.split(' ')[0]}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
