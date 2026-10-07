import type { GameState, LiveGameData } from './types'

export function initialGameState(): GameState {
  return {
    status: 0,
    homeruns: 0,
    awayruns: 0,
    innings: {},
    playerHR: {},
    notifiedStart: false,
    notifiedFinal: false,
    noHitterHome: false,
    noHitterAway: false,
  }
}

export function buildNewState(prevState: GameState, gameData: LiveGameData): GameState {
  const newState: GameState = {
    status: gameData.gamestatus,
    homeruns: gameData.homeruns ?? 0,
    awayruns: gameData.awayruns ?? 0,
    innings: {},
    playerHR: { ...prevState.playerHR },
    notifiedStart: prevState.notifiedStart,
    notifiedFinal: prevState.notifiedFinal,
    noHitterHome: prevState.noHitterHome ?? false,
    noHitterAway: prevState.noHitterAway ?? false,
  }

  for (let i = 1; i <= 15; i++) {
    const h = gameData[`runshome${i}`] ?? 0
    const a = gameData[`runsaway${i}`] ?? 0
    if (h !== null || a !== null) newState.innings[i] = { home: h ?? 0, away: a ?? 0 }
  }

  return newState
}
