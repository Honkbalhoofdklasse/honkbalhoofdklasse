import { BASE } from '../domain/teams'
import { ordinal, pick } from '../domain/format'
import type { LiveGameContext } from '../domain/types'
import { sendToTeams } from './send-to-teams'

export async function notifyGameStart(ctx: LiveGameContext) {
  const { game, gameId, gameData, prevState, newState, homeName, awayName, teams, gameUrl, icon } =
    ctx
  if (!prevState.notifiedStart && gameData.gamestatus === 1) {
    const startTime = game.start ? game.start.slice(11, 16) : ''
    const startBody = startTime
      ? pick([
          `First pitch at ${startTime}. Follow along live.`,
          `Game on at ${startTime}. Let's go!`,
          `⚾ Starting at ${startTime}.`,
        ])
      : pick([`Game is live.`, `Ball game underway.`, `Play ball!`])
    await sendToTeams(teams, {
      title: `${awayName} @ ${homeName}`,
      body: startBody,
      icon,
      url: gameUrl,
      tag: `game-start-${gameId}`,
    })
    newState.notifiedStart = true
    ctx.notifications.push(`start:${gameId}`)
  }
}

export async function notifyInningScores(ctx: LiveGameContext) {
  const { gameId, gameData, prevState, newState, homeTeamId, awayTeamId, teams, gameUrl } = ctx
  const { homeName, awayName } = ctx
  for (let i = 1; i <= 15; i++) {
    const cur = newState.innings[i]
    const prev = prevState.innings[i]
    if (!cur) continue

    if (cur.home > (prev?.home ?? 0) && prevState.notifiedStart) {
      const runs = cur.home - (prev?.home ?? 0)
      const score = `${awayName} ${gameData.awayruns} – ${homeName} ${gameData.homeruns}`
      const runText = runs === 1 ? '1 run' : `${runs} runs`
      const scoreBody = pick([
        `${homeName} score${runs > 1 ? 's' : 's'} ${runText}. ${score}`,
        `${runText} for ${homeName}. ${score}`,
        `⚾ ${homeName} adds ${runText}. ${score}`,
      ])
      await sendToTeams(teams, {
        title: `${awayName} @ ${homeName} — ${ordinal(i)} inning`,
        body: scoreBody,
        icon: `${BASE}/api/notification-icon/${homeTeamId}`,
        url: gameUrl,
        tag: `score-home-${gameId}-${i}-${cur.home}`,
      })
      ctx.notifications.push(`score-home:${i}`)
    }

    if (cur.away > (prev?.away ?? 0) && prevState.notifiedStart) {
      const runs = cur.away - (prev?.away ?? 0)
      const score = `${awayName} ${gameData.awayruns} – ${homeName} ${gameData.homeruns}`
      const runText = runs === 1 ? '1 run' : `${runs} runs`
      const scoreBody = pick([
        `${awayName} score${runs > 1 ? 's' : 's'} ${runText}. ${score}`,
        `${runText} for ${awayName}. ${score}`,
        `⚾ ${awayName} adds ${runText}. ${score}`,
      ])
      await sendToTeams(teams, {
        title: `${awayName} @ ${homeName} — ${ordinal(i)} inning`,
        body: scoreBody,
        icon: `${BASE}/api/notification-icon/${awayTeamId}`,
        url: gameUrl,
        tag: `score-away-${gameId}-${i}-${cur.away}`,
      })
      ctx.notifications.push(`score-away:${i}`)
    }
  }
}

export async function notifyFinal(ctx: LiveGameContext) {
  const { gameId, gameData, prevState, newState, homeName, awayName, teams, gameUrl, icon } = ctx
  if (gameData.gamestatus === 2 && !prevState.notifiedFinal && prevState.notifiedStart) {
    const winner = (gameData.homeruns ?? 0) > (gameData.awayruns ?? 0) ? homeName : awayName
    const loser = winner === homeName ? awayName : homeName
    const winScore = Math.max(gameData.homeruns ?? 0, gameData.awayruns ?? 0)
    const loseScore = Math.min(gameData.homeruns ?? 0, gameData.awayruns ?? 0)
    const wpName = gameData.win ? (String(gameData.win).split(' ').pop() ?? '') : ''
    const body = wpName
      ? `${winner} beat ${loser}, ${winScore}–${loseScore}. WP: ${wpName}`
      : `Final: ${winner} ${winScore}, ${loser} ${loseScore}`

    await sendToTeams(teams, {
      title: `Final: ${awayName} @ ${homeName}`,
      body,
      icon,
      url: gameUrl,
      tag: `final-${gameId}`,
    })
    newState.notifiedFinal = true
    ctx.notifications.push(`final:${gameId}`)
  }
}
