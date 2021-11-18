import { externalPathsLib }      from './externalPathsLib.js';
import { externalPathsNPM }      from './externalPathsNPM.js';

import { generatePlugin }        from '../generatePlugin.js';
import { generatePluginOutput }  from '../generatePluginOutput.js';

export function typhonjsRuntime({ isLib = true, output = false, exclude = []} = {})
{
   return output ? generatePluginOutput(isLib) : generatePlugin(isLib ? externalPathsLib : externalPathsNPM, exclude);
}

export function typhonjsRuntimeOut({ isLib = true } = {})
{
   return generatePluginOutput(isLib);
}