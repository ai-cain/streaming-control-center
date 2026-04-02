export interface AppConfig {
  apiBase: string
  mediaBase: string
  app: string
  streamKey: string
  pollingMs: number
}

export const defaultConfig: AppConfig = {
  apiBase: '',
  mediaBase: '',
  app: '',
  streamKey: '',
  pollingMs: 10000,
}

export const configStorageKey = 'streaming-control-center/config/v1'
