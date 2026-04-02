import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { useConfig } from '../features/config/config-context'
import { ConfigPage } from '../features/config/ConfigPage'
import { ExportsPage } from '../features/exports/ExportsPage'
import { LivePage } from '../features/live/LivePage'
import { OverviewPage } from '../features/overview/OverviewPage'
import { PlaybackPage } from '../features/playback/PlaybackPage'
import { SnapshotsPage } from '../features/snapshots/SnapshotsPage'

const navItems = [
  { to: '/', label: 'Workspace' },
  { to: '/live', label: 'Live' },
  { to: '/playback', label: 'Playback' },
  { to: '/exports', label: 'Exports' },
  { to: '/snapshots', label: 'Snapshots' },
  { to: '/config', label: 'Settings' },
] as const

export function AppShell() {
  const { hasApiConfig, hasLiveConfig } = useConfig()

  return (
    <div className="shell">
      <header className="shell-header">
        <div className="shell-brand">
          <span className="shell-logo" aria-hidden="true">
            SC
          </span>
          <div className="shell-brand-copy">
            <strong>Streaming Control Center</strong>
            <small>Operator console</small>
          </div>
        </div>

        <nav className="shell-tabs" aria-label="Primary navigation">
          {navItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                `shell-tab${isActive ? ' active' : ''}`
              }
              end={item.to === '/'}
              key={item.to}
              to={item.to}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="shell-status">
          <span className={`status-pill ${hasApiConfig ? 'success' : 'warning'}`}>
            API {hasApiConfig ? 'ready' : 'pending'}
          </span>
          <span className={`status-pill ${hasLiveConfig ? 'success' : 'warning'}`}>
            Live {hasLiveConfig ? 'ready' : 'incomplete'}
          </span>
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
