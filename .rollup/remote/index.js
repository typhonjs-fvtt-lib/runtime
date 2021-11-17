import { externalPathsRemote }   from './externalPathsRemote.js';
import { generatePlugin }        from '../generatePlugin';

export function typhonjsRuntime(options = {})
{
   return generatePlugin(options, externalPathsRemote);
}