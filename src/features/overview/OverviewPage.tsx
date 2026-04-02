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
      <section className="hero-panel hero-panel-featured">
        <div className="hero-copy">
          <span className="eyebrow">Control room</span>
          <h2>The console is now shaped around camera operations, not debug blocks</h2>
          <p>
            The center of gravity is shifting toward video review: large media
            stages, signal context, and faster movement between live, playback,
            exports, and evidence.
          </p>

          <div className="hero-actions">
            <Link className="button" to="/live">
              Open live deck
            </Link>
            <Link className="button secondary" to="/playback">
              Jump to playback lab
            </Link>
          </div>
        </div>

        <div className="camera-art-card" aria-hidden="true">
          <div className="camera-art">
            <div className="camera-core" />
            <div className="camera-lens" />
            <div className="camera-ring" />
            <div className="camera-ring ring-two" />
          </div>
          <div className={`callout ${connectionMode.tone}`}>
            <strong>{connectionMode.mode}</strong>
            <p>{connectionMode.note}</p>
          </div>
        </div>
      </section>

      <section className="metric-grid metric-grid-wide">
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

      <div className="content-grid content-grid-wide">
        <section className="panel">
          <span className="eyebrow">Mission lanes</span>
          <div className="lane-grid">
            <article className="lane-card">
              <span className="lane-kicker">01</span>
              <strong>Live deck</strong>
              <p>Watch the current stream with cleaner stage hierarchy and signal context.</p>
              <Link to="/live">View live</Link>
            </article>

            <article className="lane-card">
              <span className="lane-kicker">02</span>
              <strong>Playback lab</strong>
              <p>Scrub history, inspect frames, and move through time like a real review console.</p>
              <Link to="/playback">Open playback</Link>
            </article>

            <article className="lane-card">
              <span className="lane-kicker">03</span>
              <strong>Configuration workspace</strong>
              <p>Set origins and stream targets in one place, then let every module inherit them.</p>
              <Link to="/config">Edit config</Link>
            </article>
          </div>
        </section>

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
            <span className="eyebrow">Operator context</span>
            <ul className="check-list">
              <li>Live already reads real recorder health and status from the shared API layer.</li>
              <li>Playback is being rebuilt as a visual review surface with timeline interaction.</li>
              <li>Configuration is now the source of truth for endpoints instead of buried defaults.</li>
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
              <div className="detail-row">
                <span className="muted">Browser origin</span>
                <code>{safeOrigin()}</code>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  )
}
