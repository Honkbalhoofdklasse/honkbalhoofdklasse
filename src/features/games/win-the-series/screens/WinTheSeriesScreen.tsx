'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TEAM_IDS } from '@/shared/teams/teams'
import { DraftScreen } from '../components/DraftScreen'
import { ResultScreen } from '../components/ResultScreen'
import { Shell } from '../components/Shell'
import { StartScreen } from '../components/StartScreen'
import { CUTOFF_MAX, CUTOFF_MIN, RP_KEYS, SKIPS, SLOTS, SP_KEYS } from '../domain/config'
import { buildDraftSections } from '../domain/draft-sections'
import { firstOpen, isPitcher, openHitterSlots, pkey, simulateSeason } from '../domain/sim'
import type { Data, Filled, HSHitter, HSPitcher, Mode, Phase, Sim } from '../domain/types'

// ── Main ──────────────────────────────────────────────────────────────────────
export default function WinTheSeriesScreen() {
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState(false)
  const [phase, setPhase] = useState<Phase>('start')
  const [mode, setMode] = useState<Mode>('free')

  const [filled, setFilled] = useState<Filled>({})
  const [dealt, setDealt] = useState<string>(TEAM_IDS[0])
  const [spinning, setSpinning] = useState(false)
  const [cutoff, setCutoff] = useState(24)
  const [skips, setSkips] = useState(SKIPS)
  const [revealed, setRevealed] = useState(false) // has this round's team been spun yet?
  const [choosing, setChoosing] = useState<HSHitter | null>(null)
  const [sim, setSim] = useState<Sim | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fetch('/api/win-the-series')
      .then((r) => r.json())
      .then((d: Data) => {
        if (d?.hitters?.length && d?.pitchers?.length) setData(d)
        else setError(true)
      })
      .catch(() => setError(true))
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [])

  const picked = useMemo(() => new Set(Object.values(filled).map(pkey)), [filled])
  const pickCount = Object.keys(filled).length
  // Pick-quality (sort + dominance bar) uses sample-adjusted rates, so small
  // samples can't top the board on rate alone.
  const opsSorted = useMemo(
    () => (data?.hitters ?? []).map((h) => h.opsAdj).sort((a, b) => a - b),
    [data],
  )
  const eraSorted = useMemo(
    () => (data?.pitchers ?? []).map((p) => p.eraAdj).sort((a, b) => a - b),
    [data],
  )
  const hitPct = (ops: number) =>
    opsSorted.length < 2 ? 0.5 : opsSorted.filter((o) => o < ops).length / (opsSorted.length - 1)
  const pitPct = (era: number) =>
    eraSorted.length < 2 ? 0.5 : eraSorted.filter((e) => e > era).length / (eraSorted.length - 1)

  const teamPlayers = useCallback(
    (t: string): (HSHitter | HSPitcher)[] => {
      if (!data) return []
      return [...data.hitters, ...data.pitchers].filter(
        (p) => p.teamId === t && !picked.has(pkey(p)),
      )
    },
    [data, picked],
  )

  const canPick = useCallback(
    (p: HSHitter | HSPitcher) => {
      if (isPitcher(p)) return (p.role === 'SP' ? SP_KEYS : RP_KEYS).some((k) => !filled[k])
      return openHitterSlots(p, filled).length > 0
    },
    [filled],
  )

  const teamsWithPick = useCallback(() => {
    if (!data) return [] as string[]
    return TEAM_IDS.filter((t) => teamPlayers(t).some(canPick))
  }, [data, teamPlayers, canPick])

  const dealTeam = useCallback(
    (exclude?: string) => {
      let teams = teamsWithPick()
      if (teams.length > 1 && exclude) teams = teams.filter((t) => t !== exclude)
      if (!teams.length) return
      const final = teams[Math.floor(Math.random() * teams.length)]
      setSpinning(true)
      const STEPS = 20
      let i = 0,
        prev = dealt
      const step = () => {
        let t = TEAM_IDS[Math.floor(Math.random() * TEAM_IDS.length)]
        if (t === prev) t = TEAM_IDS[(TEAM_IDS.indexOf(t) + 1) % TEAM_IDS.length]
        prev = t
        setDealt(t)
        i++
        if (i < STEPS) {
          const p = i / STEPS
          timer.current = setTimeout(step, 34 + 150 * p * p) // ease-out: steady then slowing
        } else {
          setDealt(final)
          setSpinning(false)
          setRevealed(true)
        }
      }
      step()
    },
    [teamsWithPick, dealt],
  )

  const spin = () => {
    if (!spinning && !revealed) dealTeam()
  }

  const runSim = (f: Filled, cut: number) => {
    setSim(simulateSeason(f, cut, data!))
    setPhase('result')
  }

  const assign = (player: HSHitter | HSPitcher, slotKey: string) => {
    if (filled[slotKey]) return
    const next = { ...filled, [slotKey]: player }
    setFilled(next)
    setChoosing(null)
    if (Object.keys(next).length >= SLOTS.length) runSim(next, cutoff)
    else setRevealed(false) // next round waits for a fresh spin
  }

  const clickPlayer = (p: HSHitter | HSPitcher) => {
    if (spinning || !canPick(p)) return
    if (isPitcher(p)) {
      const k = firstOpen(p.role === 'SP' ? SP_KEYS : RP_KEYS, filled)
      if (k) assign(p, k)
      return
    }
    const opts = openHitterSlots(p, filled)
    if (opts.length === 1) assign(p, opts[0])
    else setChoosing(p) // multi-position → let the user pick where
  }

  const reroll = () => {
    if (skips <= 0 || spinning || teamsWithPick().length <= 1) return
    setSkips((s) => s - 1)
    dealTeam(dealt)
  }

  const start = (m: Mode) => {
    setMode(m)
    setFilled({})
    setSim(null)
    setChoosing(null)
    setSkips(SKIPS)
    setCutoff(CUTOFF_MIN + Math.floor(Math.random() * (CUTOFF_MAX - CUTOFF_MIN + 1)))
    setPhase('draft')
    setRevealed(false)
  }

  if (error)
    return (
      <Shell>
        <p className="text-center font-display font-700 text-[var(--muted)] uppercase py-20">
          Kon spelersdata niet laden. Probeer later opnieuw.
        </p>
      </Shell>
    )
  if (!data)
    return (
      <Shell>
        <p className="text-center font-display font-700 text-[var(--muted)] uppercase py-20 animate-pulse">
          Loading players…
        </p>
      </Shell>
    )

  // ── Start ──
  if (phase === 'start') {
    return <StartScreen onStart={start} />
  }

  // ── Draft ──
  if (phase === 'draft') {
    const roster = teamPlayers(dealt)
    const pctOf = (p: HSHitter | HSPitcher) => (isPitcher(p) ? pitPct(p.eraAdj) : hitPct(p.opsAdj))
    const sections = buildDraftSections(roster, filled)

    return (
      <DraftScreen
        sections={sections}
        filled={filled}
        mode={mode}
        pickCount={pickCount}
        cutoff={cutoff}
        dealt={dealt}
        spinning={spinning}
        revealed={revealed}
        skips={skips}
        canReroll={teamsWithPick().length > 1}
        choosing={choosing}
        pctOf={pctOf}
        onSpin={spin}
        onReroll={reroll}
        onAssign={assign}
        onClickPlayer={clickPlayer}
        onCloseChooser={() => setChoosing(null)}
      />
    )
  }

  // ── Result ──
  const s = sim!
  return <ResultScreen s={s} data={data} filled={filled} onPlayAgain={() => setPhase('start')} />
}
