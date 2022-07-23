import { isUpdatableStore, isWritableStore } from '@typhonjs-fvtt/runtime/svelte/store';
import { styleParsePixels, debounce, hasSetter } from '@typhonjs-fvtt/runtime/svelte/util';
import { cubicOut } from 'svelte/easing';

/**
 * Provides an action to always blur the element when any pointer up event occurs on the element.
 *
 * @param {HTMLElement}   node - The node to handle always blur on pointer up.
 */
function alwaysBlur(node)
{
   function blur()
   {
      setTimeout(() => { if (document.activeElement === node) { node.blur(); } }, 0);
   }

   node.addEventListener('pointerup', blur);

   return {
      destroy: () => node.removeEventListener('pointerup', blur)
   };
}

/**
 * Provides an action to monitor the given HTMLElement node with `ResizeObserver` posting width / height changes
 * to the target in various ways depending on the shape of the target. The target can be one of the following and the
 * precedence order is listed from top to bottom:
 *
 * - has a `resizeObserved` function as attribute; offset then content width / height are passed as parameters.
 * - has a `setContentBounds` function as attribute; content width / height are passed as parameters.
 * - has a `setDimension` function as attribute; offset width / height are passed as parameters.
 * - target is an object; offset and content width / height attributes are directly set on target.
 * - target is a function; the function is invoked with offset then content width / height parameters.
 * - has a writable store `resizeObserved` as an attribute; updated with offset & content width / height.
 * - has an object 'stores' that has a writable store `resizeObserved` as an attribute; updated with offset &
 *   content width / height.
 *
 * Note: Svelte currently uses an archaic IFrame based workaround to monitor offset / client width & height changes.
 * A more up to date way to do this is with ResizeObserver. To track when Svelte receives ResizeObserver support
 * monitor this issue: {@link https://github.com/sveltejs/svelte/issues/4233}
 *
 * Can-I-Use: {@link https://caniuse.com/resizeobserver}
 *
 * @param {HTMLElement}          node - The node associated with the action.
 *
 * @param {ResizeObserverTarget} target - An object or function to update with observed width & height changes.
 *
 * @returns {{update: Function, destroy: Function}} The action lifecycle methods.
 * @see {@link https://github.com/sveltejs/svelte/issues/4233}
 */
function resizeObserver(node, target)
{
   ResizeObserverManager.add(node, target);

   return {
      update: (newTarget) =>
      {
         ResizeObserverManager.remove(node, target);
         target = newTarget;
         ResizeObserverManager.add(node, target);
      },

      destroy: () =>
      {
         ResizeObserverManager.remove(node, target);
      }
   };
}

/**
 * Provides a function that when invoked with an element updates the cached styles for each subscriber of the element.
 *
 * The style attributes cached to calculate offset height / width include border & padding dimensions. You only need
 * to update the cache if you change border or padding attributes of the element.
 *
 * @param {HTMLElement} el - An HTML element.
 */
resizeObserver.updateCache = function(el)
{
   if (!(el instanceof HTMLElement)) { throw new TypeError(`resizeObserverUpdate error: 'el' is not an HTMLElement.`); }

   const subscribers = s_MAP.get(el);

   if (Array.isArray(subscribers))
   {
      const computed = globalThis.getComputedStyle(el);

      // Cache styles first from any inline styles then computed styles defaulting to 0 otherwise.
      // Used to create the offset width & height values from the context box ResizeObserver provides.
      const borderBottom = styleParsePixels(el.style.borderBottom) ?? styleParsePixels(computed.borderBottom) ?? 0;
      const borderLeft = styleParsePixels(el.style.borderLeft) ?? styleParsePixels(computed.borderLeft) ?? 0;
      const borderRight = styleParsePixels(el.style.borderRight) ?? styleParsePixels(computed.borderRight) ?? 0;
      const borderTop = styleParsePixels(el.style.borderTop) ?? styleParsePixels(computed.borderTop) ?? 0;
      const paddingBottom = styleParsePixels(el.style.paddingBottom) ?? styleParsePixels(computed.paddingBottom) ?? 0;
      const paddingLeft = styleParsePixels(el.style.paddingLeft) ?? styleParsePixels(computed.paddingLeft) ?? 0;
      const paddingRight = styleParsePixels(el.style.paddingRight) ?? styleParsePixels(computed.paddingRight) ?? 0;
      const paddingTop = styleParsePixels(el.style.paddingTop) ?? styleParsePixels(computed.paddingTop) ?? 0;

      const additionalWidth = borderLeft + borderRight + paddingLeft + paddingRight;
      const additionalHeight = borderTop + borderBottom + paddingTop + paddingBottom;

      for (const subscriber of subscribers)
      {
         subscriber.styles.additionalWidth = additionalWidth;
         subscriber.styles.additionalHeight = additionalHeight;
         s_UPDATE_SUBSCRIBER(subscriber, subscriber.contentWidth, subscriber.contentHeight);
      }
   }
};

