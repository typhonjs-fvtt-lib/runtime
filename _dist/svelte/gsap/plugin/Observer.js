import { gsap, gsapLoadPlugin } from '@typhonjs-fvtt/runtime/svelte/gsap';

const Observer = await gsapLoadPlugin('Observer');

gsap.registerPlugin(Observer);

export { Observer };
