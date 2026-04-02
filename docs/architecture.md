# Architecture

## Goal

`streaming-control-center` is a standalone frontend that consumes recorder and
media endpoints directly. Right now there is no local backend and no local
database layer in the product architecture.

## Runtime view

```mermaid
flowchart LR
  Operator[Operator Browser]
  Shell[React + Vite Shell]
  Routes[Route Modules<br/>Workspace / Live / Playback / Exports / Snapshots / Settings]
  Config[Config Context<br/>localStorage]
  Query[React Query Polling]
  LivePlayer[HLS Player]
  Recorder[Recorder API]
  Media[Media Origin / HLS]

  Operator --> Shell
  Shell --> Routes
  Routes --> Config
  Routes --> Query
  Routes --> LivePlayer
  Config --> Query
  Config --> LivePlayer
  Query --> Recorder
  LivePlayer --> Media
```

## Main ideas

- The browser holds configuration in `localStorage`.
- `Settings` defines `apiBase`, `mediaBase`, `app`, `streamKey`, and `pollingMs`.
- `Live`, `Playback`, `Exports`, and `Snapshots` are UI modules over external
  endpoints.
- `React Query` is used for polling and cache management on recorder data.
- `hls.js` is used for live playback when HLS is available.

## Screen responsibility

```mermaid
flowchart TD
  Workspace --> Live
  Workspace --> Playback
  Workspace --> Exports
  Workspace --> Snapshots
  Workspace --> Settings

  Live --> RecorderHealth[Health + Status]
  Live --> HlsManifest[HLS Manifest]
  Playback --> PlaybackRange[Playback Range]
  Playback --> PlaybackAvailable[Playback Availability]
  Exports --> ExportCreate[Create Export Job]
  Exports --> ExportList[List Export Jobs]
  Snapshots --> SnapshotLatest[Latest Snapshot]
  Snapshots --> SnapshotHistory[Snapshot History]
  Settings --> LocalConfig[Browser Config]
```

## Current boundary

- This project is frontend-only today.
- If later we need users, roles, saved layouts, or local metadata, then we can
  add a backend as a separate layer.
- Until that happens, the cleanest architecture is direct `GET` and `POST`
  integration with the existing services.
