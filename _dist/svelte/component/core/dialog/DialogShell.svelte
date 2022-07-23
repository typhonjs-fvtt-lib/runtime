<script>
   import { getContext }               from 'svelte';
   import { fade }                     from 'svelte/transition';

   import ApplicationShell             from '../application/ApplicationShell.svelte';
   import DialogContent                from './DialogContent.svelte';
   import TJSGlassPane                 from '../TJSGlassPane.svelte';

   // Application shell contract.
   export let elementContent;
   export let elementRoot;

   // The dialog data.
   export let data = {};

   export let dialogComponent = void 0;

   const application = getContext('external').application;

   const s_MODAL_TRANSITION = fade;
   const s_MODAL_TRANSITION_OPTIONS = { duration: 200 };
   const s_MODAL_BACKGROUND = '#50505080'

   let modal = void 0;

   // Stores props for the ApplicationShell.
   const appProps = {
      // Stores any transition functions.
      transition: void 0,
      inTransition: void 0,
      outTransition: void 0,

      // Stores properties to set for options for any transitions.
      transitionOptions: void 0,
      inTransitionOptions: void 0,
      outTransitionOptions: void 0,

      // Stores any style overrides for application shell.
      stylesApp: void 0,
      stylesContent: void 0
   }

   const modalProps = {
      // Background CSS style string.
      background: void 0,

      // Stores any transition functions.
      transition: void 0,
      inTransition: void 0,
      outTransition: void 0,

      // Stores properties to set for options for any transitions.
      transitionOptions: void 0,
      inTransitionOptions: void 0,
      outTransitionOptions: void 0,
   }

   let zIndex = void 0;

   // Automatically close the dialog on button click handler completion.
   let autoClose = true;

   // Only set modal once on mount. You can't change between a modal an non-modal dialog during runtime.
   if (modal === void 0) { modal = typeof data?.modal === 'boolean' ? data.modal : false; }

   // Retrieve values from the DialogData object and also potentially set any SvelteApplication accessors.
   // Explicit checks are performed against existing local variables as the only externally reactive variable is `data`.
   // All of the checks below trigger when there are any external changes to the `data` prop.
   // Prevent any unnecessary changing of local & `application` variables unless actual changes occur.

   // Foundry App options --------------------------------------------------------------------------------------------

   $: if (typeof data === 'object')
   {
      autoClose = typeof data.autoClose === 'boolean' ? data.autoClose : true;

      const newZIndex = Number.isInteger(data.zIndex) || data.zIndex === null ? data.zIndex :
       modal ? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER - 1
      if (zIndex !== newZIndex) { zIndex = newZIndex; }

      // Update the main foundry options when data changes. Perform explicit checks against existing data in `application`.
      const newDraggable = data.draggable ?? true;
      if (application.reactive.draggable !== newDraggable) { application.reactive.draggable = newDraggable; }

      const newPopOut = data.popOut ?? true;
      if (application.reactive.popOut !== newPopOut) { application.reactive.popOut = newPopOut; }

      const newResizable = data.resizable ?? false;
      if (application.reactive.resizable !== newResizable) { application.reactive.resizable = newResizable; }

      // Note application.title from Application localizes `options.title`, so compare with `application.options.title`.
      const newTitle = data.title ?? 'Dialog';
      if (newTitle !== application?.options?.title) { application.reactive.title = newTitle; }

      if (application.position.zIndex !== zIndex) { application.position.zIndex = zIndex; }
   }

   // ApplicationShell transition options ----------------------------------------------------------------------------

   $: if (typeof data?.transition === 'object')
   {
      // Store data.transitions to shorten statements below.
      const d = data.transition;

      if (d?.transition !== appProps.transition) { appProps.transition = d.transition; }
      if (d?.inTransition !== appProps.inTransition) { appProps.inTransition = d.inTransition; }
      if (d?.outTransition !== appProps.outTransition) { appProps.outTransition = d.outTransition; }
      if (d?.transitionOptions !== appProps.transitionOptions) { appProps.transitionOptions = d.transitionOptions; }

      if (d?.inTransitionOptions !== appProps.inTransitionOptions)
      {
         appProps.inTransitionOptions = d.inTransitionOptions;
      }

      if (d?.outTransitionOptions !== appProps.outTransitionOptions)
      {
         appProps.outTransitionOptions = d.outTransitionOptions;
      }
   }

   // Modal options --------------------------------------------------------------------------------------------------

   $:
   {
      const newModalBackground = typeof data?.modalOptions?.background === 'string' ? data.modalOptions.background :
       s_MODAL_BACKGROUND;

      if (newModalBackground !== modalProps.background) { modalProps.background = newModalBackground; }
   }

   $: if (typeof data?.modalOptions?.transition === 'object')
   {
      // Store data.transitions to shorten statements below.
      const d = data.modalOptions.transition;

      if (d?.transition !== modalProps.transition)
      {
         modalProps.transition = typeof d?.transition === 'function' ? d.transition : s_MODAL_TRANSITION;
      }

      if (d?.inTransition !== modalProps.inTransition) { modalProps.inTransition = d.inTransition; }
      if (d?.outTransition !== modalProps.outTransition) { modalProps.outTransition = d.outTransition; }

      // Provide default transition options if not defined.
      if (d?.transitionOptions !== modalProps.transitionOptions)
      {
         modalProps.transitionOptions = typeof d?.transitionOptions === 'object' ? d.transitionOptions :
          s_MODAL_TRANSITION_OPTIONS;
      }

      if (d?.inTransitionOptions !== modalProps.inTransitionOptions)
      {
         modalProps.inTransitionOptions = d.inTransitionOptions;
      }

      if (d?.outTransitionOptions !== modalProps.outTransitionOptions)
      {
         modalProps.outTransitionOptions = d.outTransitionOptions;
      }
   }
   else  // Provide a fallback / default glass pane transition when `data.modalOptions.transition` is not defined.
   {
      const newModalTransition = typeof data?.modalOptions?.transition?.transition === 'function' ?
       data.modalOptions.transition.transition : s_MODAL_TRANSITION;

      if (newModalTransition !== modalProps.transition) { modalProps.transition = newModalTransition; }

      const newModalTransitionOptions = typeof data?.modalOptions?.transitionOptions === 'object' ?
       data.modalOptions.transitionOptions : s_MODAL_TRANSITION_OPTIONS;

      if (newModalTransitionOptions !== modalProps.transitionOptions)
      {
         modalProps.transitionOptions = newModalTransitionOptions;
      }
   }
</script>

<svelte:options accessors={true}/>

{#if modal}
   <TJSGlassPane id={`${application.id}-glasspane`} preventDefault={false} stopPropagation={false} {...modalProps} {zIndex}>
      <ApplicationShell bind:elementRoot bind:elementContent {...appProps} appOffsetHeight={true}>
         <DialogContent bind:autoClose bind:dialogInstance={dialogComponent} stopPropagation={true} {data} />
      </ApplicationShell>
   </TJSGlassPane>
{:else}
   <ApplicationShell bind:elementRoot bind:elementContent {...appProps} appOffsetHeight={true}>
      <DialogContent bind:autoClose bind:dialogInstance={dialogComponent} {data} />
   </ApplicationShell>
{/if}
