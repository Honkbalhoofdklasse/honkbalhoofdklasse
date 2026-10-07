'use client'

import { useState, useEffect, useCallback } from 'react'
import { NicknameScreen } from '../components/NicknameScreen'
import { PickEmLeaderboard } from '../components/PickEmLeaderboard'
import { WeekSection } from '../components/WeekSection'
import { getWeekKey, isLocked } from '../domain/pick-em-rules'
import type { Game, LeaderEntry, UserInfo } from '../domain/types'

export default function PickEmScreen() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [nickInput, setNickInput] = useState('')
  const [games, setGames] = useState<Game[]>([])
  const [picks, setPicks] = useState<Map<number, string>>(new Map())
  const [saving, setSaving] = useState<number | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([])
  const [tab, setTab] = useState<'picks' | 'leaderboard'>('picks')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('pickem_user')
    if (stored) {
      try {
        setUser(JSON.parse(stored))
      } catch {}
    }
  }, [])

  const loadData = useCallback(async (token: string) => {
    setLoading(true)
    const [gamesRes, lbRes] = await Promise.all([
      fetch(`/api/pick-em?token=${token}`),
      fetch('/api/pick-em/leaderboard'),
    ])
    const { games: g, picks: p } = await gamesRes.json()
    const lb = await lbRes.json()
    setGames(g ?? [])
    const map = new Map<number, string>()
    for (const pick of p ?? []) map.set(pick.game_id, pick.picked_team_id)
    setPicks(map)
    setLeaderboard(lb ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (user) loadData(user.token)
  }, [user, loadData])

  function saveUser() {
    const nick = nickInput.trim()
    if (!nick) return
    const token = crypto.randomUUID()
    const u = { token, nickname: nick }
    localStorage.setItem('pickem_user', JSON.stringify(u))
    setUser(u)
  }

  async function pick(gameId: number, teamId: string) {
    if (!user) return
    const game = games.find((g) => g.id === gameId)
    if (!game || isLocked(game)) return

    setPicks((prev) => new Map(prev).set(gameId, teamId))
    setSaving(gameId)

    await fetch('/api/pick-em', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userToken: user.token,
        nickname: user.nickname,
        gameId,
        pickedTeamId: teamId,
      }),
    })
    setSaving(null)
  }

  const grouped = games.reduce<Record<string, Game[]>>((acc, g) => {
    const key = getWeekKey(g.game_date)
    if (!acc[key]) acc[key] = []
    acc[key].push(g)
    return acc
  }, {})

  const weekKeys = Object.keys(grouped).sort()

  const today = new Date().toISOString().split('T')[0]
  const activeWeek =
    weekKeys.find((k) => {
      const games = grouped[k]
      return games.some(
        (g) => g.game_date >= today || g.status === 'scheduled' || g.status === 'live',
      )
    }) ?? weekKeys[weekKeys.length - 1]

  const visibleWeeks = weekKeys.filter((week) =>
    grouped[week].some((g) => g.status === 'scheduled' || g.status === 'live'),
  )

  const myRank = user ? leaderboard.findIndex((e) => e.token === user.token) + 1 : 0
  const myEntry = user ? leaderboard.find((e) => e.token === user.token) : null

  if (!user) {
    return <NicknameScreen nickInput={nickInput} setNickInput={setNickInput} saveUser={saveUser} />
  }

  return (
    <div className="min-h-screen bg-[#06101e] px-4 pt-20 pb-16">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <p className="font-display font-700 text-[var(--accent)] uppercase tracking-widest text-xs mb-1">
            Honkbal Hoofdklasse
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-display font-800 italic text-5xl uppercase text-white leading-none">
              Pick <span className="text-[var(--accent)]">'em</span>
            </h1>
            {myEntry && (
              <div className="text-right">
                <p className="font-display font-800 text-lg text-white">
                  {myEntry.correct}/{myEntry.total}
                </p>
                <p className="font-display font-700 text-xs text-[var(--muted)] uppercase tracking-wider">
                  {myRank > 0 ? `#${myRank} · ` : ''}
                  {myEntry.pct}% goed
                </p>
              </div>
            )}
          </div>
          <p className="font-display font-700 text-sm text-[var(--muted)] mt-1 uppercase tracking-wider">
            Hallo {user.nickname} ·{' '}
            <button
              onClick={() => {
                localStorage.removeItem('pickem_user')
                setUser(null)
              }}
              className="text-[var(--accent)] hover:underline"
            >
              Wijzigen
            </button>
          </p>
        </div>

        <div className="flex gap-1 mb-6 bg-[#0a1220] border border-[#1a2a3a] rounded-xl p-1">
          {(['picks', 'leaderboard'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 font-display font-800 text-xs uppercase tracking-wider py-2.5 rounded-lg transition-colors ${
                tab === t ? 'bg-[var(--accent)] text-white' : 'text-[var(--muted)] hover:text-white'
              }`}
            >
              {t === 'picks' ? 'Voorspellingen' : 'Ranglijst'}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="font-display font-700 text-sm text-[var(--muted)] uppercase tracking-wider animate-pulse">
              Laden…
            </p>
          </div>
        )}

        {!loading && tab === 'picks' && (
          <div className="space-y-8">
            {visibleWeeks.map((week) => (
              <WeekSection
                key={week}
                week={week}
                weekGames={grouped[week]}
                isCurrentWeek={week === activeWeek}
                picks={picks}
                saving={saving}
                onPick={pick}
              />
            ))}
          </div>
        )}

        {!loading && tab === 'leaderboard' && (
          <PickEmLeaderboard leaderboard={leaderboard} user={user} />
        )}
      </div>
    </div>
  )
}
