import type { TranslationKey } from './i18n/messages'
import type { TranslateFn } from './i18n/translate'

export type CameraId = 'camera-1' | 'camera-2' | 'camera-3'

export interface CameraOption {
  id: CameraId
  numericId: string
  label: string
  shortLabel: string
  streamKey: string
  stageLabel: string
  siteName: string
}

export const cameraCatalog: CameraOption[] = [
  {
    id: 'camera-1',
    numericId: '1',
    label: 'CAMERA 1',
    shortLabel: 'Camera 1',
    streamKey: 'camera_01',
    stageLabel: 'North view',
    siteName: 'Main Site',
  },
  {
    id: 'camera-2',
    numericId: '2',
    label: 'CAMERA 2',
    shortLabel: 'Camera 2',
    streamKey: 'camera_02',
    stageLabel: 'Main view',
    siteName: 'Main Site',
  },
  {
    id: 'camera-3',
    numericId: '3',
    label: 'CAMERA 3',
    shortLabel: 'Camera 3',
    streamKey: 'camera_03',
    stageLabel: 'South view',
    siteName: 'Main Site',
  },
] as const

const cameraTranslationKeys: Record<
  CameraId,
  {
    label: TranslationKey
    shortLabel: TranslationKey
    siteName: TranslationKey
    stageLabel: TranslationKey
  }
> = {
  'camera-1': {
    label: 'camera.camera-1.label',
    shortLabel: 'camera.camera-1.short',
    siteName: 'camera.site.main',
    stageLabel: 'camera.camera-1.stage',
  },
  'camera-2': {
    label: 'camera.camera-2.label',
    shortLabel: 'camera.camera-2.short',
    siteName: 'camera.site.main',
    stageLabel: 'camera.camera-2.stage',
  },
  'camera-3': {
    label: 'camera.camera-3.label',
    shortLabel: 'camera.camera-3.short',
    siteName: 'camera.site.main',
    stageLabel: 'camera.camera-3.stage',
  },
}

export function getCameraById(cameraId: string) {
  return cameraCatalog.find((camera) => camera.id === cameraId) ?? cameraCatalog[0]
}

export function getCameraByNumericId(cameraId: string) {
  return (
    cameraCatalog.find((camera) => camera.numericId === cameraId.trim()) ?? null
  )
}

export function resolveCameraStreamKey(template: string, camera: CameraOption) {
  const trimmed = template.trim()

  if (!trimmed) {
    return camera.streamKey
  }

  if (trimmed.includes('{streamKey}')) {
    return trimmed.replaceAll('{streamKey}', camera.streamKey)
  }

  if (trimmed.includes('{id}')) {
    return trimmed.replaceAll('{id}', camera.numericId)
  }

  const trailingNumberMatch = trimmed.match(/^(.*?)(\d+)$/)

  if (trailingNumberMatch) {
    const [, prefix, digits] = trailingNumberMatch
    return `${prefix}${camera.numericId.padStart(digits.length, '0')}`
  }

  return trimmed
}

export function getCameraLabelKey(camera: CameraOption): TranslationKey {
  return cameraTranslationKeys[camera.id].label
}

export function getCameraShortLabelKey(camera: CameraOption): TranslationKey {
  return cameraTranslationKeys[camera.id].shortLabel
}

export function getCameraStageLabelKey(camera: CameraOption): TranslationKey {
  return cameraTranslationKeys[camera.id].stageLabel
}

export function getCameraSiteNameKey(camera: CameraOption): TranslationKey {
  return cameraTranslationKeys[camera.id].siteName
}

export function getCameraLabel(camera: CameraOption, t: TranslateFn) {
  return t(getCameraLabelKey(camera))
}

export function getCameraShortLabel(camera: CameraOption, t: TranslateFn) {
  return t(getCameraShortLabelKey(camera))
}

export function getCameraStageLabel(camera: CameraOption, t: TranslateFn) {
  return t(getCameraStageLabelKey(camera))
}

export function getCameraSiteName(camera: CameraOption, t: TranslateFn) {
  return t(getCameraSiteNameKey(camera))
}
