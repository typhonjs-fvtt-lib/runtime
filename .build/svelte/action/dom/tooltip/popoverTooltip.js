/**
 * Provides a popover tooltip action for Foundry that uses the `data-tooltip` attribute.
 *
 * @param {HTMLElement} node - Target element.
 *
 * @param {TooltipOptions} [options] - Options.
 *
 * @returns {import('svelte/action').ActionReturn<TooltipOptions>} Lifecycle functions.
 */
export function popoverTooltip(node, { tooltip, tooltipHTML, tooltipText, cssClass, direction, locked })
{
   function setAttributes()
   {
      if (typeof tooltip === 'string')
      {
         node.setAttribute('data-tooltip', tooltip);
      }
      else
      {
         node.removeAttribute('data-tooltip');
      }

      if (typeof tooltipHTML === 'string')
      {
         node.setAttribute('data-tooltip-html', tooltipHTML);
      }
      else
      {
         node.removeAttribute('data-tooltip-html');
      }

      if (typeof tooltipText === 'string')
      {
         node.setAttribute('data-tooltip-text', tooltipText);
      }
      else
      {
         node.removeAttribute('data-tooltip-text');
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
         node.setAttribute('data-tooltip-locked', '');
      }
      else
      {
         node.removeAttribute('data-tooltip-locked');
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
         tooltip = typeof options?.tooltip === 'string' ? options.tooltip : void 0;
         tooltipHTML = typeof options?.tooltipHTML === 'string' ? options.tooltipHTML : void 0;
         tooltipText = typeof options?.tooltipText === 'string' ? options.tooltipText : void 0;
         cssClass = typeof options?.cssClass === 'string' ? options.cssClass : void 0;
         direction = typeof options?.cssClass === 'string' ? options.direction : void 0;
         locked = typeof options?.locked === 'boolean' ? options.locked : void 0;

         setAttributes();
      }
   };
}

/**
 * @typedef {object} TooltipOptions
 *
 * @property {string}   [tooltip] Tooltip text value or language key (will receive i18n translation).
 *
 * @property {string}   [tooltipHTML] Tooltip value as HTML string.
 *
 * @property {string}   [tooltipText] Tooltip as text only value.
 *
 * @property {string}   [cssClass] An optional, space-separated list of CSS classes to apply to the activated tooltip.
 * If this is not provided, the CSS classes are acquired from the `data-tooltip-class` attribute of the element or one
 * of its parents.
 *
 * @property {string}   [direction] An explicit tooltip expansion direction. If this is not provided,
 * the direction is acquired from the `data-tooltip-direction` attribute of the element or one of its parents. Values
 * include: `UP`, `DOWN`, `LEFT`, `RIGHT`, `CENTER`
 *
 * @property {boolean}  [locked=false] An optional boolean to lock the tooltip after creation; default: `false`.
 */
