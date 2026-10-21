import { useEffect, useMemo, useState } from 'react'
import { ExternalLink } from 'lucide-react'

import { useLiveToggle } from '@/components/nex/live-tile'
import { Calculator } from '@/components/tools/calculator'
import { Timer } from '@/components/tools/timer'
import { Translator } from '@/components/tools/translator'
import { detectTool, parseDuration } from '@/lib/instant-answers'
import { useNex } from '@/lib/nex-store'
import { AiOverview } from './ai-overview'
import { WikiPanel } from './wiki-panel'

type LiveWebResult = {
  title: string
  url: string
  displayUrl: string
  domain: string
  snippet: string
  engines: string[]
  score: number
  color: string
  tile?: boolean
}

function host(url: string) {
  return new URL(url).hostname.replace(/^www\./, '')
}

function Favicon({ url, color }: { url: string; color: string }) {
  const [failed, setFailed] = useState(false)
  const h = host(url)
  return failed ? (
    <span className="grid size-7 shrink-0 place-items-center text-xs uppercase" style={{ backgroundColor: color }}>
      {h[0]}
    </span>
  ) : (
    <span className="grid size-7 shrink-0 place-items-center bg-white">
      <img
        src={`https://icons.duckduckgo.com/ip3/${h}.ico`}
        alt=""
        className="size-4"
        onError={() => setFailed(true)}
      />
    </span>
  )
}

function EngineBadges({ r }: { r: LiveWebResult }) {
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[0.7rem]">
      {r.engines.map((e) => (
        <span
          key={e}
          className={e === 'Bing' ? 'bg-[#008373] px-1.5 py-0.5' : 'bg-[#de5833] px-1.5 py-0.5'}
        >
          {e}
        </span>
      ))}
      <span className="text-muted-foreground">Pertinence IA {r.score}</span>
    </div>
  )
}

function ResultRow({ r, delay }: { r: LiveWebResult; delay: number }) {
  return (
    <article className="nx-slide-in py-4" style={{ '--nx-delay': `${delay}ms` } as React.CSSProperties}>
      <div className="mb-1 flex items-center gap-2.5">
        <Favicon url={r.url} color={r.color} />
        <div className="min-w-0 text-sm leading-tight">
          <div className="truncate">{host(r.url)}</div>
          <div className="truncate text-xs text-muted-foreground">{r.displayUrl}</div>
        </div>
      </div>
      <a
        href={r.url}
        target="_blank"
        rel="noreferrer"
        className="text-xl text-primary brightness-[1.6] saturate-[.8] hover:underline"
      >
        {r.title}
      </a>
      <p className="mt-1 text-sm leading-relaxed text-white/80">{r.snippet}</p>
      <EngineBadges r={r} />
    </article>
  )
}

function ResultTile({ r, delay }: { r: LiveWebResult; delay: number }) {
  const flipped = useLiveToggle(true, 4500)
  const [shotFailed, setShotFailed] = useState(false)

  return (
    <div className="nx-turnstile py-3" style={{ '--nx-delay': `${delay}ms` } as React.CSSProperties}>
      <a
        href={r.url}
        target="_blank"
        rel="noreferrer"
        aria-label={r.title}
        className="nx-tile block h-44 sm:h-48"
        style={{ backgroundColor: r.color }}
      >
        <div className="nx-flip" data-flipped={flipped}>
          <div className="nx-face flex flex-col justify-between p-4" style={{ backgroundColor: r.color }}>
            <div className="flex items-center gap-2 text-sm">
              <Favicon url={r.url} color="rgba(0,0,0,.3)" />
              {host(r.url)}
            </div>
            <div>
              <h3 className="metro-light text-2xl leading-tight sm:text-3xl">{r.title}</h3>
              <p className="mt-1 line-clamp-1 text-sm text-white/85">{r.snippet}</p>
            </div>
          </div>
          <div className="nx-face nx-face-back bg-[#111]">
            {!shotFailed && (
              <img
                src={`https://s0.wp.com/mshots/v1/${encodeURIComponent(r.url)}?w=800&h=500`}
                alt=""
                loading="lazy"
                onError={() => setShotFailed(true)}
                className="absolute inset-0 size-full object-cover object-top opacity-90"
              />
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/90 to-transparent px-4 pt-10 pb-3 text-sm">
              <span>Aperçu du site · {host(r.url)}</span>
              <ExternalLink className="size-4" />
            </div>
          </div>
        </div>
      </a>
      <EngineBadges r={r} />
    </div>
  )
}

export function WebResults({ q }: { q: string }) {
  const { settings, hydrated } = useNex()
  const [results, setResults] = useState<LiveWebResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const tool = detectTool(q)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      setLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=web`)
        if (!res.ok) throw new Error('search failed')
        const data = await res.json()

        const mapped = ((data.results ?? []) as any[]).map((r: any, i: number) => ({
          title: r.title,
          url: r.url,
          displayUrl: r.displayUrl ?? r.domain ?? host(r.url),
          domain: r.domain ?? host(r.url),
          snippet: r.snippet ?? '',
          engines: r.engines && r.engines.length ? r.engines : [data.source === 'duckduckgo' ? 'DuckDuckGo' : data.source === 'wikipedia' ? 'Wikipedia' : 'Bing'],
          score: typeof r.score === 'number' ? r.score : 95 - i,
          color: i % 4 === 2 ? '#2d89ef' : '#161616',
          tile: i % 4 === 2,
        }))

        if (!cancelled) setResults(mapped)
      } catch {
        if (!cancelled) {
          setResults([])
          setError('Impossible de charger les résultats web.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [q])

  const overview = useMemo(() => {
    const sources = results.slice(0, 4).map((r) => ({ title: r.title, url: r.url }))
    return {
      paragraphs: [
        `D’après les sources les mieux classées pour « ${q} », les résultats affichés proviennent directement des moteurs de recherche et des sources web disponibles.`,
      ],
      bullets: [
        `Le classement est calculé à partir des termes de la requête « ${q} ».`,
        'Les liens sont dédupliqués et triés par pertinence.',
        'Le panneau de contexte Wikipédia reste affiché quand la requête correspond à une page utile.',
      ],
      sources,
    }
  }, [q, results])

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,44rem)_minmax(18rem,24rem)] lg:gap-x-12">
      <div className="space-y-5 lg:col-start-1">
        {tool === 'calculator' && <Calculator key={q} initial={q} />}
        {tool === 'timer' && <Timer key={q} initialSeconds={parseDuration(q) ?? 300} />}
        {tool === 'translator' && <Translator />}
        {hydrated && settings.aiOverview && <AiOverview data={overview} />}
      </div>

      <aside className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <div className="lg:sticky lg:top-32">
          <WikiPanel q={q} />
        </div>
      </aside>

      <div className="divide-y divide-white/10 lg:col-start-1">
        {loading && <div className="py-6 text-sm text-muted-foreground">Chargement des résultats…</div>}
        {!loading && error && <div className="py-6 text-sm text-red-400">{error}</div>}
        {!loading && !error && results.length === 0 && (
          <div className="py-6 text-sm text-muted-foreground">Aucun résultat trouvé pour cette recherche.</div>
        )}
        {!loading && !error && results.map((r, i) => (r.tile ? <ResultTile key={`${r.url}-${i}`} r={r} delay={i * 50} /> : <ResultRow key={`${r.url}-${i}`} r={r} delay={i * 50} />))}
      </div>
    </div>
  )
}
