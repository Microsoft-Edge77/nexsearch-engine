import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NotFoundPage } from '@/components/error-pages'
import { NexProvider } from '@/lib/nex-store'
import { Wallpaper } from '@/components/wallpaper'

import '../styles.css'

const siteName = 'NexSearch'
const siteDescription =
  'NexSearch, le moteur de recherche au design Metro : résultats Bing et DuckDuckGo, AI Overview, live tiles et outils intégrés.'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: siteName,
      },
      {
        name: 'description',
        content: siteDescription,
      },
      {
        property: 'og:title',
        content: siteName,
      },
      {
        property: 'og:description',
        content: siteDescription,
      },
      {
        property: 'og:type',
        content: 'website',
      },
      {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
      { name: 'theme-color', content: '#1d1d1d' },
    ],
    links: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
  }),
  shellComponent: RootDocument,
  notFoundComponent: NotFoundPage,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        <NexProvider>
          <TooltipProvider>
            <Wallpaper />
            <div className="relative z-10">{children}</div>
          </TooltipProvider>
        </NexProvider>
        <Toaster />
        <Scripts />
      </body>
    </html>
  )
}
