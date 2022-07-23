import * as svelteEasingFunc from 'svelte/easing';
import { TJSVelocityTrack } from '@typhonjs-fvtt/runtime/svelte/math';
import { Position } from '@typhonjs-fvtt/runtime/svelte/application';
import { isPlainObject, isIterable } from '@typhonjs-fvtt/runtime/svelte/util';

let gsap = void 0;

/**
 * Note usage of `globalThis.location.origin` as this is the origin of the importing location which is necessary for
 * connecting to the Foundry server when the package is located on a CDN.
 *
 * @type {string}
 */
const modulePath = `${globalThis.location.origin}${foundry.utils.getRoute(`/scripts/greensock/esm/index.js`)}`;

// Basic core GSAP eases.
const easingList = [
   'back.in(1)',
   'back.inOut(1)',
   'back.out(1)',
   'back.in(10)',
   'back.inOut(10)',
   'back.out(10)',
   'bounce.in',
   'bounce.inOut',
   'bounce.out',
   'circ.in',
   'circ.inOut',
   'circ.out',
   'elastic.in(1, 0.5)',
   'elastic.inOut(1, 0.5)',
   'elastic.out(1, 0.5)',
   'elastic.in(10, 5)',
   'elastic.inOut(10, 5)',
   'elastic.out(10, 5)',
   'expo.in',
   'expo.inOut',
   'expo.out',
   'linear', // same as 'none'
   'power1.in',
   'power1.inOut',
   'power1.out',
   'power2.in',
   'power2.inOut',
   'power2.out',
   'power3.in',
   'power3.inOut',
   'power3.out',
   'power4.in',
   'power4.inOut',
   'power4.out',
   'sine.in',
   'sine.inOut',
   'sine.out',
   'steps(10)',
   'steps(100)'
];

const easingFunc = {};

try
{
   const module = await import(/* @vite-ignore */modulePath);
   gsap = module.gsap;

   for (const entry of easingList)
   {
      easingFunc[entry] = entry === 'linear' ? (t) => t : gsap.parseEase(entry);
   }

   // Load Svelte easing functions by prepending them w/ `svelte-`; `linear` becomes `svelte-linear`, etc.
   for (const prop of Object.keys(svelteEasingFunc))
   {
      const name = `svelte-${prop}`;
      easingList.push(name);
      easingFunc[name] = svelteEasingFunc[prop];
      gsap.registerEase(name, svelteEasingFunc[prop]);
   }
}
catch (error)
{
   console.error(`TyphonJS Runtime Library error; Could not load GSAP module from: '${modulePath}'`);
   console.error(error);
}

easingList.sort();

Object.freeze(easingFunc);
Object.freeze(easingList);

/**
 * Internal helper class for timeline implementation. Performs error checking before applying any timeline actions.
 */
class TimelineImpl
{
   static add(timeline, entry, cntr)
   {
      const child = entry.child;
      const position = entry.position;

      if (child === void 0)
      {
         throw new TypeError(`GsapCompose.timeline error: gsapData[${cntr}] missing 'child' property.`);
      }

      if (position !== void 0 && !Number.isFinite(position) && typeof position !== 'string')
      {
         throw new TypeError(`GsapCompose.timeline error: gsapData[${cntr}] 'position' is not a number or string.`);
      }

      timeline.add(child, position);
   }

   static addLabel(timeline, entry, cntr)
   {
      const label = entry.label;
      const position = entry.position;

      if (typeof label !== 'string')
      {
         throw new TypeError(`GsapCompose.timeline error: gsapData[${cntr}] 'label' is not a string.`);
      }

      if (position !== void 0 && !Number.isFinite(position) && typeof position !== 'string')
      {
         throw new TypeError(`GsapCompose.timeline error: gsapData[${cntr}] 'position' is not a number or string.`);
      }

      timeline.addLabel(label, position);
   }

   static addPause(timeline, entry, cntr)
   {
      const position = entry.position;
      const callback = entry.callback;
      const params = entry.params;

      if (position !== void 0 && !Number.isFinite(position) && typeof position !== 'string')
      {
         throw new TypeError(`GsapCompose.timeline error: gsapData[${cntr}] 'position' is not a number or string.`);
      }

      if (callback !== void 0 && typeof callback !== 'function')
      {
         throw new TypeError(`GsapCompose.timeline error: gsapData[${cntr}] 'callback' is not a function.`);
      }

      if (params !== void 0 && !Array.isArray(params))
      {
         throw new TypeError(`GsapCompose.timeline error: gsapData[${cntr}] 'params' is not an array.`);
      }

      timeline.addPause(position, callback, params);
   }

   static call(timeline, entry, cntr)
   {
      const callback = entry.callback;
      const params = entry.params;
      const position = entry.position;

      if (typeof callback !== 'function')
      {
         throw new TypeError(`GsapCompose.timeline error: gsapData[${cntr}] 'callback' is not a function.`);
      }

      if (params !== void 0 && !Array.isArray(params))
      {
         throw new TypeError(`GsapCompose.timeline error: gsapData[${cntr}] 'params' is not an array.`);
      }

      if (position !== void 0 && !Number.isFinite(position) && typeof position !== 'string')
      {
         throw new TypeError(`GsapCompose.timeline error: gsapData[${cntr}] 'position' is not a number or string.`);
      }

      timeline.call(callback, params, position);
   }
}

/**
 * Stores the entry types that potentially use the generated initial position data.
 *
 * @type {Set<string>}
 */
const s_TYPES_POSITION = new Set(['from', 'fromTo', 'set', 'to']);

/**
 * Stores the Position properties in order to create the minimum update data object when animating.
 *
 * @type {Set<string>}
 */
const s_POSITION_KEYS = new Set([
 // Main keys
 'left', 'top', 'maxWidth', 'maxHeight', 'minWidth', 'minHeight', 'width', 'height',
  'rotateX', 'rotateY', 'rotateZ', 'scale', 'translateX', 'translateY', 'translateZ', 'zIndex',

 // Aliases
 'rotation'
]);

/**
 * Stores the seen Position properties when building the minimum update data object when animating.
 *
 * @type {Set<string>}
 */
const s_POSITION_PROPS = new Set();

/**
 * Defines the options for {@link Position.get}.
 *
 * @type {{keys: Set<string>, numeric: boolean}}
 */
const s_POSITION_GET_OPTIONS = {
   keys: s_POSITION_PROPS,
   numeric: true
};

/**
 * Provides a data driven ways to connect a {@link Position} instance with a GSAP timeline and tweens.
 *
 * {@link GsapPosition.timeline} supports the following types: 'add', 'addLabel', 'addPause', 'call', 'from',
 * 'fromTo', 'set', 'to'.
 */
