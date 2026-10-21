import { useCallback, useEffect, useState } from 'react'
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Loader2,
  LocateFixed,
  MapPin,
  Search,
  Sun,
  type LucideIcon,
} from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { LiveTile } from '@/components/nex/live-tile'

interface Place {
  name: string
  lat: number
  lon: number
  detail?: string
  /** true when the place comes from device geolocation */
  auto: boolean
}

interface Forecast {
  temp: number
  code: number
  wind: number
  humidity: number
  days: { date: string; code: number; max: number; min: number }[]
}

const LOCATION_KEY = 'nexsearch:location'
const FALLBACK: Place = { name: 'Paris', lat: 48.8566, lon: 2.3522, auto: false }

function describe(code: number): [string, LucideIcon] {
  if (code === 0) return ['Ensoleillé', Sun]
  if (code <= 2) return ['Éclaircies', CloudSun]
  if (code === 3) return ['Couvert', Cloud]
  if (code <= 48) return ['Brouillard', CloudFog]
  if (code <= 57) return ['Bruine', CloudDrizzle]
  if (code <= 67 || (code >= 80 && code <= 82)) return ['Pluie', CloudRain]
  if (code <= 77 || code === 85 || code === 86) return ['Neige', CloudSnow]
  return ['Orage', CloudLightning]
}

async function fetchForecast(p: Place): Promise<Forecast> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${p.lat}&longitude=${p.lon}` +
      '&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m' +
      '&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=4',
  )
  if (!res.ok) throw new Error('weather')
  const d = await res.json()
  return {
    temp: Math.round(d.current.temperature_2m),
    code: d.current.weather_code,
    wind: Math.round(d.current.wind_speed_10m),
    humidity: d.current.relative_humidity_2m,
    days: (d.daily.time as string[]).slice(1).map((date, i) => ({
      date,
      code: d.daily.weather_code[i + 1],
      max: Math.round(d.daily.temperature_2m_max[i + 1]),
      min: Math.round(d.daily.temperature_2m_min[i + 1]),
    })),
  }
}

async function reverseName(lat: number, lon: number) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&accept-language=fr`,
    )
    const d = await res.json()
    return (
      d.address?.city || d.address?.town || d.address?.village || d.address?.municipality || 'Ma position'
    )
  } catch {
    return 'Ma position'
  }
}

function locate(): Promise<Place> {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) return reject(new Error('geo'))
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) =>
        resolve({
          name: await reverseName(coords.latitude, coords.longitude),
          lat: coords.latitude,
          lon: coords.longitude,
          auto: true,
        }),
      reject,
      { timeout: 8000, maximumAge: 15 * 60 * 1000 },
    )
  })
}

