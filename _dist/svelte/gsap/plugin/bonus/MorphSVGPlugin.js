import { gsap, gsapLoadPlugin } from '@typhonjs-fvtt/runtime/svelte/gsap';

const MorphSVGPlugin = await gsapLoadPlugin('MorphSVGPlugin');

gsap.registerPlugin(MorphSVGPlugin);

export { MorphSVGPlugin };
