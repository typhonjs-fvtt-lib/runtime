function noop() { }
function run(fn) {
    return fn();
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}
Promise.resolve();

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable$2(value, start = noop) {
    let stop;
    const subscribers = new Set();
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (const subscriber of subscribers) {
                    subscriber[1]();
                    subscriber_queue.push(subscriber, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.add(subscriber);
        if (subscribers.size === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            subscribers.delete(subscriber);
            if (subscribers.size === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

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
      set(fn(get_store_value(ogStore)));
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
    get: get_store_value
  };
}

var storage$1$1 = typeof window !== "undefined" ? window.localStorage : void 0;
var g$1 = generator(storage$1$1);
var writable$1 = g$1.writable;

var _stores$1 = /*#__PURE__*/new WeakMap();

class LocalStorage$1 {
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

  store.get = () => get_store_value(store);

  return store;
}

var storage$2 = typeof window !== "undefined" ? window.sessionStorage : void 0;
var g = generator(storage$2);
var writable = g.writable;

var _stores = /*#__PURE__*/new WeakMap();

class SessionStorage$1 {
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
    return s_GET_STORE(_classPrivateFieldGet(this, _stores), itemId, defaultValue);
  }

  setItem(itemId, value) {
    const store = s_GET_STORE(_classPrivateFieldGet(this, _stores), itemId);
    store.set(value);
  }

  swapItemBoolean(itemId, defaultValue) {
    const store = s_GET_STORE(_classPrivateFieldGet(this, _stores), itemId, defaultValue);
    const value = store.get();
    const newValue = typeof value === 'boolean' ? !value : false;
    store.set(newValue);
    return newValue;
  }

}

function s_GET_STORE(stores, itemId, defaultValue = void 0) {
  let store = stores.get(itemId);

  if (store === void 0) {
    store = s_CREATE_STORE(itemId, defaultValue);
    stores.set(itemId, store);
  }

  return store;
}

function s_CREATE_STORE(itemId, defaultValue = void 0) {
  try {
    if (sessionStorage.getItem(itemId)) {
      defaultValue = JSON.parse(sessionStorage.getItem(itemId));
    }
  } catch (err) {
    /**/
  }

  const store = writable(itemId, defaultValue);

  store.get = () => get_store_value(store);

  return store;
}

const storage$1 = new LocalStorage$1();

class LocalStorage
{
   static onPluginLoad(ev)
   {
      const prepend = typeof ev?.pluginOptions?.eventPrepend === 'string' ? `${ev.pluginOptions.eventPrepend}:` : '';

      ev.eventbus.on(`${prepend}storage:local:item:get`, storage$1.getItem, storage$1, { guard: true });
      ev.eventbus.on(`${prepend}storage:local:item:boolean:swap`, storage$1.swapItemBoolean, storage$1, { guard: true });
      ev.eventbus.on(`${prepend}storage:local:item:set`, storage$1.setItem, storage$1, { guard: true });
      ev.eventbus.on(`${prepend}storage:local:store:get`, storage$1.getStore, storage$1, { guard: true });
   }
}

const storage = new SessionStorage$1();

class SessionStorage
{
   static onPluginLoad(ev)
   {
      const prepend = typeof ev?.pluginOptions?.eventPrepend === 'string' ? `${ev.pluginOptions.eventPrepend}:` : '';

      ev.eventbus.on(`${prepend}storage:session:item:get`, storage.getItem, storage, { guard: true });
      ev.eventbus.on(`${prepend}storage:session:item:boolean:swap`, storage.swapItemBoolean, storage, { guard: true });
      ev.eventbus.on(`${prepend}storage:session:item:set`, storage.setItem, storage, { guard: true });
      ev.eventbus.on(`${prepend}storage:session:store:get`, storage.getStore, storage, { guard: true });
   }
}

export { LocalStorage, SessionStorage };
//# sourceMappingURL=index.js.map
