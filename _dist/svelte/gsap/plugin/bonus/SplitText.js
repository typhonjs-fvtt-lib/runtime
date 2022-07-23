import { gsap, gsapLoadPlugin } from '@typhonjs-fvtt/runtime/svelte/gsap';

const SplitText = await gsapLoadPlugin('SplitText');

gsap.registerPlugin(SplitText);

export { SplitText };
