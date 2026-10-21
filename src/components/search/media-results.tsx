import { useMemo, useState } from 'react'
import { Play, Star } from 'lucide-react'

import {
  getNewsResults,
  getShoppingResults,
  getVideoResults,
  type NewsResult,
} from '@/lib/fixtures'
import { imgCdn } from '@/lib/nex-store'
import { cn } from '@/lib/utils'

const delay = (ms: number) => ({ '--nx-delay': `${ms}ms` }) as React.CSSProperties

export function VideoResults({ q }: { q: string }) {
  const videos = useMemo(() => getVideoResults(q), [q])
  return (
    <div className="grid gap-x-3 gap-y-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {videos.map((v, i) => (
        <a
          key={v.id}
          href={v.url}
          target="_blank"
          rel="noreferrer"
          className="nx-turnstile group block"
          style={delay(i * 45)}
        >
          <div className="nx-tile aspect-video bg-white/5">
            <img src={imgCdn(v.thumb, 480)} alt="" loading="lazy" className="size-full object-cover" />
            <span className="absolute inset-0 grid place-items-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="grid size-14 place-items-center bg-primary">
                <Play className="size-7 fill-white" />
              </span>
            </span>
            <span className="absolute right-1.5 bottom-1.5 bg-black/80 px-1.5 py-0.5 text-xs">{v.duration}</span>
          </div>
          <h3 className="mt-2 line-clamp-2 leading-snug group-hover:underline">{v.title}</h3>
          <p className="text-xs text-muted-foreground">
            {v.channel} · {v.views} vues · {v.platform} · via {v.engine}
          </p>
        </a>
      ))}
    </div>
  )
}

const FEEDS = ['Tout', 'Google News', 'MSN'] as const

export function NewsResults({ q }: { q: string }) {
  const all = useMemo(() => getNewsResults(q), [q])
  const [feed, setFeed] = useState<(typeof FEEDS)[number]>('Tout')
  const news = feed === 'Tout' ? all : all.filter((n) => n.feed === feed)
  const [hero, ...rest] = news

  return (
    <div className="max-w-5xl">
      <div className="mb-5 flex gap-1" role="group" aria-label="Source des actualités">
        {FEEDS.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={feed === f}
            onClick={() => setFeed(f)}
            className={cn('px-3 py-1.5 text-sm', feed === f ? 'bg-primary' : 'bg-white/10 hover:bg-white/20')}
          >
            {f}
          </button>
        ))}
      </div>
      {hero && <NewsHero n={hero} key={`${feed}-hero`} />}
      <div key={feed} className="mt-3 grid gap-3 md:grid-cols-2">
        {rest.map((n, i) => (
          <a
            key={n.id}
            href={n.url}
            target="_blank"
            rel="noreferrer"
            className="nx-slide-in flex gap-3 bg-white/[0.06] p-3 transition-colors hover:bg-white/[0.12]"
            style={delay(i * 50)}
          >
            {n.image && (
              <img src={imgCdn(n.image, 240)} alt="" loading="lazy" className="size-20 shrink-0 object-cover" />
            )}
            <div className="min-w-0">
              <NewsMeta n={n} />
              <h3 className="leading-snug">{n.title}</h3>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

function NewsMeta({ n }: { n: NewsResult }) {
  return (
    <p className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
      <span className={cn('px-1.5 py-0.5 text-white', n.feed === 'MSN' ? 'bg-[#0078d4]' : 'bg-[#4285f4]')}>
        {n.feed}
      </span>
      {n.outlet} · {n.ago}
    </p>
  )
}

function NewsHero({ n }: { n: NewsResult }) {
  return (
    <a
      href={n.url}
      target="_blank"
      rel="noreferrer"
      className="nx-tile nx-turnstile block h-64 bg-primary sm:h-80"
    >
      {n.image && (
        <img src={imgCdn(n.image, 1100)} alt="" className="absolute inset-0 size-full object-cover" />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-5 pt-20">
        <NewsMeta n={n} />
        <h3 className="metro-light text-2xl leading-tight sm:text-4xl">{n.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/85">{n.summary}</p>
      </div>
    </a>
  )
}

export function ShoppingResults({ q }: { q: string }) {
  const items = useMemo(() => getShoppingResults(q), [q])
  return (
    <div>
      <p className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        Offres proposées par <span className="bg-[#232f3e] px-2 py-0.5 font-semibold text-[#ff9900]">amazon.fr</span>
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((p, i) => (
          <a
            key={p.id}
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="nx-turnstile group flex flex-col bg-white text-black"
            style={delay(i * 40)}
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={imgCdn(p.image, 400)}
                alt=""
                loading="lazy"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-3">
              <h3 className="line-clamp-2 text-sm leading-snug group-hover:underline">{p.title}</h3>
              <div className="mt-1 flex items-center gap-1 text-xs" aria-label={`Note ${p.rating} sur 5`}>
                {Array.from({ length: 5 }, (_, s) => (
                  <Star
                    key={s}
                    className={cn('size-3.5', s < Math.round(p.rating) ? 'fill-[#ff9900] text-[#ff9900]' : 'text-neutral-300')}
                  />
                ))}
                <span className="text-neutral-500">({p.reviews.toLocaleString('fr-FR')})</span>
              </div>
              <div className="mt-auto pt-2">
                <span className="text-lg font-semibold">{p.price}</span>
                {p.oldPrice && <span className="ml-2 text-xs text-neutral-500 line-through">{p.oldPrice}</span>}
                {p.prime && <span className="ml-2 text-xs font-bold text-[#00a8e1]">prime</span>}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
