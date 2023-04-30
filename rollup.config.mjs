import path                from 'path';

import commonjs            from '@rollup/plugin-commonjs';
import resolve             from '@rollup/plugin-node-resolve';
import { generateDTS }     from '@typhonjs-build-test/esm-d-ts';
import { getFileList }     from '@typhonjs-utils/file-util';
import fs                  from 'fs-extra';
import { rollup }          from 'rollup';
import upath               from 'upath';

import {
   createSvelteLibConfig,
   createSvelteNPMConfig } from './.rollup/local/index.js';

const s_SOURCEMAPS = true;

// Defines whether source maps are generated / loaded from the .env file.
const sourcemap = s_SOURCEMAPS;

// Defines potential output plugins to use conditionally if the .env file indicates the bundles should be
// minified / mangled.
const outputPlugins = [];

const s_MODULES_DOMPURIFY_LIB = [
   {
      input: '.build/dompurify/DOMPurify.js',
      plugins: [
         resolve({ browser: true })
      ],
      output: {
         file: 'remote/dompurify/DOMPurify.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap
      }
   },
   {
      input: '.build/dompurify/plugin/system/index.js',
      plugins: [
         resolve({ browser: true })
      ],
      output: {
         file: 'remote/dompurify/plugin/system.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap
      }
   }
];

const s_MODULES_DOMPURIFY_NPM = [
   {
      input: {
         input: '.build/dompurify/DOMPurify.js',
         plugins: [
            resolve({ browser: true })
         ]
      },
      output: {
         file: '_dist/dompurify/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         sourcemap
      }
   },
   {
      input: {
         input: '.build/dompurify/plugin/system/index.js',
         plugins: [
            resolve({ browser: true })
         ]
      },
      output: {
         file: '_dist/dompurify/plugin/system/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         sourcemap
      }
   }
];

const s_MODULES_JSON5_LIB = [
   {
      input: '.build/json/json5.js',
      plugins: [
         resolve({ browser: true }),
         commonjs()
      ],
      output: {
         file: 'remote/json/json5.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap
      }
   }
];

const s_MODULES_JSON5_NPM = [
   {
      input: {
         input: '.build/json/json5.js',
         plugins: [
            resolve({ browser: true }),
            commonjs()
         ]
      },
      output: {
         file: '_dist/json/json5/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         sourcemap
      }
   }
];

const s_MODULES_PLUGIN_LIB = [
   {
      input: '.build/plugin/manager.js',
      plugins: [
         resolve({ browser: true })
      ],
      output: {
         file: 'remote/plugin/manager.js',
         format: 'es',
         generatedCode: { constBindings: true },
         plugins: outputPlugins,
         sourcemap
      }
   }
];

const s_MODULES_PLUGIN_NPM = [
   {
      input: {
         input: '.build/plugin/manager.js',
         plugins: [
            resolve({ browser: true })
         ]
      },
      dtsFile: '.build/plugin/manager.js',
      output: {
         file: '_dist/plugin/manager/index.js',
         format: 'es',
         generatedCode: { constBindings: true },
         sourcemap
      }
   }
];

const s_MODULES_TINYMCE_LIB = [
   {
      input: '.build/tinymce/initializePlugins.js',
      plugins: [
         resolve({ browser: true })
      ],
      output: {
         dir: 'remote/tinymce',
         format: 'es',
         generatedCode: { constBindings: true },
         inlineDynamicImports: true,
         plugins: outputPlugins,
         sourcemap
      }
   }
];

const s_MODULES_TINYMCE_NPM = [
   {
      input: {
         input: '.build/tinymce/initializePlugins.js',
         plugins: [
            resolve({ browser: true })
         ]
      },
      file: './_dist/tinymce/initializePlugins.js',
      output: {
         dir: '_dist/tinymce',
         format: 'es',
         generatedCode: { constBindings: true },
         inlineDynamicImports: true,
         sourcemap
      }
   }
];

const rollupPluginsNPM = [
   ...s_MODULES_DOMPURIFY_NPM,
   ...s_MODULES_JSON5_NPM,
   ...s_MODULES_PLUGIN_NPM,
   ...createSvelteNPMConfig({ sourcemap: s_SOURCEMAPS, outputPlugins: [] }),
   ...s_MODULES_TINYMCE_NPM
];

for (const config of rollupPluginsNPM)
{
   console.log(`Generating bundle: ${config.input.input}`);

   const bundle = await rollup(config.input);

   await bundle.write(config.output);

   // closes the bundle
   await bundle.close();

   const copyDTS = config.copyDTS;
   const skipDTS = config.skipDTS ?? false;
   const dtsFile = config.dtsFile ?? config.output.file ?? config.file;
   const outFile = config.output.file ?? config.file;

   // Skip generating some DTS files.
   if (skipDTS)
   {
      console.warn(`Skipping TS Declaration: ${config.input.input}`);
      continue;
   }

   const outFileDTS = upath.changeExt(outFile, '.d.ts');

   if (copyDTS)
   {
      console.log(`Copying TS Declaration: ${copyDTS}`);

      let fileData = fs.readFileSync(copyDTS, 'utf-8');
      fileData = fileData.replaceAll('_typhonjs_fvtt_svelte_', '_typhonjs_fvtt_runtime_svelte_');
      fileData = fileData.replaceAll('@typhonjs-fvtt/svelte/', '@typhonjs-fvtt/runtime/svelte/');
      fs.writeFileSync(outFileDTS, fileData, 'utf-8');
   }
   else
   {
      console.log(`Generating TS Declaration: ${config.input.input}`);

      await generateDTS({
         input: dtsFile,
         output: upath.changeExt(outFile, '.d.ts')
      });
   }
}

