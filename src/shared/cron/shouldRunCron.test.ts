import { describe, expect, it } from 'vitest'
import { shouldRunCron } from './shouldRunCron'

const now = Date.parse('2026-06-13T17:00:00Z')
const minutes = (n: number) => n * 60_000

describe('shouldRunCron', () => {
  it('runs when a game is live', () => {
    expect(shouldRunCron([{ status: 'live', startUtcMs: now - minutes(60) }], now)).toBe(true)
  })

  it('runs when a game starts within 30 minutes', () => {
    expect(shouldRunCron([{ status: 'scheduled', startUtcMs: now + minutes(10) }], now)).toBe(true)
  })

  it('runs when a scheduled game should already have started', () => {
    expect(shouldRunCron([{ status: 'scheduled', startUtcMs: now - minutes(45) }], now)).toBe(true)
  })

  it('skips when the next game is 2 hours away', () => {
    expect(shouldRunCron([{ status: 'scheduled', startUtcMs: now + minutes(120) }], now)).toBe(
      false,
    )
  })

  it('skips a scheduled game that never flipped, a day later', () => {
    expect(shouldRunCron([{ status: 'scheduled', startUtcMs: now - minutes(1440) }], now)).toBe(
      false,
    )
  })

  it('skips with no games or only finals', () => {
    expect(shouldRunCron([], now)).toBe(false)
    expect(shouldRunCron([{ status: 'final', startUtcMs: now - minutes(5) }], now)).toBe(false)
  })
})
