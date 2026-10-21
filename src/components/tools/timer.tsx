import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw, Timer as TimerIcon } from 'lucide-react'

const PRESETS = [60, 180, 300, 600, 900, 1800]

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function clock(total: number) {
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

function beep() {
  try {
    const ctx = new AudioContext()
    ;[0, 0.35, 0.7].forEach((t) => {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.frequency.value = 880
      g.gain.setValueAtTime(0.25, ctx.currentTime + t)
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 0.3)
      o.connect(g).connect(ctx.destination)
      o.start(ctx.currentTime + t)
      o.stop(ctx.currentTime + t + 0.3)
    })
  } catch {
    // Audio is a nicety; the visual state already shows the end
  }
}

export function Timer({ initialSeconds = 300 }: { initialSeconds?: number }) {
  const [duration, setDuration] = useState(initialSeconds)
  const [left, setLeft] = useState(initialSeconds)
  const [running, setRunning] = useState(false)
  const endAt = useRef(0)

  useEffect(() => {
    if (!running) return
    endAt.current = Date.now() + left * 1000
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.round((endAt.current - Date.now()) / 1000))
      setLeft(remaining)
      if (remaining === 0) {
        setRunning(false)
        beep()
      }
    }, 250)
    return () => clearInterval(id)
    // Only restart the interval when toggling run state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  function choose(sec: number) {
    setRunning(false)
    setDuration(sec)
    setLeft(sec)
  }

  function adjust(field: 'm' | 's', value: number) {
    const m = field === 'm' ? value : Math.floor(duration / 60)
    const s = field === 's' ? value : duration % 60
    choose(Math.max(0, m) * 60 + Math.min(59, Math.max(0, s)))
  }

  const progress = duration ? left / duration : 0
  const R = 88
  const C = 2 * Math.PI * R
  const finished = left === 0 && duration > 0

  return (
    <section
      aria-label="Minuteur"
      className="nx-turnstile w-full max-w-md bg-[#1f1f1f] text-white shadow-2xl"
    >
      <header className="flex items-center gap-2 bg-primary px-4 py-2 text-sm">
        <TimerIcon className="size-4" /> Minuteur
      </header>
      <div className="flex flex-col items-center gap-5 p-6">
        <div className="relative grid size-52 place-items-center">
          <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-90">
            <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="10" />
            <circle
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke="var(--nx-accent)"
              strokeWidth="10"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              className="transition-[stroke-dashoffset] duration-300"
            />
          </svg>
          <span
            className={`metro-light text-5xl tabular-nums ${finished ? 'animate-pulse text-primary brightness-150' : ''}`}
            aria-live="polite"
          >
            {finished ? 'Terminé' : clock(left)}
          </span>
        </div>

        {!running && (
          <div className="flex items-end gap-3 text-sm">
            <label className="flex flex-col gap-1">
              Minutes
              <input
                type="number"
                min={0}
                max={600}
                value={Math.floor(duration / 60)}
                onChange={(e) => adjust('m', +e.target.value)}
                className="w-20 border-2 border-white/30 bg-transparent px-2 py-1 text-lg focus:border-primary focus:outline-none"
              />
            </label>
            <label className="flex flex-col gap-1">
              Secondes
              <input
                type="number"
                min={0}
                max={59}
                value={duration % 60}
                onChange={(e) => adjust('s', +e.target.value)}
                className="w-20 border-2 border-white/30 bg-transparent px-2 py-1 text-lg focus:border-primary focus:outline-none"
              />
            </label>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-1">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => choose(p)}
              className="bg-white/10 px-3 py-1.5 text-sm hover:bg-white/20"
            >
              {p / 60} min
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={left === 0}
            onClick={() => setRunning((r) => !r)}
            className="flex h-11 w-36 items-center justify-center gap-2 bg-primary hover:brightness-110 disabled:opacity-40"
          >
            {running ? <Pause className="size-5" /> : <Play className="size-5" />}
            {running ? 'Pause' : 'Démarrer'}
          </button>
          <button
            type="button"
            onClick={() => choose(duration)}
            className="flex h-11 items-center gap-2 border-2 border-white px-4 hover:bg-white/10"
          >
            <RotateCcw className="size-4" /> Réinitialiser
          </button>
        </div>
      </div>
    </section>
  )
}
