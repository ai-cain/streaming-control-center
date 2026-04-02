import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { useConfig } from '../features/config/config-context'
import { ConfigPage } from '../features/config/ConfigPage'
import { ExportsPage } from '../features/exports/ExportsPage'
import { LegacyPage } from '../features/legacy/LegacyPage'
import { LivePage } from '../features/live/LivePage'
import { OverviewPage } from '../features/overview/OverviewPage'
import { PlaybackPage } from '../features/playback/PlaybackPage'
import { SnapshotsPage } from '../features/snapshots/SnapshotsPage'

const navItems = [
  { to: '/', label: 'Overview', description: 'Architecture and migration map' },
  { to: '/live', label: 'Live', description: 'Monitoring and HLS direction' },
  { to: '/playback', label: 'Playback', description: 'Range query workflow' },
  { to: '/exports', label: 'Exports', description: 'Jobs and downloads' },
  { to: '/snapshots', label: 'Snapshots', description: 'Evidence and history' },
  { to: '/config', label: 'Config', description: 'Local persistence strategy' },
  { to: '/legacy', label: 'Legacy', description: 'Static prototype reference' },
] as const

export function AppShell() {
  const { hasApiConfig, hasLiveConfig } = useConfig()

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <section className="brand-panel">
          <span className="eyebrow">Streaming workspace</span>
          <h1>Streaming Control Center</h1>
          <p>
            React foundation for a standalone console that consumes recorder and
            live APIs without inheriting the old hardcoded defaults.
          </p>
        </section>

        <nav className="nav-list" aria-label="Primary navigation">
          {navItems.map((item, index) => (
            <NavLink
              key={item.to}
              className={({ isActive }) =>
                `nav-link${isActive ? ' active' : ''}`
              }
              end={item.to === '/'}
              to={item.to}
            >
              <span className="nav-index">{String(index + 1).padStart(2, '0')}</span>
              <span>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
            </NavLink>
          ))}
        </nav>

        <section className="sidebar-card">
          <span className="eyebrow">Build posture</span>
          <div className="detail-list">
            <div className="detail-row">
              <span className="muted">Recorder API</span>
              <strong>{hasApiConfig ? 'Configured' : 'Pending'}</strong>
            </div>
            <div className="detail-row">
              <span className="muted">Live source</span>
              <strong>{hasLiveConfig ? 'Ready' : 'Missing fields'}</strong>
            </div>
          </div>
        </section>
      </aside>

      <main className="content-area">
        <header className="topbar">
          <div className="page-heading">
            <span className="eyebrow">Foundation</span>
            <h2>New repo, clean shell, and a path away from hardcoded behavior</h2>
            <p>
              This first milestone is the product frame. The next milestone wires
              local config, API polling, and live playback on top of it.
            </p>
          </div>

          <div className="status-row">
            <span className={`badge ${hasApiConfig ? 'success' : 'warning'}`}>
              API {hasApiConfig ? 'set' : 'pending'}
            </span>
            <span className={`badge ${hasLiveConfig ? 'success' : 'warning'}`}>
              live {hasLiveConfig ? 'ready' : 'incomplete'}
            </span>
            <span className="badge legacy">legacy kept</span>
          </div>
        </header>

        <Routes>
          <Route index element={<OverviewPage />} />
          <Route path="/live" element={<LivePage />} />
          <Route path="/playback" element={<PlaybackPage />} />
          <Route path="/exports" element={<ExportsPage />} />
          <Route path="/snapshots" element={<SnapshotsPage />} />
          <Route path="/config" element={<ConfigPage />} />
          <Route path="/legacy" element={<LegacyPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </main>
    </div>
  )
}
