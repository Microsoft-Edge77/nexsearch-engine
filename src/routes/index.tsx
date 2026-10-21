import { useEffect, useRef } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { NexLogo } from '@/components/nex/nex-logo'
import { SearchBox } from '@/components/nex/search-box'
import { SettingsFlyout } from '@/components/nex/settings-flyout'
import { WeatherTile } from '@/components/home/weather-tile'
import {
  AmazingPhotosTile,
  ClockTile,
  DailyImageTile,
  ExplorerTiles,
  LandscapesTile,
  NewsTile,
  RecentTiles,
} from '@/components/home/tiles'
import { dateFmt, timeFmt, useNow } from '@/components/home/use-now'
import { MEDIA_TILES } from '@/lib/fixtures'
import { useNex } from '@/lib/nex-store'

export const Route = createFileRoute('/')({
  component: Home,
})

function Group({
  title,
  cols,
  mdCols,
  delay = 0,
  children,
}: {
  title: string
  cols: number
  /** Narrower grid for tablets */
  mdCols?: number
  delay?: number
  children: React.ReactNode
}) {
  return (
    <section aria-label={title} className="shrink-0">
      <h2
        className="nx-turnstile metro-light mb-3 text-2xl"
        style={{ '--nx-delay': `${delay}ms` } as React.CSSProperties}
      >
        {title}
      </h2>
      <div className="nx-group" style={{ '--nx-cols': cols, '--nx-cols-md': mdCols ?? cols } as React.CSSProperties}>
        {children}
      </div>
    </section>
  )
}

function Home() {
  const now = useNow()
  const { history } = useNex()
  const scroller = useRef<HTMLDivElement>(null)

  // On large screens the Start screen scrolls sideways: map the mouse wheel to it
  useEffect(() => {
    const el = scroller.current
    if (!el) return
    const onWheel = (e: WheelEvent) => {
      if (window.innerWidth < 1024 || el.scrollWidth <= el.clientWidth) return
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return
      e.preventDefault()
      el.scrollLeft += e.deltaY
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-start justify-between gap-4 px-4 pt-6 sm:px-10 lg:px-16 lg:pt-10">
        <div className="nx-turnstile flex items-center gap-3 sm:gap-4">
          <NexLogo className="size-10 sm:size-14" />
          <h1 className="metro-light text-4xl sm:text-6xl">NexSearch</h1>
        </div>
        <div className="flex items-start gap-3 sm:gap-6">
          <div
            className="nx-turnstile hidden text-right sm:block"
            style={{ '--nx-delay': '80ms' } as React.CSSProperties}
          >
            <div className="metro-light text-5xl leading-none tabular-nums">
              {now ? timeFmt.format(now) : ' '}
            </div>
            <div className="mt-1 text-sm capitalize text-white/80">
              {now ? dateFmt.format(now) : ' '}
            </div>
          </div>
          <SettingsFlyout />
        </div>
      </header>

      <div className="px-4 pt-3 sm:hidden">
        <div className="metro-light text-3xl tabular-nums">{now ? timeFmt.format(now) : ' '}</div>
        <div className="text-sm capitalize text-white/80">{now ? dateFmt.format(now) : ' '}</div>
      </div>

      <div
        className="nx-rise px-4 pt-5 pb-6 sm:px-10 lg:px-16"
        style={{ '--nx-delay': '120ms' } as React.CSSProperties}
      >
        <SearchBox size="lg" className="max-w-2xl" />
      </div>

      <div
        ref={scroller}
        className="nx-start nx-scroll-x flex flex-1 flex-col gap-10 px-4 pb-10 sm:px-10 md:flex-row md:flex-wrap md:gap-x-14 lg:flex-nowrap lg:overflow-x-auto lg:px-16"
      >
        <Group title="Aujourd’hui" cols={6} delay={0}>
          <WeatherTile delay={60} />
          <ClockTile delay={120} />
          <DailyImageTile delay={180} />
          <LandscapesTile delay={240} />
          <AmazingPhotosTile delay={300} />
        </Group>

        <Group title="À la une" cols={8} mdCols={6} delay={120}>
          {MEDIA_TILES.map((t, n) => (
            <NewsTile key={t.media} tile={t} delay={180 + n * 50} />
          ))}
        </Group>

        <Group title="Explorer" cols={4} delay={240}>
          <ExplorerTiles baseDelay={300} />
        </Group>

        <Group title="Récemment" cols={4} delay={300}>
          <RecentTiles history={history} baseDelay={360} />
        </Group>
      </div>
    </div>
  )
}