class GsapPosition
{
   /**
    * @param {Position} tjsPosition - Position instance.
    *
    * @param {GsapPositionOptions} [options] - Options for filtering and initial data population.
    *
    * @param {object}   vars - GSAP vars object for `from`.
    *
    * @returns {object} GSAP tween
    */
   static from(tjsPosition, options, vars)
   {
      if (options !== void 0 && typeof options !== 'object')
      {
         throw new TypeError(`GsapCompose.from error: 'options' is not an object.`);
      }

      const filter = options?.filter;
      const initialProps = options?.initialProps;

      // Only retrieve the Position keys that are in vars.
      s_POSITION_PROPS.clear();

      // Add any initial props if defined.
      if (isIterable(initialProps))
      {
         for (const prop of initialProps) { s_POSITION_PROPS.add(prop); }
      }

      for (const prop in vars)
      {
         if (s_POSITION_KEYS.has(prop)) { s_POSITION_PROPS.add(prop); }
      }

      const positionData = s_GET_POSITIONINFO(tjsPosition, vars, filter).positionData;

      return gsap.from(positionData, vars);
   }

   /**
    * @param {Position} tjsPosition - Position instance.
    *
    * @param {GsapPositionOptions} [options] - Options for filtering and initial data population.
    *
    * @param {object}   fromVars - GSAP fromVars object for `fromTo`
    *
    * @param {object}   toVars - GSAP toVars object for `fromTo`.
    *
    * @returns {object} GSAP tween
    */
   static fromTo(tjsPosition, options, fromVars, toVars)
   {
      if (options !== void 0 && typeof options !== 'object')
      {
         throw new TypeError(`GsapCompose.from error: 'options' is not an object.`);
      }

      const filter = options?.filter;
      const initialProps = options?.initialProps;

      // Only retrieve the Position keys that are in vars.
      s_POSITION_PROPS.clear();

      // Add any initial props if defined.
      if (isIterable(initialProps))
      {
         for (const prop of initialProps) { s_POSITION_PROPS.add(prop); }
      }

      for (const prop in fromVars)
      {
         if (s_POSITION_KEYS.has(prop)) { s_POSITION_PROPS.add(prop); }
      }

      for (const prop in toVars)
      {
         if (s_POSITION_KEYS.has(prop)) { s_POSITION_PROPS.add(prop); }
      }

      const positionData = s_GET_POSITIONINFO(tjsPosition, toVars, filter).positionData;

      return gsap.fromTo(positionData, fromVars, toVars);
   }

   /**
    * @param {Position} tjsPosition - Position instance.
    *
    * @param {GsapPositionOptions} [options] - Options for filtering and initial data population.
    *
    * @param {string}   key - Property of position to manipulate.
    *
    * @param {object}   vars - GSAP vars object for `quickTo`.
    *
    * @returns {Function}  GSAP quickTo function.
    */
   static quickTo(tjsPosition, options, key, vars)
   {
      if (options !== void 0 && typeof options !== 'object')
      {
         throw new TypeError(`GsapCompose.from error: 'options' is not an object.`);
      }

      const filter = options?.filter;
      const initialProps = options?.initialProps;

      // Only retrieve the Position keys that are in vars.
      s_POSITION_PROPS.clear();

      // Add any initial props if defined.
      if (isIterable(initialProps))
      {
         for (const prop of initialProps) { s_POSITION_PROPS.add(prop); }
      }

      // Add specific key specified to initial `positionData`.
      if (s_POSITION_KEYS.has(key)) { s_POSITION_PROPS.add(key); }

      const positionData = s_GET_POSITIONINFO(tjsPosition, vars, filter).positionData;

      return gsap.quickTo(positionData, key, vars);
   }

   /**
    * @param {Position|Iterable<Position>}   tjsPosition - Position instance.
    *
    * @param {object|GsapData}               arg1 - Either an object defining timelineOptions or GsapData.
    *
    * @param {GsapData|GsapPositionOptions}  [arg2] - When arg1 is defined as an object; arg2 defines GsapData.
    *
    * @param {GsapPositionOptions}           [arg3] - Options for filtering and initial data population.
    *
    * @returns {object} GSAP timeline
    */
   static timeline(tjsPosition, arg1, arg2, arg3)
   {
      // Load the variable arguments from arg1 / arg2.
      // If arg1 is an object then take it as the timelineOptions.
      const timelineOptions = typeof arg1 === 'object' ? arg1 : {};

      // If arg1 is an array then take it as `gsapData` otherwise select arg2.
      const gsapData = isIterable(arg1) || typeof arg1 === 'function' ? arg1 : arg2;

      /** @type {GsapPositionOptions} */
      const options = gsapData === arg1 ? arg2 : arg3;

      if (typeof timelineOptions !== 'object')
      {
         throw new TypeError(`GsapCompose.timeline error: 'timelineOptions' is not an object.`);
      }

      if (!isIterable(gsapData) && typeof gsapData !== 'function')
      {
         throw new TypeError(`GsapCompose.timeline error: 'gsapData' is not an iterable list or function.`);
      }

      if (options !== void 0 && typeof options !== 'object')
      {
         throw new TypeError(`GsapCompose.from error: 'options' is not an object.`);
      }

      const filter = options?.filter;
      const initialProps = options?.initialProps;

      s_POSITION_PROPS.clear();

      // Add any initial props if defined.
      if (isIterable(initialProps))
      {
         for (const prop of initialProps) { s_POSITION_PROPS.add(prop); }
      }

      const positionInfo = s_GET_POSITIONINFO(tjsPosition, timelineOptions, filter, gsapData);

      const optionPosition = options?.position;

      const timeline = gsap.timeline(timelineOptions);

      // If the passed in gsapData is a function then we know we are working w/ individual positions, so create
      // sub timelines for each position instance.
      if (typeof gsapData === 'function')
      {
         if (typeof optionPosition === 'function')
         {
            const positionCallbackData = {
               index: void 0,
               position: void 0,
               positionData: void 0,
               data: void 0,
               element: void 0,
               gsapData: void 0
            };

            for (let index = 0; index < positionInfo.gsapData.length; index++)
            {
               const subTimeline = gsap.timeline();

               positionCallbackData.index = index;
               positionCallbackData.position = positionInfo.position[index];
               positionCallbackData.positionData = positionInfo.positionData[index];
               positionCallbackData.data = positionInfo.data[index];
               positionCallbackData.element = positionInfo.elements[index];
               positionCallbackData.gsapData = positionInfo.gsapData[index];

               const positionTimeline = optionPosition(positionCallbackData);

               TimelinePositionImpl.handleGsapData(positionInfo.gsapData[index], subTimeline,
                positionInfo.positionData[index], positionInfo.elements[index]);

               timeline.add(subTimeline, positionTimeline);
            }
         }
         else
         {
            for (let index = 0; index < positionInfo.gsapData.length; index++)
            {
               const subTimeline = gsap.timeline();

               TimelinePositionImpl.handleGsapData(positionInfo.gsapData[index], subTimeline,
                positionInfo.positionData[index], positionInfo.elements[index]);

               timeline.add(subTimeline, optionPosition);
            }
         }
      }
      else
      {
         const gsapDataSingle = positionInfo.gsapData[0];

         // If `position` option is defined then handle each Position instance as a sub-timeline.
         if (typeof optionPosition !== void 0)
         {
            let index = 0;

            const positionCallbackData = {
               index,
               position: void 0,
               positionData: void 0,
               data: void 0,
               element: void 0,
               gsapData: void 0     // Note: When using JSON.stringify `gsapData` will cause a circular structure.
            };

            const isFunction = typeof optionPosition === 'function';

            for (;index < positionInfo.position.length; index++)
            {
               if (isFunction)
               {
                  positionCallbackData.index = index;
                  positionCallbackData.position = positionInfo.position[index];
                  positionCallbackData.positionData = positionInfo.positionData[index];
                  positionCallbackData.data = positionInfo.data[index];
                  positionCallbackData.element = positionInfo.elements[index];
                  positionCallbackData.gsapData = gsapDataSingle;

                  const positionTimeline = optionPosition(positionCallbackData);

                  const subTimeline = gsap.timeline();

                  TimelinePositionImpl.handleGsapData(gsapDataSingle, subTimeline, positionInfo.positionData[index],
                   positionInfo.elements[index]);

                  timeline.add(subTimeline, positionTimeline);
               }
               else
               {
                  const subTimeline = gsap.timeline();

                  TimelinePositionImpl.handleGsapData(gsapDataSingle, subTimeline, positionInfo.positionData[index],
                   positionInfo.elements[index]);

                  timeline.add(subTimeline, optionPosition);
               }
            }
         }
         else
         {
            TimelinePositionImpl.handleGsapData(gsapDataSingle, timeline, positionInfo.positionData,
             positionInfo.elements);
         }
      }

      return timeline;
   }

