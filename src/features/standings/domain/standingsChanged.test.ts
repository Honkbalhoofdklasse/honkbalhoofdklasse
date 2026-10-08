import { describe, expect, it } from 'vitest'
import { standingsChanged } from './standingsChanged'

const record = { wins: 10, losses: 4, ties: 0, games_played: 14, games_behind: 1.5 }

describe('standingsChanged', () => {
  it('is false when every field matches', () => {
    expect(standingsChanged({ ...record }, record)).toBe(false)
  })

  it('is true when wins differ', () => {
    expect(standingsChanged({ ...record, wins: 11 }, record)).toBe(true)
  })

  it('is true when games behind differ', () => {
    expect(standingsChanged({ ...record, games_behind: 2 }, record)).toBe(true)
  })

  it('is true when there is no current row', () => {
    expect(standingsChanged(undefined, record)).toBe(true)
  })
})
