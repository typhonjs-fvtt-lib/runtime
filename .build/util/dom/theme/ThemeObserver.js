import { CrossWindow }  from '@typhonjs-fvtt/runtime/util/browser';
import { isIterable }   from '@typhonjs-fvtt/runtime/util/object';

import { writable }     from 'svelte/store';

/**
 * Provides reactive observation of the Foundry core theme applied to `document.body`. There are several stores
 * available to receive updates when the theme changes.
 */
export class ThemeObserver
{
   /**
    * All readable theme stores.
    *
    * @type {Readonly<({
    *    theme: Readonly<import('svelte/store').Readable<string>>
    * })>}
    */
   static #stores;

   /**
    * Internal setter for theme stores.
    *
    * @type {{ theme: Function }}
    */
   static #storeSet;

   /**
    * Current theme.
    *
    * @type {string}
    */
   static #theme = '';

   /**
    * @hideconstructor
    */
   constructor()
   {
      throw new Error('ThemeObserver constructor: This is a static class and should not be constructed.');
   }

   /**
    * @returns {Readonly<{ theme: Readonly<import('svelte/store').Readable<string>> }>} Current core theme stores.
    */
   static get stores() { return this.#stores; }

   /**
    * @returns {string} Current theme CSS class.
    */
   static get theme()
   {
      return this.#theme;
   }

   /**
    * Verify that the given `theme` name or complete CSS class is the current theme.
    *
    * @param {string} theme - A theme name or complete CSS class name to verify.
    *
    * @returns {boolean} If the requested theme match the current theme.
    */
   static isTheme(theme)
   {
      return typeof theme === 'string' && (this.#theme === theme || this.#theme === `theme-${theme}`);
   }

   /**
    * Detect if theming classes are present in the given iterable list.
    *
    * @param {Iterable<string>}  classes - CSS class list to verify if theming classes are included.
    *
    * @param {object} [options] - Optional parameters.
    *
    * @param {boolean} [options.strict=false] - When true, all theming classes required if multiple are verified.
    *
    * @returns {boolean} True if theming classes present.
    */
   static hasThemedClasses(classes, { strict = false } = {})
   {
      if (!isIterable(classes)) { return false; }

      let strictFound = !strict;
      let themeFound = false;

      for (const entry of classes)
      {
         if (typeof entry !== 'string') { continue; }

         if (entry.startsWith('theme-')) { themeFound = true; }
         if (entry === 'themed') { strictFound = true; }
      }

      return themeFound && strictFound;
   }

   /**
    * Initialize `document.body` theme observation.
    *
    * @internal
    */
   static initialize()
   {
      if (this.#stores !== void 0) { return; }

      const themeStore = writable(this.#theme);

      this.#stores = Object.freeze({
         theme: Object.freeze({ subscribe: themeStore.subscribe }),
      });

      this.#storeSet = {
         theme: themeStore.set,
      };

      const observer = new MutationObserver(() =>
      {
         if (document.body.classList.contains('theme-light'))
         {
            this.#theme = 'theme-light';
         }
         else if (document.body.classList.contains('theme-dark'))
         {
            this.#theme = 'theme-dark';
         }

         this.#storeSet.theme(this.#theme);
      });

      // Only listen for class changes.
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
   }

   /**
    * Determine the nearest theme CSS classes from the given element.
    *
    * @param {object} options - Required options.
    *
    * @param {Element} options.element - A DOM element.
    *
    * @param {Set<string>} [options.output] - An optional source Set of existing CSS classes.
    *
    * @param {boolean} [options.override=true] - When true, override any existing theme classes
    *
    * @param {boolean} [options.strict=false] - When true, ensure all required theming classes in output.
    *
    * @returns {Iterable<string>} Any theming CSS classes found from the given element.
    */
   static nearestThemedClasses({ element, output = new Set(), override = true, strict = false })
   {
      if (!CrossWindow.isSet(output)) { throw new TypeError(`'output' is not a Set.`); }

      if (!CrossWindow.isElement(element)) { return output; }

      // When override is false and theme classes are already present in result return early.
      if (!override && ThemeObserver.hasThemedClasses(output))
      {
         if (strict) { output.add('themed'); }

         return output;
      }

      const nearestThemed = element.closest('.themed') ?? CrossWindow.getDocument(element).body;
      const match = nearestThemed.className.match(/(?:^|\s)(theme-\w+)/);
      if (match)
      {
         output.add('themed');
         output.add(match[1]);
      }

      return output;
   }
}
