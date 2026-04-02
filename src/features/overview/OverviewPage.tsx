import { Link } from 'react-router-dom'
import { useRecorderHealthQuery, useRecordingStatusQuery } from '../../shared/api/queries'
import { safeOrigin } from '../../shared/utils/url'
import { describeConnectionMode } from '../config/connection-mode'
import { useConfig } from '../config/config-context'
import { buildEndpointCatalog, buildLiveManifestUrl } from '../config/endpoints'

export function OverviewPage() {
  const { config, hasApiConfig, hasLiveConfig } = useConfig()
  const connectionMode = describeConnectionMode(config)
  const endpointCatalog = buildEndpointCatalog(config)
  const liveManifestUrl = buildLiveManifestUrl(config)
  const healthQuery = useRecorderHealthQuery(config.apiBase, config.pollingMs)
  const statusQuery = useRecordingStatusQuery(config.apiBase, config.pollingMs)
  const activeCameras = (statusQuery.data ?? []).filter(
    (camera) => camera.is_running,
  ).length

  const healthLabel = !hasApiConfig
    ? 'Config pending'
    : healthQuery.isError
      ? 'Unreachable'
      : healthQuery.data
        ? 'Online'
        : 'Checking'

  const healthTone = !hasApiConfig
    ? 'neutral'
    : healthQuery.isError
      ? 'danger'
      : healthQuery.data
        ? 'success'
        : 'warning'

  return (
    <div className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Overview</span>
          <h2>We are treating the old UI as legacy and rebuilding with intent</h2>
          <p>
            The old prototype proved the product need, but it also showed the pain:
            hardcoded links, one giant script, and no clean place to grow features.
          </p>
        </div>

        <div className={`callout ${connectionMode.tone}`}>
          <strong>{connectionMode.mode}</strong>
          <p>{connectionMode.note}</p>
        </div>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <span className="metric-label">Recorder health</span>
          <span className="metric-value">{healthLabel}</span>
          <p className="metric-note">
            <span className={`badge ${healthTone}`}>
              {String(healthQuery.data?.status ?? 'polling')}
            </span>
          </p>
        </article>

        <article className="metric-card">
          <span className="metric-label">Workers</span>
          <span className="metric-value">{healthQuery.data?.workers ?? '--'}</span>
          <p className="metric-note">Live value from `/health`.</p>
        </article>

        <article className="metric-card">
          <span className="metric-label">Active cameras</span>
          <span className="metric-value">{hasApiConfig ? activeCameras : '--'}</span>
          <p className="metric-note">Derived from `/status`.</p>
        </article>

        <article className="metric-card">
          <span className="metric-label">Polling</span>
          <span className="metric-value">{config.pollingMs} ms</span>
          <p className="metric-note">Origin: {safeOrigin()}</p>
        </article>
      </section>

      <div className="content-grid">
        <section className="panel">
          <span className="eyebrow">Endpoint map</span>
          <div className="endpoint-list">
            {endpointCatalog.map((endpoint) => (
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

        <aside className="stack">
          <section className="panel">
            <span className="eyebrow">Immediate direction</span>
            <ul className="check-list">
              <li>Live is now the first real module, not only a plan card.</li>
              <li>Playback, exports, and snapshots inherit the same config contract.</li>
              <li>Legacy remains reference only while the React code becomes source of truth.</li>
            </ul>
          </section>

          <section className="panel">
            <span className="eyebrow">Control links</span>
            <div className="detail-list">
              <div className="detail-row">
                <span className="muted">Config route</span>
                <Link to="/config">Open local configuration</Link>
              </div>
              <div className="detail-row">
                <span className="muted">Live manifest</span>
                <code>{liveManifestUrl || 'Pending media config'}</code>
              </div>
              <div className="detail-row">
                <span className="muted">Recorder API</span>
                <code>{config.apiBase || 'Pending recorder URL'}</code>
              </div>
              <div className="detail-row">
                <span className="muted">Live module</span>
                <strong>{hasLiveConfig ? 'Ready to validate' : 'Needs config'}</strong>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