   /**
    * @param {Position|Position[]} tjsPosition - Position instance.
    *
    * @param {GsapPositionOptions} [options] - Options for filtering and initial data population.
    *
    * @param {object}   vars - GSAP vars object for `to`.
    *
    * @returns {object} GSAP tween
    */
   static to(tjsPosition, options, vars)
   {
      if (options !== void 0 && typeof options !== 'object')
      {
         throw new TypeError(`GsapCompose.from error: 'options' is not an object.`);
      }

      const filter = options?.filter;
      const initialProps = options?.initialProps;

      // Only retrieve the Position keys that are in vars.
      s_POSITION_PROPS.clear();

      // Add any initial props if defined.
      if (isIterable(initialProps))
      {
         for (const prop of initialProps) { s_POSITION_PROPS.add(prop); }
      }

      for (const prop in vars)
      {
         if (s_POSITION_KEYS.has(prop)) { s_POSITION_PROPS.add(prop); }
      }

      const positionData = s_GET_POSITIONINFO(tjsPosition, vars, filter).positionData;

      return gsap.to(positionData, vars);
   }
}

/**
 * Internal helper class for timeline implementation. Performs error checking before applying any timeline actions.
 */
class TimelinePositionImpl
{
   /**
    * Gets the target from GSAP data entry.
    *
    * @param {PositionDataExtended|PositionDataExtended[]}  positionData - PositionInfo data.
    *
    * @param {HTMLElement|HTMLElement[]}  elements - One or more HTMLElements.
    *
    * @param {object}         entry - Gsap data entry.
    *
    * @param {number}         cntr - Current GSAP data entry index.
    *
    * @returns {PositionDataExtended|PositionDataExtended[]|HTMLElement|HTMLElement[]} The target object or HTMLElement.
    */
   static getTarget(positionData, elements, entry, cntr)
   {
      const target = entry.target ?? 'position';

      switch (target)
      {
         case 'position':
            return positionData;
         case 'element':
            return elements;
         default:
            throw new Error(`GsapCompose.timeline error: 'gsapData[${cntr}]' unknown 'target' - '${target}'.`);
      }
   }

   static handleGsapData(gsapData, timeline, positionData, elements)
   {
      let index = 0;

      for (const entry of gsapData)
      {
         const type = entry.type;

         switch (type)
         {
            case 'add':
               TimelineImpl.add(timeline, entry, index);
               break;

            case 'addLabel':
               TimelineImpl.addLabel(timeline, entry, index);
               break;

            case 'addPause':
               TimelineImpl.addPause(timeline, entry, index);
               break;

            case 'call':
               TimelineImpl.call(timeline, entry, index);
               break;

            case 'from':
               timeline.from(this.getTarget(positionData, elements, entry, index), entry.vars, entry.position);
               break;

            case 'fromTo':
               timeline.fromTo(this.getTarget(positionData, elements, entry, index), entry.fromVars, entry.toVars,
                entry.position);
               break;

            case 'set':
               timeline.set(this.getTarget(positionData, elements, entry, index), entry.vars, entry.position);
               break;

            case 'to':
               timeline.to(this.getTarget(positionData, elements, entry, index), entry.vars, entry.position);
               break;

            default:
               throw new Error(`GsapCompose.timeline error: gsapData[${index}] unknown 'type' - '${type}'`);
         }

         index++;
      }
   }

