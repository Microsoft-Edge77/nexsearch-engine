import {
  Calculator,
  Clock,
  Languages,
  Map as MapIcon,
  Search,
  Timer,
} from 'lucide-react'

import { LiveTile, useLiveCount, type TileSize } from '@/components/nex/live-tile'
import {
  AMAZING_CAPTIONS,
  DAILY_IMAGE,
  LANDSCAPE_CAPTIONS,
  PHOTOS,
  type MediaTile,
} from '@/lib/fixtures'
import { imgCdn, type HistoryEntry } from '@/lib/nex-store'
import { dateFmt, timeFmt, useNow } from './use-now'

function Cover({ src, w = 640 }: { src: string; w?: number }) {
  return (
    <img
      src={imgCdn(src, w)}
      alt=""
      loading="lazy"
      className="absolute inset-0 size-full object-cover"
    />
  )
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-2.5 pt-8 pb-6 text-sm leading-snug">
      {children}
    </div>
  )
}

export function ClockTile({ delay }: { delay?: number }) {
  const now = useNow()
  return (
    <LiveTile
      size="m"
      color="#603cba"
      label="Horloge"
      delay={delay}
      mode="peek"
      interval={7000}
      ariaLabel="Horloge"
      front={
        <div className="grid h-full place-items-center">
          <span className="metro-light text-4xl tabular-nums">{now ? timeFmt.format(now) : '--:--'}</span>
        </div>
      }
      back={
        <div className="flex h-full flex-col justify-center p-3">
          <Clock className="mb-2 size-6" />
          <span className="text-sm capitalize leading-tight">{now ? dateFmt.format(now) : ''}</span>
        </div>
      }
    />
  )
}

export function DailyImageTile({ delay }: { delay?: number }) {
  return (
    <LiveTile
      size="w"
      color="#008299"
      label="Image du jour Bing"
      delay={delay}
      mode="peek"
      interval={8000}
      search={{ q: DAILY_IMAGE.title, tab: 'images' }}
      front={<Cover src={DAILY_IMAGE.src} w={720} />}
      back={
        <div className="flex h-full flex-col justify-center gap-1 bg-[#008299] p-3">
          <span className="metro-light text-xl leading-tight">{DAILY_IMAGE.title}</span>
          <span className="text-xs opacity-85">{DAILY_IMAGE.caption}</span>
        </div>
      }
    />
  )
}

/** Cross-fading slideshow, the Photos app tile from Windows 8.1 */
export function LandscapesTile({ delay }: { delay?: number }) {
  const idx = useLiveCount(true, 4000) % PHOTOS.landscapes.length
  return (
    <LiveTile
      size="m"
      color="#00a300"
      label="Paysages"
      delay={delay}
      search={{ q: 'paysages', tab: 'images' }}
      front={
        <>
          {PHOTOS.landscapes.map((src, n) => (
            <img
              key={src}
              src={imgCdn(src, 360)}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full object-cover transition-opacity duration-1000"
              style={{ opacity: n === idx ? 1 : 0 }}
            />
          ))}
          <Caption>{LANDSCAPE_CAPTIONS[idx]}</Caption>
        </>
      }
    />
  )
}

export function AmazingPhotosTile({ delay }: { delay?: number }) {
  return (
    <LiveTile
      size="w"
      color="#da532c"
      label="Photos incroyables"
      delay={delay}
      interval={5500}
      search={{ q: 'photos incroyables', tab: 'images' }}
      front={
        <>
          <Cover src={PHOTOS.amazing[0]} w={720} />
          <Caption>{AMAZING_CAPTIONS[0]}</Caption>
        </>
      }
      back={
        <>
          <Cover src={PHOTOS.amazing[1]} w={720} />
          <Caption>{AMAZING_CAPTIONS[1]}</Caption>
        </>
      }
    />
  )
}

