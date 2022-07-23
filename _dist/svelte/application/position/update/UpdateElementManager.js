import { nextAnimationFrame }    from '@typhonjs-fvtt/runtime/svelte/animate';

/**
 * Decouples updates to any parent target HTMLElement inline styles. Invoke {@link Position.elementUpdated} to await
 * on the returned promise that is resolved with the current render time via `nextAnimationFrame` /
 * `requestAnimationFrame`. This allows the underlying data model to be updated immediately while updates to the
 * element are in sync with the browser and potentially in the future be further throttled.
 *
 * @param {HTMLElement} el - The target HTMLElement.
 */
export class UpdateElementManager
{
   static list = [];
   static listCntr = 0;

   static updatePromise;

   static get promise() { return this.updatePromise; }

   /**
    * Potentially adds the given element and internal updateData instance to the list.
    *
    * @param {HTMLElement}       el - An HTMLElement instance.
    *
    * @param {UpdateElementData} updateData - An UpdateElementData instance.
    *
    * @returns {Promise<number>} The unified next frame update promise. Returns `currentTime`.
    */
   static add(el, updateData)
   {
      if (this.listCntr < this.list.length)
      {
         const entry = this.list[this.listCntr];
         entry[0] = el;
         entry[1] = updateData;
      }
      else
      {
         this.list.push([el, updateData]);
      }

      this.listCntr++;
      updateData.queued = true;

      if (!this.updatePromise) { this.updatePromise = this.wait(); }

      return this.updatePromise;
   }

   /**
    * Await on `nextAnimationFrame` and iterate over list map invoking callback functions.
    *
    * @returns {Promise<number>} The next frame Promise / currentTime from nextAnimationFrame.
    */
   static async wait()
   {
      // Await the next animation frame. In the future this can be extended to multiple frames to divide update rate.
      const currentTime = await nextAnimationFrame();

      this.updatePromise = void 0;

      for (let cntr = this.listCntr; --cntr >= 0;)
      {
         // Obtain data for entry.
         const entry = this.list[cntr];
         const el = entry[0];
         const updateData = entry[1];

         // Clear entry data.
         entry[0] = void 0;
         entry[1] = void 0;

         // Reset queued state.
         updateData.queued = false;

         // Early out if the element is no longer connected to the DOM / shadow root.
         // if (!el.isConnected || !updateData.changeSet.hasChange()) { continue; }
         if (!el.isConnected) { continue; }

         if (updateData.options.ortho)
         {
            s_UPDATE_ELEMENT_ORTHO(el, updateData);
         }
         else
         {
            s_UPDATE_ELEMENT(el, updateData);
         }

         // If calculate transform options is enabled then update the transform data and set the readable store.
         if (updateData.options.calculateTransform || updateData.options.transformSubscribed)
         {
            s_UPDATE_TRANSFORM(el, updateData);
         }

         // Update all subscribers with changed data.
         this.updateSubscribers(updateData);
      }

      this.listCntr = 0;

      return currentTime;
   }

   /**
    * Potentially immediately updates the given element.
    *
    * @param {HTMLElement}       el - An HTMLElement instance.
    *
    * @param {UpdateElementData} updateData - An UpdateElementData instance.
    */
   static immediate(el, updateData)
   {
      // Early out if the element is no longer connected to the DOM / shadow root.
      // if (!el.isConnected || !updateData.changeSet.hasChange()) { continue; }
      if (!el.isConnected) { return; }

      if (updateData.options.ortho)
      {
         s_UPDATE_ELEMENT_ORTHO(el, updateData);
      }
      else
      {
         s_UPDATE_ELEMENT(el, updateData);
      }

      // If calculate transform options is enabled then update the transform data and set the readable store.
      if (updateData.options.calculateTransform || updateData.options.transformSubscribed)
      {
         s_UPDATE_TRANSFORM(el, updateData);
      }

      // Update all subscribers with changed data.
      this.updateSubscribers(updateData);
   }

   /**
    * @param {UpdateElementData} updateData - Data change set.
    */
   static updateSubscribers(updateData)
   {
      const data = updateData.data;
      const changeSet = updateData.changeSet;

      if (!changeSet.hasChange()) { return; }

      // Make a copy of the data.
      const output = updateData.dataSubscribers.copy(data);

      const subscriptions = updateData.subscriptions;

      // Early out if there are no subscribers.
      if (subscriptions.length > 0)
      {
         for (let cntr = 0; cntr < subscriptions.length; cntr++) { subscriptions[cntr](output); }
      }

      // Update dimension data if width / height has changed.
      if (changeSet.width || changeSet.height)
      {
         updateData.dimensionData.width = data.width;
         updateData.dimensionData.height = data.height;
         updateData.storeDimension.set(updateData.dimensionData);
      }

      changeSet.set(false);
   }
}

