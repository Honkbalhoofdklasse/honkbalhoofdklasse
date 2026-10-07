import { MAX_GUESSES, YOB_CLOSE } from './constants'
import type { GuessFeedback, PoolPlayer } from './types'

// ── Evaluate ──────────────────────────────────────────────────────────────────

export function evaluate(guess: PoolPlayer, target: PoolPlayer): GuessFeedback {
  const yobDiff = target.yob - guess.yob
  return {
    player: guess,
    team: guess.teamId === target.teamId ? 'correct' : 'wrong',
    pos: guess.pos === target.pos ? 'correct' : 'wrong',
    bats: guess.bt[0] === target.bt[0] ? 'correct' : 'wrong',
    throws: guess.bt.at(-1) === target.bt.at(-1) ? 'correct' : 'wrong',
    yob: guess.yob === target.yob ? 'correct' : Math.abs(yobDiff) <= YOB_CLOSE ? 'close' : 'wrong',
    yobDir: guess.yob === target.yob ? null : yobDiff > 0 ? 'up' : 'down',
  }
}

// ── Share ─────────────────────────────────────────────────────────────────────

export function buildShareText(guesses: GuessFeedback[], won: boolean, dateStr: string): string {
  const row = (fb: GuessFeedback) =>
    [
      fb.team === 'correct' ? '🟩' : '🟥',
      fb.pos === 'correct' ? '🟩' : '🟥',
      fb.bats === 'correct' ? '🟩' : '🟥',
      fb.throws === 'correct' ? '🟩' : '🟥',
      fb.yob === 'correct' ? '🟩' : fb.yob === 'close' ? '🟨' : '🟥',
    ].join('')

  return [
    `Hoofdklasse Pickle — ${dateStr}`,
    won ? `✅ ${guesses.length}/${MAX_GUESSES}` : `❌ ${MAX_GUESSES}/${MAX_GUESSES}`,
    '',
    ...guesses.map(row),
    '',
    'honkbalhoofdklasse.com/pickle',
  ].join('\n')
}