// Below is the static ResizeObserverManager ------------------------------------------------------------------------

const s_MAP = new Map();

/**
 * Provides a static / single instance of ResizeObserver that can notify listeners in different ways.
 *
 * The action, {@link resizeObserver}, utilizes ResizeObserverManager for automatic registration and removal
 * via Svelte.
 */
class ResizeObserverManager
{
   /**
    * Add an HTMLElement and ResizeObserverTarget instance for monitoring. Create cached style attributes for the
    * given element include border & padding dimensions for offset width / height calculations.
    *
    * @param {HTMLElement}    el - The element to observe.
    *
    * @param {ResizeObserverTarget} target - A target that contains one of several mechanisms for updating resize data.
    */
   static add(el, target)
   {
      const updateType = s_GET_UPDATE_TYPE(target);

      if (updateType === 0)
      {
         throw new Error(`'target' does not match supported ResizeObserverManager update mechanisms.`);
      }

      const computed = globalThis.getComputedStyle(el);

      // Cache styles first from any inline styles then computed styles defaulting to 0 otherwise.
      // Used to create the offset width & height values from the context box ResizeObserver provides.
      const borderBottom = styleParsePixels(el.style.borderBottom) ?? styleParsePixels(computed.borderBottom) ?? 0;
      const borderLeft = styleParsePixels(el.style.borderLeft) ?? styleParsePixels(computed.borderLeft) ?? 0;
      const borderRight = styleParsePixels(el.style.borderRight) ?? styleParsePixels(computed.borderRight) ?? 0;
      const borderTop = styleParsePixels(el.style.borderTop) ?? styleParsePixels(computed.borderTop) ?? 0;
      const paddingBottom = styleParsePixels(el.style.paddingBottom) ?? styleParsePixels(computed.paddingBottom) ?? 0;
      const paddingLeft = styleParsePixels(el.style.paddingLeft) ?? styleParsePixels(computed.paddingLeft) ?? 0;
      const paddingRight = styleParsePixels(el.style.paddingRight) ?? styleParsePixels(computed.paddingRight) ?? 0;
      const paddingTop = styleParsePixels(el.style.paddingTop) ?? styleParsePixels(computed.paddingTop) ?? 0;

      const data = {
         updateType,
         target,

         // Stores most recent contentRect.width and contentRect.height values from ResizeObserver.
         contentWidth: 0,
         contentHeight: 0,

         // Convenience data for total border & padding for offset width & height calculations.
         styles: {
            additionalWidth: borderLeft + borderRight + paddingLeft + paddingRight,
            additionalHeight: borderTop + borderBottom + paddingTop + paddingBottom
         }
      };

      if (s_MAP.has(el))
      {
         const subscribers = s_MAP.get(el);
         subscribers.push(data);
      }
      else
      {
         s_MAP.set(el, [data]);
      }

      s_RESIZE_OBSERVER.observe(el);
   }

