'use client'

import { fmt, fmtRate } from '../domain/format'
import type { OnSelect, Row } from '../domain/types'
import LeaderTable from './LeaderTable'

export default function WeekHittingTables({
  batters,
  battingQualified,
  avgTitle,
  obpTitle,
  showRunsDoubles,
  onSelect,
}: {
  batters: Row[]
  battingQualified?: Row[]
  avgTitle?: string
  obpTitle?: string
  showRunsDoubles?: boolean
  onSelect: OnSelect
}) {
  const byHR = [...batters].sort((a, b) => (b.home_runs as number) - (a.home_runs as number))
  const byRBI = [...batters].sort((a, b) => (b.rbi as number) - (a.rbi as number))
  const byR = [...batters].sort((a, b) => (b.runs as number) - (a.runs as number))
  const by2B = [...batters].sort((a, b) => (b.doubles as number) - (a.doubles as number))
  const bySB = [...batters].sort((a, b) => (b.stolen_bases as number) - (a.stolen_bases as number))
  const byH = [...batters].sort((a, b) => (b.hits as number) - (a.hits as number))
  const qualRows = battingQualified ?? batters
  const byOBP = [...qualRows]
    .filter((r) => r.obp != null && Number(r.obp) > 0)
    .sort((a, b) => Number(b.obp) - Number(a.obp))
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LeaderTable
        title={avgTitle ?? 'Batting Avg'}
        rows={qualRows}
        statType="batting"
        onSelect={onSelect}
        columns={[
          { label: 'AB', value: (r) => fmt(r.at_bats) },
          { label: 'H', value: (r) => fmt(r.hits) },
          { label: 'AVG', value: (r) => fmtRate(r.avg) },
        ]}
      />
      <LeaderTable
        title={obpTitle ?? 'OBP'}
        rows={byOBP}
        statType="batting"
        onSelect={onSelect}
        columns={[
          { label: 'AB', value: (r) => fmt(r.at_bats) },
          { label: 'OBP', value: (r) => fmtRate(r.obp) },
        ]}
      />
      <LeaderTable
        title="Home Runs"
        rows={byHR}
        statType="batting"
        onSelect={onSelect}
        columns={[
          { label: 'AB', value: (r) => fmt(r.at_bats) },
          { label: 'HR', value: (r) => fmt(r.home_runs) },
        ]}
      />
      <LeaderTable
        title="RBI"
        rows={byRBI}
        statType="batting"
        onSelect={onSelect}
        columns={[
          { label: 'AB', value: (r) => fmt(r.at_bats) },
          { label: 'RBI', value: (r) => fmt(r.rbi) },
        ]}
      />
      {showRunsDoubles && (
        <LeaderTable
          title="Runs"
          rows={byR}
          statType="batting"
          onSelect={onSelect}
          columns={[
            { label: 'AB', value: (r) => fmt(r.at_bats) },
            { label: 'R', value: (r) => fmt(r.runs) },
          ]}
        />
      )}
      {showRunsDoubles && (
        <LeaderTable
          title="Doubles"
          rows={by2B}
          statType="batting"
          onSelect={onSelect}
          columns={[
            { label: 'AB', value: (r) => fmt(r.at_bats) },
            { label: '2B', value: (r) => fmt(r.doubles) },
          ]}
        />
      )}
      <LeaderTable
        title="Hits"
        rows={byH}
        statType="batting"
        onSelect={onSelect}
        columns={[
          { label: 'AB', value: (r) => fmt(r.at_bats) },
          { label: 'H', value: (r) => fmt(r.hits) },
        ]}
      />
      <LeaderTable
        title="Stolen Bases"
        rows={bySB}
        statType="batting"
        onSelect={onSelect}
        columns={[{ label: 'SB', value: (r) => fmt(r.stolen_bases) }]}
      />
    </div>
  )
}
