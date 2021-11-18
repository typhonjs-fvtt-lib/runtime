import { externalPathsLib }      from './externalPathsLib.js';
import { externalPathsNPM }      from './externalPathsNPM.js';

import { generatePlugin }        from '../generatePlugin.js';
import { generatePluginOutput }  from '../generatePluginOutput.js';

export *                         from  './createSvelteLibConfig.js'
export *                         from  './createSvelteNPMConfig.js'

export function typhonjsRuntime({ isLib = true, exclude = []} = {})
{
   return generatePlugin(isLib ? externalPathsLib : externalPathsNPM, exclude);
}

export function typhonjsRuntimeOut({ isLib = true } = {})
{
   return generatePluginOutput(isLib);
}