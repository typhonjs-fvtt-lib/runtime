// import { Position }           from '@typhonjs-fvtt/runtime/svelte/store';
import { Position }           from './position/Position.js';

import {
   deepMerge,
   hasGetter,
   isApplicationShell,
   isHMRProxy,
   outroAndDestroy }          from '@typhonjs-fvtt/runtime/svelte/util';

import {
   ApplicationState,
   GetSvelteData,
   loadSvelteConfig,
   SvelteReactive }           from './internal/index.js';

/**
 * Provides a Svelte aware extension to Application to control the app lifecycle appropriately. You can declaratively
 * load one or more components from `defaultOptions`.
 */
export class SvelteApplication extends Application
{
   /**
    * Stores the first mounted component which follows the application shell contract.
    *
    * @type {MountedAppShell[]|null[]} Application shell.
    */
   #applicationShellHolder = [null];

   /**
    * Stores and manages application state for saving / restoring / serializing.
    *
    * @type {ApplicationState}
    */
   #applicationState;

   /**
    * Stores the target element which may not necessarily be the main element.
    *
    * @type {HTMLElement}
    */
   #elementTarget = null;

   /**
    * Stores the content element which is set for application shells.
    *
    * @type {HTMLElement}
    */
   #elementContent = null;

   /**
    * Stores initial z-index from `_renderOuter` to set to target element / Svelte component.
    *
    * @type {number}
    */
   #initialZIndex = 95;

   /**
    * Stores on mount state which is checked in _render to trigger onSvelteMount callback.
    *
    * @type {boolean}
    */
   #onMount = false;

   /**
    * The position store.
    *
    * @type {Position}
    */
   #position;

   /**
    * Contains the Svelte stores and reactive accessors.
    *
    * @type {SvelteReactive}
    */
   #reactive;

   /**
    * Stores SvelteData entries with instantiated Svelte components.
    *
    * @type {SvelteData[]}
    */
   #svelteData = [];

   /**
    * Provides a helper class that combines multiple methods for interacting with the mounted components tracked in
    * {@link SvelteData}.
    *
    * @type {GetSvelteData}
    */
   #getSvelteData = new GetSvelteData(this.#applicationShellHolder, this.#svelteData);

   /**
    * Contains methods to interact with the Svelte stores.
    *
    * @type {SvelteStores}
    */
   #stores;

