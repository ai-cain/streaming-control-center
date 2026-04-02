import { useConfig } from '../config/config-context'
import { buildEndpointCatalog, pickEndpoints } from '../config/endpoints'
import { useUiPreferences } from '../ui-preferences/ui-preferences-context'
import { FeatureBlueprintPage } from '../../shared/FeatureBlueprintPage'

export function SnapshotsPage() {
  const { config } = useConfig()
  const { t } = useUiPreferences()

  return (
    <FeatureBlueprintPage
      description={t('snapshots.description')}
      direction={t('snapshots.direction')}
      endpoints={pickEndpoints(buildEndpointCatalog(config), [
        'snapshot-latest',
        'snapshot-history',
      ])}
      eyebrow={t('snapshots.eyebrow')}
      requestShape={`GET /api/recording/snapshot/{camera}/latest\nGET /api/recording/snapshot/{camera}/history?limit=5`}
      status="neutral"
      title={t('snapshots.title')}
      workstreams={[
        t('snapshots.workstream.1'),
        t('snapshots.workstream.2'),
        t('snapshots.workstream.3'),
      ]}
    />
  )
}
