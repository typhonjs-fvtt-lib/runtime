import { get, writable as writable$2 } from 'svelte/store';
import { noop, run_all, is_function } from 'svelte/internal';

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

var _stores$1 = /*#__PURE__*/new WeakMap();

class LocalStorage {
  constructor() {
    _classPrivateFieldInitSpec(this, _stores$1, {
      writable: true,
      value: new Map()
    });
  }

  getItem(itemId, defaultValue) {
    let value;
    const storageValue = localStorage.getItem(itemId);

    if (storageValue !== void 0) {
      value = JSON.parse(storageValue);
    }

    return value;
  }

  getStore(itemId, defaultValue) {
    return s_GET_STORE$1(_classPrivateFieldGet(this, _stores$1), itemId, defaultValue);
  }

  setItem(itemId, value) {
    const store = s_GET_STORE$1(_classPrivateFieldGet(this, _stores$1), itemId);
    store.set(value);
  }

  swapItemBoolean(itemId, defaultValue) {
    const store = s_GET_STORE$1(_classPrivateFieldGet(this, _stores$1), itemId, defaultValue);
    const value = store.get();
    const newValue = typeof value === 'boolean' ? !value : false;
    store.set(newValue);
    return newValue;
  }

}

function s_GET_STORE$1(stores, itemId, defaultValue = void 0) {
  let store = stores.get(itemId);

  if (store === void 0) {
    store = s_CREATE_STORE$1(itemId, defaultValue);
    stores.set(itemId, store);
  }

  return store;
}

function s_CREATE_STORE$1(itemId, defaultValue = void 0) {
  try {
    if (localStorage.getItem(itemId)) {
      defaultValue = JSON.parse(localStorage.getItem(itemId));
    }
  } catch (err) {
    /**/
  }

  const store = writable$1(itemId, defaultValue);

  store.get = () => get(store);

  return store;
}

var storage = typeof window !== "undefined" ? window.sessionStorage : void 0;
var g = generator(storage);
var writable = g.writable;

var _stores = /*#__PURE__*/new WeakMap();

class SessionStorage {
  constructor() {
    _classPrivateFieldInitSpec(this, _stores, {
      writable: true,
      value: new Map()
    });
  }

  getItem(itemId) {
    let value;
    const storageValue = sessionStorage.getItem(itemId);

    if (storageValue !== void 0) {
      value = JSON.parse(storageValue);
    }

    return value;
  }

  getStore(itemId, defaultValue) {
    return s_GET_STORE$2(_classPrivateFieldGet(this, _stores), itemId, defaultValue);
  }

  setItem(itemId, value) {
    const store = s_GET_STORE$2(_classPrivateFieldGet(this, _stores), itemId);
    store.set(value);
  }

  swapItemBoolean(itemId, defaultValue) {
    const store = s_GET_STORE$2(_classPrivateFieldGet(this, _stores), itemId, defaultValue);
    const value = store.get();
    const newValue = typeof value === 'boolean' ? !value : false;
    store.set(newValue);
    return newValue;
  }

}

function s_GET_STORE$2(stores, itemId, defaultValue = void 0) {
  let store = stores.get(itemId);

  if (store === void 0) {
    store = s_CREATE_STORE$2(itemId, defaultValue);
    stores.set(itemId, store);
  }

  return store;
}

function s_CREATE_STORE$2(itemId, defaultValue = void 0) {
  try {
    if (sessionStorage.getItem(itemId)) {
      defaultValue = JSON.parse(sessionStorage.getItem(itemId));
    }
  } catch (err) {
    /**/
  }

  const store = writable(itemId, defaultValue);

  store.get = () => get(store);

  return store;
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
 * Registers game settings and creates a backing Svelte store for each setting. It is possible to add multiple
 * `onChange` callbacks on registration.
 */
class TJSGameSettings
{
   /**
    * @type {*}
    */
   #stores = new Map();

   getStore(key)
   {
      if (!this.#stores.has(key))
      {
         console.warn(`TJSGameSettings - getStore: '${key}' is not a registered setting.`);
         return;
      }

      return s_GET_STORE(this.#stores, key);
   }

   register(moduleId, key, options = {})
   {
      if (typeof options !== 'object') { throw new TypeError(`TJSGameSettings - register: options is not an object.`); }

      const onchangeFunctions = [];

      // Handle loading any existing `onChange` callbacks.
      if (isIterable(options?.onChange))
      {
         for (const entry of options.onChange)
         {
            if (typeof entry === 'function') { onchangeFunctions.push(entry); }
         }
      }
      else if (typeof options.onChange === 'function')
      {
         onchangeFunctions.push(options.onChange);
      }

      // Provides an `onChange` callback to update the associated store.
      onchangeFunctions.push((value) =>
      {
         const store = s_GET_STORE(this.#stores, key);
         if (store) { store.set(value); }
      });

      // Provides the final onChange callback that iterates over all the stored onChange callbacks.
      const onChange = (value) =>
      {
         for (const entry of onchangeFunctions) { entry(value); }
      };

      game.settings.register(moduleId, key, { ...options, onChange });

      // Set new store value with existing setting or default value.
      const newStore = s_GET_STORE(this.#stores, key);
      newStore.set(game.settings.get(moduleId, key));
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
}


function s_GET_STORE(stores, key)
{
   let store = stores.get(key);
   if (store === void 0)
   {
      store = s_CREATE_STORE();
      stores.set(key, store);
   }

   return store;
}

function s_CREATE_STORE()
{
   const store = writable$2(void 0);
   store.get = () => get(store);

   return store;
}

export { LocalStorage, SessionStorage, TJSGameSettings };
//# sourceMappingURL=index.js.map
