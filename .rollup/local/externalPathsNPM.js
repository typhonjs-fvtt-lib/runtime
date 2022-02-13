export const externalPathsNPM = {
   '@typhonjs-fvtt/svelte/action': '@typhonjs-fvtt/runtime/svelte/action',
   '@typhonjs-fvtt/svelte/application': '@typhonjs-fvtt/runtime/svelte/application',
   '@typhonjs-fvtt/svelte/application/dialog': '@typhonjs-fvtt/runtime/svelte/application/dialog',
   '@typhonjs-fvtt/svelte/application/legacy': '@typhonjs-fvtt/runtime/svelte/application/legacy',
   '@typhonjs-fvtt/svelte/component/core': '@typhonjs-fvtt/runtime/svelte/component/core',
   '@typhonjs-fvtt/svelte/component/dialog': '@typhonjs-fvtt/runtime/svelte/component/dialog',
   '@typhonjs-fvtt/svelte/gsap': '@typhonjs-fvtt/runtime/svelte/gsap',
   '@typhonjs-fvtt/svelte/handler': '@typhonjs-fvtt/runtime/svelte/handler',
   '@typhonjs-fvtt/svelte/helper': '@typhonjs-fvtt/runtime/svelte/helper',
   '@typhonjs-fvtt/svelte/plugin/data': '@typhonjs-fvtt/runtime/svelte/plugin/data',
   '@typhonjs-fvtt/svelte/plugin/system': '@typhonjs-fvtt/runtime/svelte/plugin/system',
   '@typhonjs-fvtt/svelte/store': '@typhonjs-fvtt/runtime/svelte/store',
   '@typhonjs-fvtt/svelte/transition': '@typhonjs-fvtt/runtime/svelte/transition',
   '@typhonjs-fvtt/svelte/util': '@typhonjs-fvtt/runtime/svelte/util',

   '@typhonjs-plugin/manager': '@typhonjs-fvtt/runtime/plugin/manager',

   'chroma-js': '@typhonjs-fvtt/runtime/color/chroma-js',

   'json5': '@typhonjs-fvtt/runtime/json/json5',

   // Exclude as external, but do not translate module references.
   'svelte': 'svelte',
   'svelte/animate': 'svelte/animate',
   'svelte/easing': 'svelte/easing',
   'svelte/internal': 'svelte/internal',
   'svelte/motion': 'svelte/motion',
   'svelte/store': 'svelte/store',
   'svelte/transition': 'svelte/transition'
};