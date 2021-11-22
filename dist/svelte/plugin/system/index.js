import { get, writable as writable$2 } from 'svelte/store';
import { noop, run_all, is_function } from 'svelte/internal';
import { TJSGameSettings as TJSGameSettings$1 } from '@typhonjs-fvtt/svelte/store';

function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");

  return _classApplyDescriptorGet(receiver, descriptor);
}

function _classExtractFieldDescriptor(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }

  return privateMap.get(receiver);
}

function _classApplyDescriptorGet(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }

  return descriptor.value;
}

function _checkPrivateRedeclaration(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}

function _classPrivateFieldInitSpec(obj, privateMap, value) {
  _checkPrivateRedeclaration(obj, privateMap);

  privateMap.set(obj, value);
}

// src/generator.ts

function isSimpleDeriver(deriver) {
  return deriver.length < 2;
}

function generator(storage) {
  function readable(key, value, start) {
    return {
      subscribe: writable(key, value, start).subscribe
    };
  }

  function writable(key, value, start = noop) {
    function wrap_start(ogSet) {
      return start(function wrap_set(new_value) {
        if (storage) {
          storage.setItem(key, JSON.stringify(new_value));
        }

        return ogSet(new_value);
      });
    }

    if (storage) {
      if (storage.getItem(key)) {
        value = JSON.parse(storage.getItem(key));
      }

      storage.setItem(key, JSON.stringify(value));
    }

    const ogStore = writable$2(value, start ? wrap_start : void 0);

    function set(new_value) {
      if (storage) {
        storage.setItem(key, JSON.stringify(new_value));
      }

      ogStore.set(new_value);
    }

    function update(fn) {
      set(fn(get(ogStore)));
    }

    function subscribe(run, invalidate = noop) {
      return ogStore.subscribe(run, invalidate);
    }

    return {
      set,
      update,
      subscribe
    };
  }

  function derived(key, stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single ? [stores] : stores;

    if (storage && storage.getItem(key)) {
      initial_value = JSON.parse(storage.getItem(key));
    }

    return readable(key, initial_value, set => {
      let inited = false;
      const values = [];
      let pending = 0;
      let cleanup = noop;

      const sync = () => {
        if (pending) {
          return;
        }

        cleanup();
        const input = single ? values[0] : values;

        if (isSimpleDeriver(fn)) {
          set(fn(input));
        } else {
          const result = fn(input, set);
          cleanup = is_function(result) ? result : noop;
        }
      };

      const unsubscribers = stores_array.map((store, i) => store.subscribe(value => {
        values[i] = value;
        pending &= ~(1 << i);

        if (inited) {
          sync();
        }
      }, () => {
        pending |= 1 << i;
      }));
      inited = true;
      sync();
      return function stop() {
        run_all(unsubscribers);
        cleanup();
      };
    });
  }

  return {
    readable,
    writable,
    derived,
    get: get
  };
}

var storage$1 = typeof window !== "undefined" ? window.localStorage : void 0;
var g$1 = generator(storage$1);
var writable$1 = g$1.writable;

/**
 * @typedef {writable & get} LSStore - The backing Svelte store; a writable w/ get method attached.
 */

var _stores$1 = /*#__PURE__*/new WeakMap();

class LocalStorage$1 {
  constructor() {
    _classPrivateFieldInitSpec(this, _stores$1, {
      writable: true,
      value: new Map()
    });
  }

  /**
   * Get value from the localstorage.
   *
   * @param {string}   key - Key to lookup in localstorage.
   *
   * @param {*}        [defaultValue] - A default value to return if key not present in local storage.
   *
   * @returns {*} Value from local storage or if not defined any default value provided.
   */
  getItem(key, defaultValue) {
    let value = defaultValue;
    const storageValue = localStorage.getItem(key);

    if (storageValue !== void 0) {
      value = JSON.parse(storageValue);
    }

    return value;
  }
  /**
   * Returns the backing Svelte store for the given key; potentially sets a default value if the key
   * is not already set.
   *
   * @param {string}   key - Key to lookup in localstorage.
   *
   * @param {*}        [defaultValue] - A default value to return if key not present in local storage.
   *
   * @returns {LSStore} The Svelte store for this key.
   */


  getStore(key, defaultValue) {
    return s_GET_STORE$1(_classPrivateFieldGet(this, _stores$1), key, defaultValue);
  }
  /**
   * Sets the value for the given key in localstorage.
   *
   * @param {string}   key - Key to lookup in localstorage.
   *
   * @param {*}        value - A value to set for this key.
   */


  setItem(key, value) {
    const store = s_GET_STORE$1(_classPrivateFieldGet(this, _stores$1), key);
    store.set(value);
  }
  /**
   * Convenience method to swap a boolean value stored in local storage.
   *
   * @param {string}   key - Key to lookup in localstorage.
   *
   * @param {boolean}  [defaultValue] - A default value to return if key not present in local storage.
   *
   * @returns {boolean} The boolean swap for the given key.
   */


