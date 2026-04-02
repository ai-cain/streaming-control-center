import { Link } from 'react-router-dom'
import {
  useRecorderHealthQuery,
  useRecordingStatusQuery,
} from '../../shared/api/queries'
import { describeConnectionMode } from '../config/connection-mode'
import { useConfig } from '../config/config-context'

export function OverviewPage() {
  const { config } = useConfig()
  const connectionMode = describeConnectionMode(config)
  const healthQuery = useRecorderHealthQuery(config.apiBase, config.pollingMs)
  const statusQuery = useRecordingStatusQuery(config.apiBase, config.pollingMs)
  const activeCameras = (statusQuery.data ?? []).filter(
    (camera) => camera.is_running,
  ).length

  return (
    <div className="page-shell">
      <section className="page-banner">
        <div>
          <span className="section-title">Workspace</span>
          <h2>Monitoring workspace</h2>
          <p>
            A flatter, cleaner interface inspired by surveillance clients: live
            view, playback review, clip exports, and connection settings.
          </p>
        </div>

        <div className="page-banner-actions">
          <Link className="button" to="/live">
            Open live
          </Link>
          <Link className="button secondary" to="/playback">
            Open playback
          </Link>
        </div>
      </section>

      <section className="summary-grid">
        <article className="summary-card">
          <span className="summary-label">Recorder Health</span>
          <span className="summary-value">
            {healthQuery.isError
              ? 'Offline'
              : healthQuery.data
                ? 'Online'
                : 'Checking'}
          </span>
          <span className="summary-note">{String(healthQuery.data?.status ?? 'polling')}</span>
        </article>

        <article className="summary-card">
          <span className="summary-label">Workers</span>
          <span className="summary-value">{healthQuery.data?.workers ?? '--'}</span>
          <span className="summary-note">Recorder process count</span>
        </article>

        <article className="summary-card">
          <span className="summary-label">Active Cameras</span>
          <span className="summary-value">{config.apiBase ? activeCameras : '--'}</span>
          <span className="summary-note">Derived from status</span>
        </article>

        <article className="summary-card">
          <span className="summary-label">Connection Mode</span>
          <span className="summary-value">{connectionMode.mode}</span>
          <span className="summary-note">{connectionMode.note}</span>
        </article>
      </section>

      <section className="module-grid">
        <article className="module-card">
          <span className="section-title">Live</span>
          <h3>Current signal monitor</h3>
          <p>Dark viewer stage with source context and recorder status.</p>
          <Link to="/live">Go to live</Link>
        </article>

        <article className="module-card">
          <span className="section-title">Playback</span>
          <h3>Bottom timeline review</h3>
          <p>Storyboard frames, scrubber, and range controls designed for review.</p>
          <Link to="/playback">Go to playback</Link>
        </article>

        <article className="module-card">
          <span className="section-title">Settings</span>
          <h3>Connection workspace</h3>
          <p>Recorder API, media origin, stream target, and polling in one page.</p>
          <Link to="/config">Open settings</Link>
        </article>
      </section>
    </div>
  )
}
