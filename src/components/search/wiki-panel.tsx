import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'

interface WikiSummary {
  title: string
  description?: string
  extract: string
  thumbnail?: { source: string }
  originalimage?: { source: string }
  content_urls: { desktop: { page: string } }
}

/** Live Wikipédia preview (the public REST API allows browser requests) */
export function WikiPanel({ q }: { q: string }) {
  const [state, setState] = useState<'loading' | 'none' | WikiSummary>('loading')

  useEffect(() => {
    // The results page remounts per query, so the initial 'loading' state is fresh
    let cancelled = false
    ;(async () => {
      try {
        const search = await fetch(
          `https://fr.wikipedia.org/w/api.php?action=opensearch&limit=1&namespace=0&format=json&origin=*&search=${encodeURIComponent(q)}`,
        ).then((r) => r.json())
        const title: string | undefined = search?.[1]?.[0]
        if (!title) throw new Error('none')
        const summary = await fetch(
          `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
        ).then((r) => (r.ok ? r.json() : Promise.reject(new Error('none'))))
        if (!cancelled) setState(summary as WikiSummary)
      } catch {
        if (!cancelled) setState('none')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [q])

  if (state === 'none') return null
  if (state === 'loading')
    return (
      <div className="space-y-3 bg-white/5 p-4">
        <Skeleton className="aspect-video w-full bg-white/10" />
        <Skeleton className="h-7 w-2/3 bg-white/10" />
        <Skeleton className="h-4 w-full bg-white/10" />
        <Skeleton className="h-4 w-5/6 bg-white/10" />
      </div>
    )

  const img = state.originalimage?.source ?? state.thumbnail?.source
  return (
    <article className="nx-slide-in overflow-hidden bg-white/[0.06]" aria-label="Aperçu Wikipédia">
      {img && (
        <a href={img} target="_blank" rel="noreferrer" className="block bg-black">
          <img
            src={state.thumbnail?.source ?? img}
            alt={state.title}
            className="max-h-72 w-full object-cover"
          />
        </a>
      )}
      <div className="p-4">
        <p className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="grid size-4 place-items-center bg-white font-serif text-[0.7rem] text-black">W</span>
          Wikipédia
        </p>
        <h2 className="metro-light text-3xl leading-tight">{state.title}</h2>
        {state.description && (
          <p className="mb-2 text-sm text-muted-foreground">{state.description}</p>
        )}
        <p className="line-clamp-[8] text-sm leading-relaxed text-white/90">{state.extract}</p>
        <a
          href={state.content_urls.desktop.page}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 bg-primary px-3 py-1.5 text-sm hover:brightness-110"
        >
          Lire sur Wikipédia <ExternalLink className="size-3.5" />
        </a>
      </div>
    </article>
  )
}
