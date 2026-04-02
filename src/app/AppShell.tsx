import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { useConfig } from '../features/config/config-context'
import { ConfigPage } from '../features/config/ConfigPage'
import { ExportsPage } from '../features/exports/ExportsPage'
import { LivePage } from '../features/live/LivePage'
import { OverviewPage } from '../features/overview/OverviewPage'
import { PlaybackPage } from '../features/playback/PlaybackPage'
import { SnapshotsPage } from '../features/snapshots/SnapshotsPage'
import { useUiPreferences } from '../features/ui-preferences/ui-preferences-context'

const navItems = [
  { to: '/', labelKey: 'nav.workspace' },
  { to: '/live', labelKey: 'nav.live' },
  { to: '/playback', labelKey: 'nav.playback' },
  { to: '/exports', labelKey: 'nav.exports' },
  { to: '/snapshots', labelKey: 'nav.snapshots' },
  { to: '/config', labelKey: 'nav.settings' },
] as const

export function AppShell() {
  const { hasApiConfig, hasLiveConfig } = useConfig()
  const { locale, localeOptions, setLocale, t } = useUiPreferences()

  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-brand">
          <span className="shell-logo" aria-hidden="true">
            SC
          </span>
          <div className="shell-brand-copy">
            <strong>Streaming Control Center</strong>
            <small>{t('shell.operatorConsole')}</small>
          </div>
        </div>

        <nav className="shell-tabs" aria-label={t('shell.primaryNavigation')}>
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `shell-tab${isActive ? ' active' : ''}`
              }
              end={item.to === '/'}
              key={item.to}
              to={item.to}
            >
              {t(item.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="shell-status">
          <span className={`status-pill ${hasApiConfig ? 'success' : 'warning'}`}>
            {hasApiConfig
              ? t('shell.status.api.ready')
              : t('shell.status.api.pending')}
          </span>
          <span className={`status-pill ${hasLiveConfig ? 'success' : 'warning'}`}>
            {hasLiveConfig
              ? t('shell.status.live.ready')
              : t('shell.status.live.incomplete')}
          </span>
          <label className="shell-locale">
            <span>{t('shell.locale.label')}</span>
            <select
              onChange={(event) => setLocale(event.target.value as typeof locale)}
              value={locale}
            >
              {localeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </header>

      <main className="shell-main">
        <Routes>
          <Route index element={<OverviewPage />} />
          <Route path="/live" element={<LivePage />} />
          <Route path="/playback" element={<PlaybackPage />} />
          <Route path="/exports" element={<ExportsPage />} />
          <Route path="/snapshots" element={<SnapshotsPage />} />
          <Route path="/config" element={<ConfigPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>
    </div>
  )
}
