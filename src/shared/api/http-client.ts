function extractErrorMessage(payload: unknown) {
  if (typeof payload === 'string') {
    return payload
  }

  if (payload && typeof payload === 'object') {
    const maybeDetail = (payload as Record<string, unknown>).detail
    const maybeMessage = (payload as Record<string, unknown>).message

    if (typeof maybeDetail === 'string') {
      return maybeDetail
    }

    if (typeof maybeMessage === 'string') {
      return maybeMessage
    }
  }

  return null
}

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  const rawText = await response.text()

  let payload: unknown = {}

  if (rawText) {
    try {
      payload = JSON.parse(rawText)
    } catch {
      payload = { detail: rawText }
    }
  }

  if (!response.ok) {
    throw new Error(
      extractErrorMessage(payload) || `Request failed with HTTP ${response.status}.`,
    )
  }

  return payload as T
}
