import { describe, expect, it } from 'vitest'
import { pickSchema } from './pickSchema'

const valid = {
  gameId: 12,
  pickedTeamId: 'neptunus',
  nickname: 'Alex',
  userToken: '0f6b5c2a-1d3e-4a5b-9c7d-8e9f0a1b2c3d',
}

describe('pickSchema', () => {
  it('accepts a valid body', () => {
    expect(pickSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects a non-integer or negative gameId', () => {
    expect(pickSchema.safeParse({ ...valid, gameId: -1 }).success).toBe(false)
    expect(pickSchema.safeParse({ ...valid, gameId: '12' }).success).toBe(false)
  })

  it('rejects a short userToken and a long nickname', () => {
    expect(pickSchema.safeParse({ ...valid, userToken: 'short' }).success).toBe(false)
    expect(pickSchema.safeParse({ ...valid, nickname: 'x'.repeat(31) }).success).toBe(false)
  })

  it('rejects missing fields', () => {
    expect(pickSchema.safeParse({}).success).toBe(false)
  })
})
