import { CrossRealm }   from '@typhonjs-fvtt/runtime/util';
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
    *    themeName: Readonly<import('svelte/store').Readable<string>>
    *    themeToken: Readonly<import('svelte/store').Readable<string>>
    * })>}
    */
   static #stores;

   /**
    * Internal setter for theme stores.
    *
    * @type {{ themeName: Function, themeToken: Function }}
    */
   static #storeSet;

   /**
    * Current theme name.
    *
    * @type {string}
    */
   static #themeName = '';

   /**
    * Current theme token.
    *
    * @type {string}
    */
   static #themeToken = '';

   /**
    * @hideconstructor
    */
   constructor()
   {
      throw new Error('ThemeObserver constructor: This is a static class and should not be constructed.');
   }

   /**
    * @returns {Readonly<({
    *    themeName: Readonly<import('svelte/store').Readable<string>>
    *    themeToken: Readonly<import('svelte/store').Readable<string>>
    * })>} Current platform theme stores.
    */
   static get stores() { return this.#stores; }

   /**
    * @returns {string} Current theme name; may be different from the theme token.
    */
   static get themeName()
   {
      return this.#themeName;
   }

   /**
    * @returns {string} Current theme token - CSS class.
    */
   static get themeToken()
   {
      return this.#themeToken;
   }

   /**
    * Verify that the given `theme` name or token (CSS class) is the current platform theme.
    *
    * @param {string} theme - A theme name or token to verify.
    *
    * @returns {boolean} If the requested theme matches the current platform theme.
    */
   static isTheme(theme)
   {
      return typeof theme === 'string' && (this.#themeName === theme || this.#themeToken === theme);
   }

   /**
    * Detect if theming tokens (CSS classes) are present in the given iterable list.
    *
    * @param {Iterable<string>}  tokens - a token list to verify if any theming tokens are included.
    *
    * @param {object} [options] - Optional parameters.
    *
    * @param {boolean} [options.strict=false] - When true, all theming tokens required if multiple are verified.
    *
    * @returns {boolean} True if theming tokens present.
    */
   static hasThemedTokens(tokens, { strict = false } = {})
   {
      if (!isIterable(tokens)) { return false; }

      let strictFound = !strict;
      let themeFound = false;

      for (const entry of tokens)
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

      const themeName = writable(this.#themeName);
      const themeToken = writable(this.#themeToken);

      this.#stores = Object.freeze({
         themeName: Object.freeze({ subscribe: themeName.subscribe }),
         themeToken: Object.freeze({ subscribe: themeToken.subscribe }),
      });

      this.#storeSet = {
         themeName: themeName.set,
         themeToken: themeToken.set,
      };

      // TODO More dynamic detection
      const observer = new MutationObserver(() =>
      {
         if (document.body.classList.contains('theme-light'))
         {
            this.#themeName = 'light';
            this.#themeToken = 'theme-light';
         }
         else if (document.body.classList.contains('theme-dark'))
         {
            this.#themeName = 'dark';
            this.#themeToken = 'theme-dark';
         }

         this.#storeSet.themeName(this.#themeName);
         this.#storeSet.themeToken(this.#themeToken);
      });

      // Only listen for class changes.
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
   }

   /**
    * Determine the nearest theme tokens (CSS classes) from the given element.
    *
    * @param {object} options - Required options.
    *
    * @param {Element | EventTarget} options.element - A DOM element.
    *
    * @param {Set<string>} [options.output] - An optional source Set of existing tokens.
    *
    * @param {boolean} [options.override=true] - When true, override any existing theme tokens.
    *
    * @param {boolean} [options.strict=false] - When true, ensure all required theming tokens in output.
    *
    * @returns {Iterable<string>} Any theming tokens found from the given element.
    */
   static nearestThemedTokens({ element, output = new Set(), override = true, strict = false })
   {
      if (!CrossRealm.isSet(output)) { throw new TypeError(`'output' is not a Set.`); }

      if (!CrossRealm.isElement(element)) { return output; }

      // When override is false and theme classes are already present in result return early.
      if (!override && ThemeObserver.hasThemedTokens(output))
      {
         if (strict) { output.add('themed'); }

         return output;
      }

      const nearestThemed = element.closest('.themed') ?? CrossRealm.getDocument(element).body;
      const match = nearestThemed.className.match(/(?:^|\s)(theme-\w+)/);
      if (match)
      {
         output.add('themed');
         output.add(match[1]);
      }

      return output;
   }
}
