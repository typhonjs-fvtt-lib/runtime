import { gsap, gsapLoadPlugin } from '@typhonjs-fvtt/runtime/svelte/gsap';

const PhysicsPropsPlugin = await gsapLoadPlugin('PhysicsPropsPlugin');

gsap.registerPlugin(PhysicsPropsPlugin);

export { PhysicsPropsPlugin };
