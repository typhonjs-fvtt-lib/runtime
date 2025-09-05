import { localize }  from '@typhonjs-fvtt/runtime/util/i18n';

/**
 * Provides a popover tooltip action for Foundry that uses the `data-tooltip` attribute.
 *
 * @param {HTMLElement} node - Target element.
 *
 * @param {string}  tooltip - The tooltip to set.
 *
 * @returns {import('svelte/action').ActionReturn<string>} Lifecycle functions.
 */
export function popoverTooltip(node, tooltip)
{
   node.setAttribute('data-tooltip', typeof tooltip === 'string' ? localize(tooltip) : null);

   return {
      /**
       * @param {string}  newTooltip - Update tooltip.
       */
      update: (newTooltip) =>
      {
         tooltip = newTooltip;
         node.setAttribute('data-tooltip', typeof tooltip === 'string' ? localize(tooltip) : null);
      }
   };
}
