import { isObject } from '@typhonjs-fvtt/runtime/util/object';

/**
 * Localize a string including variable formatting for input arguments. Provide a string ID which defines the localized
 * template. Variables can be included in the template enclosed in braces and will be substituted using those named
 * keys.
 *
 * @param {string}   stringId - The string ID to translate.
 *
 * @param {object}   [data] - Provided input data.
 *
 * @returns {string} The translated and formatted string
 */
export function localize(stringId, data)
{
   const result = !isObject(data) ? globalThis.game.i18n.localize(stringId) :
    globalThis.game.i18n.format(stringId, data);

   return result !== void 0 ? result : '';
}
