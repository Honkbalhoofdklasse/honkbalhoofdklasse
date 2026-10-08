import { NextResponse } from 'next/server'
import { fetchGameBoxscore } from '@/shared/knbsb/scraper'
import { extractBatters, extractPitchers, getTeamPlayers } from '../domain/boxscorePlayers'
import { formatPitcherName, mapTeamFromIoc, mapTeamFromLabel } from '../domain/teamMapping'

export async function GET(_req: Request, { params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params
  try {
    const data = await fetchGameBoxscore(gameId)
    const gd = data.gameData as Record<string, unknown>
    const boxScore = data.boxScore as Record<string, unknown>
    const pitchers = (boxScore as Record<string, unknown>)?.pitchers as
      | Record<string, { fullName: string; era: number }>
      | undefined

    let lastInning = 9
    for (let i = 20; i > 9; i--) {
      if (Number(gd[`runsaway${i}`]) > 0 || Number(gd[`runshome${i}`]) > 0) {
        lastInning = i
        break
      }
    }

    const startInning = Math.max(1, lastInning - 8)
    const displayInnings = Array.from({ length: 9 }, (_, i) => startInning + i)

    const homeBattedInnings = Number(gd.innings ?? 9)
    const homeWon = Number(gd.homeruns) > Number(gd.awayruns)

    const awayId =
      mapTeamFromIoc(String(gd.awayioc ?? '')) ?? mapTeamFromLabel(String(gd.awaylabel ?? ''))
    const homeId =
      mapTeamFromIoc(String(gd.homeioc ?? '')) ?? mapTeamFromLabel(String(gd.homelabel ?? ''))

    const fmtEra = (era: number) => (era / 100).toFixed(2)

    const awayTeamId = gd.awayid
    const homeTeamId = gd.homeid
    const awayPlayers = getTeamPlayers(boxScore, awayTeamId as string)
    const homePlayers = getTeamPlayers(boxScore, homeTeamId as string)

    const gamestatus = Number(gd.gamestatus ?? 0)
    const isLive = gamestatus === 1
    const statusText = String(gd.gamestatustext ?? '')
    const stMatch = statusText.match(/^([TB])(\d+)$/)
    const currentInning = stMatch ? parseInt(stMatch[2]) : 0
    const isBottom = stMatch ? stMatch[1] === 'B' : false

    const showAwayUpTo = isLive && currentInning > 0 ? currentInning : 99
    const showHomeUpTo =
      isLive && currentInning > 0 ? (isBottom ? currentInning : currentInning - 1) : 99

    const awayInnings = displayInnings.map((i) => {
      if (i > showAwayUpTo) return null
      const v = gd[`runsaway${i}`]
      return v !== null && v !== undefined ? Number(v) : null
    })
    const homeInnings = displayInnings.map((i) => {
      if (i > showHomeUpTo) return null
      if (!isLive && homeWon && i > homeBattedInnings && i <= 9) return 'X'
      const v = gd[`runshome${i}`]
      return v !== null && v !== undefined ? Number(v) : null
    })

    function fmtPerson(raw: string): string | null {
      if (!raw) return null
      const parts = raw.trim().split(/\s+/)
      if (parts.length < 2) return raw
      const last = parts[0].charAt(0) + parts[0].slice(1).toLowerCase()
      const first = parts.slice(1).join(' ')
      return `${first} ${last}`
    }

    const situation = isLive
      ? {
          inning: currentInning,
          isBottom,
          outs: Number(gd.outs ?? 0),
          balls: Number(gd.balls ?? 0),
          strikes: Number(gd.strikes ?? 0),
          runner1: Number(gd.runner1 ?? 0) > 0,
          runner2: Number(gd.runner2 ?? 0) > 0,
          runner3: Number(gd.runner3 ?? 0) > 0,
          currentBatter: fmtPerson(String(gd.gamestatusbatter ?? '')),
          currentPitcher: fmtPerson(String(gd.gamestatuspitcher ?? '')),
        }
      : null

    return NextResponse.json({
      isLive,
      displayInnings,
      startInning,
      awayId,
      homeId,
      awayInnings,
      homeInnings,
      awayTotals: { r: Number(gd.awayruns), h: Number(gd.awayhits), e: Number(gd.awayerrors) },
      homeTotals: { r: Number(gd.homeruns), h: Number(gd.homehits), e: Number(gd.homeerrors) },
      winPitcher: pitchers?.win
        ? { name: formatPitcherName(pitchers.win.fullName), era: fmtEra(pitchers.win.era) }
        : null,
      lossPitcher: pitchers?.loss
        ? { name: formatPitcherName(pitchers.loss.fullName), era: fmtEra(pitchers.loss.era) }
        : null,
      savePitcher: pitchers?.save
        ? {
            name: formatPitcherName((pitchers.save as unknown as { fullName: string }).fullName),
            era: fmtEra((pitchers.save as unknown as { era: number }).era),
          }
        : null,
      awayBatters: extractBatters(awayPlayers),
      homeBatters: extractBatters(homePlayers),
      awayPitchers: extractPitchers(awayPlayers),
      homePitchers: extractPitchers(homePlayers),
      situation,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch boxscore' }, { status: 500 })
  }
}
