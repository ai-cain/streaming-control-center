import { FeatureBlueprintPage } from '../../shared/FeatureBlueprintPage'

export function ConfigPage() {
  return (
    <FeatureBlueprintPage
      description="Config is where the new app stops being hardcoded. Recorder API, media base, stream app, and stream key will be saved locally per browser."
      direction="Use browser persistence for operator config and recent preferences; do not add a real local database unless offline workflows justify it later."
      eyebrow="Config plan"
      requestShape={`localStorage:\n- recorder API base URL\n- media base URL\n- app / stream namespace\n- stream key\n- UI preferences`}
      title="Local persistence replaces hardcoded defaults"
      workstreams={[
        'Save the connection data locally in the browser.',
        'Build endpoint previews from the current config.',
        'Keep camera inventory and recorder state sourced from the API, not from local storage.',
      ]}
    />
  )
}
