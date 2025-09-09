import { localize }  from '@typhonjs-fvtt/runtime/util/i18n';

/**
 * Provides a popover tooltip action for Foundry that uses the `data-tooltip` attribute.
 *
 * @param {HTMLElement} node - Target element.
 *
 * @param {object}   [options] - Options.
 *
 * @param {string}   [options.tooltip] - Tooltip value or language key.
 *
 * @returns {import('svelte/action').ActionReturn<{ tooltip?: string }>} Lifecycle functions.
 */
export function popoverTooltip(node, { tooltip, ariaLabel = false })
{
   function setAttributes()
   {
      if (typeof tooltip === 'string')
      {
         const value = localize(tooltip);

         node.setAttribute('data-tooltip', value);

         if (ariaLabel)
         {
            node.setAttribute('aria-label', value);
         }
         else
         {
            node.removeAttribute('aria-label');
         }
      }
      else
      {
         node.removeAttribute('data-tooltip');
         node.removeAttribute('aria-label');
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
         ariaLabel = typeof options?.ariaLabel === 'boolean' ? options.ariaLabel : false;

         setAttributes();
      }
   };
}

/**
 * @typedef {object} TooltipOptions
 *
 * @property {string} [tooltip] Tooltip value or language key.
 *
 * @property {boolean} [ariaLabel=false] When true, the tooltip value is also set to the `aria-label` attribute.
 */
