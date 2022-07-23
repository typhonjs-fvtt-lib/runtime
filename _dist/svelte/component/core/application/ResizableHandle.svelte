<script>
   import { getContext }         from 'svelte';

   export let isResizable = false;

   const application = getContext('external').application;

   // Allows retrieval of the element root at runtime.
   const storeElementRoot = getContext('storeElementRoot');

   const storeResizable = application.reactive.storeAppOptions.resizable;

   const storeMinimized = application.reactive.storeUIState.minimized;
   const storeResizing = application.reactive.storeUIState.resizing;

   let elementResize;

   $: if (elementResize)
   {
      // Instead of creating a derived store it is easier to use isResizable and the minimized store below.
      elementResize.style.display = isResizable && !$storeMinimized ? 'block' : 'none';

      // Add / remove `resizable` class from element root.
      const elementRoot = $storeElementRoot;
      if (elementRoot) { elementRoot.classList[isResizable ? 'add' : 'remove']('resizable'); }
   }

   /**
    * Provides an action to handle resizing the application shell based on the resizable app option.
    *
    * @param {HTMLElement}       node - The node associated with the action.
    *
    * @param {object}            [opts] - Optional parameters.
    *
    * @param {boolean}           [opts.active=true] - A boolean value; attached to a readable store.
    *
    * @param {Writable<boolean>} [opts.storeResizing] - A writable store that tracks "resizing" state.
    *
    * @returns {{update: Function, destroy: Function}} The action lifecycle methods.
    */
   function resizable(node, { active = true, storeResizing = void 0 } = {})
   {
      /**
       * Duplicate the app / Positionable starting position to track differences.
       *
       * @type {object}
       */
      let position = null;

      /**
       * Stores the initial X / Y on drag down.
       *
       * @type {object}
       */
      let initialPosition = {};

      /**
       * Stores the current resizing state and gates the move pointer as the resizing store is not
       * set until the first pointer move.
       *
       * @type {boolean}
       */
      let resizing = false;

      /**
       * Remember event handlers associated with this action so they may be later unregistered.
       *
       * @type {Object}
       */
      const handlers = {
         resizeDown: ['pointerdown', (e) => onResizePointerDown(e), false],
         resizeMove: ['pointermove', (e) => onResizePointerMove(e), false],
         resizeUp: ['pointerup', (e) => onResizePointerUp(e), false]
      };

      /**
       * Activates listeners.
       */
      function activateListeners()
      {
         // Resize handlers
         node.addEventListener(...handlers.resizeDown);

         isResizable = true;

         node.style.display = 'block';
      }

      /**
       * Removes listeners.
       */
      function removeListeners()
      {
         if (typeof storeResizing?.set === 'function') { storeResizing.set(false); }

         // Resize handlers
         node.removeEventListener(...handlers.resizeDown);
         node.removeEventListener(...handlers.resizeMove);
         node.removeEventListener(...handlers.resizeUp);

         node.style.display = 'none';

         isResizable = false;
      }

      // On mount if resizable is true then activate listeners otherwise set element display to `none`.
      if (active)
      {
         activateListeners();
      }
      else
      {
         node.style.display = 'none';
      }

      /**
       * Handle the initial pointer down that activates resizing capture.
       */
      function onResizePointerDown(event)
      {
         event.preventDefault();

         resizing = false;

         // Record initial position
         position = application.position.get();

         if (position.height === 'auto') { position.height = $storeElementRoot.clientHeight; }
         if (position.width === 'auto') { position.width = $storeElementRoot.clientWidth; }

         initialPosition = { x: event.clientX, y: event.clientY };

         // Add temporary handlers
         node.addEventListener(...handlers.resizeMove);
         node.addEventListener(...handlers.resizeUp);

         node.setPointerCapture(event.pointerId);
      }

      /**
       * Sets the width / height of the positionable application.
       */
      function onResizePointerMove(event)
      {
         event.preventDefault();

         if (!resizing && typeof storeResizing?.set === 'function')
         {
            resizing = true;
            storeResizing.set(true);
         }

         application.position.set({
            width: position.width + (event.clientX - initialPosition.x),
            height: position.height + (event.clientY - initialPosition.y)
         });
      }

      /**
       * Conclude the dragging behavior when the pointer is released setting the final position and
       * removing listeners.
       */
      function onResizePointerUp(event)
      {
         resizing = false;
         if (typeof storeResizing?.set === 'function') { storeResizing.set(false); }

         event.preventDefault();
         node.removeEventListener(...handlers.resizeMove);
         node.removeEventListener(...handlers.resizeUp);

         application._onResize(event);
      }

      return {
         update: ({ active }) =>  // eslint-disable-line no-shadow
         {
            if (active) { activateListeners(); }
            else { removeListeners(); }
         },

         destroy: () => removeListeners()
      };
   }

</script>

<div class="window-resizable-handle"
     use:resizable={{active: $storeResizable, storeResizing}}
     bind:this={elementResize}>
   <i class="fas fa-arrows-alt-h"></i>
</div>
