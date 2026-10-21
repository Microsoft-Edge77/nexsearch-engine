import { useEffect, useState } from 'react'
import { Play, Star } from 'lucide-react'

import { imgCdn } from '@/lib/nex-store'
import { cn } from '@/lib/utils'

type LiveNewsResult = {
  id: string
  title: string
  outlet: string
  feed: 'Google News' | 'MSN'
  ago: string
  summary: string
  url: string
  image?: string
}

type LiveShoppingResult = {
  id: string
  title: string
  price: string
  oldPrice?: string
  rating: number
  reviews: number
  prime: boolean
  image: string
  url: string
}

type LiveVideoResult = {
  id: string
  thumb: string
  title: string
  channel: string
  platform: string
  duration: string
  views: string
  url: string
  engine: string
}

const delay = (ms: number) => ({ '--nx-delay': `${ms}ms` }) as React.CSSProperties

export function VideoResults({ q }: { q: string }) {
  const [videos, setVideos] = useState<LiveVideoResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=videos`)
        if (!res.ok) throw new Error('videos failed')
        const data = await res.json()
        const mapped = ((data.videos ?? []) as any[]).map((v: any, i: number) => ({
          id: `v${i}`,
          thumb: v.thumb ?? '',
          title: v.title ?? `Vidéo ${i + 1}`,
          channel: v.channel ?? 'NexSearch',
          platform: v.platform ?? 'YouTube',
          duration: v.duration ?? '4:20',
          views: v.views ?? '1,2 M',
          url: v.url ?? '#',
          engine: 'Bing',
        }))

        if (!cancelled) setVideos(mapped)
      } catch {
        if (!cancelled) {
          setVideos([])
          setError('Impossible de charger les vidéos.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [q])

  return (
    <>
      {loading && <div className="py-6 text-sm text-muted-foreground">Chargement des vidéos…</div>}
      {!loading && error && <div className="py-6 text-sm text-red-400">{error}</div>}
      {!loading && !error && videos.length === 0 && (
        <div className="py-6 text-sm text-muted-foreground">Aucune vidéo trouvée pour cette recherche.</div>
      )}
      {!loading && !error && (
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
      )}
    </>
  )
}

const FEEDS = ['Tout', 'Google News', 'MSN'] as const

export function NewsResults({ q }: { q: string }) {
  const [all, setAll] = useState<LiveNewsResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [feed, setFeed] = useState<(typeof FEEDS)[number]>('Tout')

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=news`)
        if (!res.ok) throw new Error('news failed')
        const data = await res.json()
        const mapped = ((data.news ?? []) as any[]).map((n: any, i: number) => {
          const source = n.source ?? 'Google News'
          const family = source.toLowerCase().includes('msn') ? 'MSN' : 'Google News'
          const published = n.published ? new Date(n.published) : null
          return {
            id: `n${i}`,
            title: n.title ?? 'Actualité',
            outlet: source,
            feed: family,
            ago: published ? new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(published) : 'récemment',
            summary: n.title ?? '',
            url: n.url ?? '#',
            image: undefined,
          }
        })

        if (!cancelled) setAll(mapped)
      } catch {
        if (!cancelled) {
          setAll([])
          setError('Impossible de charger les actualités.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [q])

  const news = feed === 'Tout' ? all : all.filter((n) => n.feed === feed)
  const [hero, ...rest] = news

  return (
    <div className="max-w-5xl">
      {loading && <div className="py-6 text-sm text-muted-foreground">Chargement des actualités…</div>}
      {!loading && error && <div className="py-6 text-sm text-red-400">{error}</div>}
      {!loading && !error && all.length > 0 && (
        <>
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
        </>
      )}
      {!loading && !error && all.length === 0 && (
        <div className="py-6 text-sm text-muted-foreground">Aucune actualité trouvée pour cette recherche.</div>
      )}
    </div>
  )
}

function NewsMeta({ n }: { n: LiveNewsResult }) {
  return (
    <p className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
      <span className={cn('px-1.5 py-0.5 text-white', n.feed === 'MSN' ? 'bg-[#0078d4]' : 'bg-[#4285f4]')}>
        {n.feed}
      </span>
      {n.outlet} · {n.ago}
    </p>
  )
}

function NewsHero({ n }: { n: LiveNewsResult }) {
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
  const [items, setItems] = useState<LiveShoppingResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=shopping`)
        if (!res.ok) throw new Error('shopping failed')
        const data = await res.json()
        const mapped = ((data.shopping ?? []) as any[]).map((p: any, i: number) => ({
          id: `p${i}`,
          title: p.title ?? `Produit ${i + 1}`,
          price: p.price ?? '—',
          oldPrice: p.oldPrice,
          rating: p.rating ?? 4.5,
          reviews: p.reviews ?? 0,
          prime: Boolean(p.prime),
          image: p.image ?? 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80',
          url: p.url ?? '#',
        }))

        if (!cancelled) setItems(mapped)
      } catch {
        if (!cancelled) {
          setItems([])
          setError('Impossible de charger les offres.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [q])

  return (
    <div>
      {loading && <div className="py-6 text-sm text-muted-foreground">Chargement des offres…</div>}
      {!loading && error && <div className="py-6 text-sm text-red-400">{error}</div>}
      {!loading && !error && items.length === 0 && (
        <div className="py-6 text-sm text-muted-foreground">Aucune offre trouvée pour cette recherche.</div>
      )}
      {!loading && !error && (
        <>
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
        </>
      )}
    </div>
  )
}
