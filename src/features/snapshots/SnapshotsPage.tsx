import { FeatureBlueprintPage } from '../../shared/FeatureBlueprintPage'

export function SnapshotsPage() {
  return (
    <FeatureBlueprintPage
      description="Snapshots deserve their own evidence-focused module with image rendering, metadata, and recent capture history."
      direction="Keep the endpoint contract, but make the feature visual and inspectable instead of burying it inside a giant dashboard."
      eyebrow="Snapshot plan"
      requestShape={`GET /api/recording/snapshot/{camera}/latest\nGET /api/recording/snapshot/{camera}/history?limit=5`}
      title="Snapshots become an evidence inspector"
      workstreams={[
        'Render the latest image with timestamp and dimensions.',
        'Show recent snapshot history in a compact timeline.',
        'Leave room for downloads or evidence workflows later.',
      ]}
    />
  )
}
