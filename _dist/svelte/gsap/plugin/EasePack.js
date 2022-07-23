import { gsap, gsapLoadPlugin } from '@typhonjs-fvtt/runtime/svelte/gsap';

const EasePack = await gsapLoadPlugin('EasePack');

gsap.registerPlugin(EasePack);

export { EasePack };
