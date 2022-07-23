import { cubicOut }           from 'svelte/easing';

import { lerp }               from '@typhonjs-fvtt/runtime/svelte/math';
import {
   isIterable,
   isObject }                 from '@typhonjs-fvtt/runtime/svelte/util';

import { AnimationControl }   from './AnimationControl.js';
import { AnimationManager }   from './AnimationManager.js';

import { convertRelative }    from '../convertRelative.js';

import {
   animateKeys,
   setNumericDefaults }       from '../constants.js';

export class AnimationAPI
{
   /** @type {PositionData} */
   #data;

   /** @type {Position} */
   #position;

   /**
    * Tracks the number of animation control instances that are active.
    *
    * @type {number}
    */
   #instanceCount = 0;

   /**
    * Provides a bound function to pass as data to AnimationManager to invoke
    *
    * @type {Function}
    * @see {AnimationAPI.#cleanupInstance}
    */
   #cleanup;

   constructor(position, data)
   {
      this.#position = position;
      this.#data = data;

      this.#cleanup = this.#cleanupInstance.bind(this);
   }

   /**
    * Returns whether there are scheduled animations whether active or delayed for this Position.
    *
    * @returns {boolean} Are there active animation instances.
    */
   get isScheduled()
   {
      return this.#instanceCount > 0;
   }

   /**
    * Adds / schedules an animation w/ the AnimationManager. This contains the final steps common to all tweens.
    *
    * @param {object}      initial -
    *
    * @param {object}      destination -
    *
    * @param {number}      duration -
    *
    * @param {HTMLElement} el -
    *
    * @param {number}      delay -
    *
    * @param {Function}    ease -
    *
    * @param {Function}    interpolate -
    *
    * @returns {AnimationControl} The associated animation control.
    */
   #addAnimation(initial, destination, duration, el, delay, ease, interpolate)
   {
      // Set initial data for transform values that are often null by default.
      setNumericDefaults(initial);
      setNumericDefaults(destination);

      // Reject all initial data that is not a number.
      for (const key in initial)
      {
         if (!Number.isFinite(initial[key])) { delete initial[key]; }
      }

      const keys = Object.keys(initial);
      const newData = Object.assign({ immediateElementUpdate: true }, initial);

      // Nothing to animate, so return now.
      if (keys.length === 0) { return AnimationControl.voidControl; }

      const animationData = {
         active: true,
         cleanup: this.#cleanup,
         cancelled: false,
         control: void 0,
         current: 0,
         destination,
         duration: duration * 1000, // Internally the AnimationManager works in ms.
         ease,
         el,
         finished: false,
         initial,
         interpolate,
         keys,
         newData,
         position: this.#position,
         resolve: void 0,
         start: void 0
      };

      if (delay > 0)
      {
         animationData.active = false;

         // Delay w/ setTimeout and schedule w/ AnimationManager if not already canceled
         setTimeout(() =>
         {
            if (!animationData.cancelled)
            {
               animationData.active = true;

               const now = performance.now();

               // Offset start time by delta between last rAF time. This allows a delayed tween to start from the
               // precise delayed time.
               animationData.start = now + (AnimationManager.current - now);
            }
         }, delay * 1000);
      }

      // Schedule immediately w/ AnimationManager
      this.#instanceCount++;
      AnimationManager.add(animationData);

      // Create animation control
      return new AnimationControl(animationData, true);
   }

