export type HLPlayer = {
  name: string
  teamId: string
  avg: number // e.g. 0.312
  hr: number
  rbi: number
  ops: number
  sb: number
}

export type StatKey = 'avg' | 'hr' | 'rbi' | 'ops' | 'sb'

export type Phase = 'loading' | 'playing' | 'reveal' | 'gameover'