   /**
    * Removes all targets from monitoring when just an element is provided otherwise removes a specific target
    * from the monitoring map. If no more targets remain then the element is removed from monitoring.
    *
    * @param {HTMLElement}          el - Element to remove from monitoring.
    *
    * @param {ResizeObserverTarget} [target] - A specific target to remove from monitoring.
    */
   static remove(el, target = void 0)
   {
      const subscribers = s_MAP.get(el);
      if (Array.isArray(subscribers))
      {
         const index = subscribers.findIndex((entry) => entry.target === target);
         if (index >= 0)
         {
            // Update target subscriber with undefined values.
            s_UPDATE_SUBSCRIBER(subscribers[index], void 0, void 0);

            subscribers.splice(index, 1);
         }

         // Remove element monitoring if last target removed.
         if (subscribers.length === 0)
         {
            s_MAP.delete(el);
            s_RESIZE_OBSERVER.unobserve(el);
         }
      }
   }
}

/**
 * Defines the various shape / update type of the given target.
 *
 * @type {Record<string, number>}
 */
const s_UPDATE_TYPES = {
   none: 0,
   attribute: 1,
   function: 2,
   resizeObserved: 3,
   setContentBounds: 4,
   setDimension: 5,
   storeObject: 6,
   storesObject: 7
};

const s_RESIZE_OBSERVER = new ResizeObserver((entries) =>
{
   for (const entry of entries)
   {
      const subscribers = s_MAP.get(entry?.target);

      if (Array.isArray(subscribers))
      {
         const contentWidth = entry.contentRect.width;
         const contentHeight = entry.contentRect.height;

         for (const subscriber of subscribers)
         {
            s_UPDATE_SUBSCRIBER(subscriber, contentWidth, contentHeight);
         }
      }
   }
});

/**
 * Determines the shape of the target instance regarding valid update mechanisms to set width & height changes.
 *
 * @param {*}  target - The target instance.
 *
 * @returns {number} Update type value.
 */
function s_GET_UPDATE_TYPE(target)
{
   if (target?.resizeObserved instanceof Function) { return s_UPDATE_TYPES.resizeObserved; }
   if (target?.setDimension instanceof Function) { return s_UPDATE_TYPES.setDimension; }
   if (target?.setContentBounds instanceof Function) { return s_UPDATE_TYPES.setContentBounds; }

   const targetType = typeof target;

   // Does the target have resizeObserved writable store?
   if ((targetType === 'object' || targetType === 'function'))
   {
      if (isUpdatableStore(target.resizeObserved))
      {
         return s_UPDATE_TYPES.storeObject;
      }

      // Now check for a child stores object which is a common TRL pattern for exposing stores.
      const stores = target?.stores;
      if (typeof stores === 'object' || typeof stores === 'function')
      {
         if (isUpdatableStore(stores.resizeObserved))
         {
            return s_UPDATE_TYPES.storesObject;
         }
      }
   }

   if (targetType === 'object') { return s_UPDATE_TYPES.attribute; }

   if (targetType === 'function') { return s_UPDATE_TYPES.function; }

   return s_UPDATE_TYPES.none;
}

/**
 * Updates a subscriber target with given content width & height values. Offset width & height is calculated from
 * the content values + cached styles.
 *
 * @param {object}            subscriber - Internal data about subscriber.
 *
 * @param {number|undefined}  contentWidth - ResizeObserver contentRect.width value or undefined.
 *
 * @param {number|undefined}  contentHeight - ResizeObserver contentRect.height value or undefined.
 */