   /**
    * @inheritDoc
    */
   constructor(options = {})
   {
      super(options);

      this.#applicationState = new ApplicationState(this);

      // Initialize Position with the position object set by Application.
      this.#position = new Position(this, {
         ...this.position,
         ...this.options,
         initial: this.options.positionInitial,
         ortho: this.options.positionOrtho,
         validator: this.options.positionValidator
      });

      // Remove old position field.
      delete this.position;

      /**
       * Define accessors to retrieve Position by `this.position`.
       *
       * @member {Position} position - Adds accessors to SvelteApplication to get / set the position data.
       *
       * @memberof SvelteApplication#
       */
      Object.defineProperty(this, 'position', {
         get: () => this.#position,
         set: (position) => { if (typeof position === 'object') { this.#position.set(position); } }
      });

      this.#reactive = new SvelteReactive(this);

      this.#stores = this.#reactive.initialize();
   }

   /**
    * Specifies the default options that SvelteApplication supports.
    *
    * @returns {object} options - Application options.
    * @see https://foundryvtt.com/api/Application.html#options
    */
   static get defaultOptions()
   {
      return deepMerge(super.defaultOptions, {
         defaultCloseAnimation: true,     // If false the default slide close animation is not run.
         draggable: true,                 // If true then application shells are draggable.
         headerButtonNoClose: false,      // If true then the close header button is removed.
         headerButtonNoLabel: false,      // If true then header button labels are removed for application shells.
         headerNoTitleMinimized: false,   // If true then header title is hidden when application is minimized.
         minHeight: MIN_WINDOW_HEIGHT,    // Assigned to position. Number specifying minimum window height.
         minWidth: MIN_WINDOW_WIDTH,      // Assigned to position. Number specifying minimum window width.
         positionable: true,              // If false then `position.set` does not take effect.
         positionInitial: Position.Initial.browserCentered,      // A helper for initial position placement.
         positionOrtho: true,             // When true Position is optimized for orthographic use.
         positionValidator: Position.Validators.transformWindow, // A function providing the default validator.
         transformOrigin: 'top left'      // By default, 'top / left' respects rotation when minimizing.
      });
   }

   /**
    * Returns the content element if an application shell is mounted.
    *
    * @returns {HTMLElement} Content element.
    */
   get elementContent() { return this.#elementContent; }

   /**
    * Returns the target element or main element if no target defined.
    *
    * @returns {HTMLElement} Target element.
    */
   get elementTarget() { return this.#elementTarget; }

   /**
    * Returns the reactive accessors & Svelte stores for SvelteApplication.
    *
    * @returns {SvelteReactive} The reactive accessors & Svelte stores.
    */
   get reactive() { return this.#reactive; }

   /**
    * Returns the application state manager.
    *
    * @returns {ApplicationState} The application state manager.
    */
   get state() { return this.#applicationState; }

   /**
    * Returns the Svelte helper class w/ various methods to access mounted Svelte components.
    *
    * @returns {GetSvelteData} GetSvelteData
    */
   get svelte() { return this.#getSvelteData; }

   /**
    * In this case of when a template is defined in app options `html` references the inner HTML / template. However,
    * to activate classic v1 tabs for a Svelte component the element target is passed as an array simulating JQuery as
    * the element is retrieved immediately and the core listeners use standard DOM queries.
    *
    * @inheritDoc
    * @protected
    * @ignore
    */
   _activateCoreListeners(html)
   {
      super._activateCoreListeners(typeof this.options.template === 'string' ? html : [this.#elementTarget]);
   }

   /**
    * Provide an override to set this application as the active window regardless of z-index. Changes behaviour from
    * Foundry core. This is important / used for instance in dialog key handling for left / right button selection.
    *
    * @param {object} [opts] - Optional parameters.
    *
    * @param {boolean} [opts.force=false] - Force bring to top; will increment z-index by popOut order.
    *
    */
   bringToTop({ force = false } = {})
   {
      if (force || this.popOut) { super.bringToTop(); }

      // If the activeElement is not `document.body` and not contained in this app via elementTarget then blur the
      // current active element and make `document.body`focused. This allows <esc> key to close all open apps / windows.
      if (document.activeElement !== document.body && !this.elementTarget.contains(document.activeElement))
      {
         // Blur current active element.
         if (document.activeElement instanceof HTMLElement) { document.activeElement.blur(); }

         // Make document body focused.
         document.body.focus();
      }

      ui.activeWindow = this;
   }

   /**
    * Note: This method is fully overridden and duplicated as Svelte components need to be destroyed manually and the
    * best visual result is to destroy them after the default slide up animation occurs, but before the element
    * is removed from the DOM.
    *
    * If you destroy the Svelte components before the slide up animation the Svelte elements are removed immediately
    * from the DOM. The purpose of overriding ensures the slide up animation is always completed before
    * the Svelte components are destroyed and then the element is removed from the DOM.
    *
    * Close the application and un-register references to it within UI mappings.
    * This function returns a Promise which resolves once the window closing animation concludes
    *
    * @param {object}   [options] - Optional parameters.
    *
    * @param {boolean}  [options.force] - Force close regardless of render state.
    *
    * @returns {Promise<void>}    A Promise which resolves once the application is closed.
    * @ignore
    */
   async close(options = {})
   {
      const states = Application.RENDER_STATES;
      if (!options.force && ![states.RENDERED, states.ERROR].includes(this._state)) { return; }

      // Unsubscribe from any local stores.
      this.#stores.unsubscribe();

      /**
       * @ignore
       */
      this._state = states.CLOSING;

      /**
       * Get the element.
       *
       * @type {HTMLElement}
       */
      const el = this.#elementTarget;
      if (!el) { return this._state = states.CLOSED; }

      // Make any window content overflow hidden to avoid any scrollbars appearing in default or Svelte outro
      // transitions.
      const content = el.querySelector('.window-content');
      if (content)
      {
         content.style.overflow = 'hidden';

         // Set all children of content to overflow hidden as if there is going to be additional scrolling elements
         // they are likely one level deep.
         for (let cntr = content.children.length; --cntr >= 0;)
         {
            content.children[cntr].style.overflow = 'hidden';
         }
      }

      // Dispatch Hooks for closing the base and subclass applications
      for (const cls of this.constructor._getInheritanceChain())
      {
         /**
          * A hook event that fires whenever this Application is closed.
          *
          * @param {Application} app                     The Application instance being closed
          *
          * @param {jQuery[]} html                       The application HTML when it is closed
          *
          * @function closeApplication
          *
          * @memberof hookEvents
          */
         Hooks.call(`close${cls.name}`, this, el);
      }

      // If options `defaultCloseAnimation` is false then do not execute the standard slide up animation.
      // This allows Svelte components to provide any out transition. Application shells will automatically set
      // `defaultCloseAnimation` based on any out transition set or unset.
      const animate = typeof this.options.defaultCloseAnimation === 'boolean' ? this.options.defaultCloseAnimation :
       true;

      if (animate)
      {
         // Set min height for full slide.
         el.style.minHeight = '0';

         const { paddingBottom, paddingTop } = globalThis.getComputedStyle(el);

         // Slide-up application.
         await el.animate([
            { maxHeight: `${el.clientHeight}px`, paddingTop, paddingBottom },
            { maxHeight: 0, paddingTop: 0, paddingBottom: 0 }
         ], { duration: 250, easing: 'ease-in', fill: 'forwards' }).finished;
      }

      // Stores the Promises returned from running outro transitions and destroying each Svelte component.
      const svelteDestroyPromises = [];

      // Manually invoke the destroy callbacks for all Svelte components.
      for (const entry of this.#svelteData)
      {
         // Use `outroAndDestroy` to run outro transitions before destroying.
         svelteDestroyPromises.push(outroAndDestroy(entry.component));

         // If any proxy eventbus has been added then remove all event registrations from the component.
         const eventbus = entry.config.eventbus;
         if (typeof eventbus === 'object' && typeof eventbus.off === 'function')
         {
            eventbus.off();
            entry.config.eventbus = void 0;
         }
      }

      // Await all Svelte components to destroy.
      await Promise.all(svelteDestroyPromises);

      // Reset SvelteData like this to maintain reference to GetSvelteData / `this.svelte`.
      this.#svelteData.length = 0;

      // Remove element from the DOM. Most SvelteComponents have already removed it.
      el.remove();

      // Silently restore any width / height state before minimized as applicable.
      this.position.state.restore({
         name: '#beforeMinimized',
         properties: ['width', 'height'],
         silent: true,
         remove: true
      });

      // Clean up data
      this.#applicationShellHolder[0] = null;
      /**
       * @ignore
       */
      this._element = null;
      this.#elementContent = null;
      this.#elementTarget = null;
      delete ui.windows[this.appId];
      /**
       * @ignore
       */
      this._minimized = false;
      /**
       * @ignore
       */
      this._scrollPositions = null;
      this._state = states.CLOSED;

      this.#onMount = false;

      // Update the minimized UI store options.
      this.#stores.uiOptionsUpdate((storeOptions) => deepMerge(storeOptions, { minimized: this._minimized }));
   }

   /**
    * Inject the Svelte components defined in `this.options.svelte`. The Svelte component can attach to the existing
    * pop-out of Application or provide no template and render into a document fragment which is then attached to the
    * DOM.
    *
    * @param {JQuery} html -
    *
    * @inheritDoc
    * @ignore
    */
   _injectHTML(html)
   {
      if (this.popOut && html.length === 0 && Array.isArray(this.options.svelte))
      {
         throw new Error(
          'SvelteApplication - _injectHTML - A popout app with no template can only support one Svelte component.');
      }

      // Make sure the store is updated with the latest header buttons. Also allows filtering buttons before display.
      this.reactive.updateHeaderButtons();

      // Create a function to generate a callback for Svelte components to invoke to update the tracked elements for
      // application shells in the rare cases that the main element root changes. The update is only trigged on
      // successive changes of `elementRoot`. Returns a boolean to indicate the element roots are updated.
      const elementRootUpdate = () =>
      {
         let cntr = 0;

         return (elementRoot) =>
         {
            if (elementRoot !== null && elementRoot !== void 0 && cntr++ > 0)
            {
               this.#updateApplicationShell();
               return true;
            }

            return false;
         };
      };

      if (Array.isArray(this.options.svelte))
      {
         for (const svelteConfig of this.options.svelte)
         {
            const svelteData = loadSvelteConfig({
               app: this,
               template: html[0],
               config: svelteConfig,
               elementRootUpdate
            });

            if (isApplicationShell(svelteData.component))
            {
               if (this.svelte.applicationShell !== null)
               {
                  throw new Error(
                   `SvelteApplication - _injectHTML - An application shell is already mounted; offending config:
                    ${JSON.stringify(svelteConfig)}`);
               }

               this.#applicationShellHolder[0] = svelteData.component;

               // If Vite / HMR / svelte_hmr is enabled then add a hook to receive callbacks when the ProxyComponent
               // refreshes. Update the element root accordingly and force an update to Position.
               // See this issue for info about `on_hmr`:
               // https://github.com/sveltejs/svelte-hmr/issues/57
               if (isHMRProxy(svelteData.component) && Array.isArray(svelteData.component?.$$?.on_hmr))
               {
                  svelteData.component.$$.on_hmr.push(() => () => this.#updateApplicationShell());
               }
            }

            this.#svelteData.push(svelteData);
         }
      }
      else if (typeof this.options.svelte === 'object')
      {
         const svelteData = loadSvelteConfig({
            app: this,
            template: html[0],
            config: this.options.svelte,
            elementRootUpdate
         });

         if (isApplicationShell(svelteData.component))
         {
            // A sanity check as shouldn't hit this case as only one component is being mounted.
            if (this.svelte.applicationShell !== null)
            {
               throw new Error(
                `SvelteApplication - _injectHTML - An application shell is already mounted; offending config:
                 ${JSON.stringify(this.options.svelte)}`);
            }

            this.#applicationShellHolder[0] = svelteData.component;

            // If Vite / HMR / svelte_hmr is enabled then add a hook to receive callbacks when the ProxyComponent
            // refreshes. Update the element root accordingly and force an update to Position.
            // See this issue for info about `on_hmr`:
            // https://github.com/sveltejs/svelte-hmr/issues/57
            if (isHMRProxy(svelteData.component) && Array.isArray(svelteData.component?.$$?.on_hmr))
            {
               svelteData.component.$$.on_hmr.push(() => () => this.#updateApplicationShell());
            }
         }

         this.#svelteData.push(svelteData);
      }

      // Detect if this is a synthesized DocumentFragment.
      const isDocumentFragment = html.length && html[0] instanceof DocumentFragment;

      // If any of the Svelte components mounted directly targets an HTMLElement then do not inject HTML.
      let injectHTML = true;
      for (const svelteData of this.#svelteData)
      {
         if (!svelteData.injectHTML) { injectHTML = false; break; }
      }
      if (injectHTML) { super._injectHTML(html); }

      if (this.svelte.applicationShell !== null)
      {
         this._element = $(this.svelte.applicationShell.elementRoot);

         // Detect if the application shell exports an `elementContent` accessor.
         this.#elementContent = hasGetter(this.svelte.applicationShell, 'elementContent') ?
          this.svelte.applicationShell.elementContent : null;

         // Detect if the application shell exports an `elementTarget` accessor.
         this.#elementTarget = hasGetter(this.svelte.applicationShell, 'elementTarget') ?
          this.svelte.applicationShell.elementTarget : null;
      }
      else if (isDocumentFragment) // Set the element of the app to the first child element in order of Svelte components mounted.
      {
         for (const svelteData of this.#svelteData)
         {
            if (svelteData.element instanceof HTMLElement)
            {
               this._element = $(svelteData.element);
               break;
            }
         }
      }

      // Potentially retrieve a specific target element if `selectorTarget` is defined otherwise make the target the
      // main element.
      if (this.#elementTarget === null)
      {
         const element = typeof this.options.selectorTarget === 'string' ?
          this._element.find(this.options.selectorTarget) : this._element;

         this.#elementTarget = element[0];
      }

      // TODO VERIFY THIS CHECK ESPECIALLY `this.#elementTarget.length === 0`.
      if (this.#elementTarget === null || this.#elementTarget === void 0 || this.#elementTarget.length === 0)
      {
         throw new Error(`SvelteApplication - _injectHTML: Target element '${this.options.selectorTarget}' not found.`);
      }

      // The initial zIndex may be set in application options or for popOut applications is stored by `_renderOuter`
      // in `this.#initialZIndex`.
      if (typeof this.options.positionable === 'boolean' && this.options.positionable)
      {
         this.#elementTarget.style.zIndex = typeof this.options.zIndex === 'number' ? this.options.zIndex :
          this.#initialZIndex ?? 95;
      }

      // Subscribe to local store handling.
      this.#stores.subscribe();
   }

   /**
    * Provides a mechanism to update the UI options store for maximized.
    *
    * Note: the sanity check is duplicated from {@link Application.maximize} the store is updated _before_
    * performing the rest of animations. This allows application shells to remove / show any resize handlers
    * correctly. Extra constraint data is stored in a saved position state in {@link SvelteApplication.minimize}
    * to animate the content area.
    *
    * @param {object}   [opts] - Optional parameters.
    *
    * @param {boolean}  [opts.animate=true] - When true perform default maximizing animation.
    *
    * @param {number}   [opts.duration=0.1] - Controls content area animation duration in seconds.
    */
   async maximize({ animate = true, duration = 0.1 } = {})
   {
      if (!this.popOut || [false, null].includes(this._minimized)) { return; }

      this._minimized = null;

      const durationMS = duration * 1000; // For WAAPI.

      // Get content
      const element = this.elementTarget;
      const header = element.querySelector('.window-header');
      const content = element.querySelector('.window-content');

      // Get the complete position before minimized. Used to reset min width & height to initial values later.
      const positionBefore = this.position.state.get({ name: '#beforeMinimized' });

      // First animate / restore width / async.
      if (animate)
      {
         await this.position.state.restore({
            name: '#beforeMinimized',
            async: true,
            animateTo: true,
            properties: ['width'],
            duration: 0.1
         });
      }

      // Reset display none on all children of header.
      for (let cntr = header.children.length; --cntr >= 0;) { header.children[cntr].style.display = null; }

      content.style.display = null;

      let constraints;

      if (animate)
      {
         // Next animate / restore height synchronously and remove key. Retrieve constraints data for slide up animation
         // below.
         ({ constraints } = this.position.state.restore({
            name: '#beforeMinimized',
            animateTo: true,
            properties: ['height'],
            remove: true,
            duration
         }));
      }
      else
      {
         ({ constraints } = this.position.state.remove({ name: '#beforeMinimized' }));
      }

      // Slide down content with stored constraints.
      await content.animate([
         { maxHeight: 0, paddingTop: 0, paddingBottom: 0, offset: 0 },
         { ...constraints, offset: 1 },
         { maxHeight: '100%', offset: 1 },
      ], { duration: durationMS, fill: 'forwards' }).finished; // WAAPI in ms.

      // Restore previous min width & height from saved data, app options, or default Foundry values.
      this.position.set({
         minHeight: positionBefore.minHeight ?? this.options?.minHeight ?? MIN_WINDOW_HEIGHT,
         minWidth: positionBefore.minWidth ?? this.options?.minWidth ?? MIN_WINDOW_WIDTH,
      });

      // Remove inline styles that override any styles assigned to the app.
      element.style.minWidth = null;
      element.style.minHeight = null;

      element.classList.remove('minimized');

      this._minimized = false;

      // Using a 50ms timeout prevents any instantaneous display of scrollbars with the above maximize animation.
      setTimeout(() =>
      {
         content.style.overflow = null;

         // Reset all children of content removing overflow hidden.
         for (let cntr = content.children.length; --cntr >= 0;)
         {
            content.children[cntr].style.overflow = null;
         }
      }, 50);

      this.#stores.uiOptionsUpdate((options) => deepMerge(options, { minimized: false }));
   }

   /**
    * Provides a mechanism to update the UI options store for minimized.
    *
    * Note: the sanity check is duplicated from {@link Application.minimize} the store is updated _before_
    * performing the rest of animations. This allows application shells to remove / show any resize handlers
    * correctly. Extra constraint data is stored in a saved position state in {@link SvelteApplication.minimize}
    * to animate the content area.
    *
    * @param {object}   [opts] - Optional parameters
    *
    * @param {boolean}  [opts.animate=true] - When true perform default minimizing animation.
    *
    * @param {number}   [opts.duration=0.1] - Controls content area animation duration in seconds.
    */
   async minimize({ animate = true, duration = 0.1 } = {})
   {
      if (!this.rendered || !this.popOut || [true, null].includes(this._minimized)) { return; }

      this.#stores.uiOptionsUpdate((options) => deepMerge(options, { minimized: true }));

      this._minimized = null;

      const durationMS = duration * 1000; // For WAAPI.

      const element = this.elementTarget;

      // Get content
      const header = element.querySelector('.window-header');
      const content = element.querySelector('.window-content');

      // Save current max / min height & width.
      const beforeMinWidth = this.position.minWidth;
      const beforeMinHeight = this.position.minHeight;

      // Set minimized min width & height for header bar.
      this.position.set({ minWidth: 100, minHeight: 30 });

      // Also set inline styles to override any styles scoped to the app.
      element.style.minWidth = '100px';
      element.style.minHeight = '30px';

      if (content)
      {
         content.style.overflow = 'hidden';

         // Set all children of content to overflow hidden as if there is going to be additional scrolling elements
         // they are likely one level deep.
         for (let cntr = content.children.length; --cntr >= 0;)
         {
            content.children[cntr].style.overflow = 'hidden';
         }
      }

      const { paddingBottom, paddingTop } = globalThis.getComputedStyle(content);

      // Extra data that is saved with the current position. Used during `maximize`.
      const constraints = {
         maxHeight: `${content.clientHeight}px`,
         paddingTop,
         paddingBottom
      };

      // Slide-up content
      if (animate)
      {
         const animation = content.animate([
            constraints,
            { maxHeight: 0, paddingTop: 0, paddingBottom: 0 }
         ], { duration: durationMS, fill: 'forwards' }); // WAAPI in ms.

         // Set display style to none when animation finishes.
         animation.finished.then(() => content.style.display = 'none');
      }
      else
      {
         setTimeout(() => content.style.display = 'none', durationMS);
      }

      // Save current position state and add the constraint data to use in `maximize`.
      const saved = this.position.state.save({ name: '#beforeMinimized', constraints });

      // Set the initial before min width & height.
      saved.minWidth = beforeMinWidth;
      saved.minHeight = beforeMinHeight;

      const headerOffsetHeight = header.offsetHeight;

      // minHeight needs to be adjusted to header height.
      this.position.minHeight = headerOffsetHeight;

      if (animate)
      {
         // First await animation of height upward.
         await this.position.animate.to({ height: headerOffsetHeight }, { duration }).finished;
      }

      // Set all header buttons besides close and the window title to display none.
      for (let cntr = header.children.length; --cntr >= 0;)
      {
         const className = header.children[cntr].className;

         if (className.includes('window-title') || className.includes('close') ||
          className.includes('keep-minimized'))
         {
            continue;
         }

         header.children[cntr].style.display = 'none';
      }

      if (animate)
      {
         // Await animation of width to the left / minimum width.
         await this.position.animate.to({ width: MIN_WINDOW_WIDTH }, { duration: 0.1 }).finished;
      }

      element.classList.add('minimized');

      this._minimized = true;
   }

   /**
    * Provides a callback after all Svelte components are initialized.
    *
    * @param {object}      [opts] - Optional parameters.
    *
    * @param {HTMLElement} [opts.element] - HTMLElement container for main application element.
    *
    * @param {HTMLElement} [opts.elementContent] - HTMLElement container for content area of application shells.
    *
    * @param {HTMLElement} [opts.elementTarget] - HTMLElement container for main application target element.
    */
   onSvelteMount({ element, elementContent, elementTarget } = {}) {} // eslint-disable-line no-unused-vars

   /**
    * Provides a callback after the main application shell is remounted. This may occur during HMR / hot module
    * replacement or directly invoked from the `elementRootUpdate` callback passed to the application shell component
    * context.
    *
    * @param {object}      [opts] - Optional parameters.
    *
    * @param {HTMLElement} [opts.element] - HTMLElement container for main application element.
    *
    * @param {HTMLElement} [opts.elementContent] - HTMLElement container for content area of application shells.
    *
    * @param {HTMLElement} [opts.elementTarget] - HTMLElement container for main application target element.
    */
   onSvelteRemount({ element, elementContent, elementTarget } = {}) {} // eslint-disable-line no-unused-vars

   /**
    * Override replacing HTML as Svelte components control the rendering process. Only potentially change the outer
    * application frame / title for pop-out applications.
    *
    * @inheritDoc
    * @ignore
    */
   _replaceHTML(element, html)  // eslint-disable-line no-unused-vars
   {
      if (!element.length) { return; }

      this.reactive.updateHeaderButtons();
   }

   /**
    * Provides an override verifying that a new Application being rendered for the first time doesn't have a
    * corresponding DOM element already loaded. This is a check that only occurs when `this._state` is
    * `Application.RENDER_STATES.NONE`. It is useful in particular when SvelteApplication has a static ID
    * explicitly set in `this.options.id` and long intro / outro transitions are assigned. If a new application
    * sharing this static ID attempts to open / render for the first time while an existing DOM element sharing
    * this static ID exists then the initial render is cancelled below rather than crashing later in the render
    * cycle {@link Position.set}.
    *
    * @inheritDoc
    * @protected
    * @ignore
    */
   async _render(force = false, options = {})
   {
      if (this._state === Application.RENDER_STATES.NONE &&
       document.querySelector(`#${this.id}`) instanceof HTMLElement)
      {
         console.warn(`SvelteApplication - _render: A DOM element already exists for CSS ID '${this.id
         }'. Cancelling initial render for new application with appId '${this.appId}'.`);

         return;
      }

      await super._render(force, options);

      if (!this.#onMount)
      {
         this.onSvelteMount({ element: this._element[0], elementContent: this.#elementContent, elementTarget:
          this.#elementTarget });

         this.#onMount = true;
      }
   }

   /**
    * Render the inner application content. Only render a template if one is defined otherwise provide an empty
    * JQuery element per the core Foundry API.
    *
    * @param {Object} data         The data used to render the inner template
    *
    * @returns {Promise.<JQuery>}   A promise resolving to the constructed jQuery object
    *
    * @protected
    * @ignore
    */
   async _renderInner(data)
   {
      const html = typeof this.template === 'string' ? await renderTemplate(this.template, data) :
       document.createDocumentFragment();

      return $(html);
   }

   /**
    * Stores the initial z-index set in `_renderOuter` which is used in `_injectHTML` to set the target element
    * z-index after the Svelte component is mounted.
    *
    * @returns {Promise<JQuery>} Outer frame / unused.
    * @protected
    * @ignore
    */
   async _renderOuter()
   {
      const html = await super._renderOuter();
      this.#initialZIndex = html[0].style.zIndex;
      return html;
   }

   /**
    * All calculation and updates of position are implemented in {@link Position.set}. This allows position to be fully
    * reactive and in control of updating inline styles for the application.
    *
    * This method remains for backward compatibility with Foundry. If you have a custom override quite likely you need
    * to update to using the {@link Position.validators} functionality.
    *
    * @param {PositionDataExtended}   [position] - Position data.
    *
    * @returns {Position} The updated position object for the application containing the new values
    */
   setPosition(position)
   {
      return this.position.set(position);
   }

   /**
    * This method is invoked by the `elementRootUpdate` callback that is added to the external context passed to
    * Svelte components. When invoked it updates the local element roots tracked by SvelteApplication.
    *
    * This method may also be invoked by HMR / hot module replacement via `svelte-hmr`.
    */
   #updateApplicationShell()
   {
      const applicationShell = this.svelte.applicationShell;

      if (applicationShell !== null)
      {
         this._element = $(applicationShell.elementRoot);

         // Detect if the application shell exports an `elementContent` accessor.
         this.#elementContent = hasGetter(applicationShell, 'elementContent') ?
          applicationShell.elementContent : null;

         // Detect if the application shell exports an `elementTarget` accessor.
         this.#elementTarget = hasGetter(applicationShell, 'elementTarget') ?
          applicationShell.elementTarget : null;

         if (this.#elementTarget === null)
         {
            const element = typeof this.options.selectorTarget === 'string' ?
             this._element.find(this.options.selectorTarget) : this._element;

            this.#elementTarget = element[0];
         }

         // The initial zIndex may be set in application options or for popOut applications is stored by `_renderOuter`
         // in `this.#initialZIndex`.
         if (typeof this.options.positionable === 'boolean' && this.options.positionable)
         {
            this.#elementTarget.style.zIndex = typeof this.options.zIndex === 'number' ? this.options.zIndex :
             this.#initialZIndex ?? 95;

            super.bringToTop();

            // Ensure that new root element has inline position styles set.
            this.position.set(this.position.get());
         }

         super._activateCoreListeners([this.#elementTarget]);

         this.onSvelteRemount({ element: this._element[0], elementContent: this.#elementContent, elementTarget:
          this.#elementTarget });
      }
   }
}

/**
 * @typedef {object} SvelteData
 *
 * @property {object}                           config -
 *
 * @property {import('svelte').SvelteComponent} component -
 *
 * @property {HTMLElement}                      element -
 *
 * @property {boolean}                          injectHTML -
 */

/**
 * @typedef {object} SvelteStores
 *
 * @property {import('svelte/store').Writable.update} appOptionsUpdate - Update function for app options store.
 *
 * @property {Function} subscribe - Subscribes to local stores.
 *
 * @property {import('svelte/store').Writable.update} uiOptionsUpdate - Update function for UI options store.
 *
 * @property {Function} unsubscribe - Unsubscribes from local stores.
 */
