import { gsap, gsapLoadPlugin } from '@typhonjs-fvtt/runtime/svelte/gsap';

const ScrollSmoother = await gsapLoadPlugin('ScrollSmoother');

gsap.registerPlugin(ScrollSmoother);

export { ScrollSmoother };
