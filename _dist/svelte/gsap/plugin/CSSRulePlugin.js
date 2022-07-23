import { gsap, gsapLoadPlugin } from '@typhonjs-fvtt/runtime/svelte/gsap';

const CSSRulePlugin = await gsapLoadPlugin('CSSRulePlugin');

gsap.registerPlugin(CSSRulePlugin);

export { CSSRulePlugin };