// @typhonjs-fvtt/svelte/application & application/legacy ------------------------------------------------------------

// Handle @typhonjs-fvtt/svelte/application & application/legacy by copying the source and converting all import
// package references from `@typhonjs-fvtt/svelte` to `@typhonjs-fvtt/runtime/svelte`.
fs.emptyDirSync('./_dist/svelte/application');
fs.copySync('./node_modules/@typhonjs-fvtt/svelte/_dist/application', './_dist/svelte/application');
const appFiles = await getFileList({ dir: './_dist/svelte/application' });
for (const appFile of appFiles)
{
   let fileData = fs.readFileSync(appFile, 'utf-8').toString();
   fileData = fileData.replaceAll('@typhonjs-fvtt/svelte/', '@typhonjs-fvtt/runtime/svelte/')
   fileData = fileData.replaceAll('@typhonjs-svelte/lib/', '@typhonjs-fvtt/runtime/svelte/')

   // For types
   fileData = fileData.replaceAll('_typhonjs_fvtt_svelte_', '_typhonjs_fvtt_runtime_svelte_');

   fs.writeFileSync(appFile, fileData);
}

// @typhonjs-fvtt/svelte/component/core & component/dialog -----------------------------------------------------------

// Handle @typhonjs-fvtt/svelte/component/core & component/dialog by copying the source and converting all import
// package references from `@typhonjs-fvtt/svelte` to `@typhonjs-fvtt/runtime/svelte`.
fs.emptyDirSync('./_dist/svelte/component');
fs.copySync('./node_modules/@typhonjs-fvtt/svelte/_dist/component', './_dist/svelte/component');
const compFiles = await getFileList({ dir: './_dist/svelte/component' });
for (const compFile of compFiles)
{
   const fileData = fs.readFileSync(compFile, 'utf-8').toString();
   fs.writeFileSync(compFile, fileData.replaceAll('@typhonjs-fvtt/svelte/', '@typhonjs-fvtt/runtime/svelte/'));
}

// Gsap Plugins ------------------------------------------------------------------------------------------------------

// Handle @typhonjs-fvtt/svelte/gsap-plugins by copying the source and converting all import
// package references from `@typhonjs-fvtt/svelte` to `@typhonjs-fvtt/runtime/svelte`.
fs.emptyDirSync('./_dist/svelte/gsap/plugin');
fs.copySync('./node_modules/@typhonjs-fvtt/svelte/_dist/gsap/plugin', './_dist/svelte/gsap/plugin');
let gsapFiles = await getFileList({ dir: './_dist/svelte/gsap/plugin' });
for (const gsapFile of gsapFiles)
{
   const fileData = fs.readFileSync(gsapFile, 'utf-8').toString();
   fs.writeFileSync(gsapFile, fileData.replaceAll('@typhonjs-fvtt/svelte/', '@typhonjs-fvtt/runtime/svelte/'));
}

// Generate types for remote rollup plugin.
await generateDTS({
   input: './.rollup/remote/index.js',
   output: './.rollup/remote/index.d.ts',
});

// Special handling for colord NPM module ----------------------------------------------------------------------------

// Copy ESM distribution + TS declarations to `./_dist/color/colord/`
fs.emptyDirSync('./_dist/color/colord/');
let colordFiles = await getFileList({ dir: './node_modules/colord-typhonjs/dist' });
for (const colordFile of colordFiles)
{
   let destFile;

   if (colordFile.endsWith('.mjs'))
   {
      destFile = `./_dist/color/colord/${
       path.relative('./node_modules/colord-typhonjs/dist', colordFile.replace(/\.mjs$/, '.js'))}`;
   }
   else if (colordFile.endsWith('.d.ts'))
   {
      destFile = `./_dist/color/colord/${
       path.relative('./node_modules/colord-typhonjs/dist', colordFile)}`;
   }
   else
   {
      // Skip all other files.
      continue;
   }

   fs.copySync(colordFile, destFile);
}

// Copy ESM files from `./_dist/color/colord/` to remote distribution.
fs.emptyDirSync('./remote/color/colord/');
colordFiles = await getFileList({ dir: './_dist/color/colord' });
for (const colordFile of colordFiles)
{
   if (!colordFile.endsWith('.js')) { continue; }

   const destFile = `./remote/color/colord/${path.relative('./_dist/color/colord', colordFile)}`;

   fs.copySync(colordFile, destFile);
}

// -------------------------------------------------------------------------------------------------------------------

// We use rollup as per normal to generate the library bundles.
export default () =>
{
   return [
      ...s_MODULES_DOMPURIFY_LIB,
      ...s_MODULES_JSON5_LIB,
      ...s_MODULES_PLUGIN_LIB,
      ...createSvelteLibConfig({ sourcemap: s_SOURCEMAPS, outputPlugins }),
      ...s_MODULES_TINYMCE_LIB
   ];
}
