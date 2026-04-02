export interface CameraOption {
  id: string
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
