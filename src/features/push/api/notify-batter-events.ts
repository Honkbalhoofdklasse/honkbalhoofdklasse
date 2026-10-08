import { BASE } from '../domain/teams'
import { ordinal, pick } from '../domain/format'
import type { LiveGameContext } from '../domain/types'
import { sendToTeams } from './send-to-teams'

export async function notifyHomeRuns(ctx: LiveGameContext) {
  const { gameId, gameData, boxScore, prevState, newState, homeTeamId, awayTeamId, teams } = ctx
  const { homeName, awayName, gameUrl } = ctx
  for (const [, teamPlayers] of Object.entries(boxScore)) {
    if (typeof teamPlayers !== 'object') continue
    for (const [, spots] of Object.entries(teamPlayers as Record<string, unknown>)) {
      const arr = spots as Array<Record<string, unknown>>
      if (!Array.isArray(arr) || !arr[0]) continue
      const player = arr[0]
      const pid = String(player.playerid ?? player.id ?? '')
      const currentHR = Number(player.hr ?? 0)
      const prevHR = prevState.playerHR[pid] ?? 0

      if (currentHR > prevHR) {
        const firstName = String(player.firstname ?? '')
        const lastName = String(player.lastname ?? '')
        const name = `${firstName} ${lastName.charAt(0) + lastName.slice(1).toLowerCase()}`.trim()
        const rbi = Number(player.rbi ?? 0)
        const rbiStr = rbi > 1 ? `${rbi}-run` : 'solo'
        const inning = gameData.innings ?? '?'
        const score = `${awayName} ${gameData.awayruns ?? 0} – ${homeName} ${gameData.homeruns ?? 0}`
        const isHomePlayer =
          Number(player.home) === 1 || Number(player.teamid) === Number(gameData.homeid)
        const playerTeam = isHomePlayer ? homeTeamId : awayTeamId

        const hrBody = pick([
          `${name} hits a ${rbiStr} home run. ${score}`,
          `Home run by ${name}. ${rbiStr.charAt(0).toUpperCase() + rbiStr.slice(1)}. ${score}`,
          `🔥 ${name} with a ${rbiStr} home run. ${score}`,
        ])
        await sendToTeams(
          teams,
          {
            title: `${awayName} @ ${homeName} — ${ordinal(Number(inning))} inning`,
            body: hrBody,
            icon: `${BASE}/api/notification-icon/${playerTeam}`,
            url: gameUrl,
            tag: `hr-${gameId}-${pid}-${currentHR}`,
          },
          ctx.subscriptions,
        )
        newState.playerHR[pid] = currentHR
        ctx.notifications.push(`hr:${name}`)
      } else {
        newState.playerHR[pid] = currentHR
      }
    }
  }
}

export async function notifyFourHits(ctx: LiveGameContext) {
  const { gameId, gameData, boxScore, prevState, newState, homeTeamId, awayTeamId, teams } = ctx
  const { homeName, awayName, gameUrl } = ctx
  for (const [, teamPlayers] of Object.entries(boxScore)) {
    if (typeof teamPlayers !== 'object') continue
    for (const [, spots] of Object.entries(teamPlayers as Record<string, unknown>)) {
      const arr = spots as Array<Record<string, unknown>>
      if (!Array.isArray(arr) || !arr[0]) continue
      const player = arr[0]
      const pid = String(player.playerid ?? player.id ?? '')
      const currentH = Number(player.h ?? 0)
      const prevH = prevState.playerHR[`h_${pid}`] ?? 0

      if (currentH >= 4 && prevH < 4) {
        const firstName = String(player.firstname ?? '')
        const lastName = String(player.lastname ?? '')
        const name = `${firstName} ${lastName.charAt(0) + lastName.slice(1).toLowerCase()}`.trim()
        const isHomePlayer =
          Number(player.home) === 1 || Number(player.teamid) === Number(gameData.homeid)
        const playerTeam = isHomePlayer ? homeTeamId : awayTeamId
        const inning = gameData.innings ?? '?'
        const score = `${awayName} ${gameData.awayruns ?? 0} – ${homeName} ${gameData.homeruns ?? 0}`
        const hitsBody = pick([
          `${name} now has 4 hits. ${score}`,
          `Hot bat alert: ${name} with 4 hits. ${score}`,
          `🔥 ${name} is on fire — 4 hits. ${score}`,
        ])
        await sendToTeams(
          teams,
          {
            title: `${awayName} @ ${homeName} — ${ordinal(Number(inning))} inning`,
            body: hitsBody,
            icon: `${BASE}/api/notification-icon/${playerTeam}`,
            url: gameUrl,
            tag: `4hits-${gameId}-${pid}`,
          },
          ctx.subscriptions,
        )
        ctx.notifications.push(`4hits:${name}`)
      }
      if (currentH > 0) newState.playerHR[`h_${pid}`] = currentH
    }
  }
}
