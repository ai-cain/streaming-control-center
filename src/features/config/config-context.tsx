/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { normalizeBaseUrl } from '../../shared/utils/url'
import { configStorageKey, defaultConfig, type AppConfig } from './config.types'

interface ConfigContextValue {
  config: AppConfig
  hasApiConfig: boolean
  hasLiveConfig: boolean
  replaceConfig: (nextConfig: AppConfig) => void
  updateConfig: (patch: Partial<AppConfig>) => void
  resetConfig: () => void
}

const ConfigContext = createContext<ConfigContextValue | null>(null)

function clampPollingMs(value: number) {
  return Math.min(60000, Math.max(3000, value))
}

export function sanitizeConfig(input: Partial<AppConfig> | null | undefined): AppConfig {
  return {
    apiBase: normalizeBaseUrl(input?.apiBase ?? defaultConfig.apiBase),
    mediaBase: normalizeBaseUrl(input?.mediaBase ?? defaultConfig.mediaBase),
    app: String(input?.app ?? defaultConfig.app).trim(),
    streamKey: String(input?.streamKey ?? defaultConfig.streamKey).trim(),
    pollingMs: clampPollingMs(Number(input?.pollingMs) || defaultConfig.pollingMs),
  }
}

function readStoredConfig() {
  if (typeof window === 'undefined') {
    return defaultConfig
  }

  const raw = window.localStorage.getItem(configStorageKey)

  if (!raw) {
    return defaultConfig
  }

  try {
    return sanitizeConfig(JSON.parse(raw) as Partial<AppConfig>)
  } catch {
    return defaultConfig
  }
}

function writeStoredConfig(config: AppConfig) {
  window.localStorage.setItem(configStorageKey, JSON.stringify(config))
}

interface ConfigProviderProps {
  children: ReactNode
}

export function ConfigProvider({ children }: ConfigProviderProps) {
  const [config, setConfig] = useState<AppConfig>(readStoredConfig)

  useEffect(() => {
    writeStoredConfig(config)
  }, [config])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === configStorageKey) {
        setConfig(readStoredConfig())
      }
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const value: ConfigContextValue = {
    config,
    hasApiConfig: Boolean(config.apiBase),
    hasLiveConfig: Boolean(
      config.apiBase && config.mediaBase && config.app && config.streamKey,
    ),
    replaceConfig: (nextConfig) => setConfig(sanitizeConfig(nextConfig)),
    updateConfig: (patch) =>
      setConfig((currentConfig) =>
        sanitizeConfig({ ...currentConfig, ...patch }),
      ),
    resetConfig: () => setConfig(defaultConfig),
  }

  return <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
}

export function useConfig() {
  const context = useContext(ConfigContext)

  if (!context) {
    throw new Error('useConfig must be used inside ConfigProvider.')
  }

  return context
}
