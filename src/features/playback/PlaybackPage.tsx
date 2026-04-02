import { Link } from 'react-router-dom'
import { useState, type CSSProperties } from 'react'
import { CameraResourcePanel } from '../../shared/CameraResourcePanel'
import { cameraCatalog, getCameraById, getCameraByNumericId } from '../../shared/camera-catalog'
import { fetchPlaybackClip } from '../../shared/api/recorder-api'
import { useConfig } from '../config/config-context'
import { buildEndpointCatalog, pickEndpoints } from '../config/endpoints'

interface StoryFrame {
  id: string
  time: string
  zone: string
  note: string
  startColor: string
  endColor: string
}

const storyFrames: StoryFrame[] = [
  {
    id: 'f-01',
    time: '10:02:14',
    zone: 'Gate A',
    note: 'Entry movement detected',
    startColor: '#242c34',
    endColor: '#5b6d7f',
  },
  {
    id: 'f-02',
    time: '10:08:47',
    zone: 'Gate A',
    note: 'Subject pauses at barrier',
    startColor: '#222a31',
    endColor: '#6d7f8f',
  },
  {
    id: 'f-03',
    time: '10:15:26',
    zone: 'South lane',
    note: 'Vehicle enters frame',
    startColor: '#1d232a',
    endColor: '#728392',
  },
  {
    id: 'f-04',
    time: '10:22:11',
    zone: 'South lane',
    note: 'Crossing zone highlighted',
    startColor: '#20262c',
    endColor: '#566577',
  },
  {
    id: 'f-05',
    time: '10:31:42',
    zone: 'Front dock',
    note: 'Low activity interval',
    startColor: '#1f252c',
    endColor: '#667483',
  },
  {
    id: 'f-06',
    time: '10:44:08',
    zone: 'Front dock',
    note: 'Operator marker added',
    startColor: '#20272f',
    endColor: '#768899',
  },
  {
    id: 'f-07',
    time: '10:53:39',
    zone: 'North lane',
    note: 'Motion cluster near curb',
    startColor: '#22282f',
    endColor: '#5d7384',
  },
  {
    id: 'f-08',
    time: '11:00:00',
    zone: 'North lane',
    note: 'Clip end',
    startColor: '#20262e',
    endColor: '#6a7987',
  },
]

const videoSegments = [
  { start: 0, width: 18, tone: 'dense' },
  { start: 21, width: 16, tone: 'calm' },
  { start: 43, width: 14, tone: 'dense' },
  { start: 60, width: 24, tone: 'calm' },
  { start: 86, width: 10, tone: 'dense' },
] as const

const motionBars = [12, 28, 16, 44, 18, 52, 24, 38, 16, 48, 22, 14, 40, 18, 34, 12]

const tickLabels = ['10:00', '10:10', '10:20', '10:30', '10:40', '10:50', '11:00']

