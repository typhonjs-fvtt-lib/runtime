import resolve             from '@rollup/plugin-node-resolve';
import virtual             from '@rollup/plugin-virtual';

import {
   postcssConfig,
   typhonjsRuntime,
   typhonjsRuntimeOut
} from './index.js';
import svelte from "rollup-plugin-svelte";
import postcss from "rollup-plugin-postcss";

// `svelte/action/dom/tooltip`, `util/dom/theme`, `util/i18n`, and `util/path` are skipped, because a platform
// specific implementation for Foundry VTT is added locally.

const bundleMap = {
   // These are handled manually below:
   // 'svelte/component/container': ['../../node_modules/@typhonjs-svelte/runtime-base/svelte/src/svelte/component/container'],
   // 'svelte/component/dom/focus': ['../../node_modules/@typhonjs-svelte/runtime-base/svelte/src/svelte/component/dom/focus'],

   'data/color/colord': ['@typhonjs-svelte/runtime-base/data/color/colord'],
   'data/compress': ['@typhonjs-svelte/runtime-base/data/compress'],
   'data/format/base64': ['@typhonjs-svelte/runtime-base/data/format/base64'],
   'data/format/jsonc': ['@typhonjs-svelte/runtime-base/data/format/jsonc'],
   'data/format/json5': ['@typhonjs-svelte/runtime-base/data/format/json5'],
   'data/format/msgpack': ['@typhonjs-svelte/runtime-base/data/format/msgpack'],
   'data/format/msgpack/compress': ['@typhonjs-svelte/runtime-base/data/format/msgpack/compress'],
   'data/format/unicode': ['@typhonjs-svelte/runtime-base/data/format/unicode'],
   'data/struct/hash/array': ['@typhonjs-svelte/runtime-base/data/struct/hash/array'],
   'data/struct/cache/quick-lru': ['@typhonjs-svelte/runtime-base/data/struct/cache/quick-lru'],
   'data/struct/search/trie': ['@typhonjs-svelte/runtime-base/data/struct/search/trie'],
   'data/struct/search/trie/query': ['@typhonjs-svelte/runtime-base/data/struct/search/trie/query'],
   'math/gl-matrix': ['@typhonjs-svelte/runtime-base/math/gl-matrix'],
   'math/interpolate': ['@typhonjs-svelte/runtime-base/math/interpolate'],
   'math/physics': ['@typhonjs-svelte/runtime-base/math/physics'],
   'math/util': ['@typhonjs-svelte/runtime-base/math/util'],
   'plugin/manager': ['@typhonjs-svelte/runtime-base/plugin/manager'],
   'plugin/manager/eventbus': ['@typhonjs-svelte/runtime-base/plugin/manager/eventbus'],
   'svelte/action/dom/focus': ['@typhonjs-svelte/runtime-base/svelte/action/dom/focus'],
   'svelte/action/dom/inline-svg': ['@typhonjs-svelte/runtime-base/svelte/action/dom/inline-svg'],
   'svelte/action/dom/input': ['@typhonjs-svelte/runtime-base/svelte/action/dom/input'],
   'svelte/action/dom/observer': ['@typhonjs-svelte/runtime-base/svelte/action/dom/observer'],
   'svelte/action/dom/properties': ['@typhonjs-svelte/runtime-base/svelte/action/dom/properties'],
   'svelte/action/dom/style': ['@typhonjs-svelte/runtime-base/svelte/action/dom/style'],
   'svelte/action/util': ['@typhonjs-svelte/runtime-base/svelte/action/util'],
   'svelte/animate': ['svelte/animate', '@typhonjs-svelte/runtime-base/svelte/animate'],
   'svelte/easing': ['svelte/easing', '@typhonjs-svelte/runtime-base/svelte/easing'],
   'svelte/reactivity': ['@typhonjs-svelte/runtime-base/svelte/reactivity'],
   'svelte/store/dom/input': ['@typhonjs-svelte/runtime-base/svelte/store/dom/input'],
   'svelte/store/position': ['@typhonjs-svelte/runtime-base/svelte/store/position'],
   'svelte/store/reducer': ['@typhonjs-svelte/runtime-base/svelte/store/reducer'],
   'svelte/store/reducer/array-object': ['@typhonjs-svelte/runtime-base/svelte/store/reducer/array-object'],
   'svelte/store/util': ['@typhonjs-svelte/runtime-base/svelte/store/util'],
   'svelte/store/web-storage': ['@typhonjs-svelte/runtime-base/svelte/store/web-storage'],
   'svelte/store/web-storage/msgpack': ['@typhonjs-svelte/runtime-base/svelte/store/web-storage/msgpack'],
   'svelte/store/writable-derived': ['@typhonjs-svelte/runtime-base/svelte/store/writable-derived'],
   'svelte/transition': ['svelte/transition', '@typhonjs-svelte/runtime-base/svelte/transition'],
   'svelte/util': ['@typhonjs-svelte/runtime-base/svelte/util'],
   'util': ['@typhonjs-svelte/runtime-base/util'],
   'util/a11y': ['@typhonjs-svelte/runtime-base/util/a11y'],
   'util/animate': ['@typhonjs-svelte/runtime-base/util/animate'],
   'util/async': ['@typhonjs-svelte/runtime-base/util/async'],
   'util/browser': ['@typhonjs-svelte/runtime-base/util/browser'],
   'util/dom/input/tinykeys': ['@typhonjs-svelte/runtime-base/util/dom/input/tinykeys'],
   'util/dom/layout': ['@typhonjs-svelte/runtime-base/util/dom/layout'],
   'util/dom/observer': ['@typhonjs-svelte/runtime-base/util/dom/observer'],
   'util/dom/style': ['@typhonjs-svelte/runtime-base/util/dom/style'],
   'util/html': ['@typhonjs-svelte/runtime-base/util/html'],
   'util/html/striptags': ['@typhonjs-svelte/runtime-base/util/html/striptags'],
   'util/loader-module': ['@typhonjs-svelte/runtime-base/util/loader-module'],
   'util/object': ['@typhonjs-svelte/runtime-base/util/object'],
   'util/realm': ['@typhonjs-svelte/runtime-base/util/realm'],
   'util/semver': ['@typhonjs-svelte/runtime-base/util/semver']
};