function s_UPDATE_SUBSCRIBER(subscriber, contentWidth, contentHeight)
{
   const styles = subscriber.styles;

   subscriber.contentWidth = contentWidth;
   subscriber.contentHeight = contentHeight;

   const offsetWidth = Number.isFinite(contentWidth) ? contentWidth + styles.additionalWidth : void 0;
   const offsetHeight = Number.isFinite(contentHeight) ? contentHeight + styles.additionalHeight : void 0;

   const target = subscriber.target;

   switch (subscriber.updateType)
   {
      case s_UPDATE_TYPES.attribute:
         target.contentWidth = contentWidth;
         target.contentHeight = contentHeight;
         target.offsetWidth = offsetWidth;
         target.offsetHeight = offsetHeight;
         break;

      case s_UPDATE_TYPES.function:
         target?.(offsetWidth, offsetHeight, contentWidth, contentHeight);
         break;

      case s_UPDATE_TYPES.resizeObserved:
         target.resizeObserved?.(offsetWidth, offsetHeight, contentWidth, contentHeight);
         break;

      case s_UPDATE_TYPES.setContentBounds:
         target.setContentBounds?.(contentWidth, contentHeight);
         break;

      case s_UPDATE_TYPES.setDimension:
         target.setDimension?.(offsetWidth, offsetHeight);
         break;

      case s_UPDATE_TYPES.storeObject:
         target.resizeObserved.update((object) =>
         {
            object.contentHeight = contentHeight;
            object.contentWidth = contentWidth;
            object.offsetHeight = offsetHeight;
            object.offsetWidth = offsetWidth;

            return object;
         });
         break;

      case s_UPDATE_TYPES.storesObject:
         target.stores.resizeObserved.update((object) =>
         {
            object.contentHeight = contentHeight;
            object.contentWidth = contentWidth;
            object.offsetHeight = offsetHeight;
            object.offsetWidth = offsetWidth;

            return object;
         });
         break;
   }
}

/**
 * @typedef {object | Function} ResizeObserverTarget
 *
 * @property {number} [contentHeight] -
 *
 * @property {number} [contentWidth] -
 *
 * @property {number} [offsetHeight] -
 *
 * @property {number} [offsetWidth] -
 *
 * @property {Writable<object> | Function} [resizedObserver] - Either a function or a writable store.
 *
 * @property {Function} [setContentSize] - A function that is invoked with content width & height changes.
 *
 * @property {Function} [setDimension] - A function that is invoked with offset width & height changes.
 *
 * @property {{resizedObserver: Writable<object>}} [stores] - An object with a writable store.
 */

/**
 * Provides an action to save `scrollTop` of an element with a vertical scrollbar. This action should be used on the
 * scrollable element and must include a writable store that holds the active store for the current `scrollTop` value.
 * You may switch the stores externally and this action will set the `scrollTop` based on the newly set store. This is
 * useful for instance providing a select box that controls the scrollable container.
 *
 * @param {HTMLElement} element - The target scrollable HTML element.
 *
 * @param {import('svelte/store').Writable<number>}   store - A writable store that stores the element scrollTop.
 */
function applyScrolltop(element, store)
{
   if (!isWritableStore(store))
   {
      throw new TypeError(`applyScrolltop error: 'store' must be a writable Svelte store.`);
   }

   function storeUpdate(value)
   {
      if (!Number.isFinite(value)) { return; }

      // For some reason for scrollTop to take on first update from a new element setTimeout is necessary.
      setTimeout(() => element.scrollTop = value, 0);
   }

   let unsubscribe = store.subscribe(storeUpdate);

   const resizeControl = resizeObserver(element, debounce(() => {
      if (element.isConnected) { store.set(element.scrollTop); }
   }, 500));

   /**
    * Save target `scrollTop` to the current set store.
    *
    * @param {Event} event -
    */
   function onScroll(event)
   {
      store.set(event.target.scrollTop);
   }

   const debounceFn = debounce((e) => onScroll(e), 500);

   element.addEventListener('scroll', debounceFn);

   return {
      update: (newStore) =>
      {
         unsubscribe();
         store = newStore;

         if (!isWritableStore(store))
         {
            throw new TypeError(`applyScrolltop.update error: 'store' must be a writable Svelte store.`);
         }

         unsubscribe = store.subscribe(storeUpdate);
      },

      destroy: () =>
      {
         element.removeEventListener('scroll', debounceFn);
         unsubscribe();
         resizeControl.destroy();
      }
   };
}

/**
 * Provides an action to apply style properties provided as an object.
 *
 * @param {HTMLElement} node - Target element
 *
 * @param {object}      properties - Key / value object of properties to set.
 *
 * @returns {Function} Update function.
 */
function applyStyles(node, properties)
{
   /** Sets properties on node. */
   function setProperties()
   {
      if (typeof properties !== 'object') { return; }

      for (const prop of Object.keys(properties))
      {
         node.style.setProperty(`${prop}`, properties[prop]);
      }
   }

   setProperties();

   return {
      update(newProperties)
      {
         properties = newProperties;
         setProperties();
      }
   };
}

