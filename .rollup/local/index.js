import { externalPathsLocal } from './externalPathsLocal.js';
import { generatePlugin }     from '../generatePlugin';

export function typhonjsRuntime(options = {})
{
   return generatePlugin(options, externalPathsLocal);
}

export function getExternal(...exclude)
{
   return Object.keys(externalPathsLocal).filter((entry) => !exclude.includes(entry));
}