import { externalPathsLocal } from '../local/externalPathsLocal';

export const externalPathsRemote = {
   ...externalPathsLocal,

   '@typhonjs-fvtt/runtime/svelte': '/modules/typhonjs/svelte/index.js',
   '@typhonjs-fvtt/runtime/svelte/action': '/modules/typhonjs/svelte/action.js',
   '@typhonjs-fvtt/runtime/svelte/component/core': '/modules/typhonjs/svelte/component/core.js',
   '@typhonjs-fvtt/runtime/svelte/gsap': '/modules/typhonjs/svelte/gsap.js',
   '@typhonjs-fvtt/runtime/svelte/handler': '/modules/typhonjs/svelte/handler.js',
   '@typhonjs-fvtt/runtime/svelte/helper': '/modules/typhonjs/svelte/helper.js',
   '@typhonjs-fvtt/runtime/svelte/legacy': '/modules/typhonjs/svelte/legacy.js',
   '@typhonjs-fvtt/runtime/svelte/store': '/modules/typhonjs/svelte/store.js',
   '@typhonjs-fvtt/runtime/svelte/transition': '/modules/typhonjs/svelte/transition.js',
   '@typhonjs-fvtt/runtime/svelte/util': '/modules/typhonjs/svelte/util.js',

   '@typhonjs-fvtt/runtime/plugin/manager': '/modules/typhonjs/plugin/manager.js'
}