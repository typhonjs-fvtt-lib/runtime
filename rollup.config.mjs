import path                from 'node:path';

import resolve             from '@rollup/plugin-node-resolve';
import { generateDTS }     from '@typhonjs-build-test/esm-d-ts';
import { getFileList }     from '@typhonjs-utils/file-util';
import fs                  from 'fs-extra';
import { rollup }          from 'rollup';
import upath               from 'upath';

import {
   createRuntimeLibConfig,
   createRuntimeNPMConfig,
   createSvelteLibConfig,
   createSvelteNPMConfig } from './.rollup/local/index.js';

// Defines whether source maps are generated / loaded from the .env file.
const sourcemap = true;

// Bundle all top level external package exports.
const dtsPluginOptions = { bundlePackageExports: true };

const s_MODULES_DOMPURIFY_LIB = [
   {
      input: '.build/dompurify/index.js',
      plugins: [
         resolve({ browser: true })
      ],
      output: {
         file: 'remote/security/client/dompurify.js',
         format: 'es',
         generatedCode: { constBindings: true },
         sourcemap
      }
   }
];

const s_MODULES_DOMPURIFY_NPM = [
   {
      input: {
         input: '.build/dompurify/index.js',
         plugins: [
            resolve({ browser: true })
         ]
      },
      output: {
         file: '_dist/security/client/dompurify/index.js',
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
   ...createRuntimeNPMConfig({ sourcemap }),
   ...createSvelteNPMConfig({ sourcemap }),
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

      // For @typhonjs-svelte/runtime-base
      fileData = fileData.replaceAll('@typhonjs-svelte/runtime-base/', '@typhonjs-fvtt/runtime/');

      // For @typhonjs-fvtt/svelte
      fileData = fileData.replaceAll('_typhonjs_fvtt_svelte_', '_typhonjs_fvtt_runtime_svelte_');
      fileData = fileData.replaceAll('@typhonjs-fvtt/svelte/', '@typhonjs-fvtt/runtime/svelte/');

      fileData = fileData.replaceAll('#svelte-fvtt/', '@typhonjs-fvtt/runtime/svelte/');
      fileData = fileData.replaceAll('#runtime/', '@typhonjs-fvtt/runtime/');

      fs.writeFileSync(outFileDTS, fileData, 'utf-8');
   }
   else
   {
      console.log(`Generating TS Declaration: ${config.input.input}`);

      await generateDTS({
         input: dtsFile,
         output: upath.changeExt(outFile, '.d.ts'),
         ...dtsPluginOptions
      });
   }
}

// @typhonjs-fvtt/svelte/application & application/legacy ------------------------------------------------------------

// Handle @typhonjs-fvtt/svelte/application & application/legacy by copying the source and converting all import
// package references from `@typhonjs-fvtt/svelte` to `@typhonjs-fvtt/runtime/svelte`.
fs.emptyDirSync('./_dist/svelte/application');
fs.copySync('./node_modules/@typhonjs-fvtt/svelte/_dist/application', './_dist/svelte/application');
const appFiles = await getFileList({ dir: './_dist/svelte/application', resolve: true, walk: true });
for (const appFile of appFiles)
{
   let fileData = fs.readFileSync(appFile, 'utf-8').toString();
   fileData = fileData.replaceAll('@typhonjs-fvtt/svelte/', '@typhonjs-fvtt/runtime/svelte/');
   fileData = fileData.replaceAll('@typhonjs-svelte/lib/', '@typhonjs-fvtt/runtime/svelte/');

   fileData = fileData.replaceAll('@typhonjs-svelte/runtime-base/', '@typhonjs-fvtt/runtime/');

   fileData = fileData.replaceAll('#svelte-fvtt/', '@typhonjs-fvtt/runtime/svelte/');
   fileData = fileData.replaceAll('#runtime/', '@typhonjs-fvtt/runtime/');

   // For types
   fileData = fileData.replaceAll('_typhonjs_fvtt_svelte_', '_typhonjs_fvtt_runtime_svelte_');

   fs.writeFileSync(appFile, fileData);
}

// @typhonjs-fvtt/svelte/component/core & component/dialog -----------------------------------------------------------

// Handle @typhonjs-fvtt/svelte/component/core & component/dialog by copying the source and converting all import
// package references from `@typhonjs-fvtt/svelte` to `@typhonjs-fvtt/runtime/svelte`.
fs.emptyDirSync('./_dist/svelte/component');
fs.copySync('./node_modules/@typhonjs-fvtt/svelte/_dist/component', './_dist/svelte/component');
const compFiles = await getFileList({ dir: './_dist/svelte/component', resolve: true, walk: true });
for (const compFile of compFiles)
{
   let fileData = fs.readFileSync(compFile, 'utf-8').toString();

   fileData = fileData.replaceAll('#svelte-fvtt/', '@typhonjs-fvtt/runtime/svelte/');
   fileData = fileData.replaceAll('#runtime/', '@typhonjs-fvtt/runtime/');

   fileData = fileData.replaceAll('@typhonjs-svelte/runtime-base/', '@typhonjs-fvtt/runtime/');

   fs.writeFileSync(compFile, fileData.replaceAll('@typhonjs-fvtt/svelte/', '@typhonjs-fvtt/runtime/svelte/'));
}

// Gsap Plugins ------------------------------------------------------------------------------------------------------

// Handle @typhonjs-fvtt/svelte/gsap-plugins by copying the source and converting all import
// package references from `@typhonjs-fvtt/svelte` to `@typhonjs-fvtt/runtime/svelte`.
fs.emptyDirSync('./_dist/svelte/gsap/plugin');
fs.copySync('./node_modules/@typhonjs-fvtt/svelte/_dist/gsap/plugin', './_dist/svelte/gsap/plugin');
let gsapFiles = await getFileList({ dir: './_dist/svelte/gsap/plugin', resolve: true, walk: true });
for (const gsapFile of gsapFiles)
{
   let fileData = fs.readFileSync(gsapFile, 'utf-8').toString();

   fileData = fileData.replaceAll('#svelte-fvtt/', '@typhonjs-fvtt/runtime/svelte/');
   fileData = fileData.replaceAll('#runtime/', '@typhonjs-fvtt/runtime/');

   fileData = fileData.replaceAll('@typhonjs-svelte/runtime-base/', '@typhonjs-fvtt/runtime/');

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
let colordFiles = await getFileList({ dir: './node_modules/colord-typhonjs/dist', resolve: true, walk: true });
for (const colordFile of colordFiles)
{
   let destFile;

   if (colordFile.endsWith('.js') || colordFile.endsWith('.d.ts'))
   {
      destFile = `./_dist/color/colord/${path.relative('./node_modules/colord-typhonjs/dist', colordFile)}`;
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
colordFiles = await getFileList({ dir: './_dist/color/colord', resolve: true, walk: true });
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
      ...createRuntimeLibConfig({ sourcemap }),
      ...createSvelteLibConfig({ sourcemap }),
      ...s_MODULES_TINYMCE_LIB
   ];
}