/**
 * Provides an action to blur the element when any pointer down event occurs outside the element. This can be useful
 * for input elements including select to blur / unfocus the element when any pointer down occurs outside the element.
 *
 * @param {HTMLElement}   node - The node to handle automatic blur on focus loss.
 */
function autoBlur(node)
{
   function blur() { document.body.removeEventListener('pointerdown', onPointerDown); }
   function focus() { document.body.addEventListener('pointerdown', onPointerDown); }

   /**
    * Blur the node if a pointer down event happens outside the node.
    * @param {PointerEvent} event
    */
   function onPointerDown(event)
   {
      if (event.target === node || node.contains(event.target)) { return; }

      if (document.activeElement === node) { node.blur(); }
   }

   node.addEventListener('blur', blur);
   node.addEventListener('focus', focus);

   return {
      destroy: () =>
      {
         document.body.removeEventListener('pointerdown', onPointerDown);
         node.removeEventListener('blur', blur);
         node.removeEventListener('focus', focus);
      }
   };
}

/**
 * Provides an action to apply a Position instance to a HTMLElement and invoke `position.parent`
 *
 * @param {HTMLElement}       node - The node associated with the action.
 *
 * @param {Position}          position - A position instance.
 *
 * @returns {{update: Function, destroy: Function}} The action lifecycle methods.
 */
function applyPosition(node, position)
{
   if (hasSetter(position, 'parent')) { position.parent = node; }

   return {
      update: (newPosition) =>
      {
         // Sanity case to short circuit update if positions are the same instance.
         if (newPosition === position && newPosition.parent === position.parent) { return; }

         if (hasSetter(position)) { position.parent = void 0; }

         position = newPosition;

         if (hasSetter(position, 'parent')) { position.parent = node; }
      },

      destroy: () => { if (hasSetter(position, 'parent')) { position.parent = void 0; } }
   };
}

/**
 * Provides an action to enable pointer dragging of an HTMLElement and invoke `position.set` on a given {@link Position}
 * instance provided. When the attached boolean store state changes the draggable action is enabled or disabled.
 *
 * @param {HTMLElement}       node - The node associated with the action.
 *
 * @param {object}            params - Required parameters.
 *
 * @param {Position}          params.position - A position instance.
 *
 * @param {boolean}           [params.active=true] - A boolean value; attached to a readable store.
 *
 * @param {number}            [params.button=0] - MouseEvent button; {@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button}.
 *
 * @param {Writable<boolean>} [params.storeDragging] - A writable store that tracks "dragging" state.
 *
 * @param {boolean}           [params.ease=true] - When true easing is enabled.
 *
 * @param {object}            [params.easeOptions] - Gsap `to / `quickTo` vars object.
 *
 * @returns {{update: Function, destroy: Function}} The action lifecycle methods.
 */
