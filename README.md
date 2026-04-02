# Streaming Control Center

Standalone web console for live monitoring, playback review, exports, snapshots,
and recorder API operations.

## Current State

This repository now has a React + Vite shell that treats the old static console
as `legacy/` reference material.

The current rebuild already includes:

- browser-persisted local configuration
- shared API helpers for recorder health and status
- React Query polling
- live HLS playback inside the new shell
- endpoint-aware blueprint pages for playback, exports, and snapshots

## First Milestones

- create a clean routed shell for the standalone product
- preserve the old prototype as migration reference
- replace hardcoded defaults with browser-persisted config
- wire shared API calls for health, live, playback, exports, and snapshots

## Development

```bash
npm install
npm run dev
```
