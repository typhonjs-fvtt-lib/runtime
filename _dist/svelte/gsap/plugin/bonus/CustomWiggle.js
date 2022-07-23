import { gsap, gsapLoadPlugin } from '@typhonjs-fvtt/runtime/svelte/gsap';

const CustomWiggle = await gsapLoadPlugin('CustomWiggle');

gsap.registerPlugin(CustomWiggle);

export { CustomWiggle };
