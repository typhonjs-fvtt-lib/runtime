<script>
   import { getContext, setContext }   from 'svelte';
   import { writable }                 from 'svelte/store';

   import {
      applyStyles,
      resizeObserver }                 from '@typhonjs-fvtt/runtime/svelte/action';

   import TJSApplicationHeader         from './TJSApplicationHeader.svelte';
   import TJSContainer                 from '../TJSContainer.svelte';
   import ResizableHandle              from './ResizableHandle.svelte';

   import {
      s_DEFAULT_TRANSITION,
      s_DEFAULT_TRANSITION_OPTIONS }   from '@typhonjs-fvtt/runtime/svelte/transition';

   // Bound to the content and root elements. Can be used by parent components. SvelteApplication will also
   // use 'elementRoot' to set the element of the Application. You can also provide `elementContent` and
   // `elementTarget`. Please see SvelteApplication lifecycle documentation.
   export let elementContent = void 0;
   export let elementRoot = void 0;

   // Allows custom draggable implementations to be forwarded to TJSApplicationHeader.
   export let draggable = void 0;
   export let draggableOptions = void 0;

   // The children array can be specified by a parent via prop or is read below from the external context.
   export let children = void 0;

   // Explicit style overrides for the main app and content elements. Uses action `applyStyles`.
   export let stylesApp = void 0;
   export let stylesContent = void 0;

   // If a parent component binds and sets `appOffsetHeight` to true then a resizeObserver action is enabled on the
   // outer application `div`. Additionally, the SvelteApplication position resizeObserved store is updated.
   export let appOffsetHeight = false;
   export let appOffsetWidth = false;

   // Set to `resizeObserver` if either of the above props are truthy otherwise a null operation.
   const appResizeObserver = !!appOffsetHeight || !!appOffsetWidth ? resizeObserver : () => null;

   // If a parent component binds and sets `contentOffsetHeight` or `contentOffsetWidth` to true then a
   // resizeObserver action is enabled on the content `section`.
   export let contentOffsetHeight = false;
   export let contentOffsetWidth = false;

   // Set to `resizeObserver` if either of the above props are truthy otherwise a null operation.
   const contentResizeObserver = !!contentOffsetHeight || !!contentOffsetWidth ? resizeObserver : () => null;

   // If the application is a popOut application then when clicked bring to top. Bound to on pointerdown.
   const bringToTop = (event) =>
   {
      if (typeof application.options.popOut === 'boolean' && application.options.popOut)
      {
         if (application !== ui?.activeWindow) { application.bringToTop.call(application); }

         // If the activeElement is not `document.body` and the event target isn't the activeElement then blur the
         // current active element and make `document.body` focused. This allows <esc> key to close all open apps /
         // windows.
         if (document.activeElement !== document.body && event.target !== document.activeElement)
         {
            // Blur current active element.
            if (document.activeElement instanceof HTMLElement) { document.activeElement.blur(); }

            // Make document body focused.
            document.body.focus();
         }
      }
   }

   // Use a writable store to make `elementContent` and `elementRoot` accessible. A store is used in the case when
   // One root component with an `elementRoot` is replaced with another. Due to timing issues and the onDestroy / outro
   // transitions either of these may be set to null. I will investigate more and file a bug against Svelte.
   if (!getContext('storeElementContent')) { setContext('storeElementContent', writable(elementContent)); }
   if (!getContext('storeElementRoot')) { setContext('storeElementRoot', writable(elementRoot)); }

   // Only update the `elementContent` store if the new `elementContent` is not null or undefined.
   $: if (elementContent !== void 0 && elementContent !== null)
   {
      getContext('storeElementContent').set(elementContent);
   }

   // Only update the `elementRoot` store if the new `elementRoot` is not null or undefined.
   $: if (elementRoot !== void 0 && elementRoot !== null)
   {
      getContext('storeElementRoot').set(elementRoot);
   }

   const context = getContext('external');

   // Store Foundry Application reference.
   const application = context.application;

   // This component can host multiple children defined via props or in the TyphonJS SvelteData configuration object
   // that are potentially mounted in the content area. If no children defined then this component mounts any slotted
   // child.
   const allChildren = Array.isArray(children) ? children :
    typeof context === 'object' ? context.children : void 0;

   // ---------------------------------------------------------------------------------------------------------------

   // The following block is somewhat complex, but allows transition options to be updated reactively during
   // runtime execution.

   // Exports properties to set a transition w/ in / out options.
   export let transition = void 0;
   export let inTransition = s_DEFAULT_TRANSITION;
   export let outTransition = s_DEFAULT_TRANSITION;

   // Exports properties to set options for any transitions.
   export let transitionOptions = void 0;
   export let inTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS;
   export let outTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS;

   // Tracks last transition state.
   let oldTransition = void 0;
   let oldTransitionOptions = void 0

   // Run this reactive block when the last transition state is not equal to the current state.
   $: if (oldTransition !== transition)
   {
      // If transition is defined and not the default transition then set it to both in and out transition otherwise
      // set the default transition to both in & out transitions.
      const newTransition = s_DEFAULT_TRANSITION !== transition && typeof transition === 'function' ? transition :
       s_DEFAULT_TRANSITION;

      inTransition = newTransition;
      outTransition = newTransition;

      oldTransition = newTransition;
   }

   // Run this reactive block when the last transition options state is not equal to the current options state.
   $: if (oldTransitionOptions !== transitionOptions)
   {
      const newOptions = transitionOptions !== s_DEFAULT_TRANSITION_OPTIONS && typeof transitionOptions === 'object' ?
       transitionOptions : s_DEFAULT_TRANSITION_OPTIONS;

      inTransitionOptions = newOptions;
      outTransitionOptions = newOptions;

      oldTransitionOptions = newOptions;
   }

   // Handle cases if inTransition is unset; assign noop default transition function.
   $: if (typeof inTransition !== 'function') { inTransition = s_DEFAULT_TRANSITION; }

   $:
   {
      // Handle cases if outTransition is unset; assign noop default transition function.
      if (typeof outTransition !== 'function') { outTransition = s_DEFAULT_TRANSITION; }

      // Set jquery close animation to either run or not when an out transition is changed.
      if (application && typeof application?.options?.defaultCloseAnimation === 'boolean')
      {
         application.options.defaultCloseAnimation = outTransition === s_DEFAULT_TRANSITION;
      }
   }

   // Handle cases if inTransitionOptions is unset; assign empty default transition options.
   $: if (typeof inTransitionOptions !== 'object') { inTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS; }

   // Handle cases if outTransitionOptions is unset; assign empty default transition options.
   $: if (typeof outTransitionOptions !== 'object') { outTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS; }

   // ---------------------------------------------------------------------------------------------------------------

   /**
    * Callback for content resizeObserver action. This is enabled when contentOffsetHeight or contentOffsetWidth is
    * bound.
    *
    * @param {number}   offsetWidth - Observed offsetWidth.
    *
    * @param {number}   offsetHeight - Observed offsetHeight
    */
   function resizeObservedContent(offsetWidth, offsetHeight)
   {
      contentOffsetWidth = offsetWidth;
      contentOffsetHeight = offsetHeight;
   }

   /**
    * Callback for app resizeObserver action. This is enabled when appOffsetHeight or appOffsetWidth is
    * bound. Additionally, the Application position resizeObserved store is updated.
    *
    * @param {number}   contentWidth - Observed contentWidth.
    * @param {number}   contentHeight - Observed contentHeight
    * @param {number}   offsetWidth - Observed offsetWidth.
    * @param {number}   offsetHeight - Observed offsetHeight
    */
   function resizeObservedApp(offsetWidth, offsetHeight, contentWidth, contentHeight)
   {
      application.position.stores.resizeObserved.update((object) =>
      {
         object.contentWidth = contentWidth;
         object.contentHeight = contentHeight;
         object.offsetWidth = offsetWidth;
         object.offsetHeight = offsetHeight;

         return object;
      });

      appOffsetHeight = offsetHeight;
      appOffsetWidth = offsetWidth;
   }
</script>

<svelte:options accessors={true}/>

<div id={application.id}
     class="app window-app {application.options.classes.join(' ')}"
     data-appid={application.appId}
     bind:this={elementRoot}
     in:inTransition={inTransitionOptions}
     out:outTransition={outTransitionOptions}
     on:pointerdown|capture={bringToTop}
     use:applyStyles={stylesApp}
     use:appResizeObserver={resizeObservedApp}>
   <TJSApplicationHeader {draggable} {draggableOptions} />
   <section class=window-content
            bind:this={elementContent}
            use:applyStyles={stylesContent}
            use:contentResizeObserver={resizeObservedContent}>
      {#if Array.isArray(allChildren)}
         <TJSContainer children={allChildren} />
      {:else}
         <slot />
      {/if}
   </section>
   <ResizableHandle />
</div>

<style>
   .window-app {
      overflow: inherit;
   }

   /* Note: this is different than stock Foundry that sets `flex: 1`. This greatly aids control of content */
   .window-app .window-content > * {
      flex: none;
   }
</style>
