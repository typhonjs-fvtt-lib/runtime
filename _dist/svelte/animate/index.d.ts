import * as svelte_store from 'svelte/store';
import * as svelte_animate from 'svelte/animate';

/**
 * Svelte doesn't provide any events for the animate directive.
 *
 * The provided function below wraps a Svelte animate directive function generating bubbling events for start & end of
 * animation.
 *
 * These events are `animate:start` and `animate:end`.
 *
 * This is useful for instance if you are animating several nodes in a scrollable container where the overflow parameter
 * needs to be set to `none` while animating such that the scrollbar is not activated by the animation.
 *
 * Optionally you may also provide a boolean writable store that will be set to true when animation is active. In some
 * cases this leads to an easier implementation for gating on animation state.
 *
 * @example <caption>With events</caption>
 * const flipWithEvents = animateEvents(flip);
 * </script>
 *
 * <main on:animate:start={() => console.log('animate:start')
 *       on:animate:end={() => console.log('animate:end')}>
 *    {#each someData as entry (entry.id)}
 *       <section animate:flipWithEvents />
 *    {/each}

 * @example <caption>With optional store</caption>
 * const isAnimating = writable(false);
 * const flipWithEvents = animateEvents(flip, isAnimating);
 * </script>
 *
 * <main class:no-scroll={$isAnimating}>
 *    {#each someData as entry (entry.id)}
 *       <section animate:flipWithEvents />
 *    {/each}
 *
 * @param {(node: Element, { from: DOMRect, to: DOMRect }, params?: *) =>
 *  import('svelte/animate').AnimationConfig} fn - A Svelte animation function.
 *
 * @param {import('svelte/store').Writable<boolean>} [store] - An optional boolean writable store that is set to true
 *                                                             when animation is active.
 *
 * @returns {(node: Element, { from: DOMRect, to: DOMRect }, params?: *) =>
 *  import('svelte/animate').AnimationConfig} Wrapped animation function.
 */
declare function animateEvents(fn: (node: Element, { from: DOMRect, to: DOMRect }: {
    from: any;
    to: any;
}, params?: any) => svelte_animate.AnimationConfig, store?: svelte_store.Writable<boolean>): (node: Element, { from: DOMRect, to: DOMRect }: {
    from: any;
    to: any;
}, params?: any) => svelte_animate.AnimationConfig;
/**
 * Awaits `requestAnimationFrame` calls by the counter specified. This allows asynchronous applications for direct /
 * inline style modification amongst other direct animation techniques.
 *
 * @param {number}   [cntr=1] - A positive integer greater than 0 for amount of requestAnimationFrames to wait.
 *
 * @returns {Promise<number>} Returns current time equivalent to `performance.now()`.
 */
declare function nextAnimationFrame(cntr?: number): Promise<number>;

export { animateEvents, nextAnimationFrame };
