export function normalizeBaseUrl(value: string) {
  let normalized = value.trim()

  if (!normalized) {
    return ''
  }

  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `http://${normalized}`
  }

  return normalized.replace(/\/+$/, '')
}

export function joinUrl(base: string, path: string) {
  if (!base) {
    return path
  }

  return `${base}${path.startsWith('/') ? '' : '/'}${path}`
}

export function hostnameFromUrl(url: string) {
  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}

export function safeOrigin() {
  return window.location.origin === 'null'
    ? 'file:// (origin unavailable)'
    : window.location.origin
}
