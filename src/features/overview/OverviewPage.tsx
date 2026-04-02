import { Link } from 'react-router-dom'
import {
  useRecorderHealthQuery,
  useRecordingStatusQuery,
} from '../../shared/api/queries'
import { useUiPreferences } from '../ui-preferences/ui-preferences-context'
import { describeConnectionMode } from '../config/connection-mode'
import { useConfig } from '../config/config-context'

export function OverviewPage() {
  const { config } = useConfig()
  const { t } = useUiPreferences()
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
          <span className="section-title">{t('overview.sectionTitle')}</span>
          <h2>{t('overview.title')}</h2>
          <p>{t('overview.description')}</p>
        </div>

        <div className="page-banner-actions">
          <Link className="button" to="/live">
            {t('overview.action.openLive')}
          </Link>
          <Link className="button secondary" to="/playback">
            {t('overview.action.openPlayback')}
          </Link>
        </div>
      </section>

      <section className="summary-grid">
        <article className="summary-card">
          <span className="summary-label">
            {t('overview.summary.recorderHealth.label')}
          </span>
          <span className="summary-value">
            {healthQuery.isError
              ? t('overview.summary.recorderHealth.offline')
              : healthQuery.data
                ? t('overview.summary.recorderHealth.online')
                : t('overview.summary.recorderHealth.checking')}
          </span>
          <span className="summary-note">
            {String(
              healthQuery.data?.status ??
                t('overview.summary.recorderHealth.polling'),
            )}
          </span>
        </article>

        <article className="summary-card">
          <span className="summary-label">
            {t('overview.summary.workers.label')}
          </span>
          <span className="summary-value">{healthQuery.data?.workers ?? '--'}</span>
          <span className="summary-note">{t('overview.summary.workers.note')}</span>
        </article>

        <article className="summary-card">
          <span className="summary-label">
            {t('overview.summary.activeCameras.label')}
          </span>
          <span className="summary-value">{config.apiBase ? activeCameras : '--'}</span>
          <span className="summary-note">
            {t('overview.summary.activeCameras.note')}
          </span>
        </article>

        <article className="summary-card">
          <span className="summary-label">
            {t('overview.summary.connectionMode.label')}
          </span>
          <span className="summary-value">{t(connectionMode.modeKey)}</span>
          <span className="summary-note">{t(connectionMode.noteKey)}</span>
        </article>
      </section>

      <section className="module-grid">
        <article className="module-card">
          <span className="section-title">{t('overview.module.live.section')}</span>
          <h3>{t('overview.module.live.title')}</h3>
          <p>{t('overview.module.live.description')}</p>
          <Link to="/live">{t('overview.module.live.link')}</Link>
        </article>

        <article className="module-card">
          <span className="section-title">
            {t('overview.module.playback.section')}
          </span>
          <h3>{t('overview.module.playback.title')}</h3>
          <p>{t('overview.module.playback.description')}</p>
          <Link to="/playback">{t('overview.module.playback.link')}</Link>
        </article>

        <article className="module-card">
          <span className="section-title">
            {t('overview.module.settings.section')}
          </span>
          <h3>{t('overview.module.settings.title')}</h3>
          <p>{t('overview.module.settings.description')}</p>
          <Link to="/config">{t('overview.module.settings.link')}</Link>
        </article>
      </section>
    </div>
  )
}
