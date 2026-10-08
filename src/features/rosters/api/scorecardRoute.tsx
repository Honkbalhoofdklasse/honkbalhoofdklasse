import { ImageResponse } from 'next/og'
import { ROSTERS, slugify } from '@/shared/rosters/rosters-data'
import { TEAM_COLORS, TEAM_LOGOS, TEAM_NAMES } from '@/shared/teams/teams'
import { scorecardBackground } from '../components/scorecard/ScorecardBackground'
import { scorecardBottom } from '../components/scorecard/ScorecardBottom'
import { scorecardTop } from '../components/scorecard/ScorecardTop'

const POS_LABELS: Record<string, string> = {
  P: 'Pitcher',
  C: 'Catcher',
  IF: 'Infielder',
  OF: 'Outfielder',
  'C/IF': 'C/IF',
  UTL: 'Utility',
  DH: 'DH',
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ teamId: string; playerSlug: string }> },
) {
  const { teamId, playerSlug } = await params
  const { searchParams } = new URL(request.url)

  const roster = ROSTERS[teamId]
  if (!roster) return new Response('Not found', { status: 404 })
  const player = roster.players.find((p) => slugify(p.name) === playerSlug)
  if (!player) return new Response('Not found', { status: 404 })

  const teamColor = TEAM_COLORS[teamId] ?? '#1e335a'
  const teamLogo = TEAM_LOGOS[teamId]
  const posLabel = POS_LABELS[player.pos] ?? player.pos

  const avg = searchParams.get('avg') ?? '—'
  const hr = searchParams.get('hr') ?? '—'
  const rbi = searchParams.get('rbi') ?? '—'
  const ops = searchParams.get('ops') ?? '—'
  const sb = searchParams.get('sb') ?? '—'

  const opsNum = parseFloat(ops)
  const rating = !isNaN(opsNum) ? Math.min(99, Math.max(40, Math.round(opsNum * 100))) : null

  const statItems = [
    { label: 'AVG', value: avg },
    { label: 'HR', value: hr },
    { label: 'RBI', value: rbi },
    { label: 'OPS', value: ops },
    { label: 'SB', value: sb },
  ]

  let photoUrl: string | null = null
  try {
    const { supabaseAdmin } = await import('@/shared/supabase/legacy')
    const { data } = await supabaseAdmin
      .from('player_photos')
      .select('banner_url, headshot_url')
      .ilike('player_name', player.name)
      .limit(1)
      .maybeSingle()
    photoUrl = data?.banner_url ?? data?.headshot_url ?? null
  } catch {}

  const nameParts = player.name.split(' ')
  const firstName = nameParts.slice(0, -1).join(' ').toUpperCase()
  const lastName = nameParts[nameParts.length - 1].toUpperCase()

  const blob2 = '#fe3d00'

  const W = 630,
    H = 900

  return new ImageResponse(
    <div
      style={{
        width: W,
        height: H,
        position: 'relative',
        display: 'flex',
        fontFamily: 'sans-serif',
        overflow: 'hidden',
        borderRadius: 28,
        background: '#0c1220',
      }}
    >
      {scorecardBackground({ photoUrl, teamColor, teamLogo, blob2 })}
      {scorecardTop({ rating })}
      {scorecardBottom({ teamColor, teamLogo, posLabel, firstName, lastName, statItems })}
    </div>,
    { width: W, height: H },
  )
}
