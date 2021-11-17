import { externalPathsLib }      from './externalPathsLib.js';
import { externalPathsNPM }      from './externalPathsNPM.js';

import { generatePlugin }        from '../generatePlugin.js';
import { generatePluginOutput }  from '../generatePluginOutput.js';

export function typhonjsRuntime({ isLib = true, output = false, exclude = []} = {})
{
   return output ? generatePluginOutput() : generatePlugin(isLib ? externalPathsLib : externalPathsNPM, exclude);
}
