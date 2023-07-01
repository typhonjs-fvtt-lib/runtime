import resolve             from '@rollup/plugin-node-resolve';
import virtual             from '@rollup/plugin-virtual';
import postcss             from 'rollup-plugin-postcss';
import svelte              from 'rollup-plugin-svelte';

import {
   typhonjsRuntime,
   typhonjsRuntimeOut }    from './index.js';

import { postcssConfig }   from '../postcssConfig.js';

const bundleMap = {
   // These are handled manually below:
   // 'svelte': ['svelte'],
   // 'svelte/component/core': ['../../node_modules/@typhonjs-fvtt/svelte/src/component/core'],
   // 'svelte/component/dialog': ['../../node_modules/@typhonjs-fvtt/svelte/src/component/dialog'],
   'svelte/action/dom': ['@typhonjs-fvtt/svelte/action/dom'],
   'svelte/animate': ['svelte/animate', '@typhonjs-fvtt/svelte/animate'],
   'svelte/animate/action': ['@typhonjs-fvtt/svelte/animate/action'],
   'svelte/application': ['@typhonjs-fvtt/svelte/application'],
   'svelte/application/dialog': ['@typhonjs-fvtt/svelte/application/dialog'],
   'svelte/application/legacy': ['@typhonjs-fvtt/svelte/application/legacy'],
   'svelte/easing': ['svelte/easing'],
   'svelte/gsap': ['@typhonjs-fvtt/svelte/gsap'],
   'svelte/helper': ['@typhonjs-fvtt/svelte/helper'],
   'svelte/internal': ['svelte/internal'],
   'svelte/motion': ['svelte/motion'],
   'svelte/store': ['svelte/store'],
   'svelte/store/derived': ['@typhonjs-fvtt/svelte/store/derived'],
   'svelte/store/dom': ['@typhonjs-fvtt/svelte/store/dom'],
   'svelte/store/fvtt': ['@typhonjs-fvtt/svelte/store/fvtt'],
   'svelte/store/position': ['@typhonjs-fvtt/svelte/store/position'],
   'svelte/store/storage/web/plugin': ['@typhonjs-fvtt/svelte/store/storage/web/plugin'],
   'svelte/transition': ['svelte/transition', '@typhonjs-fvtt/svelte/transition'],
   'svelte/util': ['@typhonjs-fvtt/svelte/util'],
};

export function createSvelteLibConfig({ sourcemap, outputPlugins = [] })
{
   const isLib = true;

   const postcssCore = postcssConfig({
      extract: 'core.css',
      compress: true,
      sourceMap: sourcemap
   });

   // Provide special handling for `svelte` and `@typhonjs-fvtt/svelte/component/core`.
   const config = [
      {
         input: 'pack',
         output: {
            file: 'remote/svelte/index.js',
            format: 'es',
            generatedCode: { constBindings: true },
            plugins: [typhonjsRuntimeOut({ isLib }), ...outputPlugins],
            sourcemap
         },
         plugins: [
            virtual({
               pack: `export * from 'svelte';`
            }),
            typhonjsRuntime({ isLib, exclude: ['svelte'] }),
            resolve({ browser: true }),
         ]
      },
      {
         input: 'pack',
         output: {
            file: 'remote/svelte/component/core.js',
            format: 'es',
            generatedCode: { constBindings: true },
            plugins: outputPlugins,
            sourcemap
         },
         plugins: [
            virtual({
               pack: `export * from './node_modules/@typhonjs-fvtt/svelte/_dist/component/core';`
            }),
            svelte({
               onwarn: (warning, handler) =>
               {
                  // Suppress `a11y-missing-attribute` for missing href in <a> links.
                  if (warning.message.includes(`<a> element should have an href attribute`)) { return; }
                  // Suppress a11y form label not associated w/ a control.
                  if (warning.message.includes(`A form label must be associated with a control`)) { return; }

                  // Let Rollup handle all other warnings normally.
                  handler(warning);
               }
            }),
            postcss(postcssCore),
            resolve({
               browser: true,
               dedupe: ['svelte']
            }),
            typhonjsRuntime({ isLib, exclude: ['@typhonjs-fvtt/svelte/component/core'] }),
         ]
      },
      {
         input: 'pack',
         output: {
            file: 'remote/svelte/component/dialog.js',
            format: 'es',
            generatedCode: { constBindings: true },
            plugins: outputPlugins,
            sourcemap
         },
         plugins: [
            virtual({
               pack: `export * from './node_modules/@typhonjs-fvtt/svelte/_dist/component/dialog';`
            }),
            svelte({
               onwarn: (warning, handler) =>
               {
                  // Suppress `a11y-missing-attribute` for missing href in <a> links.
                  if (warning.message.includes(`<a> element should have an href attribute`)) { return; }
                  // Suppress a11y form label not associated w/ a control.
                  if (warning.message.includes(`A form label must be associated with a control`)) { return; }

                  // Let Rollup handle all other warnings normally.
                  handler(warning);
               }
            }),
            postcss(postcssCore),
            resolve({
               browser: true,
               dedupe: ['svelte']
            }),
            typhonjsRuntime({ isLib, exclude: ['@typhonjs-fvtt/svelte/component/dialog'] }),
         ]
      }
   ];

   for (const [key, value] of Object.entries(bundleMap))
   {
      const pack = value.map((entry) => `export * from '${entry}';`).join('\n');

      config.push({
         input: 'pack',
         output: {
            file: `remote/${key}.js`,
            format: 'es',
            generatedCode: { constBindings: true },
            plugins: outputPlugins,
            sourcemap
         },
         plugins: [
            virtual({ pack }),
            typhonjsRuntime({ isLib, exclude: value }),
            resolve({ browser: true }),
         ]
      });
   }

   return config;
}