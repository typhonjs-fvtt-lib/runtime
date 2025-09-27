/**
 * Provides a popover tooltip action for Foundry that provides a similar set of options as the core `TooltipManager`.
 * A large benefit of this action is that on data changes the data attributes are updated and if the action Node is the
 * same as the current tooltip element the tooltip is activated again providing reactivity.
 *
 * @param {HTMLElement} node - Target element.
 *
 * @param {TooltipOptions} options - Tooltip Options.
 *
 * @returns {import('svelte/action').ActionReturn<TooltipOptions>} Lifecycle functions.
 */
export function popoverTooltip(node, { cssClass, direction, isHTML, locked, tooltip })
{
   function setAttributes()
   {
      if (typeof tooltip === 'string')
      {
         if (isHTML)
         {
            node.setAttribute('data-tooltip-html', tooltip);
            node.removeAttribute('data-tooltip');
         }
         else
         {
            node.setAttribute('data-tooltip', tooltip);
            node.removeAttribute('data-tooltip-html');
         }
      }
      else
      {
         node.removeAttribute('data-tooltip');
         node.removeAttribute('data-tooltip-html');
      }

      if (typeof cssClass === 'string')
      {
         node.setAttribute('data-tooltip-class', cssClass);
      }
      else
      {
         node.removeAttribute('data-tooltip-class');
      }

      if (typeof direction === 'string')
      {
         node.setAttribute('data-tooltip-direction', direction);
      }
      else
      {
         node.removeAttribute('data-tooltip-direction');
      }

      if (typeof locked === 'boolean' && locked)
      {
         node.setAttribute('data-locked', String(locked));
      }
      else
      {
         node.removeAttribute('data-locked');
      }

      // Immediately reactivate tooltip w/ data changes for reactivity if `node` is the same as current tooltip element.
      if (node === globalThis?.game?.tooltip?.element)
      {
         globalThis?.game?.tooltip?.activate(node);
      }
   }

   setAttributes();

   return {
      /**
       * @param {TooltipOptions}  options - Update tooltip.
       */
      update: (options) =>
      {
         cssClass = typeof options?.cssClass === 'string' ? options.cssClass : void 0;
         direction = typeof options?.direction === 'string' ? options.direction : void 0;
         isHTML = typeof options?.isHTML === 'boolean' ? options.isHTML : void 0;
         locked = typeof options?.locked === 'boolean' ? options.locked : void 0;
         tooltip = typeof options?.tooltip === 'string' ? options.tooltip : void 0;

         setAttributes();
      }
   };
}

/**
 * @typedef {object} TooltipOptions Options for the {@link popoverTooltip} action.
 *
 * @property {string}   [cssClass] An optional, space-separated list of CSS classes to apply to the activated tooltip.
 * If this is not provided, the CSS classes are acquired from the `data-tooltip-class` attribute of the element or one
 * of its parents.
 *
 * @property {string}   [direction] An explicit tooltip expansion direction. If this is not provided,
 * the direction is acquired from the `data-tooltip-direction` attribute of the element or one of its parents. Values
 * include: `UP`, `DOWN`, `LEFT`, `RIGHT`, `CENTER`
 *
 * @property {boolean}  [isHTML=false] When true, `tooltip` is treated as a HTML string; default: `false`.
 *
 * @property {boolean}  [locked=false] An optional boolean to lock the tooltip after creation; default: `false`.
 *
 * @property {string}   [tooltip] Tooltip text value or language key (will receive i18n translation) otherwise treated
 * as an HTML string when `isHTML` is true.
 */
