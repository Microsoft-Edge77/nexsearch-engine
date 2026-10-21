import { createContext, useCallback, useContext, useEffect, useState } from 'react'

import { ACCENTS } from '@/lib/fixtures'

export type SearchTab =
  | 'web'
  | 'images'
  | 'videos'
  | 'news'
  | 'shopping'
  | 'maps'

export interface HistoryEntry {
  q: string
  tab: SearchTab
  at: number
}

export interface NexSettings {
  accent: string
  aiOverview: boolean
  wallpaper: boolean
}

interface NexStore {
  settings: NexSettings
  history: HistoryEntry[]
  hydrated: boolean
  updateSettings: (patch: Partial<NexSettings>) => void
  addHistory: (q: string, tab: SearchTab) => void
  removeHistory: (at: number) => void
  clearHistory: () => void
}

const SETTINGS_KEY = 'nexsearch:settings'
const HISTORY_KEY = 'nexsearch:history'
const MAX_HISTORY = 50

const defaultSettings: NexSettings = {
  accent: ACCENTS[0].value,
  aiOverview: true,
  wallpaper: true,
}

const NexContext = createContext<NexStore | null>(null)

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function NexProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<NexSettings>(defaultSettings)
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [hydrated, setHydrated] = useState(false)

  // localStorage only exists in the browser, so load after the first render
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from localStorage
    setSettings({ ...defaultSettings, ...readJson(SETTINGS_KEY, {}) })
    setHistory(readJson<HistoryEntry[]>(HISTORY_KEY, []))
    setHydrated(true)
  }, [])

  useEffect(() => {
    document.documentElement.style.setProperty('--nx-accent', settings.accent)
    if (hydrated) localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
  }, [settings, hydrated])

  useEffect(() => {
    if (hydrated) localStorage.setItem(HISTORY_KEY, JSON.stringify(history))
  }, [history, hydrated])

  const updateSettings = useCallback((patch: Partial<NexSettings>) => {
    setSettings((s) => ({ ...s, ...patch }))
  }, [])

  const addHistory = useCallback((q: string, tab: SearchTab) => {
    const query = q.trim()
    if (!query) return
    setHistory((h) =>
      [
        { q: query, tab, at: Date.now() },
        ...h.filter((e) => e.q.toLowerCase() !== query.toLowerCase()),
      ].slice(0, MAX_HISTORY),
    )
  }, [])

  const removeHistory = useCallback((at: number) => {
    setHistory((h) => h.filter((e) => e.at !== at))
  }, [])

  const clearHistory = useCallback(() => setHistory([]), [])

  return (
    <NexContext.Provider
      value={{
        settings,
        history,
        hydrated,
        updateSettings,
        addHistory,
        removeHistory,
        clearHistory,
      }}
    >
      {children}
    </NexContext.Provider>
  )
}

export function useNex() {
  const ctx = useContext(NexContext)
  if (!ctx) throw new Error('useNex must be used inside <NexProvider>')
  return ctx
}

export function imgCdn(src: string, w: number) {
  if (!src) return ''
  if (src.startsWith('data:')) return src

  try {
    const u = new URL(src)
    const allowed = ['images.unsplash.com', 'images.pexels.com', 'images.ctfassets.net']
    if (allowed.includes(u.hostname)) return src
    if (u.hostname.endsWith('bing.net')) return src
  } catch {
    return src
  }

  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${w}&fm=webp`
}
