// Compatibility for old built-in panorama URLs stored in existing records.
// The aliased files had exactly the same image bytes as these bundled sources.
const legacyPanoramas = {
  '/panoramas/training-selection.png': '/panoramas/logistics-indoor.png',
  '/panoramas/main-logistics.png': '/panoramas/logistics-indoor.png',
  '/panoramas/loading-transition.png': '/panoramas/logistics-indoor-outdoor.png',
};

export function resolvePanoramaSource(source) {
  if (typeof source !== 'string') return source;
  const suffixIndex = source.search(/[?#]/);
  const pathname = suffixIndex < 0 ? source : source.slice(0, suffixIndex);
  const suffix = suffixIndex < 0 ? '' : source.slice(suffixIndex);
  return legacyPanoramas[pathname] ? legacyPanoramas[pathname] + suffix : source;
}
