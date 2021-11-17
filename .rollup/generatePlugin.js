import MagicString            from 'magic-string';

const s_MATCH_CURRENT_COMPONENT = /let current_component;/;
const s_MATCH_GET_CURRENT = /function get_current_component\(\)\s\{[\w\s()"';]*\}/;
const s_MATCH_SET_CURRENT = /function set_current_component\([\w]*\)\s\{[\w\s()="';]*\}/;
const s_MATCH_IMPORT_INTERNAL = /\s\}\sfrom\s'\/modules\/typhonjs\/svelte\/internal\.js';/

export function generatePlugin(options = {}, externalPaths)
{
   if (typeof options !== 'object') { throw new TypeError(`typhonjsRuntime - options is not an object.`); }

   const includeExternal = typeof options.includeExternal === 'boolean' ? options.includeExternal : true;
   const output = typeof options.output === 'boolean' ? options.output : false;

   if (output)
   {
      return {
         renderChunk(code, chunk, options)
         {
            const magicString = new MagicString(code);
            let match;
            let importAdd = '';

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

               importAdd += ', get_current_component';
            }

            if ((match = s_MATCH_SET_CURRENT.exec(code)))
            {
               const start = match.index;
               const end = start + match[0].length;
               magicString.overwrite(start, end, '');

               importAdd += ', set_current_component';
            }

            if (importAdd !== '' && (match = s_MATCH_IMPORT_INTERNAL.exec(code)))
            {
               const start = match.index;
               magicString.appendLeft(start, importAdd);
            }

            const map = magicString.generateMap({
               includeContent: true,
               hires: true
            });

            return { code: magicString.toString(), map };
         }
      }
   }

   return {
      name: 'typhonjs-fvtt-runtime-lib',
      options(opts)
      {
         const externalOpts = Object.keys(externalPaths);

         if (includeExternal)
         {
            opts.external = Array.isArray(opts.external) ? [...externalOpts, ...opts.external] : externalOpts;
         }

         if (Array.isArray(opts.output))
         {
            for (const outputOpts of opts.output)
            {
               outputOpts.paths = typeof outputOpts.paths === 'object' ? { ...outputOpts.paths, ...externalPaths } :
                externalPaths;
            }
         }
      }
   };
}

