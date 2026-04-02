import { cameraCatalog } from '../../shared/camera-catalog'

interface CameraStripProps {
  activeCameraIds: string[]
  onToggleCamera: (cameraId: string) => void
}

export function CameraStrip({ activeCameraIds, onToggleCamera }: CameraStripProps) {
  const activeSet = new Set(activeCameraIds)

  return (
    <div className="camera-strip">
      <span className="camera-strip-title">Cameras</span>
      <div className="camera-strip-track">
        {cameraCatalog.map((camera) => {
          const isActive = activeSet.has(camera.id)
          return (
            <button
              className={`strip-cam${isActive ? ' active' : ''}`}
              key={camera.id}
              onClick={() => onToggleCamera(camera.id)}
              title={camera.stageLabel}
              type="button"
            >
              {isActive && <span className="strip-cam-dot" />}
              <span className="strip-cam-id">CAM {camera.numericId}</span>
              <span className="strip-cam-name">{camera.stageLabel}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