   /**
    * Validates data for Position related properties: 'from', 'fromTo', 'set', 'to'. Also adds all properties found
    * in Gsap entry data to s_POSITION_PROPS, so that just the properties being animated are added to animated
    * `positionData`.
    *
    * @param {object}   entry - Gsap entry data.
    *
    * @param {number}   cntr - Current index.
    */
   static validatePositionProp(entry, cntr)
   {
      const position = entry.position;

      if (position !== void 0 && !Number.isFinite(position) && typeof position !== 'string')
      {
         throw new TypeError(
          `GsapCompose.timeline error: gsapData[${cntr}] 'position' is not a number or string.`);
      }

      switch (entry.type)
      {
         case 'from':
         case 'to':
         case 'set':
         {
            const vars = entry.vars;

            if (typeof vars !== 'object')
            {
               throw new TypeError(`GsapCompose.timeline error: gsapData[${cntr}] missing 'vars' object.`);
            }

            // Only retrieve the Position keys that are in vars.
            for (const prop in vars)
            {
               if (s_POSITION_KEYS.has(prop)) { s_POSITION_PROPS.add(prop); }
            }

            break;
         }

         case 'fromTo':
         {
            const fromVars = entry.fromVars;
            const toVars = entry.toVars;

            if (typeof fromVars !== 'object')
            {
               throw new TypeError(`GsapCompose.timeline error: gsapData[${cntr}] missing 'fromVars' object.`);
            }

            if (typeof toVars !== 'object')
            {
               throw new TypeError(`GsapCompose.timeline error: gsapData[${cntr}] missing 'toVars' object.`);
            }

            // Only retrieve the Position keys that are in fromVars / toVars.
            for (const prop in fromVars)
            {
               if (s_POSITION_KEYS.has(prop)) { s_POSITION_PROPS.add(prop); }
            }

            for (const prop in toVars)
            {
               if (s_POSITION_KEYS.has(prop)) { s_POSITION_PROPS.add(prop); }
            }

            break;
         }
      }
   }
}

/**
 * @param {Position|Iterable<Position>}   tjsPositions -
 *
 * @param {object}                        vars -
 *
 * @param {Function}                      filter -
 *
 * @param {object[]|Function}             [gsapData] -
 *
 * @returns {PositionInfo} A PositionInfo instance.
 */
function s_GET_POSITIONINFO(tjsPositions, vars, filter, gsapData)
{
   /** @type {PositionInfo} */
   const positionInfo = {
      position: [],
      positionData: [],
      data: [],
      elements: [],
      gsapData: [],
   };

   // If gsapData is a function invoke it w/ the current Position instance and position data to retrieve a unique
   // gsapData object. If null / undefined is returned this entry is ignored.
   if (typeof gsapData === 'function')
   {
      let index = 0;

      const gsapDataOptions = {
         index,
         position: void 0,
         data: void 0
      };

      const populateData = (entry) =>
      {
         const isPosition = entry instanceof Position;

         gsapDataOptions.index = index++;
         gsapDataOptions.position = isPosition ? entry : entry.position;
         gsapDataOptions.data = isPosition ? void 0 : entry;

         const finalGsapData = gsapData(gsapDataOptions);

         if (typeof finalGsapData !== 'object')
         {
            throw new TypeError(
             `GsapCompose error: gsapData callback function iteration(${index - 1}) failed to return an object.`);
         }

         s_VALIDATE_GSAPDATA_ENTRY(finalGsapData);

         positionInfo.gsapData.push(finalGsapData);
      };

      if (isIterable(tjsPositions))
      {
         for (const entry of tjsPositions) { populateData(entry); }
      }
      else
      {
         populateData(tjsPositions);
      }
   }
   else if (isIterable(gsapData))
   {
      s_VALIDATE_GSAPDATA_ENTRY(gsapData);

      positionInfo.gsapData.push(gsapData);
   }

   const existingOnUpdate = vars.onUpdate;

   if (isIterable(tjsPositions))
   {
      for (const entry of tjsPositions)
      {
         const isPosition = entry instanceof Position;

         const position = isPosition ? entry : entry.position;
         const data = isPosition ? void 0 : entry;
         const positionData = position.get({ immediateElementUpdate: true }, s_POSITION_GET_OPTIONS);

         positionInfo.position.push(position);
         positionInfo.positionData.push(positionData);
         positionInfo.data.push(data);
         positionInfo.elements.push(position.element);
      }
   }
   else
   {
      const isPosition = tjsPositions instanceof Position;

      const position = isPosition ? tjsPositions : tjsPositions.position;
      const data = isPosition ? void 0 : tjsPositions;
      const positionData = position.get({ immediateElementUpdate: true }, s_POSITION_GET_OPTIONS);

      positionInfo.position.push(position);
      positionInfo.positionData.push(positionData);
      positionInfo.data.push(data);
      positionInfo.elements.push(position.element);
   }

   if (typeof filter === 'function')
   {
      // Preserve invoking existing onUpdate function.
      if (typeof existingOnUpdate === 'function')
      {
         vars.onUpdate = () =>
         {
            for (let cntr = 0; cntr < positionInfo.position.length; cntr++)
            {
               positionInfo.position[cntr].set(filter(positionInfo.positionData[cntr]));
            }
            existingOnUpdate();
         };
      }
      else
      {
         vars.onUpdate = () =>
         {
            for (let cntr = 0; cntr < positionInfo.position.length; cntr++)
            {
               positionInfo.position[cntr].set(filter(positionInfo.positionData[cntr]));
            }
         };
      }
   }
   else
   {
      // Preserve invoking existing onUpdate function.
      if (typeof existingOnUpdate === 'function')
      {
         vars.onUpdate = () =>
         {
            for (let cntr = 0; cntr < positionInfo.position.length; cntr++)
            {
               positionInfo.position[cntr].set(positionInfo.positionData[cntr]);
            }
            existingOnUpdate();
         };
      }
      else
      {
         vars.onUpdate = () =>
         {
            for (let cntr = 0; cntr < positionInfo.position.length; cntr++)
            {
               positionInfo.position[cntr].set(positionInfo.positionData[cntr]);
            }
         };
      }
   }

   return positionInfo;
}

/**
 * Validates `gsapData` entries.
 *
 * @param {Iterable<object>} gsapData - GsapData array.
 */
function s_VALIDATE_GSAPDATA_ENTRY(gsapData)
{
   let index = 0;

   for (const entry of gsapData)
   {
      if (typeof entry !== 'object')
      {
         throw new TypeError(`GsapCompose.timeline error: 'gsapData[${index}]' is not an object.`);
      }

      // Determine if any of the entries has a position related type and targets position by explicit value or by
      // default. Build up only the position properties that are being modified by all entries. This allows maximum
      // composability when animating multiple non-overlapping properties in a timeline.
      if (s_TYPES_POSITION.has(entry.type) && (entry.target === void 0 || entry.target === 'position'))
      {
         TimelinePositionImpl.validatePositionProp(entry, index);
      }

      index++;
   }
}

/**
 * @typedef {object} PositionInfo
 *
 * @property {Position[]}              position -
 *
 * @property {PositionDataExtended[]}  positionData -
 *
 * @property {object[]}                data - Contains the full data object when a list of object w/ position is used.
 *
 * @property {HTMLElement[]}           elements -
 *
 * @property {Array<object[]>}         gsapData -
 */