export function PlaybackPage() {
  const { config } = useConfig()
  const endpoints = pickEndpoints(buildEndpointCatalog(config), ['playback', 'available'])
  const [selectedFrameIndex, setSelectedFrameIndex] = useState(3)
  const [selectedCameraId, setSelectedCameraId] = useState('camera-2')

  const today = new Date().toISOString().slice(0, 10)
  const [date, setDate] = useState(today)
  const [fromTime, setFromTime] = useState('08:00')
  const [toTime, setToTime] = useState('10:00')
  const [isLoading, setIsLoading] = useState(false)
  const [clipError, setClipError] = useState<string | null>(null)

  const selectedCamera = getCameraById(selectedCameraId)
  const currentFrame = storyFrames[selectedFrameIndex]
  const playheadPercent =
    storyFrames.length > 1
      ? (selectedFrameIndex / (storyFrames.length - 1)) * 100
      : 0

  const stageStyle = {
    '--frame-start': currentFrame.startColor,
    '--frame-end': currentFrame.endColor,
  } as CSSProperties

  const applyPreset = (hours: number) => {
    const now = new Date()
    const startHour = now.getHours()
    const endHour = Math.min(startHour + hours, 23)
    setDate(today)
    setFromTime(`${String(startHour).padStart(2, '0')}:00`)
    setToTime(`${String(endHour).padStart(2, '0')}:00`)
  }

  const loadClip = async () => {
    if (!config.apiBase) {
      setClipError('Configure the API base URL in Settings first.')
      return
    }
    setIsLoading(true)
    setClipError(null)
    try {
      await fetchPlaybackClip(
        config.apiBase,
        selectedCamera.numericId,
        `${date} ${fromTime}:00`,
        `${date} ${toTime}:00`,
      )
      // TODO: replace mock timeline with API response data
    } catch (err) {
      setClipError(err instanceof Error ? err.message : 'Failed to load clip.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="monitor-page">
      <CameraResourcePanel
        onSelectCamera={setSelectedCameraId}
        selectedCameraId={selectedCamera.id}
      />

      <div className="monitor-content">
        <div className="monitor-toolbar">
          <div className="monitor-toolbar-left">
            <div className="monitor-select">{selectedCamera.shortLabel} playback</div>
            <div className="mode-switch">
              <Link className="mode-tab" to="/live">
                Live View
              </Link>
              <span className="mode-tab active">Playback</span>
            </div>
          </div>

          <Link className="toolbar-link" to="/config">
            Settings
          </Link>
        </div>

        <section className="toolbar-panel">
          <div className="toolbar-group">
            <label className="toolbar-field">
              <span>Camera</span>
              <select
                onChange={(event) => {
                  const nextCamera = getCameraByNumericId(event.target.value)
                  if (nextCamera) {
                    setSelectedCameraId(nextCamera.id)
                  }
                }}
                value={selectedCamera.numericId}
              >
                {cameraCatalog.map((camera) => (
                  <option key={camera.id} value={camera.numericId}>
                    {camera.shortLabel}
                  </option>
                ))}
              </select>
            </label>

            <label className="toolbar-field">
              <span>Date</span>
              <input
                max={today}
                onChange={(event) => setDate(event.target.value)}
                type="date"
                value={date}
              />
            </label>

            <label className="toolbar-field">
              <span>From</span>
              <input
                onChange={(event) => setFromTime(event.target.value)}
                type="time"
                value={fromTime}
              />
            </label>

            <label className="toolbar-field">
              <span>To</span>
              <input
                onChange={(event) => setToTime(event.target.value)}
                type="time"
                value={toTime}
              />
            </label>
          </div>

          <div className="toolbar-actions">
            {clipError && <span className="clip-error">{clipError}</span>}
            <button className="button secondary" onClick={() => applyPreset(1)} type="button">
              1 hour
            </button>
            <button className="button secondary" onClick={() => applyPreset(3)} type="button">
              3 hours
            </button>
            <button
              className="button"
              disabled={isLoading}
              onClick={loadClip}
              type="button"
            >
              {isLoading ? 'Loading…' : 'Load clip'}
            </button>
          </div>
        </section>

        <div className="playback-grid">
          <section className="stage-panel">
            <div className="stage-toolbar">
              <div>
                <span className="section-title">Playback Viewer</span>
                <h3>
                  {selectedCamera.shortLabel} / {currentFrame.zone}
                </h3>
              </div>

              <div className="stage-toolbar-meta">
                <span className="pill accent">recorded</span>
                <span className="pill">{currentFrame.time}</span>
              </div>
            </div>

            <div className="stage-screen playback-screen" style={stageStyle}>
              <div className="screen-grid" aria-hidden="true" />
              <div className="screen-overlay">
                <span className="screen-badge">Playback</span>
                <strong>{currentFrame.time}</strong>
                <small>{currentFrame.note}</small>
              </div>
            </div>

            <div className="stage-footer">
              <div className="stage-footer-field">
                <span>Range</span>
                <strong>
                  {date} {fromTime} — {toTime}
                </strong>
              </div>
              <div className="stage-footer-field">
                <span>Selection</span>
                <strong>{currentFrame.zone}</strong>
              </div>
              <div className="stage-footer-field">
                <span>Availability</span>
                <strong>Continuous segments / 61 min</strong>
              </div>
              <div className="stage-footer-field">
                <span>Marker</span>
                <strong>{currentFrame.note}</strong>
              </div>
            </div>
          </section>

          <aside className="side-stack">
            <section className="panel compact-panel">
              <span className="section-title">Clip Summary</span>
              <div className="detail-list">
                <div className="detail-row">
                  <span className="muted">Selected frame</span>
                  <strong>{currentFrame.time}</strong>
                </div>
                <div className="detail-row">
                  <span className="muted">Zone</span>
                  <strong>{currentFrame.zone}</strong>
                </div>
                <div className="detail-row">
                  <span className="muted">Comment</span>
                  <strong>{currentFrame.note}</strong>
                </div>
              </div>
            </section>

            <section className="panel compact-panel">
              <span className="section-title">Playback API</span>
              <div className="endpoint-list">
                {endpoints.map((endpoint) => (
                  <div className="endpoint-row compact-endpoint" key={endpoint.id}>
                    <div className="endpoint-body">
                      <strong>{endpoint.label}</strong>
                      <code>{endpoint.url}</code>
                    </div>
                    <span className={`endpoint-method ${endpoint.method.toLowerCase()}`}>
                      {endpoint.method}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <section className="timeline-panel">
          <div className="timeline-header">
            <div>
              <span className="section-title">Recorded Timeline</span>
              <h3>Storyboard and segment review</h3>
            </div>

            <div className="timeline-current">
              <span>Current pointer</span>
              <strong>{currentFrame.time}</strong>
            </div>
          </div>

          <div className="timeline-ruler">
            {tickLabels.map((tickLabel) => (
              <span key={tickLabel}>{tickLabel}</span>
            ))}
          </div>

          <div className="timeline-body">
            <div className="timeline-playhead" style={{ left: `${playheadPercent}%` }} />

            <div className="thumbnail-row">
              {storyFrames.map((frame, index) => {
                const thumbnailStyle = {
                  '--thumb-start': frame.startColor,
                  '--thumb-end': frame.endColor,
                } as CSSProperties

                return (
                  <button
                    className={`thumbnail-card${index === selectedFrameIndex ? ' active' : ''}`}
                    key={frame.id}
                    onClick={() => setSelectedFrameIndex(index)}
                    style={thumbnailStyle}
                    type="button"
                  >
                    <span className="thumbnail-time">{frame.time}</span>
                    <span className="thumbnail-note">{frame.zone}</span>
                  </button>
                )
              })}
            </div>

            <div className="lane-row">
              <span className="lane-label">Video</span>
              <div className="lane-track">
                {videoSegments.map((segment, index) => (
                  <span
                    className={`lane-segment ${segment.tone}`}
                    key={`${segment.start}-${segment.width}-${index}`}
                    style={{ left: `${segment.start}%`, width: `${segment.width}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="lane-row">
              <span className="lane-label">Motion</span>
              <div className="lane-track lane-track-wave">
                {motionBars.map((bar, index) => (
                  <span
                    className="wave-bar"
                    key={`${bar}-${index}`}
                    style={{ height: `${bar}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <input
            className="timeline-slider"
            max={storyFrames.length - 1}
            min={0}
            onChange={(event) => setSelectedFrameIndex(Number(event.target.value))}
            step={1}
            type="range"
            value={selectedFrameIndex}
          />
        </section>
      </div>
    </div>
  )
}
