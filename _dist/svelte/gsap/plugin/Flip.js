import { gsap, gsapLoadPlugin } from '@typhonjs-fvtt/runtime/svelte/gsap';

const Flip = await gsapLoadPlugin('Flip');

gsap.registerPlugin(Flip);

export { Flip };
