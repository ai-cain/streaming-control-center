import { useUiPreferences } from '../ui-preferences/ui-preferences-context'
import {
  cameraCatalog,
  getCameraStageLabel,
} from '../../shared/camera-catalog'

interface CameraStripProps {
  activeCameraIds: string[]
  onToggleCamera: (cameraId: string) => void
}

export function CameraStrip({ activeCameraIds, onToggleCamera }: CameraStripProps) {
  const { t } = useUiPreferences()
  const activeSet = new Set(activeCameraIds)

  return (
    <div className="camera-strip">
      <span className="camera-strip-title">{t('live.cameraStrip.title')}</span>
      <div className="camera-strip-track">
        {cameraCatalog.map((camera) => {
          const isActive = activeSet.has(camera.id)
          const stageLabel = getCameraStageLabel(camera, t)

          return (
            <button
              className={`strip-cam${isActive ? ' active' : ''}`}
              key={camera.id}
              onClick={() => onToggleCamera(camera.id)}
              title={stageLabel}
              type="button"
            >
              {isActive && <span className="strip-cam-dot" />}
              <span className="strip-cam-id">CAM {camera.numericId}</span>
              <span className="strip-cam-name">{stageLabel}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
