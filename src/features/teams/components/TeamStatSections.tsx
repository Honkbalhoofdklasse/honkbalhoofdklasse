import type { TeamBatting, TeamPitching } from '@/shared/teams/team-stats'
import { fmtRate } from '../domain/teamPage'
import Section from './Section'
import StatRow from './StatRow'

export function TeamBattingSection({ bat }: { bat: TeamBatting }) {
  return (
    <Section title="Team Batting">
      <StatRow label="Batting Average" value={fmtRate(bat.avg)} highlight />
      <StatRow label="On-Base Pct" value={fmtRate(bat.obp)} />
      <StatRow label="Slugging Pct" value={fmtRate(bat.slg)} highlight />
      <StatRow label="OPS" value={fmtRate(bat.ops)} />
      <StatRow label="Runs Scored" value={bat.r} highlight />
      <StatRow label="Hits" value={bat.h} />
      <StatRow label="Home Runs" value={bat.hr} highlight />
      <StatRow label="RBI" value={bat.rbi} />
      <StatRow label="Doubles" value={bat.double} highlight />
      <StatRow label="Triples" value={bat.triple} />
      <StatRow label="Stolen Bases" value={`${bat.sb} (${bat.cs} CS)`} highlight />
      <StatRow label="Walks" value={bat.bb} />
      <StatRow label="Strikeouts" value={bat.so} highlight />
      <StatRow label="At Bats" value={bat.ab} />
      <StatRow label="Total Bases" value={bat.tb} highlight />
    </Section>
  )
}

export function TeamPitchingSection({ pit }: { pit: TeamPitching }) {
  return (
    <Section title="Team Pitching">
      <StatRow label="ERA" value={pit.era.toFixed(2)} highlight />
      <StatRow label="WHIP" value={pit.whip.toFixed(2)} />
      <StatRow label="Innings Pitched" value={pit.ip} highlight />
      <StatRow label="Strikeouts" value={pit.pitch_so} />
      <StatRow label="Walks" value={pit.pitch_bb} highlight />
      <StatRow label="Hits Allowed" value={pit.pitch_h} />
      <StatRow label="Runs Allowed" value={pit.pitch_r} highlight />
      <StatRow label="Earned Runs" value={pit.pitch_er} />
      <StatRow label="Home Runs Allowed" value={pit.pitch_hr} highlight />
      <StatRow label="Complete Games" value={pit.pitch_cg} />
      <StatRow label="Shutouts" value={pit.pitch_sho} highlight />
      <StatRow label="Saves" value={pit.pitch_save} />
      <StatRow label="Opp Batting Avg" value={fmtRate(pit.bavg)} highlight />
    </Section>
  )
}