   /**
    * Cancels all animation instances for this Position instance.
    */
   cancel()
   {
      AnimationManager.cancel(this.#position);
   }

   /**
    * Cleans up an animation instance.
    *
    * @param {object}   data - Animation data for an animation instance.
    */
   #cleanupInstance(data)
   {
      this.#instanceCount--;

      data.active = false;
      data.finished = true;

      if (typeof data.resolve === 'function') { data.resolve(data.cancelled); }
   }

   /**
    * Returns all currently scheduled AnimationControl instances for this Position instance.
    *
    * @returns {AnimationControl[]} All currently scheduled animation controls for this Position instance.
    */
   getScheduled()
   {
      return AnimationManager.getScheduled(this.#position);
   }

   /**
    * Provides a tween from given position data to the current position.
    *
    * @param {PositionDataExtended} fromData - The starting position.
    *
    * @param {object}         [opts] - Optional parameters.
    *
    * @param {number}         [opts.delay=0] - Delay in seconds before animation starts.
    *
    * @param {number}         [opts.duration=1] - Duration in seconds.
    *
    * @param {Function}       [opts.ease=cubicOut] - Easing function.
    *
    * @param {Function}       [opts.interpolate=lerp] - Interpolation function.
    *
    * @returns {AnimationControl}  A control object that can cancel animation and provides a `finished` Promise.
    */
   from(fromData, { delay = 0, duration = 1, ease = cubicOut, interpolate = lerp } = {})
   {
      if (!isObject(fromData))
      {
         throw new TypeError(`AnimationAPI.from error: 'fromData' is not an object.`);
      }

      const position = this.#position;
      const parent = position.parent;

      // Early out if the application is not positionable.
      if (parent !== void 0 && typeof parent?.options?.positionable === 'boolean' && !parent?.options?.positionable)
      {
         return AnimationControl.voidControl;
      }

      // Cache any target element allowing AnimationManager to stop animation if it becomes disconnected from DOM.
      const targetEl = parent instanceof HTMLElement ? parent : parent?.elementTarget;
      const el = targetEl instanceof HTMLElement && targetEl.isConnected ? targetEl : void 0;

      if (!Number.isFinite(delay) || delay < 0)
      {
         throw new TypeError(`AnimationAPI.from error: 'delay' is not a positive number.`);
      }

      if (!Number.isFinite(duration) || duration < 0)
      {
         throw new TypeError(`AnimationAPI.from error: 'duration' is not a positive number.`);
      }

      if (typeof ease !== 'function')
      {
         throw new TypeError(`AnimationAPI.from error: 'ease' is not a function.`);
      }

      if (typeof interpolate !== 'function')
      {
         throw new TypeError(`AnimationAPI.from error: 'interpolate' is not a function.`);
      }

      const initial = {};
      const destination = {};

      const data = this.#data;

      // Set initial data if the key / data is defined and the end position is not equal to current data.
      for (const key in fromData)
      {
         if (data[key] !== void 0 && fromData[key] !== data[key])
         {
            initial[key] = fromData[key];
            destination[key] = data[key];
         }
      }

      convertRelative(initial, data);

      return this.#addAnimation(initial, destination, duration, el, delay, ease, interpolate);
   }

   /**
    * Provides a tween from given position data to the current position.
    *
    * @param {PositionDataExtended} fromData - The starting position.
    *
    * @param {PositionDataExtended} toData - The ending position.
    *
    * @param {object}         [opts] - Optional parameters.
    *
    * @param {number}         [opts.delay=0] - Delay in seconds before animation starts.
    *
    * @param {number}         [opts.duration=1] - Duration in seconds.
    *
    * @param {Function}       [opts.ease=cubicOut] - Easing function.
    *
    * @param {Function}       [opts.interpolate=lerp] - Interpolation function.
    *
    * @returns {AnimationControl}  A control object that can cancel animation and provides a `finished` Promise.
    */
   fromTo(fromData, toData, { delay = 0, duration = 1, ease = cubicOut, interpolate = lerp } = {})
   {
      if (!isObject(fromData))
      {
         throw new TypeError(`AnimationAPI.fromTo error: 'fromData' is not an object.`);
      }

      if (!isObject(toData))
      {
         throw new TypeError(`AnimationAPI.fromTo error: 'toData' is not an object.`);
      }

      const parent = this.#position.parent;

      // Early out if the application is not positionable.
      if (parent !== void 0 && typeof parent?.options?.positionable === 'boolean' && !parent?.options?.positionable)
      {
         return AnimationControl.voidControl;
      }

      // Cache any target element allowing AnimationManager to stop animation if it becomes disconnected from DOM.
      const targetEl = parent instanceof HTMLElement ? parent : parent?.elementTarget;
      const el = targetEl instanceof HTMLElement && targetEl.isConnected ? targetEl : void 0;

      if (!Number.isFinite(delay) || delay < 0)
      {
         throw new TypeError(`AnimationAPI.fromTo error: 'delay' is not a positive number.`);
      }

      if (!Number.isFinite(duration) || duration < 0)
      {
         throw new TypeError(`AnimationAPI.fromTo error: 'duration' is not a positive number.`);
      }

      if (typeof ease !== 'function')
      {
         throw new TypeError(`AnimationAPI.fromTo error: 'ease' is not a function.`);
      }

      if (typeof interpolate !== 'function')
      {
         throw new TypeError(`AnimationAPI.fromTo error: 'interpolate' is not a function.`);
      }

      const initial = {};
      const destination = {};

      const data = this.#data;

      // Set initial data if the key / data is defined and the end position is not equal to current data.
      for (const key in fromData)
      {
         if (toData[key] === void 0)
         {
            console.warn(
             `AnimationAPI.fromTo warning: key ('${key}') from 'fromData' missing in 'toData'; skipping this key.`);
            continue;
         }

         if (data[key] !== void 0)
         {
            initial[key] = fromData[key];
            destination[key] = toData[key];
         }
      }

      convertRelative(initial, data);
      convertRelative(destination, data);

      return this.#addAnimation(initial, destination, duration, el, delay, ease, interpolate);
   }

   /**
    * Provides a tween to given position data from the current position.
    *
    * @param {PositionDataExtended} toData - The destination position.
    *
    * @param {object}         [opts] - Optional parameters.
    *
    * @param {number}         [opts.delay=0] - Delay in seconds before animation starts.
    *
    * @param {number}         [opts.duration=1] - Duration in seconds.
    *
    * @param {Function}       [opts.ease=cubicOut] - Easing function.
    *
    * @param {Function}       [opts.interpolate=lerp] - Interpolation function.
    *
    * @returns {AnimationControl}  A control object that can cancel animation and provides a `finished` Promise.
    */
   to(toData, { delay = 0, duration = 1, ease = cubicOut, interpolate = lerp } = {})
   {
      if (!isObject(toData))
      {
         throw new TypeError(`AnimationAPI.to error: 'toData' is not an object.`);
      }

      const parent = this.#position.parent;

      // Early out if the application is not positionable.
      if (parent !== void 0 && typeof parent?.options?.positionable === 'boolean' && !parent?.options?.positionable)
      {
         return AnimationControl.voidControl;
      }

      // Cache any target element allowing AnimationManager to stop animation if it becomes disconnected from DOM.
      const targetEl = parent instanceof HTMLElement ? parent : parent?.elementTarget;
      const el = targetEl instanceof HTMLElement && targetEl.isConnected ? targetEl : void 0;

      if (!Number.isFinite(delay) || delay < 0)
      {
         throw new TypeError(`AnimationAPI.to error: 'delay' is not a positive number.`);
      }

      if (!Number.isFinite(duration) || duration < 0)
      {
         throw new TypeError(`AnimationAPI.to error: 'duration' is not a positive number.`);
      }

      if (typeof ease !== 'function')
      {
         throw new TypeError(`AnimationAPI.to error: 'ease' is not a function.`);
      }

      if (typeof interpolate !== 'function')
      {
         throw new TypeError(`AnimationAPI.to error: 'interpolate' is not a function.`);
      }

      const initial = {};
      const destination = {};

      const data = this.#data;

      // Set initial data if the key / data is defined and the end position is not equal to current data.
      for (const key in toData)
      {
         if (data[key] !== void 0 && toData[key] !== data[key])
         {
            destination[key] = toData[key];
            initial[key] = data[key];
         }
      }

      convertRelative(destination, data);

      return this.#addAnimation(initial, destination, duration, el, delay, ease, interpolate);
   }

   /**
    * Returns a function that provides an optimized way to constantly update a to-tween.
    *
    * @param {Iterable<string>}  keys - The keys for quickTo.
    *
    * @param {object}            [opts] - Optional parameters.
    *
    * @param {number}            [opts.duration=1] - Duration in seconds.
    *
    * @param {Function}          [opts.ease=cubicOut] - Easing function.
    *
    * @param {Function}          [opts.interpolate=lerp] - Interpolation function.
    *
    * @returns {quickToCallback} quick-to tween function.
    */
   quickTo(keys, { duration = 1, ease = cubicOut, interpolate = lerp } = {})
   {
      if (!isIterable(keys))
      {
         throw new TypeError(`AnimationAPI.quickTo error: 'keys' is not an iterable list.`);
      }

      const parent = this.#position.parent;

      // Early out if the application is not positionable.
      if (parent !== void 0 && typeof parent?.options?.positionable === 'boolean' && !parent?.options?.positionable)
      {
         throw new Error(`AnimationAPI.quickTo error: 'parent' is not positionable.`);
      }

      if (!Number.isFinite(duration) || duration < 0)
      {
         throw new TypeError(`AnimationAPI.quickTo error: 'duration' is not a positive number.`);
      }

      if (typeof ease !== 'function')
      {
         throw new TypeError(`AnimationAPI.quickTo error: 'ease' is not a function.`);
      }

      if (typeof interpolate !== 'function')
      {
         throw new TypeError(`AnimationAPI.quickTo error: 'interpolate' is not a function.`);
      }

      const initial = {};
      const destination = {};

      const data = this.#data;

      // Set initial data if the key / data is defined and the end position is not equal to current data.
      for (const key of keys)
      {
         if (typeof key !== 'string')
         {
            throw new TypeError(`AnimationAPI.quickTo error: key is not a string.`);
         }

         if (!animateKeys.has(key))
         {
            throw new Error(`AnimationAPI.quickTo error: key ('${key}') is not animatable.`);
         }

         if (data[key] !== void 0)
         {
            destination[key] = data[key];
            initial[key] = data[key];
         }
      }

      const keysArray = [...keys];

      Object.freeze(keysArray);

      const newData = Object.assign({ immediateElementUpdate: true }, initial);

      const animationData = {
         active: true,
         cleanup: this.#cleanup,
         cancelled: false,
         control: void 0,
         current: 0,
         destination,
         duration: duration * 1000, // Internally the AnimationManager works in ms.
         ease,
         el: void 0,
         finished: true, // Note: start in finished state to add to AnimationManager on first callback.
         initial,
         interpolate,
         keys,
         newData,
         position: this.#position,
         resolve: void 0,
         start: void 0
      };

      const quickToCB = (...args) =>
      {
         const argsLength = args.length;

         if (argsLength === 0) { return; }

         for (let cntr = keysArray.length; --cntr >= 0;)
         {
            const key = keysArray[cntr];
            if (data[key] !== void 0) { initial[key] = data[key]; }
         }

         // Handle case where the first arg is an object. Update all quickTo keys from data contained in the object.
         if (isObject(args[0]))
         {
            const objData = args[0];

            for (const key in objData)
            {
               if (destination[key] !== void 0) { destination[key] = objData[key]; }
            }
         }
         else // Assign each variable argument to the key specified in the initial `keys` array above.
         {
            for (let cntr = 0; cntr < argsLength && cntr < keysArray.length; cntr++)
            {
               const key = keysArray[cntr];
               if (destination[key] !== void 0) { destination[key] = args[cntr]; }
            }
         }

         convertRelative(destination, data);

         // Set initial data for transform values that are often null by default.
         setNumericDefaults(initial);
         setNumericDefaults(destination);

         // Set target element to animation data to track if it is removed from the DOM hence ending the animation.
         const targetEl = parent instanceof HTMLElement ? parent : parent?.elementTarget;
         animationData.el = targetEl instanceof HTMLElement && targetEl.isConnected ? targetEl : void 0;

         // Reschedule the quickTo animation with AnimationManager as it is finished.
         if (animationData.finished)
         {
            animationData.finished = false;
            animationData.active = true;
            animationData.current = 0;

            this.#instanceCount++;
            AnimationManager.add(animationData);
         }
         else // QuickTo animation is currently scheduled w/ AnimationManager so reset start and current time.
         {
            const now = performance.now();

            // Offset start time by delta between last rAF time. This allows a delayed tween to start from the
            // precise delayed time.
            animationData.start = now + (AnimationManager.current - now);
            animationData.current = 0;
         }
      };

      quickToCB.keys = keysArray;

      /**
       * Sets options of quickTo tween.
       *
       * @param {object}            [opts] - Optional parameters.
       *
       * @param {number}            [opts.duration] - Duration in seconds.
       *
       * @param {Function}          [opts.ease] - Easing function.
       *
       * @param {Function}          [opts.interpolate] - Interpolation function.
       *
       * @returns {quickToCallback} The quickTo callback.
       */
      quickToCB.options = ({ duration, ease, interpolate } = {}) => // eslint-disable-line no-shadow
      {
         if (duration !== void 0 && (!Number.isFinite(duration) || duration < 0))
         {
            throw new TypeError(`AnimationAPI.quickTo.options error: 'duration' is not a positive number.`);
         }

         if (ease !== void 0 && typeof ease !== 'function')
         {
            throw new TypeError(`AnimationAPI.quickTo.options error: 'ease' is not a function.`);
         }

         if (interpolate !== void 0 && typeof interpolate !== 'function')
         {
            throw new TypeError(`AnimationAPI.quickTo.options error: 'interpolate' is not a function.`);
         }

         if (duration >= 0) { animationData.duration = duration * 1000; }
         if (ease) { animationData.ease = ease; }
         if (interpolate) { animationData.interpolate = interpolate; }

         return quickToCB;
      };

      return quickToCB;
   }
}

/**
 * @callback quickToCallback
 *
 * @param {...number|object} args - Either individual numbers corresponding to the order in which keys are specified or
 *                                  a single object with keys specified and numerical values.
 *
 * @property {({duration?: number, ease?: Function, interpolate?: Function}) => quickToCallback} options - A function
 *                                  to update options for quickTo function.
 */
