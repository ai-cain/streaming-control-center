import { defaultLocale, type Locale } from '../../shared/i18n/messages'
import { defaultTheme, type Theme } from './theme'

export interface UiPreferences {
  locale: Locale
  theme: Theme
}

export const uiPreferencesStorageKey =
  'streaming-control-center/ui-preferences/v1'

export const defaultUiPreferences: UiPreferences = {
  locale: defaultLocale,
  theme: defaultTheme,
}
