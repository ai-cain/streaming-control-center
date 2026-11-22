# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start Vite dev server
npm run build      # tsc type-check then Vite production build
npm run lint       # ESLint across the project
npm run preview    # serve the last production build locally
npm run check      # lint + build (full pre-commit gate)
```

There are no tests. `npm run check` is the quality gate.

## Architecture

This is a **pure-browser operator console** — no backend, no server-side rendering. It talks directly to an external recorder REST API and an HLS media origin from the browser.

### Provider tree (`src/main.tsx` → `App.tsx`)

```
QueryClientProvider   (TanStack Query — shared queryClient, retry:1, no refetchOnWindowFocus)
  └─ ConfigProvider   (config-context.tsx — reads/writes localStorage)
       └─ BrowserRouter
            └─ AppShell  (header + nav + <Routes>)
```

### Config system (`src/features/config/`)

All runtime configuration lives in `localStorage` under the key `streaming-control-center/config/v1`. The shape is `AppConfig` (5 fields: `apiBase`, `mediaBase`, `app`, `streamKey`, `pollingMs`). `sanitizeConfig()` normalises and clamps every write — it is also called externally in `ConfigPage` for live draft preview. `useConfig()` is the only consumer hook; it also exposes `hasApiConfig` / `hasLiveConfig` booleans used by the header status pills.

### API layer (`src/shared/api/`)

- `http-client.ts` — thin `fetchJson<T>` wrapper
- `recorder-api.ts` — typed fetch functions for health and status endpoints
- `queries.ts` — two React Query hooks (`useRecorderHealthQuery`, `useRecordingStatusQuery`); both are polled, interval driven by `config.pollingMs`

### Endpoint catalog (`src/features/config/endpoints.ts`)

`buildEndpointCatalog(config)` returns all 9 endpoint definitions with resolved URLs for the current config. `pickEndpoints(catalog, ids)` selects a subset for display. Each feature page imports these to show an "endpoint register" sidebar panel.

### Camera catalog (`src/shared/camera-catalog.ts`)

Static array of 3 `CameraOption` objects. `resolveCameraStreamKey(template, camera)` resolves a user-supplied template string against a camera — it supports `{streamKey}`, `{id}`, and a trailing-digit heuristic for patterns like `cam_01`.

### Routes and feature pages (`src/features/`)

| Route | Page | Status |
|---|---|---|
| `/` | `OverviewPage` | summary cards + module shortcuts |
| `/live` | `LivePage` | fully wired — HLS player + camera selection + status polling |
| `/playback` | `PlaybackPage` | UI built, no API calls wired yet |
| `/exports` | `ExportsPage` | blueprint placeholder |
| `/snapshots` | `SnapshotsPage` | blueprint placeholder |
| `/config` | `ConfigPage` | fully wired — draft-based, live URL preview |

`FeatureBlueprintPage` is a shared scaffold component used by Exports and Snapshots.

### HLS player (`src/features/live/useHlsPlayer.ts`)

`useHlsPlayer(videoRef, manifestUrl, enabled)` handles both paths: native HLS (Safari via `canPlayType`) and hls.js (dynamic import, lazy-loaded). Returns a `{ status, message }` state object. Cleanup (`destroy` / `removeAttribute src`) runs on unmount or when `manifestUrl`/`enabled` changes.

### Styling

All CSS is in `src/index.css` (~1 086 lines). No CSS framework. Uses CSS custom properties for the full color/spacing system. Four responsive breakpoints: 720 / 960 / 1 100 / 1 280 px. The viewer stage (`.viewer`) is dark; the chrome is light. There is no `prefers-color-scheme: dark` media query.

## Key conventions

- Route paths are hard-coded string literals in `AppShell.tsx` (`navItems`) and repeated as `<Link to="...">` strings in feature pages — there is no central route constant.
- `sanitizeConfig` normalises every config write; never set config state directly without going through `replaceConfig` or `updateConfig` from `useConfig()`.
- `{camera}` tokens in endpoint paths refer to the numeric camera ID (`CameraOption.numericId`), not the string `id`.
- `pollingMs` is clamped to 3 000–60 000 ms by `sanitizeConfig`; the `<input>` on ConfigPage intentionally has `min` but no `max`.
