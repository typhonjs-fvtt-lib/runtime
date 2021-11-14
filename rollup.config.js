import commonjs      from '@rollup/plugin-commonjs';
import postcss       from 'rollup-plugin-postcss';
import resolve       from '@rollup/plugin-node-resolve';
import sourcemaps    from 'rollup-plugin-sourcemaps';
import svelte        from 'rollup-plugin-svelte';
import { terser }    from 'rollup-plugin-terser';

import terserConfig  from './terser.config.js';
import postcssConfig from './postcssConfig.js';

const s_COMPRESS = false;
const s_SOURCEMAPS = false;

const postcssMain = postcssConfig({
   extract: 'css/component.css',
   compress: s_COMPRESS,
   sourceMap: s_SOURCEMAPS
});

// Defines @typhonjs-fvtt/svelte imports to exclude and foundry-gsap.
const s_LOCAL_EXTERNAL = [
   '@typhonjs-fvtt/svelte', '@typhonjs-fvtt/svelte/action', '@typhonjs-fvtt/svelte/component',
   '@typhonjs-fvtt/svelte/gsap', '@typhonjs-fvtt/svelte/handler', '@typhonjs-fvtt/svelte/helper',
   '@typhonjs-fvtt/svelte/legacy', '@typhonjs-fvtt/svelte/store', '@typhonjs-fvtt/svelte/transition',
   '@typhonjs-fvtt/svelte/util', '@typhonjs-fvtt/svelte/plugin/data', '@typhonjs-fvtt/svelte/plugin/system',

   'svelte/easing',
   'svelte/internal',
   'svelte/transition',

   `foundry-gsap`  // Replaced by consumer for Foundry GSAP path.
];

// Defines @typhonjs-fvtt/svelte browser imports to and foundry-gsap.
const s_LIBRARY_PATHS = {
   '@typhonjs-fvtt/svelte': '/modules/typhonjs/svelte/index.js',
   '@typhonjs-fvtt/svelte/action': '/modules/typhonjs/svelte/action.js',
   '@typhonjs-fvtt/svelte/component': '/modules/typhonjs/svelte/component.js',
   '@typhonjs-fvtt/svelte/gsap': '/modules/typhonjs/svelte/gsap.js',
   '@typhonjs-fvtt/svelte/handler': '/modules/typhonjs/svelte/handler.js',
   '@typhonjs-fvtt/svelte/helper': '/modules/typhonjs/svelte/helper.js',
   '@typhonjs-fvtt/svelte/legacy': '/modules/typhonjs/svelte/legacy.js',
   '@typhonjs-fvtt/svelte/store': '/modules/typhonjs/svelte/store.js',
   '@typhonjs-fvtt/svelte/transition': '/modules/typhonjs/svelte/transition.js',
   '@typhonjs-fvtt/svelte/util': '/modules/typhonjs/svelte/util.js',
   '@typhonjs-fvtt/svelte/plugin/data': '/modules/typhonjs/svelte/plugin/data.js',
   '@typhonjs-fvtt/svelte/plugin/system': '/modules/typhonjs/svelte/plugin/system.js',

   'svelte/easing': '/modules/typhonjs/svelte/easing.js',
   'svelte/transition': '/modules/typhonjs/svelte/transition.js',
   'svelte/internal': '/modules/typhonjs/svelte/internal.js',

   'foundry-gsap': '/scripts/greensock/esm/all.js'
};

const getExternal = (...exclude) =>
{
   return s_LOCAL_EXTERNAL.filter((entry) => !exclude.includes(entry));
};

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
      input: 'build/collectjs/collect.js',
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
      input: 'build/dompurify/DOMPurify.js',
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
      input: 'build/plugin/manager.js',
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
      input: 'build/plugin/eventbus.js',
      output: {
         file: 'plugin/eventbus.js',
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
      input: 'build/tinymce/oembed.js',
      output: {
         file: 'tinymce/oembed.js',
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

const s_MODULES_SVELTE = [
   {
      input: 'build/svelte/internal.js',
      external: getExternal('svelte/internal'),
      output: {
         file: 'svelte/internal.js',
         format: 'es',
         paths: s_LIBRARY_PATHS,
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
      input: 'build/svelte/index.js',
      external: getExternal('@typhonjs-fvtt/svelte'),
      output: {
         file: 'svelte/index.js',
         format: 'es',
         paths: s_LIBRARY_PATHS,
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
      input: 'build/svelte/action.js',
      external: getExternal('@typhonjs-fvtt/svelte/action'),
      output: {
         file: 'svelte/action.js',
         format: 'es',
         paths: s_LIBRARY_PATHS,
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
      input: 'build/svelte/legacy.js',
      external: getExternal('@typhonjs-fvtt/svelte/legacy'),
      output: {
         file: 'svelte/legacy.js',
         format: 'es',
         paths: s_LIBRARY_PATHS,
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
      input: 'build/svelte/component.js',
      external: getExternal('@typhonjs-fvtt/svelte/component'),
      output: {
         file: 'svelte/component.js',
         format: 'es',
         paths: s_LIBRARY_PATHS,
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
      input: 'build/svelte/easing.js',
      external: getExternal('svelte/easing'),
      output: {
         file: 'svelte/easing.js',
         format: 'es',
         paths: s_LIBRARY_PATHS,
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
      input: 'build/svelte/gsap.js',
      external: getExternal('@typhonjs-fvtt/svelte/gsap'),
      output: {
         file: 'svelte/gsap.js',
         format: 'es',
         paths: s_LIBRARY_PATHS,
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
      input: 'build/svelte/handler.js',
      external: getExternal('@typhonjs-fvtt/svelte/handler'),
      output: {
         file: 'svelte/handler.js',
         format: 'es',
         paths: s_LIBRARY_PATHS,
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
      input: 'build/svelte/helper.js',
      external: getExternal('@typhonjs-fvtt/svelte/helper'),
      output: {
         file: 'svelte/helper.js',
         format: 'es',
         paths: s_LIBRARY_PATHS,
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
      input: 'build/svelte/store.js',
      external: getExternal('@typhonjs-fvtt/svelte/store'),
      output: {
         file: 'svelte/store.js',
         format: 'es',
         paths: s_LIBRARY_PATHS,
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
      input: 'build/svelte/transition.js',
      external: getExternal('@typhonjs-fvtt/svelte/transition', 'svelte/transition'),
      output: {
         file: 'svelte/transition.js',
         format: 'es',
         paths: s_LIBRARY_PATHS,
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
      input: 'build/svelte/util.js',
      external: getExternal('@typhonjs-fvtt/svelte/util'),
      output: {
         file: 'svelte/util.js',
         format: 'es',
         paths: s_LIBRARY_PATHS,
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
      input: 'build/svelte/plugin/data.js',
      external: getExternal('@typhonjs-fvtt/svelte/plugin/data'),
      output: {
         file: 'svelte/plugin/data.js',
         format: 'es',
         paths: s_LIBRARY_PATHS,
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
      input: 'build/svelte/plugin/system.js',
      external: getExternal('@typhonjs-fvtt/svelte/plugin/system'),
      output: {
         file: 'svelte/plugin/system.js',
         format: 'es',
         paths: s_LIBRARY_PATHS,
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
