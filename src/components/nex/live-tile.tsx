import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'

import type { SearchTab } from '@/lib/nex-store'
import { cn } from '@/lib/utils'

export type TileSize = 's' | 'm' | 'w' | 'l'

interface LiveTileProps {
  size?: TileSize
  color?: string
  /** Label shown in the bottom-left corner, Metro-style */
  label?: string
  badge?: React.ReactNode
  front: React.ReactNode
  /** Second face; when set the tile animates between faces */
  back?: React.ReactNode
  /** flip = 3D rotation, peek = vertical slide */
  mode?: 'flip' | 'peek'
  interval?: number
  /** Stagger for the turnstile entrance, in ms */
  delay?: number
  /** Opens a NexSearch results page */
  search?: { q: string; tab: SearchTab }
  href?: string
  onClick?: () => void
  className?: string
  ariaLabel?: string
}

/** Counts animation steps at `interval`, offset randomly so tiles never move in sync */
export function useLiveCount(enabled: boolean, interval: number) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!enabled) return
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      setCount((c) => c + 1)
      timer = setTimeout(tick, interval + Math.random() * 2000)
    }
    timer = setTimeout(tick, interval * 0.5 + Math.random() * interval)
    return () => clearTimeout(timer)
  }, [enabled, interval])
  return count
}

/** Boolean that flips on every live step */
export function useLiveToggle(enabled: boolean, interval: number) {
  return useLiveCount(enabled, interval) % 2 === 1
}

export function LiveTile({
  size = 'm',
  color,
  label,
  badge,
  front,
  back,
  mode = 'flip',
  interval = 5000,
  delay = 0,
  search,
  href,
  onClick,
  className,
  ariaLabel,
}: LiveTileProps) {
  const live = useLiveToggle(Boolean(back), interval)

  const body =
    back && mode === 'flip' ? (
      <div className="nx-flip" data-flipped={live}>
        <div className="nx-face">{front}</div>
        <div className="nx-face nx-face-back">{back}</div>
      </div>
    ) : back ? (
      <div className="absolute inset-0 overflow-hidden">
        <div className="nx-peek" data-peek={live}>
          <div className="absolute inset-0">{front}</div>
          <div className="absolute inset-x-0 top-full h-full">{back}</div>
        </div>
      </div>
    ) : (
      <div className="absolute inset-0">{front}</div>
    )

  const content = (
    <>
      {body}
      {label && (
        <span className="pointer-events-none absolute bottom-1.5 left-2.5 z-10 text-[0.8rem] font-normal drop-shadow">
          {label}
        </span>
      )}
      {badge && (
        <span className="pointer-events-none absolute right-2.5 bottom-1.5 z-10 text-sm font-semibold drop-shadow">
          {badge}
        </span>
      )}
    </>
  )

  const classes = cn(
    'nx-tile nx-turnstile block text-left',
    `nx-${size}`,
    !color && 'bg-primary',
    className,
  )
  const style = {
    backgroundColor: color,
    '--nx-delay': `${delay}ms`,
  } as React.CSSProperties

  if (search)
    return (
      <Link to="/search" search={search} className={classes} style={style} aria-label={ariaLabel ?? label}>
        {content}
      </Link>
    )
  if (href)
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={classes}
        style={style}
        aria-label={ariaLabel ?? label}
      >
        {content}
      </a>
    )
  return (
    <button type="button" onClick={onClick} className={classes} style={style} aria-label={ariaLabel ?? label}>
      {content}
    </button>
  )
}
