export type Article = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  cover_image_url: string | null
  author: string | null
  published_at: string
  tags: string[] | null
}
