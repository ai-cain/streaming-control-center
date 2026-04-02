import { useEffect, useState, type RefObject } from 'react'
import type { TranslationKey } from '../../shared/i18n/messages'

type PlayerStatus = 'idle' | 'loading' | 'playing' | 'unsupported' | 'error'

interface HlsPlayerState {
  fallbackMessage?: string
  messageKey: TranslationKey
  status: PlayerStatus
}

export function useHlsPlayer(
  videoRef: RefObject<HTMLVideoElement | null>,
  manifestUrl: string,
  enabled: boolean,
): HlsPlayerState {
  const [playerState, setPlayerState] = useState<HlsPlayerState>({
    messageKey: 'live.hls.idle',
    status: 'idle',
  })

  useEffect(() => {
    const videoElement = videoRef.current

    if (!videoElement) {
      return
    }

    const resetVideoElement = () => {
      videoElement.pause()
      videoElement.removeAttribute('src')
      videoElement.load()
    }

    if (!enabled || !manifestUrl) {
      resetVideoElement()
      setPlayerState({
        messageKey: 'live.hls.idle',
        status: 'idle',
      })
      return
    }

    let isDisposed = false
    let destroyPlayback: (() => void) | null = null

    setPlayerState({
      messageKey: 'live.hls.loadingManifest',
      status: 'loading',
    })

    if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = manifestUrl
      videoElement.play().catch(() => {
        if (!isDisposed) {
          setPlayerState({
            messageKey: 'live.hls.manifestLoaded',
            status: 'loading',
          })
        }
      })

      if (!isDisposed) {
        setPlayerState({
          messageKey: 'live.hls.playingNative',
          status: 'playing',
        })
      }

      destroyPlayback = () => {
        resetVideoElement()
      }
    } else {
      void import('hls.js')
        .then(({ default: Hls }) => {
          if (isDisposed) {
            return
          }

          if (!Hls.isSupported()) {
            setPlayerState({
              messageKey: 'live.hls.unsupported',
              status: 'unsupported',
            })
            return
          }

          const hlsPlayer = new Hls({
            liveSyncDurationCount: 3,
          })

          destroyPlayback = () => {
            hlsPlayer.destroy()
          }

          hlsPlayer.loadSource(manifestUrl)
          hlsPlayer.attachMedia(videoElement)

          hlsPlayer.on(Hls.Events.MANIFEST_PARSED, () => {
            videoElement.play().catch(() => {
              if (!isDisposed) {
                setPlayerState({
                  messageKey: 'live.hls.manifestLoaded',
                  status: 'loading',
                })
              }
            })

            if (!isDisposed) {
              setPlayerState({
                messageKey: 'live.hls.playingHlsJs',
                status: 'playing',
              })
            }
          })

          hlsPlayer.on(Hls.Events.ERROR, (_event, data) => {
            if (!data.fatal || isDisposed) {
              return
            }

            setPlayerState({
              fallbackMessage: data.details || undefined,
              messageKey: 'live.hls.fatalError',
              status: 'error',
            })
          })
        })
        .catch(() => {
          if (!isDisposed) {
            setPlayerState({
              messageKey: 'live.hls.runtimeLoadError',
              status: 'error',
            })
          }
        })
    }

    return () => {
      isDisposed = true

      if (destroyPlayback) {
        destroyPlayback()
      } else {
        resetVideoElement()
      }
    }
  }, [enabled, manifestUrl, videoRef])

  return playerState
}
