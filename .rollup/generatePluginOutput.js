import MagicString   from 'magic-string';

const s_MATCH_CURRENT_COMPONENT = /let current_component;/;
// const s_MATCH_GET_CURRENT = /function get_current_component\(\)\s\{[\w\s()"';]*\}/;
const s_MATCH_GET_CURRENT = /function get_current_component\(\)\s\{[\w\s!()"';]*\}/;
const s_MATCH_SET_CURRENT = /function set_current_component\([\w]*\)\s\{[\w\s()="';]*\}/;
const s_MATCH_IMPORT_INTERNAL = /\s\}\sfrom\s'\/modules\/typhonjs\/svelte\/internal\.js';/

export function generatePluginOutput()
{
   return {
      name: 'typhonjs-fvtt-runtime-lib-output',

      renderChunk(code)
      {
         const magicString = new MagicString(code);
         let match;
         // let importAdd = '';

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

            // importAdd += ', get_current_component';
         }

         if ((match = s_MATCH_SET_CURRENT.exec(code)))
         {
            const start = match.index;
            const end = start + match[0].length;
            magicString.overwrite(start, end, '');

            // importAdd += ', set_current_component';
         }

         magicString.prepend(
          `import { get_current_component, set_current_component } from '/modules/typhonjs/svelte/internal.js';\n`)

         // if (importAdd !== '' && (match = s_MATCH_IMPORT_INTERNAL.exec(code)))
         // {
         //    const start = match.index;
         //    magicString.appendLeft(start, importAdd);
         // }

         const map = magicString.generateMap({
            includeContent: true,
            hires: true
         });

         return { code: magicString.toString(), map };
      }
   }
}