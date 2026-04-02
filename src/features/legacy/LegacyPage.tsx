export function LegacyPage() {
  return (
    <div className="page-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">Legacy</span>
          <h2>The original prototype stays as a migration reference</h2>
          <p>
            We keep the static version because it already encodes endpoint shapes,
            operator wording, and rough interaction flow. It is reference, not the
            future architecture.
          </p>
        </div>

        <div className="callout">
          <strong>Files kept on purpose</strong>
          <p>`legacy/index.html`, `legacy/style.css`, and `legacy/app.js` remain in the repo.</p>
        </div>
      </section>

      <div className="content-grid">
        <section className="panel">
          <span className="eyebrow">Migration rule</span>
          <ul className="check-list">
            <li>Use legacy to compare behavior, not as the place to keep growing features.</li>
            <li>Port each recorder capability into a typed React module.</li>
            <li>Retire hardcoded links and giant-script logic feature by feature.</li>
          </ul>
        </section>

        <aside className="stack">
          <section className="panel">
            <span className="eyebrow">Current view</span>
            <p>
              The new repo now has a proper shell, navigation, and product map. The
              next milestone is to make the new app actually talk to your APIs.
            </p>
          </section>
        </aside>
      </div>
    </div>
  )
}
