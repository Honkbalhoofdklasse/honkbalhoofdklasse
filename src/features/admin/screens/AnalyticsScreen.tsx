'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import BarList from '@/features/admin/components/BarList'
import PageTable from '@/features/admin/components/PageTable'
import QueryTable from '@/features/admin/components/QueryTable'
import StatCard from '@/features/admin/components/StatCard'
import TimeChart from '@/features/admin/components/TimeChart'
import {
  COUNTRY_NAMES,
  DEVICE_NAMES,
  type GscData,
  fmtNum,
} from '@/features/admin/domain/gsc-analytics'

const RANGES = [
  { label: '7 days', value: '7d' },
  { label: '28 days', value: '28d' },
  { label: '90 days', value: '90d' },
]

export default function AnalyticsScreen() {
  const [pw, setPw] = useState('')
  const [authed, setAuthed] = useState(false)
  const [range, setRange] = useState('28d')
  const [data, setData] = useState<GscData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('admin-pw')
    if (saved) {
      setPw(saved)
      setAuthed(true)
    }
  }, [])

  const fetchData = useCallback(async (password: string, r: string) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/gsc?range=${r}`, {
        headers: { 'x-admin-password': password },
      })
      if (res.status === 401) {
        setError('Wrong password')
        setLoading(false)
        return
      }
      const json = await res.json()
      if (json.error) setError(json.error)
      setData(json)
    } catch {
      setError('Failed to load')
    }
    setLoading(false)
  }, [])

  function login(e: React.FormEvent) {
    e.preventDefault()
    localStorage.setItem('admin-pw', pw)
    setAuthed(true)
    fetchData(pw, range)
  }

  useEffect(() => {
    if (authed && pw) fetchData(pw, range)
  }, [authed, pw, range, fetchData])

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#06101e]">
        <form onSubmit={login} className="space-y-4 w-full max-w-xs px-4">
          <h1 className="font-display font-800 italic text-3xl uppercase text-white">Analytics</h1>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full bg-[#0a1220] border border-[#1a2a3a] rounded-xl px-4 py-3 text-white font-display font-700 text-sm focus:outline-none focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            className="w-full bg-[var(--accent)] text-white font-display font-800 text-sm uppercase tracking-wider py-3 rounded-xl hover:opacity-90 transition-opacity"
          >
            Login
          </button>
          {error && <p className="text-red-400 font-display font-700 text-xs">{error}</p>}
        </form>
      </div>
    )
  }

  const t = data?.totals
  const ctrPct = t ? (t.ctr * 100).toFixed(1) : '0'
  const avgPos = t ? t.position.toFixed(1) : '0'

  return (
    <div className="min-h-screen bg-[#06101e] px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8 flex-wrap">
          <Link
            href="/admin"
            className="font-display font-800 text-[var(--accent)] text-sm hover:opacity-80"
          >
            ← Admin
          </Link>
          <h1 className="font-display font-800 italic text-3xl uppercase text-white">Analytics</h1>
          <div className="ml-auto flex gap-2">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={`font-display font-700 text-xs uppercase tracking-wider px-3 py-1.5 rounded-lg transition-colors ${range === r.value ? 'bg-[var(--accent)] text-white' : 'bg-[#0a1220] border border-[#1a2a3a] text-white/60 hover:text-white'}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <p className="font-display font-700 text-xs text-[var(--muted)] uppercase tracking-wider mb-6">
          Google Search Console · honkbalhoofdklasse.com
        </p>

        {loading && (
          <div className="text-center py-20 text-white/40 font-display font-700 text-sm uppercase tracking-wider">
            Loading…
          </div>
        )}
        {error && <p className="text-red-400 font-display font-700 text-sm mb-4">{error}</p>}

        {data && !loading && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Clicks" value={fmtNum(t?.clicks ?? 0)} />
              <StatCard label="Impressions" value={fmtNum(t?.impressions ?? 0)} />
              <StatCard label="Avg CTR" value={`${ctrPct}%`} />
              <StatCard label="Avg Position" value={avgPos} />
            </div>

            <TimeChart data={data.timeseries} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <QueryTable rows={data.queries} />
              <PageTable rows={data.pages} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BarList
                title="Countries"
                rows={data.countries.map((c) => ({
                  label: COUNTRY_NAMES[c.country] ?? c.country.toUpperCase(),
                  clicks: c.clicks,
                  impressions: c.impressions,
                }))}
              />
              <BarList
                title="Devices"
                rows={data.devices.map((d) => ({
                  label: DEVICE_NAMES[d.device] ?? d.device,
                  clicks: d.clicks,
                  impressions: d.impressions,
                }))}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
