import { FeatureBlueprintPage } from '../../shared/FeatureBlueprintPage'

export function ExportsPage() {
  return (
    <FeatureBlueprintPage
      description="Exports are a perfect POST-plus-polling feature. The UI should feel like a job console, not a single button that fires blind requests."
      direction="Use a create-job action followed by a job list that refreshes until downloads are ready."
      eyebrow="Export plan"
      requestShape={`POST /api/recording/export\nGET /api/recording/export`}
      title="Exports become a background jobs surface"
      workstreams={[
        'Build a typed export request payload.',
        'Poll job status and display progress history.',
        'Expose download readiness clearly when the output file exists.',
      ]}
    />
  )
}
