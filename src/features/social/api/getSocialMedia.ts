import { supabase } from '@/shared/supabase/legacy'

export type MediaItem = {
  id: number
  type: string
  title: string | null
  url: string
  thumbnail_url: string | null
  published_at: string
}

export async function getMedia() {
  const { data } = await supabase
    .from('media')
    .select('id, type, title, url, thumbnail_url, published_at')
    .order('published_at', { ascending: false })
    .limit(24)
  return (data ?? []) as MediaItem[]
}
