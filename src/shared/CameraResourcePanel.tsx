import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { cameraCatalog } from './camera-catalog'

interface CameraResourcePanelProps {
  selectedCameraId: string
  onSelectCamera: (cameraId: string) => void
}

export function CameraResourcePanel({
  selectedCameraId,
  onSelectCamera,
}: CameraResourcePanelProps) {
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState<'group' | 'list'>('group')

  const filteredCameras = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return cameraCatalog
    }

    return cameraCatalog.filter((camera) => {
      const haystack = `${camera.label} ${camera.shortLabel} ${camera.siteName}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [query])

  const groupedCameras = useMemo(() => {
    const groups = new Map<string, typeof cameraCatalog>()

    filteredCameras.forEach((camera) => {
      const existingGroup = groups.get(camera.siteName) ?? []
      groups.set(camera.siteName, [...existingGroup, camera])
    })

    return Array.from(groups.entries()).map(([name, cameras]) => ({ name, cameras }))
  }, [filteredCameras])

  return (
    <aside className="resource-panel">
      <div className="resource-panel-header">
        <span className="section-title">Monitoring</span>
        <div className="resource-switch">
          <button
            className={`resource-switch-button${viewMode === 'group' ? ' active' : ''}`}
            onClick={() => setViewMode('group')}
            type="button"
          >
            Group
          </button>
          <button
            className={`resource-switch-button${viewMode === 'list' ? ' active' : ''}`}
            onClick={() => setViewMode('list')}
            type="button"
          >
            List
          </button>
        </div>
      </div>

      <label className="resource-search">
        <span>Search</span>
        <input
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search camera or group"
          spellCheck="false"
          value={query}
        />
      </label>

      <div className="resource-tree">
        {viewMode === 'group'
          ? groupedCameras.map((group) => (
              <section className="resource-group" key={group.name}>
                <strong>{group.name}</strong>
                {group.cameras.map((camera) => (
                  <button
                    className={`resource-item${camera.id === selectedCameraId ? ' active' : ''}`}
                    key={camera.id}
                    onClick={() => onSelectCamera(camera.id)}
                    type="button"
                  >
                    {camera.label}
                  </button>
                ))}
              </section>
            ))
          : filteredCameras.map((camera) => (
              <button
                className={`resource-item${camera.id === selectedCameraId ? ' active' : ''}`}
                key={camera.id}
                onClick={() => onSelectCamera(camera.id)}
                type="button"
              >
                {camera.label}
              </button>
            ))}
      </div>

      <Link className="resource-config-link" to="/config">
        Open settings
      </Link>
    </aside>
  )
}
