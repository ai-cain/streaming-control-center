import { NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useConfig } from '../features/config/config-context'
import { ConfigPage } from '../features/config/ConfigPage'
import { ExportsPage } from '../features/exports/ExportsPage'
import { LivePage } from '../features/live/LivePage'
import { OverviewPage } from '../features/overview/OverviewPage'
import { PlaybackPage } from '../features/playback/PlaybackPage'
import { SnapshotsPage } from '../features/snapshots/SnapshotsPage'

const navItems = [
  { to: '/', label: 'Control Room', description: 'System posture and command map' },
  { to: '/live', label: 'Live Deck', description: 'Elegant live monitoring' },
  { to: '/playback', label: 'Playback Lab', description: 'Timeline and frame history' },
  { to: '/exports', label: 'Exports', description: 'Jobs and downloads' },
  { to: '/snapshots', label: 'Snapshots', description: 'Evidence and history' },
  { to: '/config', label: 'Configuration', description: 'Origins, stream, and workspace' },
] as const

const pageMeta: Record<
  string,
  { eyebrow: string; title: string; description: string }
> = {
  '/': {
    eyebrow: 'Control room',
    title: 'Camera operations designed like a modern video desk',
    description:
      'Live, playback, exports, snapshots, and configuration now sit inside one cinematic operator workspace instead of scattered utility panels.',
  },
  '/live': {
    eyebrow: 'Live deck',
    title: 'Elegant live monitoring with signal context',
    description:
      'A cleaner stage for the current stream, signal health, and origin visibility without the old hardcoded feel.',
  },
  '/playback': {
    eyebrow: 'Playback lab',
    title: 'Recorded history should feel scrub-able, visual, and precise',
    description:
      'This area is turning into a proper replay workspace with storyboard frames, a time rail, and range-driven review.',
  },
  '/exports': {
    eyebrow: 'Export desk',
    title: 'Background jobs and evidence delivery',
    description:
      'Exports stay close to operations, with room for queue state, delivery history, and operator feedback.',
  },
  '/snapshots': {
    eyebrow: 'Snapshot desk',
    title: 'Visual evidence should read like a review workflow',
    description:
      'Snapshots are treated as evidence objects with history, metadata, and room for future case actions.',
  },
  '/config': {
    eyebrow: 'Configuration',
    title: 'Connection setup should feel operational, not technical debt',
    description:
      'Origins, stream target, and polling settings are presented as a clean workspace, not a pile of raw fields.',
  },
}

export function AppShell() {
  const location = useLocation()
  const { hasApiConfig, hasLiveConfig } = useConfig()
  const currentMeta = pageMeta[location.pathname] ?? pageMeta['/']

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <section className="brand-panel">
          <div className="brand-orb" aria-hidden="true" />
          <span className="eyebrow">Streaming workspace</span>
          <h1>Streaming Control Center</h1>
          <p>
            A media-first operator console for live, playback, evidence, and
            recorder actions.
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
          <span className="eyebrow">Readiness</span>
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

        <section className="sidebar-card sidebar-callout">
          <span className="eyebrow">Design direction</span>
          <p>
            More video surface, less form clutter. The product now reads like a
            control deck instead of a test page.
          </p>
        </section>
      </aside>

      <main className="content-area">
        <header className="topbar">
          <div className="page-heading">
            <span className="eyebrow">{currentMeta.eyebrow}</span>
            <h2>{currentMeta.title}</h2>
            <p>{currentMeta.description}</p>
          </div>

          <div className="status-row">
            <span className={`badge ${hasApiConfig ? 'success' : 'warning'}`}>
              API {hasApiConfig ? 'set' : 'pending'}
            </span>
            <span className={`badge ${hasLiveConfig ? 'success' : 'warning'}`}>
              live {hasLiveConfig ? 'ready' : 'incomplete'}
            </span>
            <span className="badge neutral">operator ui</span>
          </div>
        </header>

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
