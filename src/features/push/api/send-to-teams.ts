import { supabaseAdmin } from '@/shared/supabase/legacy'
import webpush from 'web-push'
import type { PushPayload } from '../domain/types'

function getWebPush() {
  webpush.setVapidDetails(
    process.env.VAPID_EMAIL ?? 'mailto:info@honkbalhoofdklasse.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  )
  return webpush
}

export type PushSubscriptionRow = {
  endpoint: string
  p256dh: string
  auth: string
  team_ids: string[] | null
}

export async function loadPushSubscriptions(): Promise<PushSubscriptionRow[]> {
  const { data } = await supabaseAdmin
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth, team_ids')
  return data ?? []
}

export async function sendToTeams(
  teamIds: string[],
  payload: PushPayload,
  subs?: PushSubscriptionRow[],
) {
  const subscriptions = subs ?? (await loadPushSubscriptions())
  if (!subscriptions.length) return

  const targets = subscriptions.filter((s) => {
    if (!s.team_ids || s.team_ids.length === 0) return true
    return s.team_ids.some((t: string) => teamIds.includes(t))
  })

  await Promise.allSettled(
    targets.map(async (sub) => {
      try {
        await getWebPush().sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify({ ...payload, data: { url: payload.url } }),
          { TTL: 3600 },
        )
      } catch (err: unknown) {
        if (
          err &&
          typeof err === 'object' &&
          'statusCode' in err &&
          (err as { statusCode: number }).statusCode === 410
        ) {
          await supabaseAdmin.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
        }
      }
    }),
  )
}
