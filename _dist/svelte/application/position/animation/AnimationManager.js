/**
 * Provides animation management and scheduling allowing all Position instances to utilize one micro-task.
 */
export class AnimationManager
{
   /**
    * @type {object[]}
    */
   static activeList = [];

   /**
    * @type {object[]}
    */
   static newList = [];

   /**
    * @type {number}
    */
   static current;

   /**
    * Add animation data.
    *
    * @param {object}   data -
    */
   static add(data)
   {
      const now = performance.now();

      // Offset start time by delta between last rAF time. This allows continuous tween cycles to appear naturally as
      // starting from the instant they are added to the AnimationManager. This is what makes `draggable` smooth when
      // easing is enabled.
      data.start = now + (AnimationManager.current - now);

      AnimationManager.newList.push(data);
   }

   /**
    * Manage all animation
    */
   static animate()
   {
      const current = AnimationManager.current = performance.now();

      // Early out of the rAF callback when there are no current animations.
      if (AnimationManager.activeList.length === 0 && AnimationManager.newList.length === 0)
      {
         globalThis.requestAnimationFrame(AnimationManager.animate);
         return;
      }

      if (AnimationManager.newList.length)
      {
         // Process new data
         for (let cntr = AnimationManager.newList.length; --cntr >= 0;)
         {
            const data = AnimationManager.newList[cntr];

            // If animation instance has been cancelled before start then remove it from new list and cleanup.
            if (data.cancelled)
            {
               AnimationManager.newList.splice(cntr, 1);
               data.cleanup(data);
            }

            // If data is active then process it now. Delayed animations start with `active` false.
            if (data.active)
            {
               // Remove from new list and add to active list.
               AnimationManager.newList.splice(cntr, 1);
               AnimationManager.activeList.push(data);
            }
         }
      }

      // Process active animations.
      for (let cntr = AnimationManager.activeList.length; --cntr >= 0;)
      {
         const data = AnimationManager.activeList[cntr];

         // Remove any animations that have been canceled.
         // Ensure that the element is still connected otherwise remove it from active list and continue.
         if (data.cancelled || (data.el !== void 0 && !data.el.isConnected))
         {
            AnimationManager.activeList.splice(cntr, 1);
            data.cleanup(data);
            continue;
         }

         data.current = current - data.start;

         // Remove this animation instance if current animating time exceeds duration.
         if (data.current >= data.duration)
         {
            // Prepare final update with end position data.
            for (let dataCntr = data.keys.length; --dataCntr >= 0;)
            {
               const key = data.keys[dataCntr];
               data.newData[key] = data.destination[key];
            }

            data.position.set(data.newData);

            AnimationManager.activeList.splice(cntr, 1);
            data.cleanup(data);

            continue;
         }

         // Apply easing to create an eased time.
         const easedTime = data.ease(data.current / data.duration);

         for (let dataCntr = data.keys.length; --dataCntr >= 0;)
         {
            const key = data.keys[dataCntr];
            data.newData[key] = data.interpolate(data.initial[key], data.destination[key], easedTime);
         }

         data.position.set(data.newData);
      }

      globalThis.requestAnimationFrame(AnimationManager.animate);
   }

   /**
    * Cancels all animations for given Position instance.
    *
    * @param {Position} position - Position instance.
    */
   static cancel(position)
   {
      for (let cntr = AnimationManager.activeList.length; --cntr >= 0;)
      {
         const data = AnimationManager.activeList[cntr];
         if (data.position === position)
         {
            AnimationManager.activeList.splice(cntr, 1);
            data.cancelled = true;
            data.cleanup(data);
         }
      }

      for (let cntr = AnimationManager.newList.length; --cntr >= 0;)
      {
         const data = AnimationManager.newList[cntr];
         if (data.position === position)
         {
            AnimationManager.newList.splice(cntr, 1);
            data.cancelled = true;
            data.cleanup(data);
         }
      }
   }

   /**
    * Cancels all active and delayed animations.
    */
   static cancelAll()
   {
      for (let cntr = AnimationManager.activeList.length; --cntr >= 0;)
      {
         const data = AnimationManager.activeList[cntr];
         data.cancelled = true;
         data.cleanup(data);
      }

      for (let cntr = AnimationManager.newList.length; --cntr >= 0;)
      {
         const data = AnimationManager.newList[cntr];
         data.cancelled = true;
         data.cleanup(data);
      }

      AnimationManager.activeList.length = 0;
      AnimationManager.newList.length = 0;
   }

   /**
    * Gets all {@link AnimationControl} instances for a given Position instance.
    *
    * @param {Position} position - Position instance.
    *
    * @returns {AnimationControl[]} All scheduled AnimationControl instances for the given Position instance.
    */
   static getScheduled(position)
   {
      const results = [];

      for (let cntr = AnimationManager.activeList.length; --cntr >= 0;)
      {
         const data = AnimationManager.activeList[cntr];
         if (data.position === position)
         {
            results.push(data.control);
         }
      }

      for (let cntr = AnimationManager.newList.length; --cntr >= 0;)
      {
         const data = AnimationManager.newList[cntr];
         if (data.position === position)
         {
            results.push(data.control);
         }
      }

      return results;
   }
}

// Start animation manager immediately. It constantly is running in background.
AnimationManager.animate();
