/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  localeNames,
  supportedLocales,
  type Locale,
} from '../../shared/i18n/messages'
import {
  normalizeLocale,
  translate,
  type TranslateFn,
  type TranslationParams,
} from '../../shared/i18n/translate'
import {
  defaultUiPreferences,
  uiPreferencesStorageKey,
  type UiPreferences,
} from './ui-preferences.types'

interface UiPreferencesContextValue {
  locale: Locale
  localeOptions: Array<{
    value: Locale
    label: string
  }>
  setLocale: (nextLocale: Locale) => void
  t: TranslateFn
}

const UiPreferencesContext = createContext<UiPreferencesContextValue | null>(null)

function sanitizeUiPreferences(
  input: Partial<UiPreferences> | null | undefined,
): UiPreferences {
  return {
    locale: normalizeLocale(input?.locale),
  }
}

function readStoredUiPreferences() {
  if (typeof window === 'undefined') {
    return defaultUiPreferences
  }

  const raw = window.localStorage.getItem(uiPreferencesStorageKey)

  if (!raw) {
    return defaultUiPreferences
  }

  try {
    return sanitizeUiPreferences(JSON.parse(raw) as Partial<UiPreferences>)
  } catch {
    return defaultUiPreferences
  }
}

function writeStoredUiPreferences(preferences: UiPreferences) {
  window.localStorage.setItem(
    uiPreferencesStorageKey,
    JSON.stringify(preferences),
  )
}

interface UiPreferencesProviderProps {
  children: ReactNode
}

export function UiPreferencesProvider({
  children,
}: UiPreferencesProviderProps) {
  const [preferences, setPreferences] =
    useState<UiPreferences>(readStoredUiPreferences)

  useEffect(() => {
    writeStoredUiPreferences(preferences)
  }, [preferences])

  useEffect(() => {
    document.documentElement.lang = preferences.locale
  }, [preferences.locale])

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === uiPreferencesStorageKey) {
        setPreferences(readStoredUiPreferences())
      }
    }

    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const value = useMemo<UiPreferencesContextValue>(
    () => ({
      locale: preferences.locale,
      localeOptions: supportedLocales.map((locale) => ({
        value: locale,
        label: localeNames[locale],
      })),
      setLocale: (nextLocale) =>
        setPreferences((currentPreferences) =>
          sanitizeUiPreferences({
            ...currentPreferences,
            locale: nextLocale,
          }),
        ),
      t: (key, params: TranslationParams = {}) =>
        translate(preferences.locale, key, params),
    }),
    [preferences.locale],
  )

  return (
    <UiPreferencesContext.Provider value={value}>
      {children}
    </UiPreferencesContext.Provider>
  )
}

export function useUiPreferences() {
  const context = useContext(UiPreferencesContext)

  if (!context) {
    throw new Error(
      'useUiPreferences must be used inside UiPreferencesProvider.',
    )
  }

  return context
}
