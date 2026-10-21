import { useEffect, useState } from 'react'
import { ExternalLink, Loader2, MapPin } from 'lucide-react'

import { cn } from '@/lib/utils'

interface Place {
  place_id: number
  display_name: string
  lat: string
  lon: string
  boundingbox: [string, string, string, string]
}

/** OpenStreetMap embed, geocoded with Nominatim straight from the browser */
export function MapView({ q }: { q: string }) {
  const [places, setPlaces] = useState<Place[] | null>(null)
  const [active, setActive] = useState(0)
  const [error, setError] = useState(false)

  useEffect(() => {
    // The results page remounts per query, so state starts fresh
    let cancelled = false
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&limit=6&accept-language=fr&q=${encodeURIComponent(q)}`,
    )
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('geo'))))
      .then((d: Place[]) => !cancelled && setPlaces(d))
      .catch(() => !cancelled && setError(true))
    return () => {
      cancelled = true
    }
  }, [q])

  if (error)
    return <p className="text-muted-foreground">La carte n’a pas pu être chargée. Réessayez dans un instant.</p>
  if (!places)
    return (
      <div className="flex h-[60vh] items-center justify-center gap-2 bg-white/5 text-sm">
        <Loader2 className="size-5 animate-spin" /> Recherche du lieu…
      </div>
    )
  if (!places.length)
    return (
      <p className="text-muted-foreground">
        Aucun lieu ne correspond à « {q} ». Essayez une ville, une adresse ou un monument.
      </p>
    )

  const p = places[active]
  const [s, n, w, e] = p.boundingbox.map(Number)
  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${w},${s},${e},${n}&layer=mapnik&marker=${p.lat},${p.lon}`
  const full = `https://www.openstreetmap.org/?mlat=${p.lat}&mlon=${p.lon}#map=14/${p.lat}/${p.lon}`

  return (
    <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="nx-turnstile relative h-[60vh] min-h-80 bg-white/5">
        <iframe key={p.place_id} title={`Carte : ${p.display_name}`} src={embed} className="size-full border-0" />
      </div>
      <div className="space-y-1">
        {places.map((pl, i) => (
          <button
            key={pl.place_id}
            type="button"
            onClick={() => setActive(i)}
            className={cn(
              'nx-slide-in flex w-full gap-2 p-3 text-left text-sm',
              i === active ? 'bg-primary' : 'bg-white/[0.06] hover:bg-white/[0.12]',
            )}
            style={{ '--nx-delay': `${i * 50}ms` } as React.CSSProperties}
          >
            <MapPin className="mt-0.5 size-4 shrink-0" />
            {pl.display_name}
          </button>
        ))}
        <a
          href={full}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 border-2 border-white px-3 py-2 text-sm hover:bg-white/10"
        >
          Ouvrir dans OpenStreetMap <ExternalLink className="size-4" />
        </a>
      </div>
    </div>
  )
}
