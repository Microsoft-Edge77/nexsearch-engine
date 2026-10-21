# AGENTS.md

NexSearch: a Metro / Windows 8.1 styled search engine (French UI) built on TanStack Start and deployed on Netlify.

**Continue from [PLAN.md](PLAN.md).** Milestone 1 (the full UI) is done; the next milestones replace demo data with live sources and AI.

## Stack

TanStack Start + React 19, TanStack Router (file routes), Tailwind CSS 4, lucide-react, shadcn/ui primitives in `src/components/ui` (only Dialog, Skeleton and Radix Popover are used; the rest is custom Metro UI). Netlify Image CDN for all local images.

## Layout

```
src/
├── routes/
│   ├── __root.tsx        # HTML shell (lang=fr, class=dark), NexProvider, Wallpaper, favicon
│   ├── index.tsx         # Start screen: header (logo/clock/settings), search, tile groups
│   └── search.tsx        # Results: ?q=&tab=web|images|videos|news|shopping|maps
├── components/
│   ├── nex/              # Shared Metro pieces: logo, LiveTile (+useLiveCount/useLiveToggle),
│   │                     # SearchBox (history suggestions), SettingsFlyout, MetroToggle
│   ├── home/             # Start-screen tiles, WeatherTile (geolocation + Open-Meteo), useNow
│   ├── search/           # Header + pivot tabs, WebResults, AiOverview, WikiPanel,
│   │                     # ImageResults (+viewer), media-results (videos/news/shopping), MapView
│   ├── tools/            # Calculator (own expression parser, no eval), Timer, Translator
│   └── wallpaper.tsx     # Blurred image of the day + black veil (toggle in settings)
├── lib/
│   ├── fixtures.ts       # ALL demo data/generators — swap these for server calls
│   ├── instant-answers.ts# Detects calculator/translator/timer queries
│   └── nex-store.tsx     # Settings + history context persisted in localStorage; imgCdn()
└── styles.css            # Metro theme vars, turnstile/slide/rise keyframes, tile flip/peek, tile grid
public/img/               # Generated photos (image of the day, landscapes, amazing photos)
public/favicon.svg        # Window logo: 2 white + 2 grey squares
```

## Conventions and decisions

- UI copy is French. Fonts: `--font-body` (Segoe UI) and `.metro-light` (Segoe UI Light) for headings/pivots.
- Square corners everywhere (`--radius: 0`). Accent colour is the CSS var `--nx-accent`, mapped to `--primary`; use `bg-primary`/`border-primary`, never hard-code the accent.
- Tiles use the `.nx-group` grid with `.nx-s/.nx-m/.nx-w/.nx-l` spans (1×1, 2×2, 4×2, 4×4 cells). `--nx-cols` sets group width; `--nx-cols-md` narrows it on tablets. Mobile is always 4 fluid columns. On ≥1024px the Start screen scrolls horizontally (wheel is mapped) and cell size follows viewport height so groups stay ≤ 6 rows.
- Entrance animations use `.nx-turnstile` / `.nx-slide-in` / `.nx-rise` with a `--nx-delay` CSS var for staggering; fill-mode is `backwards` so `:active` transforms still work. Live tiles use `useLiveCount`, randomly offset so tiles never animate in sync; reduced-motion disables them.
- localStorage is read only after hydration (`hydrated` flag in `useNex`). Keys: `nexsearch:settings`, `nexsearch:history`, `nexsearch:location`.
- The results `<main>` is keyed by query+tab, so result components remount per search and start with fresh state (no reset effects needed).
- Already live (browser-side, CORS-enabled, no keys): Open-Meteo, Nominatim reverse/search, OSM embed, Wikipédia REST, MyMemory translation, DuckDuckGo favicons, WordPress mShots site previews.
- Demo data (to replace per PLAN.md): web/images/videos/news/shopping results, AI Overview, media headlines, Bing image of the day. Server work should go in TanStack server functions or Netlify Functions; AI via Netlify AI Gateway.

## Commands

`pnpm dev`, `pnpm lint`, `pnpm typecheck` (after a dev/build run generates `routeTree.gen.ts`), `pnpm test`.
