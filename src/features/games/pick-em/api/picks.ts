import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/shared/supabase/legacy'
import { pickSchema } from '../domain/pickSchema'

const invalidRequest = () => NextResponse.json({ error: 'Invalid request' }, { status: 400 })

export async function GET(req: NextRequest) {
  const userToken = req.nextUrl.searchParams.get('token')

  const { data: games, error } = await supabaseAdmin
    .from('games')
    .select('id, game_date, game_time, home_team_id, away_team_id, status, home_score, away_score')
    .eq('season', 2026)
    .order('game_date', { ascending: true })
    .order('game_time', { ascending: true })

  if (error) {
    console.error('[pick-em]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  let picks: { game_id: number; picked_team_id: string }[] = []
  if (userToken) {
    const { data } = await supabaseAdmin
      .from('pickem_picks')
      .select('game_id, picked_team_id')
      .eq('user_token', userToken)
    picks = data ?? []
  }

  return NextResponse.json({ games: games ?? [], picks })
}

export async function POST(req: NextRequest) {
  const parsed = pickSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) return invalidRequest()
  const { userToken, nickname, gameId, pickedTeamId } = parsed.data

  const { data: game } = await supabaseAdmin
    .from('games')
    .select('game_date, game_time, status, home_team_id, away_team_id')
    .eq('id', gameId)
    .single()

  if (!game) return NextResponse.json({ error: 'Game not found' }, { status: 404 })

  if (pickedTeamId !== game.home_team_id && pickedTeamId !== game.away_team_id) {
    return invalidRequest()
  }

  if (game.status !== 'scheduled') {
    return NextResponse.json({ error: 'Game already started' }, { status: 400 })
  }

  const lockTime = new Date(`${game.game_date}T${game.game_time ?? '23:59:00'}`)
  if (new Date() >= lockTime) {
    return NextResponse.json({ error: 'Picks are locked' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('pickem_picks')
    .upsert(
      { user_token: userToken, nickname, game_id: gameId, picked_team_id: pickedTeamId },
      { onConflict: 'user_token,game_id' },
    )

  if (error) {
    console.error('[pick-em]', error)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
  return NextResponse.json({ ok: true })
}
