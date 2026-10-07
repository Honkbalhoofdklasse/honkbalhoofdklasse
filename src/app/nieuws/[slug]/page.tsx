import { ArticleScreen } from '@/features/news/screens/ArticleScreen'

export const revalidate = 300

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  return <ArticleScreen params={params} />
}
