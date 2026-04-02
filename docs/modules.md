# Modules

## Route map

```mermaid
flowchart LR
  App[AppShell]
  App --> Workspace[/ /]
  App --> Live[/live]
  App --> Playback[/playback]
  App --> Exports[/exports]
  App --> Snapshots[/snapshots]
  App --> Settings[/config]
```

## Workspace

- Purpose: overview of recorder posture and shortcuts into the operational
  modules.
- Data: recorder health, worker count, active camera count, connection mode.
- Screenshot: ![Workspace](img/01_workspace.png)

## Live

- Purpose: monitor the current camera stream and signal state.
- Data: recorder health, recording status, HLS manifest.
- Screenshot: ![Live](img/02_live.png)

## Playback

- Purpose: review recorded ranges with a timeline-style surface.
- Data: playback availability and playback range queries.
- Screenshot: ![Playback](img/03_playback.png)

## Exports

- Purpose: create and review export jobs.
- Data: export create and export list endpoints.
- Screenshot: ![Exports](img/04_exports.png)

## Snapshots

- Purpose: inspect the latest snapshot and recent evidence history.
- Data: latest snapshot and snapshot history endpoints.
- Screenshot: ![Snapshots](img/05_snapshots.png)

## Settings

- Purpose: manage endpoint and stream configuration for the whole console.
- Data: browser-persisted config only.
- Screenshot: ![Settings](img/06_settings.png)