/**
 * Decouples updates to any parent target HTMLElement inline styles. Invoke {@link Position.elementUpdated} to await
 * on the returned promise that is resolved with the current render time via `nextAnimationFrame` /
 * `requestAnimationFrame`. This allows the underlying data model to be updated immediately while updates to the
 * element are in sync with the browser and potentially in the future be further throttled.
 *
 * @param {HTMLElement} el - The target HTMLElement.
 *
 * @param {UpdateElementData} updateData - Update data.
 */
function s_UPDATE_ELEMENT(el, updateData)
{
   const changeSet = updateData.changeSet;
   const data = updateData.data;

   if (changeSet.left)
   {
      el.style.left = `${data.left}px`;
   }

   if (changeSet.top)
   {
      el.style.top = `${data.top}px`;
   }

   if (changeSet.zIndex)
   {
      el.style.zIndex = typeof data.zIndex === 'number' ? `${data.zIndex}` : null;
   }

   if (changeSet.width)
   {
      el.style.width = typeof data.width === 'number' ? `${data.width}px` : data.width;
   }

   if (changeSet.height)
   {
      el.style.height = typeof data.height === 'number' ? `${data.height}px` : data.height;
   }

   if (changeSet.transformOrigin)
   {
      // When set to 'center' we can simply set the transform to null which is center by default.
      el.style.transformOrigin = data.transformOrigin === 'center' ? null : data.transformOrigin;
   }

   // Update all transforms in order added to transforms object.
   if (changeSet.transform)
   {
      el.style.transform = updateData.transforms.isActive ? updateData.transforms.getCSS() : null;
   }
}

/**
 * Decouples updates to any parent target HTMLElement inline styles. Invoke {@link Position.elementUpdated} to await
 * on the returned promise that is resolved with the current render time via `nextAnimationFrame` /
 * `requestAnimationFrame`. This allows the underlying data model to be updated immediately while updates to the
 * element are in sync with the browser and potentially in the future be further throttled.
 *
 * @param {HTMLElement} el - The target HTMLElement.
 *
 * @param {UpdateElementData} updateData - Update data.
 */
function s_UPDATE_ELEMENT_ORTHO(el, updateData)
{
   const changeSet = updateData.changeSet;
   const data = updateData.data;

   if (changeSet.zIndex)
   {
      el.style.zIndex = typeof data.zIndex === 'number' ? `${data.zIndex}` : null;
   }

   if (changeSet.width)
   {
      el.style.width = typeof data.width === 'number' ? `${data.width}px` : data.width;
   }

   if (changeSet.height)
   {
      el.style.height = typeof data.height === 'number' ? `${data.height}px` : data.height;
   }

   if (changeSet.transformOrigin)
   {
      // When set to 'center' we can simply set the transform to null which is center by default.
      el.style.transformOrigin = data.transformOrigin === 'center' ? null : data.transformOrigin;
   }

   // Update all transforms in order added to transforms object.
   if (changeSet.left || changeSet.top || changeSet.transform)
   {
      el.style.transform = updateData.transforms.getCSSOrtho(data);
   }
}

/**
 * Updates the applied transform data and sets the readble `transform` store.
 *
 * @param {HTMLElement} el - The target HTMLElement.
 *
 * @param {UpdateElementData} updateData - Update element data.
 */
function s_UPDATE_TRANSFORM(el, updateData)
{
   s_VALIDATION_DATA.height = updateData.data.height !== 'auto' ? updateData.data.height :
    updateData.styleCache.offsetHeight;

   s_VALIDATION_DATA.width = updateData.data.width !== 'auto' ? updateData.data.width :
    updateData.styleCache.offsetWidth;

   s_VALIDATION_DATA.marginLeft = updateData.styleCache.marginLeft;

   s_VALIDATION_DATA.marginTop = updateData.styleCache.marginTop;

   // Get transform data. First set constraints including any margin top / left as offsets and width / height. Used
   // when position width / height is 'auto'.
   updateData.transforms.getData(updateData.data, updateData.transformData, s_VALIDATION_DATA);

   updateData.storeTransform.set(updateData.transformData);
}

const s_VALIDATION_DATA = {
   height: void 0,
   width: void 0,
   marginLeft: void 0,
   marginTop: void 0
};
