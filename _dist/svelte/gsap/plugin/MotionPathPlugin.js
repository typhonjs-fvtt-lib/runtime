import { gsap, gsapLoadPlugin } from '@typhonjs-fvtt/runtime/svelte/gsap';

const MotionPathPlugin = await gsapLoadPlugin('MotionPathPlugin');

gsap.registerPlugin(MotionPathPlugin);

export { MotionPathPlugin };
