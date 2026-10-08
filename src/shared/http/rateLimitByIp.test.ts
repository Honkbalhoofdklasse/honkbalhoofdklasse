import { describe, expect, it } from 'vitest'
import { isRateLimited } from './rateLimitByIp'

describe('isRateLimited', () => {
  it('allows the first request and blocks a second inside the window', () => {
    expect(isRateLimited('1.1.1.1', 1000, 0)).toBe(false)
    expect(isRateLimited('1.1.1.1', 1000, 500)).toBe(true)
  })

  it('allows again after the window', () => {
    expect(isRateLimited('2.2.2.2', 1000, 0)).toBe(false)
    expect(isRateLimited('2.2.2.2', 1000, 1000)).toBe(false)
  })
})
