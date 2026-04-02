import { useRef } from 'react'
import { useRecorderHealthQuery, useRecordingStatusQuery } from '../../shared/api/queries'
import { describeConnectionMode } from '../config/connection-mode'
import { useConfig } from '../config/config-context'
import { buildEndpointCatalog, buildLiveManifestUrl, pickEndpoints } from '../config/endpoints'
import { useHlsPlayer } from './useHlsPlayer'

export function LivePage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { config, hasLiveConfig } = useConfig()
  const connectionMode = describeConnectionMode(config)
  const endpointCatalog = buildEndpointCatalog(config)
  const liveManifestUrl = buildLiveManifestUrl(config)
  const liveEndpoints = pickEndpoints(endpointCatalog, [
    'live-manifest',
    'health',
    'status',
  ])
  const playerState = useHlsPlayer(videoRef, liveManifestUrl, hasLiveConfig)
  const healthQuery = useRecorderHealthQuery(config.apiBase, config.pollingMs)
  const statusQuery = useRecordingStatusQuery(config.apiBase, config.pollingMs)
  const activeCameras = (statusQuery.data ?? []).filter(
    (camera) => camera.is_running,
  ).length

  return (
    <div className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Live module</span>
          <h2>Live playback now runs inside the React shell</h2>
          <p>
            This module is already using local config, shared queries, and HLS
            playback. It is the first real migration away from the legacy page.
          </p>
        </div>

        <div className={`callout ${connectionMode.tone}`}>
          <strong>{playerState.status}</strong>
          <p>{playerState.message}</p>
        </div>
      </section>

      <div className="content-grid">
        <section className="panel">
          <span className="eyebrow">Live player</span>
          <div className="video-frame">
            {hasLiveConfig ? (
              <video autoPlay controls muted playsInline ref={videoRef} />
            ) : (
              <div className="video-empty">
                Add the media base, app, and stream key in Config to boot the live
                preview.
              </div>
            )}
          </div>

          <div className="inline-metrics">
            <div className="inline-metric">
              <span className="muted">Health</span>
              <strong>
                {healthQuery.isError
                  ? 'Recorder unreachable'
                  : healthQuery.data
                    ? 'Recorder online'
                    : 'Checking recorder'}
              </strong>
            </div>
            <div className="inline-metric">
              <span className="muted">Workers</span>
              <strong>{healthQuery.data?.workers ?? '--'}</strong>
            </div>
            <div className="inline-metric">
              <span className="muted">Active cameras</span>
              <strong>{config.apiBase ? activeCameras : '--'}</strong>
            </div>
          </div>
        </section>

        <aside className="stack">
          <section className="panel">
            <span className="eyebrow">Live endpoints</span>
            <div className="endpoint-list">
              {liveEndpoints.map((endpoint) => (
                <div className="endpoint-row" key={endpoint.id}>
                  <div className="endpoint-body">
                    <strong>{endpoint.label}</strong>
                    <code>{endpoint.url}</code>
                  </div>
                  <span className={`endpoint-method ${endpoint.method.toLowerCase()}`}>
                    {endpoint.method}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <span className="eyebrow">Operator notes</span>
            <ul className="check-list">
              <li>HLS playback still depends on browser policy, CORS, and media reachability.</li>
              <li>The recorder health and status calls now share the same query layer future modules will use.</li>
              <li>If the page is served over HTTPS and your media origin is HTTP, mixed content may block playback.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
