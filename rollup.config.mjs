import postcss             from 'rollup-plugin-postcss';
import resolve             from '@rollup/plugin-node-resolve';
import sourcemaps          from 'rollup-plugin-sourcemaps';
import svelte              from 'rollup-plugin-svelte';
import { terser }          from 'rollup-plugin-terser';

import { typhonjsRuntime } from './.rollup/local/index.js';

import terserConfig        from './terser.config.js';
import postcssConfig       from './postcssConfig.js';

const s_COMPRESS = true;
const s_SOURCEMAPS = false;
const s_IS_MODULE_LIB = true;

const postcssMain = postcssConfig({
   extract: 'core.css',
   compress: s_COMPRESS,
   sourceMap: s_SOURCEMAPS
});

// Defines whether source maps are generated / loaded from the .env file.
const sourcemap = s_SOURCEMAPS;

// Defines potential output plugins to use conditionally if the .env file indicates the bundles should be
// minified / mangled.
const outputPlugins = [];
if (s_COMPRESS)
{
   outputPlugins.push(terser(terserConfig));
}

export default () =>
{
   return [
      ...s_MODULES_DOMPURIFY,
      ...s_MODULES_PLUGIN,
      ...s_MODULES_SVELTE,
      ...s_MODULES_TINYMCE
   ];
};

const s_MODULES_DOMPURIFY = [
   {
      input: '.build/dompurify/DOMPurify.js',
      output: {
         file: 'dompurify/DOMPurify.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         resolve({ browser: true }),
         sourcemaps()
      ]
   }
];

const s_MODULES_PLUGIN = [
  {
      input: '.build/plugin/manager.js',
      output: {
         file: 'plugin/manager.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         resolve({ browser: true }),
         sourcemaps()
      ]
   }
];

const s_MODULES_TINYMCE = [
   {
      input: '.build/tinymce/initializePlugins.js',
      output: {
         dir: 'tinymce',
         // file: 'tinymce/initializePlugins.js',
         format: 'es',
         inlineDynamicImports: false,
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         resolve({ browser: true }),
         sourcemaps()
      ]
   }
];

const s_MODULES_SVELTE = [
   {
      input: '.build/svelte/action.js',
      output: {
         file: 'svelte/action.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ isLib: s_IS_MODULE_LIB, exclude: ['@typhonjs-fvtt/svelte/action'] }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/application.js',
      output: {
         file: 'svelte/application.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ isLib: s_IS_MODULE_LIB, exclude: ['@typhonjs-fvtt/svelte/application'] }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/application/legacy.js',
      output: {
         file: 'svelte/application/legacy.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ isLib: s_IS_MODULE_LIB, exclude: ['@typhonjs-fvtt/svelte/application/legacy'] }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/animate.js',
      output: {
         file: 'svelte/animate.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ isLib: s_IS_MODULE_LIB, exclude: ['svelte/animate'] }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/component/core.js',
      output: {
         file: 'svelte/component/core.js',
         format: 'es',
         plugins: s_IS_MODULE_LIB ? [typhonjsRuntime({ output: true }), ...outputPlugins] : outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         svelte({
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
         typhonjsRuntime({ isLib: s_IS_MODULE_LIB, exclude: ['@typhonjs-fvtt/svelte/component/core'] }),
      ]
   },
   {
      input: '.build/svelte/easing.js',
      output: {
         file: 'svelte/easing.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ isLib: s_IS_MODULE_LIB, exclude: ['svelte/easing'] }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/gsap.js',
      output: {
         file: 'svelte/gsap.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ isLib: s_IS_MODULE_LIB, exclude: ['@typhonjs-fvtt/svelte/gsap'] }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/handler.js',
      output: {
         file: 'svelte/handler.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ isLib: s_IS_MODULE_LIB, exclude: ['@typhonjs-fvtt/svelte/handler'] }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/helper.js',
      output: {
         file: 'svelte/helper.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ isLib: s_IS_MODULE_LIB, exclude: ['@typhonjs-fvtt/svelte/helper'] }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/internal.js',
      output: {
         file: 'svelte/internal.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ isLib: s_IS_MODULE_LIB, exclude: ['svelte/internal'] }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/motion.js',
      output: {
         file: 'svelte/motion.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ isLib: s_IS_MODULE_LIB, exclude: ['svelte/motion'] }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/store.js',
      output: {
         file: 'svelte/store.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ isLib: s_IS_MODULE_LIB, exclude: ['@typhonjs-fvtt/svelte/store', 'svelte/store'] }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/transition.js',
      output: {
         file: 'svelte/transition.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ isLib: s_IS_MODULE_LIB, exclude: ['@typhonjs-fvtt/svelte/transition', 'svelte/transition'] }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/util.js',
      output: {
         file: 'svelte/util.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ isLib: s_IS_MODULE_LIB, exclude: ['@typhonjs-fvtt/svelte/util'] }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/plugin/data.js',
      output: {
         file: 'svelte/plugin/data.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ isLib: s_IS_MODULE_LIB, exclude: ['@typhonjs-fvtt/svelte/plugin/data'] }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/plugin/system.js',
      output: {
         file: 'svelte/plugin/system.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ isLib: s_IS_MODULE_LIB, exclude: ['@typhonjs-fvtt/svelte/plugin/system'] }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   }
];