export function NewsTile({ tile, delay }: { tile: MediaTile; delay?: number }) {
  const step = useLiveCount(true, 5000)
  const flipped = step % 2 === 1
  // Advance the headline as the tile starts turning to its back, while that face is hidden
  const headline = tile.headlines[Math.floor((step + 1) / 2) % tile.headlines.length]
  const front = tile.image ? (
    <>
      <Cover src={tile.image} w={720} />
      <div className="absolute inset-0 bg-black/35" />
      <span className="metro-light absolute top-2.5 left-3 text-2xl drop-shadow">{tile.media}</span>
    </>
  ) : (
    <div className="flex h-full items-center justify-center p-3">
      <span className="metro-light text-center text-2xl leading-tight">{tile.media}</span>
    </div>
  )
  const back = (
    <div className="flex h-full flex-col p-3" style={{ backgroundColor: tile.color }}>
      <span className="mb-1 text-[0.7rem] tracking-wider uppercase opacity-80">À la une</span>
      <span className={tile.size === 'w' ? 'text-lg leading-snug' : 'text-sm leading-snug'}>
        {headline}
      </span>
    </div>
  )
  const live = (
    <div className="nx-flip" data-flipped={flipped}>
      <div className="nx-face">{front}</div>
      <div className="nx-face nx-face-back">{back}</div>
    </div>
  )
  return (
    <LiveTile
      size={tile.size}
      color={tile.color}
      label={tile.media}
      delay={delay}
      href={tile.url}
      ariaLabel={`${tile.media} — ${headline}`}
      front={live}
    />
  )
}

const TOOL_TILES: {
  label: string
  size: TileSize
  color: string
  icon: typeof Calculator
  q: string
  tab?: 'maps'
}[] = [
  { label: 'Carte', size: 'w', color: '#00a300', icon: MapIcon, q: 'Paris', tab: 'maps' },
  { label: 'Calculatrice', size: 'm', color: '#2b5797', icon: Calculator, q: 'calculatrice' },
  { label: 'Traducteur', size: 'm', color: '#e3a21a', icon: Languages, q: 'traducteur' },
  { label: 'Minuteur', size: 'm', color: '#b91d47', icon: Timer, q: 'minuteur' },
]

export function ExplorerTiles({ baseDelay = 0 }: { baseDelay?: number }) {
  return (
    <>
      <LiveTile
        size="m"
        color="#ffffff"
        ariaLabel="Wikipédia"
        delay={baseDelay}
        href="https://fr.wikipedia.org"
        front={
          <div className="flex h-full flex-col items-center justify-center text-black">
            <span className="font-serif text-6xl leading-none">W</span>
            <span className="absolute bottom-1.5 left-2.5 text-[0.8rem]">Wikipédia</span>
          </div>
        }
      />
      {TOOL_TILES.map((t, n) => (
        <LiveTile
          key={t.label}
          size={t.size}
          color={t.color}
          label={t.label}
          delay={baseDelay + (n + 1) * 60}
          search={{ q: t.q, tab: t.tab ?? 'web' }}
          front={
            <div className="grid h-full place-items-center">
              <t.icon className="size-10 stroke-[1.25]" />
            </div>
          }
        />
      ))}
    </>
  )
}

const RECENT_COLORS = ['var(--nx-accent)', '#2d2d2d', '#1e7145', '#7e3878', '#2b5797', '#9f00a7']

export function RecentTiles({
  history,
  baseDelay = 0,
}: {
  history: HistoryEntry[]
  baseDelay?: number
}) {
  if (!history.length)
    return (
      <LiveTile
        size="w"
        color="rgba(255,255,255,.08)"
        label="Récemment"
        delay={baseDelay}
        onClick={() => document.querySelector<HTMLInputElement>('input[type=search]')?.focus()}
        front={
          <div className="flex h-full items-center gap-3 p-4 text-sm text-white/80">
            <Search className="size-7 shrink-0" />
            Vos recherches récentes apparaîtront ici.
          </div>
        }
      />
    )
  return (
    <>
      {history.slice(0, 6).map((h, n) => (
        <LiveTile
          key={h.at}
          size="m"
          color={RECENT_COLORS[n % RECENT_COLORS.length]}
          delay={baseDelay + n * 60}
          search={{ q: h.q, tab: h.tab }}
          ariaLabel={`Rechercher à nouveau « ${h.q} »`}
          label={new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(h.at)}
          front={
            <div className="flex h-full flex-col p-3">
              <Search className="mb-2 size-5 opacity-80" />
              <span className="line-clamp-3 text-lg leading-tight break-words">{h.q}</span>
            </div>
          }
        />
      ))}
    </>
  )
}
