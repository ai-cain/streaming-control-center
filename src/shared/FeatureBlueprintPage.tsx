interface FeatureBlueprintPageProps {
  eyebrow: string
  title: string
  description: string
  direction: string
  requestShape?: string
  workstreams: string[]
}

export function FeatureBlueprintPage({
  eyebrow,
  title,
  description,
  direction,
  requestShape,
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

        <div className="callout">
          <strong>Implementation direction</strong>
          <p>{direction}</p>
        </div>
      </section>

      <div className="content-grid">
        <section className="panel">
          <span className="eyebrow">Workstreams</span>
          <ul className="check-list">
            {workstreams.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <aside className="stack">
          <section className="panel">
            <span className="eyebrow">Request shape</span>
            <pre className="code-block">
              {requestShape || 'This module will be wired in the next milestone.'}
            </pre>
          </section>
        </aside>
      </div>
    </div>
  )
}
