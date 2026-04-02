import { defaultLocale, type Locale } from '../../shared/i18n/messages'

export interface UiPreferences {
  locale: Locale
}

export const uiPreferencesStorageKey =
  'streaming-control-center/ui-preferences/v1'

export const defaultUiPreferences: UiPreferences = {
  locale: defaultLocale,
}
