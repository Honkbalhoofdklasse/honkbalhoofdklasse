import { createClient } from '@/shared/supabase/server'
import { supabaseAdmin } from '@/shared/supabase/legacy'

export type AdminUser = {
  email: string
  name: string | null
  can_photos: boolean
  can_analytics: boolean
  can_livestream: boolean
  can_highlights: boolean
  is_super_admin: boolean
  stream_team: string | null
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.email) return null

  const { data } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('email', user.email)
    .single()

  return data ?? null
}
