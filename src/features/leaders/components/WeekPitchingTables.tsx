'use client'

import { fmt, fmtIp, ipToDec } from '../domain/format'
import type { OnSelect, Row } from '../domain/types'
import LeaderTable from './LeaderTable'

export default function WeekPitchingTables({
  pitchers,
  eraTitle,
  whipTitle,
  onSelect,
}: {
  pitchers: Row[]
  eraTitle?: string
  whipTitle?: string
  onSelect: OnSelect
}) {
  const byK = [...pitchers].sort((a, b) => (b.strikeouts as number) - (a.strikeouts as number))
  const byW = [...pitchers].sort((a, b) => (b.wins as number) - (a.wins as number))
  const bySV = [...pitchers].sort((a, b) => (b.saves as number) - (a.saves as number))
  const byIP = [...pitchers].sort((a, b) => ipToDec(b.innings_pitched) - ipToDec(a.innings_pitched))
  const byERA = [...pitchers]
    .filter((p) => ipToDec(p.innings_pitched) >= 1)
    .sort((a, b) => {
      const eraA = (Number(a.earned_runs ?? 0) / ipToDec(a.innings_pitched)) * 9
      const eraB = (Number(b.earned_runs ?? 0) / ipToDec(b.innings_pitched)) * 9
      return eraA - eraB
    })
  const byWHIP = [...pitchers]
    .filter((p) => ipToDec(p.innings_pitched) >= 1)
    .sort((a, b) => {
      const whipA =
        (Number(a.walks ?? 0) + Number(a.hits_allowed ?? 0)) / ipToDec(a.innings_pitched)
      const whipB =
        (Number(b.walks ?? 0) + Number(b.hits_allowed ?? 0)) / ipToDec(b.innings_pitched)
      return whipA - whipB
    })

  const fmtERA = (r: Row) =>
    ipToDec(r.innings_pitched) > 0
      ? ((Number(r.earned_runs ?? 0) / ipToDec(r.innings_pitched)) * 9).toFixed(2)
      : '-'
  const fmtWHIP = (r: Row) =>
    ipToDec(r.innings_pitched) > 0
      ? ((Number(r.walks ?? 0) + Number(r.hits_allowed ?? 0)) / ipToDec(r.innings_pitched)).toFixed(
          2,
        )
      : '-'

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <LeaderTable
        title="Strikeouts"
        rows={byK}
        statType="pitching"
        onSelect={onSelect}
        columns={[
          { label: 'IP', value: (r) => fmtIp(r.innings_pitched) },
          { label: 'K', value: (r) => fmt(r.strikeouts) },
        ]}
      />
      <LeaderTable
        title={eraTitle ?? 'ERA'}
        rows={byERA}
        statType="pitching"
        onSelect={onSelect}
        columns={[
          { label: 'IP', value: (r) => fmtIp(r.innings_pitched) },
          { label: 'ERA', value: (r) => fmtERA(r) },
        ]}
      />
      <LeaderTable
        title={whipTitle ?? 'WHIP'}
        rows={byWHIP}
        statType="pitching"
        onSelect={onSelect}
        columns={[
          { label: 'IP', value: (r) => fmtIp(r.innings_pitched) },
          { label: 'WHIP', value: (r) => fmtWHIP(r) },
        ]}
      />
      <LeaderTable
        title="Wins"
        rows={byW}
        statType="pitching"
        onSelect={onSelect}
        columns={[
          { label: 'IP', value: (r) => fmtIp(r.innings_pitched) },
          { label: 'W', value: (r) => fmt(r.wins) },
        ]}
      />
      <LeaderTable
        title="Saves"
        rows={bySV}
        statType="pitching"
        onSelect={onSelect}
        columns={[
          { label: 'IP', value: (r) => fmtIp(r.innings_pitched) },
          { label: 'SV', value: (r) => fmt(r.saves) },
        ]}
      />
      <LeaderTable
        title="Innings Pitched"
        rows={byIP}
        statType="pitching"
        onSelect={onSelect}
        columns={[
          { label: 'IP', value: (r) => fmtIp(r.innings_pitched) },
          { label: 'K', value: (r) => fmt(r.strikeouts) },
        ]}
      />
    </div>
  )
}
