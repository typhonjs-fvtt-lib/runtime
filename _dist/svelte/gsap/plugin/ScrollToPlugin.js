import { gsap, gsapLoadPlugin } from '@typhonjs-fvtt/runtime/svelte/gsap';

const ScrollToPlugin = await gsapLoadPlugin('ScrollToPlugin');

gsap.registerPlugin(ScrollToPlugin);

export { ScrollToPlugin };

