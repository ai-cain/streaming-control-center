import { useConfig } from '../config/config-context'
import { buildEndpointCatalog, pickEndpoints } from '../config/endpoints'
import { FeatureBlueprintPage } from '../../shared/FeatureBlueprintPage'

export function ExportsPage() {
  const { config } = useConfig()

  return (
    <FeatureBlueprintPage
      description="Exports are a perfect POST-plus-polling feature. The UI should feel like a job console, not a single button that fires blind requests."
      direction="Use a create-job action followed by a job list that refreshes until downloads are ready."
      endpoints={pickEndpoints(buildEndpointCatalog(config), [
        'exports-create',
        'exports-list',
      ])}
      eyebrow="Export plan"
      requestShape={`POST /api/recording/export\nGET /api/recording/export`}
      status="neutral"
      title="Exports become a background jobs surface"
      workstreams={[
        'Build a typed export request payload.',
        'Poll job status and display progress history.',
        'Expose download readiness clearly when the output file exists.',
      ]}
    />
  )
}
