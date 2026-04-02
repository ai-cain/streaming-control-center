import { useConfig } from '../config/config-context'
import { buildEndpointCatalog, pickEndpoints } from '../config/endpoints'
import { FeatureBlueprintPage } from '../../shared/FeatureBlueprintPage'

export function SnapshotsPage() {
  const { config } = useConfig()

  return (
    <FeatureBlueprintPage
      description="Snapshots deserve their own evidence-focused module with image rendering, metadata, and recent capture history."
      direction="Keep the endpoint contract, but make the feature visual and inspectable instead of burying it inside a giant dashboard."
      endpoints={pickEndpoints(buildEndpointCatalog(config), [
        'snapshot-latest',
        'snapshot-history',
      ])}
      eyebrow="Snapshot plan"
      requestShape={`GET /api/recording/snapshot/{camera}/latest\nGET /api/recording/snapshot/{camera}/history?limit=5`}
      status="neutral"
      title="Snapshots become an evidence inspector"
      workstreams={[
        'Render the latest image with timestamp and dimensions.',
        'Show recent snapshot history in a compact timeline.',
        'Leave room for downloads or evidence workflows later.',
      ]}
    />
  )
}
