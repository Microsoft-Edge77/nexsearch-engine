import { Link } from '@tanstack/react-router'

import { NexLogo } from '@/components/nex/nex-logo'
import { SearchBox } from '@/components/nex/search-box'
import { SettingsFlyout, TAB_LABELS } from '@/components/nex/settings-flyout'
import type { SearchTab } from '@/lib/nex-store'
import { cn } from '@/lib/utils'

export const TABS = Object.keys(TAB_LABELS) as SearchTab[]

export function SearchHeader({ q, tab }: { q: string; tab: SearchTab }) {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md">
      <div className="flex items-center gap-3 px-4 pt-4 sm:gap-5 sm:px-8 lg:px-12">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="Accueil NexSearch">
          <NexLogo className="size-8 sm:size-9" />
          <span className="metro-light hidden text-2xl md:inline">NexSearch</span>
        </Link>
        <SearchBox defaultValue={q} tab={tab} className="max-w-2xl flex-1" />
        <SettingsFlyout className="ml-auto shrink-0" />
      </div>
      <nav
        aria-label="Type de résultats"
        className="nx-scroll-x flex gap-5 overflow-x-auto px-4 pt-3 pb-2 sm:gap-7 sm:px-8 lg:px-12 lg:pl-[calc(3rem+9.5rem)]"
      >
        {TABS.map((t, n) => (
          <Link
            key={t}
            to="/search"
            search={{ q, tab: t }}
            aria-current={t === tab ? 'page' : undefined}
            className={cn(
              'nx-turnstile metro-light shrink-0 text-xl lowercase transition-colors sm:text-2xl',
              t === tab ? 'text-white' : 'text-white/45 hover:text-white/80',
            )}
            style={{ '--nx-delay': `${n * 40}ms` } as React.CSSProperties}
          >
            {TAB_LABELS[t]}
          </Link>
        ))}
      </nav>
    </header>
  )
}
