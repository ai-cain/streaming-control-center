import type {
  RecorderHealth,
  RecordingStatusItem,
} from '../types/recorder'
import { joinUrl } from '../utils/url'
import { fetchJson } from './http-client'

export function buildRecorderHealthUrl(apiBase: string) {
  return joinUrl(apiBase, '/api/recording/health')
}

export function buildRecordingStatusUrl(apiBase: string) {
  return joinUrl(apiBase, '/api/recording/status')
}

export async function fetchRecorderHealth(apiBase: string) {
  return fetchJson<RecorderHealth>(buildRecorderHealthUrl(apiBase))
}

export async function fetchRecordingStatus(apiBase: string) {
  return fetchJson<RecordingStatusItem[]>(buildRecordingStatusUrl(apiBase))
}

export async function fetchPlaybackClip(
  apiBase: string,
  cameraId: string,
  from: string,
  to: string,
) {
  const params = new URLSearchParams({ camera: cameraId, from, to })
  return fetchJson<{ playlist_url: string; segments_count: number; total_duration_seconds: number }>(
    `${joinUrl(apiBase, '/api/recording/playback')}?${params}`
  )
}

export async function fetchAvailableRecordings(apiBase: string, cameraId: string, date: string) {
  const params = new URLSearchParams({ camera: cameraId, date })
  return fetchJson<{ idCamera: number; date: string; available_hours: number[] }>(
    `${joinUrl(apiBase, '/api/recording/playback/available')}?${params}`
  )
}

export async function fetchLatestSnapshot(apiBase: string, cameraId: string) {
  return fetchJson<{
    idCamera: number
    takenAt: string
    url: string
    widthPx: number | null
    heightPx: number | null
    fileSizeBytes: number | null
  }>(joinUrl(apiBase, `/api/recording/snapshot/${cameraId}/latest`))
}

export async function createExportJob(
  apiBase: string,
  idCamera: number,
  start: string,
  end: string,
  requestedBy?: string,
) {
  return fetchJson<{ jobId: number; status: string; message: string }>(
    joinUrl(apiBase, '/api/recording/export'),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_camera: idCamera, start, end, requested_by: requestedBy }),
    }
  )
}

export async function fetchExportJob(apiBase: string, jobId: number) {
  return fetchJson<{
    jobId: number
    idCamera: number
    start: string
    end: string
    status: string
    downloadUrl: string | null
    fileSizeBytes: number | null
    error: string | null
  }>(joinUrl(apiBase, `/api/recording/export/${jobId}`))
}

export async function fetchSessions(apiBase: string, cameraId?: string, limit = 20) {
  const params = new URLSearchParams({ limit: String(limit) })
  if (cameraId) params.set('camera', cameraId)
  return fetchJson<{ sessions: Array<{
    id: number
    id_Camera: number
    startedAt: string
    endedAt: string | null
    status: string
    processId: string
    outputRootPath: string
  }> }>(`${joinUrl(apiBase, '/api/recording/sessions')}?${params}`)
}
