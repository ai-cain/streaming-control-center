import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useRecorderHealthQuery, useRecordingStatusQuery } from '../../shared/api/queries'
import { getCameraById } from '../../shared/camera-catalog'
import { describeConnectionMode } from '../config/connection-mode'
import { useConfig } from '../config/config-context'
import { buildEndpointCatalog, pickEndpoints } from '../config/endpoints'
import { useUiPreferences } from '../ui-preferences/ui-preferences-context'
import { CameraSlot } from './CameraSlot'
import { CameraStrip } from './CameraStrip'

type LayoutSize = 1 | 2 | 4

function LayoutIcon({ size }: { size: LayoutSize }) {
  if (size === 1) {
    return (
      <svg fill="currentColor" height="14" viewBox="0 0 14 14" width="14">
        <rect height="12" rx="1" width="12" x="1" y="1" />
      </svg>
    )
  }
  if (size === 2) {
    return (
      <svg fill="currentColor" height="14" viewBox="0 0 14 14" width="14">
        <rect height="12" rx="1" width="5" x="1" y="1" />
        <rect height="12" rx="1" width="5" x="8" y="1" />
      </svg>
    )
  }
  return (
    <svg fill="currentColor" height="14" viewBox="0 0 14 14" width="14">
      <rect height="5" rx="1" width="5" x="1" y="1" />
      <rect height="5" rx="1" width="5" x="8" y="1" />
      <rect height="5" rx="1" width="5" x="1" y="8" />
      <rect height="5" rx="1" width="5" x="8" y="8" />
    </svg>
  )
}

export function LivePage() {
  const { t } = useUiPreferences()
  const [layout, setLayout] = useState<LayoutSize>(1)
  const [slotCameraIds, setSlotCameraIds] = useState<(string | null)[]>([null])
  const { config } = useConfig()
  const healthQuery = useRecorderHealthQuery(config.apiBase, config.pollingMs)
  const statusQuery = useRecordingStatusQuery(config.apiBase, config.pollingMs)
  const connectionMode = describeConnectionMode(config)
  const activeCameras = (statusQuery.data ?? []).filter((camera) => camera.is_running).length

  const endpoints = pickEndpoints(buildEndpointCatalog(config), [
    'live-manifest',
    'health',
    'status',
  ])

  const activeCameraIds = slotCameraIds.filter(Boolean) as string[]

  const changeLayout = (next: LayoutSize) => {
    setLayout(next)
    setSlotCameraIds((prev) =>
      Array.from({ length: next }, (_, index) => prev[index] ?? null),
    )
  }

  const toggleCamera = (cameraId: string) => {
    setSlotCameraIds((prev) => {
      if (prev.includes(cameraId)) {
        return prev.map((id) => (id === cameraId ? null : id))
      }

      const emptyIndex = prev.indexOf(null)

      if (emptyIndex !== -1) {
        const next = [...prev]
        next[emptyIndex] = cameraId
        return next
      }

      return [cameraId, ...prev.slice(1)]
    })
  }

  const removeFromSlot = (index: number) => {
    setSlotCameraIds((prev) => prev.map((id, slotIndex) => (slotIndex === index ? null : id)))
  }

  return (
    <div className="live-page">
      <div className="live-toolbar">
        <div className="live-toolbar-left">
          <div className="mode-switch">
            <span className="mode-tab active">{t('live.mode.liveView')}</span>
            <Link className="mode-tab" to="/playback">
              {t('live.mode.playback')}
            </Link>
          </div>
          <div className="layout-picker">
            {([1, 2, 4] as LayoutSize[]).map((size) => (
              <button
                className={`layout-btn${layout === size ? ' active' : ''}`}
                key={size}
                onClick={() => changeLayout(size)}
                title={
                  size === 4
                    ? t('live.layout.2x2')
                    : size === 2
                      ? t('live.layout.1x2')
                      : t('live.layout.1x1')
                }
                type="button"
              >
                <LayoutIcon size={size} />
              </button>
            ))}
          </div>
        </div>

        <div className="live-toolbar-right">
          <span className={`pill ${healthQuery.isError ? 'danger' : 'accent'}`}>
            {healthQuery.isError ? t('live.pill.signalIssue') : t('live.pill.live')}
          </span>
          <Link className="toolbar-link" to="/config">
            {t('live.settings')}
          </Link>
        </div>
      </div>

      <div className={`viewer-grid viewer-grid-${layout}`}>
        {slotCameraIds.map((cameraId, index) => (
          <CameraSlot
            camera={cameraId ? getCameraById(cameraId) : null}
            config={config}
            key={index}
            onRemove={() => removeFromSlot(index)}
            slotIndex={index}
          />
        ))}
      </div>

      <CameraStrip activeCameraIds={activeCameraIds} onToggleCamera={toggleCamera} />

      <div className="live-status-bar">
        <div className="footer-cell">
          <span>{t('live.footer.workers')}</span>
          <strong>{healthQuery.data?.workers ?? '--'}</strong>
        </div>
        <div className="footer-cell">
          <span>{t('live.footer.activeCameras')}</span>
          <strong>{config.apiBase ? activeCameras : '--'}</strong>
        </div>
        <div className="footer-cell">
          <span>{t('live.footer.mode')}</span>
          <strong>{t(connectionMode.modeKey)}</strong>
        </div>
        <div className="footer-cell">
          <span>{t('live.footer.inGrid')}</span>
          <strong>
            {t('live.footer.gridUsage', {
              count: activeCameraIds.length,
              layout,
            })}
          </strong>
        </div>
      </div>

      <div className="workspace-grid">
        <section className="panel compact-panel">
          <span className="section-title">{t('live.endpoints.title')}</span>
          <div className="endpoint-list">
            {endpoints.map((endpoint) => (
              <div className="endpoint-row compact-endpoint" key={endpoint.id}>
                <div className="endpoint-body">
                  <strong>{t(endpoint.labelKey)}</strong>
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
            <span className="signal-label">{t(connectionMode.modeKey)}</span>
            <p>{t(connectionMode.noteKey)}</p>
          </section>
        </aside>
      </div>
    </div>
  )
}
