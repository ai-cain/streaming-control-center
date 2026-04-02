import { joinUrl } from '../../shared/utils/url'
import type { TranslationKey } from '../../shared/i18n/messages'
import type { AppConfig } from './config.types'

export interface EndpointDefinition {
  id: string
  labelKey: TranslationKey
  method: 'GET' | 'POST'
  url: string
}

function previewApiUrl(apiBase: string, path: string) {
  return apiBase ? joinUrl(apiBase, path) : path
}

export function buildLiveManifestUrl(config: AppConfig) {
  if (!config.mediaBase || !config.app || !config.streamKey) {
    return ''
  }

  return joinUrl(config.mediaBase, `${config.app}/${config.streamKey}/index.m3u8`)
}

export function buildEndpointCatalog(config: AppConfig): EndpointDefinition[] {
  return [
    {
      id: 'live-manifest',
      labelKey: 'endpoint.liveManifest',
      method: 'GET',
      url:
        buildLiveManifestUrl(config) || '/{mediaBase}/{app}/{streamKey}/index.m3u8',
    },
    {
      id: 'health',
      labelKey: 'endpoint.health',
      method: 'GET',
      url: previewApiUrl(config.apiBase, '/api/recording/health'),
    },
    {
      id: 'status',
      labelKey: 'endpoint.status',
      method: 'GET',
      url: previewApiUrl(config.apiBase, '/api/recording/status'),
    },
    {
      id: 'playback',
      labelKey: 'endpoint.playback',
      method: 'GET',
      url: previewApiUrl(
        config.apiBase,
        '/api/recording/playback?camera={id}&from={YYYY-MM-DD HH:mm:ss}&to={YYYY-MM-DD HH:mm:ss}',
      ),
    },
    {
      id: 'available',
      labelKey: 'endpoint.available',
      method: 'GET',
      url: previewApiUrl(
        config.apiBase,
        '/api/recording/playback/available?camera={id}&date={YYYY-MM-DD}',
      ),
    },
    {
      id: 'exports-create',
      labelKey: 'endpoint.exportsCreate',
      method: 'POST',
      url: previewApiUrl(config.apiBase, '/api/recording/export'),
    },
    {
      id: 'exports-list',
      labelKey: 'endpoint.exportsList',
      method: 'GET',
      url: previewApiUrl(config.apiBase, '/api/recording/export'),
    },
    {
      id: 'snapshot-latest',
      labelKey: 'endpoint.snapshotLatest',
      method: 'GET',
      url: previewApiUrl(
        config.apiBase,
        '/api/recording/snapshot/{camera}/latest',
      ),
    },
    {
      id: 'snapshot-history',
      labelKey: 'endpoint.snapshotHistory',
      method: 'GET',
      url: previewApiUrl(
        config.apiBase,
        '/api/recording/snapshot/{camera}/history?limit=5',
      ),
    },
  ]
}

export function pickEndpoints(
  catalog: EndpointDefinition[],
  ids: string[],
): EndpointDefinition[] {
  const selected = new Set(ids)

  return catalog.filter((endpoint) => selected.has(endpoint.id))
}
