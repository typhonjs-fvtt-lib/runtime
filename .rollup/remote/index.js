import { externalPathsRemote }   from './externalPathsRemote.js';
import { generatePlugin }        from '../generatePlugin.js';
import { generatePluginOutput }  from '../generatePluginOutput.js';

export function typhonjsRuntime({ output = false } = {})
{
   return output ? generatePluginOutput() : generatePlugin(externalPathsRemote);
}