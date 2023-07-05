import path                   from 'node:path';

import resolve                from '@rollup/plugin-node-resolve';
import virtual                from '@rollup/plugin-virtual';

import { typhonjsRuntime }    from './index.js';

import {
   distPath,
   exportsRuntimePackage }    from './exportsRuntimePackage.js';

import { externalPathsNPM }   from './externalPathsNPM.js';

// Defines the node-resolve config.
const s_RESOLVE_CONFIG = {
   browser: true,
   dedupe: ['svelte']
};

export function createRuntimeNPMConfig({ sourcemap, outputPlugins = [] })
{
   const config = [];

   for (const entry of exportsRuntimePackage)
   {
      config.push({
         input: {
            input: 'pack',
            plugins: [
               virtual({
                  pack: `export * from '@typhonjs-svelte/runtime-base/${entry}';`
               }),
               typhonjsRuntime({ isLib: false, exclude: [`@typhonjs-svelte/runtime-base/${entry}`] }),
               resolve(s_RESOLVE_CONFIG),
            ]
         },
         copyDTS: `${distPath}${path.sep}${entry}${path.sep}index.d.ts`,   // Copy the declarations
         output: {
            file: `./_dist/${entry}/index.js`,
            format: 'es',
            generatedCode: { constBindings: true },
            paths: externalPathsNPM,
            plugins: outputPlugins,
            sourcemap
         }
      });
   }

   return config;
}
