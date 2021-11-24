import { externalPathsLib }      from './externalPathsLib.js';
import { externalPathsNPM }      from './externalPathsNPM.js';

import { generatePlugin }        from '../generatePlugin.js';
import { generatePluginOutput }  from '../generatePluginOutput.js';

export *                         from './createSvelteLibConfig.js'
export *                         from './createSvelteNPMConfig.js'
export *                         from '../postcssConfig.js';
export *                         from '../terserConfig.js';

/**
 * Creates the TyphonJS runtime library substitution plugin.
 *
 * @param {boolean}  [isLib] - Is this the library or NPM runtime substitution?
 *
 * @param {string[]} [exclude] - NPM packages to exclude from predefined list of packages.
 *
 * @returns {{name: string, options(*): void}} TyphonJS runtime plugin
 */
export function typhonjsRuntime({ isLib = true, exclude = []} = {})
{
   return generatePlugin(isLib ? externalPathsLib : externalPathsNPM, exclude);
}

/**
 * Creates the TyphonJS runtime library output substitution plugin.
 *
 * @param {boolean}  [isLib] - Is this the library or NPM runtime substitution?
 *
 * @returns {{code: string, map: SourceMap}} TyphonJS runtime output plugin
 */
export function typhonjsRuntimeOut({ isLib = true } = {})
{
   return generatePluginOutput(isLib);
}