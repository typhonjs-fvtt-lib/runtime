import resolve             from '@rollup/plugin-node-resolve';
import sourcemaps          from 'rollup-plugin-sourcemaps';
import { terser }          from 'rollup-plugin-terser';

import {
   createSvelteLibConfig,
   createSvelteNPMConfig } from './.rollup/local/index.js';

import terserConfig        from './terser.config.js';
import postcssConfig       from './postcssConfig.js';

const s_COMPRESS = false;     // Compresses the module lib output. Not the NPM distribution bundles.
const s_SOURCEMAPS = true;

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
      ...createSvelteLibConfig({ sourcemap: s_SOURCEMAPS, outputPlugins, postcssCore: postcssLib }),
      ...createSvelteNPMConfig({ sourcemap: s_SOURCEMAPS, outputPlugins: [], postcssCore: postcssNPM }),
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
         file: 'dist/dompurify/index.js',
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