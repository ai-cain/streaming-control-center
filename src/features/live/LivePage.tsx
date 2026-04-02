import { FeatureBlueprintPage } from '../../shared/FeatureBlueprintPage'

export function LivePage() {
  return (
    <FeatureBlueprintPage
      description="Live is the first feature that will graduate from blueprint to working module because it proves config handling, status polling, and HLS playback in one place."
      direction="Replace hardcoded stream targets with local configuration, then wire hls.js and health polling on top of a shared API layer."
      eyebrow="Live plan"
      requestShape={`GET /api/recording/health\nGET /api/recording/status\nGET {mediaBase}/{app}/{streamKey}/index.m3u8`}
      title="Live becomes the first real functional module"
      workstreams={[
        'Persist recorder API and media origin locally in the browser.',
        'Show recorder health and active cameras from shared query hooks.',
        'Play the HLS manifest in the new shell instead of the legacy page.',
      ]}
    />
  )
}
