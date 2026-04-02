import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { useRecorderHealthQuery, useRecordingStatusQuery } from '../../shared/api/queries'
import { CameraResourcePanel } from '../../shared/CameraResourcePanel'
import { describeConnectionMode } from '../config/connection-mode'
import { useConfig } from '../config/config-context'
import { buildEndpointCatalog, buildLiveManifestUrl, pickEndpoints } from '../config/endpoints'
import { useHlsPlayer } from './useHlsPlayer'

export function LivePage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const { config, hasLiveConfig } = useConfig()
  const liveManifestUrl = buildLiveManifestUrl(config)
  const playerState = useHlsPlayer(videoRef, liveManifestUrl, hasLiveConfig)
  const healthQuery = useRecorderHealthQuery(config.apiBase, config.pollingMs)
  const statusQuery = useRecordingStatusQuery(config.apiBase, config.pollingMs)
  const connectionMode = describeConnectionMode(config)
  const activeCameras = (statusQuery.data ?? []).filter(
    (camera) => camera.is_running,
  ).length
  const endpoints = pickEndpoints(buildEndpointCatalog(config), [
    'live-manifest',
    'health',
    'status',
  ])

  return (
    <div className="monitor-page">
      <CameraResourcePanel selectedCamera="CANCHA 2" />

      <div className="monitor-content">
        <div className="monitor-toolbar">
          <div className="monitor-toolbar-left">
            <div className="monitor-select">Camera 2 / Main view</div>
            <div className="mode-switch">
              <span className="mode-tab active">Live View</span>
              <Link className="mode-tab" to="/playback">
                Playback
              </Link>
            </div>
          </div>

          <Link className="toolbar-link" to="/config">
            Settings
          </Link>
        </div>

        <section className="viewer-shell">
          <div className="viewer-toolbar">
            <div>
              <span className="section-title">Live Monitor</span>
              <h3>{config.streamKey || 'No stream configured'}</h3>
            </div>

            <div className="viewer-toolbar-meta">
              <span className={`pill ${healthQuery.isError ? 'danger' : 'accent'}`}>
                {healthQuery.isError ? 'signal issue' : 'live'}
              </span>
              <span className="pill">{playerState.status}</span>
            </div>
          </div>

          <div className="viewer-canvas">
            {hasLiveConfig ? (
              <video autoPlay controls muted playsInline ref={videoRef} />
            ) : (
              <div className="viewer-empty">
                Waiting for media origin, application, and stream key.
              </div>
            )}
          </div>

          <div className="viewer-footer">
            <div className="footer-cell">
              <span>Signal</span>
              <strong>{playerState.message}</strong>
            </div>
            <div className="footer-cell">
              <span>Workers</span>
              <strong>{healthQuery.data?.workers ?? '--'}</strong>
            </div>
            <div className="footer-cell">
              <span>Active cameras</span>
              <strong>{config.apiBase ? activeCameras : '--'}</strong>
            </div>
            <div className="footer-cell">
              <span>Mode</span>
              <strong>{connectionMode.mode}</strong>
            </div>
          </div>
        </section>

        <div className="workspace-grid">
          <section className="panel compact-panel">
            <span className="section-title">Live Endpoints</span>
            <div className="endpoint-list">
              {endpoints.map((endpoint) => (
                <div className="endpoint-row compact-endpoint" key={endpoint.id}>
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

          <aside className="side-stack">
            <section className={`signal-box ${connectionMode.tone}`}>
              <span className="signal-label">{connectionMode.mode}</span>
              <p>{connectionMode.note}</p>
            </section>
          </aside>
        </div>
      </div>
    </div>
  )
}
