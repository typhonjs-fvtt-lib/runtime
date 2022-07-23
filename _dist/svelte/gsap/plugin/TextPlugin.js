import { gsap, gsapLoadPlugin } from '@typhonjs-fvtt/runtime/svelte/gsap';

const TextPlugin = await gsapLoadPlugin('TextPlugin');

gsap.registerPlugin(TextPlugin);

export { TextPlugin };
