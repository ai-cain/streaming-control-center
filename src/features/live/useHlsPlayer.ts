import { useEffect, useState, type RefObject } from 'react'

type PlayerStatus = 'idle' | 'loading' | 'playing' | 'unsupported' | 'error'

interface HlsPlayerState {
  status: PlayerStatus
  message: string
}

export function useHlsPlayer(
  videoRef: RefObject<HTMLVideoElement | null>,
  manifestUrl: string,
  enabled: boolean,
): HlsPlayerState {
  const [playerState, setPlayerState] = useState<HlsPlayerState>({
    status: 'idle',
    message: 'Add media base, app, and stream key to start live playback.',
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
        status: 'idle',
        message: 'Add media base, app, and stream key to start live playback.',
      })
      return
    }

    let isDisposed = false
    let destroyPlayback: (() => void) | null = null

    setPlayerState({
      status: 'loading',
      message: 'Loading HLS manifest...',
    })

    if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
      videoElement.src = manifestUrl
      videoElement.play().catch(() => {
        if (!isDisposed) {
          setPlayerState({
            status: 'loading',
            message: 'Manifest loaded. Press play if autoplay is blocked.',
          })
        }
      })

      if (!isDisposed) {
        setPlayerState({
          status: 'playing',
          message: 'Live playback is using native HLS support.',
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
              status: 'unsupported',
              message: 'This browser does not support HLS playback.',
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
                  status: 'loading',
                  message: 'Manifest loaded. Press play if autoplay is blocked.',
                })
              }
            })

            if (!isDisposed) {
              setPlayerState({
                status: 'playing',
                message: 'Live playback is running through hls.js.',
              })
            }
          })

          hlsPlayer.on(Hls.Events.ERROR, (_event, data) => {
            if (!data.fatal || isDisposed) {
              return
            }

            setPlayerState({
              status: 'error',
              message: data.details || 'The browser hit a fatal HLS playback error.',
            })
          })
        })
        .catch(() => {
          if (!isDisposed) {
            setPlayerState({
              status: 'error',
              message: 'The hls.js runtime could not be loaded.',
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
