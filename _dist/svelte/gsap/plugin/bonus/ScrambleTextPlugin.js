import { gsap, gsapLoadPlugin } from '@typhonjs-fvtt/runtime/svelte/gsap';

const ScrambleTextPlugin = await gsapLoadPlugin('ScrambleTextPlugin');

gsap.registerPlugin(ScrambleTextPlugin);

export { ScrambleTextPlugin };
