import postcss                   from 'rollup-plugin-postcss';
import postcssConfig             from '../../postcssConfig.js';
import resolve                   from '@rollup/plugin-node-resolve';
import sourcemaps                from 'rollup-plugin-sourcemaps';
import svelte                    from 'rollup-plugin-svelte';
import { typhonjsRuntime }       from './index.js';
import virtual                   from '@rollup/plugin-virtual';

import { exportsSveltePackage }  from './exportsSveltePackage.js';

// const exportsSvelteRemapped = Object.fromEntries(exportsSveltePackage.map(
//  (entry) => [`@typhonjs-fvtt/svelte${entry}`, `@typhonjs-fvtt/runtime/svelte${entry}`]));

// console.log(exportsSvelteRemapped);

export function createSvelteNPMConfig({ sourcemap, outputPlugins })
{
   const config = [];

   const postcssCore = postcssConfig({
      extract: 'core.css',
      compress: true,
      sourceMap: sourcemap
   });

   for (const entry of exportsSveltePackage)
   {
      // Special handling for component/core to compile Svelte components.
      if (entry === '/component/core')
      {
         config.push({
            input: {
               input: 'pack',
               plugins: [
                  virtual({
                     pack: `export * from '@typhonjs-fvtt/svelte/component/core';`
                  }),
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
                  typhonjsRuntime({ isLib: false, exclude: ['@typhonjs-fvtt/svelte/component/core'] }),
               ]
            },
            output: {
               output: {
                  file: './dist/svelte/component/core/index.js',
                  format: 'es',
                  plugins: outputPlugins,
                  preferConst: true,
                  sourcemap,
                  // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
               }
            }
         });
      }
      else
      {
         config.push({
            input: {
               input: 'pack',
               plugins: [
                  virtual({
                     pack: `export * from '@typhonjs-fvtt/svelte${entry}';`
                  }),
                  typhonjsRuntime({ isLib: false, exclude: [`@typhonjs-fvtt/svelte${entry}`] }),
                  resolve({ browser: true }),
                  sourcemaps()
               ]
            },
            output: {
               output: {
                  file: `./dist/svelte${entry}/index.js`,
                  format: 'es',
                  preferConst: true,
                  sourcemap,
                  // sourcemapPathTransform: (sourcePath) => sourcePath.replace(relativePath, `.`)
               }
            }
         });
      }
   }

   return config;
}