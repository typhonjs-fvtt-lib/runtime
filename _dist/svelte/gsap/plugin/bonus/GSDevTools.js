import { gsap, gsapLoadPlugin } from '@typhonjs-fvtt/runtime/svelte/gsap';

const GSDevTools = await gsapLoadPlugin('GSDevTools');

gsap.registerPlugin(GSDevTools);

export { GSDevTools };
