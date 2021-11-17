// import alias         from '@rollup/plugin-alias';
import commonjs      from '@rollup/plugin-commonjs';
import postcss       from 'rollup-plugin-postcss';
import resolve       from '@rollup/plugin-node-resolve';
import sourcemaps    from 'rollup-plugin-sourcemaps';
import svelte        from 'rollup-plugin-svelte';
import { terser }    from 'rollup-plugin-terser';

import {
   getExternal,
   typhonjsRuntime } from './.rollup/local/index.js';

import terserConfig  from './terser.config.js';
import postcssConfig from './postcssConfig.js';

const s_COMPRESS = false;
const s_SOURCEMAPS = false;

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
    ...s_MODULES_SVELTE,
    ...s_MODULES_TINYMCE,
    ...s_MODULES_PLUGIN,
    ...s_MODULES_DOMPURIFY,
    ...s_MODULES_COLLECTJS
   ];
};

const s_MODULES_COLLECTJS = [
   {
      input: '.build/collectjs/collect.js',
      output: {
         file: 'collectjs/collect.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         resolve({ browser: true }),
         commonjs(),
         sourcemaps()
      ]
   }
];

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
      input: '.build/svelte/internal.js',
      external: getExternal('svelte/internal'),
      output: {
         file: 'svelte/internal.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ includeExternal: false }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/index.js',
      external: getExternal('@typhonjs-fvtt/svelte'),
      output: {
         file: 'svelte/index.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ includeExternal: false }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/action.js',
      external: getExternal('@typhonjs-fvtt/svelte/action'),
      output: {
         file: 'svelte/action.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ includeExternal: false }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/legacy.js',
      external: getExternal('@typhonjs-fvtt/svelte/legacy'),
      output: {
         file: 'svelte/legacy.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ includeExternal: false }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/component/core.js',
      external: getExternal('@typhonjs-fvtt/svelte/component/core'),
      output: {
         file: 'svelte/component/core.js',
         format: 'es',
         plugins: [typhonjsRuntime({ output: true }), ...outputPlugins],
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         // alias({
         //    entries: [
         //       { find: 'get_current_component', replacement: '/modules/typhonjs/svelte/internal.js' }
         //    ]
         // }),
         svelte({

            // emitCss: true,
            // compilerOptions: {
            //    customElement: true
            // },
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
         typhonjsRuntime({ includeExternal: false }),
      ]
   },
   {
      input: '.build/svelte/easing.js',
      external: getExternal('svelte/easing'),
      output: {
         file: 'svelte/easing.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ includeExternal: false }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/gsap.js',
      external: getExternal('@typhonjs-fvtt/svelte/gsap'),
      output: {
         file: 'svelte/gsap.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ includeExternal: false }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/handler.js',
      external: getExternal('@typhonjs-fvtt/svelte/handler'),
      output: {
         file: 'svelte/handler.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ includeExternal: false }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/helper.js',
      external: getExternal('@typhonjs-fvtt/svelte/helper'),
      output: {
         file: 'svelte/helper.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ includeExternal: false }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/store.js',
      external: getExternal('@typhonjs-fvtt/svelte/store'),
      output: {
         file: 'svelte/store.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ includeExternal: false }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/transition.js',
      external: getExternal('@typhonjs-fvtt/svelte/transition', 'svelte/transition'),
      output: {
         file: 'svelte/transition.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ includeExternal: false }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/util.js',
      external: getExternal('@typhonjs-fvtt/svelte/util'),
      output: {
         file: 'svelte/util.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ includeExternal: false }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/plugin/data.js',
      external: getExternal('@typhonjs-fvtt/svelte/plugin/data'),
      output: {
         file: 'svelte/plugin/data.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ includeExternal: false }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   },
   {
      input: '.build/svelte/plugin/system.js',
      external: getExternal('@typhonjs-fvtt/svelte/plugin/system'),
      output: {
         file: 'svelte/plugin/system.js',
         format: 'es',
         plugins: outputPlugins,
         preferConst: true,
         sourcemap,
         // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
      },
      plugins: [
         typhonjsRuntime({ includeExternal: false }),
         resolve({ browser: true }),
         sourcemaps()
      ]
   }
];
