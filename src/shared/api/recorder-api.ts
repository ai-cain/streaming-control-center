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
