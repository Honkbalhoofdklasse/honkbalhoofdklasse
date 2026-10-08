export type HLPlayer = {
  name: string
  teamId: string
  avg: number
  hr: number
  rbi: number
  ops: number
  sb: number
}

export type StatKey = 'avg' | 'hr' | 'rbi' | 'ops' | 'sb'

export type Phase = 'loading' | 'playing' | 'reveal' | 'gameover'
