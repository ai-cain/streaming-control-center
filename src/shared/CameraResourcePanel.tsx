import { Link } from 'react-router-dom'

const cameraGroups = [
  {
    name: 'Main Site',
    cameras: ['CANCHA 1', 'CANCHA 2', 'CANCHA 3'],
  },
] as const

interface CameraResourcePanelProps {
  selectedCamera: string
}

export function CameraResourcePanel({
  selectedCamera,
}: CameraResourcePanelProps) {
  return (
    <aside className="resource-panel">
      <div className="resource-panel-header">
        <span className="section-title">Monitoring</span>
        <div className="resource-switch">
          <button className="resource-switch-button active" type="button">
            Group
          </button>
          <button className="resource-switch-button" type="button">
            List
          </button>
        </div>
      </div>

      <label className="resource-search">
        <span>Search</span>
        <input placeholder="Search camera or group" spellCheck="false" />
      </label>

      <div className="resource-tree">
        {cameraGroups.map((group) => (
          <section className="resource-group" key={group.name}>
            <strong>{group.name}</strong>
            {group.cameras.map((camera) => (
              <button
                className={`resource-item${camera === selectedCamera ? ' active' : ''}`}
                key={camera}
                type="button"
              >
                {camera}
              </button>
            ))}
          </section>
        ))}
      </div>

      <Link className="resource-config-link" to="/config">
        Open settings
      </Link>
    </aside>
  )
}
