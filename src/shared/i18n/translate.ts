import {
  defaultLocale,
  messages,
  type Locale,
  type TranslationKey,
} from './messages'

export interface TranslationParams {
  [key: string]: number | string
}

export type TranslateFn = (
  key: TranslationKey,
  params?: TranslationParams,
) => string

export function isLocale(value: string): value is Locale {
  return Object.hasOwn(messages, value)
}

export function normalizeLocale(value: string | null | undefined): Locale {
  if (!value) {
    return defaultLocale
  }

  const normalized = value.toLowerCase().split('-')[0]
  return isLocale(normalized) ? normalized : defaultLocale
}

export function translate(
  locale: Locale,
  key: TranslationKey,
  params: TranslationParams = {},
) {
  const template = messages[locale][key] ?? messages[defaultLocale][key] ?? key

  return template.replace(/\{(\w+)\}/g, (_match, token: string) => {
    if (token in params) {
      return String(params[token])
    }

    return `{${token}}`
  })
}

export { defaultLocale }