/**
 * Provides a data driven ways to connect a {@link Position} instance with a GSAP timeline and tweens.
 *
 * {@link GsapPosition.timeline} supports the following types: 'add', 'addLabel', 'addPause', 'call', 'from',
 * 'fromTo', 'set', 'to'.
 */
class GsapCompose
{
   /**
    * @param {GSAPTarget} target - A standard GSAP target or Position.
    *
    * @param {object}   vars - GSAP vars object for `from`.
    *
    * @param {GsapPositionOptions} [options] - Options for filtering and initial data population for Position tweens.
    *
    * @returns {object} GSAP tween
    */
   static from(target, vars, options)
   {
      if (typeof vars !== 'object')
      {
         throw new TypeError(`GsapCompose.from error: 'vars' is not an object.`);
      }

      // If target is Position related attempt to dispatch to GsapPosition.
      const positionTween = s_DISPATCH_POSITION('from', target, options, vars);

      return positionTween !== void 0 ? positionTween : gsap.from(target, vars);
   }

   /**
    * @param {GSAPTarget} target - A standard GSAP target or Position.
    *
    * @param {object}   fromVars - GSAP fromVars object for `fromTo`
    *
    * @param {object}   toVars - GSAP toVars object for `fromTo`.
    *
    * @param {GsapPositionOptions} [options] - Options for filtering and initial data population.
    *
    * @returns {object} GSAP tween
    */
   static fromTo(target, fromVars, toVars, options)
   {
      if (typeof fromVars !== 'object')
      {
         throw new TypeError(`GsapCompose.fromTo error: 'fromVars' is not an object.`);
      }

      if (typeof toVars !== 'object')
      {
         throw new TypeError(`GsapCompose.fromTo error: 'toVars' is not an object.`);
      }

      // If target is Position related attempt to dispatch to GsapPosition.
      const positionTween = s_DISPATCH_POSITION('fromTo', target, options, fromVars, toVars);

      return positionTween !== void 0 ? positionTween : gsap.fromTo(target, fromVars, toVars);
   }

   /**
    * Checks the `gsap` module instance for existence of a method and GsapCompose for the same method name. This
    * is helpful to determine which new features are available. Ex. `quickTo` is not available until GSAP `3.10+`.
    *
    * @param {string}   name - Name of method to check.
    *
    * @returns {boolean} Gsap and GsapCompose support the given method.
    */
   static hasMethod(name)
   {
      return typeof gsap[name] === 'function' && typeof this[name] === 'function';
   }

   /**
    * @param {GSAPTarget} target - A standard GSAP target or Position.
    *
    * @param {string}   key - Property of position to manipulate.
    *
    * @param {object}   vars - GSAP vars object for `quickTo`.
    *
    * @param {GsapPositionOptions} [options] - Options for filtering and initial data population.
    *
    * @returns {Function}  GSAP quickTo function.
    */
   static quickTo(target, key, vars, options)
   {
      if (typeof key !== 'string')
      {
         throw new TypeError(`GsapCompose.quickTo error: 'key' is not a string.`);
      }

      if (typeof vars !== 'object')
      {
         throw new TypeError(`GsapCompose.quickTo error: 'vars' is not an object.`);
      }

      // If target is Position related attempt to dispatch to GsapPosition.
      const positionQuickTo = s_DISPATCH_POSITION('quickTo', target, options, key, vars);

      return positionQuickTo !== void 0 ? positionQuickTo : gsap.quickTo(target, key, vars);
   }

   /**
    * Defers to `gsap` module to register an easing function.
    *
    * @param {string}   name - Easing name.
    *
    * @param {Function} ease - An easing function.
    */
   static registerEase(name, ease)
   {
      gsap.registerEase(name, ease);
   }

   /**
    * Defers to `gsap` module to register a plugin.
    *
    * @param {...Function} args - A list of plugins.
    */
   static registerPlugin(...args)
   {
      gsap.registerPlugin(...args);
   }

   /**
    * @param {GSAPTarget} target - A standard GSAP target or Position.
    *
    * @param {object|GsapData}   [arg1] - Either an object defining timeline options or GsapData.
    *
    * @param {GsapData|GsapPositionOptions} [arg2] - When arg1 is defined as an object; arg2 defines GsapData.
    *
    * @param {GsapPositionOptions} [arg3] - Options for filtering and initial data population.
    *
    * @returns {object} GSAP timeline
    */
   static timeline(target, arg1, arg2, arg3)
   {
      // When an object and not iterable assume an object literal as timeline options.
      // This allows through `GsapCompose.timeline()` and `GsapCompose.timeline({ <TIMELINE_OPTIONS> })`.
      if (target === void 0 || (isPlainObject(target) && arg1 === void 0))
      {
         return gsap.timeline(target);
      }

      // If target is Position related attempt to dispatch to GsapPosition.
      const positionTimeline = s_DISPATCH_POSITION('timeline', target, arg1, arg2, arg3);
      if (positionTimeline !== void 0) { return positionTimeline; }

      // Load the variable arguments from arg1 / arg2.
      // If arg1 is an object then take it as the timelineOptions.
      const timelineOptions = typeof arg1 === 'object' ? arg1 : {};

      // If arg1 is an array then take it as `gsapData` otherwise select arg2.
      const gsapData = isIterable(arg1) ? arg1 : arg2;

      /** @type {GsapPositionOptions} */
      const options = gsapData === arg1 ? arg2 : arg3;

      if (typeof timelineOptions !== 'object')
      {
         throw new TypeError(`GsapCompose.timeline error: 'timelineOptions' is not an object.`);
      }

      if (!isIterable(gsapData))
      {
         throw new TypeError(`GsapCompose.timeline error: 'gsapData' is not an iterable list.`);
      }

      if (options !== void 0 && typeof options !== 'object')
      {
         throw new TypeError(`GsapCompose.from error: 'options' is not an object.`);
      }

      // Validate gsapData.
      let index = 0;

      for (const entry of gsapData)
      {
         if (typeof entry !== 'object')
         {
            throw new TypeError(`GsapCompose.timeline error: 'gsapData[${index}]' is not an object.`);
         }

         s_VALIDATE_OPTIONS(entry, index);

         index++;
      }

      index = 0;

      const timeline = gsap.timeline(timelineOptions);

      for (const entry of gsapData)
      {
         const type = entry.type;

         switch (type)
         {
            case 'add':
               TimelineImpl.add(timeline, entry, index);
               break;

            case 'addLabel':
               TimelineImpl.addLabel(timeline, entry, index);
               break;

            case 'addPause':
               TimelineImpl.addPause(timeline, entry, index);
               break;

            case 'call':
               TimelineImpl.call(timeline, entry, index);
               break;

            case 'from':
               timeline.from(target, entry.vars, entry.position);
               break;

            case 'fromTo':
               timeline.fromTo(target, entry.fromVars, entry.toVars, entry.position);
               break;

            case 'set':
               timeline.set(target, entry.vars, entry.position);
               break;

            case 'to':
               timeline.to(target, entry.vars, entry.position);
               break;

            default:
               throw new Error(`GsapCompose.timeline error: gsapData[${index}] unknown 'type' - '${type}'`);
         }

         index++;
      }

      return timeline;
   }

