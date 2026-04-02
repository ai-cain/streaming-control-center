interface FeatureBlueprintPageProps {
  eyebrow: string
  title: string
  description: string
  direction: string
  endpoints: Array<{
    method: 'GET' | 'POST'
    label: string
    url: string
  }>
  requestShape?: string
  status: 'active' | 'neutral'
  workstreams: string[]
}

export function FeatureBlueprintPage({
  eyebrow,
  title,
  description,
  direction,
  endpoints,
  requestShape,
  status,
  workstreams,
}: FeatureBlueprintPageProps) {
  return (
    <div className="page-shell">
      <section className="page-banner compact">
        <div>
          <span className="section-title">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <div className={`signal-box ${status}`}>
          <span className="signal-label">Direction</span>
          <p>{direction}</p>
        </div>
      </section>

      <div className="workspace-grid">
        <section className="panel">
          <span className="section-title">Endpoints</span>
          <div className="endpoint-list">
            {endpoints.map((endpoint) => (
              <div className="endpoint-row compact-endpoint" key={`${endpoint.method}-${endpoint.label}`}>
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

          {requestShape ? (
            <>
              <span className="section-title section-spacer">Request Shape</span>
              <pre className="code-block">{requestShape}</pre>
            </>
          ) : null}
        </section>

        <aside className="side-stack">
          <section className="panel compact-panel">
            <span className="section-title">Next Work</span>
            <ul className="check-list">
              {workstreams.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
