import type { BatterStat, PitcherStat, RawPlayer } from './boxscoreTypes'

export function n(v: unknown): number {
  const x = Number(v)
  return isNaN(x) ? 0 : x
}

export function ipToString(raw: unknown): string {
  if (raw === null || raw === undefined || raw === '') return '0.0'
  const str = String(raw)
  if (str.includes('.')) return str
  const num = Number(str)
  if (isNaN(num) || num === 0) return '0.0'
  return `${Math.floor(num / 3)}.${num % 3}`
}

export function extractBatters(players: RawPlayer[]): BatterStat[] {
  const seen = new Set<string>()
  const result: BatterStat[] = []

  for (const p of players) {
    if (!p.firstname) continue
    const name = `${p.firstname} ${p.lastname}`
    if (seen.has(name)) continue
    seen.add(name)

    const spot = n(p.spot)
    const sub = n(p.sub)
    const pos = String(p.pos ?? '')

    // Skip pitchers (spot === 90)
    if (spot === 90) continue

    // Include if: has valid batting spot (1-9) AND (has plate appearance OR is substitute)
    const hasBattingSpot = spot >= 1 && spot <= 9
    const hasPA =
      n(p.ab) > 0 ||
      n(p.bb) > 0 ||
      n(p.hbp) > 0 ||
      n(p.sf) > 0 ||
      n(p.sh) > 0 ||
      n(p.r) > 0 ||
      n(p.rbi) > 0
    const isSub = sub > 0

    if (!hasBattingSpot || (!hasPA && !isSub)) continue

    result.push({
      name,
      pos,
      isSubstitute: isSub,
      ab: n(p.ab),
      h: n(p.h),
      r: n(p.r),
      rbi: n(p.rbi),
      bb: n(p.bb),
      so: n(p.so),
      hr: n(p.hr),
      double: n(p.double),
      triple: n(p.triple),
    })
  }

  // Sort by spot, then by sub (substitutes come after starter in same spot)
  return result.sort((a, b) => {
    // Need to get spot from original players for sorting
    const aPlayer = players.find((p) => `${p.firstname} ${p.lastname}` === a.name)
    const bPlayer = players.find((p) => `${p.firstname} ${p.lastname}` === b.name)
    const aSpot = n(aPlayer?.spot)
    const bSpot = n(bPlayer?.spot)
    const aSub = n(aPlayer?.sub)
    const bSub = n(bPlayer?.sub)

    if (aSpot !== bSpot) return aSpot - bSpot
    return aSub - bSub
  })
}

export function extractPitchers(players: RawPlayer[]): PitcherStat[] {
  const seen = new Set<string>()
  const result: PitcherStat[] = []
  for (const p of players) {
    if (!p.firstname) continue
    const name = `${p.firstname} ${p.lastname}`
    if (seen.has(name)) continue
    seen.add(name)
    if (n(p.pitch_appear) === 0 && n(p.pitch_ip) === 0) continue
    result.push({
      name,
      ip: ipToString(p.pitch_ip),
      h: n(p.pitch_h),
      r: n(p.pitch_r),
      er: n(p.pitch_er),
      bb: n(p.pitch_bb),
      so: n(p.pitch_so),
      win: n(p.pitch_win) > 0,
      loss: n(p.pitch_loss) > 0,
      save: n(p.pitch_save) > 0,
    })
  }
  return result
}

// Returns players sorted by batting-order slot (the numeric section key in the API).
// Each slot may contain multiple players (starter + substitutes in that spot).
export function getTeamPlayers(
  boxScore: Record<string, unknown>,
  teamId: string | number,
): RawPlayer[] {
  const team = boxScore[String(teamId)] as Record<string, unknown> | undefined
  if (!team) return []

  // Group entries by their numeric key (= batting-order slot 1-9) vs non-numeric
  const slots: [number, RawPlayer[]][] = []
  const extra: RawPlayer[] = []

  for (const [key, section] of Object.entries(team)) {
    const slot = parseInt(key, 10)
    const collect = (v: unknown, target: RawPlayer[]) => {
      if (!v || typeof v !== 'object') return
      if (Array.isArray(v)) {
        for (const item of v) {
          if (item && typeof item === 'object' && (item as RawPlayer).firstname)
            target.push({ ...(item as RawPlayer), _slot: isNaN(slot) ? 0 : slot })
          else collect(item, target)
        }
      } else {
        for (const val of Object.values(v as Record<string, unknown>)) collect(val, target)
      }
    }
    if (!isNaN(slot)) {
      const bucket: RawPlayer[] = []
      collect(section, bucket)
      if (bucket.length) slots.push([slot, bucket])
    } else {
      collect(section, extra)
    }
  }

  slots.sort((a, b) => a[0] - b[0])
  return [...slots.flatMap(([, ps]) => ps), ...extra]
}
