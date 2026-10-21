import { useEffect, useState } from 'react'
import { ChevronDown, Sparkles } from 'lucide-react'

import type { AiOverview as AiOverviewData } from '@/lib/fixtures'
import { cn } from '@/lib/utils'

function host(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

export function AiOverview({ data }: { data: AiOverviewData }) {
  const [ready, setReady] = useState(false)
  const [expanded, setExpanded] = useState(false)

  // Brief "thinking" state, mirroring the latency of the live model
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 900)
    return () => clearTimeout(t)
  }, [data])

  return (
    <section
      aria-label="AI Overview"
      aria-busy={!ready}
      className="nx-turnstile relative overflow-hidden border-l-4 border-primary bg-white/[0.06]"
    >
      <div className="flex items-center gap-2 px-4 pt-4 text-sm">
        <span className="grid size-7 place-items-center bg-primary">
          <Sparkles className="size-4" />
        </span>
        <span className="metro-light text-xl">AI Overview</span>
        <span className="ml-auto text-xs text-muted-foreground">Synthèse Bing + DuckDuckGo</span>
      </div>

      {!ready ? (
        <div className="space-y-2 px-4 py-4" aria-hidden="true">
          {[92, 100, 76].map((w) => (
            <div
              key={w}
              className="h-3.5 animate-pulse bg-gradient-to-r from-white/5 via-white/20 to-white/5"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      ) : (
        <div className="nx-rise px-4 pt-3 pb-4">
          {data.paragraphs.map((p) => (
            <p key={p} className="leading-relaxed">
              {p}
            </p>
          ))}
          <div
            className={cn(
              'grid transition-[grid-template-rows] duration-300',
              expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
            )}
          >
            <ul className="mt-3 list-none space-y-1.5 overflow-hidden">
              {data.bullets.map((b) => (
                <li key={b} className="flex gap-2 text-sm text-white/90">
                  <span className="mt-2 size-1.5 shrink-0 bg-primary" />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-xs tracking-wider text-muted-foreground uppercase">Sources</p>
            <div className="flex flex-wrap gap-1.5">
              {data.sources.map((s, i) => (
                <a
                  key={s.url}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex max-w-56 items-center gap-2 bg-white/10 px-2.5 py-1.5 text-xs hover:bg-white/20"
                >
                  <span className="grid size-4 shrink-0 place-items-center bg-primary text-[0.6rem]">
                    {i + 1}
                  </span>
                  <span className="truncate">{host(s.url)}</span>
                </a>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-3 flex items-center gap-1 text-sm text-white/80 hover:text-white"
          >
            {expanded ? 'Afficher moins' : 'Afficher plus'}
            <ChevronDown className={cn('size-4 transition-transform', expanded && 'rotate-180')} />
          </button>
        </div>
      )}
    </section>
  )
}
