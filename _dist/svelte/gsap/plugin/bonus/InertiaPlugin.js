import { gsap, gsapLoadPlugin } from '@typhonjs-fvtt/runtime/svelte/gsap';

const InertiaPlugin = await gsapLoadPlugin('InertiaPlugin');

gsap.registerPlugin(InertiaPlugin);

export { InertiaPlugin };
