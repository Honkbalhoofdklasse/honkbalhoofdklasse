import { NextResponse } from 'next/server'
import { getHollandSeries } from '@/features/postseason/api/holland-series'

export async function GET() {
  const data = await getHollandSeries()
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=15, stale-while-revalidate=30' },
  })
}
