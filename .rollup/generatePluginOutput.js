import MagicString   from 'magic-string';

const s_MATCH_CURRENT_COMPONENT = /let current_component;/;
const s_MATCH_GET_CURRENT = /function get_current_component\(\)\s\{[\w\s!()"';]*\}/;
const s_MATCH_SET_CURRENT = /function set_current_component\([\w]*\)\s\{[\w\s()="';]*\}/;

/**
 * Transforms `svelte` bundle output prepending an import of `get_current_component` and `set_current_component` from
 * `svelte/internal`. The implementations of these functions are removed from this bundle. This creates a shared runtime
 * for all Svelte applications / components linking against the module library.
 *
 * @returns {{code: string, map: SourceMap}}
 */
export function generatePluginOutput(isLib)
{
   return {
      name: 'typhonjs-fvtt-runtime-lib-output',

      renderChunk(code)
      {
         const magicString = new MagicString(code);
         let match;

         if ((match = s_MATCH_CURRENT_COMPONENT.exec(code)))
         {
            const start = match.index;
            const end = start + match[0].length;
            magicString.overwrite(start, end, '');
         }

         if ((match = s_MATCH_GET_CURRENT.exec(code)))
         {
            const start = match.index;
            const end = start + match[0].length;
            magicString.overwrite(start, end, '');
         }

         if ((match = s_MATCH_SET_CURRENT.exec(code)))
         {
            const start = match.index;
            const end = start + match[0].length;
            magicString.overwrite(start, end, '');
         }

         magicString.prepend(
          `import { current_component, get_current_component, set_current_component } from ${isLib ? 
           `'/modules/typhonjs/remote/svelte/internal.js'` : `'svelte/internal'`};\n`);

         const map = magicString.generateMap({
            includeContent: true,
            hires: true
         });

         return { code: magicString.toString(), map };
      }
   }
}