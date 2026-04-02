import { describe, expect, it } from 'vitest'
import { defaultTheme, normalizeTheme } from './theme'

describe('normalizeTheme', () => {
  it('returns supported theme values as-is', () => {
    expect(normalizeTheme('light')).toBe('light')
    expect(normalizeTheme('dark')).toBe('dark')
  })

  it('falls back to the default theme when the input is invalid', () => {
    expect(normalizeTheme('system')).toBe(defaultTheme)
    expect(normalizeTheme('')).toBe(defaultTheme)
    expect(normalizeTheme(null)).toBe(defaultTheme)
  })
})
