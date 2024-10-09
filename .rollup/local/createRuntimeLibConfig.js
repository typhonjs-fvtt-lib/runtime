import resolve             from '@rollup/plugin-node-resolve';
import virtual             from '@rollup/plugin-virtual';

import {
   typhonjsRuntime,
   typhonjsRuntimeOut }    from './index.js';

const bundleMap = {
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
   'plugin/manager/eventbus/buses': ['@typhonjs-svelte/runtime-base/plugin/manager/eventbus/buses'],
   'svelte/action/animate': ['@typhonjs-svelte/runtime-base/svelte/action/animate'],
   'svelte/action/dom/focus': ['@typhonjs-svelte/runtime-base/svelte/action/dom/focus'],
   'svelte/action/dom/observer': ['@typhonjs-svelte/runtime-base/svelte/action/dom/observer'],
   'svelte/action/dom/properties': ['@typhonjs-svelte/runtime-base/svelte/action/dom/properties'],
   'svelte/action/dom/style': ['@typhonjs-svelte/runtime-base/svelte/action/dom/style'],
   'svelte/action/util': ['@typhonjs-svelte/runtime-base/svelte/action/util'],
   'svelte/animate': ['svelte/animate', '@typhonjs-svelte/runtime-base/svelte/animate'],
   'svelte/easing': ['svelte/easing', '@typhonjs-svelte/runtime-base/svelte/easing'],
   'svelte/store/dom': ['@typhonjs-svelte/runtime-base/svelte/store/dom'],
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
   'util/dom/layout': ['@typhonjs-svelte/runtime-base/util/dom/layout'],
   'util/dom/observer': ['@typhonjs-svelte/runtime-base/util/dom/observer'],
   'util/dom/style': ['@typhonjs-svelte/runtime-base/util/dom/style'],
   'util/dom/tinykeys': ['@typhonjs-svelte/runtime-base/util/dom/tinykeys'],
   'util/loader-module': ['@typhonjs-svelte/runtime-base/util/loader-module'],
   'util/object': ['@typhonjs-svelte/runtime-base/util/object'],
   'util/store': ['@typhonjs-svelte/runtime-base/util/store']
};

export function createRuntimeLibConfig({ sourcemap, outputPlugins = [] })
{
   const isLib = true;

   const config = [];

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
