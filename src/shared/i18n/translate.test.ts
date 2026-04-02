import { describe, expect, it } from 'vitest'
import { defaultLocale, normalizeLocale, translate } from './translate'

describe('normalizeLocale', () => {
  it('returns supported locales as-is', () => {
    expect(normalizeLocale('en')).toBe('en')
    expect(normalizeLocale('es')).toBe('es')
    expect(normalizeLocale('zh')).toBe('zh')
  })

  it('falls back to the default locale when the input is invalid', () => {
    expect(normalizeLocale('fr')).toBe(defaultLocale)
    expect(normalizeLocale('')).toBe(defaultLocale)
    expect(normalizeLocale(null)).toBe(defaultLocale)
  })
})

describe('translate', () => {
  it('returns the localized string for known keys', () => {
    expect(translate('en', 'nav.workspace')).toBe('Workspace')
    expect(translate('es', 'nav.workspace')).toBe('Espacio de trabajo')
    expect(translate('zh', 'nav.workspace')).toBe('工作区')
  })

  it('replaces interpolation params inside translation templates', () => {
    expect(
      translate('en', 'playback.selectedCameraPlayback', {
        camera: 'Camera 2',
      }),
    ).toBe('Camera 2 playback')

    expect(
      translate('es', 'playback.selectedCameraPlayback', {
        camera: 'Cámara 2',
      }),
    ).toBe('Reproducción de Cámara 2')

    expect(
      translate('zh', 'playback.selectedCameraPlayback', {
        camera: '摄像头 2',
      }),
    ).toBe('摄像头 2 回放')
  })
})