   /**
    * @param {GSAPTarget} target - A standard GSAP target or Position.
    *
    * @param {object}   vars - GSAP vars object for `to`.
    *
    * @param {GsapPositionOptions} [options] - Options for filtering and initial data population.
    *
    * @returns {object} GSAP tween
    */
   static to(target, vars, options)
   {
      if (typeof vars !== 'object')
      {
         throw new TypeError(`GsapCompose.to error: 'vars' is not an object.`);
      }

      // If target is Position related attempt to dispatch to GsapPosition.
      const positionTween = s_DISPATCH_POSITION('to', target, options, vars);

      return positionTween !== void 0 ? positionTween : gsap.to(target, vars);
   }
}

function s_DISPATCH_POSITION(operation, target, options, arg1, arg2)
{
   if (target instanceof Position)
   {
      return GsapPosition[operation](target, options, arg1, arg2);
   }
   else if (typeof target === 'object' && target.position instanceof Position)
   {
      return GsapPosition[operation](target.position, options, arg1, arg2);
   }
   else if (isIterable(target))
   {
      let hasPosition = false;
      let allPosition = true;

      for (const entry of target)
      {
         const isPosition = entry instanceof Position || entry?.position instanceof Position;

         hasPosition |= isPosition;
         if (!isPosition) { allPosition = false; }
      }

      if (hasPosition)
      {
         if (!allPosition)
         {
            throw new TypeError(
             `GsapCompose.${operation} error: 'target' is an array but all entries are not a Position instance.`);
         }
         else
         {
            return GsapPosition[operation](target, options, arg1, arg2);
         }
      }
   }

   return void 0;
}

/**
 * Validates data for Position related properties: 'from', 'fromTo', 'set', 'to'. Also adds all properties found
 * in Gsap entry data to s_POSITION_PROPS, so that just the properties being animated are added to animated
 * `positionData`.
 *
 * @param {object}   entry - Gsap entry data.
 *
 * @param {number}   cntr - Current index.
 */
function s_VALIDATE_OPTIONS(entry, cntr)
{
   const position = entry.position;

   if (position !== void 0 && !Number.isFinite(position) && typeof position !== 'string')
   {
      throw new TypeError(
       `GsapCompose.timeline error: gsapData[${cntr}] 'position' is not a number or string.`);
   }

   switch (entry.type)
   {
      case 'from':
      case 'to':
      case 'set':
      {
         const vars = entry.vars;

         if (typeof vars !== 'object')
         {
            throw new TypeError(`GsapCompose.timeline error: gsapData[${cntr}] missing 'vars' object.`);
         }

         break;
      }

      case 'fromTo':
      {
         const fromVars = entry.fromVars;
         const toVars = entry.toVars;

         if (typeof fromVars !== 'object')
         {
            throw new TypeError(`GsapCompose.timeline error: gsapData[${cntr}] missing 'fromVars' object.`);
         }

         if (typeof toVars !== 'object')
         {
            throw new TypeError(`GsapCompose.timeline error: gsapData[${cntr}] missing 'toVars' object.`);
         }

         break;
      }
   }
}

/**
 * @typedef {Iterable<object>|Function} GsapData
 */

/**
 * @typedef {object} GsapPositionOptions
 *
 * @property {Function} [filter] - An optional filter function to adjust position data in `onUpdate` callbacks. This is
 *                                 useful if you need to transform any data from GSAP / plugins into data Position can
 *                                 utilize.
 *
 * @property {Iterable<string>} [initialProps] - Provides an iterable of property keys to assign to initial position
 *                                               data. This is useful when you are using GSAP plugins that manipulate
 *                                               data automatically; Ex. MotionPathPlugin
 */

/**
 * @typedef {string|object|Position|Iterable<Position>|Array<HTMLElement|object>} GSAPTarget
 */

// const s_HAS_QUICK_TO = GsapCompose.hasMethod('quickTo');

/**
 * Provides an action to enable pointer dragging of an HTMLElement using GSAP `to` or `quickTo` to invoke `position.set`
 * on a given {@link Position} instance provided. You may provide a `easeOptions` object sent to the tween to modify the
 * duration / easing. When the attached boolean store state changes the draggable action is enabled or disabled.
 *
 * Note: Requires GSAP `3.10+` for `quickTo` support.
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
 * @param {boolean}           [params.inertia=false] - When true inertia easing is enabled.
 *
 * @param {object}            [params.easeOptions] - Gsap `to / `quickTo` vars object.
 *
 * @param {object}            [params.inertiaOptions] - Inertia Options.
 *
 * @returns {{update: Function, destroy: Function}} The action lifecycle methods.
 */
