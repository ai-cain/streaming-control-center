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
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Configuration</span>
          <h2>Local config becomes the contract for every feature module</h2>
          <p>
            Instead of shipping dead defaults, this rebuild stores the exact API
            base, media origin, stream target, and polling interval the operator
            needs on this machine.
          </p>
        </div>

        <div className={`callout ${connectionMode.tone}`}>
          <strong>{connectionMode.mode}</strong>
          <p>{connectionMode.note}</p>
        </div>
      </section>

      <div className="content-grid">
        <section className="panel">
          <span className="eyebrow">Local settings</span>
          <div className="form-grid">
            <label className="field field-full">
              <span>Recorder API base URL</span>
              <input
                onChange={handleTextField('apiBase')}
                placeholder="http://host:7000"
                spellCheck="false"
                value={draft.apiBase}
              />
            </label>

            <label className="field field-full">
              <span>Media base URL</span>
              <input
                onChange={handleTextField('mediaBase')}
                placeholder="http://host:8000"
                spellCheck="false"
                value={draft.mediaBase}
              />
            </label>

            <label className="field">
              <span>Application / NMS app</span>
              <input
                onChange={handleTextField('app')}
                placeholder="main"
                spellCheck="false"
                value={draft.app}
              />
            </label>

            <label className="field">
              <span>Stream key</span>
              <input
                onChange={handleTextField('streamKey')}
                placeholder="camera_01"
                spellCheck="false"
                value={draft.streamKey}
              />
            </label>

            <label className="field field-full">
              <span>Polling interval in milliseconds</span>
              <input
                min={3000}
                onChange={handlePollingField}
                step={1000}
                type="number"
                value={draft.pollingMs}
              />
            </label>
          </div>

          <p className="helper">
            The app normalizes base URLs on save. If you paste `host:7000`, it
            becomes `http://host:7000`.
          </p>

          <div className="button-row">
            <button
              className="button"
              onClick={() => replaceConfig(previewConfig)}
              type="button"
            >
              Save local config
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
        </section>

        <aside className="stack">
          <section className="panel">
            <span className="eyebrow">Operational context</span>
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

          <section className="panel">
            <span className="eyebrow">Endpoint preview</span>
            <div className="endpoint-list">
              {endpointCatalog.map((endpoint) => (
                <div className="endpoint-row" key={endpoint.id}>
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
