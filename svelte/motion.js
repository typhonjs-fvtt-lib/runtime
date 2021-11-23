function noop() {}

const identity = x => x;

function assign(tar, src) {
  // @ts-ignore
  for (const k in src) tar[k] = src[k];

  return tar;
}

function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === 'object' || typeof a === 'function';
}

const is_client = typeof window !== 'undefined';
let now = is_client ? () => window.performance.now() : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop; // used internally for testing

const tasks = new Set();

function run_tasks(now) {
  tasks.forEach(task => {
    if (!task.c(now)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0) raf(run_tasks);
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */


function loop(callback) {
  let task;
  if (tasks.size === 0) raf(run_tasks);
  return {
    promise: new Promise(fulfill => {
      tasks.add(task = {
        c: callback,
        f: fulfill
      });
    }),

    abort() {
      tasks.delete(task);
    }

  };
} // Track which nodes are claimed during hydration. Unclaimed nodes can then be removed from the DOM
Promise.resolve();

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */


function writable(value, start = noop) {
  let stop;
  const subscribers = new Set();

  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;

      if (stop) {
        // store is ready
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

  return {
    set,
    update,
    subscribe
  };
}

function is_date(obj) {
  return Object.prototype.toString.call(obj) === '[object Date]';
}

function tick_spring(ctx, last_value, current_value, target_value) {
  if (typeof current_value === 'number' || is_date(current_value)) {
    // @ts-ignore
    const delta = target_value - current_value; // @ts-ignore

    const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0

    const spring = ctx.opts.stiffness * delta;
    const damper = ctx.opts.damping * velocity;
    const acceleration = (spring - damper) * ctx.inv_mass;
    const d = (velocity + acceleration) * ctx.dt;

    if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
      return target_value; // settled
    } else {
      ctx.settled = false; // signal loop to keep ticking
      // @ts-ignore

      return is_date(current_value) ? new Date(current_value.getTime() + d) : current_value + d;
    }
  } else if (Array.isArray(current_value)) {
    // @ts-ignore
    return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
  } else if (typeof current_value === 'object') {
    const next_value = {};

    for (const k in current_value) {
      // @ts-ignore
      next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
    } // @ts-ignore


    return next_value;
  } else {
    throw new Error(`Cannot spring ${typeof current_value} values`);
  }
}

function spring(value, opts = {}) {
  const store = writable(value);
  const {
    stiffness = 0.15,
    damping = 0.8,
    precision = 0.01
  } = opts;
  let last_time;
  let task;
  let current_token;
  let last_value = value;
  let target_value = value;
  let inv_mass = 1;
  let inv_mass_recovery_rate = 0;
  let cancel_task = false;

  function set(new_value, opts = {}) {
    target_value = new_value;
    const token = current_token = {};

    if (value == null || opts.hard || spring.stiffness >= 1 && spring.damping >= 1) {
      cancel_task = true; // cancel any running animation

      last_time = now();
      last_value = new_value;
      store.set(value = target_value);
      return Promise.resolve();
    } else if (opts.soft) {
      const rate = opts.soft === true ? .5 : +opts.soft;
      inv_mass_recovery_rate = 1 / (rate * 60);
      inv_mass = 0; // infinite mass, unaffected by spring forces
    }

    if (!task) {
      last_time = now();
      cancel_task = false;
      task = loop(now => {
        if (cancel_task) {
          cancel_task = false;
          task = null;
          return false;
        }

        inv_mass = Math.min(inv_mass + inv_mass_recovery_rate, 1);
        const ctx = {
          inv_mass,
          opts: spring,
          settled: true,
          dt: (now - last_time) * 60 / 1000
        };
        const next_value = tick_spring(ctx, last_value, value, target_value);
        last_time = now;
        last_value = value;
        store.set(value = next_value);

        if (ctx.settled) {
          task = null;
        }

        return !ctx.settled;
      });
    }

    return new Promise(fulfil => {
      task.promise.then(() => {
        if (token === current_token) fulfil();
      });
    });
  }

  const spring = {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe,
    stiffness,
    damping,
    precision
  };
  return spring;
}

function get_interpolator(a, b) {
  if (a === b || a !== a) return () => a;
  const type = typeof a;

  if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
    throw new Error('Cannot interpolate values of different type');
  }

  if (Array.isArray(a)) {
    const arr = b.map((bi, i) => {
      return get_interpolator(a[i], bi);
    });
    return t => arr.map(fn => fn(t));
  }

  if (type === 'object') {
    if (!a || !b) throw new Error('Object cannot be null');

    if (is_date(a) && is_date(b)) {
      a = a.getTime();
      b = b.getTime();
      const delta = b - a;
      return t => new Date(a + t * delta);
    }

    const keys = Object.keys(b);
    const interpolators = {};
    keys.forEach(key => {
      interpolators[key] = get_interpolator(a[key], b[key]);
    });
    return t => {
      const result = {};
      keys.forEach(key => {
        result[key] = interpolators[key](t);
      });
      return result;
    };
  }

  if (type === 'number') {
    const delta = b - a;
    return t => a + t * delta;
  }

  throw new Error(`Cannot interpolate ${type} values`);
}

function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;

  function set(new_value, opts) {
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }

    target_value = new_value;
    let previous_task = task;
    let started = false;
    let {
      delay = 0,
      duration = 400,
      easing = identity,
      interpolate = get_interpolator
    } = assign(assign({}, defaults), opts);

    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }

      store.set(value = target_value);
      return Promise.resolve();
    }

    const start = now() + delay;
    let fn;
    task = loop(now => {
      if (now < start) return true;

      if (!started) {
        fn = interpolate(value, new_value);
        if (typeof duration === 'function') duration = duration(value, new_value);
        started = true;
      }

      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }

      const elapsed = now - start;

      if (elapsed > duration) {
        store.set(value = new_value);
        return false;
      } // @ts-ignore


      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }

  return {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe
  };
}

export { spring, tweened };
//# sourceMappingURL=motion.js.map
