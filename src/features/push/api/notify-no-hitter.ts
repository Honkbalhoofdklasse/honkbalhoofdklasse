import { BASE } from '../domain/teams'
import { ipToDecimal, pick } from '../domain/format'
import type { LiveGameContext } from '../domain/types'
import { sendToTeams } from './send-to-teams'

export async function notifyNoHitters(ctx: LiveGameContext) {
  const { gameId, gameData, boxScore, prevState, newState, homeTeamId, awayTeamId, teams } = ctx
  const { homeName, awayName, gameUrl } = ctx
  if (prevState.notifiedStart) {
    const homeHits = Number(gameData.homehits ?? -1)
    const awayHits = Number(gameData.awayhits ?? -1)

    const homePitcherSpot = (
      boxScore[String(gameData.homeid)] as Record<string, unknown[]> | undefined
    )?.['90']
    const homePitcher = Array.isArray(homePitcherSpot)
      ? (homePitcherSpot[0] as Record<string, unknown>)
      : null
    const homePitcherIP = homePitcher ? ipToDecimal(homePitcher.pitch_ip) : 0

    if (awayHits >= 0 && awayHits === 0 && homePitcherIP >= 6 && !newState.noHitterHome) {
      const pitcherName = homePitcher
        ? `${String(homePitcher.firstname ?? '')} ${
            String(homePitcher.lastname ?? '').charAt(0) +
            String(homePitcher.lastname ?? '')
              .slice(1)
              .toLowerCase()
          }`.trim()
        : homeName + ' pitcher'
      const inningsStr = Math.floor(homePitcherIP)
      const noHitterBody = pick([
        `${pitcherName} throwing a no-hitter. ${awayName} 0 hits through ${inningsStr} innings.`,
        `Watch out! ${pitcherName} has no-hit ${awayName} through ${inningsStr}.`,
        `🚫 ${pitcherName} and ${homeName} in no-hit territory. ${inningsStr} innings, 0 hits for ${awayName}.`,
      ])
      await sendToTeams(
        teams,
        {
          title: `${awayName} @ ${homeName}`,
          body: noHitterBody,
          icon: `${BASE}/api/notification-icon/${homeTeamId}`,
          url: gameUrl,
          tag: `nohitter-home-${gameId}`,
        },
        ctx.subscriptions,
      )
      newState.noHitterHome = true
      ctx.notifications.push(`no-hitter:${homeName}`)
    }

    const awayPitcherSpot = (
      boxScore[String(gameData.awayid)] as Record<string, unknown[]> | undefined
    )?.['90']
    const awayPitcher = Array.isArray(awayPitcherSpot)
      ? (awayPitcherSpot[0] as Record<string, unknown>)
      : null
    const awayPitcherIP = awayPitcher ? ipToDecimal(awayPitcher.pitch_ip) : 0

    if (homeHits >= 0 && homeHits === 0 && awayPitcherIP >= 6 && !newState.noHitterAway) {
      const pitcherName = awayPitcher
        ? `${String(awayPitcher.firstname ?? '')} ${
            String(awayPitcher.lastname ?? '').charAt(0) +
            String(awayPitcher.lastname ?? '')
              .slice(1)
              .toLowerCase()
          }`.trim()
        : awayName + ' pitcher'
      const inningsStr = Math.floor(awayPitcherIP)
      const noHitterBody = pick([
        `${pitcherName} throwing a no-hitter. ${homeName} 0 hits through ${inningsStr} innings.`,
        `Watch out! ${pitcherName} has no-hit ${homeName} through ${inningsStr}.`,
        `🚫 ${pitcherName} and ${awayName} in no-hit territory. ${inningsStr} innings, 0 hits for ${homeName}.`,
      ])
      await sendToTeams(
        teams,
        {
          title: `${awayName} @ ${homeName}`,
          body: noHitterBody,
          icon: `${BASE}/api/notification-icon/${awayTeamId}`,
          url: gameUrl,
          tag: `nohitter-away-${gameId}`,
        },
        ctx.subscriptions,
      )
      newState.noHitterAway = true
      ctx.notifications.push(`no-hitter:${awayName}`)
    }
  }
}