function draggableGsap(node, { position, active = true, button = 0, storeDragging = void 0, ease = true, inertia = false,
 easeOptions = { duration: 0.1, ease: 'power3.out' },
  inertiaOptions = { end: void 0, duration: { min: 0, max: 3 }, resistance: 1000, velocityScale: 1 } })
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
   const initialDragPoint = { x: 0, y: 0 };

   /**
    * Stores the current dragging state and gates the move pointer as the dragging store is not
    * set until the first pointer move.
    *
    * @type {boolean}
    */
   let dragging = false;

   /**
    * Stores the inertia GSAP tween.
    *
    * @type {object}
    */
   let inertiaTween;

   /**
    * Tracks velocity for inertia tween.
    */
   const velocityTrack = new TJSVelocityTrack();

   /**
    * Event handlers associated with this action for addition / removal.
    *
    * @type {object}
    */
   const handlers = {
      dragDown: ['pointerdown', (e) => onDragPointerDown(e), false],
      dragMove: ['pointermove', (e) => onDragPointerChange(e), false],
      dragUp: ['pointerup', (e) => onDragPointerUp(e), false]
   };

   /**
    * Stores the ease tween.
    *
    * @type {object}
    */
   let tweenTo;

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
      initialDragPoint.x = event.clientX;
      initialDragPoint.y = event.clientY;

      // Reset velocity tracking when inertia is enabled.
      if (inertia)
      {
         // Reset any existing inertia tween.
         if (inertiaTween)
         {
            inertiaTween.kill();
            inertiaTween = void 0;
         }

         velocityTrack.reset(event.clientX, event.clientY);
      }

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

      if (inertia) { velocityTrack.update(event.clientX, event.clientY); }

      if (ease)
      {
         // Update application position.
         {
            if (tweenTo) { tweenTo.kill(); }

            tweenTo = GsapCompose.to(position, { left: newLeft, top: newTop, ...easeOptions });
         }
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

      if (inertia)
      {
         // Kill any existing ease / tween before inertia tween.
         {
            if (tweenTo)
            {
               tweenTo.kill();
               tweenTo = void 0;
            }
         }

         const opts = inertiaOptions;

         const velScale = opts.velocityScale ?? 1;
         const tweenDuration = opts.duration ?? { min: 0, max: 3 };
         const tweenEnd = opts.end ?? void 0;
         const tweenResistance = opts.resistance ?? 1000;

         const velocity = velocityTrack.update(event.clientX, event.clientY);

         inertiaTween = GsapCompose.to(position, {
            inertia: {
               left: Object.assign({ velocity: velocity.x * velScale }, tweenEnd ? { end: tweenEnd } : {}),
               top: Object.assign({ velocity: velocity.y * velScale }, tweenEnd ? { end: tweenEnd } : {}),
               duration: tweenDuration,
               resistance: tweenResistance,
               linkedProps: 'top,left'
            }
         }, s_INTERTIA_GC_OPTIONS);
      }
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

         if (typeof options.ease === 'boolean') { ease = options.ease; }
         if (typeof options.inertia === 'boolean') { inertia = options.inertia; }

         if (typeof options.easeOptions === 'object')
         {
            easeOptions = options.easeOptions;
         }

         if (typeof options.inertiaOptions === 'object')
         {
            inertiaOptions = options.inertiaOptions;
         }
      },

      destroy: () => removeListeners()
   };
}

/**
 * Provides a store / object to make updating / setting draggableGsap options much easier.
 */
class DraggableGsapOptions
{
   #ease = false;

   #easeOptions = { duration: 0.1, ease: 'power3.out' };

   #inertia = false;

   #inertiaOptions = { end: void 0, duration: { min: 0, max: 3 }, resistance: 1000, velocityScale: 1 };

   /**
    * Stores the subscribers.
    *
    * @type {(function(DraggableGsapOptions): void)[]}
    */
   #subscriptions = [];

   constructor({ ease, easeOptions, inertia, inertiaOptions } = {})
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

