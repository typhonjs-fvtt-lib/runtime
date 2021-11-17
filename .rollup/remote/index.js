import { externalPathsRemote }   from './externalPathsRemote.js';
import { generatePlugin }        from '../generatePlugin.js';

export function typhonjsRuntime(options = {})
{
   return generatePlugin(options, externalPathsRemote);
}