  swapItemBoolean(key, defaultValue) {
    const store = s_GET_STORE$1(_classPrivateFieldGet(this, _stores$1), key, defaultValue);
    const value = store.get();
    const newValue = typeof value === 'boolean' ? !value : false;
    store.set(newValue);
    return newValue;
  }

}
/**
 * Gets a store from the LSStore Map or creates a new store for the key and a given default value.
 *
 * @param {Map<string, LSStore>} stores - Map containing Svelte stores.
 *
 * @param {string}               key - Key to lookup in stores map.
 *
 * @param {boolean}              [defaultValue] - A default value to set for the store.
 *
 * @returns {LSStore} The store for the given key.
 */

function s_GET_STORE$1(stores, key, defaultValue = void 0) {
  let store = stores.get(key);

  if (store === void 0) {
    store = s_CREATE_STORE$1(key, defaultValue);
    stores.set(key, store);
  }

  return store;
}
/**
 * Creates a new LSStore for the given key.
 *
 * @param {string}   key - Key to lookup in stores map.
 *
 * @param {boolean}  [defaultValue] - A default value to set for the store.
 *
 * @returns {LSStore} The new LSStore.
 */


function s_CREATE_STORE$1(key, defaultValue = void 0) {
  try {
    if (localStorage.getItem(key)) {
      defaultValue = JSON.parse(localStorage.getItem(key));
    }
  } catch (err) {
    /**/
  }

  const store = writable$1(key, defaultValue);

  store.get = () => get(store);

  return store;
}

var storage = typeof window !== "undefined" ? window.sessionStorage : void 0;
var g = generator(storage);
var writable = g.writable;

/**
 * @typedef {writable & get} SSStore - The backing Svelte store; a writable w/ get method attached.
 */

var _stores = /*#__PURE__*/new WeakMap();

class SessionStorage$1 {
  constructor() {
    _classPrivateFieldInitSpec(this, _stores, {
      writable: true,
      value: new Map()
    });
  }

  /**
   * Get value from the sessionstorage.
   *
   * @param {string}   key - Key to lookup in sessionstorage.
   *
   * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
   *
   * @returns {*} Value from session storage or if not defined any default value provided.
   */
  getItem(key, defaultValue) {
    let value = defaultValue;
    const storageValue = sessionStorage.getItem(key);

    if (storageValue !== void 0) {
      value = JSON.parse(storageValue);
    }

    return value;
  }
  /**
   * Returns the backing Svelte store for the given key; potentially sets a default value if the key
   * is not already set.
   *
   * @param {string}   key - Key to lookup in sessionstorage.
   *
   * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
   *
   * @returns {LSStore} The Svelte store for this key.
   */


  getStore(key, defaultValue) {
    return s_GET_STORE(_classPrivateFieldGet(this, _stores), key, defaultValue);
  }
  /**
   * Sets the value for the given key in sessionstorage.
   *
   * @param {string}   key - Key to lookup in sessionstorage.
   *
   * @param {*}        value - A value to set for this key.
   */


  setItem(key, value) {
    const store = s_GET_STORE(_classPrivateFieldGet(this, _stores), key);
    store.set(value);
  }
  /**
   * Convenience method to swap a boolean value stored in session storage.
   *
   * @param {string}   key - Key to lookup in sessionstorage.
   *
   * @param {boolean}  [defaultValue] - A default value to return if key not present in session storage.
   *
   * @returns {boolean} The boolean swap for the given key.
   */


  swapItemBoolean(key, defaultValue) {
    const store = s_GET_STORE(_classPrivateFieldGet(this, _stores), key, defaultValue);
    const value = store.get();
    const newValue = typeof value === 'boolean' ? !value : false;
    store.set(newValue);
    return newValue;
  }

}
/**
 * Gets a store from the SSStore Map or creates a new store for the key and a given default value.
 *
 * @param {Map<string, LSStore>} stores - Map containing Svelte stores.
 *
 * @param {string}               key - Key to lookup in stores map.
 *
 * @param {boolean}              [defaultValue] - A default value to set for the store.
 *
 * @returns {LSStore} The store for the given key.
 */

function s_GET_STORE(stores, key, defaultValue = void 0) {
  let store = stores.get(key);

  if (store === void 0) {
    store = s_CREATE_STORE(key, defaultValue);
    stores.set(key, store);
  }

  return store;
}
/**
 * Creates a new SSStore for the given key.
 *
 * @param {string}   key - Key to lookup in stores map.
 *
 * @param {boolean}  [defaultValue] - A default value to set for the store.
 *
 * @returns {LSStore} The new LSStore.
 */


function s_CREATE_STORE(key, defaultValue = void 0) {
  try {
    if (sessionStorage.getItem(key)) {
      defaultValue = JSON.parse(sessionStorage.getItem(key));
    }
  } catch (err) {
    /**/
  }

  const store = writable(key, defaultValue);

  store.get = () => get(store);

  return store;
}

class LocalStorage
{
   #storage = new LocalStorage$1();

