import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(url, key)

export const supabaseAdmin = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY ?? key)

export type { GameRow as Game } from '@/shared/types/game'
export type { StandingRow as Standing } from '@/shared/types/standing'
