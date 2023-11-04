import path                   from 'node:path';

import resolve                from '@rollup/plugin-node-resolve';
import virtual                from '@rollup/plugin-virtual';

import { typhonjsRuntime }    from './index.js';

import {
   distPath,
   exportsSveltePackage }     from './exportsSveltePackage.js';

import { externalPathsNPM }   from './externalPathsNPM.js';


// Defines the node-resolve config.
const s_RESOLVE_CONFIG = {
   browser: true,
   dedupe: ['svelte', '@typhonjs-fvtt/svelte']
};

export function createSvelteNPMConfig({ sourcemap, outputPlugins = [] })
{
   const config = [];

   for (const entry of exportsSveltePackage)
   {
      if (entry === 'component/core') { /* noop */ }
      else
      {
         config.push({
            input: {
               input: 'pack',
               plugins: [
                  virtual({
                     pack: `export * from '@typhonjs-fvtt/svelte/${entry}';`
                  }),
                  typhonjsRuntime({ isLib: false, exclude: [`@typhonjs-fvtt/svelte/${entry}`] }),
                  resolve(s_RESOLVE_CONFIG),
               ]
            },
            copyDTS: `${distPath}${path.sep}${entry}${path.sep}index.d.ts`,   // Copy the declarations
            output: {
               file: `./_dist/svelte/${entry}/index.js`,
               format: 'es',
               generatedCode: { constBindings: true },
               paths: externalPathsNPM,
               plugins: outputPlugins,
               sourcemap
            }
         });
      }
   }

   return config;
}
