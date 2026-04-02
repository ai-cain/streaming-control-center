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
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>

        <div className={`callout ${status} module-callout`}>
          <strong>Implementation direction</strong>
          <p>{direction}</p>
        </div>
      </section>

      <div className="content-grid content-grid-wide">
        <section className="panel">
          <span className="eyebrow">Endpoint contract</span>
          <div className="endpoint-list">
            {endpoints.map((endpoint) => (
              <div className="endpoint-row" key={`${endpoint.method}-${endpoint.label}`}>
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
              <span className="eyebrow spaced-block">Request shape</span>
              <pre className="code-block">{requestShape}</pre>
            </>
          ) : null}
        </section>

        <aside className="stack">
          <section className="panel">
            <span className="eyebrow">Workstreams</span>
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
