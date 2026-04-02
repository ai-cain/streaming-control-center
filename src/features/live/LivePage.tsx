import { Link } from 'react-router-dom'
import { useMemo, useRef, useState } from 'react'
import { useRecorderHealthQuery, useRecordingStatusQuery } from '../../shared/api/queries'
import { CameraResourcePanel } from '../../shared/CameraResourcePanel'
import { getCameraById, resolveCameraStreamKey } from '../../shared/camera-catalog'
import { describeConnectionMode } from '../config/connection-mode'
import { useConfig } from '../config/config-context'
import { buildEndpointCatalog, buildLiveManifestUrl, pickEndpoints } from '../config/endpoints'
import { useHlsPlayer } from './useHlsPlayer'

export function LivePage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [selectedCameraId, setSelectedCameraId] = useState('camera-2')
  const selectedCamera = getCameraById(selectedCameraId)
  const { config } = useConfig()
  const selectedStreamKey = useMemo(
    () => resolveCameraStreamKey(config.streamKey, selectedCamera),
    [config.streamKey, selectedCamera],
  )
  const liveConfig = useMemo(
    () => ({
      ...config,
      streamKey: selectedStreamKey,
    }),
    [config, selectedStreamKey],
  )
  const hasSelectedLiveConfig = Boolean(
    liveConfig.mediaBase && liveConfig.app && liveConfig.streamKey,
  )
  const liveManifestUrl = buildLiveManifestUrl(liveConfig)
  const playerState = useHlsPlayer(videoRef, liveManifestUrl, hasSelectedLiveConfig)
  const healthQuery = useRecorderHealthQuery(config.apiBase, config.pollingMs)
  const statusQuery = useRecordingStatusQuery(config.apiBase, config.pollingMs)
  const connectionMode = describeConnectionMode(config)
  const activeCameras = (statusQuery.data ?? []).filter(
    (camera) => camera.is_running,
  ).length
  const endpoints = pickEndpoints(buildEndpointCatalog(liveConfig), [
    'live-manifest',
    'health',
    'status',
  ])

  return (
    <div className="monitor-page">
      <CameraResourcePanel
        onSelectCamera={setSelectedCameraId}
        selectedCameraId={selectedCamera.id}
      />

      <div className="monitor-content">
        <div className="monitor-toolbar">
          <div className="monitor-toolbar-left">
            <div className="monitor-select">
              {selectedCamera.shortLabel} / {selectedCamera.stageLabel}
            </div>
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
              <h3>{selectedCamera.label}</h3>
            </div>

            <div className="viewer-toolbar-meta">
              <span className={`pill ${healthQuery.isError ? 'danger' : 'accent'}`}>
                {healthQuery.isError ? 'signal issue' : 'live'}
              </span>
              <span className="pill">{playerState.status}</span>
            </div>
          </div>

          <div className="viewer-canvas">
            {hasSelectedLiveConfig ? (
              <video autoPlay controls muted playsInline ref={videoRef} />
            ) : (
              <div className="viewer-empty">
                Waiting for media origin and app. The selected camera will use{' '}
                <code>{selectedStreamKey}</code>.
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
