import { joinUrl } from '../../shared/utils/url'
import type { AppConfig } from './config.types'

export interface EndpointDefinition {
  id: string
  label: string
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
      label: 'Live HLS manifest',
      method: 'GET',
      url:
        buildLiveManifestUrl(config) || '/{mediaBase}/{app}/{streamKey}/index.m3u8',
    },
    {
      id: 'health',
      label: 'Recorder health',
      method: 'GET',
      url: previewApiUrl(config.apiBase, '/api/recording/health'),
    },
    {
      id: 'status',
      label: 'Recording status',
      method: 'GET',
      url: previewApiUrl(config.apiBase, '/api/recording/status'),
    },
    {
      id: 'playback',
      label: 'Playback range',
      method: 'GET',
      url: previewApiUrl(
        config.apiBase,
        '/api/recording/playback?camera={id}&from={YYYY-MM-DD HH:mm:ss}&to={YYYY-MM-DD HH:mm:ss}',
      ),
    },
    {
      id: 'available',
      label: 'Playback availability',
      method: 'GET',
      url: previewApiUrl(
        config.apiBase,
        '/api/recording/playback/available?camera={id}&date={YYYY-MM-DD}',
      ),
    },
    {
      id: 'exports-create',
      label: 'Create export job',
      method: 'POST',
      url: previewApiUrl(config.apiBase, '/api/recording/export'),
    },
    {
      id: 'exports-list',
      label: 'List export jobs',
      method: 'GET',
      url: previewApiUrl(config.apiBase, '/api/recording/export'),
    },
    {
      id: 'snapshot-latest',
      label: 'Latest snapshot',
      method: 'GET',
      url: previewApiUrl(
        config.apiBase,
        '/api/recording/snapshot/{camera}/latest',
      ),
    },
    {
      id: 'snapshot-history',
      label: 'Snapshot history',
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