export function createRuntimeLibConfig({ sourcemap, outputPlugins = [] })
{
   const isLib = true;

   const postcssContainer = postcssConfig({
      extract: 'container.css',
      compress: true,
      sourceMap: sourcemap
   });

   const postcssDomFocus = postcssConfig({
      extract: 'focus.css',
      compress: true,
      sourceMap: sourcemap
   });

   const config = [
      {
         input: 'pack',
         output: {
            file: 'remote/svelte/component/container.js',
            format: 'es',
            generatedCode: { constBindings: true },
            plugins: outputPlugins,
            sourcemap
         },
         plugins: [
            virtual({
               pack: `export * from './node_modules/@typhonjs-svelte/runtime-base/_dist/svelte/component/container';`
            }),
            svelte(),
            postcss(postcssContainer),
            resolve({
               browser: true,
               dedupe: ['svelte']
            }),
            typhonjsRuntime({ isLib, exclude: ['@typhonjs-svelte/runtime-base/svelte/component/container'] }),
         ]
      },
      {
         input: 'pack',
         output: {
            file: 'remote/svelte/component/dom/focus.js',
            format: 'es',
            generatedCode: { constBindings: true },
            plugins: outputPlugins,
            sourcemap
         },
         plugins: [
            virtual({
               pack: `export * from './node_modules/@typhonjs-svelte/runtime-base/_dist/svelte/component/dom/focus';`
            }),
            svelte(),
            postcss(postcssDomFocus),
            resolve({
               browser: true,
               dedupe: ['svelte']
            }),
            typhonjsRuntime({ isLib, exclude: ['@typhonjs-svelte/runtime-base/svelte/component/dom/focus'] }),
         ]
      },
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