      Object.defineProperty(this, 'inertia', {
         get: () => { return this.#inertia; },
         set: (newInertia) =>
         {
            if (typeof newInertia !== 'boolean') { throw new TypeError(`'inertia' is not a boolean.`); }

            this.#inertia = newInertia;
            this.#updateSubscribers();
         },
         enumerable: true
      });

      Object.defineProperty(this, 'inertiaOptions', {
         get: () => { return this.#inertiaOptions; },
         set: (newInertiaOptions) =>
         {
            if (newInertiaOptions === null || typeof newInertiaOptions !== 'object')
            {
               throw new TypeError(`'inertiaOptions' is not an object.`);
            }

            if (newInertiaOptions.end !== void 0)
            {
               if (typeof newInertiaOptions.end !== 'function' && newInertiaOptions.end !== void 0)
               {
                  throw new TypeError(`'inertiaOptions.end' is not a function or undefined.`);
               }

               this.#inertiaOptions.end = newInertiaOptions.end;
            }

            if (newInertiaOptions.duration !== void 0)
            {
               if (newInertiaOptions.duration === null || typeof newInertiaOptions.duration !== 'object')
               {
                  throw new TypeError(`'inertiaOptions.duration' is not an object.`);
               }

               if (newInertiaOptions.duration.max !== void 0)
               {
                  if (!Number.isFinite(newInertiaOptions.duration.max))
                  {
                     throw new TypeError(`'inertiaOptions.duration.max' is not a finite number.`);
                  }

                  if (newInertiaOptions.duration.max < 0)
                  {
                     throw new Error(`'newInertiaOptions.duration.max' is less than 0.`);
                  }

                  this.#inertiaOptions.duration.max = newInertiaOptions.duration.max;
               }

               if (newInertiaOptions.duration.min !== void 0)
               {
                  if (!Number.isFinite(newInertiaOptions.duration.min))
                  {
                     throw new TypeError(`'inertiaOptions.duration.min' is not a finite number.`);
                  }

                  if (newInertiaOptions.duration.min < 0)
                  {
                     throw new Error(`'newInertiaOptions.duration.min' is less than 0.`);
                  }

                  this.#inertiaOptions.duration.min = newInertiaOptions.duration.min;
               }

               if (this.#inertiaOptions.duration.min > this.#inertiaOptions.duration.max)
               {
                  this.#inertiaOptions.duration.max = this.#inertiaOptions.duration.min;
               }

               if (this.#inertiaOptions.duration.max < this.#inertiaOptions.duration.min)
               {
                  this.#inertiaOptions.duration.min = this.#inertiaOptions.duration.max;
               }
            }

            if (newInertiaOptions.resistance !== void 0)
            {
               if (!Number.isFinite(newInertiaOptions.resistance))
               {
                  throw new TypeError(`'inertiaOptions.resistance' is not a finite number.`);
               }

               if (newInertiaOptions.resistance < 0) { throw new Error(`'inertiaOptions.resistance' is less than 0.`); }

               this.#inertiaOptions.resistance = newInertiaOptions.resistance;
            }

            if (newInertiaOptions.velocityScale !== void 0)
            {
               if (!Number.isFinite(newInertiaOptions.velocityScale))
               {
                  throw new TypeError(`'inertiaOptions.velocityScale' is not a finite number.`);
               }

               if (newInertiaOptions.velocityScale < 0)
               {
                  throw new Error(`'inertiaOptions.velocityScale' is less than 0.`);
               }

               this.#inertiaOptions.velocityScale = newInertiaOptions.velocityScale;
            }

            this.#updateSubscribers();
         },
         enumerable: true
      });

      // Set default options.
      if (ease !== void 0) { this.ease = ease; }
      if (easeOptions !== void 0) { this.easeOptions = easeOptions; }
      if (inertia !== void 0) { this.inertia = inertia; }
      if (inertiaOptions !== void 0) { this.inertiaOptions = inertiaOptions; }
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
    * @returns {number|Array|Function} Get inertia end.
    * @see `end` {@link https://greensock.com/docs/v3/Plugins/InertiaPlugin}
    */
   get inertiaEnd() { return this.#inertiaOptions.end; }

   /**
    * @returns {number} Get inertia duration max time (seconds)
    */
   get inertiaDurationMax() { return this.#inertiaOptions.duration.max; }

   /**
    * @returns {number} Get inertia duration min time (seconds)
    */
   get inertiaDurationMin() { return this.#inertiaOptions.duration.min; }

   /**
    * @returns {number} Get inertia resistance (1000 is default).
    */
   get inertiaResistance() { return this.#inertiaOptions.resistance; }

   /**
    * @returns {number} Get inertia velocity scale.
    */
   get inertiaVelocityScale() { return this.#inertiaOptions.velocityScale; }

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
    * @param {number|Array|Function} end - Set inertia end.
    *
    * @see `end` {@link https://greensock.com/docs/v3/Plugins/InertiaPlugin}
    */
   set inertiaEnd(end)
   {
      if (typeof end !== 'function' && end !== void 0) { throw new TypeError(`'end' is not a function or undefined.`); }

      this.#inertiaOptions.end = end;
      this.#updateSubscribers();
   }

   /**
    * @param {{min: number, max: number}} duration - Set inertia duration min & max.
    */
   set inertiaDuration(duration)
   {
      if (typeof duration !== 'object' && !Number.isFinite(duration.min) && !Number.isFinite(duration.max))
      {
         throw new TypeError(`'duration' is not an object with 'min' & 'max' properties as finite numbers.`);
      }

      if (duration.max < 0) { throw new Error(`'duration.max' is less than 0.`); }
      if (duration.min < 0) { throw new Error(`'duration.min' is less than 0.`); }

      // Automatically correct for when min / max are out of sync.
      if (duration.min > duration.max) { duration.max = duration.min; }
      if (duration.max < duration.min) { duration.min = duration.max; }

      this.#inertiaOptions.duration.max = duration.max;
      this.#inertiaOptions.duration.min = duration.min;
      this.#updateSubscribers();
   }

   /**
    * @param {number}   max - Set inertia duration max.
    */
   set inertiaDurationMax(max)
   {
      if (!Number.isFinite(max)) { throw new TypeError(`'max' is not a finite number.`); }
      if (max < 0) { throw new Error(`'max' is less than 0.`); }

      if (max < this.#inertiaOptions.duration.min) { this.#inertiaOptions.duration.min = max; }

      this.#inertiaOptions.duration.max = max;
      this.#updateSubscribers();
   }

   /**
    * @param {number}   min - Set inertia duration min.
    */
   set inertiaDurationMin(min)
   {
      if (!Number.isFinite(min)) { throw new TypeError(`'min' is not a finite number.`); }
      if (min < 0) { throw new Error(`'min' is less than 0.`); }

      if (min > this.#inertiaOptions.duration.max) { this.#inertiaOptions.duration.max = min; }

      this.#inertiaOptions.duration.min = min;
      this.#updateSubscribers();
   }

   /**
    * @param {number}   resistance - Set inertia resistance. Default: 1000
    */
   set inertiaResistance(resistance)
   {
      if (!Number.isFinite(resistance)) { throw new TypeError(`'resistance' is not a finite number.`); }
      if (resistance < 0) { throw new Error(`'resistance' is less than 0.`); }

      this.#inertiaOptions.resistance = resistance;
      this.#updateSubscribers();
   }

   /**
    * @param {number}   velocityScale - Set inertia velocity scale.
    */
   set inertiaVelocityScale(velocityScale)
   {
      if (!Number.isFinite(velocityScale)) { throw new TypeError(`'velocityScale' is not a finite number.`); }
      if (velocityScale < 0) { throw new Error(`'velocityScale' is less than 0.`); }

      this.#inertiaOptions.velocityScale = velocityScale;
      this.#updateSubscribers();
   }

   /**
    * Resets all options data to default values.
    */
   reset()
   {
      this.#ease = true;
      this.#inertia = false;
      this.#easeOptions = { duration: 0.1, ease: 'power3.out' };
      this.#inertiaOptions = { end: void 0, duration: { min: 0, max: 3 }, resistance: 1000, velocityScale: 1 };
      this.#updateSubscribers();
   }

   /**
    * Resets easing options to default values.
    */
   resetEase()
   {
      this.#easeOptions = { duration: 0.1, ease: 'power3.out' };
      this.#updateSubscribers();
   }

   /**
    * Resets inertia options to default values.
    */
   resetInertia()
   {
      this.#inertiaOptions = { end: void 0, duration: { min: 0, max: 3 }, resistance: 1000, velocityScale: 1 };
      this.#updateSubscribers();
   }

   /**
    * Store subscribe method.
    *
    * @param {function(DraggableGsapOptions): void} handler - Callback function that is invoked on update / changes.
    *                                                         Receives the DraggableOptions object / instance.
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

   /**
    * Update all subscribers.
    */
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
 * Define a function to get a DraggableGsapOptions instance.
 *
 * @returns {DraggableGsapOptions} A new options instance.
 */
draggableGsap.options = (options) => new DraggableGsapOptions(options);

/**
 * Extra options for GsapCompose.
 *
 * @type {{initialProps: string[]}}
 */
const s_INTERTIA_GC_OPTIONS = { initialProps: ['top', 'left'] };

/**
 * Used for direct call to `position.set`.
 *
 * @type {{top: number, left: number}}
 */
const s_POSITION_DATA = { left: 0, top: 0 };

/**
 * @param {string}   name - Name of GSAP plugin to load.
 *
 * @returns {Promise<*>} The loaded plugin.
 */
async function gsapLoadPlugin(name)
{
   /**
    * Note usage of `globalThis.location.origin` as this is the origin of the importing location which is necessary for
    * connecting to the Foundry server when the package is located on a CDN.
    *
    * @type {string}
    */
   const modulePath = `${globalThis.location.origin}${foundry.utils.getRoute(`/scripts/greensock/esm/${name}.js`)}`;

   try
   {
      const module = await import(/* @vite-ignore */modulePath);
      return module.default;
   }
   catch (err)
   {
      console.error(`TyphonJS Runtime Library error; Could not load ${name} plugin from: '${modulePath}'`);
      console.error(err);
   }
}

export { GsapCompose, draggableGsap, easingFunc, easingList, gsap, gsapLoadPlugin };
//# sourceMappingURL=index.js.map
