import { gsap, gsapLoadPlugin } from '@typhonjs-fvtt/runtime/svelte/gsap';

const CustomBounce = await gsapLoadPlugin('CustomBounce');

gsap.registerPlugin(CustomBounce);

export { CustomBounce };
