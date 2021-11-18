import resolve             from '@rollup/plugin-node-resolve';
import sourcemaps          from 'rollup-plugin-sourcemaps';
import { typhonjsRuntime } from './index.js';
import virtual             from '@rollup/plugin-virtual';

import { exportsSveltePackage } from "./exportsSveltePackage";

const exportsSvelteRemapped = Object.fromEntries(exportsSveltePackage.map(
 (entry) => [`@typhonjs-fvtt/svelte${entry}`, `@typhonjs-fvtt/runtime/svelte${entry}`]));

// console.log(exportsSvelteRemapped);

export function createSvelteNPMConfig()
{
   const config = [
   ];

   // for (const entry of exportsSvelteRemapped)
   // {
   //    config.push({
   //       input: 'pack',
   //       output: {
   //          file: ,
   //          format: 'es',
   //          preferConst: true,
   //          sourcemap,
   //          // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
   //       },
   //       plugins: [
   //          virtual({
   //             pack: `export * from '@typhonjs-fvtt/svelte${entry}';`
   //          }),
   //          typhonjsRuntime({ isLib: false, exclude: ['@typhonjs-fvtt/svelte/action'] }),
   //          resolve({ browser: true }),
   //          sourcemaps()
   //       ]
   //    });
   // }

   return config;
}