function draggable(node, { position, active = true, button = 0, storeDragging = void 0, ease = false,
 easeOptions = { duration: 0.1, ease: cubicOut } })
{
   /**
    * Duplicate the app / Positionable starting position to track differences.
    *
    * @type {object}
    */
   let initialPosition = null;

   /**
    * Stores the initial X / Y on drag down.
    *
    * @type {object}
    */
   let initialDragPoint = {};

   /**
    * Stores the current dragging state and gates the move pointer as the dragging store is not
    * set until the first pointer move.
    *
    * @type {boolean}
    */
   let dragging = false;

   /**
    * Stores the quickTo callback to use for optimized tweening when easing is enabled.
    *
    * @type {quickToCallback}
    */
   let quickTo = position.animate.quickTo(['top', 'left'], easeOptions);

   /**
    * Remember event handlers associated with this action so they may be later unregistered.
    *
    * @type {object}
    */
   const handlers = {
      dragDown: ['pointerdown', (e) => onDragPointerDown(e), false],
      dragMove: ['pointermove', (e) => onDragPointerChange(e), false],
      dragUp: ['pointerup', (e) => onDragPointerUp(e), false]
   };

   /**
    * Activates listeners.
    */
   function activateListeners()
   {
      // Drag handlers
      node.addEventListener(...handlers.dragDown);
      node.classList.add('draggable');
   }

   /**
    * Removes listeners.
    */
   function removeListeners()
   {
      if (typeof storeDragging?.set === 'function') { storeDragging.set(false); }

      // Drag handlers
      node.removeEventListener(...handlers.dragDown);
      node.removeEventListener(...handlers.dragMove);
      node.removeEventListener(...handlers.dragUp);
      node.classList.remove('draggable');
   }

   if (active)
   {
      activateListeners();
   }

   /**
    * Handle the initial pointer down that activates dragging behavior for the positionable.
    *
    * @param {PointerEvent} event - The pointer down event.
    */
   function onDragPointerDown(event)
   {
      if (event.button !== button || !event.isPrimary) { return; }

      event.preventDefault();

      dragging = false;

      // Record initial position.
      initialPosition = position.get();
      initialDragPoint = { x: event.clientX, y: event.clientY };

      // Add move and pointer up handlers.
      node.addEventListener(...handlers.dragMove);
      node.addEventListener(...handlers.dragUp);

      node.setPointerCapture(event.pointerId);
   }

   /**
    * Move the positionable.
    *
    * @param {PointerEvent} event - The pointer move event.
    */
   function onDragPointerChange(event)
   {
      // See chorded button presses for pointer events:
      // https://www.w3.org/TR/pointerevents3/#chorded-button-interactions
      // TODO: Support different button configurations for PointerEvents.
      if ((event.buttons & 1) === 0)
      {
         onDragPointerUp(event);
         return;
      }

      if (event.button !== -1 || !event.isPrimary) { return; }

      event.preventDefault();

      // Only set store dragging on first move event.
      if (!dragging && typeof storeDragging?.set === 'function')
      {
         dragging = true;
         storeDragging.set(true);
      }

      /** @type {number} */
      const newLeft = initialPosition.left + (event.clientX - initialDragPoint.x);
      /** @type {number} */
      const newTop = initialPosition.top + (event.clientY - initialDragPoint.y);

      if (ease)
      {
         quickTo(newTop, newLeft);
      }
      else
      {
         s_POSITION_DATA.left = newLeft;
         s_POSITION_DATA.top = newTop;

         position.set(s_POSITION_DATA);
      }
   }

   /**
    * Finish dragging and set the final position and removing listeners.
    *
    * @param {PointerEvent} event - The pointer up event.
    */
   function onDragPointerUp(event)
   {
      event.preventDefault();

      dragging = false;
      if (typeof storeDragging?.set === 'function') { storeDragging.set(false); }

      node.removeEventListener(...handlers.dragMove);
      node.removeEventListener(...handlers.dragUp);
   }

   return {
      // The default of active being true won't automatically add listeners twice.
      update: (options) =>
      {
         if (typeof options.active === 'boolean')
         {
            active = options.active;
            if (active) { activateListeners(); }
            else { removeListeners(); }
         }

         if (typeof options.button === 'number')
         {
            button = options.button;
         }

         if (options.position !== void 0 && options.position !== position)
         {
            position = options.position;
            quickTo = position.animate.quickTo(['top', 'left'], easeOptions);
         }

         if (typeof options.ease === 'boolean') { ease = options.ease; }

         if (typeof options.easeOptions === 'object')
         {
            easeOptions = options.easeOptions;
            quickTo.options(easeOptions);
         }
      },

      destroy: () => removeListeners()
   };
}

class DraggableOptions
{
   #ease = false;

   #easeOptions = { duration: 0.1, ease: cubicOut };

   /**
    * Stores the subscribers.
    *
    * @type {(function(DraggableOptions): void)[]}
    */
   #subscriptions = [];

