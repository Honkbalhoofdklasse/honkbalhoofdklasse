import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { clientIp, isRateLimited } from '@/shared/http/rateLimitByIp'
import { supabaseAdmin } from '@/shared/supabase/legacy'
import { type PartnerContact, partnerContactSchema } from '../domain/partnerContactSchema'
import { confirmationEmailHtml, notifyEmailHtml, telegramText } from './partnerMessages'

const NOTIFY_EMAIL = 'hoofdklasseinsta@gmail.com'
const TG_CHAT = process.env.PARTNER_TELEGRAM_CHAT_ID ?? '-1003763285383'
const RATE_LIMIT_WINDOW_MS = 10 * 60_000

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  if (!token) return
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: TG_CHAT, text, parse_mode: 'HTML' }),
  })
}

async function sendEmails(lead: PartnerContact) {
  if (!process.env.RESEND_API_KEY) return
  const resend = new Resend(process.env.RESEND_API_KEY)
  await Promise.all([
    resend.emails.send({
      from: 'Honkbal Hoofdklasse <noreply@honkbalhoofdklasse.com>',
      to: lead.email,
      subject: `Bedankt ${lead.name} — we nemen snel contact op`,
      html: confirmationEmailHtml(lead),
    }),
    resend.emails.send({
      from: 'Partner Form <noreply@honkbalhoofdklasse.com>',
      to: NOTIFY_EMAIL,
      subject: `Nieuwe partner-aanvraag: ${lead.company}`,
      html: notifyEmailHtml(lead),
    }),
  ])
}

export async function POST(req: NextRequest) {
  if (isRateLimited(clientIp(req), RATE_LIMIT_WINDOW_MS)) {
    return NextResponse.json({ ok: false, error: 'Too many requests' }, { status: 429 })
  }

  const parsed = partnerContactSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 })
  }
  const lead = parsed.data

  const { error: dbErr } = await supabaseAdmin.from('partner_leads').insert({
    company: lead.company,
    name: lead.name,
    email: lead.email,
    phone: lead.phone ?? null,
    message: lead.message ?? null,
  })
  if (dbErr) {
    console.error('[partner-contact] db', dbErr)
    return NextResponse.json({ ok: false, error: 'Could not send' }, { status: 500 })
  }

  const results = await Promise.allSettled([sendEmails(lead), sendTelegram(telegramText(lead))])
  for (const result of results) {
    if (result.status === 'rejected') console.error('[partner-contact]', result.reason)
  }

  return NextResponse.json({ ok: true })
}
