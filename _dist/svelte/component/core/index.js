export { default as TJSComponentShell }   from './TJSComponentShell.svelte';
export { default as TJSContainer }        from './TJSContainer.svelte';
export { default as TJSGlassPane }        from './TJSGlassPane.svelte';
export *                                  from './application/index.js';
export *                                  from './dialog/index.js';

/**
 * @typedef {object} TransformData
 *
 * @property {Function} transition - A transition applying to both in & out.
 *
 * @property {Function} inTransition - A transition applying to in.
 *
 * @property {Function} outTransition - A transition applying to out.
 *
 * @property {object}   transitionOptions - The options config object for in & out transitions.
 *
 * @property {object}   inTransitionOptions - The options config object for in transitions.
 *
 * @property {object}   outTransitionOptions - The options config object for out transitions.
 */
