import { useEffect, useState, type ChangeEvent } from 'react'
import { safeOrigin } from '../../shared/utils/url'
import { describeConnectionMode } from './connection-mode'
import { sanitizeConfig, useConfig } from './config-context'
import { buildEndpointCatalog, buildLiveManifestUrl } from './endpoints'
import { defaultConfig, type AppConfig } from './config.types'

export function ConfigPage() {
  const { config, replaceConfig, resetConfig } = useConfig()
  const [draft, setDraft] = useState<AppConfig>(config)
  const previewConfig = sanitizeConfig(draft)
  const connectionMode = describeConnectionMode(previewConfig)
  const endpointCatalog = buildEndpointCatalog(previewConfig)
  const liveManifestUrl = buildLiveManifestUrl(previewConfig) || 'Not ready yet'

  useEffect(() => {
    setDraft(config)
  }, [config])

  const handleTextField =
    (field: keyof Omit<AppConfig, 'pollingMs'>) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value

      setDraft((currentDraft) => ({
        ...currentDraft,
        [field]: nextValue,
      }))
    }

  const handlePollingField = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = Number(event.target.value)

    setDraft((currentDraft) => ({
      ...currentDraft,
      pollingMs: Number.isFinite(nextValue) ? nextValue : currentDraft.pollingMs,
    }))
  }

  return (
    <div className="page-shell">
      <section className="page-banner compact">
        <div>
          <span className="section-title">Settings</span>
          <h2>Connection workspace</h2>
          <p>
            Configure recorder API, media origin, stream target, and polling. This
            page stays accessible because the app is mainly GET and POST driven.
          </p>
        </div>

        <div className={`signal-box ${connectionMode.tone}`}>
          <span className="signal-label">{connectionMode.mode}</span>
          <p>{connectionMode.note}</p>
        </div>
      </section>

      <section className="settings-grid">
        <article className="panel settings-card">
          <span className="section-title">Network</span>
          <label className="form-row">
            <span>Recorder API</span>
            <input
              onChange={handleTextField('apiBase')}
              placeholder="http://host:7000"
              spellCheck="false"
              value={draft.apiBase}
            />
          </label>
          <label className="form-row">
            <span>Media origin</span>
            <input
              onChange={handleTextField('mediaBase')}
              placeholder="http://host:8000"
              spellCheck="false"
              value={draft.mediaBase}
            />
          </label>
        </article>

        <article className="panel settings-card">
          <span className="section-title">Stream</span>
          <label className="form-row">
            <span>Application</span>
            <input
              onChange={handleTextField('app')}
              placeholder="main"
              spellCheck="false"
              value={draft.app}
            />
          </label>
          <label className="form-row">
            <span>Stream key template</span>
            <input
              onChange={handleTextField('streamKey')}
              placeholder="camera_{id} or camera_01"
              spellCheck="false"
              value={draft.streamKey}
            />
            <small className="field-note">
              Leave it blank to use the built-in camera mapping, or use {'{id}'} to
              switch per selected camera.
            </small>
          </label>
          <label className="form-row">
            <span>Polling</span>
            <input
              min={3000}
              onChange={handlePollingField}
              step={1000}
              type="number"
              value={draft.pollingMs}
            />
          </label>

          <div className="button-row">
            <button
              className="button"
              onClick={() => replaceConfig(previewConfig)}
              type="button"
            >
              Save settings
            </button>
            <button
              className="button secondary"
              onClick={() => {
                resetConfig()
                setDraft(defaultConfig)
              }}
              type="button"
            >
              Reset
            </button>
          </div>
        </article>
      </section>

      <div className="workspace-grid">
        <section className="panel compact-panel">
          <span className="section-title">Current Preview</span>
          <div className="detail-list">
            <div className="detail-row">
              <span className="muted">Recorder API</span>
              <code>{previewConfig.apiBase || 'Not configured'}</code>
            </div>
            <div className="detail-row">
              <span className="muted">Media origin</span>
              <code>{previewConfig.mediaBase || 'Not configured'}</code>
            </div>
            <div className="detail-row">
              <span className="muted">Live manifest</span>
              <code>{liveManifestUrl}</code>
            </div>
            <div className="detail-row">
              <span className="muted">Browser origin</span>
              <code>{safeOrigin()}</code>
            </div>
          </div>
        </section>

        <aside className="side-stack">
          <section className="panel compact-panel">
            <span className="section-title">Endpoint Register</span>
            <div className="endpoint-list">
              {endpointCatalog.map((endpoint) => (
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
    </div>
  )
}
