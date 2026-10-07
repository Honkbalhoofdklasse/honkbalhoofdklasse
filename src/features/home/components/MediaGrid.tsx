import Image from 'next/image'
import Link from 'next/link'
import type { HomeData } from '@/features/home/api/getHomeData'
import { SectionLabel } from '@/features/home/components/SectionLabel'

export function MediaGrid({ media }: { media: HomeData['media'] }) {
  return (
    <section className="border-t border-[#0f1e2e] py-14 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <SectionLabel>Media</SectionLabel>
          <Link
            href="/media"
            className="font-display font-800 text-xs text-[var(--accent)] uppercase tracking-[0.2em] hover:underline hidden sm:block"
          >
            Alle media →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {media.slice(0, 8).map((item, i) => {
            const isBig = i === 0
            const isVideo =
              item.type === 'video' || item.type === 'clip' || item.type === 'highlight'
            return (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative overflow-hidden bg-[#0a1220] ${isBig ? 'md:col-span-2 md:row-span-2' : ''}`}
                style={{ aspectRatio: isBig ? '16/10' : '1/1' }}
              >
                {(item.thumbnail_url || item.url) && (
                  <Image
                    src={item.thumbnail_url ?? item.url}
                    alt={item.title ?? ''}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 bg-[var(--accent)]/90 flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white ml-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>
                )}
                {item.title && (
                  <p className="absolute bottom-0 left-0 right-0 p-3 font-display font-800 text-xs uppercase text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    {item.title}
                  </p>
                )}
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
