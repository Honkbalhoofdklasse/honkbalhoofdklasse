import { supabase } from '@/shared/supabase/legacy'
import type { Article } from '../domain/types'

export async function getArticles() {
  const { data } = await supabase
    .from('news_articles')
    .select('id,title,slug,excerpt,cover_image_url,author,published_at,tags')
    .order('published_at', { ascending: false })
    .limit(50)
  return (data ?? []) as Article[]
}

export async function getArticle(slug: string) {
  const { data } = await supabase.from('news_articles').select('*').eq('slug', slug).maybeSingle()
  return data
}
