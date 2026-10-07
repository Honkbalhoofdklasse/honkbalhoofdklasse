import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/shared/supabase/legacy'
import { sendGameNotification } from '@/shared/email/email'

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  if (secret) {
    const auth = req.headers.get('Authorization')
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const now = new Date()
  const dow = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' })).getDay()
  const dateKey = now.toISOString().split('T')[0]

  const isPickleDay = dow === 4 || dow === 6
  const isImmaculateDay = dow === 5

  if (!isPickleDay && !isImmaculateDay) {
    return NextResponse.json({ ok: true, skipped: 'not a game day' })
  }

  const { data: subscribers } = await supabaseAdmin.from('subscribers').select('email, token')

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json({ ok: true, skipped: 'no subscribers' })
  }

  const results: string[] = []

  async function notify(type: 'pickle' | 'immaculate') {
    const { data: existing } = await supabaseAdmin
      .from('notification_log')
      .select('id')
      .eq('type', type)
      .eq('date_key', dateKey)
      .maybeSingle()

    if (existing) {
      results.push(`${type}: already sent`)
      return
    }

    const { error: logErr } = await supabaseAdmin
      .from('notification_log')
      .insert({ type, date_key: dateKey })
    if (logErr && logErr.code !== '23505') {
      results.push(`${type}: log insert failed — skipping`)
      return
    }
    if (logErr?.code === '23505') {
      results.push(`${type}: already sent`)
      return
    }

    await sendGameNotification(subscribers as { email: string; token: string }[], type)
    results.push(`${type}: sent to ${subscribers!.length}`)
  }

  if (isPickleDay) await notify('pickle')
  if (isImmaculateDay) await notify('immaculate')

  return NextResponse.json({ ok: true, results })
}
