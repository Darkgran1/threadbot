import { initFloodFeature } from '../features/flood'

export async function initAllFeatures() {
  await initFloodFeature()
}