   constructor({ ease, easeOptions } = {})
   {
      // Define the following getters directly on this instance and make them enumerable. This allows them to be
      // picked up w/ `Object.assign`.
      Object.defineProperty(this, 'ease', {
         get: () => { return this.#ease; },
         set: (newEase) =>
         {
            if (typeof newEase !== 'boolean') { throw new TypeError(`'ease' is not a boolean.`); }

            this.#ease = newEase;
            this.#updateSubscribers();
         },
         enumerable: true
      });

      Object.defineProperty(this, 'easeOptions', {
         get: () => { return this.#easeOptions; },
         set: (newEaseOptions) =>
         {
            if (newEaseOptions === null || typeof newEaseOptions !== 'object')
            {
               throw new TypeError(`'easeOptions' is not an object.`);
            }

            if (newEaseOptions.duration !== void 0)
            {
               if (!Number.isFinite(newEaseOptions.duration))
               {
                  throw new TypeError(`'easeOptions.duration' is not a finite number.`);
               }

               if (newEaseOptions.duration < 0) { throw new Error(`'easeOptions.duration' is less than 0.`); }

               this.#easeOptions.duration = newEaseOptions.duration;
            }

            if (newEaseOptions.ease !== void 0)
            {
               if (typeof newEaseOptions.ease !== 'function' && typeof newEaseOptions.ease !== 'string')
               {
                  throw new TypeError(`'easeOptions.ease' is not a function or string.`);
               }

               this.#easeOptions.ease = newEaseOptions.ease;
            }

            this.#updateSubscribers();
         },
         enumerable: true
      });

      // Set default options.
      if (ease !== void 0) { this.ease = ease; }
      if (easeOptions !== void 0) { this.easeOptions = easeOptions; }
   }


   /**
    * @returns {number} Get ease duration
    */
   get easeDuration() { return this.#easeOptions.duration; }

   /**
    * @returns {string|Function} Get easing function value.
    */
   get easeValue() { return this.#easeOptions.ease; }


   /**
    * @param {number}   duration - Set ease duration.
    */
   set easeDuration(duration)
   {
      if (!Number.isFinite(duration))
      {
         throw new TypeError(`'duration' is not a finite number.`);
      }

      if (duration < 0) { throw new Error(`'duration' is less than 0.`); }

      this.#easeOptions.duration = duration;
      this.#updateSubscribers();
   }

   /**
    * @param {string|Function} value - Get easing function value.
    */
   set easeValue(value)
   {
      if (typeof value !== 'function' && typeof value !== 'string')
      {
         throw new TypeError(`'value' is not a function or string.`);
      }

      this.#easeOptions.ease = value;
      this.#updateSubscribers();
   }

   /**
    * Resets all options data to default values.
    */
   reset()
   {
      this.#ease = false;
      this.#easeOptions = { duration: 0.1, ease: cubicOut };
      this.#updateSubscribers();
   }

   /**
    * Resets easing options to default values.
    */
   resetEase()
   {
      this.#easeOptions = { duration: 0.1, ease: cubicOut };
      this.#updateSubscribers();
   }

   /**
    *
    * @param {function(DraggableOptions): void} handler - Callback function that is invoked on update / changes.
    *                                                 Receives the DraggableOptions object / instance.
    *
    * @returns {(function(): void)} Unsubscribe function.
    */
   subscribe(handler)
   {
      this.#subscriptions.push(handler); // add handler to the array of subscribers

      handler(this);                     // call handler with current value

      // Return unsubscribe function.
      return () =>
      {
         const index = this.#subscriptions.findIndex((sub) => sub === handler);
         if (index >= 0) { this.#subscriptions.splice(index, 1); }
      };
   }

   #updateSubscribers()
   {
      const subscriptions = this.#subscriptions;

      // Early out if there are no subscribers.
      if (subscriptions.length > 0)
      {
         for (let cntr = 0; cntr < subscriptions.length; cntr++) { subscriptions[cntr](this); }
      }
   }
}

/**
 * Define a function to get a DraggableOptions instance.
 *
 * @returns {DraggableOptions} A new options instance.
 */
draggable.options = (options) => new DraggableOptions(options);

/**
 * Used for direct call to `position.set`.
 *
 * @type {{top: number, left: number}}
 */
const s_POSITION_DATA = { left: 0, top: 0 };

export { alwaysBlur, applyPosition, applyScrolltop, applyStyles, autoBlur, draggable, resizeObserver };
//# sourceMappingURL=index.js.map
