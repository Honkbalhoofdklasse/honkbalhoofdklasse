import { afterEach, describe, expect, it } from 'vitest'
import { requireCronSecret } from './requireCronSecret'

const request = (authorization?: string) =>
  new Request('http://localhost/api/sync', {
    headers: authorization ? { Authorization: authorization } : {},
  })

describe('requireCronSecret', () => {
  afterEach(() => {
    delete process.env.CRON_SECRET
  })

  it('rejects when CRON_SECRET is unset, even without a header', () => {
    expect(requireCronSecret(request())?.status).toBe(401)
  })

  it('rejects a wrong bearer token', () => {
    process.env.CRON_SECRET = 's3cret'
    expect(requireCronSecret(request('Bearer nope'))?.status).toBe(401)
  })

  it('allows the matching bearer token', () => {
    process.env.CRON_SECRET = 's3cret'
    expect(requireCronSecret(request('Bearer s3cret'))).toBeNull()
  })
})
