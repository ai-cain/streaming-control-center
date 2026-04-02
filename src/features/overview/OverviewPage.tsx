export function OverviewPage() {
  return (
    <div className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Overview</span>
          <h2>We are treating the old UI as legacy and rebuilding with intent</h2>
          <p>
            The old prototype proved the product need, but it also showed the pain:
            hardcoded links, one giant script, and no clean place to grow features.
          </p>
        </div>

        <div className="callout">
          <strong>Senior direction</strong>
          <p>
            Keep the legacy files for reference, then rebuild each flow as its own
            module with shared API and local state boundaries.
          </p>
        </div>
      </section>

      <section className="metric-grid">
        <article className="metric-card">
          <span className="metric-label">Shell</span>
          <span className="metric-value">Ready</span>
          <p className="metric-note">Routing and product structure are now in place.</p>
        </article>

        <article className="metric-card">
          <span className="metric-label">Legacy</span>
          <span className="metric-value">Preserved</span>
          <p className="metric-note">The static prototype remains available as reference.</p>
        </article>

        <article className="metric-card">
          <span className="metric-label">Config</span>
          <span className="metric-value">Next</span>
          <p className="metric-note">Local persistence replaces dead hardcoded URLs.</p>
        </article>

        <article className="metric-card">
          <span className="metric-label">Commits</span>
          <span className="metric-value">Per milestone</span>
          <p className="metric-note">Each significant functional step gets its own commit.</p>
        </article>
      </section>

      <div className="content-grid">
        <section className="panel">
          <span className="eyebrow">Why React fits</span>
          <ul className="check-list">
            <li>Most of the product is GET and POST against APIs, not a huge front-end domain model.</li>
            <li>We can migrate gradually from the static prototype instead of rewriting the whole world at once.</li>
            <li>Feature modules and shared hooks are enough without the heavier ceremony of Angular.</li>
          </ul>
        </section>

        <aside className="stack">
          <section className="panel">
            <span className="eyebrow">Database stance</span>
            <p>
              No real local database for now. Config and preferences live in browser
              storage; camera counts and state should still come from the API.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}
