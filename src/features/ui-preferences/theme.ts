export const defaultTheme = 'light' as const
export const supportedThemes = ['light', 'dark'] as const

export type Theme = (typeof supportedThemes)[number]

export function normalizeTheme(value: string | null | undefined): Theme {
  if (!value) {
    return defaultTheme
  }

  return supportedThemes.includes(value as Theme)
    ? (value as Theme)
    : defaultTheme
}
