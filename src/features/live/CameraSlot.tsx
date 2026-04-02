import { useRef } from 'react'
import {
  getCameraShortLabel,
  getCameraStageLabel,
  resolveCameraStreamKey,
  type CameraOption,
} from '../../shared/camera-catalog'
import type { AppConfig } from '../config/config.types'
import { buildLiveManifestUrl } from '../config/endpoints'
import { useUiPreferences } from '../ui-preferences/ui-preferences-context'
import { useHlsPlayer } from './useHlsPlayer'

interface CameraSlotProps {
  camera: CameraOption | null
  config: AppConfig
  onRemove: () => void
  slotIndex: number
}

export function CameraSlot({
  camera,
  config,
  onRemove,
  slotIndex,
}: CameraSlotProps) {
  const { t } = useUiPreferences()
  const videoRef = useRef<HTMLVideoElement>(null)

  const streamKey = camera ? resolveCameraStreamKey(config.streamKey, camera) : ''
  const manifestUrl = camera ? buildLiveManifestUrl({ ...config, streamKey }) : ''
  const enabled = Boolean(camera && config.mediaBase && config.app && streamKey)

  const playerState = useHlsPlayer(videoRef, manifestUrl, enabled)

  if (!camera) {
    return (
      <div className="camera-slot slot-empty">
        <span className="slot-placeholder-num">{slotIndex + 1}</span>
        <span className="slot-placeholder-hint">{t('live.slot.selectCamera')}</span>
      </div>
    )
  }

  const cameraShortLabel = getCameraShortLabel(camera, t)
  const cameraStageLabel = getCameraStageLabel(camera, t)
  const playerMessage = playerState.fallbackMessage ?? t(playerState.messageKey)

  return (
    <div className="camera-slot">
      <div className="slot-header">
        <span className="slot-label">{cameraShortLabel}</span>
        <div className="slot-header-meta">
          <span className={`slot-status-dot ${playerState.status}`} title={playerMessage} />
          <button
            aria-label={t('live.slot.removeCamera', { camera: cameraShortLabel })}
            className="slot-remove-btn"
            onClick={onRemove}
            type="button"
          >
            ×
          </button>
        </div>
      </div>
      <div className="slot-body">
        {enabled ? (
          <video autoPlay controls muted playsInline ref={videoRef} />
        ) : (
          <div className="slot-no-config">{cameraStageLabel}</div>
        )}
      </div>
    </div>
  )
}
