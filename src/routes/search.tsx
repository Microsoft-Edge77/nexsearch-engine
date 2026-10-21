import { useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'

import { SearchHeader, TABS } from '@/components/search/search-header'
import { WebResults } from '@/components/search/web-results'
import { ImageResults } from '@/components/search/image-results'
import {
  NewsResults,
  ShoppingResults,
  VideoResults,
} from '@/components/search/media-results'
import { MapView } from '@/components/search/map-view'
import { useNex, type SearchTab } from '@/lib/nex-store'

export const Route = createFileRoute('/search')({
  validateSearch: (s: Record<string, unknown>): { q: string; tab: SearchTab } => ({
    q: typeof s.q === 'string' ? s.q.slice(0, 200) : '',
    tab: TABS.includes(s.tab as SearchTab) ? (s.tab as SearchTab) : 'web',
  }),
  head: ({ match }) => ({
    meta: [{ title: match.search.q ? `${match.search.q} — NexSearch` : 'NexSearch' }],
  }),
  component: SearchPage,
})

function SearchPage() {
  const { q, tab } = Route.useSearch()
  const { addHistory } = useNex()
  const query = q.trim()

  useEffect(() => {
    if (query) addHistory(query, tab)
  }, [query, tab, addHistory])

  return (
    <div className="min-h-screen">
      <SearchHeader q={q} tab={tab} />
      <main key={`${query}-${tab}`} className="px-4 pt-4 pb-16 sm:px-8 lg:px-12 lg:pl-[calc(3rem+9.5rem)]">
        {!query ? (
          <div className="nx-turnstile py-16">
            <h1 className="metro-light text-4xl">Que cherchez-vous ?</h1>
            <p className="mt-2 text-muted-foreground">
              Saisissez une recherche ci-dessus, ou retournez à{' '}
              <Link to="/" className="underline">
                l’accueil
              </Link>
              .
            </p>
          </div>
        ) : (
          <>
            <h1 className="sr-only">Résultats pour « {query} »</h1>
            {tab === 'web' && <WebResults q={query} />}
            {tab === 'images' && <ImageResults q={query} />}
            {tab === 'videos' && <VideoResults q={query} />}
            {tab === 'news' && <NewsResults q={query} />}
            {tab === 'shopping' && <ShoppingResults q={query} />}
            {tab === 'maps' && <MapView q={query} />}
            {tab !== 'maps' && (
              <p className="mt-10 text-xs text-muted-foreground">
                Aperçu NexSearch : résultats d’exemple en attendant la connexion directe à Bing,
                DuckDuckGo, Google News, MSN et Amazon.
              </p>
            )}
          </>
        )}
      </main>
    </div>
  )
}
