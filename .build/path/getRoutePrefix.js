/**
 * Returns the given URL string with any route prefix applied.
 *
 * @param {string}   url - Bare URL string path.
 *
 * @returns {string} URL with added route prefix.
 */
export function getRoutePrefix(url)
{
   return globalThis.foundry.utils.getRoute(url);
}
