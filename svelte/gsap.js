import { gsap } from '/scripts/greensock/esm/all.js';
export { gsap } from '/scripts/greensock/esm/all.js';

/**
 * @param {HTMLElement} node -
 *
 * @param {object}      options -
 *
 * @param {string}      options.type -
 *
 * @returns {*} GSAP method.
 */
function animate(node, { type, ...args })
{
   const method = gsap[type];
   return method(node, args);
}

export { animate };
//# sourceMappingURL=gsap.js.map
