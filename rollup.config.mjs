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

const postcssLib = postcssConfig({
   extract: 'core.css',
   compress: s_COMPRESS,
   sourceMap: s_SOURCEMAPS
});

const postcssNPM = postcssConfig({
   extract: 'core.css',
   compress: s_COMPRESS,
   sourceMap: s_SOURCEMAPS
});

// Defines whether source maps are generated / loaded from the .env file.
const sourcemap = s_SOURCEMAPS;

// Defines potential output plugins to use conditionally if the .env file indicates the bundles should be
// minified / mangled.
const outputPlugins = s_COMPRESS ? [terser(terserConfig)] : [];

export default () =>
{
   return [
      ...s_MODULES_DOMPURIFY,
      ...s_MODULES_PLUGIN,
      ...createSvelteConfig(true, s_OUTPUT_MAP_LIB, postcssLib),
      ...createSvelteConfig(false, s_OUTPUT_MAP_NPM, postcssNPM),
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
   },
   {
      input: '.build/dompurify/DOMPurify.js',
      output: {
         file: 'dist/dompurify/main/index.js',
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
   },
   {
      input: '.build/dompurify/plugin/system/index.js',
      output: {
         file: 'dompurify/plugin/system.js',
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
   },
   {
      input: '.build/dompurify/plugin/system/index.js',
      output: {
         file: 'dist/dompurify/plugin/system/index.js',
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
   },
   {
      input: '.build/plugin/manager.js',
      output: {
         file: 'dist/plugin/manager/index.js',
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
         format: 'es',
         inlineDynamicImports: true,
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/tinymce/initializePlugins.js',
      output: {
         dir: 'dist/tinymce',
         format: 'es',
         inlineDynamicImports: true,
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

const s_OUTPUT_MAP_LIB = {
   '.build/svelte/index.js': 'svelte/index.js',
   '.build/svelte/action.js': 'svelte/action.js',
   '.build/svelte/application.js': 'svelte/application.js',
   '.build/svelte/application/legacy.js': 'svelte/application/legacy.js',
   '.build/svelte/animate.js': 'svelte/animate.js',
   '.build/svelte/component/core.js': 'svelte/component/core.js',
   '.build/svelte/easing.js': 'svelte/easing.js',
   '.build/svelte/gsap.js': 'svelte/gsap.js',
   '.build/svelte/handler.js': 'svelte/handler.js',
   '.build/svelte/helper.js': 'svelte/helper.js',
   '.build/svelte/internal.js': 'svelte/internal.js',
   '.build/svelte/motion.js': 'svelte/motion.js',
   '.build/svelte/store.js': 'svelte/store.js',
   '.build/svelte/transition.js': 'svelte/transition.js',
   '.build/svelte/util.js': 'svelte/util.js',
   '.build/svelte/plugin/data.js': 'svelte/plugin/data.js',
   '.build/svelte/plugin/system.js': 'svelte/plugin/system.js'
}

const s_OUTPUT_MAP_NPM = {
   '.build/svelte/index.js': 'dist/svelte/main/index.js',
   '.build/svelte/action.js': 'dist/svelte/action/index.js',
   '.build/svelte/application.js': 'dist/svelte/application/index.js',
   '.build/svelte/application/legacy.js': 'dist/svelte/application/legacy/index.js',
   '.build/svelte/animate.js': 'dist/svelte/animate/index.js',
   '.build/svelte/component/core.js': 'dist/svelte/component/core/index.js',
   '.build/svelte/easing.js': 'dist/svelte/easing/index.js',
   '.build/svelte/gsap.js': 'dist/svelte/gsap/index.js',
   '.build/svelte/handler.js': 'dist/svelte/handler/index.js',
   '.build/svelte/helper.js': 'dist/svelte/helper/index.js',
   '.build/svelte/internal.js': 'dist/svelte/internal/index.js',
   '.build/svelte/motion.js': 'dist/svelte/motion/index.js',
   '.build/svelte/store.js': 'dist/svelte/store/index.js',
   '.build/svelte/transition.js': 'dist/svelte/transition/index.js',
   '.build/svelte/util.js': 'dist/svelte/util/index.js',
   '.build/svelte/plugin/data.js': 'dist/svelte/plugin/data/index.js',
   '.build/svelte/plugin/system.js': 'dist/svelte/plugin/system/index.js'
}

function createSvelteConfig(isLib, outputMap, postcssCore)
{
   return [
      {
         input: '.build/svelte/index.js',
         output: {
            file: outputMap['.build/svelte/index.js'],
            format: 'es',
            plugins: [typhonjsRuntime({ isLib, output: true }), ...outputPlugins],
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            typhonjsRuntime({ isLib, exclude: ['svelte'] }),
            resolve({ browser: true }),
            sourcemaps()
         ]
      },
      {
         input: '.build/svelte/action.js',
         output: {
            file: outputMap['.build/svelte/action.js'],
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            typhonjsRuntime({ isLib, exclude: ['@typhonjs-fvtt/svelte/action'] }),
            resolve({ browser: true }),
            sourcemaps()
         ]
      },
      {
         input: '.build/svelte/application.js',
         output: {
            file: outputMap['.build/svelte/application.js'],
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            typhonjsRuntime({ isLib, exclude: ['@typhonjs-fvtt/svelte/application'] }),
            resolve({ browser: true }),
            sourcemaps()
         ]
      },
      {
         input: '.build/svelte/application/legacy.js',
         output: {
            file: outputMap['.build/svelte/application/legacy.js'],
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            typhonjsRuntime({ isLib, exclude: ['@typhonjs-fvtt/svelte/application/legacy'] }),
            resolve({ browser: true }),
            sourcemaps()
         ]
      },
      {
         input: '.build/svelte/animate.js',
         output: {
            file: outputMap['.build/svelte/animate.js'],
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            typhonjsRuntime({ isLib, exclude: ['svelte/animate'] }),
            resolve({ browser: true }),
            sourcemaps()
         ]
      },
      {
         input: '.build/svelte/component/core.js',
         output: {
            file: outputMap['.build/svelte/component/core.js'],
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            svelte({
               onwarn: (warning, handler) =>
               {
                  // Suppress `a11y-missing-attribute` for missing href in <a> links.
                  if (warning.message.includes(`<a> element should have an href attribute`))
                  { return; }

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
         input: '.build/svelte/easing.js',
         output: {
            file: outputMap['.build/svelte/easing.js'],
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            typhonjsRuntime({ isLib, exclude: ['svelte/easing'] }),
            resolve({ browser: true }),
            sourcemaps()
         ]
      },
      {
         input: '.build/svelte/gsap.js',
         output: {
            file: outputMap['.build/svelte/gsap.js'],
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            typhonjsRuntime({ isLib, exclude: ['@typhonjs-fvtt/svelte/gsap'] }),
            resolve({ browser: true }),
            sourcemaps()
         ]
      },
      {
         input: '.build/svelte/handler.js',
         output: {
            file: outputMap['.build/svelte/handler.js'],
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            typhonjsRuntime({ isLib, exclude: ['@typhonjs-fvtt/svelte/handler'] }),
            resolve({ browser: true }),
            sourcemaps()
         ]
      },
      {
         input: '.build/svelte/helper.js',
         output: {
            file: outputMap['.build/svelte/helper.js'],
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            typhonjsRuntime({ isLib, exclude: ['@typhonjs-fvtt/svelte/helper'] }),
            resolve({ browser: true }),
            sourcemaps()
         ]
      },
      {
         input: '.build/svelte/internal.js',
         output: {
            file: outputMap['.build/svelte/internal.js'],
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            typhonjsRuntime({ isLib, exclude: ['svelte/internal'] }),
            resolve({ browser: true }),
            sourcemaps()
         ]
      },
      {
         input: '.build/svelte/motion.js',
         output: {
            file: outputMap['.build/svelte/motion.js'],
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            typhonjsRuntime({ isLib, exclude: ['svelte/motion'] }),
            resolve({ browser: true }),
            sourcemaps()
         ]
      },
      {
         input: '.build/svelte/store.js',
         output: {
            file: outputMap['.build/svelte/store.js'],
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            typhonjsRuntime({ isLib, exclude: ['@typhonjs-fvtt/svelte/store', 'svelte/store'] }),
            resolve({ browser: true }),
            sourcemaps()
         ]
      },
      {
         input: '.build/svelte/transition.js',
         output: {
            file: outputMap['.build/svelte/transition.js'],
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            typhonjsRuntime({ isLib, exclude: ['@typhonjs-fvtt/svelte/transition', 'svelte/transition'] }),
            resolve({ browser: true }),
            sourcemaps()
         ]
      },
      {
         input: '.build/svelte/util.js',
         output: {
            file: outputMap['.build/svelte/util.js'],
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            typhonjsRuntime({ isLib, exclude: ['@typhonjs-fvtt/svelte/util'] }),
            resolve({ browser: true }),
            sourcemaps()
         ]
      },
      {
         input: '.build/svelte/plugin/data.js',
         output: {
            file: outputMap['.build/svelte/plugin/data.js'],
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            typhonjsRuntime({ isLib, exclude: ['@typhonjs-fvtt/svelte/plugin/data'] }),
            resolve({ browser: true }),
            sourcemaps()
         ]
      },
      {
         input: '.build/svelte/plugin/system.js',
         output: {
            file: outputMap['.build/svelte/plugin/system.js'],
            format: 'es',
            plugins: outputPlugins,
            preferConst: true,
            sourcemap,
            // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
         },
         plugins: [
            typhonjsRuntime({ isLib, exclude: ['@typhonjs-fvtt/svelte/plugin/system'] }),
            resolve({ browser: true }),
            sourcemaps()
         ]
      }
   ];
}
