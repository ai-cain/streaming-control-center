export interface RecorderHealth {
  status?: string
  workers?: number
  [key: string]: unknown
}

export interface RecordingStatusItem {
  id_Camera?: number
  camera_id?: number
  camera_key?: string
  is_running?: boolean
  last_heartbeat?: string
  [key: string]: unknown
}
