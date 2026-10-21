import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Check, Settings, Trash2, X } from 'lucide-react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

import { ACCENTS } from '@/lib/fixtures'
import { useNex } from '@/lib/nex-store'
import { cn } from '@/lib/utils'
import { MetroToggle } from './metro-toggle'

const TAB_LABELS = {
  web: 'Web',
  images: 'Images',
  videos: 'Vidéos',
  news: 'Actualités',
  shopping: 'Shopping',
  maps: 'Cartes',
} as const

function formatWhen(at: number) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(at)
}

export function SettingsFlyout({ className }: { className?: string }) {
  const { settings, updateSettings, history, removeHistory, clearHistory } = useNex()
  const [open, setOpen] = useState(false)

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger
        className={cn(
          'flex h-10 items-center gap-2 px-3 text-white transition-colors hover:bg-white/10 data-[state=open]:bg-primary',
          className,
        )}
        aria-label="Paramètres"
      >
        <Settings className="size-5" />
        <span className="hidden text-sm sm:inline">Paramètres</span>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="end"
          sideOffset={6}
          collisionPadding={8}
          className="nx-slide-in z-50 flex max-h-[min(85vh,44rem)] w-[min(24rem,calc(100vw-1rem))] flex-col overflow-hidden border-l-4 border-primary bg-popover text-white shadow-2xl outline-none"
        >
          <div className="flex items-center justify-between bg-primary px-5 py-4">
            <h2 className="metro-light text-2xl">Paramètres</h2>
            <PopoverPrimitive.Close aria-label="Fermer" className="p-1 hover:bg-white/20">
              <X className="size-5" />
            </PopoverPrimitive.Close>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
            <section>
              <h3 className="metro-light mb-3 text-lg">Couleur d’accentuation</h3>
              <div className="grid grid-cols-5 gap-1.5">
                {ACCENTS.map((a) => (
                  <button
                    key={a.value}
                    type="button"
                    title={a.name}
                    aria-label={a.name}
                    aria-pressed={settings.accent === a.value}
                    onClick={() => updateSettings({ accent: a.value })}
                    className="grid aspect-square place-items-center outline-offset-2 transition-transform hover:scale-105 active:scale-95"
                    style={{ backgroundColor: a.value }}
                  >
                    {settings.accent === a.value && <Check className="size-5" />}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="metro-light text-lg">Affichage</h3>
              <MetroToggle
                label="AI Overview"
                description="Résumé de recherche généré par l’IA au-dessus des résultats"
                checked={settings.aiOverview}
                onChange={(v) => updateSettings({ aiOverview: v })}
              />
              <MetroToggle
                label="Fond d’écran"
                description="Image Bing du jour, floutée derrière un voile sombre"
                checked={settings.wallpaper}
                onChange={(v) => updateSettings({ wallpaper: v })}
              />
            </section>

            <section>
              <div className="mb-2 flex items-baseline justify-between">
                <h3 className="metro-light text-lg">Historique</h3>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="text-sm text-primary brightness-150 hover:underline"
                  >
                    Tout effacer
                  </button>
                )}
              </div>
              <p className="mb-2 text-xs text-muted-foreground">
                Stocké uniquement sur cet appareil.
              </p>
              {history.length === 0 ? (
                <p className="border border-dashed border-white/20 px-3 py-4 text-sm text-muted-foreground">
                  Aucune recherche pour l’instant.
                </p>
              ) : (
                <ul className="divide-y divide-white/10">
                  {history.map((h) => (
                    <li key={h.at} className="group flex items-center gap-2">
                      <Link
                        to="/search"
                        search={{ q: h.q, tab: h.tab }}
                        onClick={() => setOpen(false)}
                        className="min-w-0 flex-1 py-2 hover:text-primary hover:brightness-150"
                      >
                        <span className="block truncate">{h.q}</span>
                        <span className="text-xs text-muted-foreground">
                          {TAB_LABELS[h.tab]} · {formatWhen(h.at)}
                        </span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeHistory(h.at)}
                        aria-label={`Supprimer « ${h.q} » de l’historique`}
                        className="p-2 text-muted-foreground hover:bg-white/10 hover:text-white"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

export { TAB_LABELS }
