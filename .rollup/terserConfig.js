/**
 * Convenience method to create a Terser config without needing to store a local file.
 *
 * @param {object}         [opts] - Optional parameters.
 *
 * @param {boolean}        [opts.keep_classnames=undefined] - When true does not mangle class names.
 *
 * @param {boolean|RegExp} [opts.keep_fnames=false] - When true does not mangle function names; a RegExp will
 *                                                    selectively mangle function names.
 *
 * @returns {import('terser').MinifyOptions} A Terser configuration file.
 */
export function terserConfig({ keep_classnames = void 0, keep_fnames = false } = {})
{
   return {
      compress: {
         passes: 3
      },

      mangle: {
         toplevel: true,
         keep_classnames,
         keep_fnames
      },

      ecma: 2020,

      module: true
   };
}