   onPluginLoad(ev)
   {
      const prepend = typeof ev?.pluginOptions?.eventPrepend === 'string' ? `${ev.pluginOptions.eventPrepend}:` : '';

      ev.eventbus.on(`${prepend}storage:local:item:get`, this.#storage.getItem, this.#storage, { guard: true });
      ev.eventbus.on(`${prepend}storage:local:item:boolean:swap`, this.#storage.swapItemBoolean, this.#storage,
       { guard: true });
      ev.eventbus.on(`${prepend}storage:local:item:set`, this.#storage.setItem, this.#storage, { guard: true });
      ev.eventbus.on(`${prepend}storage:local:store:get`, this.#storage.getStore, this.#storage, { guard: true });
   }
}

class SessionStorage
{
   #storage = new SessionStorage$1();

   onPluginLoad(ev)
   {
      const prepend = typeof ev?.pluginOptions?.eventPrepend === 'string' ? `${ev.pluginOptions.eventPrepend}:` : '';

      ev.eventbus.on(`${prepend}storage:session:item:get`, this.#storage.getItem, this.#storage, { guard: true });
      ev.eventbus.on(`${prepend}storage:session:item:boolean:swap`, this.#storage.swapItemBoolean, this.#storage,
       { guard: true });
      ev.eventbus.on(`${prepend}storage:session:item:set`, this.#storage.setItem, this.#storage, { guard: true });
      ev.eventbus.on(`${prepend}storage:session:store:get`, this.#storage.getStore, this.#storage, { guard: true });
   }
}

/**
 * Provides common object manipulation utilities including depth traversal, obtaining accessors, safely setting values /
 * equality tests, and validation.
 */

/**
 * Tests for whether an object is iterable.
 *
 * @param {object} object - An object.
 *
 * @returns {boolean} Whether object is iterable.
 */
function isIterable(object)
{
   if (object === null || object === void 0 || typeof object !== 'object') { return false; }

   return typeof object[Symbol.iterator] === 'function';
}

/**
 * @typedef {object} GameSetting - Defines a game setting.
 *
 * @property {string} moduleId - The ID of the module / system.
 *
 * @property {string} key - The setting key to register.
 *
 * @property {object} options - Configuration for setting data.
 */

/**
 * Provides a TyphonJS plugin to add TJSGameSettings to the plugin eventbus.
 *
 * The following events are available for registration:
 *
 * `tjs:system:game:settings:store:get`      - Invokes `getStore` from backing TJSGameSettings instance.
 * `tjs:system:game:settings:register`       - Registers a setting adding a callback to fire an event on change.
 * `tjs:system:game:settings:register:all`   - Registers multiple settings.
 *
 * The following events are triggered on change of a game setting.
 *
 * `tjs:system:game:settings:change:any`           - Provides an object containing the setting and value.
 * `tjs:system:game:settings:change:<SETTING KEY>` - Provides the value of the keyed event.
 */
class TJSGameSettings
{
   #gameSettings = new TJSGameSettings$1();

   register(moduleId, key, options)
   {
      if (typeof options !== 'object') { throw new TypeError(`TJSGameSettings - register: options is not an object.`); }

      const onChange = typeof options?.onChange === 'function' ? [options.onChange] : [];

      onChange.push((value) =>
      {
         if (this._eventbus)
         {
            this._eventbus.trigger(`tjs:system:game:settings:change:any`, { setting: key, value });
            this._eventbus.trigger(`tjs:system:game:settings:change:${key}`, value);
         }
      });

      this.#gameSettings.register(moduleId, key, { ...options, onChange });
   }

   /**
    * Registers multiple settings.
    *
    * @param {Iterable<GameSetting>} settings - An iterable list of game setting configurations to register.
    */
   registerAll(settings)
   {
      if (!isIterable(settings)) { throw new TypeError(`TJSGameSettings - registerAll: settings is not iterable.`); }

      for (const entry of settings)
      {
         if (typeof entry !== 'object')
         {
            throw new TypeError(`TJSGameSettings - registerAll: entry in settings is not an object.`);
         }

         if (typeof entry.moduleId !== 'string')
         {
            throw new TypeError(`TJSGameSettings - registerAll: entry in settings missing 'moduleId' attribute.`);
         }

         if (typeof entry.key !== 'string')
         {
            throw new TypeError(`TJSGameSettings - registerAll: entry in settings missing 'key' attribute.`);
         }

         if (typeof entry.options !== 'object')
         {
            throw new TypeError(`TJSGameSettings - registerAll: entry in settings missing 'options' attribute.`);
         }

         this.register(entry.moduleId, entry.key, entry.options);
      }
   }

   onPluginLoad(ev)
   {
      this._eventbus = ev.eventbus;

      const opts = { guard: true };

      ev.eventbus.on(`tjs:system:game:settings:store:get`, this.#gameSettings.getStore, this.#gameSettings, opts);
      ev.eventbus.on(`tjs:system:game:settings:register`, this.register, this, opts);
      ev.eventbus.on(`tjs:system:game:settings:register:all`, this.registerAll, this, opts);
   }
}

export { LocalStorage, SessionStorage, TJSGameSettings };
//# sourceMappingURL=index.js.map
