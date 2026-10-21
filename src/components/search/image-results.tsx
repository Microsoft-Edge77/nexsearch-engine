import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  Maximize2,
  X,
} from 'lucide-react'

import { getImageResults, type ImageResult } from '@/lib/fixtures'
import { imgCdn } from '@/lib/nex-store'
import { cn } from '@/lib/utils'

export function ImageResults({ q }: { q: string }) {
  const images = useMemo(() => getImageResults(q), [q])
  const [open, setOpen] = useState<number | null>(null)

  return (
    <>
      <div className="columns-2 gap-1.5 sm:columns-3 lg:columns-4 xl:columns-5">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setOpen(i)}
            className="nx-tile nx-turnstile group mb-1.5 block w-full break-inside-avoid"
            style={{ '--nx-delay': `${i * 35}ms` } as React.CSSProperties}
            aria-label={`Ouvrir ${img.title}`}
          >
            <img
              src={imgCdn(img.src, 480)}
              alt={img.title}
              loading="lazy"
              className="block w-full bg-white/5 object-cover"
              style={{ aspectRatio: i % 4 === 1 ? '3 / 4' : `${img.width} / ${img.height}` }}
            />
            <span className="absolute inset-x-0 bottom-0 translate-y-full bg-black/75 px-2 py-1.5 text-left text-xs transition-transform group-hover:translate-y-0 group-focus-visible:translate-y-0">
              <span className="block truncate">{img.title}</span>
              <span className="text-muted-foreground">{img.site}</span>
            </span>
          </button>
        ))}
      </div>
      {open !== null && (
        <ImageViewer images={images} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />
      )}
    </>
  )
}

function ImageViewer({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: ImageResult[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}) {
  const img = images[index]
  const [dir, setDir] = useState<1 | -1>(1)
  const touchX = useRef<number | null>(null)
  const strip = useRef<HTMLDivElement>(null)

  const go = useCallback(
    (step: 1 | -1) => {
      setDir(step)
      onIndex((index + step + images.length) % images.length)
    },
    [index, images.length, onIndex],
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [go, onClose])

  useEffect(() => {
    strip.current
      ?.querySelector<HTMLElement>(`[data-i="${index}"]`)
      ?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }, [index])

  const action =
    'flex items-center gap-2 border-2 border-white px-3 py-1.5 text-sm transition-colors hover:bg-white hover:text-black'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Visionneuse : ${img.title}`}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 text-white"
    >
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <div className="min-w-0 flex-1">
          <h2 className="metro-light truncate text-xl sm:text-2xl">{img.title}</h2>
          <p className="text-xs text-muted-foreground">
            {img.site} · {img.width} × {img.height} · via {img.engine}
          </p>
        </div>
        <span className="hidden text-sm text-muted-foreground sm:inline">
          {index + 1} / {images.length}
        </span>
        <button type="button" onClick={onClose} aria-label="Fermer la visionneuse" className="p-2 hover:bg-white/15">
          <X className="size-6" />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
          touchX.current = null
        }}
      >
        <img
          key={img.id}
          src={imgCdn(img.src, 1600)}
          alt={img.title}
          className="max-h-full max-w-full object-contain"
          style={{
            animation: `nx-${dir === 1 ? 'slide-in' : 'slide-in-rev'} .4s cubic-bezier(.1,.9,.2,1) both`,
          }}
        />
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Image précédente"
          className="absolute top-1/2 left-2 grid size-11 -translate-y-1/2 place-items-center border-2 border-white bg-black/40 hover:bg-white hover:text-black sm:left-4"
        >
          <ChevronLeft className="size-6" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Image suivante"
          className="absolute top-1/2 right-2 grid size-11 -translate-y-1/2 place-items-center border-2 border-white bg-black/40 hover:bg-white hover:text-black sm:right-4"
        >
          <ChevronRight className="size-6" />
        </button>
      </div>

      <div className="flex flex-wrap justify-center gap-2 px-4 py-3">
        <a href={img.src} download={`${img.title}.png`} className={action}>
          <Download className="size-4" /> Télécharger
        </a>
        <a href={img.pageUrl} target="_blank" rel="noreferrer" className={action}>
          <ExternalLink className="size-4" /> Visiter le site
        </a>
        <a href={img.src} target="_blank" rel="noreferrer" className={action}>
          <Maximize2 className="size-4" /> Taille réelle
        </a>
      </div>

      <div ref={strip} className="nx-scroll-x flex gap-1 overflow-x-auto px-4 pb-4">
        {images.map((t, i) => (
          <button
            key={t.id}
            type="button"
            data-i={i}
            onClick={() => {
              setDir(i > index ? 1 : -1)
              onIndex(i)
            }}
            aria-label={`Voir ${t.title}`}
            className={cn(
              'h-14 w-20 shrink-0 border-2 transition-opacity',
              i === index ? 'border-primary opacity-100' : 'border-transparent opacity-50 hover:opacity-90',
            )}
          >
            <img src={imgCdn(t.src, 160)} alt="" loading="lazy" className="size-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}
