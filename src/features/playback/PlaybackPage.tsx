import { useConfig } from '../config/config-context'
import { buildEndpointCatalog, pickEndpoints } from '../config/endpoints'
import { FeatureBlueprintPage } from '../../shared/FeatureBlueprintPage'

export function PlaybackPage() {
  const { config } = useConfig()

  return (
    <FeatureBlueprintPage
      description="Playback will move from a manual page section into a dedicated range-query module with date controls, availability lookups, and returned playlist playback."
      direction="Keep the endpoint contract from legacy, but rebuild the UX around forms, validation, and HLS playlist rendering."
      endpoints={pickEndpoints(buildEndpointCatalog(config), ['playback', 'available'])}
      eyebrow="Playback plan"
      requestShape={`GET /api/recording/playback?camera={id}&from={YYYY-MM-DD HH:mm:ss}&to={YYYY-MM-DD HH:mm:ss}\nGET /api/recording/playback/available?camera={id}&date={YYYY-MM-DD}`}
      status="active"
      title="Playback should feel like a workflow, not a raw endpoint call"
      workstreams={[
        'Add reusable range controls and time presets.',
        'Request temporary playback playlists through typed API helpers.',
        'Reuse the live player strategy for returned .m3u8 playback.',
      ]}
    />
  )
}
