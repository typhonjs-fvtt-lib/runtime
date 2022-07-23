<script>
   import { getContext }            from 'svelte';
   import { cubicOut }              from 'svelte/easing';

   import {
      draggable as dragDefault }    from '@typhonjs-fvtt/runtime/svelte/action';

   import { localize }              from '@typhonjs-fvtt/runtime/svelte/helper';

   import { isSvelteComponent }     from '@typhonjs-fvtt/runtime/svelte/util';

   export let draggable
   export let draggableOptions;

   import TJSHeaderButton           from './TJSHeaderButton.svelte';

   const application = getContext('external').application;

   const storeTitle = application.reactive.storeAppOptions.title;
   const storeDraggable = application.reactive.storeAppOptions.draggable;
   const storeDragging = application.reactive.storeUIState.dragging;
   const storeHeaderButtons = application.reactive.storeUIState.headerButtons;
   const storeHeaderNoTitleMinimized = application.reactive.storeAppOptions.headerNoTitleMinimized;
   const storeMinimizable = application.reactive.storeAppOptions.minimizable;
   const storeMinimized = application.reactive.storeUIState.minimized;

   let dragOptions;

   $: draggable = typeof draggable === 'function' ? draggable : dragDefault;

   // Combines external options with defaults for TJSApplicationHeader.
   // $: dragOptions = Object.assign({}, typeof draggableOptions === 'object' ? draggableOptions : {},
   //  { position: application.position, active: $storeDraggable, storeDragging });

   // Combines external options with defaults for TJSApplicationHeader. By default, easing is turned on w/ duration of
   // 0.1 and cubicOut, but can be overridden by any provided `draggableOptions`. `position`, `active`, and
   // `storeDragging` are always overridden by application position / stores.
   $: dragOptions = Object.assign({}, { ease: true, easeOptions: { duration: 0.1, ease: cubicOut } },
    typeof draggableOptions === 'object' ? draggableOptions : {}, { position: application.position, active:
     $storeDraggable, storeDragging });

   let displayHeaderTitle;

   $: displayHeaderTitle = $storeHeaderNoTitleMinimized && $storeMinimized ? 'none' : null;

   let buttons;

   $:
   {
      buttons = $storeHeaderButtons.reduce((array, button) =>
      {
         // If the button is a SvelteComponent set it as the class otherwise use `TJSHeaderButton` w/ button as props.
         array.push(isSvelteComponent(button) ? { class: button, props: {} } :
          { class: TJSHeaderButton, props: { button } });

         return array;
      }, []);
   }

   function minimizable(node, booleanStore)
   {
      const callback = application._onToggleMinimize.bind(application);

      function activateListeners() { node.addEventListener('dblclick', callback); }
      function removeListeners() { node.removeEventListener('dblclick', callback); }

      if (booleanStore) { activateListeners(); }

      return {
         update: (booleanStore) =>  // eslint-disable-line no-shadow
         {
            if (booleanStore) { activateListeners(); }
            else { removeListeners(); }
         },

         destroy: () => removeListeners()
      };
   }
</script>

{#key draggable}
   <header class="window-header flexrow"
           use:draggable={dragOptions}
           use:minimizable={$storeMinimizable}>
      <h4 class=window-title style:display={displayHeaderTitle}>{localize($storeTitle)}</h4>
      {#each buttons as button}
         <svelte:component this={button.class} {...button.props} />
      {/each}
   </header>
{/key}

<style>
   .window-title {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
   }
</style>
