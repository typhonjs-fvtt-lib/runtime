const s_EXTERNAL_PATHS = {
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

   '@typhonjs-plugin/manager': '/modules/typhonjs/plugin/manager.js',

   'svelte/easing': '/modules/typhonjs/svelte/easing.js',
   'svelte/internal': '/modules/typhonjs/svelte/internal.js',
   'svelte/transition': '/modules/typhonjs/svelte/transition.js',

   'foundry-gsap': '/scripts/greensock/esm/all.js'
};

export function typhonjsRuntime(options = {})
{
   if (typeof options !== 'object') { throw new TypeError(`typhonjsRuntime - options is not an object.`); }

   const includeExternal = typeof options.includeExternal === 'boolean' ? options.includeExternal : true;

   return {
      name: 'typhonjs-fvtt-runtime-lib',
      options(opts)
      {
         const externalOpts = Object.keys(s_EXTERNAL_PATHS);

         if (includeExternal)
         {
            opts.external = Array.isArray(opts.external) ? [...externalOpts, ...opts.external] : externalOpts;
         }

         if (Array.isArray(opts.output))
         {
            for (const outputOpts of opts.output)
            {
               outputOpts.paths = typeof outputOpts.paths === 'object' ? { ...outputOpts.paths, ...s_EXTERNAL_PATHS } :
                s_EXTERNAL_PATHS;
            }
         }
      }
      // resolveId(source)
      // {
      //    return source in resolveIds ? resolveIds[source] : null;
      // }
   };
}

export function getExternal(...exclude)
{
   return Object.keys(s_EXTERNAL_PATHS).filter((entry) => !exclude.includes(entry));
}