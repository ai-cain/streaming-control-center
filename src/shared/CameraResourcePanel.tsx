import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useUiPreferences } from '../features/ui-preferences/ui-preferences-context'
import {
  cameraCatalog,
  getCameraLabel,
  getCameraShortLabel,
  getCameraSiteName,
  getCameraStageLabel,
} from './camera-catalog'

interface CameraResourcePanelProps {
  selectedCameraId: string
  onSelectCamera: (cameraId: string) => void
}

export function CameraResourcePanel({
  selectedCameraId,
  onSelectCamera,
}: CameraResourcePanelProps) {
  const { t } = useUiPreferences()
  const [query, setQuery] = useState('')
  const [viewMode, setViewMode] = useState<'group' | 'list'>('group')

  const filteredCameras = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) {
      return cameraCatalog
    }

    return cameraCatalog.filter((camera) => {
      const haystack = [
        getCameraLabel(camera, t),
        getCameraShortLabel(camera, t),
        getCameraStageLabel(camera, t),
        getCameraSiteName(camera, t),
      ]
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedQuery)
    })
  }, [query, t])

  const groupedCameras = useMemo(() => {
    const groups = new Map<string, typeof cameraCatalog>()

    filteredCameras.forEach((camera) => {
      const siteName = getCameraSiteName(camera, t)
      const existingGroup = groups.get(siteName) ?? []
      groups.set(siteName, [...existingGroup, camera])
    })

    return Array.from(groups.entries()).map(([name, cameras]) => ({ name, cameras }))
  }, [filteredCameras, t])

  return (
    <aside className="resource-panel">
      <div className="resource-panel-header">
        <span className="section-title">{t('resource.monitoring')}</span>
        <div className="resource-switch">
          <button
            className={`resource-switch-button${viewMode === 'group' ? ' active' : ''}`}
            onClick={() => setViewMode('group')}
            type="button"
          >
            {t('resource.view.group')}
          </button>
          <button
            className={`resource-switch-button${viewMode === 'list' ? ' active' : ''}`}
            onClick={() => setViewMode('list')}
            type="button"
          >
            {t('resource.view.list')}
          </button>
        </div>
      </div>

      <label className="resource-search">
        <span>{t('resource.search.label')}</span>
        <input
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('resource.search.placeholder')}
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
                    {getCameraLabel(camera, t)}
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
                {getCameraLabel(camera, t)}
              </button>
            ))}
      </div>

      <Link className="resource-config-link" to="/config">
        {t('resource.openSettings')}
      </Link>
    </aside>
  )
}
