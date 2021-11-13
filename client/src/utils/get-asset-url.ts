export function getAssetURL(asset: string) {
  return new URL(asset, import.meta.url).href
}
