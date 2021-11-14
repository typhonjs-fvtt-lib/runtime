import postcss       from 'rollup-plugin-postcss';
import resolve       from '@rollup/plugin-node-resolve';
import sourcemaps    from 'rollup-plugin-sourcemaps';
import svelte        from 'rollup-plugin-svelte';
import { terser }    from 'rollup-plugin-terser';

import terserConfig  from './terser.config.js';
import postcssConfig from './postcssConfig.js';

const s_COMPRESS = false;
const s_SOURCEMAPS = true;

const postcssMain = postcssConfig({
   extract: 'typhonjs-lib-component.css',
   compress: s_COMPRESS,
   sourceMap: s_SOURCEMAPS
});

// Defines Svelte and all local exports as external.
// const s_LOCAL_EXTERNAL = [
//    'svelte', 'svelte/easing', 'svelte/internal', 'svelte/motion', 'svelte/store', 'svelte/transition',
//    'svelte/types',
//
//    '@typhonjs-fvtt/svelte, @typhonjs-fvtt/svelte/action, @typhonjs-fvtt/svelte/component', '@typhonjs-fvtt/svelte/gsap',
//    '@typhonjs-fvtt/svelte/handler', '@typhonjs-fvtt/svelte/helper', '@typhonjs-fvtt/svelte/legacy',
//    '@typhonjs-fvtt/svelte/store', '@typhonjs-fvtt/svelte/transition', '@typhonjs-fvtt/svelte/util',
//    '@typhonjs-fvtt/svelte/plugin/data', '@typhonjs-fvtt/svelte/plugin/system',
//
//    '@typhonjs-utils/object',
//
//    `foundry-gsap`  // Replaced by consumer for Foundry GSAP path.
// ];

export default () =>
{
   // Defines potential output plugins to use conditionally if the .env file indicates the bundles should be
   // minified / mangled.
   const outputPlugins = [];
   if (s_COMPRESS)
   {
      outputPlugins.push(terser(terserConfig));
   }

   // Defines whether source maps are generated / loaded from the .env file.
   const sourcemap = s_SOURCEMAPS;

   return [
      {
         input: 'build/svelte/index.js',
         output: {
            file: 'svelte/index.js',
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            resolve(),
            sourcemaps()
         ]
      },
      {
         input: 'build/svelte/action/index.js',
         output: {
            file: 'svelte/action/index.js',
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            resolve(),
            sourcemaps()
         ]
      },
      {
         input: 'build/svelte/legacy/index.js',
         output: {
            file: 'svelte/legacy/index.js',
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            resolve(),
            sourcemaps()
         ]
      },
      {
         input: 'build/svelte/component/index.js',
         output: {
            file: 'svelte/component/index.js',
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            svelte({
               // emitCss: true,
               onwarn: (warning, handler) =>
               {
                  // Suppress `a11y-missing-attribute` for missing href in <a> links.
                  if (warning.message.includes(`<a> element should have an href attribute`)) { return; }

                  // Let Rollup handle all other warnings normally.
                  handler(warning);
               }
            }),
            postcss(postcssMain),
            resolve({
               browser: true,
               dedupe: ['svelte']
            }),
         ]
      },
      {
         input: 'build/svelte/gsap/index.js',
         external: ['foundry-gsap'],
         output: {
            file: 'svelte/gsap/index.js',
            format: 'es',
            paths: {
               'foundry-gsap': '/scripts/greensock/esm/all.js'
            },
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            resolve(),
            sourcemaps()
         ]
      },
      {
         input: 'build/svelte/handler/index.js',
         output: {
            file: 'svelte/handler/index.js',
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            resolve(),
            sourcemaps()
         ]
      },
      {
         input: 'build/svelte/helper/index.js',
         output: {
            file: 'svelte/helper/index.js',
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            resolve(),
            sourcemaps()
         ]
      },
      {
         input: 'build/svelte/store/index.js',
         output: {
            file: 'svelte/store/index.js',
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            resolve(),
            sourcemaps()
         ]
      },
      {
         input: 'build/svelte/transition/index.js',
         output: {
            file: 'svelte/transition/index.js',
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            resolve(),
            sourcemaps()
         ]
      },
      {
         input: 'build/svelte/util/index.js',
         output: {
            file: 'svelte/util/index.js',
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            resolve(),
            sourcemaps()
         ]
      },
      {
         input: 'build/svelte/plugin/data/index.js',
         output: {
            file: 'svelte/plugin/data/index.js',
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            resolve(),
            sourcemaps()
         ]
      },
      {
         input: 'build/svelte/plugin/system/index.js',
         output: {
            file: 'svelte/plugin/system/index.js',
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            resolve(),
            sourcemaps()
         ]
      }
   ];
};