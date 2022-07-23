import { gsap, gsapLoadPlugin } from '@typhonjs-fvtt/runtime/svelte/gsap';

const EaselPlugin = await gsapLoadPlugin('EaselPlugin');

gsap.registerPlugin(EaselPlugin);

export { EaselPlugin };
