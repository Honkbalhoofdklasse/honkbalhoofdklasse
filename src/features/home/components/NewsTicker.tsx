import type { NewsItem } from '@/features/home/api/getHomeData'

export function NewsTicker({ news }: { news: NewsItem[] }) {
  return (
    <div className="bg-[var(--accent)] flex items-stretch overflow-hidden">
      <div className="shrink-0 bg-black/20 px-4 flex items-center">
        <a
          href="https://honkbalsoftbal.nl/?cat=544"
          target="_blank"
          rel="noopener noreferrer"
          className="font-display font-800 text-xs text-white uppercase tracking-widest whitespace-nowrap hover:text-white/70 transition-colors"
        >
          News →
        </a>
      </div>
      <div className="overflow-hidden flex-1">
        <div className="flex animate-marquee items-center h-10" style={{ width: 'max-content' }}>
          {[...news, ...news].map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display font-700 text-sm text-white hover:text-white/80 transition-colors whitespace-nowrap px-8"
            >
              {item.title}
              <span className="mx-6 opacity-40">·</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