export function WeatherTile({ delay }: { delay?: number }) {
  const [place, setPlace] = useState<Place | null>(null)
  const [forecast, setForecast] = useState<Forecast | null>(null)
  const [error, setError] = useState(false)
  const [open, setOpen] = useState(false)

  const applyPlace = useCallback((p: Place) => {
    setPlace(p)
    setError(false)
    setForecast(null)
    localStorage.setItem(LOCATION_KEY, JSON.stringify(p))
    fetchForecast(p).then(setForecast, () => setError(true))
  }, [])

  useEffect(() => {
    let saved: Place | null = null
    try {
      saved = JSON.parse(localStorage.getItem(LOCATION_KEY) ?? 'null')
    } catch {
      saved = null
    }
    if (saved && !saved.auto) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restores the saved place after hydration
      applyPlace(saved)
      return
    }
    locate().then(applyPlace, () => applyPlace(saved ?? FALLBACK))
  }, [applyPlace])

  const [label, Icon] = describe(forecast?.code ?? 0)

  const front = (
    <div className="flex h-full flex-col justify-between p-3">
      {!forecast ? (
        <div className="flex h-full items-center gap-3 text-sm">
          {error ? (
            'Météo indisponible'
          ) : (
            <>
              <Loader2 className="size-5 animate-spin" /> Localisation…
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Icon className="size-14 shrink-0 stroke-[1.25]" />
          <div className="min-w-0">
            <div className="metro-light text-5xl leading-none">{forecast.temp}°</div>
            <div className="mt-1 truncate text-sm">
              {place?.name} · {label}
            </div>
            <div className="text-xs opacity-80">
              Vent {forecast.wind} km/h · Humidité {forecast.humidity} %
            </div>
          </div>
        </div>
      )}
    </div>
  )

  const back = forecast && (
    <div className="grid h-full grid-cols-3 gap-1 p-3 pb-7">
      {forecast.days.map((d) => {
        const [, DayIcon] = describe(d.code)
        return (
          <div key={d.date} className="flex flex-col items-center justify-center gap-1 text-center">
            <span className="text-xs capitalize">
              {new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(new Date(d.date))}
            </span>
            <DayIcon className="size-6 stroke-[1.5]" />
            <span className="text-sm">
              {d.max}° <span className="opacity-70">{d.min}°</span>
            </span>
          </div>
        )
      })}
    </div>
  )

  return (
    <>
      <LiveTile
        size="w"
        color="#1b6fb5"
        label="Météo"
        badge={place && <MapPin className="size-3.5" />}
        front={front}
        back={back || undefined}
        interval={6000}
        delay={delay}
        onClick={() => setOpen(true)}
        ariaLabel={`Météo${place ? ` à ${place.name}` : ''} — changer d’emplacement`}
      />
      <LocationDialog
        open={open}
        onOpenChange={setOpen}
        onPick={(p) => {
          applyPlace(p)
          setOpen(false)
        }}
      />
    </>
  )
}

function LocationDialog({
  open,
  onOpenChange,
  onPick,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onPick: (p: Place) => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Place[]>([])
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  async function search(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setBusy(true)
    setMessage('')
    try {
      const res = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=fr`,
      )
      const d = await res.json()
      const list: Place[] = (d.results ?? []).map(
        (r: { name: string; admin1?: string; country?: string; latitude: number; longitude: number }) => ({
          name: r.name,
          lat: r.latitude,
          lon: r.longitude,
          auto: false,
          detail: [r.admin1, r.country].filter(Boolean).join(', '),
        }),
      )
      setResults(list)
      if (!list.length) setMessage('Aucune ville trouvée.')
    } catch {
      setMessage('Recherche impossible pour le moment.')
    } finally {
      setBusy(false)
    }
  }

  async function locateDevice() {
    setBusy(true)
    setMessage('')
    try {
      onPick(await locate())
    } catch {
      setMessage('Autorisez la localisation dans votre navigateur pour utiliser votre position.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-0 border-t-4 border-primary bg-popover text-white">
        <DialogHeader>
          <DialogTitle className="metro-light text-2xl">Emplacement météo</DialogTitle>
          <DialogDescription>Choisissez une ville ou utilisez la position de l’appareil.</DialogDescription>
        </DialogHeader>
        <form onSubmit={search} className="flex">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex. : Lyon, Montréal, Tokyo"
            aria-label="Ville"
            className="h-10 min-w-0 flex-1 bg-white px-3 text-black outline-none"
          />
          <button type="submit" aria-label="Chercher la ville" className="grid w-11 place-items-center bg-primary">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          </button>
        </form>
        <button
          type="button"
          onClick={() => void locateDevice()}
          className="flex items-center gap-2 self-start border-2 border-white px-3 py-1.5 text-sm hover:bg-white/10"
        >
          <LocateFixed className="size-4" /> Utiliser ma position
        </button>
        {message && <p className="text-sm text-muted-foreground">{message}</p>}
        <ul className="divide-y divide-white/10">
          {results.map((r) => (
            <li key={`${r.lat},${r.lon}`}>
              <button
                type="button"
                onClick={() => onPick({ name: r.name, lat: r.lat, lon: r.lon, auto: false })}
                className="w-full px-2 py-2 text-left hover:bg-white/10"
              >
                {r.name}
                <span className="ml-2 text-xs text-muted-foreground">
                  {r.detail}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </DialogContent>
    </Dialog>
  )
}
