import path                   from 'path';

import resolve                from '@rollup/plugin-node-resolve';
import virtual                from '@rollup/plugin-virtual';
import sourcemaps             from 'rollup-plugin-sourcemaps';
import svelte                 from 'rollup-plugin-svelte';

import { typhonjsRuntime }    from './index.js';
import { postcssConfig }      from '../postcssConfig.js';

import {
   distPath,
   exportsSveltePackage }     from './exportsSveltePackage.js';

import { externalPathsNPM }   from './externalPathsNPM.js';


// Defines the node-resolve config.
const s_RESOLVE_CONFIG = {
   browser: true,
   dedupe: ['svelte', '@typhonjs-fvtt/svelte']
};

export function createSvelteNPMConfig({ sourcemap, outputPlugins })
{
   const config = [];

   const postcssCore = postcssConfig({
      extract: 'core.css',
      compress: true,
      sourceMap: sourcemap
   });

   for (const entry of exportsSveltePackage)
   {
      // NOTE: Svelte components are no longer compiled.
      // // Special handling for component/core to compile Svelte components.
      // if (entry === 'component/core')
      // {
      //    config.push({
      //       input: {
      //          input: 'pack',
      //          plugins: [
      //             virtual({
      //                pack: `export * from '@typhonjs-fvtt/svelte/component/core';`
      //             }),
      //             svelte({
      //                onwarn: (warning, handler) =>
      //                {
      //                   // Suppress `a11y-missing-attribute` for missing href in <a> links.
      //                   if (warning.message.includes(`<a> element should have an href attribute`))
      //                   { return; }
      //
      //                   // Let Rollup handle all other warnings normally.
      //                   handler(warning);
      //                }
      //             }),
      //             postcss(postcssCore),
      //             resolve(s_RESOLVE_CONFIG),
      //             typhonjsRuntime({ isLib: false, exclude: ['@typhonjs-fvtt/svelte/component/core'] }),
      //          ]
      //       },
      //       output: {
      //          output: {
      //             file: './_dist/svelte/component/core/index.js',
      //             format: 'es',
      //             paths: externalPathsNPM,
      //             plugins: outputPlugins,
      //             preferConst: true,
      //             sourcemap
      //          }
      //       }
      //    });
      // }
      // // Special handling for component/dialogg to compile Svelte components.
      // else if (entry === 'component/dialog')
      // {
      //    config.push({
      //       input: {
      //          input: 'pack',
      //          plugins: [
      //             virtual({
      //                pack: `export * from '@typhonjs-fvtt/svelte/component/dialog';`
      //             }),
      //             svelte({
      //                onwarn: (warning, handler) =>
      //                {
      //                   // Suppress `a11y-missing-attribute` for missing href in <a> links.
      //                   if (warning.message.includes(`<a> element should have an href attribute`))
      //                   { return; }
      //
      //                   // Let Rollup handle all other warnings normally.
      //                   handler(warning);
      //                }
      //             }),
      //             postcss(postcssCore),
      //             resolve(s_RESOLVE_CONFIG),
      //             typhonjsRuntime({ isLib: false, exclude: ['@typhonjs-fvtt/svelte/component/dialog'] }),
      //          ]
      //       },
      //       output: {
      //          output: {
      //             file: './_dist/svelte/component/dialog/index.js',
      //             format: 'es',
      //             paths: externalPathsNPM,
      //             plugins: outputPlugins,
      //             preferConst: true,
      //             sourcemap
      //          }
      //       }
      //    });
      // }
      if (entry === 'component/core' || entry === 'component/dialog') { /* noop */ }
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
                  sourcemaps()
               ]
            },
            output: {
               copyDTS: `${distPath}${path.sep}${entry}${path.sep}index.d.ts`,   // Copy the declarations
               output: {
                  file: `./_dist/svelte/${entry}/index.js`,
                  format: 'es',
                  paths: externalPathsNPM,
                  plugins: outputPlugins,
                  preferConst: true,
                  sourcemap
               }
            }
         });
      }
   }

   return config;
}