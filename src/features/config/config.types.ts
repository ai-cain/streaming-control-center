export interface AppConfig {
  apiBase: string
  mediaBase: string
  app: string
  streamKey: string
  pollingMs: number
}

export const defaultConfig: AppConfig = {
  apiBase: 'https://backend.smartechlatam.online:1443',
  mediaBase: 'https://live.smartechlatam.online:1443',
  app: 'almaperu',
  streamKey: '',
  pollingMs: 10000,
}

export const configStorageKey = 'streaming-control-center/config/v1'
