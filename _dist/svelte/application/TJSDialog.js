import { DialogShell }           from '@typhonjs-fvtt/runtime/svelte/component/core';
import { safeAccess, safeSet }   from '@typhonjs-utils/object';

import { SvelteApplication }     from './SvelteApplication.js';

/**
 * Provides a Foundry API compatible dialog alternative implemented w/ Svelte. There are several features including
 * a glasspane / modal option with various styling and transition capabilities.
 */
export class TJSDialog extends SvelteApplication
{
   /**
    * @type {object}
    */
   #data;

   /**
    * @param {object}   data - Dialog data.
    *
    * @param {object}   options -
    */
   constructor(data, options)
   {
      super(options);
      this.#data = data;
   }

   /**
    * Default options
    *
    * @returns {object} Default options
    */
   static get defaultOptions()
   {
      return foundry.utils.mergeObject(super.defaultOptions, {
         classes: ['dialog'],
         width: 400,
         svelte: {
            class: DialogShell,
            intro: true,
            target: document.body,
            props: function() { return { data: this.#data }; }
         }
      });
   }

   /**
    * Returns the content field in dialog data.
    *
    * @returns {*} content field.
    */
   get content() { return this.getDialogData('content'); }

   /**
    * Returns the dialog data.
    *
    * @returns {object} Dialog data.
    */
   get data() { return this.#data; }

   /**
    * Sets the dialog data content field; this is reactive.
    *
    * @param {*} content - Content to set.
    */
   set content(content) { this.setDialogData('content', content); }

   /**
    * Sets the dialog data; this is reactive.
    *
    * @param {object}   data - Dialog data.
    */
   set data(data)
   {
      this.#data = data;

      const component = this.svelte.applicationShell;
      if (component?.data) { component.data = data; }
   }

   /**
    * Implemented only for backwards compatibility w/ default Foundry {@link Dialog} API.
    *
    * @param {JQuery}   html - JQuery element for content area.
    */
   activateListeners(html)
   {
      super.activateListeners(html);

      if (this.data.render instanceof Function) { this.data.render(this.options.jQuery ? html : html[0]); }
   }

   /**
    * Close the dialog and un-register references to it within UI mappings.
    * This function returns a Promise which resolves once the window closing animation concludes.
    *
    * @param {object}   options - Optional parameters.
    *
    * @param {boolean}  options.force - Force close regardless of render state.
    *
    * @returns {Promise<void>} A Promise which resolves once the application is closed.
    */
   async close(options)
   {
      /**
       * Implemented only for backwards compatibility w/ default Foundry {@link Dialog} API.
       */
      if (this.data.close instanceof Function)
      {
         this.data.close(this.options.jQuery ? this.element : this.element[0]);
      }

      return super.close(options);
   }

   /**
    * Provides a way to safely get this dialogs data given an accessor string which describes the
    * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
    * to walk.
    *
    * // TODO DOCUMENT the accessor in more detail.
    *
    * @param {string}   accessor - The path / key to set. You can set multiple levels.
    *
    * @param {*}        [defaultValue] - A default value returned if the accessor is not found.
    *
    * @returns {*} Value at the accessor.
    */
   getDialogData(accessor, defaultValue)
   {
      return safeAccess(this.#data, accessor, defaultValue);
   }

   /**
    * @param {object} data - Merge provided data object into Dialog data.
    */
   mergeDialogData(data)
   {
      this.data = foundry.utils.mergeObject(this.#data, data, { inplace: false });
   }

   /**
    * Provides a way to safely set this dialogs data given an accessor string which describes the
    * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
    * to walk.
    *
    * Automatically the dialog data will be updated in the associated DialogShell Svelte component.
    *
    * // TODO DOCUMENT the accessor in more detail.
    *
    * @param {string}   accessor - The path / key to set. You can set multiple levels.
    *
    * @param {*}        value - Value to set.
    */
   setDialogData(accessor, value)
   {
      const success = safeSet(this.#data, accessor, value);

      // If `this.options` modified then update the app options store.
      if (success)
      {
         const component = this.svelte.component(0);
         if (component?.data) { component.data = this.#data; }
      }
   }

   // ---------------------------------------------------------------------------------------------------------------

   /**
    * A helper factory method to create simple confirmation dialog windows which consist of simple yes/no prompts.
    * If you require more flexibility, a custom Dialog instance is preferred.
    *
    * @param {TJSConfirmConfig} config - Confirm dialog options.
    *
    * @return {Promise<*>} A promise which resolves once the user makes a choice or closes the window.
    *
    * @example
    * let d = Dialog.confirm({
    *  title: "A Yes or No Question",
    *  content: "<p>Choose wisely.</p>",
    *  yes: () => console.log("You chose ... wisely"),
    *  no: () => console.log("You chose ... poorly"),
    *  defaultYes: false
    * });
    */
   static async confirm({ title, content, yes, no, render, defaultYes = true, rejectClose = false, options = {},
                           buttons = {}, draggable = true, modal = false, modalOptions = {}, popOut = true, resizable = false, transition = {},
                           zIndex } = {})
   {
      // Allow overwriting of default icon and labels.
      const mergedButtons = foundry.utils.mergeObject({
         yes: {
            icon: '<i class="fas fa-check"></i>',
            label: game.i18n.localize('Yes')
         },
         no: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize('No'),
         }
      }, buttons);

      return new Promise((resolve, reject) =>
      {
         const dialog = new this({
            title,
            content,
            render,
            draggable,
            modal,
            modalOptions,
            popOut,
            resizable,
            zIndex,
            transition,
            buttons: foundry.utils.mergeObject(mergedButtons, {
               yes: {
                  callback: (html) =>
                  {
                     const result = yes ? yes(html) : true;
                     resolve(result);
                  }
               },
               no: {
                  callback: (html) =>
                  {
                     const result = no ? no(html) : false;
                     resolve(result);
                  }
               }
            }),
            default: defaultYes ? "yes" : "no",
            close: () =>
            {
               if (rejectClose) { reject('The confirmation Dialog was closed without a choice being made.'); }
               else { resolve(null); }
            },
         }, options);
         dialog.render(true);
      });
   }

   /**
    * A helper factory method to display a basic "prompt" style Dialog with a single button
    *
    * @param {TJSPromptConfig} - Prompt dialog options.
    *
    * @return {Promise<*>} The returned value from the provided callback function, if any
    */
   static async prompt({ title, content, label, callback, render, rejectClose = false, options = {}, draggable = true,
                          icon = '<i class="fas fa-check"></i>', modal = false, modalOptions = {}, popOut = true, resizable = false,
                          transition = {}, zIndex } = {})
   {
      return new Promise((resolve, reject) =>
      {
         const dialog = new this({
            title,
            content,
            render,
            draggable,
            modal,
            modalOptions,
            popOut,
            resizable,
            transition,
            zIndex,
            buttons: {
               ok: {
                  icon,
                  label,
                  callback: (html) =>
                  {
                     const result = callback ? callback(html) : null;
                     resolve(result);
                  }
               },
            },
            default: 'ok',
            close: () =>
            {
               if (rejectClose)
               {
                  reject(new Error('The Dialog prompt was closed without being accepted.'));
               }
               else { resolve(null); }
            },
         }, options);
         dialog.render(true);
      });
   }
}

/**
 * @typedef TJSConfirmConfig - Configuration options for the confirm dialog.
 *
 * @property {string}   title - The confirmation window title
 *
 * @property {string}   content - The confirmation message
 *
 * @property {Function} [yes] - Callback function upon yes
 *
 * @property {Function} [no] - Callback function upon no
 *
 * @property {Function} [render] - A function to call when the dialog is rendered
 *
 * @property {boolean}  [defaultYes=true] - Make "yes" the default choice?
 *
 * @property {boolean}  [rejectClose=false] - Reject the Promise if the Dialog is closed without making a choice.
 *
 * @property {object}   [options={}] - Additional rendering options passed to the Dialog
 *
 * @property {object}   [buttons={}] - Provides a button override that is merged with default buttons.
 *
 * @property {boolean}  [draggable=true] - The dialog is draggable when true.
 *
 * @property {boolean}  [modal=false] - When true a modal dialog is displayed.
 *
 * @property {object}   [modalOptions] - Additional options for modal dialog display.
 *
 * @property {boolean}  [popOut=true] - When true the dialog is a pop out Application.
 *
 * @property {boolean}  [resizable=false] - When true the dialog is resizable.
 *
 * @property {object}   [transition] - Transition options for the dialog.
 *
 * @property {number|null} [zIndex] - A specific z-index for the dialog. *
 */

/**
 * @typedef TJSPromptConfig - Configuration options for the confirm dialog.
 *
 * @property {string}   title - The confirmation window title
 *
 * @property {string}   content - The confirmation message
 *
 * @property {string}   [label] - The confirmation button text.
 *
 * @property {Function} [callback] - A callback function to fire when the button is clicked.
 *
 * @property {Function} [render] - A function to call when the dialog is rendered.
 *
 * @property {boolean}  [rejectClose=false] - Reject the Promise if the Dialog is closed without making a choice.
 *
 * @property {object}   [options={}] - Additional rendering options passed to the Dialog
 *
 * @property {boolean}  [draggable=true] - The dialog is draggable when true.
 *
 * @property {string}   [icon='<i class="fas fa-check"></i>'] - Set another icon besides `fa-check` for button.
 *
 * @property {boolean}  [modal=false] - When true a modal dialog is displayed.
 *
 * @property {object}   [modalOptions] - Additional options for modal dialog display.
 *
 * @property {boolean}  [popOut=true] - When true the dialog is a pop out Application.
 *
 * @property {boolean}  [resizable=false] - When true the dialog is resizable.
 *
 * @property {object}   [transition] - Transition options for the dialog.
 *
 * @property {number|null} [zIndex] - A specific z-index for the dialog. *
 */
