import { useMemo, useState } from 'react'
import { ExternalLink } from 'lucide-react'

import { useLiveToggle } from '@/components/nex/live-tile'
import { Calculator } from '@/components/tools/calculator'
import { Timer } from '@/components/tools/timer'
import { Translator } from '@/components/tools/translator'
import { getAiOverview, getWebResults, type WebResult } from '@/lib/fixtures'
import { detectTool, parseDuration } from '@/lib/instant-answers'
import { useNex } from '@/lib/nex-store'
import { AiOverview } from './ai-overview'
import { WikiPanel } from './wiki-panel'

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

function EngineBadges({ r }: { r: WebResult }) {
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

function ResultRow({ r, delay }: { r: WebResult; delay: number }) {
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

/** A result shown as a live tile that periodically flips to preview the site */
function ResultTile({ r, delay }: { r: WebResult; delay: number }) {
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
  const results = useMemo(() => getWebResults(q), [q])
  const overview = useMemo(() => getAiOverview(q, results), [q, results])
  const tool = detectTool(q)

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
        {results.map((r, i) =>
          r.tile ? (
            <ResultTile key={r.id} r={r} delay={i * 50} />
          ) : (
            <ResultRow key={r.id} r={r} delay={i * 50} />
          ),
        )}
      </div>
    </div>
  )
}
