import { hostnameFromUrl } from '../../shared/utils/url'
import type { AppConfig } from './config.types'

export interface ConnectionModeInfo {
  mode: string
  note: string
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
      mode: 'pending',
      note: 'Set the recorder API and media origin first. The new app intentionally avoids dead default links.',
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
      mode: 'mixed content',
      note: 'The UI is running on HTTPS while one or more targets still use HTTP. Browsers may block fetches, snapshots, or HLS playback.',
      tone: 'danger',
    }
  }

  if (isLocalHost(apiHost) && isLocalHost(mediaHost)) {
    return {
      mode: 'local only',
      note: 'Everything points to localhost. Great for development, but only this machine can reach the services unless a proxy is added.',
      tone: 'success',
    }
  }

  if (isPrivateIp(apiHost) || isPrivateIp(mediaHost)) {
    return {
      mode: 'private LAN',
      note: 'The stack is on a private address range. Access depends on LAN or VPN reachability.',
      tone: 'warning',
    }
  }

  if (isPublicIp(apiHost) || isPublicIp(mediaHost)) {
    return {
      mode: 'public edge',
      note: 'The stack points to a public IP. Add authentication and network controls if recorder endpoints are reachable from the internet.',
      tone: 'danger',
    }
  }

  return {
    mode: 'custom',
    note: 'Custom hostnames are in play. Validate DNS, TLS, CORS, and firewall rules as part of rollout.',
    tone: 'neutral',
  }
}
