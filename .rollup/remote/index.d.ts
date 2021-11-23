/**
 * Provides a function to return a new PostCSS configuration setting the extract parameter.
 *
 * @param {object}   opts - Optional parameters.
 *
 * @param {string}   opts.extract - Name of CSS file to extract to...
 *
 * @param {boolean}  [opts.compress=false] - Compress CSS.
 *
 * @param {boolean}  [opts.sourceMap=false] - Generate source maps.
 *
 * @returns {{extensions: string[], extract, sourceMap: boolean, plugins: (*)[], use: string[], inject: boolean}} PostCSS config
 */
declare function postcssConfig({ extract, compress, sourceMap }?: {
    extract: string;
    compress?: boolean;
    sourceMap?: boolean;
}): {
    extensions: string[];
    extract: any;
    sourceMap: boolean;
    plugins: (any)[];
    use: string[];
    inject: boolean;
};

/**
 * Returns the TyphonJS Runtime Library module substitution plugin.
 *
 * Add this plugin to substitute NPM module paths for the Foundry VTT hosted module.
 *
 * @returns {{name: string, options(*): void}} The plugin.
 */
declare function typhonjsRuntime(): {
    name: string;
    options(): void;
};

export { postcssConfig, typhonjsRuntime };
