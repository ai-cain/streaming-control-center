import { useEffect, useState, type ChangeEvent } from 'react'
import { useUiPreferences } from '../ui-preferences/ui-preferences-context'
import { safeOrigin } from '../../shared/utils/url'
import { describeConnectionMode } from './connection-mode'
import { sanitizeConfig, useConfig } from './config-context'
import { buildEndpointCatalog, buildLiveManifestUrl } from './endpoints'
import { defaultConfig, type AppConfig } from './config.types'

export function ConfigPage() {
  const { config, replaceConfig, resetConfig } = useConfig()
  const { t } = useUiPreferences()
  const [draft, setDraft] = useState<AppConfig>(config)
  const previewConfig = sanitizeConfig(draft)
  const connectionMode = describeConnectionMode(previewConfig)
  const endpointCatalog = buildEndpointCatalog(previewConfig)
  const liveManifestUrl =
    buildLiveManifestUrl(previewConfig) || t('config.preview.notReadyYet')

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
          <span className="section-title">{t('config.sectionTitle')}</span>
          <h2>{t('config.title')}</h2>
          <p>{t('config.description')}</p>
        </div>

        <div className={`signal-box ${connectionMode.tone}`}>
          <span className="signal-label">{t(connectionMode.modeKey)}</span>
          <p>{t(connectionMode.noteKey)}</p>
        </div>
      </section>

      <section className="settings-grid">
        <article className="panel settings-card">
          <span className="section-title">{t('config.network.title')}</span>
          <label className="form-row">
            <span>{t('config.network.apiBase.label')}</span>
            <input
              onChange={handleTextField('apiBase')}
              placeholder={t('config.network.apiBase.placeholder')}
              spellCheck="false"
              value={draft.apiBase}
            />
          </label>
          <label className="form-row">
            <span>{t('config.network.mediaBase.label')}</span>
            <input
              onChange={handleTextField('mediaBase')}
              placeholder={t('config.network.mediaBase.placeholder')}
              spellCheck="false"
              value={draft.mediaBase}
            />
          </label>
        </article>

        <article className="panel settings-card">
          <span className="section-title">{t('config.stream.title')}</span>
          <label className="form-row">
            <span>{t('config.stream.app.label')}</span>
            <input
              onChange={handleTextField('app')}
              placeholder={t('config.stream.app.placeholder')}
              spellCheck="false"
              value={draft.app}
            />
          </label>
          <label className="form-row">
            <span>{t('config.stream.streamKey.label')}</span>
            <input
              onChange={handleTextField('streamKey')}
              placeholder={t('config.stream.streamKey.placeholder')}
              spellCheck="false"
              value={draft.streamKey}
            />
            <small className="field-note">{t('config.stream.streamKey.help')}</small>
          </label>
          <label className="form-row">
            <span>{t('config.stream.polling.label')}</span>
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
              {t('config.actions.save')}
            </button>
            <button
              className="button secondary"
              onClick={() => {
                resetConfig()
                setDraft(defaultConfig)
              }}
              type="button"
            >
              {t('config.actions.reset')}
            </button>
          </div>
        </article>
      </section>

      <div className="workspace-grid">
        <section className="panel compact-panel">
          <span className="section-title">{t('config.preview.title')}</span>
          <div className="detail-list">
            <div className="detail-row">
              <span className="muted">{t('config.preview.apiBase')}</span>
              <code>
                {previewConfig.apiBase || t('config.preview.notConfigured')}
              </code>
            </div>
            <div className="detail-row">
              <span className="muted">{t('config.preview.mediaBase')}</span>
              <code>
                {previewConfig.mediaBase || t('config.preview.notConfigured')}
              </code>
            </div>
            <div className="detail-row">
              <span className="muted">{t('config.preview.liveManifest')}</span>
              <code>{liveManifestUrl}</code>
            </div>
            <div className="detail-row">
              <span className="muted">{t('config.preview.browserOrigin')}</span>
              <code>{safeOrigin()}</code>
            </div>
          </div>
        </section>

        <aside className="side-stack">
          <section className="panel compact-panel">
            <span className="section-title">{t('config.endpoints.title')}</span>
            <div className="endpoint-list">
              {endpointCatalog.map((endpoint) => (
                <div className="endpoint-row compact-endpoint" key={endpoint.id}>
                  <div className="endpoint-body">
                    <strong>{t(endpoint.labelKey)}</strong>
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
