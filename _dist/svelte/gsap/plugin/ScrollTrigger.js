import { gsap, gsapLoadPlugin } from '@typhonjs-fvtt/runtime/svelte/gsap';

const ScrollTrigger = await gsapLoadPlugin('ScrollTrigger');

gsap.registerPlugin(ScrollTrigger);

export { ScrollTrigger };
