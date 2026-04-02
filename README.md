# Streaming Control Center

Standalone web console for live monitoring, playback review, exports, snapshots,
and recorder API operations.

## Current State

This repository now has a React + Vite shell that treats the old static console
as `legacy/` reference material.

## First Milestones

- create a clean routed shell for the standalone product
- preserve the old prototype as migration reference
- replace hardcoded defaults with browser-persisted config
- wire shared API calls for health, live, playback, exports, and snapshots
