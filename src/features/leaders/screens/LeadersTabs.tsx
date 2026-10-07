'use client'

import { useState, useEffect } from 'react'
import PlayerStatsModal from '@/shared/ui/PlayerStatsModal'
import SeasonCategoryGrid from '../components/SeasonCategoryGrid'
import TabButton from '../components/TabButton'
import WeekHittingTables from '../components/WeekHittingTables'
import WeekPitchingTables from '../components/WeekPitchingTables'
import { currentMonthPrefix, formatMonth } from '../domain/format'
import type { Category, OnSelect, Period, SeasonLeaders, TabData } from '../domain/types'

export type { KnbsbCategory, SeasonLeaders, TabData } from '../domain/types'

export default function LeadersTabs({
  week,
  season,
  seriesLabel,
  month,
  monthLabel,
  availableMonths,
}: {
  week: TabData | null
  season: SeasonLeaders
  seriesLabel: string | null
  month: TabData
  monthLabel: string
  availableMonths: string[]
}) {
  const [period, setPeriod] = useState<Period>('season')
  const [category, setCategory] = useState<Category>('hitting')
  const [selectedPlayer, setSelectedPlayer] = useState<{
    name: string
    teamId: string
    statType: 'batting' | 'pitching'
  } | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>(currentMonthPrefix)
  const [monthData, setMonthData] = useState<TabData>(month)
  const [loadingMonth, setLoadingMonth] = useState(false)
  const [psData, setPsData] = useState<TabData | null>(null)
  const [psLoading, setPsLoading] = useState(false)

  useEffect(() => {
    const cur = currentMonthPrefix()
    if (selectedMonth === cur) {
      setMonthData(month)
      return
    }
    setLoadingMonth(true)
    fetch(`/api/leaders/month?month=${selectedMonth}`)
      .then((r) => r.json())
      .then((data) => {
        setMonthData(data)
        setLoadingMonth(false)
      })
      .catch(() => setLoadingMonth(false))
  }, [selectedMonth, month])

  useEffect(() => {
    if (period !== 'semi' && period !== 'final') return
    setPsLoading(true)
    setPsData(null)
    fetch(`/api/leaders/postseason?round=${period}`)
      .then((r) => r.json())
      .then((data) => {
        setPsData(data)
        setPsLoading(false)
      })
      .catch(() => setPsLoading(false))
  }, [period])

  const onSelect: OnSelect = (name, teamId, statType) => {
    setSelectedPlayer({ name, teamId, statType })
  }

  return (
    <>
      {selectedPlayer && (
        <PlayerStatsModal
          playerName={selectedPlayer.name}
          teamId={selectedPlayer.teamId}
          statType={selectedPlayer.statType}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex gap-2 flex-wrap items-center">
            <TabButton
              active={period === 'week'}
              disabled={!week}
              onClick={() => setPeriod('week')}
            >
              {seriesLabel ?? 'This Week'}
            </TabButton>
            <div className="flex items-center gap-1">
              <TabButton active={period === 'month'} onClick={() => setPeriod('month')}>
                This Month
              </TabButton>
              {period === 'month' && availableMonths.length > 1 && (
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="font-display font-700 text-xs uppercase bg-[var(--card)] border border-[var(--border)] text-white rounded-xl px-3 py-2.5 cursor-pointer outline-none hover:border-white/30 transition-colors"
                >
                  {availableMonths.map((m) => (
                    <option key={m} value={m}>
                      {formatMonth(m)}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <TabButton active={period === 'season'} onClick={() => setPeriod('season')}>
              Season 2026
            </TabButton>
            <TabButton active={period === 'semi'} onClick={() => setPeriod('semi')}>
              Semifinals
            </TabButton>
            <TabButton active={period === 'final'} onClick={() => setPeriod('final')}>
              Holland Series
            </TabButton>
          </div>
          <div className="flex gap-2">
            <TabButton active={category === 'hitting'} onClick={() => setCategory('hitting')}>
              Hitting
            </TabButton>
            <TabButton active={category === 'pitching'} onClick={() => setCategory('pitching')}>
              Pitching
            </TabButton>
          </div>
        </div>

        {period === 'season' && category === 'hitting' && (
          <SeasonCategoryGrid categories={season.batting} statType="batting" onSelect={onSelect} />
        )}
        {period === 'season' && category === 'pitching' && (
          <SeasonCategoryGrid
            categories={season.pitching}
            statType="pitching"
            onSelect={onSelect}
          />
        )}
        {period === 'week' && week && category === 'hitting' && (
          <WeekHittingTables batters={week.batters} showRunsDoubles onSelect={onSelect} />
        )}
        {period === 'week' && week && category === 'pitching' && (
          <WeekPitchingTables pitchers={week.pitchers} onSelect={onSelect} />
        )}
        {period === 'month' && loadingMonth && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 text-center">
            <p className="font-display font-700 text-[var(--muted)] text-sm uppercase tracking-widest">
              Loading…
            </p>
          </div>
        )}
        {period === 'month' &&
          !loadingMonth &&
          category === 'hitting' &&
          (monthData.batters.length > 0 ? (
            <WeekHittingTables
              batters={monthData.batters}
              battingQualified={monthData.battingQualified}
              avgTitle="Batting Avg (min 2.7 PA/G)"
              obpTitle="OBP (min 2.7 PA/G)"
              onSelect={onSelect}
            />
          ) : (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 text-center">
              <p className="font-display font-700 text-[var(--muted)] text-sm uppercase tracking-widest">
                {formatMonth(selectedMonth)} — No data yet
              </p>
            </div>
          ))}
        {period === 'month' &&
          !loadingMonth &&
          category === 'pitching' &&
          (monthData.pitchers.length > 0 ? (
            <WeekPitchingTables
              pitchers={monthData.pitchers}
              eraTitle="ERA (min 1 IP/G)"
              whipTitle="WHIP (min 1 IP/G)"
              onSelect={onSelect}
            />
          ) : (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 text-center">
              <p className="font-display font-700 text-[var(--muted)] text-sm uppercase tracking-widest">
                {formatMonth(selectedMonth)} — No data yet
              </p>
            </div>
          ))}

        {(period === 'semi' || period === 'final') && psLoading && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 text-center">
            <p className="font-display font-700 text-[var(--muted)] text-sm uppercase tracking-widest">
              Loading…
            </p>
          </div>
        )}
        {(period === 'semi' || period === 'final') &&
          !psLoading &&
          category === 'hitting' &&
          (psData && psData.batters.length > 0 ? (
            <WeekHittingTables
              batters={psData.batters}
              battingQualified={psData.batters}
              showRunsDoubles
              onSelect={onSelect}
            />
          ) : (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 text-center">
              <p className="font-display font-700 text-[var(--muted)] text-sm uppercase tracking-widest">
                {period === 'final' ? 'Holland Series has not been played yet' : 'No games yet'}
              </p>
            </div>
          ))}
        {(period === 'semi' || period === 'final') &&
          !psLoading &&
          category === 'pitching' &&
          (psData && psData.pitchers.length > 0 ? (
            <WeekPitchingTables pitchers={psData.pitchers} onSelect={onSelect} />
          ) : (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-8 text-center">
              <p className="font-display font-700 text-[var(--muted)] text-sm uppercase tracking-widest">
                {period === 'final' ? 'Holland Series has not been played yet' : 'No games yet'}
              </p>
            </div>
          ))}
      </div>
    </>
  )
}
