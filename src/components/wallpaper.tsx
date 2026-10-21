import { DAILY_IMAGE } from '@/lib/fixtures'
import { imgCdn, useNex } from '@/lib/nex-store'

/** Blurred image of the day behind a translucent black veil */
export function Wallpaper() {
  const { settings, hydrated } = useNex()
  const on = hydrated && settings.wallpaper
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background"
    >
      <div
        className="absolute -inset-10 bg-cover bg-center blur-2xl transition-opacity duration-700 motion-reduce:transition-none"
        style={{
          backgroundImage: on ? `url(${imgCdn(DAILY_IMAGE.src, 1280)})` : undefined,
          opacity: on ? 1 : 0,
        }}
      />
      <div
        className="absolute inset-0 bg-black/60 transition-opacity duration-700"
        style={{ opacity: on ? 1 : 0 }}
      />
    </div>
  )
}
