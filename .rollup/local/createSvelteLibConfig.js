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
   // 'svelte/component/internal': ['../../node_modules/@typhonjs-fvtt/svelte/src/component/internal'],
   'svelte/animate/gsap': ['@typhonjs-fvtt/svelte/animate/gsap'],
   'svelte/application': ['@typhonjs-fvtt/svelte/application'],
   'svelte/store/fvtt': ['@typhonjs-fvtt/svelte/store/fvtt'],
   'svelte/store/fvtt/document': ['@typhonjs-fvtt/svelte/store/fvtt/document'],
   'svelte/store/fvtt/settings': ['@typhonjs-fvtt/svelte/store/fvtt/settings'],
   'svelte/store/fvtt/settings/world': ['@typhonjs-fvtt/svelte/store/fvtt/settings/world'],

   // TODO: combining both packages here will duplicate the easing functions in the lib bundle.
   'svelte/easing': ['svelte/easing', '@typhonjs-svelte/runtime-base/svelte/easing'],
   'svelte/internal': ['svelte/internal'],
   'svelte/motion': ['svelte/motion'],
   'svelte/store': ['svelte/store']
};

export function createSvelteLibConfig({ sourcemap, outputPlugins = [] })
{
   const isLib = true;

   const postcssApplication = postcssConfig({
      extract: 'application.css',
      compress: true,
      sourceMap: sourcemap
   });

   const postcssInternal = postcssConfig({
      extract: 'internal.css',
      compress: true,
      sourceMap: sourcemap
   });

   // Provide special handling for `svelte` and `@typhonjs-fvtt/svelte/component/application`.
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
            file: 'remote/svelte/component/application.js',
            format: 'es',
            generatedCode: { constBindings: true },
            plugins: outputPlugins,
            sourcemap
         },
         plugins: [
            virtual({
               pack: `export * from './node_modules/@typhonjs-fvtt/svelte/_dist/component/application';`
            }),
            svelte(),
            postcss(postcssApplication),
            resolve({
               browser: true,
               dedupe: ['svelte']
            }),
            typhonjsRuntime({ isLib, exclude: ['@typhonjs-fvtt/svelte/component/application'] }),
         ]
      },
      {
         input: 'pack',
         output: {
            file: 'remote/svelte/component/internal.js',
            format: 'es',
            generatedCode: { constBindings: true },
            plugins: outputPlugins,
            sourcemap
         },
         plugins: [
            virtual({
               pack: `export * from './node_modules/@typhonjs-fvtt/svelte/_dist/component/internal';`
            }),
            svelte(),
            postcss(postcssInternal),
            resolve({
               browser: true,
               dedupe: ['svelte']
            }),
            typhonjsRuntime({ isLib, exclude: ['@typhonjs-fvtt/svelte/component/internal'] }),
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
