import type { TranslationKey } from '../../shared/i18n/messages'
import { hostnameFromUrl } from '../../shared/utils/url'
import type { AppConfig } from './config.types'

export interface ConnectionModeInfo {
  modeKey: TranslationKey
  noteKey: TranslationKey
  tone: 'neutral' | 'warning' | 'danger' | 'success'
}

function isIpAddress(hostname: string) {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)
}

function isPrivateIp(hostname: string) {
  if (!isIpAddress(hostname)) {
    return false
  }

  const [a, b] = hostname.split('.').map(Number)

  return (
    a === 10 ||
    a === 127 ||
    (a === 192 && b === 168) ||
    (a === 172 && b >= 16 && b <= 31)
  )
}

function isPublicIp(hostname: string) {
  return isIpAddress(hostname) && !isPrivateIp(hostname)
}

function isLocalHost(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1'
}

function usesInsecureHttp(baseUrl: string) {
  return /^http:\/\//i.test(baseUrl)
}

export function describeConnectionMode(config: AppConfig): ConnectionModeInfo {
  if (!config.apiBase && !config.mediaBase) {
    return {
      modeKey: 'connection.mode.pending',
      noteKey: 'connection.note.pending',
      tone: 'neutral',
    }
  }

  const apiHost = hostnameFromUrl(config.apiBase)
  const mediaHost = hostnameFromUrl(config.mediaBase)
  const httpsPage = window.location.protocol === 'https:'

  if (
    httpsPage &&
    (usesInsecureHttp(config.apiBase) || usesInsecureHttp(config.mediaBase))
  ) {
    return {
      modeKey: 'connection.mode.mixedContent',
      noteKey: 'connection.note.mixedContent',
      tone: 'danger',
    }
  }

  if (isLocalHost(apiHost) && isLocalHost(mediaHost)) {
    return {
      modeKey: 'connection.mode.localOnly',
      noteKey: 'connection.note.localOnly',
      tone: 'success',
    }
  }

  if (isPrivateIp(apiHost) || isPrivateIp(mediaHost)) {
    return {
      modeKey: 'connection.mode.privateLan',
      noteKey: 'connection.note.privateLan',
      tone: 'warning',
    }
  }

  if (isPublicIp(apiHost) || isPublicIp(mediaHost)) {
    return {
      modeKey: 'connection.mode.publicEdge',
      noteKey: 'connection.note.publicEdge',
      tone: 'danger',
    }
  }

  return {
    modeKey: 'connection.mode.custom',
    noteKey: 'connection.note.custom',
    tone: 'neutral',
  }
}
