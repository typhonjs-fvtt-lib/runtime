import { externalPathsRemote }   from './externalPathsRemote.js';
import { generatePlugin }        from '../generatePlugin.js';

export function typhonjsRuntime()
{
   return generatePlugin(externalPathsRemote);
}