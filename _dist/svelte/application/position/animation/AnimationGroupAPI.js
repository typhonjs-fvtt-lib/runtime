import {
   isIterable,
   isObject }                    from '@typhonjs-fvtt/runtime/svelte/util';

import { AnimationManager }      from './AnimationManager.js';
import { AnimationAPI }          from './AnimationAPI.js';
import { AnimationGroupControl } from './AnimationGroupControl.js';

/**
 * Provides a public API for grouping multiple {@link Position} animations together with the AnimationManager.
 *
 * Note: To remove cyclic dependencies as this class provides the Position static / group Animation API `instanceof`
 * checks are not done against Position. Instead, a check for the animate property being an instanceof
 * {@link AnimationAPI} is performed in {@link AnimationGroupAPI.#isPosition}.
 *
 * @see AnimationAPI
 */
export class AnimationGroupAPI
{
   /**
    * Checks of the given object is a Position instance by checking for AnimationAPI.
    *
    * @param {*}  object - Any data.
    *
    * @returns {boolean} Is Position.
    */
   static #isPosition(object)
   {
      return object !== null && typeof object === 'object' && object.animate instanceof AnimationAPI;
   }

   /**
    * Cancels any animation for given Position data.
    *
    * @param {Position|{position: Position}|Iterable<Position>|Iterable<{position: Position}>} position -
    */
   static cancel(position)
   {
      if (isIterable(position))
      {
         let index = -1;

         for (const entry of position)
         {
            index++;

            const actualPosition = this.#isPosition(entry) ? entry : entry.position;

            if (!this.#isPosition(actualPosition))
            {
               console.warn(`AnimationGroupAPI.cancel warning: No Position instance found at index: ${index}.`);
               continue;
            }

            AnimationManager.cancel(actualPosition);
         }
      }
      else
      {
         const actualPosition = this.#isPosition(position) ? position : position.position;

         if (!this.#isPosition(actualPosition))
         {
            console.warn(`AnimationGroupAPI.cancel warning: No Position instance found.`);
            return;
         }

         AnimationManager.cancel(actualPosition);
      }
   }

   /**
    * Cancels all Position animation.
    */
   static cancelAll() { AnimationManager.cancelAll(); }

   /**
    * Gets all animation controls for the given position data.
    *
    * @param {Position|{position: Position}|Iterable<Position>|Iterable<{position: Position}>} position -
    *
    * @returns {{position: Position, data: object|void, controls: AnimationControl[]}[]} Results array.
    */
   static getScheduled(position)
   {
      const results = [];

      if (isIterable(position))
      {
         let index = -1;

         for (const entry of position)
         {
            index++;

            const isPosition = this.#isPosition(entry);
            const actualPosition = isPosition ? entry : entry.position;

            if (!this.#isPosition(actualPosition))
            {
               console.warn(`AnimationGroupAPI.getScheduled warning: No Position instance found at index: ${index}.`);
               continue;
            }

            const controls = AnimationManager.getScheduled(actualPosition);

            results.push({ position: actualPosition, data: isPosition ? void 0 : entry, controls });
         }
      }
      else
      {
         const isPosition = this.#isPosition(position);
         const actualPosition = isPosition ? position : position.position;

         if (!this.#isPosition(actualPosition))
         {
            console.warn(`AnimationGroupAPI.getScheduled warning: No Position instance found.`);
            return results;
         }

         const controls = AnimationManager.getScheduled(actualPosition);

         results.push({ position: actualPosition, data: isPosition ? void 0 : position, controls });
      }

      return results;
   }

   /**
    * Provides the `from` animation tween for one or more Position instances as a group.
    *
    * @param {Position|{position: Position}|Iterable<Position>|Iterable<{position: Position}>} position -
    *
    * @param {object|Function}   fromData -
    *
    * @param {object|Function}   options -
    *
    * @returns {TJSBasicAnimation} Basic animation control.
    */
   static from(position, fromData, options)
   {
      if (!isObject(fromData) && typeof fromData !== 'function')
      {
         throw new TypeError(`AnimationGroupAPI.from error: 'fromData' is not an object or function.`);
      }

      if (options !== void 0 && !isObject(options) && typeof options !== 'function')
      {
         throw new TypeError(`AnimationGroupAPI.from error: 'options' is not an object or function.`);
      }

      /**
       * @type {AnimationControl[]}
       */
      const animationControls = [];

      let index = -1;
      let callbackOptions;

      const hasDataCallback = typeof fromData === 'function';
      const hasOptionCallback = typeof options === 'function';
      const hasCallback = hasDataCallback || hasOptionCallback;

      if (hasCallback) { callbackOptions = { index, position: void 0, data: void 0 }; }

      let actualFromData = fromData;
      let actualOptions = options;

      if (isIterable(position))
      {
         for (const entry of position)
         {
            index++;

            const isPosition = this.#isPosition(entry);
            const actualPosition = isPosition ? entry : entry.position;

            if (!this.#isPosition(actualPosition))
            {
               console.warn(`AnimationGroupAPI.from warning: No Position instance found at index: ${index}.`);
               continue;
            }

            if (hasCallback)
            {
               callbackOptions.index = index;
               callbackOptions.position = position;
               callbackOptions.data = isPosition ? void 0 : entry;
            }

            if (hasDataCallback)
            {
               actualFromData = fromData(callbackOptions);

               // Returned data from callback is null / undefined, so skip this position instance.
               if (actualFromData === null || actualFromData === void 0) { continue; }

               if (typeof actualFromData !== 'object')
               {
                  throw new TypeError(`AnimationGroupAPI.from error: fromData callback function iteration(${
                   index}) failed to return an object.`);
               }
            }

            if (hasOptionCallback)
            {
               actualOptions = options(callbackOptions);

               // Returned data from callback is null / undefined, so skip this position instance.
               if (actualOptions === null || actualOptions === void 0) { continue; }

               if (typeof actualOptions !== 'object')
               {
                  throw new TypeError(`AnimationGroupAPI.from error: options callback function iteration(${
                   index}) failed to return an object.`);
               }
            }

            animationControls.push(actualPosition.animate.from(actualFromData, actualOptions));
         }
      }
      else
      {
         const isPosition = this.#isPosition(position);
         const actualPosition = isPosition ? position : position.position;

         if (!this.#isPosition(actualPosition))
         {
            console.warn(`AnimationGroupAPI.from warning: No Position instance found.`);
            return AnimationGroupControl.voidControl;
         }

         if (hasCallback)
         {
            callbackOptions.index = 0;
            callbackOptions.position = position;
            callbackOptions.data = isPosition ? void 0 : position;
         }

         if (hasDataCallback)
         {
            actualFromData = fromData(callbackOptions);

            if (typeof actualFromData !== 'object')
            {
               throw new TypeError(
                `AnimationGroupAPI.from error: fromData callback function failed to return an object.`);
            }
         }

         if (hasOptionCallback)
         {
            actualOptions = options(callbackOptions);

            if (typeof actualOptions !== 'object')
            {
               throw new TypeError(
                `AnimationGroupAPI.from error: options callback function failed to return an object.`);
            }
         }

         animationControls.push(actualPosition.animate.from(actualFromData, actualOptions));
      }

      return new AnimationGroupControl(animationControls);
   }

   /**
    * Provides the `fromTo` animation tween for one or more Position instances as a group.
    *
    * @param {Position|{position: Position}|Iterable<Position>|Iterable<{position: Position}>} position -
    *
    * @param {object|Function}   fromData -
    *
    * @param {object|Function}   toData -
    *
    * @param {object|Function}   options -
    *
    * @returns {TJSBasicAnimation} Basic animation control.
    */
   static fromTo(position, fromData, toData, options)
   {
      if (!isObject(fromData) && typeof fromData !== 'function')
      {
         throw new TypeError(`AnimationGroupAPI.fromTo error: 'fromData' is not an object or function.`);
      }

      if (!isObject(toData) && typeof toData !== 'function')
      {
         throw new TypeError(`AnimationGroupAPI.fromTo error: 'toData' is not an object or function.`);
      }

      if (options !== void 0 && !isObject(options) && typeof options !== 'function')
      {
         throw new TypeError(`AnimationGroupAPI.fromTo error: 'options' is not an object or function.`);
      }

      /**
       * @type {AnimationControl[]}
       */
      const animationControls = [];

      let index = -1;
      let callbackOptions;

      const hasFromCallback = typeof fromData === 'function';
      const hasToCallback = typeof toData === 'function';
      const hasOptionCallback = typeof options === 'function';
      const hasCallback = hasFromCallback || hasToCallback || hasOptionCallback;

      if (hasCallback) { callbackOptions = { index, position: void 0, data: void 0 }; }

      let actualFromData = fromData;
      let actualToData = toData;
      let actualOptions = options;

      if (isIterable(position))
      {
         for (const entry of position)
         {
            index++;

            const isPosition = this.#isPosition(entry);
            const actualPosition = isPosition ? entry : entry.position;

            if (!this.#isPosition(actualPosition))
            {
               console.warn(`AnimationGroupAPI.fromTo warning: No Position instance found at index: ${index}.`);
               continue;
            }

            if (hasCallback)
            {
               callbackOptions.index = index;
               callbackOptions.position = position;
               callbackOptions.data = isPosition ? void 0 : entry;
            }

            if (hasFromCallback)
            {
               actualFromData = fromData(callbackOptions);

               // Returned data from callback is null / undefined, so skip this position instance.
               if (actualFromData === null || actualFromData === void 0) { continue; }

               if (typeof actualFromData !== 'object')
               {
                  throw new TypeError(`AnimationGroupAPI.fromTo error: fromData callback function iteration(${
                   index}) failed to return an object.`);
               }
            }

            if (hasToCallback)
            {
               actualToData = toData(callbackOptions);

               // Returned data from callback is null / undefined, so skip this position instance.
               if (actualToData === null || actualToData === void 0) { continue; }

               if (typeof actualToData !== 'object')
               {
                  throw new TypeError(`AnimationGroupAPI.fromTo error: toData callback function iteration(${
                   index}) failed to return an object.`);
               }
            }

            if (hasOptionCallback)
            {
               actualOptions = options(callbackOptions);

               // Returned data from callback is null / undefined, so skip this position instance.
               if (actualOptions === null || actualOptions === void 0) { continue; }

               if (typeof actualOptions !== 'object')
               {
                  throw new TypeError(`AnimationGroupAPI.fromTo error: options callback function iteration(${
                   index}) failed to return an object.`);
               }
            }

            animationControls.push(actualPosition.animate.fromTo(actualFromData, actualToData, actualOptions));
         }
      }
      else
      {
         const isPosition = this.#isPosition(position);
         const actualPosition = isPosition ? position : position.position;

         if (!this.#isPosition(actualPosition))
         {
            console.warn(`AnimationGroupAPI.fromTo warning: No Position instance found.`);
            return AnimationGroupControl.voidControl;
         }

         if (hasCallback)
         {
            callbackOptions.index = 0;
            callbackOptions.position = position;
            callbackOptions.data = isPosition ? void 0 : position;
         }

         if (hasFromCallback)
         {
            actualFromData = fromData(callbackOptions);

            if (typeof actualFromData !== 'object')
            {
               throw new TypeError(
                `AnimationGroupAPI.fromTo error: fromData callback function failed to return an object.`);
            }
         }

         if (hasToCallback)
         {
            actualToData = toData(callbackOptions);

            if (typeof actualToData !== 'object')
            {
               throw new TypeError(
                `AnimationGroupAPI.fromTo error: toData callback function failed to return an object.`);
            }
         }

         if (hasOptionCallback)
         {
            actualOptions = options(callbackOptions);

            if (typeof actualOptions !== 'object')
            {
               throw new TypeError(
                `AnimationGroupAPI.fromTo error: options callback function failed to return an object.`);
            }
         }

         animationControls.push(actualPosition.animate.fromTo(actualFromData, actualToData, actualOptions));
      }

      return new AnimationGroupControl(animationControls);
   }

   /**
    * Provides the `to` animation tween for one or more Position instances as a group.
    *
    * @param {Position|{position: Position}|Iterable<Position>|Iterable<{position: Position}>} position -
    *
    * @param {object|Function}   toData -
    *
    * @param {object|Function}   options -
    *
    * @returns {TJSBasicAnimation} Basic animation control.
    */
   static to(position, toData, options)
   {
      if (!isObject(toData) && typeof toData !== 'function')
      {
         throw new TypeError(`AnimationGroupAPI.to error: 'toData' is not an object or function.`);
      }

      if (options !== void 0 && !isObject(options) && typeof options !== 'function')
      {
         throw new TypeError(`AnimationGroupAPI.to error: 'options' is not an object or function.`);
      }

      /**
       * @type {AnimationControl[]}
       */
      const animationControls = [];

      let index = -1;
      let callbackOptions;

      const hasDataCallback = typeof toData === 'function';
      const hasOptionCallback = typeof options === 'function';
      const hasCallback = hasDataCallback || hasOptionCallback;

      if (hasCallback) { callbackOptions = { index, position: void 0, data: void 0 }; }

      let actualToData = toData;
      let actualOptions = options;

      if (isIterable(position))
      {
         for (const entry of position)
         {
            index++;

            const isPosition = this.#isPosition(entry);
            const actualPosition = isPosition ? entry : entry.position;

            if (!this.#isPosition(actualPosition))
            {
               console.warn(`AnimationGroupAPI.to warning: No Position instance found at index: ${index}.`);
               continue;
            }

            if (hasCallback)
            {
               callbackOptions.index = index;
               callbackOptions.position = position;
               callbackOptions.data = isPosition ? void 0 : entry;
            }

            if (hasDataCallback)
            {
               actualToData = toData(callbackOptions);

               // Returned data from callback is null / undefined, so skip this position instance.
               if (actualToData === null || actualToData === void 0) { continue; }

               if (typeof actualToData !== 'object')
               {
                  throw new TypeError(`AnimationGroupAPI.to error: toData callback function iteration(${
                   index}) failed to return an object.`);
               }
            }

            if (hasOptionCallback)
            {
               actualOptions = options(callbackOptions);

               // Returned data from callback is null / undefined, so skip this position instance.
               if (actualOptions === null || actualOptions === void 0) { continue; }

               if (typeof actualOptions !== 'object')
               {
                  throw new TypeError(`AnimationGroupAPI.to error: options callback function iteration(${
                   index}) failed to return an object.`);
               }
            }

            animationControls.push(actualPosition.animate.to(actualToData, actualOptions));
         }
      }
      else
      {
         const isPosition = this.#isPosition(position);
         const actualPosition = isPosition ? position : position.position;

         if (!this.#isPosition(actualPosition))
         {
            console.warn(`AnimationGroupAPI.to warning: No Position instance found.`);
            return AnimationGroupControl.voidControl;
         }

         if (hasCallback)
         {
            callbackOptions.index = 0;
            callbackOptions.position = position;
            callbackOptions.data = isPosition ? void 0 : position;
         }

         if (hasDataCallback)
         {
            actualToData = toData(callbackOptions);

            if (typeof actualToData !== 'object')
            {
               throw new TypeError(
                `AnimationGroupAPI.to error: toData callback function failed to return an object.`);
            }
         }

         if (hasOptionCallback)
         {
            actualOptions = options(callbackOptions);

            if (typeof actualOptions !== 'object')
            {
               throw new TypeError(
                `AnimationGroupAPI.to error: options callback function failed to return an object.`);
            }
         }

         animationControls.push(actualPosition.animate.to(actualToData, actualOptions));
      }

      return new AnimationGroupControl(animationControls);
   }

   /**
    * Provides the `to` animation tween for one or more Position instances as a group.
    *
    * @param {Position|{position: Position}|Iterable<Position>|Iterable<{position: Position}>} position -
    *
    * @param {Iterable<string>}  keys -
    *
    * @param {object|Function}   options -
    *
    * @returns {quickToCallback} Basic animation control.
    */
   static quickTo(position, keys, options)
   {
      if (!isIterable(keys))
      {
         throw new TypeError(`AnimationGroupAPI.quickTo error: 'keys' is not an iterable list.`);
      }

      if (options !== void 0 && !isObject(options) && typeof options !== 'function')
      {
         throw new TypeError(`AnimationGroupAPI.quickTo error: 'options' is not an object or function.`);
      }

      /**
       * @type {quickToCallback[]}
       */
      const quickToCallbacks = [];

      let index = -1;

      const hasOptionCallback = typeof options === 'function';

      const callbackOptions = { index, position: void 0, data: void 0 };

      let actualOptions = options;

      if (isIterable(position))
      {
         for (const entry of position)
         {
            index++;

            const isPosition = this.#isPosition(entry);
            const actualPosition = isPosition ? entry : entry.position;

            if (!this.#isPosition(actualPosition))
            {
               console.warn(`AnimationGroupAPI.quickTo warning: No Position instance found at index: ${index}.`);
               continue;
            }

            callbackOptions.index = index;
            callbackOptions.position = position;
            callbackOptions.data = isPosition ? void 0 : entry;

            if (hasOptionCallback)
            {
               actualOptions = options(callbackOptions);

               // Returned data from callback is null / undefined, so skip this position instance.
               if (actualOptions === null || actualOptions === void 0) { continue; }

               if (typeof actualOptions !== 'object')
               {
                  throw new TypeError(`AnimationGroupAPI.quickTo error: options callback function iteration(${
                   index}) failed to return an object.`);
               }
            }

            quickToCallbacks.push(actualPosition.animate.quickTo(keys, actualOptions));
         }
      }
      else
      {
         const isPosition = this.#isPosition(position);
         const actualPosition = isPosition ? position : position.position;

         if (!this.#isPosition(actualPosition))
         {
            console.warn(`AnimationGroupAPI.quickTo warning: No Position instance found.`);
            return () => null;
         }

         callbackOptions.index = 0;
         callbackOptions.position = position;
         callbackOptions.data = isPosition ? void 0 : position;

         if (hasOptionCallback)
         {
            actualOptions = options(callbackOptions);

            if (typeof actualOptions !== 'object')
            {
               throw new TypeError(
                `AnimationGroupAPI.quickTo error: options callback function failed to return an object.`);
            }
         }

         quickToCallbacks.push(actualPosition.animate.quickTo(keys, actualOptions));
      }

      const keysArray = [...keys];

      Object.freeze(keysArray);

      const quickToCB = (...args) =>
      {
         const argsLength = args.length;

         if (argsLength === 0) { return; }

         if (typeof args[0] === 'function')
         {
            const dataCallback = args[0];

            index = -1;
            let cntr = 0;

            if (isIterable(position))
            {
               for (const entry of position)
               {
                  index++;

                  const isPosition = this.#isPosition(entry);
                  const actualPosition = isPosition ? entry : entry.position;

                  if (!this.#isPosition(actualPosition)) { continue; }

                  callbackOptions.index = index;
                  callbackOptions.position = position;
                  callbackOptions.data = isPosition ? void 0 : entry;

                  const toData = dataCallback(callbackOptions);

                  // Returned data from callback is null / undefined, so skip this position instance.
                  if (toData === null || toData === void 0) { continue; }

                  /**
                   * @type {boolean}
                   */
                  const toDataIterable = isIterable(toData);

                  if (!Number.isFinite(toData) && !toDataIterable && typeof toData !== 'object')
                  {
                     throw new TypeError(`AnimationGroupAPI.quickTo error: toData callback function iteration(${
                      index}) failed to return a finite number, iterable list, or object.`);
                  }

                  if (toDataIterable)
                  {
                     quickToCallbacks[cntr++](...toData);
                  }
                  else
                  {
                     quickToCallbacks[cntr++](toData);
                  }
               }
            }
            else
            {
               const isPosition = this.#isPosition(position);
               const actualPosition = isPosition ? position : position.position;

               if (!this.#isPosition(actualPosition)) { return; }

               callbackOptions.index = 0;
               callbackOptions.position = position;
               callbackOptions.data = isPosition ? void 0 : position;

               const toData = dataCallback(callbackOptions);

               // Returned data from callback is null / undefined, so skip this position instance.
               if (toData === null || toData === void 0) { return; }

               const toDataIterable = isIterable(toData);

               if (!Number.isFinite(toData) && !toDataIterable && typeof toData !== 'object')
               {
                  throw new TypeError(`AnimationGroupAPI.quickTo error: toData callback function iteration(${
                   index}) failed to return a finite number, iterable list, or object.`);
               }

               if (toDataIterable)
               {
                  quickToCallbacks[cntr++](...toData);
               }
               else
               {
                  quickToCallbacks[cntr++](toData);
               }
            }
         }
         else
         {
            for (let cntr = quickToCallbacks.length; --cntr >= 0;)
            {
               quickToCallbacks[cntr](...args);
            }
         }
      };

      quickToCB.keys = keysArray;

      /**
       * Sets options of quickTo tween.
       *
       * @param {object|Function}   [options] - Optional parameters.
       *
       * @param {number}            [options.duration] - Duration in seconds.
       *
       * @param {Function}          [options.ease] - Easing function.
       *
       * @param {Function}          [options.interpolate] - Interpolation function.
       *
       * @returns {quickToCallback} The quickTo callback.
       */
      quickToCB.options = (options) => // eslint-disable-line no-shadow
      {
         if (options !== void 0 && !isObject(options) && typeof options !== 'function')
         {
            throw new TypeError(`AnimationGroupAPI.quickTo error: 'options' is not an object or function.`);
         }

         // Set options object for each quickTo callback.
         if (isObject(options))
         {
            for (let cntr = quickToCallbacks.length; --cntr >= 0;) { quickToCallbacks[cntr].options(options); }
         }
         else if (typeof options === 'function')
         {
            if (isIterable(position))
            {
               index = -1;
               let cntr = 0;

               for (const entry of position)
               {
                  index++;

                  const isPosition = this.#isPosition(entry);
                  const actualPosition = isPosition ? entry : entry.position;

                  if (!this.#isPosition(actualPosition))
                  {
                     console.warn(
                      `AnimationGroupAPI.quickTo.options warning: No Position instance found at index: ${index}.`);
                     continue;
                  }

                  callbackOptions.index = index;
                  callbackOptions.position = position;
                  callbackOptions.data = isPosition ? void 0 : entry;

                  actualOptions = options(callbackOptions);

                  // Returned data from callback is null / undefined, so skip this position instance.
                  if (actualOptions === null || actualOptions === void 0) { continue; }

                  if (typeof actualOptions !== 'object')
                  {
                     throw new TypeError(
                      `AnimationGroupAPI.quickTo.options error: options callback function iteration(${
                       index}) failed to return an object.`);
                  }

                  quickToCallbacks[cntr++].options(actualOptions);
               }
            }
            else
            {
               const isPosition = this.#isPosition(position);
               const actualPosition = isPosition ? position : position.position;

               if (!this.#isPosition(actualPosition))
               {
                  console.warn(`AnimationGroupAPI.quickTo.options warning: No Position instance found.`);
                  return quickToCB;
               }

               callbackOptions.index = 0;
               callbackOptions.position = position;
               callbackOptions.data = isPosition ? void 0 : position;

               actualOptions = options(callbackOptions);

               if (typeof actualOptions !== 'object')
               {
                  throw new TypeError(
                   `AnimationGroupAPI.quickTo error: options callback function failed to return an object.`);
               }

               quickToCallbacks[0].options(actualOptions);
            }
         }

         return quickToCB;
      };

      return quickToCB;
   }
}
