import { useConfig } from '../config/config-context'
import { buildEndpointCatalog, pickEndpoints } from '../config/endpoints'
import { useUiPreferences } from '../ui-preferences/ui-preferences-context'
import { FeatureBlueprintPage } from '../../shared/FeatureBlueprintPage'

export function ExportsPage() {
  const { config } = useConfig()
  const { t } = useUiPreferences()

  return (
    <FeatureBlueprintPage
      description={t('exports.description')}
      direction={t('exports.direction')}
      endpoints={pickEndpoints(buildEndpointCatalog(config), [
        'exports-create',
        'exports-list',
      ])}
      eyebrow={t('exports.eyebrow')}
      requestShape={`POST /api/recording/export\nGET /api/recording/export`}
      status="neutral"
      title={t('exports.title')}
      workstreams={[
        t('exports.workstream.1'),
        t('exports.workstream.2'),
        t('exports.workstream.3'),
      ]}
    />
  )
}
