function noop() { }
const identity = x => x;
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
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
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
    component.$$.on_destroy.push(subscribe(store, callback));
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function get_all_dirty_from_scope($$scope) {
    if ($$scope.ctx.length > 32) {
        const dirty = [];
        const length = $$scope.ctx.length / 32;
        for (let i = 0; i < length; i++) {
            dirty[i] = -1;
        }
        return dirty;
    }
    return -1;
}
function action_destroyer(action_result) {
    return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}

const is_client = typeof window !== 'undefined';
let now = is_client
    ? () => window.performance.now()
    : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

const tasks = new Set();
function run_tasks(now) {
    tasks.forEach(task => {
        if (!task.c(now)) {
            tasks.delete(task);
            task.f();
        }
    });
    if (tasks.size !== 0)
        raf(run_tasks);
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */
function loop(callback) {
    let task;
    if (tasks.size === 0)
        raf(run_tasks);
    return {
        promise: new Promise(fulfill => {
            tasks.add(task = { c: callback, f: fulfill });
        }),
        abort() {
            tasks.delete(task);
        }
    };
}
function append(target, node) {
    target.appendChild(node);
}
function append_styles(target, style_sheet_id, styles) {
    const append_styles_to = get_root_for_style(target);
    if (!append_styles_to.getElementById(style_sheet_id)) {
        const style = element('style');
        style.id = style_sheet_id;
        style.textContent = styles;
        append_stylesheet(append_styles_to, style);
    }
}
function get_root_for_style(node) {
    if (!node)
        return document;
    const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
    if (root && root.host) {
        return root;
    }
    return node.ownerDocument;
}
function append_empty_stylesheet(node) {
    const style_element = element('style');
    append_stylesheet(get_root_for_style(node), style_element);
    return style_element;
}
function append_stylesheet(node, style) {
    append(node.head || node, style);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
// unfortunately this can't be a constant as that wouldn't be tree-shakeable
// so we cache the result instead
let crossorigin;
function is_crossorigin() {
    if (crossorigin === undefined) {
        crossorigin = false;
        try {
            if (typeof window !== 'undefined' && window.parent) {
                void window.parent.document;
            }
        }
        catch (error) {
            crossorigin = true;
        }
    }
    return crossorigin;
}
function add_resize_listener(node, fn) {
    const computed_style = getComputedStyle(node);
    if (computed_style.position === 'static') {
        node.style.position = 'relative';
    }
    const iframe = element('iframe');
    iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
        'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    const crossorigin = is_crossorigin();
    let unsubscribe;
    if (crossorigin) {
        iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
        unsubscribe = listen(window, 'message', (event) => {
            if (event.source === iframe.contentWindow)
                fn();
        });
    }
    else {
        iframe.src = 'about:blank';
        iframe.onload = () => {
            unsubscribe = listen(iframe.contentWindow, 'resize', fn);
        };
    }
    append(node, iframe);
    return () => {
        if (crossorigin) {
            unsubscribe();
        }
        else if (unsubscribe && iframe.contentWindow) {
            unsubscribe();
        }
        detach(iframe);
    };
}
function custom_event(type, detail, bubbles = false) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, bubbles, false, detail);
    return e;
}

const active_docs = new Set();
let active = 0;
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = get_root_for_style(node);
    active_docs.add(doc);
    const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
    const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
    if (!current_rules[name]) {
        current_rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    const previous = (node.style.animation || '').split(', ');
    const next = previous.filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
        node.style.animation = next.join(', ');
        active -= deleted;
        if (!active)
            clear_rules();
    }
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        active_docs.forEach(doc => {
            const stylesheet = doc.__svelte_stylesheet;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            doc.__svelte_rules = {};
        });
        active_docs.clear();
    });
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
function getContext(key) {
    return get_current_component().$$.context.get(key);
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
const null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
    let config = fn(node, params);
    let running = false;
    let animation_name;
    let task;
    let uid = 0;
    function cleanup() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
        tick(0, 1);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        if (task)
            task.abort();
        running = true;
        add_render_callback(() => dispatch(node, true, 'start'));
        task = loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(1, 0);
                    dispatch(node, true, 'end');
                    cleanup();
                    return running = false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(t, 1 - t);
                }
            }
            return running;
        });
    }
    let started = false;
    return {
        start() {
            if (started)
                return;
            started = true;
            delete_rule(node);
            if (is_function(config)) {
                config = config();
                wait().then(go);
            }
            else {
                go();
            }
        },
        invalidate() {
            started = false;
        },
        end() {
            if (running) {
                cleanup();
                running = false;
            }
        }
    };
}
function create_out_transition(node, fn, params) {
    let config = fn(node, params);
    let running = true;
    let animation_name;
    const group = outros;
    group.r += 1;
    function go() {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        if (css)
            animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
        const start_time = now() + delay;
        const end_time = start_time + duration;
        add_render_callback(() => dispatch(node, false, 'start'));
        loop(now => {
            if (running) {
                if (now >= end_time) {
                    tick(0, 1);
                    dispatch(node, false, 'end');
                    if (!--group.r) {
                        // this will result in `end()` being called,
                        // so we don't need to clean up here
                        run_all(group.c);
                    }
                    return false;
                }
                if (now >= start_time) {
                    const t = easing((now - start_time) / duration);
                    tick(1 - t, t);
                }
            }
            return running;
        });
    }
    if (is_function(config)) {
        wait().then(() => {
            // @ts-ignore
            config = config();
            go();
        });
    }
    else {
        go();
    }
    return {
        end(reset) {
            if (reset && config.tick) {
                config.tick(1, 0);
            }
            if (running) {
                if (animation_name)
                    delete_rule(node, animation_name);
                running = false;
            }
        }
    };
}

function get_spread_update(levels, updates) {
    const update = {};
    const to_null_out = {};
    const accounted_for = { $$scope: 1 };
    let i = levels.length;
    while (i--) {
        const o = levels[i];
        const n = updates[i];
        if (n) {
            for (const key in o) {
                if (!(key in n))
                    to_null_out[key] = 1;
            }
            for (const key in n) {
                if (!accounted_for[key]) {
                    update[key] = n[key];
                    accounted_for[key] = 1;
                }
            }
            levels[i] = n;
        }
        else {
            for (const key in o) {
                accounted_for[key] = 1;
            }
        }
    }
    for (const key in to_null_out) {
        if (!(key in update))
            update[key] = undefined;
    }
    return update;
}
function get_spread_object(spread_props) {
    return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

const s_DEFAULT_TRANSITION = () => void 0;
const s_DEFAULT_TRANSITION_OPTIONS = {};

/**
 * Localize a string including variable formatting for input arguments. Provide a string ID which defines the localized
 * template. Variables can be included in the template enclosed in braces and will be substituted using those named
 * keys.
 *
 * @param {string}   stringId - The string ID to translate.
 *
 * @param {object}   [data] - Provided input data.
 *
 * @returns {string} The translated and formatted string
 */
function localize(stringId, data)
{
   const result = typeof data !== 'object' ? game.i18n.localize(stringId) : game.i18n.format(stringId, data);
   return result !== void 0 ? result : '';
}

/**
 * Provides a method to determine if the passed in Svelte component has a getter accessor.
 *
 * @param {*}        component - Svelte component.
 *
 * @param {string}   accessor - Accessor to test.
 *
 * @returns {boolean} Whether the component has the getter for accessor.
 */
function hasGetter(component, accessor)
{
   if (component === null || component === void 0) { return false; }

   // Get the prototype which is the parent SvelteComponent that has any getter / setters.
   const prototype = Object.getPrototypeOf(component);
   const descriptor = Object.getOwnPropertyDescriptor(prototype, accessor);

   return !(descriptor === void 0 || descriptor.get === void 0);
}

/**
 * Provides basic duck typing to determine if the provided function is a constructor function for a Svelte component.
 *
 * @param {*}  comp - Data to check as a Svelte component.
 *
 * @returns {boolean} Whether basic duck typing succeeds.
 */
function isSvelteComponent(comp)
{
   if (comp === null || comp === void 0 || typeof comp !== 'function') { return false; }

   return typeof window !== void 0 ?
    typeof comp.prototype.$destroy === 'function' && typeof comp.prototype.$on === 'function' : // client-side
     typeof comp.render === 'function'; // server-side
}

/**
 * Runs outro transition then destroys Svelte component.
 *
 * Workaround for https://github.com/sveltejs/svelte/issues/4056
 *
 * @param {SvelteComponent}   instance - A Svelte component.
 */
async function outroAndDestroy(instance)
{
   return new Promise((resolve) =>
   {
      if (instance.$$.fragment && instance.$$.fragment.o)
      {
         group_outros();
         transition_out(instance.$$.fragment, 0, 0, () =>
         {
            instance.$destroy();
            resolve();
         });
         check_outros();
      }
      else
      {
         instance.$destroy();
         resolve();
      }
   });
}

/**
 * Parses a TyphonJS Svelte config object ensuring that classes specified are Svelte components and props are set
 * correctly.
 *
 * @param {object}   config - Svelte config object.
 *
 * @param {*}        [thisArg] - `This` reference to set for invoking any props function.
 *
 * @returns {object} The processed Svelte config object.
 */
function parseSvelteConfig(config, thisArg = void 0)
{
   if (typeof config !== 'object')
   {
      throw new TypeError(`parseSvelteConfig - 'config' is not an object:\n${JSON.stringify(config)}.`);
   }

   if (!isSvelteComponent(config.class))
   {
      throw new TypeError(
       `parseSvelteConfig - 'class' is not a Svelte component constructor for config:\n${JSON.stringify(config)}.`);
   }

   if (config.hydrate !== void 0 && typeof config.hydrate !== 'boolean')
   {
      throw new TypeError(
       `parseSvelteConfig - 'hydrate' is not a boolean for config:\n${JSON.stringify(config)}.`);
   }

   if (config.intro !== void 0 && typeof config.intro !== 'boolean')
   {
      throw new TypeError(
       `parseSvelteConfig - 'intro' is not a boolean for config:\n${JSON.stringify(config)}.`);
   }

   if (config.target !== void 0 && typeof config.target !== 'string' && !(config.target instanceof HTMLElement) &&
    !(config.target instanceof ShadowRoot) && !(config.target instanceof DocumentFragment))
   {
      throw new TypeError(
       `parseSvelteConfig - 'target' is not a string, HTMLElement, ShadowRoot, or DocumentFragment for config:\n${
        JSON.stringify(config)}.`);
   }

   if (config.anchor !== void 0 && typeof config.anchor !== 'string' && !(config.anchor instanceof HTMLElement) &&
    !(config.anchor instanceof ShadowRoot) && !(config.anchor instanceof DocumentFragment))
   {
      throw new TypeError(
       `parseSvelteConfig - 'anchor' is not a string, HTMLElement, ShadowRoot, or DocumentFragment for config:\n${
        JSON.stringify(config)}.`);
   }

   if (config.context !== void 0 && typeof config.context !== 'function' && !(config.context instanceof Map) &&
    typeof config.context !== 'object')
   {
      throw new TypeError(
       `parseSvelteConfig - 'context' is not a Map, function or object for config:\n${JSON.stringify(config)}.`);
   }

   // Validate extra TyphonJS options --------------------------------------------------------------------------------

   // `selectorTarget` optionally stores a target element found in main element.
   if (config.selectorTarget !== void 0 && typeof config.selectorTarget !== 'string')
   {
      throw new TypeError(
       `parseSvelteConfig - 'selectorTarget' is not a string for config:\n${JSON.stringify(config)}.`);
   }

   // `options` stores `injectApp`, `injectEventbus`, and `selectorElement`.
   if (config.options !== void 0 && typeof config.options !== 'object')
   {
      throw new TypeError(
       `parseSvelteConfig - 'options' is not an object for config:\n${JSON.stringify(config)}.`);
   }

   // Validate TyphonJS standard options.
   if (config.options !== void 0)
   {
      if (config.options.injectApp !== void 0 && typeof config.options.injectApp !== 'boolean')
      {
         throw new TypeError(
          `parseSvelteConfig - 'options.injectApp' is not a boolean for config:\n${JSON.stringify(config)}.`);
      }

      if (config.options.injectEventbus !== void 0 && typeof config.options.injectEventbus !== 'boolean')
      {
         throw new TypeError(
          `parseSvelteConfig - 'options.injectEventbus' is not a boolean for config:\n${JSON.stringify(config)}.`);
      }

      // `selectorElement` optionally stores a main element selector to be found in a HTMLElement target.
      if (config.options.selectorElement !== void 0 && typeof config.options.selectorElement !== 'string')
      {
         throw new TypeError(
          `parseSvelteConfig - 'selectorElement' is not a string for config:\n${JSON.stringify(config)}.`);
      }
   }

   const svelteConfig = { ...config };

   // Delete extra Svelte options.
   delete svelteConfig.options;

   let externalContext = {};

   // If a context callback function is provided then invoke it with `this` being the Foundry app.
   // If an object is returned it adds the entries to external context.
   if (typeof svelteConfig.context === 'function')
   {
      const contextFunc = svelteConfig.context;
      delete svelteConfig.context;

      const result = contextFunc.call(thisArg);
      if (typeof result === 'object')
      {
         externalContext = { ...result };
      }
      else
      {
         throw new Error(`parseSvelteConfig - 'context' is a function that did not return an object for config:\n${
          JSON.stringify(config)}`);
      }
   }
   else if (svelteConfig.context instanceof Map)
   {
      externalContext = Object.fromEntries(svelteConfig.context);
      delete svelteConfig.context;
   }
   else if (typeof svelteConfig.context === 'object')
   {
      externalContext = svelteConfig.context;
      delete svelteConfig.context;
   }

   // If a props is a function then invoke it with `this` being the Foundry app.
   // If an object is returned set it as the props.
   svelteConfig.props = s_PROCESS_PROPS(svelteConfig.props, thisArg, config);

   // Process children components attaching to external context.
   if (Array.isArray(svelteConfig.children))
   {
      const children = [];

      for (let cntr = 0; cntr < svelteConfig.children.length; cntr++)
      {
         const child = svelteConfig.children[cntr];

         if (!isSvelteComponent(child.class))
         {
            throw new Error(`parseSvelteConfig - 'class' is not a Svelte component for child[${cntr}] for config:\n${
             JSON.stringify(config)}`);
         }

         child.props = s_PROCESS_PROPS(child.props, thisArg, config);

         children.push(child);
      }

      if (children.length > 0)
      {
         externalContext.children = children;
      }

      delete svelteConfig.children;
   }
   else if (typeof svelteConfig.children === 'object')
   {
      if (!isSvelteComponent(svelteConfig.children.class))
      {
         throw new Error(`parseSvelteConfig - 'class' is not a Svelte component for children object for config:\n${
          JSON.stringify(config)}`);
      }

      svelteConfig.children.props = s_PROCESS_PROPS(svelteConfig.children.props, thisArg, config);

      externalContext.children = [svelteConfig.children];
      delete svelteConfig.children;
   }

   if (!(svelteConfig.context instanceof Map))
   {
      svelteConfig.context = new Map();
   }

   svelteConfig.context.set('external', externalContext);

   return svelteConfig;
}

/**
 * Processes Svelte props. Potentially props can be a function to invoke with `thisArg`.
 *
 * @param {object|Function}   props - Svelte props.
 *
 * @param {*}                 thisArg - `This` reference to set for invoking any props function.
 *
 * @param {object}            config - Svelte config
 *
 * @returns {object|void}     Svelte props.
 */
function s_PROCESS_PROPS(props, thisArg, config)
{
   // If a props is a function then invoke it with `this` being the Foundry app.
   // If an object is returned set it as the props.
   if (typeof props === 'function')
   {
      const result = props.call(thisArg);
      if (typeof result === 'object')
      {
         return result;
      }
      else
      {
         throw new Error(`parseSvelteConfig - 'props' is a function that did not return an object for config:\n${
          JSON.stringify(config)}`);
      }
   }
   else if (typeof props === 'object')
   {
      return props;
   }
   else if (props !== void 0)
   {
      throw new Error(
       `parseSvelteConfig - 'props' is not a function or an object for config:\n${JSON.stringify(config)}`);
   }

   return {};
}

/**
 * Defines the application shell contract. If Svelte components export getter / setters for the following properties
 * then that component is considered an application shell.
 *
 * @type {string[]}
 */
const applicationShellContract = ['elementRoot'];

Object.freeze(applicationShellContract);

/**
 * Provides a method to determine if the passed in object is ApplicationShell or TJSApplicationShell.
 *
 * @param {*}  component - Object / component to test.
 *
 * @returns {boolean} Whether the component is a ApplicationShell or TJSApplicationShell.
 */
function isApplicationShell(component)
{
   if (component === null || component === void 0) { return false; }

   // Get the prototype which is the parent SvelteComponent that has any getter / setters.
   const prototype = Object.getPrototypeOf(component);

   // Verify the application shell contract. If the accessors (getters / setters) are defined for
   // `applicationShellContract`.
   for (const accessor of applicationShellContract)
   {
      const descriptor = Object.getOwnPropertyDescriptor(prototype, accessor);
      if (descriptor === void 0 || descriptor.get === void 0 || descriptor.set === void 0) { return false; }
   }

   return true;
}

const subscriber_queue = [];
/**
 * Creates a `Readable` store that allows reading by subscription.
 * @param value initial value
 * @param {StartStopNotifier}start start and stop notifications for subscriptions
 */
function readable(value, start) {
    return {
        subscribe: writable(value, start).subscribe
    };
}
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
function derived(stores, fn, initial_value) {
    const single = !Array.isArray(stores);
    const stores_array = single
        ? [stores]
        : stores;
    const auto = fn.length < 2;
    return readable(initial_value, (set) => {
        let inited = false;
        const values = [];
        let pending = 0;
        let cleanup = noop;
        const sync = () => {
            if (pending) {
                return;
            }
            cleanup();
            const result = fn(single ? values[0] : values, set);
            if (auto) {
                set(result);
            }
            else {
                cleanup = is_function(result) ? result : noop;
            }
        };
        const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
            values[i] = value;
            pending &= ~(1 << i);
            if (inited) {
                sync();
            }
        }, () => {
            pending |= (1 << i);
        }));
        inited = true;
        sync();
        return function stop() {
            run_all(unsubscribers);
            cleanup();
        };
    });
}

/**
 * Provides common object manipulation utilities including depth traversal, obtaining accessors, safely setting values /
 * equality tests, and validation.
 */

/**
 * Provides a way to safely access an objects data / entries given an accessor string which describes the
 * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
 * to walk.
 *
 * @param {object}   data - An object to access entry data.
 *
 * @param {string}   accessor - A string describing the entries to access.
 *
 * @param {*}        defaultValue - (Optional) A default value to return if an entry for accessor is not found.
 *
 * @returns {object} The data object.
 */
function safeAccess(data, accessor, defaultValue = void 0)
{
   if (typeof data !== 'object') { return defaultValue; }
   if (typeof accessor !== 'string') { return defaultValue; }

   const access = accessor.split('.');

   // Walk through the given object by the accessor indexes.
   for (let cntr = 0; cntr < access.length; cntr++)
   {
      // If the next level of object access is undefined or null then return the empty string.
      if (typeof data[access[cntr]] === 'undefined' || data[access[cntr]] === null) { return defaultValue; }

      data = data[access[cntr]];
   }

   return data;
}

/**
 * Provides a way to safely set an objects data / entries given an accessor string which describes the
 * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
 * to walk.
 *
 * @param {object}   data - An object to access entry data.
 *
 * @param {string}   accessor - A string describing the entries to access.
 *
 * @param {*}        value - A new value to set if an entry for accessor is found.
 *
 * @param {string}   [operation='set'] - Operation to perform including: 'add', 'div', 'mult', 'set',
 *                                       'set-undefined', 'sub'.
 *
 * @param {boolean}  [createMissing=true] - If true missing accessor entries will be created as objects
 *                                          automatically.
 *
 * @returns {boolean} True if successful.
 */
function safeSet(data, accessor, value, operation = 'set', createMissing = true)
{
   if (typeof data !== 'object') { throw new TypeError(`safeSet Error: 'data' is not an 'object'.`); }
   if (typeof accessor !== 'string') { throw new TypeError(`safeSet Error: 'accessor' is not a 'string'.`); }

   const access = accessor.split('.');

   // Walk through the given object by the accessor indexes.
   for (let cntr = 0; cntr < access.length; cntr++)
   {
      // If data is an array perform validation that the accessor is a positive integer otherwise quit.
      if (Array.isArray(data))
      {
         const number = (+access[cntr]);

         if (!Number.isInteger(number) || number < 0) { return false; }
      }

      if (cntr === access.length - 1)
      {
         switch (operation)
         {
            case 'add':
               data[access[cntr]] += value;
               break;

            case 'div':
               data[access[cntr]] /= value;
               break;

            case 'mult':
               data[access[cntr]] *= value;
               break;

            case 'set':
               data[access[cntr]] = value;
               break;

            case 'set-undefined':
               if (typeof data[access[cntr]] === 'undefined') { data[access[cntr]] = value; }
               break;

            case 'sub':
               data[access[cntr]] -= value;
               break;
         }
      }
      else
      {
         // If createMissing is true and the next level of object access is undefined then create a new object entry.
         if (createMissing && typeof data[access[cntr]] === 'undefined') { data[access[cntr]] = {}; }

         // Abort if the next level is null or not an object and containing a value.
         if (data[access[cntr]] === null || typeof data[access[cntr]] !== 'object') { return false; }

         data = data[access[cntr]];
      }
   }

   return true;
}

function ownKeys$1(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2$1(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys$1(Object(source), true).forEach(function (key) {
        _defineProperty$1(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys$1(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classPrivateFieldGet$1(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor$1(receiver, privateMap, "get");

  return _classApplyDescriptorGet$1(receiver, descriptor);
}

function _classPrivateFieldSet$1(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor$1(receiver, privateMap, "set");

  _classApplyDescriptorSet$1(receiver, descriptor, value);

  return value;
}

function _classExtractFieldDescriptor$1(receiver, privateMap, action) {
  if (!privateMap.has(receiver)) {
    throw new TypeError("attempted to " + action + " private field on non-instance");
  }

  return privateMap.get(receiver);
}

function _classApplyDescriptorGet$1(receiver, descriptor) {
  if (descriptor.get) {
    return descriptor.get.call(receiver);
  }

  return descriptor.value;
}

function _classApplyDescriptorSet$1(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }

    descriptor.value = value;
  }
}

function _classPrivateMethodGet$1(receiver, privateSet, fn) {
  if (!privateSet.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  return fn;
}

function _checkPrivateRedeclaration$1(obj, privateCollection) {
  if (privateCollection.has(obj)) {
    throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
}

function _classPrivateFieldInitSpec$1(obj, privateMap, value) {
  _checkPrivateRedeclaration$1(obj, privateMap);

  privateMap.set(obj, value);
}

function _classPrivateMethodInitSpec$1(obj, privateSet) {
  _checkPrivateRedeclaration$1(obj, privateSet);

  privateSet.add(obj);
}

/* src\modules\component\TJSContainer.svelte generated by Svelte v3.44.1 */

function add_css$5(target) {
  append_styles(target, "svelte-1s361pr", "p.svelte-1s361pr{color:red;font-size:18px}");
}

function get_each_context$3(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[2] = list[i];
  return child_ctx;
} // (12:15) 


function create_if_block_1$3(ctx) {
  let p;
  return {
    c() {
      p = element("p");
      p.textContent = "Container warning: No children.";
      attr(p, "class", "svelte-1s361pr");
    },

    m(target, anchor) {
      insert(target, p, anchor);
    },

    p: noop,
    i: noop,
    o: noop,

    d(detaching) {
      if (detaching) detach(p);
    }

  };
} // (8:0) {#if Array.isArray(children)}


function create_if_block$4(ctx) {
  let each_1_anchor;
  let current;
  let each_value =
  /*children*/
  ctx[1];
  let each_blocks = [];

  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
  }

  const out = i => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });

  return {
    c() {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }

      each_1_anchor = empty();
    },

    m(target, anchor) {
      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(target, anchor);
      }

      insert(target, each_1_anchor, anchor);
      current = true;
    },

    p(ctx, dirty) {
      if (dirty &
      /*children*/
      2) {
        each_value =
        /*children*/
        ctx[1];
        let i;

        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$3(ctx, each_value, i);

          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$3(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
          }
        }

        group_outros();

        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }

        check_outros();
      }
    },

    i(local) {
      if (current) return;

      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }

      current = true;
    },

    o(local) {
      each_blocks = each_blocks.filter(Boolean);

      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }

      current = false;
    },

    d(detaching) {
      destroy_each(each_blocks, detaching);
      if (detaching) detach(each_1_anchor);
    }

  };
} // (9:4) {#each children as child}


function create_each_block$3(ctx) {
  let switch_instance;
  let switch_instance_anchor;
  let current;
  const switch_instance_spread_levels = [
  /*child*/
  ctx[2].props];
  var switch_value =
  /*child*/
  ctx[2].class;

  function switch_props(ctx) {
    let switch_instance_props = {};

    for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
      switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    }

    return {
      props: switch_instance_props
    };
  }

  if (switch_value) {
    switch_instance = new switch_value(switch_props());
  }

  return {
    c() {
      if (switch_instance) create_component(switch_instance.$$.fragment);
      switch_instance_anchor = empty();
    },

    m(target, anchor) {
      if (switch_instance) {
        mount_component(switch_instance, target, anchor);
      }

      insert(target, switch_instance_anchor, anchor);
      current = true;
    },

    p(ctx, dirty) {
      const switch_instance_changes = dirty &
      /*children*/
      2 ? get_spread_update(switch_instance_spread_levels, [get_spread_object(
      /*child*/
      ctx[2].props)]) : {};

      if (switch_value !== (switch_value =
      /*child*/
      ctx[2].class)) {
        if (switch_instance) {
          group_outros();
          const old_component = switch_instance;
          transition_out(old_component.$$.fragment, 1, 0, () => {
            destroy_component(old_component, 1);
          });
          check_outros();
        }

        if (switch_value) {
          switch_instance = new switch_value(switch_props());
          create_component(switch_instance.$$.fragment);
          transition_in(switch_instance.$$.fragment, 1);
          mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
        } else {
          switch_instance = null;
        }
      } else if (switch_value) {
        switch_instance.$set(switch_instance_changes);
      }
    },

    i(local) {
      if (current) return;
      if (switch_instance) transition_in(switch_instance.$$.fragment, local);
      current = true;
    },

    o(local) {
      if (switch_instance) transition_out(switch_instance.$$.fragment, local);
      current = false;
    },

    d(detaching) {
      if (detaching) detach(switch_instance_anchor);
      if (switch_instance) destroy_component(switch_instance, detaching);
    }

  };
}

function create_fragment$a(ctx) {
  let show_if;
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$4, create_if_block_1$3];
  const if_blocks = [];

  function select_block_type(ctx, dirty) {
    if (show_if == null || dirty &
    /*children*/
    2) show_if = !!Array.isArray(
    /*children*/
    ctx[1]);
    if (show_if) return 0;
    if (
    /*warn*/
    ctx[0]) return 1;
    return -1;
  }

  if (~(current_block_type_index = select_block_type(ctx, -1))) {
    if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  }

  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },

    m(target, anchor) {
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].m(target, anchor);
      }

      insert(target, if_block_anchor, anchor);
      current = true;
    },

    p(ctx, [dirty]) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx, dirty);

      if (current_block_type_index === previous_block_index) {
        if (~current_block_type_index) {
          if_blocks[current_block_type_index].p(ctx, dirty);
        }
      } else {
        if (if_block) {
          group_outros();
          transition_out(if_blocks[previous_block_index], 1, 1, () => {
            if_blocks[previous_block_index] = null;
          });
          check_outros();
        }

        if (~current_block_type_index) {
          if_block = if_blocks[current_block_type_index];

          if (!if_block) {
            if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
            if_block.c();
          } else {
            if_block.p(ctx, dirty);
          }

          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        } else {
          if_block = null;
        }
      }
    },

    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },

    o(local) {
      transition_out(if_block);
      current = false;
    },

    d(detaching) {
      if (~current_block_type_index) {
        if_blocks[current_block_type_index].d(detaching);
      }

      if (detaching) detach(if_block_anchor);
    }

  };
}

function instance$a($$self, $$props, $$invalidate) {
  let {
    warn = false
  } = $$props;
  let {
    children = void 0
  } = $$props;

  $$self.$$set = $$props => {
    if ('warn' in $$props) $$invalidate(0, warn = $$props.warn);
    if ('children' in $$props) $$invalidate(1, children = $$props.children);
  };

  return [warn, children];
}

class TJSContainer extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$a, create_fragment$a, safe_not_equal, {
      warn: 0,
      children: 1
    }, add_css$5);
  }

  get warn() {
    return this.$$.ctx[0];
  }

  set warn(warn) {
    this.$$set({
      warn
    });
    flush();
  }

  get children() {
    return this.$$.ctx[1];
  }

  set children(children) {
    this.$$set({
      children
    });
    flush();
  }

}
/**
 * Provides an action to enable pointer dragging of an HTMLElement and invoke `setPosition` on given Positionable
 * object provided. When the attached boolean store state changes the draggable action is enabled or disabled.
 *
 * @param {HTMLElement}       node - The node associated with the action.
 *
 * @param {object}            params - Required parameters.
 *
 * @param {Positionable}      params.positionable - A positionable object.
 *
 * @param {Readable<boolean>} params.booleanStore - A Svelte store that contains a boolean.
 *
 * @returns {{update: Function, destroy: Function}} The action lifecycle methods.
 */


function draggable(node, {
  positionable,
  booleanStore
}) {
  /**
   * Duplicate the app / Positionable starting position to track differences.
   *
   * @type {object}
   */
  let position = null;
  /**
   * Stores the initial X / Y on drag down.
   *
   * @type {object}
   */

  let initialPosition = {};
  /**
   * Throttle mousemove event handling to 60fps
   *
   * @type {number}
   */

  let moveTime = 0;
  /**
   * Stores the active state and is used to cut off any active dragging when the store value changes.
   *
   * @type {Readable<boolean>}
   */

  let active = booleanStore;
  /**
   * Remember event handlers associated with this action so they may be later unregistered.
   *
   * @type {object}
   */

  const handlers = {
    dragDown: ['pointerdown', e => onDragPointerDown(e), false],
    dragMove: ['pointermove', e => onDragPointerMove(e), false],
    dragUp: ['pointerup', e => onDragPointerUp(e), false]
  };
  /**
   * Activates listeners.
   */

  function activateListeners() {
    active = true; // Drag handlers

    node.addEventListener(...handlers.dragDown);
    node.classList.add('draggable');
  }
  /**
   * Removes listeners.
   */


  function removeListeners() {
    active = false; // Drag handlers

    node.removeEventListener(...handlers.dragDown);
    node.removeEventListener(...handlers.dragMove);
    node.removeEventListener(...handlers.dragUp);
    node.classList.remove('draggable');
  }

  if (active) {
    activateListeners();
  }
  /**
   * Handle the initial pointer down which activates dragging behavior for the positionable.
   *
   * @param {PointerEvent} event - The pointer down event.
   */


  function onDragPointerDown(event) {
    event.preventDefault(); // Record initial position

    position = foundry.utils.duplicate(positionable.position);
    initialPosition = {
      x: event.clientX,
      y: event.clientY
    }; // Add temporary handlers

    globalThis.addEventListener(...handlers.dragMove);
    globalThis.addEventListener(...handlers.dragUp);
  }
  /**
   * Move the positionable.
   *
   * @param {PointerEvent} event - The pointer move event.
   */


  function onDragPointerMove(event) {
    event.preventDefault();

    if (!active) {
      return;
    } // Limit dragging to 60 updates per second


    const now = Date.now();

    if (now - moveTime < 1000 / 60) {
      return;
    }

    moveTime = now; // Update application position

    positionable.setPosition({
      left: position.left + (event.clientX - initialPosition.x),
      top: position.top + (event.clientY - initialPosition.y)
    });
  }
  /**
   * Conclude the dragging behavior when the mouse is release, setting the final position and removing listeners
   *
   * @param {PointerEvent} event - The pointer up event.
   */


  function onDragPointerUp(event) {
    event.preventDefault();
    globalThis.removeEventListener(...handlers.dragMove);
    globalThis.removeEventListener(...handlers.dragUp);
  }

  return {
    update: ({
      booleanStore
    }) => // eslint-disable-line no-shadow
    {
      if (booleanStore) {
        activateListeners();
      } else {
        removeListeners();
      }
    },
    destroy: () => removeListeners()
  };
}
/* src\modules\component\application\TJSHeaderButton.svelte generated by Svelte v3.44.1 */


function create_fragment$7(ctx) {
  let a;
  let i;
  let i_class_value;
  let i_title_value;
  let t_value = localize(
  /*button*/
  ctx[0].label) + "";
  let t;
  let a_class_value;
  let mounted;
  let dispose;
  return {
    c() {
      a = element("a");
      i = element("i");
      t = text(t_value);
      attr(i, "class", i_class_value =
      /*button*/
      ctx[0].icon);
      attr(i, "title", i_title_value = localize(
      /*button*/
      ctx[0].title));
      attr(a, "class", a_class_value = "header-button " +
      /*button*/
      ctx[0].class);
    },

    m(target, anchor) {
      insert(target, a, anchor);
      append(a, i);
      append(a, t);

      if (!mounted) {
        dispose = listen(a, "click",
        /*onClick*/
        ctx[1]);
        mounted = true;
      }
    },

    p(ctx, [dirty]) {
      if (dirty &
      /*button*/
      1 && i_class_value !== (i_class_value =
      /*button*/
      ctx[0].icon)) {
        attr(i, "class", i_class_value);
      }

      if (dirty &
      /*button*/
      1 && i_title_value !== (i_title_value = localize(
      /*button*/
      ctx[0].title))) {
        attr(i, "title", i_title_value);
      }

      if (dirty &
      /*button*/
      1 && t_value !== (t_value = localize(
      /*button*/
      ctx[0].label) + "")) set_data(t, t_value);

      if (dirty &
      /*button*/
      1 && a_class_value !== (a_class_value = "header-button " +
      /*button*/
      ctx[0].class)) {
        attr(a, "class", a_class_value);
      }
    },

    i: noop,
    o: noop,

    d(detaching) {
      if (detaching) detach(a);
      mounted = false;
      dispose();
    }

  };
}

function instance$7($$self, $$props, $$invalidate) {
  let {
    button
  } = $$props;

  function onClick() {
    if (typeof button.onclick === 'function') {
      button.onclick.call(button);
      $$invalidate(0, button);
    }
  }

  $$self.$$set = $$props => {
    if ('button' in $$props) $$invalidate(0, button = $$props.button);
  };

  return [button, onClick];
}

class TJSHeaderButton extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$7, create_fragment$7, safe_not_equal, {
      button: 0
    });
  }

  get button() {
    return this.$$.ctx[0];
  }

  set button(button) {
    this.$$set({
      button
    });
    flush();
  }

}
/* src\modules\component\application\TJSApplicationHeader.svelte generated by Svelte v3.44.1 */


function get_each_context$2(ctx, list, i) {
  const child_ctx = ctx.slice();
  child_ctx[12] = list[i];
  return child_ctx;
} // (46:4) {#each $storeHeaderButtons as button}


function create_each_block$2(ctx) {
  let tjsheaderbutton;
  let current;
  tjsheaderbutton = new TJSHeaderButton({
    props: {
      button:
      /*button*/
      ctx[12]
    }
  });
  return {
    c() {
      create_component(tjsheaderbutton.$$.fragment);
    },

    m(target, anchor) {
      mount_component(tjsheaderbutton, target, anchor);
      current = true;
    },

    p(ctx, dirty) {
      const tjsheaderbutton_changes = {};
      if (dirty &
      /*$storeHeaderButtons*/
      8) tjsheaderbutton_changes.button =
      /*button*/
      ctx[12];
      tjsheaderbutton.$set(tjsheaderbutton_changes);
    },

    i(local) {
      if (current) return;
      transition_in(tjsheaderbutton.$$.fragment, local);
      current = true;
    },

    o(local) {
      transition_out(tjsheaderbutton.$$.fragment, local);
      current = false;
    },

    d(detaching) {
      destroy_component(tjsheaderbutton, detaching);
    }

  };
}

function create_fragment$6(ctx) {
  let header;
  let h4;
  let t0_value = localize(
  /*$storeTitle*/
  ctx[2]) + "";
  let t0;
  let t1;
  let draggable_action;
  let minimizable_action;
  let current;
  let mounted;
  let dispose;
  let each_value =
  /*$storeHeaderButtons*/
  ctx[3];
  let each_blocks = [];

  for (let i = 0; i < each_value.length; i += 1) {
    each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
  }

  const out = i => transition_out(each_blocks[i], 1, 1, () => {
    each_blocks[i] = null;
  });

  return {
    c() {
      header = element("header");
      h4 = element("h4");
      t0 = text(t0_value);
      t1 = space();

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].c();
      }

      attr(h4, "class", "window-title");
      attr(header, "class", "window-header flexrow");
    },

    m(target, anchor) {
      insert(target, header, anchor);
      append(header, h4);
      append(h4, t0);
      append(header, t1);

      for (let i = 0; i < each_blocks.length; i += 1) {
        each_blocks[i].m(header, null);
      }

      current = true;

      if (!mounted) {
        dispose = [listen(header, "pointerdown",
        /*bringToTop*/
        ctx[5]), action_destroyer(draggable_action = draggable.call(null, header, {
          positionable:
          /*foundryApp*/
          ctx[4],
          booleanStore:
          /*$storeDraggable*/
          ctx[0]
        })), action_destroyer(minimizable_action =
        /*minimizable*/
        ctx[10].call(null, header,
        /*$storeMinimizable*/
        ctx[1]))];
        mounted = true;
      }
    },

    p(ctx, [dirty]) {
      if ((!current || dirty &
      /*$storeTitle*/
      4) && t0_value !== (t0_value = localize(
      /*$storeTitle*/
      ctx[2]) + "")) set_data(t0, t0_value);

      if (dirty &
      /*$storeHeaderButtons*/
      8) {
        each_value =
        /*$storeHeaderButtons*/
        ctx[3];
        let i;

        for (i = 0; i < each_value.length; i += 1) {
          const child_ctx = get_each_context$2(ctx, each_value, i);

          if (each_blocks[i]) {
            each_blocks[i].p(child_ctx, dirty);
            transition_in(each_blocks[i], 1);
          } else {
            each_blocks[i] = create_each_block$2(child_ctx);
            each_blocks[i].c();
            transition_in(each_blocks[i], 1);
            each_blocks[i].m(header, null);
          }
        }

        group_outros();

        for (i = each_value.length; i < each_blocks.length; i += 1) {
          out(i);
        }

        check_outros();
      }

      if (draggable_action && is_function(draggable_action.update) && dirty &
      /*$storeDraggable*/
      1) draggable_action.update.call(null, {
        positionable:
        /*foundryApp*/
        ctx[4],
        booleanStore:
        /*$storeDraggable*/
        ctx[0]
      });
      if (minimizable_action && is_function(minimizable_action.update) && dirty &
      /*$storeMinimizable*/
      2) minimizable_action.update.call(null,
      /*$storeMinimizable*/
      ctx[1]);
    },

    i(local) {
      if (current) return;

      for (let i = 0; i < each_value.length; i += 1) {
        transition_in(each_blocks[i]);
      }

      current = true;
    },

    o(local) {
      each_blocks = each_blocks.filter(Boolean);

      for (let i = 0; i < each_blocks.length; i += 1) {
        transition_out(each_blocks[i]);
      }

      current = false;
    },

    d(detaching) {
      if (detaching) detach(header);
      destroy_each(each_blocks, detaching);
      mounted = false;
      run_all(dispose);
    }

  };
}

function instance$6($$self, $$props, $$invalidate) {
  let $storeDraggable;
  let $storeMinimizable;
  let $storeTitle;
  let $storeHeaderButtons;
  const context = getContext('external');
  const foundryApp = context.foundryApp;
  const bringToTop = typeof foundryApp.options.popOut === 'boolean' && foundryApp.options.popOut ? () => foundryApp.bringToTop.call(foundryApp) : () => void 0;
  const storeTitle = context.storeAppOptions.title;
  component_subscribe($$self, storeTitle, value => $$invalidate(2, $storeTitle = value));
  const storeDraggable = context.storeAppOptions.draggable;
  component_subscribe($$self, storeDraggable, value => $$invalidate(0, $storeDraggable = value));
  const storeHeaderButtons = context.storeUIOptions.headerButtons;
  component_subscribe($$self, storeHeaderButtons, value => $$invalidate(3, $storeHeaderButtons = value));
  const storeMinimizable = context.storeAppOptions.minimizable;
  component_subscribe($$self, storeMinimizable, value => $$invalidate(1, $storeMinimizable = value));

  function minimizable(node, booleanStore) {
    const callback = foundryApp._onToggleMinimize.bind(foundryApp);

    function activateListeners() {
      node.addEventListener('dblclick', callback);
    }

    function removeListeners() {
      node.removeEventListener('dblclick', callback);
    }

    if (booleanStore) {
      activateListeners();
    }

    return {
      update: ({
        booleanStore
      }) => // eslint-disable-line no-shadow
      {
        if (booleanStore) {
          activateListeners();
        } else {
          removeListeners();
        }
      },
      destroy: () => removeListeners()
    };
  }

  return [$storeDraggable, $storeMinimizable, $storeTitle, $storeHeaderButtons, foundryApp, bringToTop, storeTitle, storeDraggable, storeHeaderButtons, storeMinimizable, minimizable];
}

class TJSApplicationHeader extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$6, create_fragment$6, safe_not_equal, {});
  }

}
/* src\modules\component\application\ResizableHandle.svelte generated by Svelte v3.44.1 */


function create_fragment$5(ctx) {
  let div;
  let resizable_action;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      div.innerHTML = `<i class="fas fa-arrows-alt-h"></i>`;
      attr(div, "class", "window-resizable-handle");
    },

    m(target, anchor) {
      insert(target, div, anchor);
      /*div_binding*/

      ctx[7](div);

      if (!mounted) {
        dispose = action_destroyer(resizable_action =
        /*resizable*/
        ctx[4].call(null, div,
        /*$storeResizable*/
        ctx[1]));
        mounted = true;
      }
    },

    p(ctx, [dirty]) {
      if (resizable_action && is_function(resizable_action.update) && dirty &
      /*$storeResizable*/
      2) resizable_action.update.call(null,
      /*$storeResizable*/
      ctx[1]);
    },

    i: noop,
    o: noop,

    d(detaching) {
      if (detaching) detach(div);
      /*div_binding*/

      ctx[7](null);
      mounted = false;
      dispose();
    }

  };
}

function instance$5($$self, $$props, $$invalidate) {
  let $storeMinimized;
  let $storeResizable;
  let {
    isResizable = false
  } = $$props;
  const context = getContext('external'); // Allows retrieval of the element root at runtime.

  const getElementRoot = getContext('getElementRoot');
  const foundryApp = context.foundryApp;
  const storeResizable = context.storeAppOptions.resizable;
  component_subscribe($$self, storeResizable, value => $$invalidate(1, $storeResizable = value));
  const storeMinimized = context.storeUIOptions.minimized;
  component_subscribe($$self, storeMinimized, value => $$invalidate(6, $storeMinimized = value));
  let elementResize;
  /**
  * Provides an action to handle resizing the application shell based on the resizable app option.
  *
  * @param {HTMLElement}       node - The node associated with the action.
  *
  * @param {Readable<boolean>} booleanStore - A Svelte store that contains a boolean.
  *
  * @returns {{update: Function, destroy: Function}} The action lifecycle methods.
  */

  function resizable(node, booleanStore) {
    /**
    * Duplicate the app / Positionable starting position to track differences.
    *
    * @type {object}
    */
    let position = null;
    /**
    * Stores the initial X / Y on drag down.
    *
    * @type {object}
    */

    let initialPosition = {};
    /**
    * Throttle mousemove event handling to 60fps
    *
    * @type {number}
    */

    let moveTime = 0;
    /**
    * Stores the active state and is used to cut off any active resizing when the store value changes.
    *
    * @type {boolean}
    */

    let active = booleanStore;
    /**
    * Remember event handlers associated with this action so they may be later unregistered.
    *
    * @type {Object}
    */

    const handlers = {
      resizeDown: ['pointerdown', e => onResizePointerDown(e), false],
      resizeMove: ['pointermove', e => onResizePointerMove(e), false],
      resizeUp: ['pointerup', e => onResizePointerUp(e), false]
    };
    /**
    * Activates listeners.
    */

    function activateListeners() {
      active = true; // Resize handlers

      node.addEventListener(...handlers.resizeDown);
      $$invalidate(5, isResizable = true);
      node.style.display = 'block';
    }
    /**
    * Removes listeners.
    */


    function removeListeners() {
      active = false; // Resize handlers

      node.removeEventListener(...handlers.resizeDown);
      node.removeEventListener(...handlers.resizeMove);
      node.removeEventListener(...handlers.resizeUp);
      node.style.display = 'none';
      $$invalidate(5, isResizable = false);
    } // On mount if resizable is true then activate listeners otherwise set element display to `none`.


    if (active) {
      activateListeners();
    } else {
      node.style.display = 'none';
    }
    /**
    * Handle the initial mouse click which activates dragging behavior for the application
    * @private
    */


    function onResizePointerDown(event) {
      event.preventDefault(); // Limit dragging to 60 updates per second

      const now = Date.now();

      if (now - moveTime < 1000 / 60) {
        return;
      }

      moveTime = now; // Record initial position

      position = foundry.utils.duplicate(foundryApp.position);

      if (position.height === 'auto') {
        position.height = getElementRoot().clientHeight;
      }

      if (position.width === 'auto') {
        position.width = getElementRoot().clientWidth;
      }

      initialPosition = {
        x: event.clientX,
        y: event.clientY
      }; // Add temporary handlers

      globalThis.addEventListener(...handlers.resizeMove);
      globalThis.addEventListener(...handlers.resizeUp);
    }
    /**
    * Move the window with the mouse, bounding the movement to ensure the window stays within bounds of the viewport
    * @private
    */


    function onResizePointerMove(event) {
      event.preventDefault();

      if (!active) {
        return;
      }

      foundryApp.setPosition({
        width: position.width + (event.clientX - initialPosition.x),
        height: position.height + (event.clientY - initialPosition.y)
      });
    }
    /**
    * Conclude the dragging behavior when the mouse is release, setting the final position and removing listeners
    * @private
    */


    function onResizePointerUp(event) {
      event.preventDefault();
      globalThis.removeEventListener(...handlers.resizeMove);
      globalThis.removeEventListener(...handlers.resizeUp);

      foundryApp._onResize(event);
    }

    return {
      update: booleanStore => // eslint-disable-line no-shadow
      {
        if (booleanStore) {
          activateListeners();
        } else {
          removeListeners();
        }
      },
      destroy: () => removeListeners()
    };
  }

  function div_binding($$value) {
    binding_callbacks[$$value ? 'unshift' : 'push'](() => {
      elementResize = $$value;
      ($$invalidate(0, elementResize), $$invalidate(5, isResizable)), $$invalidate(6, $storeMinimized);
    });
  }

  $$self.$$set = $$props => {
    if ('isResizable' in $$props) $$invalidate(5, isResizable = $$props.isResizable);
  };

  $$self.$$.update = () => {
    if ($$self.$$.dirty &
    /*elementResize, isResizable, $storeMinimized*/
    97) {
      if (elementResize) {
        // Instead of creating a derived store it is easier to use isResizable and the minimized store below.
        $$invalidate(0, elementResize.style.display = isResizable && !$storeMinimized ? 'block' : 'none', elementResize); // Add / remove `resizable` class from element root.

        const elementRoot = getElementRoot();

        if (elementRoot) {
          elementRoot.classList[isResizable ? 'add' : 'remove']('resizable');
        }
      }
    }
  };

  return [elementResize, $storeResizable, storeResizable, storeMinimized, resizable, isResizable, $storeMinimized, div_binding];
}

class ResizableHandle extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$5, create_fragment$5, safe_not_equal, {
      isResizable: 5
    });
  }

}
/* src\modules\component\application\ApplicationShell.svelte generated by Svelte v3.44.1 */


function add_css$3(target) {
  append_styles(target, "svelte-3vt5in", ".window-app.svelte-3vt5in{overflow:inherit}");
} // (130:0) {:else}


function create_else_block_1$1(ctx) {
  let div;
  let tjsapplicationheader;
  let t0;
  let section;
  let current_block_type_index;
  let if_block;
  let t1;
  let resizablehandle;
  let div_id_value;
  let div_class_value;
  let div_data_appid_value;
  let div_intro;
  let div_outro;
  let current;
  tjsapplicationheader = new TJSApplicationHeader({});
  const if_block_creators = [create_if_block_2$1, create_else_block_2$1];
  const if_blocks = [];

  function select_block_type_2(ctx, dirty) {
    if (Array.isArray(
    /*allChildren*/
    ctx[9])) return 0;
    return 1;
  }

  current_block_type_index = select_block_type_2(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  resizablehandle = new ResizableHandle({});
  return {
    c() {
      div = element("div");
      create_component(tjsapplicationheader.$$.fragment);
      t0 = space();
      section = element("section");
      if_block.c();
      t1 = space();
      create_component(resizablehandle.$$.fragment);
      attr(section, "class", "window-content");
      attr(div, "id", div_id_value =
      /*foundryApp*/
      ctx[7].id);
      attr(div, "class", div_class_value = "app window-app " +
      /*foundryApp*/
      ctx[7].options.classes.join(' ') + " svelte-3vt5in");
      attr(div, "data-appid", div_data_appid_value =
      /*foundryApp*/
      ctx[7].appId);
    },

    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(tjsapplicationheader, div, null);
      append(div, t0);
      append(div, section);
      if_blocks[current_block_type_index].m(section, null);
      /*section_binding_1*/

      ctx[21](section);
      append(div, t1);
      mount_component(resizablehandle, div, null);
      /*div_binding_1*/

      ctx[22](div);
      current = true;
    },

    p(new_ctx, dirty) {
      ctx = new_ctx;
      if_block.p(ctx, dirty);

      if (!current || dirty &
      /*foundryApp*/
      128 && div_id_value !== (div_id_value =
      /*foundryApp*/
      ctx[7].id)) {
        attr(div, "id", div_id_value);
      }

      if (!current || dirty &
      /*foundryApp*/
      128 && div_class_value !== (div_class_value = "app window-app " +
      /*foundryApp*/
      ctx[7].options.classes.join(' ') + " svelte-3vt5in")) {
        attr(div, "class", div_class_value);
      }

      if (!current || dirty &
      /*foundryApp*/
      128 && div_data_appid_value !== (div_data_appid_value =
      /*foundryApp*/
      ctx[7].appId)) {
        attr(div, "data-appid", div_data_appid_value);
      }
    },

    i(local) {
      if (current) return;
      transition_in(tjsapplicationheader.$$.fragment, local);
      transition_in(if_block);
      transition_in(resizablehandle.$$.fragment, local);
      add_render_callback(() => {
        if (div_outro) div_outro.end(1);
        div_intro = create_in_transition(div,
        /*inTransition*/
        ctx[0],
        /*inTransitionOptions*/
        ctx[2]);
        div_intro.start();
      });
      current = true;
    },

    o(local) {
      transition_out(tjsapplicationheader.$$.fragment, local);
      transition_out(if_block);
      transition_out(resizablehandle.$$.fragment, local);
      if (div_intro) div_intro.invalidate();
      div_outro = create_out_transition(div,
      /*outTransition*/
      ctx[1],
      /*outTransitionOptions*/
      ctx[3]);
      current = false;
    },

    d(detaching) {
      if (detaching) detach(div);
      destroy_component(tjsapplicationheader);
      if_blocks[current_block_type_index].d();
      /*section_binding_1*/

      ctx[21](null);
      destroy_component(resizablehandle);
      /*div_binding_1*/

      ctx[22](null);
      if (detaching && div_outro) div_outro.end();
    }

  };
} // (112:0) {#if bindHeightChanged}


function create_if_block$3(ctx) {
  let div;
  let tjsapplicationheader;
  let t0;
  let section;
  let current_block_type_index;
  let if_block;
  let section_resize_listener;
  let t1;
  let resizablehandle;
  let div_id_value;
  let div_class_value;
  let div_data_appid_value;
  let div_resize_listener;
  let div_intro;
  let div_outro;
  let current;
  tjsapplicationheader = new TJSApplicationHeader({});
  const if_block_creators = [create_if_block_1$2, create_else_block$2];
  const if_blocks = [];

  function select_block_type_1(ctx, dirty) {
    if (Array.isArray(
    /*allChildren*/
    ctx[9])) return 0;
    return 1;
  }

  current_block_type_index = select_block_type_1(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  resizablehandle = new ResizableHandle({});
  return {
    c() {
      div = element("div");
      create_component(tjsapplicationheader.$$.fragment);
      t0 = space();
      section = element("section");
      if_block.c();
      t1 = space();
      create_component(resizablehandle.$$.fragment);
      attr(section, "class", "window-content");
      add_render_callback(() =>
      /*section_elementresize_handler*/
      ctx[18].call(section));
      attr(div, "id", div_id_value =
      /*foundryApp*/
      ctx[7].id);
      attr(div, "class", div_class_value = "app window-app " +
      /*foundryApp*/
      ctx[7].options.classes.join(' ') + " svelte-3vt5in");
      attr(div, "data-appid", div_data_appid_value =
      /*foundryApp*/
      ctx[7].appId);
      add_render_callback(() =>
      /*div_elementresize_handler*/
      ctx[19].call(div));
    },

    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(tjsapplicationheader, div, null);
      append(div, t0);
      append(div, section);
      if_blocks[current_block_type_index].m(section, null);
      /*section_binding*/

      ctx[17](section);
      section_resize_listener = add_resize_listener(section,
      /*section_elementresize_handler*/
      ctx[18].bind(section));
      append(div, t1);
      mount_component(resizablehandle, div, null);
      div_resize_listener = add_resize_listener(div,
      /*div_elementresize_handler*/
      ctx[19].bind(div));
      /*div_binding*/

      ctx[20](div);
      current = true;
    },

    p(new_ctx, dirty) {
      ctx = new_ctx;
      if_block.p(ctx, dirty);

      if (!current || dirty &
      /*foundryApp*/
      128 && div_id_value !== (div_id_value =
      /*foundryApp*/
      ctx[7].id)) {
        attr(div, "id", div_id_value);
      }

      if (!current || dirty &
      /*foundryApp*/
      128 && div_class_value !== (div_class_value = "app window-app " +
      /*foundryApp*/
      ctx[7].options.classes.join(' ') + " svelte-3vt5in")) {
        attr(div, "class", div_class_value);
      }

      if (!current || dirty &
      /*foundryApp*/
      128 && div_data_appid_value !== (div_data_appid_value =
      /*foundryApp*/
      ctx[7].appId)) {
        attr(div, "data-appid", div_data_appid_value);
      }
    },

    i(local) {
      if (current) return;
      transition_in(tjsapplicationheader.$$.fragment, local);
      transition_in(if_block);
      transition_in(resizablehandle.$$.fragment, local);
      add_render_callback(() => {
        if (div_outro) div_outro.end(1);
        div_intro = create_in_transition(div,
        /*inTransition*/
        ctx[0],
        /*inTransitionOptions*/
        ctx[2]);
        div_intro.start();
      });
      current = true;
    },

    o(local) {
      transition_out(tjsapplicationheader.$$.fragment, local);
      transition_out(if_block);
      transition_out(resizablehandle.$$.fragment, local);
      if (div_intro) div_intro.invalidate();
      div_outro = create_out_transition(div,
      /*outTransition*/
      ctx[1],
      /*outTransitionOptions*/
      ctx[3]);
      current = false;
    },

    d(detaching) {
      if (detaching) detach(div);
      destroy_component(tjsapplicationheader);
      if_blocks[current_block_type_index].d();
      /*section_binding*/

      ctx[17](null);
      section_resize_listener();
      destroy_component(resizablehandle);
      div_resize_listener();
      /*div_binding*/

      ctx[20](null);
      if (detaching && div_outro) div_outro.end();
    }

  };
} // (141:9) {:else}


function create_else_block_2$1(ctx) {
  let current;
  const default_slot_template =
  /*#slots*/
  ctx[16].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[15], null);
  return {
    c() {
      if (default_slot) default_slot.c();
    },

    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }

      current = true;
    },

    p(ctx, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty &
        /*$$scope*/
        32768)) {
          update_slot_base(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[15], !current ? get_all_dirty_from_scope(
          /*$$scope*/
          ctx[15]) : get_slot_changes(default_slot_template,
          /*$$scope*/
          ctx[15], dirty, null), null);
        }
      }
    },

    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },

    o(local) {
      transition_out(default_slot, local);
      current = false;
    },

    d(detaching) {
      if (default_slot) default_slot.d(detaching);
    }

  };
} // (139:9) {#if Array.isArray(allChildren)}


function create_if_block_2$1(ctx) {
  let tjscontainer;
  let current;
  tjscontainer = new TJSContainer({
    props: {
      children:
      /*allChildren*/
      ctx[9]
    }
  });
  return {
    c() {
      create_component(tjscontainer.$$.fragment);
    },

    m(target, anchor) {
      mount_component(tjscontainer, target, anchor);
      current = true;
    },

    p: noop,

    i(local) {
      if (current) return;
      transition_in(tjscontainer.$$.fragment, local);
      current = true;
    },

    o(local) {
      transition_out(tjscontainer.$$.fragment, local);
      current = false;
    },

    d(detaching) {
      destroy_component(tjscontainer, detaching);
    }

  };
} // (124:9) {:else}


function create_else_block$2(ctx) {
  let current;
  const default_slot_template =
  /*#slots*/
  ctx[16].default;
  const default_slot = create_slot(default_slot_template, ctx,
  /*$$scope*/
  ctx[15], null);
  return {
    c() {
      if (default_slot) default_slot.c();
    },

    m(target, anchor) {
      if (default_slot) {
        default_slot.m(target, anchor);
      }

      current = true;
    },

    p(ctx, dirty) {
      if (default_slot) {
        if (default_slot.p && (!current || dirty &
        /*$$scope*/
        32768)) {
          update_slot_base(default_slot, default_slot_template, ctx,
          /*$$scope*/
          ctx[15], !current ? get_all_dirty_from_scope(
          /*$$scope*/
          ctx[15]) : get_slot_changes(default_slot_template,
          /*$$scope*/
          ctx[15], dirty, null), null);
        }
      }
    },

    i(local) {
      if (current) return;
      transition_in(default_slot, local);
      current = true;
    },

    o(local) {
      transition_out(default_slot, local);
      current = false;
    },

    d(detaching) {
      if (default_slot) default_slot.d(detaching);
    }

  };
} // (122:9) {#if Array.isArray(allChildren)}


function create_if_block_1$2(ctx) {
  let tjscontainer;
  let current;
  tjscontainer = new TJSContainer({
    props: {
      children:
      /*allChildren*/
      ctx[9]
    }
  });
  return {
    c() {
      create_component(tjscontainer.$$.fragment);
    },

    m(target, anchor) {
      mount_component(tjscontainer, target, anchor);
      current = true;
    },

    p: noop,

    i(local) {
      if (current) return;
      transition_in(tjscontainer.$$.fragment, local);
      current = true;
    },

    o(local) {
      transition_out(tjscontainer.$$.fragment, local);
      current = false;
    },

    d(detaching) {
      destroy_component(tjscontainer, detaching);
    }

  };
}

function create_fragment$4(ctx) {
  let current_block_type_index;
  let if_block;
  let if_block_anchor;
  let current;
  const if_block_creators = [create_if_block$3, create_else_block_1$1];
  const if_blocks = [];

  function select_block_type(ctx, dirty) {
    if (
    /*bindHeightChanged*/
    ctx[8]) return 0;
    return 1;
  }

  current_block_type_index = select_block_type(ctx);
  if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  return {
    c() {
      if_block.c();
      if_block_anchor = empty();
    },

    m(target, anchor) {
      if_blocks[current_block_type_index].m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },

    p(ctx, [dirty]) {
      if_block.p(ctx, dirty);
    },

    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },

    o(local) {
      transition_out(if_block);
      current = false;
    },

    d(detaching) {
      if_blocks[current_block_type_index].d(detaching);
      if (detaching) detach(if_block_anchor);
    }

  };
}

function instance$4($$self, $$props, $$invalidate) {
  let {
    $$slots: slots = {},
    $$scope
  } = $$props;
  let {
    elementContent
  } = $$props;
  let {
    elementRoot
  } = $$props;
  let {
    children = void 0
  } = $$props;
  let {
    heightChanged = false
  } = $$props; // Store the initial `heightChanged` state. If it is truthy then `clientHeight` for the content & root elements
  // are bound to `heightChanged` to signal to any parent component of any change to the client & root.

  const bindHeightChanged = !!heightChanged;
  setContext('getElementContent', () => elementContent);
  setContext('getElementRoot', () => elementRoot);
  const context = getContext('external'); // Store Foundry Application reference.

  const foundryApp = context.foundryApp; // This component can host multiple children defined via props or in the TyphonJS SvelteData configuration object
  // that are potentially mounted in the content area. If no children defined then this component mounts any slotted
  // child.

  const allChildren = Array.isArray(children) ? children : typeof context === 'object' ? context.children : void 0;
  let {
    transition = void 0
  } = $$props;
  let {
    inTransition = s_DEFAULT_TRANSITION
  } = $$props;
  let {
    outTransition = s_DEFAULT_TRANSITION
  } = $$props;
  let {
    transitionOptions = void 0
  } = $$props;
  let {
    inTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS
  } = $$props;
  let {
    outTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS
  } = $$props; // Tracks last transition state.

  let oldTransition = void 0;
  let oldTransitionOptions = void 0;

  function section_binding($$value) {
    binding_callbacks[$$value ? 'unshift' : 'push'](() => {
      elementContent = $$value;
      $$invalidate(4, elementContent);
    });
  }

  function section_elementresize_handler() {
    heightChanged = this.clientHeight;
    $$invalidate(6, heightChanged);
  }

  function div_elementresize_handler() {
    heightChanged = this.clientHeight;
    $$invalidate(6, heightChanged);
  }

  function div_binding($$value) {
    binding_callbacks[$$value ? 'unshift' : 'push'](() => {
      elementRoot = $$value;
      $$invalidate(5, elementRoot);
    });
  }

  function section_binding_1($$value) {
    binding_callbacks[$$value ? 'unshift' : 'push'](() => {
      elementContent = $$value;
      $$invalidate(4, elementContent);
    });
  }

  function div_binding_1($$value) {
    binding_callbacks[$$value ? 'unshift' : 'push'](() => {
      elementRoot = $$value;
      $$invalidate(5, elementRoot);
    });
  }

  $$self.$$set = $$props => {
    if ('elementContent' in $$props) $$invalidate(4, elementContent = $$props.elementContent);
    if ('elementRoot' in $$props) $$invalidate(5, elementRoot = $$props.elementRoot);
    if ('children' in $$props) $$invalidate(10, children = $$props.children);
    if ('heightChanged' in $$props) $$invalidate(6, heightChanged = $$props.heightChanged);
    if ('transition' in $$props) $$invalidate(11, transition = $$props.transition);
    if ('inTransition' in $$props) $$invalidate(0, inTransition = $$props.inTransition);
    if ('outTransition' in $$props) $$invalidate(1, outTransition = $$props.outTransition);
    if ('transitionOptions' in $$props) $$invalidate(12, transitionOptions = $$props.transitionOptions);
    if ('inTransitionOptions' in $$props) $$invalidate(2, inTransitionOptions = $$props.inTransitionOptions);
    if ('outTransitionOptions' in $$props) $$invalidate(3, outTransitionOptions = $$props.outTransitionOptions);
    if ('$$scope' in $$props) $$invalidate(15, $$scope = $$props.$$scope);
  };

  $$self.$$.update = () => {
    if ($$self.$$.dirty &
    /*oldTransition, transition*/
    10240) {
      // Run this reactive block when the last transition state is not equal to the current state.
      if (oldTransition !== transition) {
        // If transition is defined and not the default transition then set it to both in and out transition otherwise
        // set the default transition to both in & out transitions.
        const newTransition = s_DEFAULT_TRANSITION !== transition && typeof transition === 'function' ? transition : s_DEFAULT_TRANSITION;
        $$invalidate(0, inTransition = newTransition);
        $$invalidate(1, outTransition = newTransition);
        $$invalidate(13, oldTransition = newTransition);
      }
    }

    if ($$self.$$.dirty &
    /*oldTransitionOptions, transitionOptions*/
    20480) {
      // Run this reactive block when the last transition options state is not equal to the current options state.
      if (oldTransitionOptions !== transitionOptions) {
        const newOptions = transitionOptions !== s_DEFAULT_TRANSITION_OPTIONS && typeof transitionOptions === 'object' ? transitionOptions : s_DEFAULT_TRANSITION_OPTIONS;
        $$invalidate(2, inTransitionOptions = newOptions);
        $$invalidate(3, outTransitionOptions = newOptions);
        $$invalidate(14, oldTransitionOptions = newOptions);
      }
    }

    if ($$self.$$.dirty &
    /*inTransition*/
    1) {
      // Handle cases if inTransition is unset; assign noop default transition function.
      if (typeof inTransition !== 'function') {
        $$invalidate(0, inTransition = s_DEFAULT_TRANSITION);
      }
    }

    if ($$self.$$.dirty &
    /*outTransition, foundryApp*/
    130) {
      {
        var _foundryApp$options;

        // Handle cases if outTransition is unset; assign noop default transition function.
        if (typeof outTransition !== 'function') {
          $$invalidate(1, outTransition = s_DEFAULT_TRANSITION);
        } // Set jquery close animation to either run or not when an out transition is changed.


        if (foundryApp && typeof (foundryApp === null || foundryApp === void 0 ? void 0 : (_foundryApp$options = foundryApp.options) === null || _foundryApp$options === void 0 ? void 0 : _foundryApp$options.jqueryCloseAnimation) === 'boolean') {
          $$invalidate(7, foundryApp.options.jqueryCloseAnimation = outTransition === s_DEFAULT_TRANSITION, foundryApp);
        }
      }
    }

    if ($$self.$$.dirty &
    /*inTransitionOptions*/
    4) {
      // Handle cases if inTransitionOptions is unset; assign empty default transition options.
      if (typeof inTransitionOptions !== 'object') {
        $$invalidate(2, inTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS);
      }
    }

    if ($$self.$$.dirty &
    /*outTransitionOptions*/
    8) {
      // Handle cases if outTransitionOptions is unset; assign empty default transition options.
      if (typeof outTransitionOptions !== 'object') {
        $$invalidate(3, outTransitionOptions = s_DEFAULT_TRANSITION_OPTIONS);
      }
    }
  };

  return [inTransition, outTransition, inTransitionOptions, outTransitionOptions, elementContent, elementRoot, heightChanged, foundryApp, bindHeightChanged, allChildren, children, transition, transitionOptions, oldTransition, oldTransitionOptions, $$scope, slots, section_binding, section_elementresize_handler, div_elementresize_handler, div_binding, section_binding_1, div_binding_1];
}

class ApplicationShell extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4, create_fragment$4, safe_not_equal, {
      elementContent: 4,
      elementRoot: 5,
      children: 10,
      heightChanged: 6,
      transition: 11,
      inTransition: 0,
      outTransition: 1,
      transitionOptions: 12,
      inTransitionOptions: 2,
      outTransitionOptions: 3
    }, add_css$3);
  }

  get elementContent() {
    return this.$$.ctx[4];
  }

  set elementContent(elementContent) {
    this.$$set({
      elementContent
    });
    flush();
  }

  get elementRoot() {
    return this.$$.ctx[5];
  }

  set elementRoot(elementRoot) {
    this.$$set({
      elementRoot
    });
    flush();
  }

  get children() {
    return this.$$.ctx[10];
  }

  set children(children) {
    this.$$set({
      children
    });
    flush();
  }

  get heightChanged() {
    return this.$$.ctx[6];
  }

  set heightChanged(heightChanged) {
    this.$$set({
      heightChanged
    });
    flush();
  }

  get transition() {
    return this.$$.ctx[11];
  }

  set transition(transition) {
    this.$$set({
      transition
    });
    flush();
  }

  get inTransition() {
    return this.$$.ctx[0];
  }

  set inTransition(inTransition) {
    this.$$set({
      inTransition
    });
    flush();
  }

  get outTransition() {
    return this.$$.ctx[1];
  }

  set outTransition(outTransition) {
    this.$$set({
      outTransition
    });
    flush();
  }

  get transitionOptions() {
    return this.$$.ctx[12];
  }

  set transitionOptions(transitionOptions) {
    this.$$set({
      transitionOptions
    });
    flush();
  }

  get inTransitionOptions() {
    return this.$$.ctx[2];
  }

  set inTransitionOptions(inTransitionOptions) {
    this.$$set({
      inTransitionOptions
    });
    flush();
  }

  get outTransitionOptions() {
    return this.$$.ctx[3];
  }

  set outTransitionOptions(outTransitionOptions) {
    this.$$set({
      outTransitionOptions
    });
    flush();
  }

}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);

    if (enumerableOnly) {
      symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
    }

    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _classPrivateFieldGet(receiver, privateMap) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "get");

  return _classApplyDescriptorGet(receiver, descriptor);
}

function _classPrivateFieldSet(receiver, privateMap, value) {
  var descriptor = _classExtractFieldDescriptor(receiver, privateMap, "set");

  _classApplyDescriptorSet(receiver, descriptor, value);

  return value;
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

function _classApplyDescriptorSet(receiver, descriptor, value) {
  if (descriptor.set) {
    descriptor.set.call(receiver, value);
  } else {
    if (!descriptor.writable) {
      throw new TypeError("attempted to set read only private field");
    }

    descriptor.value = value;
  }
}

function _classPrivateMethodGet(receiver, privateSet, fn) {
  if (!privateSet.has(receiver)) {
    throw new TypeError("attempted to get private field on non-instance");
  }

  return fn;
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

function _classPrivateMethodInitSpec(obj, privateSet) {
  _checkPrivateRedeclaration(obj, privateSet);

  privateSet.add(obj);
}

var _applicationShellHolder$1$1 = /*#__PURE__*/new WeakMap();

var _svelteData$1$1 = /*#__PURE__*/new WeakMap();
/**
 * Provides a helper class for {@link SvelteApplication} by combining all methods that work on the {@link SvelteData[]}
 * of mounted components. This class is instantiated and can be retrieved by the getter `svelte` via SvelteApplication.
 */


class GetSvelteData$1 {
  /**
   * @type {ApplicationShell|null[]}
   */

  /**
   * @type {SvelteData[]}
   */

  /**
   * Keep a direct reference to the SvelteData array in an associated {@link SvelteApplication}.
   *
   * @param {ApplicationShell|null[]}  applicationShellHolder - A reference to the ApplicationShell array.
   *
   * @param {SvelteData[]}  svelteData - A reference to the SvelteData array of mounted components.
   */
  constructor(applicationShellHolder, svelteData) {
    _classPrivateFieldInitSpec(this, _applicationShellHolder$1$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _svelteData$1$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet(this, _applicationShellHolder$1$1, applicationShellHolder);

    _classPrivateFieldSet(this, _svelteData$1$1, svelteData);
  }
  /**
   * Returns any mounted {@link ApplicationShell}.
   *
   * @returns {ApplicationShell|null} Any mounted application shell.
   */


  get applicationShell() {
    return _classPrivateFieldGet(this, _applicationShellHolder$1$1)[0];
  }
  /**
   * Returns the indexed Svelte component.
   *
   * @param {number}   index -
   *
   * @returns {object} The loaded Svelte component.
   */


  component(index) {
    const data = _classPrivateFieldGet(this, _svelteData$1$1)[index];

    return typeof data === 'object' ? data === null || data === void 0 ? void 0 : data.component : void 0;
  }
  /**
   * Returns the Svelte component entries iterator.
   *
   * @returns {Generator<(number|*)[], void, *>} Svelte component entries iterator.
   * @yields
   */


  *componentEntries() {
    for (let cntr = 0; cntr < _classPrivateFieldGet(this, _svelteData$1$1).length; cntr++) {
      yield [cntr, _classPrivateFieldGet(this, _svelteData$1$1)[cntr].component];
    }
  }
  /**
   * Returns the Svelte component values iterator.
   *
   * @returns {Generator<*, void, *>} Svelte component values iterator.
   * @yields
   */


  *componentValues() {
    for (let cntr = 0; cntr < _classPrivateFieldGet(this, _svelteData$1$1).length; cntr++) {
      yield _classPrivateFieldGet(this, _svelteData$1$1)[cntr].component;
    }
  }
  /**
   * Returns the indexed SvelteData entry.
   *
   * @param {number}   index -
   *
   * @returns {object} The loaded Svelte config + component.
   */


  data(index) {
    return _classPrivateFieldGet(this, _svelteData$1$1)[index];
  }
  /**
   * Returns the SvelteData entries iterator.
   *
   * @returns {IterableIterator<[number, Object]>} SvelteData entries iterator.
   */


  dataEntries() {
    return _classPrivateFieldGet(this, _svelteData$1$1).entries();
  }
  /**
   * Returns the SvelteData values iterator.
   *
   * @returns {IterableIterator<Object>} SvelteData values iterator.
   */


  dataValues() {
    return _classPrivateFieldGet(this, _svelteData$1$1).values();
  }

  get length() {
    return _classPrivateFieldGet(this, _svelteData$1$1).length;
  }

}

Object.freeze(GetSvelteData$1);
/**
 * @typedef {object} SvelteData
 *
 * @property {object}            config -
 *
 * @property {SvelteComponent}   component -
 *
 * @property {HTMLElement}       element -
 *
 * @property {Eventbus}          eventbus -
 */

/**
 * Provides a Svelte aware extension to Application to control the app lifecycle appropriately. You can declaratively
 * load one or more components from `defaultOptions`. For the time being please refer to this temporary demo code
 * in `typhonjs-quest-log` for examples of how to declare Svelte components.
 * {@link https://github.com/typhonjs-fvtt/typhonjs-quest-log/tree/master/src/view/demo}
 *
 * A repository of demos will be available soon.
 */

var _applicationShellHolder$2 = /*#__PURE__*/new WeakMap();

var _applicationShell$1 = /*#__PURE__*/new WeakMap();

var _elementTarget$1 = /*#__PURE__*/new WeakMap();

var _elementContent$1 = /*#__PURE__*/new WeakMap();

var _storeAppOptions$1 = /*#__PURE__*/new WeakMap();

var _storeAppOptionsUpdate$1 = /*#__PURE__*/new WeakMap();

var _storeUIOptions$1 = /*#__PURE__*/new WeakMap();

var _storeUIOptionsUpdate$1 = /*#__PURE__*/new WeakMap();

var _storeUnsubscribe$1 = /*#__PURE__*/new WeakMap();

var _svelteData$2 = /*#__PURE__*/new WeakMap();

var _getSvelteData$1 = /*#__PURE__*/new WeakMap();

var _storesInitialize$1 = /*#__PURE__*/new WeakSet();

var _storesSubscribe$1 = /*#__PURE__*/new WeakSet();

var _storesUnsubscribe$1 = /*#__PURE__*/new WeakSet();

class SvelteApplication extends Application {
  /**
   * Stores the first mounted component which follows the application shell contract.
   *
   * @type {ApplicationShell|null[]} Application shell.
   */

  /**
   * Get the current application shell.
   *
   * @returns {ApplicationShell|null} The first mounted component which follows the application shell contract.
   */

  /**
   * Stores the target element which may not necessarily be the main element.
   *
   * @type {HTMLElement}
   */

  /**
   * Stores the content element which is set for application shells.
   *
   * @type {HTMLElement}
   */

  /**
   * The Application option store which is injected into mounted Svelte component context under the `external` key.
   *
   * @type {StoreAppOptions}
   */

  /**
   * Stores the update function for `#storeAppOptions`.
   *
   * @type {import('svelte/store').Writable.update}
   */

  /**
   * The UI option store which is injected into mounted Svelte component context under the `external` key.
   *
   * @type {StoreUIOptions}
   */

  /**
   * Stores the update function for `#storeUIOptions`.
   *
   * @type {import('svelte/store').Writable.update}
   */

  /**
   * Stores the unsubscribe functions from local store subscriptions.
   *
   * @type {import('svelte/store').Unsubscriber[]}
   */

  /**
   * Stores SvelteData entries with instantiated Svelte components.
   *
   * @type {SvelteData[]}
   */

  /**
   * Provides a helper class that combines multiple methods for interacting with the mounted components tracked in
   * {@link #svelteData}.
   *
   * @type {GetSvelteData}
   */

  /**
   * @inheritDoc
   */
  constructor(options) {
    super(options);

    _classPrivateMethodInitSpec(this, _storesUnsubscribe$1);

    _classPrivateMethodInitSpec(this, _storesSubscribe$1);

    _classPrivateMethodInitSpec(this, _storesInitialize$1);

    _classPrivateFieldInitSpec(this, _applicationShell$1, {
      get: _get_applicationShell$1,
      set: void 0
    });

    _classPrivateFieldInitSpec(this, _applicationShellHolder$2, {
      writable: true,
      value: [null]
    });

    _classPrivateFieldInitSpec(this, _elementTarget$1, {
      writable: true,
      value: null
    });

    _classPrivateFieldInitSpec(this, _elementContent$1, {
      writable: true,
      value: null
    });

    _classPrivateFieldInitSpec(this, _storeAppOptions$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _storeAppOptionsUpdate$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _storeUIOptions$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _storeUIOptionsUpdate$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec(this, _storeUnsubscribe$1, {
      writable: true,
      value: []
    });

    _classPrivateFieldInitSpec(this, _svelteData$2, {
      writable: true,
      value: []
    });

    _classPrivateFieldInitSpec(this, _getSvelteData$1, {
      writable: true,
      value: new GetSvelteData$1(_classPrivateFieldGet(this, _applicationShellHolder$2), _classPrivateFieldGet(this, _svelteData$2))
    });

    _classPrivateMethodGet(this, _storesInitialize$1, _storesInitialize2$1).call(this);
  }
  /**
   * Specifies the default options that SvelteApplication supports.
   *
   * @returns {object} options - Application options.
   * @see https://foundryvtt.com/api/Application.html#options
   */


  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      draggable: true,
      // If true then application shells are draggable.
      headerButtonNoLabel: false,
      // If true then header button labels are removed for application shells.
      jqueryCloseAnimation: true,
      // If false the Foundry JQuery close animation is not run.
      zIndex: null // When set the zIndex is manually controlled.

    });
  }
  /**
   * Returns the draggable app option.
   *
   * @returns {boolean} Draggable app option.
   */


  get draggable() {
    return this.options.draggable;
  }
  /**
   * Returns the content element if an application shell is mounted.
   *
   * @returns {HTMLElement} Content element.
   */


  get elementContent() {
    return _classPrivateFieldGet(this, _elementContent$1);
  }
  /**
   * Returns the target element or main element if no target defined.
   *
   * @returns {HTMLElement} Target element.
   */


  get elementTarget() {
    return _classPrivateFieldGet(this, _elementTarget$1);
  }
  /**
   * @inheritDoc
   */


  get popOut() {
    return super.popOut;
  }
  /**
   * Returns the resizable option.
   *
   * @returns {boolean} Resizable app option.
   */


  get resizable() {
    return this.options.resizable;
  }
  /**
   * Returns the Svelte helper class w/ various methods to access mounted Svelte components.
   *
   * @returns {GetSvelteData} GetSvelteData
   */


  get svelte() {
    return _classPrivateFieldGet(this, _getSvelteData$1);
  }
  /**
   * Returns the title accessor from the parent Application class.
   * TODO: Application v2; note that super.title localizes `this.options.title`; IMHO it shouldn't.
   *
   * @returns {string} Title.
   */


  get title() {
    return super.title;
  }
  /**
   * Returns the zIndex app option.
   *
   * @returns {number} z-index app option.
   */


  get zIndex() {
    return this.options.zIndex;
  }
  /**
   * Sets `this.options.draggable` which is reactive for application shells.
   *
   * @param {boolean}  draggable - Sets the draggable option.
   */


  set draggable(draggable) {
    if (typeof draggable === 'boolean') {
      this.setOptions('draggable', draggable);
    }
  }
  /**
   * Sets the content element.
   *
   * @param {HTMLElement} content - Content element.
   */


  set elementContent(content) {
    if (!(content instanceof HTMLElement)) {
      throw new TypeError(`SvelteApplication - set elementContent error: 'content' is not an HTMLElement.`);
    }

    _classPrivateFieldSet(this, _elementContent$1, content);
  }
  /**
   * Sets the target element or main element if no target defined.
   *
   * @param {HTMLElement} target - Target element.
   */


  set elementTarget(target) {
    if (!(target instanceof HTMLElement)) {
      throw new TypeError(`SvelteApplication - set elementTarget error: 'target' is not an HTMLElement.`);
    }

    _classPrivateFieldSet(this, _elementTarget$1, target);
  }
  /**
   * Sets `this.options.popOut` which is reactive for application shells. This will add / remove this application
   * from `ui.windows`.
   *
   * @param {boolean}  popOut - Sets the popOut option.
   */


  set popOut(popOut) {
    if (typeof popOut === 'boolean') {
      this.setOptions('popOut', popOut);
    }
  }
  /**
   * Sets `this.options.resizable` which is reactive for application shells.
   *
   * @param {boolean}  resizable - Sets the resizable option.
   */


  set resizable(resizable) {
    if (typeof resizable === 'boolean') {
      this.setOptions('resizable', resizable);
    }
  }
  /**
   * Sets `this.options.title` which is reactive for application shells.
   *
   * @param {string}   title - Application title; will be localized, so a translation key is fine.
   */


  set title(title) {
    if (typeof title === 'string') {
      this.setOptions('title', title);
    }
  }
  /**
   * Sets `this.options.zIndex` which is reactive for application shells.
   *
   * @param {number}   zIndex - Application z-index.
   */


  set zIndex(zIndex) {
    this.setOptions('zIndex', Number.isInteger(zIndex) ? zIndex : null);
  }
  /**
   * Note: This method is fully overridden and duplicated as Svelte components need to be destroyed manually and the
   * best visual result is to destroy them after the default JQuery slide up animation occurs, but before the element
   * is removed from the DOM.
   *
   * If you destroy the Svelte components before the slide up animation the Svelte elements are removed immediately
   * from the DOM. The purpose of overriding ensures the slide up animation is always completed before
   * the Svelte components are destroyed and then the element is removed from the DOM.
   *
   * Close the application and un-register references to it within UI mappings.
   * This function returns a Promise which resolves once the window closing animation concludes
   *
   * @param {object}   options - Optional parameters.
   *
   * @param {boolean}  options.force - Force close regardless of render state.
   *
   * @returns {Promise<void|number>}    A Promise which resolves once the application is closed
   */


  async close(options = {}) {
    const states = Application.RENDER_STATES;

    if (!options.force && ![states.RENDERED, states.ERROR].includes(this._state)) {
      return;
    } // Unsubscribe from any local stores.


    _classPrivateMethodGet(this, _storesUnsubscribe$1, _storesUnsubscribe2$1).call(this);

    this._state = states.CLOSING;
    /**
     * Get the element.
     *
     * @type {JQuery}
     */

    const el = $(_classPrivateFieldGet(this, _elementTarget$1));

    if (!el) {
      return this._state = states.CLOSED;
    } // Dispatch Hooks for closing the base and subclass applications


    for (const cls of this.constructor._getInheritanceChain()) {
      /**
       * A hook event that fires whenever this Application is closed.
       *
       * @param {Application} app                     The Application instance being closed
       *
       * @param {jQuery[]} html                       The application HTML when it is closed
       *
       * @function closeApplication
       *
       * @memberof hookEvents
       */
      Hooks.call(`close${cls.name}`, this, el);
    } // If options `jqueryCloseAnimation` is false then do not execute the standard JQuery slide up animation.
    // This allows Svelte components to provide any out transition. Application shells will automatically set
    // `jqueryCloseAnimation` based on any out transition set or unset.


    const animate = typeof this.options.jqueryCloseAnimation === 'boolean' ? this.options.jqueryCloseAnimation : true;

    if (animate) {
      // Await on JQuery to slide up the main element.
      el[0].style.minHeight = '0';
      await new Promise(resolve => {
        el.slideUp(200, () => resolve());
      });
    } // Stores the Promises returned from running outro transitions and destroying each Svelte component.


    const svelteDestroyPromises = []; // Manually invoke the destroy callbacks for all Svelte components.

    for (const entry of _classPrivateFieldGet(this, _svelteData$2)) {
      // Use `outroAndDestroy` to run outro transitions before destroying.
      svelteDestroyPromises.push(outroAndDestroy(entry.component)); // If any proxy eventbus has been added then remove all event registrations from the component.

      const eventbus = entry.config.eventbus;

      if (typeof eventbus === 'object' && typeof eventbus.off === 'function') {
        eventbus.off();
        entry.config.eventbus = void 0;
      }
    } // Await all Svelte components to destroy.


    await Promise.all(svelteDestroyPromises); // Reset SvelteData like this to maintain reference to GetSvelteData / `this.svelte`.

    _classPrivateFieldGet(this, _svelteData$2).length = 0; // Use JQuery to remove `this._element` from the DOM. Most SvelteComponents have already removed it.

    el.remove(); // Clean up data

    _classPrivateFieldGet(this, _applicationShellHolder$2)[0] = null;
    this._element = null;

    _classPrivateFieldSet(this, _elementContent$1, null);

    _classPrivateFieldSet(this, _elementTarget$1, null);

    delete ui.windows[this.appId];
    this._minimized = false;
    this._scrollPositions = null;
    this._state = states.CLOSED; // Update the minimized UI store options.

    _classPrivateFieldGet(this, _storeUIOptionsUpdate$1).call(this, storeOptions => foundry.utils.mergeObject(storeOptions, {
      minimized: this._minimized
    }));
  }
  /**
   * Provides a way to safely get this applications options given an accessor string which describes the
   * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
   * to walk.
   *
   * // TODO DOCUMENT the accessor in more detail.
   *
   * @param {string}   accessor - The path / key to set. You can set multiple levels.
   *
   * @param {*}        [defaultValue] - A default value returned if the accessor is not found.
   *
   * @returns {*} Value at the accessor.
   */


  getOptions(accessor, defaultValue) {
    return safeAccess(this.options, accessor, defaultValue);
  }
  /**
   * Inject the Svelte components defined in `this.options.svelte`. The Svelte component can attach to the existing
   * pop-out of Application or provide no template and render into a document fragment which is then attached to the
   * DOM.
   *
   * @param {JQuery} html -
   *
   * @override
   * @inheritDoc
   */


  _injectHTML(html) {
    if (this.popOut && html.length === 0 && Array.isArray(this.options.svelte)) {
      throw new Error('SvelteApplication - _injectHTML - A popout app with no template can only support one Svelte component.');
    } // Make sure the store is updated with the latest header buttons. Also allows filtering buttons before display.


    this.updateHeaderButtons();

    if (Array.isArray(this.options.svelte)) {
      for (const svelteConfig of this.options.svelte) {
        const svelteData = s_LOAD_CONFIG$1(this, html, svelteConfig, _classPrivateFieldGet(this, _storeAppOptions$1), _classPrivateFieldGet(this, _storeUIOptions$1));

        if (isApplicationShell(svelteData.component)) {
          if (_classPrivateFieldGet(this, _applicationShell$1) !== null) {
            throw new Error(`SvelteApplication - _injectHTML - An application shell is already mounted; offending config: 
                    ${JSON.stringify(svelteConfig)}`);
          }

          _classPrivateFieldGet(this, _applicationShellHolder$2)[0] = svelteData.component;
        }

        _classPrivateFieldGet(this, _svelteData$2).push(svelteData);
      }
    } else if (typeof this.options.svelte === 'object') {
      const svelteData = s_LOAD_CONFIG$1(this, html, this.options.svelte, _classPrivateFieldGet(this, _storeAppOptions$1), _classPrivateFieldGet(this, _storeUIOptions$1));

      if (isApplicationShell(svelteData.component)) {
        // A sanity check as shouldn't hit this case as only one component is being mounted.
        if (_classPrivateFieldGet(this, _applicationShell$1) !== null) {
          throw new Error(`SvelteApplication - _injectHTML - An application shell is already mounted; offending config: 
                 ${JSON.stringify(this.options.svelte)}`);
        }

        _classPrivateFieldGet(this, _applicationShellHolder$2)[0] = svelteData.component;
      }

      _classPrivateFieldGet(this, _svelteData$2).push(svelteData);
    } // TODO EVALUATE; COMMENTED OUT WHILE WORKING ON HandlebarsApplication.
    // else
    // {
    //    throw new TypeError(`SvelteApplication - _injectHTML - this.options.svelte not an array or object.`);
    // }
    // Detect if this is a synthesized DocumentFragment.


    const isDocumentFragment = html.length && html[0] instanceof DocumentFragment; // If any of the Svelte components mounted directly targets an HTMLElement then do not inject HTML.

    let injectHTML = true;

    for (const svelteData of _classPrivateFieldGet(this, _svelteData$2)) {
      if (!svelteData.injectHTML) {
        injectHTML = false;
        break;
      }
    }

    if (injectHTML) {
      super._injectHTML(html);
    }

    if (_classPrivateFieldGet(this, _applicationShell$1) !== null) {
      this._element = $(_classPrivateFieldGet(this, _applicationShell$1).elementRoot); // Detect if the application shell exports an `elementContent` accessor.

      _classPrivateFieldSet(this, _elementContent$1, hasGetter(_classPrivateFieldGet(this, _applicationShell$1), 'elementContent') ? _classPrivateFieldGet(this, _applicationShell$1).elementContent : null); // Detect if the application shell exports an `elementTarget` accessor.


      _classPrivateFieldSet(this, _elementTarget$1, hasGetter(_classPrivateFieldGet(this, _applicationShell$1), 'elementTarget') ? _classPrivateFieldGet(this, _applicationShell$1).elementTarget : null);
    } else if (isDocumentFragment) // Set the element of the app to the first child element in order of Svelte components mounted.
      {
        for (const svelteData of _classPrivateFieldGet(this, _svelteData$2)) {
          if (svelteData.element instanceof HTMLElement) {
            this._element = $(svelteData.element);
            break;
          }
        }
      } // Potentially retrieve a specific target element if `selectorTarget` is defined otherwise make the target the
    // main element.


    if (_classPrivateFieldGet(this, _elementTarget$1) === null) {
      const element = typeof this.options.selectorTarget === 'string' ? this._element.find(this.options.selectorTarget) : this._element;

      _classPrivateFieldSet(this, _elementTarget$1, element[0]);
    } // TODO VERIFY THIS CHECK ESPECIALLY `this.#elementTarget.length === 0`.


    if (_classPrivateFieldGet(this, _elementTarget$1) === null || _classPrivateFieldGet(this, _elementTarget$1) === void 0 || _classPrivateFieldGet(this, _elementTarget$1).length === 0) {
      throw new Error(`SvelteApplication - _injectHTML: Target element '${this.options.selectorTarget}' not found.`);
    } // Subscribe to local store handling. Defer to next clock tick for the render cycle to complete.


    setTimeout(() => _classPrivateMethodGet(this, _storesSubscribe$1, _storesSubscribe2$1).call(this), 0);
    this.onSvelteMount({
      element: this._element[0],
      elementContent: _classPrivateFieldGet(this, _elementContent$1),
      elementTarget: _classPrivateFieldGet(this, _elementTarget$1)
    });
  }
  /**
   * Provides a mechanism to update the UI options store for minimized.
   *
   * Note: the sanity check is duplicated from {@link Application.maximize} and the store is updated _before_
   * the actual parent method is invoked. This allows application shells to remove / show any resize handlers
   * correctly.
   *
   * @inheritDoc
   */


  async maximize() {
    if (!this.popOut || [false, null].includes(this._minimized)) {
      return;
    }

    _classPrivateFieldGet(this, _storeUIOptionsUpdate$1).call(this, options => foundry.utils.mergeObject(options, {
      minimized: false
    }));

    return super.maximize();
  }
  /**
   * Provides a mechanism to update the UI options store for minimized.
   *
   * Note: the sanity check is duplicated from {@link Application.minimize} and the store is updated _before_
   * the actual parent method is invoked. This allows application shells to remove / show any resize handlers
   * correctly.
   *
   * @inheritDoc
   */


  async minimize() {
    if (!this.rendered || !this.popOut || [true, null].includes(this._minimized)) {
      return;
    }

    _classPrivateFieldGet(this, _storeUIOptionsUpdate$1).call(this, options => foundry.utils.mergeObject(options, {
      minimized: true
    }));

    return super.minimize();
  }
  /**
   * Provides a way to merge `options` into this applications options and update the appOptions store.
   *
   * @param {object}   options - The options object to merge with `this.options`.
   */


  mergeOptions(options) {
    _classPrivateFieldGet(this, _storeAppOptionsUpdate$1).call(this, instanceOptions => foundry.utils.mergeObject(instanceOptions, options));
  }
  /**
   * Provides a callback after all Svelte components are initialized.
   *
   * @param {object}      [opts] - Optional parameters.
   *
   * @param {HTMLElement} [opts.element] - HTMLElement container for main application element.
   *
   * @param {HTMLElement} [opts.elementContent] - HTMLElement container for content area of application shells.
   *
   * @param {HTMLElement} [opts.elementTarget] - HTMLElement container for main application target element.
   */


  onSvelteMount({
    element,
    elementContent,
    elementTarget
  }) {} // eslint-disable-line no-unused-vars

  /**
   * Override replacing HTML as Svelte components control the rendering process. Only potentially change the outer
   * application frame / title for pop-out applications.
   *
   * @override
   * @inheritDoc
   */


  _replaceHTML(element, html) // eslint-disable-line no-unused-vars
  {
    if (!element.length) {
      return;
    }

    this.updateHeaderButtons();
  }
  /**
   * Render the inner application content. Only render a template if one is defined otherwise provide an empty
   * JQuery element.
   *
   * @param {Object} data         The data used to render the inner template
   *
   * @returns {Promise.<JQuery>}   A promise resolving to the constructed jQuery object
   *
   * @override
   * @private
   */


  async _renderInner(data) {
    const html = typeof this.template === 'string' ? await renderTemplate(this.template, data) : document.createDocumentFragment();
    return $(html);
  }
  /**
   * Provides a way to safely set this applications options given an accessor string which describes the
   * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
   * to walk.
   *
   * Additionally if an application shell Svelte component is mounted and exports the `appOptions` property then
   * the application options is set to `appOptions` potentially updating the application shell / Svelte component.
   *
   * // TODO DOCUMENT the accessor in more detail.
   *
   * @param {string}   accessor - The path / key to set. You can set multiple levels.
   *
   * @param {*}        value - Value to set.
   */


  setOptions(accessor, value) {
    const success = safeSet(this.options, accessor, value); // If `this.options` modified then update the app options store.

    if (success) {
      _classPrivateFieldGet(this, _storeAppOptionsUpdate$1).call(this, () => this.options);
    }
  }
  /**
   * Modified Application `setPosition` to support QuestTrackerApp for switchable resizable globalThis.
   * Set the application position and store its new location.
   *
   * @param {object}               [opts] - Optional parameters.
   *
   * @param {number|null}          [opts.left] - The left offset position in pixels
   *
   * @param {number|null}          [opts.top] - The top offset position in pixels
   *
   * @param {number|null}          [opts.width] - The application width in pixels
   *
   * @param {number|string|null}   [opts.height] - The application height in pixels
   *
   * @param {number|null}          [opts.scale] - The application scale as a numeric factor where 1.0 is default
   *
   * @param {boolean}              [opts.noHeight] - When true no element height is modified.
   *
   * @param {boolean}              [opts.noWidth] - When true no element width is modified.
   *
   * @returns {{left: number, top: number, width: number, height: number, scale:number}}
   * The updated position object for the application containing the new values
   */


  setPosition({
    left,
    top,
    width,
    height,
    scale,
    noHeight = false,
    noWidth = false
  } = {}) {
    const el = this.elementTarget;
    const currentPosition = this.position;
    const styles = globalThis.getComputedStyle(el); // Update width if an explicit value is passed, or if no width value is set on the element

    if (!el.style.width || width) {
      const tarW = width || el.offsetWidth;
      const minW = parseInt(styles.minWidth) || MIN_WINDOW_WIDTH;
      const maxW = el.style.maxWidth || globalThis.innerWidth;
      currentPosition.width = width = Math.clamped(tarW, minW, maxW);

      if (!noWidth) {
        el.style.width = `${width}px`;
      }

      if (width + currentPosition.left > globalThis.innerWidth) {
        left = currentPosition.left;
      }
    }

    width = el.offsetWidth; // Update height if an explicit value is passed, or if no height value is set on the element

    if (!el.style.height || height) {
      const tarH = height || el.offsetHeight + 1;
      const minH = parseInt(styles.minHeight) || MIN_WINDOW_HEIGHT;
      const maxH = el.style.maxHeight || globalThis.innerHeight;
      currentPosition.height = height = Math.clamped(tarH, minH, maxH);

      if (!noHeight) {
        el.style.height = `${height}px`;
      }

      if (height + currentPosition.top > globalThis.innerHeight + 1) {
        top = currentPosition.top - 1;
      }
    }

    height = el.offsetHeight; // Update Left

    if (!el.style.left || Number.isFinite(left)) {
      const tarL = Number.isFinite(left) ? left : (globalThis.innerWidth - width) / 2;
      const maxL = Math.max(globalThis.innerWidth - width, 0);
      currentPosition.left = left = Math.clamped(tarL, 0, maxL);
      el.style.left = `${left}px`;
    } // Update Top


    if (!el.style.top || Number.isFinite(top)) {
      const tarT = Number.isFinite(top) ? top : (globalThis.innerHeight - height) / 2;
      const maxT = Math.max(globalThis.innerHeight - height, 0);
      currentPosition.top = top = Math.clamped(tarT, 0, maxT);
      el.style.top = `${currentPosition.top}px`;
    } // Update Scale


    if (scale) {
      currentPosition.scale = Math.max(scale, 0);

      if (scale === 1) {
        el.style.transform = "";
      } else {
        el.style.transform = `scale(${scale})`;
      }
    } // Return the updated position object


    return currentPosition;
  }
  /**
   * Initializes the Svelte stores and derived stores for the application options and UI state.
   *
   * While writable stores are created the update method is stored in private variables locally and derived Readable
   * stores are provided for essential options which are commonly used.
   *
   * These stores are injected into all Svelte components mounted under the `external` context: `storeAppOptions` and
   * ` storeUIOptions`.
   */

  /**
   * Updates the UI Options store with the current header buttons. You may dynamically add / remove header buttons
   * if using an application shell Svelte component. In either overriding `_getHeaderButtons` or responding to the
   * Hooks fired return a new button array and the uiOptions store is updated and the application shell will render
   * the new buttons.
   *
   * Optionally you can set in the Foundry app options `headerButtonNoLabel` to true and labels will be removed from
   * the header buttons.
   */


  updateHeaderButtons() {
    const buttons = this._getHeaderButtons(); // Remove labels if this.options.headerButtonNoLabel is true;


    if (typeof this.options.headerButtonNoLabel === 'boolean' && this.options.headerButtonNoLabel) {
      for (const button of buttons) {
        button.label = void 0;
      }
    }

    _classPrivateFieldGet(this, _storeUIOptionsUpdate$1).call(this, options => {
      options.headerButtons = buttons;
      return options;
    });
  }

}
/**
 * Instantiates and attaches a Svelte component to the main inserted HTML.
 *
 * @param {SvelteApplication} app - The application
 *
 * @param {JQuery}            html - The inserted HTML.
 *
 * @param {object}            config - Svelte component options
 *
 * @param {StoreAppOptions}   storeAppOptions - Svelte store for app options.
 *
 * @param {StoreUIOptions}    storeUIOptions - Svelte store for UI options.
 *
 * @returns {object} The config + instantiated Svelte component.
 */


function _get_applicationShell$1() {
  return _classPrivateFieldGet(this, _applicationShellHolder$2)[0];
}

function _storesInitialize2$1() {
  const writtableAppOptions = writable(this.options); // Keep the update function locally, but make the store essentially readable.

  _classPrivateFieldSet(this, _storeAppOptionsUpdate$1, writtableAppOptions.update);
  /**
   * @type {StoreAppOptions}
   */


  const storeAppOptions = {
    subscribe: writtableAppOptions.subscribe,
    draggable: derived(writtableAppOptions, ($options, set) => set($options.draggable)),
    minimizable: derived(writtableAppOptions, ($options, set) => set($options.minimizable)),
    popOut: derived(writtableAppOptions, ($options, set) => set($options.popOut)),
    resizable: derived(writtableAppOptions, ($options, set) => set($options.resizable)),
    title: derived(writtableAppOptions, ($options, set) => set($options.title)),
    zIndex: derived(writtableAppOptions, ($options, set) => set(Number.isInteger($options.zIndex) ? $options.zIndex : null))
  };
  Object.freeze(storeAppOptions);

  _classPrivateFieldSet(this, _storeAppOptions$1, storeAppOptions); // Create a store for UI state data.


  const writableUIOptions = writable({
    headerButtons: [],
    minimized: this._minimized
  }); // Keep the update function locally, but make the store essentially readable.

  _classPrivateFieldSet(this, _storeUIOptionsUpdate$1, writableUIOptions.update);
  /**
   * @type {StoreUIOptions}
   */


  const storeUIOptions = {
    subscribe: writableUIOptions.subscribe,
    headerButtons: derived(writableUIOptions, ($options, set) => set($options.headerButtons)),
    minimized: derived(writableUIOptions, ($options, set) => set($options.minimized))
  };
  Object.freeze(storeUIOptions); // Initialize the store with options set in the Application constructor.

  _classPrivateFieldSet(this, _storeUIOptions$1, storeUIOptions);
}

function _storesSubscribe2$1() {
  // Register local subscriptions.
  _classPrivateFieldGet(this, _storeUnsubscribe$1).push(_classPrivateFieldGet(this, _storeAppOptions$1).popOut.subscribe(value => {
    if (value && this.rendered) {
      ui.windows[this.appId] = this;
    } else {
      delete ui.windows[this.appId];
    }
  })); // Handles directly updating the element root `z-index` style when `zIndex` changes.


  _classPrivateFieldGet(this, _storeUnsubscribe$1).push(_classPrivateFieldGet(this, _storeAppOptions$1).zIndex.subscribe(value => {
    if (this._element !== null) {
      this._element[0].style.zIndex = value;
    }
  }));
}

function _storesUnsubscribe2$1() {
  _classPrivateFieldGet(this, _storeUnsubscribe$1).forEach(unsubscribe => unsubscribe());

  _classPrivateFieldSet(this, _storeUnsubscribe$1, []);
}

function s_LOAD_CONFIG$1(app, html, config, storeAppOptions, storeUIOptions) {
  const svelteOptions = typeof config.options === 'object' ? config.options : {}; // TODO EVALUATE; COMMENTED OUT WHILE WORKING ON HandlebarsApplication.
  // if (typeof app.template === 'string' && typeof config.target !== 'string')
  // {
  //    throw new TypeError(
  //     `SvelteApplication - s_LOAD_CONFIG - Template defined and target selector not a string for config:\n${
  //      JSON.stringify(config)}`);
  // }

  let target;

  if (config.target instanceof HTMLElement) // A specific HTMLElement to append Svelte component.
    {
      target = config.target;
    } else if (typeof config.target === 'string') // A string target defines a selector to find in existing HTML.
    {
      target = html.find(config.target).get(0);
    } else // No target defined, create a document fragment.
    {
      target = document.createDocumentFragment();
    }

  if (target === void 0) {
    throw new Error(`SvelteApplication - s_LOAD_CONFIG - could not find target selector: ${config.target} for config:\n${JSON.stringify(config)}`);
  }

  const SvelteComponent = config.class;
  const svelteConfig = parseSvelteConfig(_objectSpread2(_objectSpread2({}, config), {}, {
    target
  }), app);
  const externalContext = svelteConfig.context.get('external'); // Inject the Foundry application instance as a Svelte prop.

  externalContext.foundryApp = app; // Always inject the appOptions and uiOptions stores.

  externalContext.storeAppOptions = storeAppOptions;
  externalContext.storeUIOptions = storeUIOptions;
  let eventbus; // Potentially inject any TyphonJS eventbus and track the proxy in the SvelteData instance.

  if (typeof app._eventbus === 'object' && typeof app._eventbus.createProxy === 'function') {
    eventbus = app._eventbus.createProxy();
    externalContext.eventbus = eventbus;
  } // Create the Svelte component.


  const component = new SvelteComponent(svelteConfig); // Set any eventbus to the config.

  svelteConfig.eventbus = eventbus;
  let element; // We can directly get the root element from components which follow the application store contract.

  if (isApplicationShell(component)) {
    element = component.elementRoot;
  } // Detect if target is a synthesized DocumentFragment with an child element. Child elements will be present
  // if the Svelte component mounts and renders initial content into the document fragment.


  if (config.target instanceof DocumentFragment && target.firstElementChild) {
    if (element === void 0) {
      element = target.firstElementChild;
    }

    html.append(target);
  } else if (config.target instanceof HTMLElement && element === void 0) {
    if (config.target instanceof HTMLElement && typeof svelteOptions.selectorElement !== 'string') {
      throw new Error(`SvelteApplication - s_LOAD_CONFIG - HTMLElement target with no 'selectorElement' defined for config:\n${JSON.stringify(config)}`);
    } // The target is an HTMLElement so find the Application element from `selectorElement` option.


    element = target.querySelector(svelteOptions.selectorElement);

    if (element === null || element === void 0) {
      throw new Error(`SvelteApplication - s_LOAD_CONFIG - HTMLElement target - could not find 'selectorElement' for config:\n${JSON.stringify(config)}`);
    }
  } // If the configuration / original target is an HTML element then do not inject HTML.


  const injectHTML = !(config.target instanceof HTMLElement);
  const result = {
    config: svelteConfig,
    component,
    element,
    injectHTML
  };
  Object.freeze(result);
  return result;
}

var _orignalPopOut$1 = /*#__PURE__*/new WeakMap();

class HandlebarsApplication extends SvelteApplication {
  /**
   * Temporarily holds the original popOut value when rendering.
   *
   * @type {boolean}
   */

  /**
   * @inheritDoc
   */
  constructor(options) {
    super(options);

    _classPrivateFieldInitSpec$1(this, _orignalPopOut$1, {
      writable: true,
      value: void 0
    });

    if (this.popOut) {
      this.options.svelte = foundry.utils.mergeObject(typeof this.options.svelte === 'object' ? this.options.svelte : {}, {
        class: ApplicationShell,
        intro: true,
        target: document.body
      });
    }
  }
  /**
   * Temporarily set popOut to false to only render inner HTML. This inner HTML will be appended to the content area
   * of ApplicationShell if the original popOut value is true.
   *
   * @inheritDoc
   */


  async _render(force, options) {
    _classPrivateFieldSet$1(this, _orignalPopOut$1, this.options.popOut);

    this.options.popOut = false;
    await super._render(force, options);
    this.options.popOut = _classPrivateFieldGet$1(this, _orignalPopOut$1);
  }

  _injectHTML(html) {
    var _this$svelte, _this$svelte$applicat;

    // Mounts any Svelte components.
    super._injectHTML(html); // Appends inner HTML content to application shell content element.


    if ((_this$svelte = this.svelte) !== null && _this$svelte !== void 0 && (_this$svelte$applicat = _this$svelte.applicationShell) !== null && _this$svelte$applicat !== void 0 && _this$svelte$applicat.elementContent) {
      this.svelte.applicationShell.elementContent.appendChild(...html);
    }
  }
  /**
   * Override replacing HTML as Svelte components control the rendering process. Only potentially change the outer
   * application frame / title for pop-out applications.
   *
   * @override
   * @inheritDoc
   */


  _replaceHTML(element, html) // eslint-disable-line no-unused-vars
  {
    var _this$svelte2, _this$svelte2$applica;

    if (!element.length) {
      return;
    }

    super._replaceHTML(element, html);

    if ((_this$svelte2 = this.svelte) !== null && _this$svelte2 !== void 0 && (_this$svelte2$applica = _this$svelte2.applicationShell) !== null && _this$svelte2$applica !== void 0 && _this$svelte2$applica.elementContent) {
      const elementContent = this.svelte.applicationShell.elementContent; // Remove existing children.

      while (elementContent.firstChild && !elementContent.lastChild.remove()) {} // eslint-disable-line no-empty


      elementContent.appendChild(...html); // Use the setter from `SvelteFormApplication` to set the title store.

      this.title = this.title; // eslint-disable-line no-self-assign
    } else {
      element.replaceWith(html);
      this._element = html;
      this.elementTarget = html[0];
    }
  }

}

var _applicationShellHolder$1 = /*#__PURE__*/new WeakMap();

var _svelteData$1 = /*#__PURE__*/new WeakMap();

/**
 * Provides a helper class for {@link SvelteApplication} by combining all methods that work on the {@link SvelteData[]}
 * of mounted components. This class is instantiated and can be retrieved by the getter `svelte` via SvelteApplication.
 */
class GetSvelteData {
  /**
   * @type {ApplicationShell|null[]}
   */

  /**
   * @type {SvelteData[]}
   */

  /**
   * Keep a direct reference to the SvelteData array in an associated {@link SvelteApplication}.
   *
   * @param {ApplicationShell|null[]}  applicationShellHolder - A reference to the ApplicationShell array.
   *
   * @param {SvelteData[]}  svelteData - A reference to the SvelteData array of mounted components.
   */
  constructor(applicationShellHolder, svelteData) {
    _classPrivateFieldInitSpec$1(this, _applicationShellHolder$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec$1(this, _svelteData$1, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldSet$1(this, _applicationShellHolder$1, applicationShellHolder);

    _classPrivateFieldSet$1(this, _svelteData$1, svelteData);
  }
  /**
   * Returns any mounted {@link ApplicationShell}.
   *
   * @returns {ApplicationShell|null} Any mounted application shell.
   */


  get applicationShell() {
    return _classPrivateFieldGet$1(this, _applicationShellHolder$1)[0];
  }
  /**
   * Returns the indexed Svelte component.
   *
   * @param {number}   index -
   *
   * @returns {object} The loaded Svelte component.
   */


  component(index) {
    const data = _classPrivateFieldGet$1(this, _svelteData$1)[index];

    return typeof data === 'object' ? data === null || data === void 0 ? void 0 : data.component : void 0;
  }
  /**
   * Returns the Svelte component entries iterator.
   *
   * @returns {Generator<(number|*)[], void, *>} Svelte component entries iterator.
   * @yields
   */


  *componentEntries() {
    for (let cntr = 0; cntr < _classPrivateFieldGet$1(this, _svelteData$1).length; cntr++) {
      yield [cntr, _classPrivateFieldGet$1(this, _svelteData$1)[cntr].component];
    }
  }
  /**
   * Returns the Svelte component values iterator.
   *
   * @returns {Generator<*, void, *>} Svelte component values iterator.
   * @yields
   */


  *componentValues() {
    for (let cntr = 0; cntr < _classPrivateFieldGet$1(this, _svelteData$1).length; cntr++) {
      yield _classPrivateFieldGet$1(this, _svelteData$1)[cntr].component;
    }
  }
  /**
   * Returns the indexed SvelteData entry.
   *
   * @param {number}   index -
   *
   * @returns {object} The loaded Svelte config + component.
   */


  data(index) {
    return _classPrivateFieldGet$1(this, _svelteData$1)[index];
  }
  /**
   * Returns the SvelteData entries iterator.
   *
   * @returns {IterableIterator<[number, Object]>} SvelteData entries iterator.
   */


  dataEntries() {
    return _classPrivateFieldGet$1(this, _svelteData$1).entries();
  }
  /**
   * Returns the SvelteData values iterator.
   *
   * @returns {IterableIterator<Object>} SvelteData values iterator.
   */


  dataValues() {
    return _classPrivateFieldGet$1(this, _svelteData$1).values();
  }

  get length() {
    return _classPrivateFieldGet$1(this, _svelteData$1).length;
  }

}

Object.freeze(GetSvelteData);
/**
 * @typedef {object} SvelteData
 *
 * @property {object}            config -
 *
 * @property {SvelteComponent}   component -
 *
 * @property {HTMLElement}       element -
 *
 * @property {Eventbus}          eventbus -
 */

/**
 * Provides a Svelte aware extension to FormApplication to control the app lifecycle appropriately.
 *
 * NOTE: THIS IS ONLY TO BE USED FOR {@link HandlebarsFormApplication}.
 *
 * @see SvelteApplication
 */

var _applicationShellHolder = /*#__PURE__*/new WeakMap();

var _applicationShell = /*#__PURE__*/new WeakMap();

var _elementTarget = /*#__PURE__*/new WeakMap();

var _elementContent = /*#__PURE__*/new WeakMap();

var _storeAppOptions = /*#__PURE__*/new WeakMap();

var _storeAppOptionsUpdate = /*#__PURE__*/new WeakMap();

var _storeUIOptions = /*#__PURE__*/new WeakMap();

var _storeUIOptionsUpdate = /*#__PURE__*/new WeakMap();

var _storeUnsubscribe = /*#__PURE__*/new WeakMap();

var _svelteData = /*#__PURE__*/new WeakMap();

var _getSvelteData = /*#__PURE__*/new WeakMap();

var _storesInitialize = /*#__PURE__*/new WeakSet();

var _storesSubscribe = /*#__PURE__*/new WeakSet();

var _storesUnsubscribe = /*#__PURE__*/new WeakSet();

class SvelteFormApplication extends FormApplication {
  /**
   * Stores the first mounted component which follows the application shell contract.
   *
   * @type {ApplicationShell|null[]} Application shell.
   */

  /**
   * Get the current application shell.
   *
   * @returns {ApplicationShell|null} The first mounted component which follows the application shell contract.
   */

  /**
   * Stores the target element which may not necessarily be the main element.
   *
   * @type {HTMLElement}
   */

  /**
   * Stores the content element which is set for application shells.
   *
   * @type {HTMLElement}
   */

  /**
   * The Application option store which is injected into mounted Svelte component context under the `external` key.
   *
   * @type {StoreAppOptions}
   */

  /**
   * Stores the update function for `#storeAppOptions`.
   *
   * @type {import('svelte/store').Writable.update}
   */

  /**
   * The UI option store which is injected into mounted Svelte component context under the `external` key.
   *
   * @type {StoreUIOptions}
   */

  /**
   * Stores the update function for `#storeUIOptions`.
   *
   * @type {import('svelte/store').Writable.update}
   */

  /**
   * Stores the unsubscribe functions from local store subscriptions.
   *
   * @type {import('svelte/store').Unsubscriber[]}
   */

  /**
   * Stores SvelteData entries with instantiated Svelte components.
   *
   * @type {SvelteData[]}
   */

  /**
   * Provides a helper class that combines multiple methods for interacting with the mounted components tracked in
   * {@link #svelteData}.
   *
   * @type {GetSvelteData}
   */

  /**
   * @inheritDoc
   */
  constructor(object, options) {
    super(object, options);

    _classPrivateMethodInitSpec$1(this, _storesUnsubscribe);

    _classPrivateMethodInitSpec$1(this, _storesSubscribe);

    _classPrivateMethodInitSpec$1(this, _storesInitialize);

    _classPrivateFieldInitSpec$1(this, _applicationShell, {
      get: _get_applicationShell,
      set: void 0
    });

    _classPrivateFieldInitSpec$1(this, _applicationShellHolder, {
      writable: true,
      value: [null]
    });

    _classPrivateFieldInitSpec$1(this, _elementTarget, {
      writable: true,
      value: null
    });

    _classPrivateFieldInitSpec$1(this, _elementContent, {
      writable: true,
      value: null
    });

    _classPrivateFieldInitSpec$1(this, _storeAppOptions, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec$1(this, _storeAppOptionsUpdate, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec$1(this, _storeUIOptions, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec$1(this, _storeUIOptionsUpdate, {
      writable: true,
      value: void 0
    });

    _classPrivateFieldInitSpec$1(this, _storeUnsubscribe, {
      writable: true,
      value: []
    });

    _classPrivateFieldInitSpec$1(this, _svelteData, {
      writable: true,
      value: []
    });

    _classPrivateFieldInitSpec$1(this, _getSvelteData, {
      writable: true,
      value: new GetSvelteData(_classPrivateFieldGet$1(this, _applicationShellHolder), _classPrivateFieldGet$1(this, _svelteData))
    });

    _classPrivateMethodGet$1(this, _storesInitialize, _storesInitialize2).call(this);
  }
  /**
   * Specifies the default options that SvelteApplication supports.
   *
   * @returns {object} options - Application options.
   * @see https://foundryvtt.com/api/Application.html#options
   */


  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      draggable: true,
      // If true then application shells are draggable.
      headerButtonNoLabel: false,
      // If true then header button labels are removed for application shells.
      jqueryCloseAnimation: true,
      // If false the Foundry JQuery close animation is not run.
      zIndex: null // When set the zIndex is manually controlled.

    });
  }
  /**
   * Returns the draggable app option.
   *
   * @returns {boolean} Draggable app option.
   */


  get draggable() {
    return this.options.draggable;
  }
  /**
   * Returns the content element if an application shell is mounted.
   *
   * @returns {HTMLElement} Content element.
   */


  get elementContent() {
    return _classPrivateFieldGet$1(this, _elementContent);
  }
  /**
   * Returns the target element or main element if no target defined.
   *
   * @returns {HTMLElement} Target element.
   */


  get elementTarget() {
    return _classPrivateFieldGet$1(this, _elementTarget);
  }
  /**
   * @inheritDoc
   */


  get popOut() {
    return super.popOut;
  }
  /**
   * Returns the resizable option.
   *
   * @returns {boolean} Resizable app option.
   */


  get resizable() {
    return this.options.resizable;
  }
  /**
   * Returns the Svelte helper class w/ various methods to access mounted Svelte components.
   *
   * @returns {GetSvelteData} GetSvelteData
   */


  get svelte() {
    return _classPrivateFieldGet$1(this, _getSvelteData);
  }
  /**
   * Returns the title accessor from the parent Application class.
   * TODO: Application v2; note that super.title localizes `this.options.title`; IMHO it shouldn't.
   *
   * @returns {string} Title.
   */


  get title() {
    return super.title;
  }
  /**
   * Returns the zIndex app option.
   *
   * @returns {number} z-index app option.
   */


  get zIndex() {
    return this.options.zIndex;
  }
  /**
   * Sets `this.options.draggable` which is reactive for application shells.
   *
   * @param {boolean}  draggable - Sets the draggable option.
   */


  set draggable(draggable) {
    if (typeof draggable === 'boolean') {
      this.setOptions('draggable', draggable);
    }
  }
  /**
   * Sets the content element.
   *
   * @param {HTMLElement} content - Content element.
   */


  set elementContent(content) {
    if (!(content instanceof HTMLElement)) {
      throw new TypeError(`SvelteFormApplication - set elementContent error: 'content' is not an HTMLElement.`);
    }

    _classPrivateFieldSet$1(this, _elementContent, content);
  }
  /**
   * Sets the target element or main element if no target defined.
   *
   * @param {HTMLElement} target - Target element.
   */


  set elementTarget(target) {
    if (!(target instanceof HTMLElement)) {
      throw new TypeError(`SvelteFormApplication - set elementTarget error: 'target' is not an HTMLElement.`);
    }

    _classPrivateFieldSet$1(this, _elementTarget, target);
  }
  /**
   * Sets `this.options.popOut` which is reactive for application shells. This will add / remove this application
   * from `ui.windows`.
   *
   * @param {boolean}  popOut - Sets the popOut option.
   */


  set popOut(popOut) {
    if (typeof popOut === 'boolean') {
      this.setOptions('popOut', popOut);
    }
  }
  /**
   * Sets `this.options.resizable` which is reactive for application shells.
   *
   * @param {boolean}  resizable - Sets the resizable option.
   */


  set resizable(resizable) {
    if (typeof resizable === 'boolean') {
      this.setOptions('resizable', resizable);
    }
  }
  /**
   * Sets `this.options.title` which is reactive for application shells.
   *
   * @param {string}   title - Application title; will be localized, so a translation key is fine.
   */


  set title(title) {
    if (typeof title === 'string') {
      this.setOptions('title', title);
    }
  }
  /**
   * Sets `this.options.zIndex` which is reactive for application shells.
   *
   * @param {number}   zIndex - Application z-index.
   */


  set zIndex(zIndex) {
    this.setOptions('zIndex', Number.isInteger(zIndex) ? zIndex : null);
  }
  /**
   * Note: This method is fully overridden and duplicated as Svelte components need to be destroyed manually and the
   * best visual result is to destroy them after the default JQuery slide up animation occurs, but before the element
   * is removed from the DOM.
   *
   * If you destroy the Svelte components before the slide up animation the Svelte elements are removed immediately
   * from the DOM. The purpose of overriding ensures the slide up animation is always completed before
   * the Svelte components are destroyed and then the element is removed from the DOM.
   *
   * Close the application and un-register references to it within UI mappings.
   * This function returns a Promise which resolves once the window closing animation concludes
   *
   * @param {object}   options - Optional parameters.
   *
   * @param {boolean}  options.force - Force close regardless of render state.
   *
   * @returns {Promise<void|number>}    A Promise which resolves once the application is closed
   */


  async close(options = {}) {
    const states = Application.RENDER_STATES;

    if (!options.force && ![states.RENDERED, states.ERROR].includes(this._state)) {
      return;
    } // Unsubscribe from any local stores.


    _classPrivateMethodGet$1(this, _storesUnsubscribe, _storesUnsubscribe2).call(this);

    this._state = states.CLOSING;
    /**
     * Get the element.
     *
     * @type {JQuery}
     */

    const el = $(_classPrivateFieldGet$1(this, _elementTarget));

    if (!el) {
      return this._state = states.CLOSED;
    } // Dispatch Hooks for closing the base and subclass applications


    for (const cls of this.constructor._getInheritanceChain()) {
      /**
       * A hook event that fires whenever this Application is closed.
       *
       * @param {Application} app                     The Application instance being closed
       *
       * @param {jQuery[]} html                       The application HTML when it is closed
       *
       * @function closeApplication
       *
       * @memberof hookEvents
       */
      Hooks.call(`close${cls.name}`, this, el);
    } // If options `jqueryCloseAnimation` is false then do not execute the standard JQuery slide up animation.
    // This allows Svelte components to provide any out transition. Application shells will automatically set
    // `jqueryCloseAnimation` based on any out transition set or unset.


    const animate = typeof this.options.jqueryCloseAnimation === 'boolean' ? this.options.jqueryCloseAnimation : true;

    if (animate) {
      // Await on JQuery to slide up the main element.
      el[0].style.minHeight = '0';
      await new Promise(resolve => {
        el.slideUp(200, () => resolve());
      });
    } // Stores the Promises returned from running outro transitions and destroying each Svelte component.


    const svelteDestroyPromises = []; // Manually invoke the destroy callbacks for all Svelte components.

    for (const entry of _classPrivateFieldGet$1(this, _svelteData)) {
      // Use `outroAndDestroy` to run outro transitions before destroying.
      svelteDestroyPromises.push(outroAndDestroy(entry.component)); // If any proxy eventbus has been added then remove all event registrations from the component.

      const eventbus = entry.config.eventbus;

      if (typeof eventbus === 'object' && typeof eventbus.off === 'function') {
        eventbus.off();
        entry.config.eventbus = void 0;
      }
    } // Await all Svelte components to destroy.


    await Promise.all(svelteDestroyPromises); // Reset SvelteData like this to maintain reference to GetSvelteData / `this.svelte`.

    _classPrivateFieldGet$1(this, _svelteData).length = 0; // Use JQuery to remove `this._element` from the DOM. Most SvelteComponents have already removed it.

    el.remove(); // Clean up data

    _classPrivateFieldGet$1(this, _applicationShellHolder)[0] = null;
    this._element = null;

    _classPrivateFieldSet$1(this, _elementContent, null);

    _classPrivateFieldSet$1(this, _elementTarget, null);

    delete ui.windows[this.appId];
    this._minimized = false;
    this._scrollPositions = null;
    this._state = states.CLOSED; // Update the minimized UI store options.

    _classPrivateFieldGet$1(this, _storeUIOptionsUpdate).call(this, storeOptions => foundry.utils.mergeObject(storeOptions, {
      minimized: this._minimized
    }));
  }
  /**
   * Provides a way to safely get this applications options given an accessor string which describes the
   * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
   * to walk.
   *
   * // TODO DOCUMENT the accessor in more detail.
   *
   * @param {string}   accessor - The path / key to set. You can set multiple levels.
   *
   * @param {*}        [defaultValue] - A default value returned if the accessor is not found.
   *
   * @returns {*} Value at the accessor.
   */


  getOptions(accessor, defaultValue) {
    return safeAccess(this.options, accessor, defaultValue);
  }
  /**
   * Inject the Svelte components defined in `this.options.svelte`. The Svelte component can attach to the existing
   * pop-out of Application or provide no template and render into a document fragment which is then attached to the
   * DOM.
   *
   * @param {JQuery} html -
   *
   * @override
   * @inheritDoc
   */


  _injectHTML(html) {
    if (this.popOut && html.length === 0 && Array.isArray(this.options.svelte)) {
      throw new Error('SvelteApplication - _injectHTML - A popout app with no template can only support one Svelte component.');
    } // Make sure the store is updated with the latest header buttons. Also allows filtering buttons before display.


    this.updateHeaderButtons();

    if (Array.isArray(this.options.svelte)) {
      for (const svelteConfig of this.options.svelte) {
        const svelteData = s_LOAD_CONFIG(this, html, svelteConfig, _classPrivateFieldGet$1(this, _storeAppOptions), _classPrivateFieldGet$1(this, _storeUIOptions));

        if (isApplicationShell(svelteData.component)) {
          if (_classPrivateFieldGet$1(this, _applicationShell) !== null) {
            throw new Error(`SvelteApplication - _injectHTML - An application shell is already mounted; offending config: 
                    ${JSON.stringify(svelteConfig)}`);
          }

          _classPrivateFieldGet$1(this, _applicationShellHolder)[0] = svelteData.component;
        }

        _classPrivateFieldGet$1(this, _svelteData).push(svelteData);
      }
    } else if (typeof this.options.svelte === 'object') {
      const svelteData = s_LOAD_CONFIG(this, html, this.options.svelte, _classPrivateFieldGet$1(this, _storeAppOptions), _classPrivateFieldGet$1(this, _storeUIOptions));

      if (isApplicationShell(svelteData.component)) {
        // A sanity check as shouldn't hit this case as only one component is being mounted.
        if (_classPrivateFieldGet$1(this, _applicationShell) !== null) {
          throw new Error(`SvelteApplication - _injectHTML - An application shell is already mounted; offending config: 
                 ${JSON.stringify(this.options.svelte)}`);
        }

        _classPrivateFieldGet$1(this, _applicationShellHolder)[0] = svelteData.component;
      }

      _classPrivateFieldGet$1(this, _svelteData).push(svelteData);
    } // TODO EVALUATE; COMMENTED OUT WHILE WORKING ON HandlebarsApplication.
    // else
    // {
    //    throw new TypeError(`SvelteApplication - _injectHTML - this.options.svelte not an array or object.`);
    // }
    // Detect if this is a synthesized DocumentFragment.


    const isDocumentFragment = html.length && html[0] instanceof DocumentFragment; // If any of the Svelte components mounted directly targets an HTMLElement then do not inject HTML.

    let injectHTML = true;

    for (const svelteData of _classPrivateFieldGet$1(this, _svelteData)) {
      if (!svelteData.injectHTML) {
        injectHTML = false;
        break;
      }
    }

    if (injectHTML) {
      super._injectHTML(html);
    }

    if (_classPrivateFieldGet$1(this, _applicationShell) !== null) {
      this._element = $(_classPrivateFieldGet$1(this, _applicationShell).elementRoot); // Detect if the application shell exports an `elementContent` accessor.

      _classPrivateFieldSet$1(this, _elementContent, hasGetter(_classPrivateFieldGet$1(this, _applicationShell), 'elementContent') ? _classPrivateFieldGet$1(this, _applicationShell).elementContent : null); // Detect if the application shell exports an `elementTarget` accessor.


      _classPrivateFieldSet$1(this, _elementTarget, hasGetter(_classPrivateFieldGet$1(this, _applicationShell), 'elementTarget') ? _classPrivateFieldGet$1(this, _applicationShell).elementTarget : null);
    } else if (isDocumentFragment) // Set the element of the app to the first child element in order of Svelte components mounted.
      {
        for (const svelteData of _classPrivateFieldGet$1(this, _svelteData)) {
          if (svelteData.element instanceof HTMLElement) {
            this._element = $(svelteData.element);
            break;
          }
        }
      } // Potentially retrieve a specific target element if `selectorTarget` is defined otherwise make the target the
    // main element.


    if (_classPrivateFieldGet$1(this, _elementTarget) === null) {
      const element = typeof this.options.selectorTarget === 'string' ? this._element.find(this.options.selectorTarget) : this._element;

      _classPrivateFieldSet$1(this, _elementTarget, element[0]);
    } // TODO VERIFY THIS CHECK ESPECIALLY `this.#elementTarget.length === 0`.


    if (_classPrivateFieldGet$1(this, _elementTarget) === null || _classPrivateFieldGet$1(this, _elementTarget) === void 0 || _classPrivateFieldGet$1(this, _elementTarget).length === 0) {
      throw new Error(`SvelteApplication - _injectHTML: Target element '${this.options.selectorTarget}' not found.`);
    } // Subscribe to local store handling. Defer to next clock tick for the render cycle to complete.


    setTimeout(() => _classPrivateMethodGet$1(this, _storesSubscribe, _storesSubscribe2).call(this), 0);
    this.onSvelteMount({
      element: this._element[0],
      elementContent: _classPrivateFieldGet$1(this, _elementContent),
      elementTarget: _classPrivateFieldGet$1(this, _elementTarget)
    });
  }
  /**
   * Provides a mechanism to update the UI options store for minimized.
   *
   * Note: the sanity check is duplicated from {@link Application.maximize} and the store is updated _before_
   * the actual parent method is invoked. This allows application shells to remove / show any resize handlers
   * correctly.
   *
   * @inheritDoc
   */


  async maximize() {
    if (!this.popOut || [false, null].includes(this._minimized)) {
      return;
    }

    _classPrivateFieldGet$1(this, _storeUIOptionsUpdate).call(this, options => foundry.utils.mergeObject(options, {
      minimized: false
    }));

    return super.maximize();
  }
  /**
   * Provides a mechanism to update the UI options store for minimized.
   *
   * Note: the sanity check is duplicated from {@link Application.minimize} and the store is updated _before_
   * the actual parent method is invoked. This allows application shells to remove / show any resize handlers
   * correctly.
   *
   * @inheritDoc
   */


  async minimize() {
    if (!this.rendered || !this.popOut || [true, null].includes(this._minimized)) {
      return;
    }

    _classPrivateFieldGet$1(this, _storeUIOptionsUpdate).call(this, options => foundry.utils.mergeObject(options, {
      minimized: true
    }));

    return super.minimize();
  }
  /**
   * Provides a way to merge `options` into this applications options and update the appOptions store.
   *
   * @param {object}   options - The options object to merge with `this.options`.
   */


  mergeOptions(options) {
    _classPrivateFieldGet$1(this, _storeAppOptionsUpdate).call(this, instanceOptions => foundry.utils.mergeObject(instanceOptions, options));
  }
  /**
   * Provides a callback after all Svelte components are initialized.
   *
   * @param {object}      [opts] - Optional parameters.
   *
   * @param {HTMLElement} [opts.element] - HTMLElement container for main application element.
   *
   * @param {HTMLElement} [opts.elementContent] - HTMLElement container for content area of application shells.
   *
   * @param {HTMLElement} [opts.elementTarget] - HTMLElement container for main application target element.
   */


  onSvelteMount({
    element,
    elementContent,
    elementTarget
  }) {} // eslint-disable-line no-unused-vars

  /**
   * Override replacing HTML as Svelte components control the rendering process. Only potentially change the outer
   * application frame / title for pop-out applications.
   *
   * @override
   * @inheritDoc
   */


  _replaceHTML(element, html) // eslint-disable-line no-unused-vars
  {
    if (!element.length) {
      return;
    }

    this.updateHeaderButtons();
  }
  /**
   * Render the inner application content. Only render a template if one is defined otherwise provide an empty
   * JQuery element.
   *
   * @param {Object} data         The data used to render the inner template
   *
   * @returns {Promise.<JQuery>}   A promise resolving to the constructed jQuery object
   *
   * @override
   * @private
   */


  async _renderInner(data) {
    const html = typeof this.template === 'string' ? await renderTemplate(this.template, data) : document.createDocumentFragment();
    return $(html);
  }
  /**
   * Provides a way to safely set this applications options given an accessor string which describes the
   * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
   * to walk.
   *
   * Additionally if an application shell Svelte component is mounted and exports the `appOptions` property then
   * the application options is set to `appOptions` potentially updating the application shell / Svelte component.
   *
   * // TODO DOCUMENT the accessor in more detail.
   *
   * @param {string}   accessor - The path / key to set. You can set multiple levels.
   *
   * @param {*}        value - Value to set.
   */


  setOptions(accessor, value) {
    const success = safeSet(this.options, accessor, value); // If `this.options` modified then update the app options store.

    if (success) {
      _classPrivateFieldGet$1(this, _storeAppOptionsUpdate).call(this, () => this.options);
    }
  }
  /**
   * Modified Application `setPosition` to support QuestTrackerApp for switchable resizable globalThis.
   * Set the application position and store its new location.
   *
   * @param {object}               [opts] - Optional parameters.
   *
   * @param {number|null}          [opts.left] - The left offset position in pixels
   *
   * @param {number|null}          [opts.top] - The top offset position in pixels
   *
   * @param {number|null}          [opts.width] - The application width in pixels
   *
   * @param {number|string|null}   [opts.height] - The application height in pixels
   *
   * @param {number|null}          [opts.scale] - The application scale as a numeric factor where 1.0 is default
   *
   * @param {boolean}              [opts.noHeight] - When true no element height is modified.
   *
   * @param {boolean}              [opts.noWidth] - When true no element width is modified.
   *
   * @returns {{left: number, top: number, width: number, height: number, scale:number}}
   * The updated position object for the application containing the new values
   */


  setPosition({
    left,
    top,
    width,
    height,
    scale,
    noHeight = false,
    noWidth = false
  } = {}) {
    const el = this.elementTarget;
    const currentPosition = this.position;
    const styles = globalThis.getComputedStyle(el); // Update width if an explicit value is passed, or if no width value is set on the element

    if (!el.style.width || width) {
      const tarW = width || el.offsetWidth;
      const minW = parseInt(styles.minWidth) || MIN_WINDOW_WIDTH;
      const maxW = el.style.maxWidth || globalThis.innerWidth;
      currentPosition.width = width = Math.clamped(tarW, minW, maxW);

      if (!noWidth) {
        el.style.width = `${width}px`;
      }

      if (width + currentPosition.left > globalThis.innerWidth) {
        left = currentPosition.left;
      }
    }

    width = el.offsetWidth; // Update height if an explicit value is passed, or if no height value is set on the element

    if (!el.style.height || height) {
      const tarH = height || el.offsetHeight + 1;
      const minH = parseInt(styles.minHeight) || MIN_WINDOW_HEIGHT;
      const maxH = el.style.maxHeight || globalThis.innerHeight;
      currentPosition.height = height = Math.clamped(tarH, minH, maxH);

      if (!noHeight) {
        el.style.height = `${height}px`;
      }

      if (height + currentPosition.top > globalThis.innerHeight + 1) {
        top = currentPosition.top - 1;
      }
    }

    height = el.offsetHeight; // Update Left

    if (!el.style.left || Number.isFinite(left)) {
      const tarL = Number.isFinite(left) ? left : (globalThis.innerWidth - width) / 2;
      const maxL = Math.max(globalThis.innerWidth - width, 0);
      currentPosition.left = left = Math.clamped(tarL, 0, maxL);
      el.style.left = `${left}px`;
    } // Update Top


    if (!el.style.top || Number.isFinite(top)) {
      const tarT = Number.isFinite(top) ? top : (globalThis.innerHeight - height) / 2;
      const maxT = Math.max(globalThis.innerHeight - height, 0);
      currentPosition.top = top = Math.clamped(tarT, 0, maxT);
      el.style.top = `${currentPosition.top}px`;
    } // Update Scale


    if (scale) {
      currentPosition.scale = Math.max(scale, 0);

      if (scale === 1) {
        el.style.transform = "";
      } else {
        el.style.transform = `scale(${scale})`;
      }
    } // Return the updated position object


    return currentPosition;
  }
  /**
   * Initializes the Svelte stores and derived stores for the application options and UI state.
   *
   * While writable stores are created the update method is stored in private variables locally and derived Readable
   * stores are provided for essential options which are commonly used.
   *
   * These stores are injected into all Svelte components mounted under the `external` context: `storeAppOptions` and
   * ` storeUIOptions`.
   */


  /**
   * Updates the UI Options store with the current header buttons. You may dynamically add / remove header buttons
   * if using an application shell Svelte component. In either overriding `_getHeaderButtons` or responding to the
   * Hooks fired return a new button array and the uiOptions store is updated and the application shell will render
   * the new buttons.
   *
   * Optionally you can set in the Foundry app options `headerButtonNoLabel` to true and labels will be removed from
   * the header buttons.
   */
  updateHeaderButtons() {
    const buttons = this._getHeaderButtons(); // Remove labels if this.options.headerButtonNoLabel is true;


    if (typeof this.options.headerButtonNoLabel === 'boolean' && this.options.headerButtonNoLabel) {
      for (const button of buttons) {
        button.label = void 0;
      }
    }

    _classPrivateFieldGet$1(this, _storeUIOptionsUpdate).call(this, options => {
      options.headerButtons = buttons;
      return options;
    });
  }

}
/**
 * Instantiates and attaches a Svelte component to the main inserted HTML.
 *
 * @param {SvelteApplication} app - The application
 *
 * @param {JQuery}            html - The inserted HTML.
 *
 * @param {object}            config - Svelte component options
 *
 * @param {StoreAppOptions}   storeAppOptions - Svelte store for app options.
 *
 * @param {StoreUIOptions}    storeUIOptions - Svelte store for UI options.
 *
 * @returns {object} The config + instantiated Svelte component.
 */

function _get_applicationShell() {
  return _classPrivateFieldGet$1(this, _applicationShellHolder)[0];
}

function _storesInitialize2() {
  const writtableAppOptions = writable(this.options); // Keep the update function locally, but make the store essentially readable.

  _classPrivateFieldSet$1(this, _storeAppOptionsUpdate, writtableAppOptions.update);
  /**
   * @type {StoreAppOptions}
   */


  const storeAppOptions = {
    subscribe: writtableAppOptions.subscribe,
    draggable: derived(writtableAppOptions, ($options, set) => set($options.draggable)),
    minimizable: derived(writtableAppOptions, ($options, set) => set($options.minimizable)),
    popOut: derived(writtableAppOptions, ($options, set) => set($options.popOut)),
    resizable: derived(writtableAppOptions, ($options, set) => set($options.resizable)),
    title: derived(writtableAppOptions, ($options, set) => set($options.title)),
    zIndex: derived(writtableAppOptions, ($options, set) => set(Number.isInteger($options.zIndex) ? $options.zIndex : null))
  };
  Object.freeze(storeAppOptions);

  _classPrivateFieldSet$1(this, _storeAppOptions, storeAppOptions); // Create a store for UI state data.


  const writableUIOptions = writable({
    headerButtons: [],
    minimized: this._minimized
  }); // Keep the update function locally, but make the store essentially readable.

  _classPrivateFieldSet$1(this, _storeUIOptionsUpdate, writableUIOptions.update);
  /**
   * @type {StoreUIOptions}
   */


  const storeUIOptions = {
    subscribe: writableUIOptions.subscribe,
    headerButtons: derived(writableUIOptions, ($options, set) => set($options.headerButtons)),
    minimized: derived(writableUIOptions, ($options, set) => set($options.minimized))
  };
  Object.freeze(storeUIOptions); // Initialize the store with options set in the Application constructor.

  _classPrivateFieldSet$1(this, _storeUIOptions, storeUIOptions);
}

function _storesSubscribe2() {
  // Register local subscriptions.
  _classPrivateFieldGet$1(this, _storeUnsubscribe).push(_classPrivateFieldGet$1(this, _storeAppOptions).popOut.subscribe(value => {
    if (value && this.rendered) {
      ui.windows[this.appId] = this;
    } else {
      delete ui.windows[this.appId];
    }
  })); // Handles directly updating the element root `z-index` style when `zIndex` changes.


  _classPrivateFieldGet$1(this, _storeUnsubscribe).push(_classPrivateFieldGet$1(this, _storeAppOptions).zIndex.subscribe(value => {
    if (this._element !== null) {
      this._element[0].style.zIndex = value;
    }
  }));
}

function _storesUnsubscribe2() {
  _classPrivateFieldGet$1(this, _storeUnsubscribe).forEach(unsubscribe => unsubscribe());

  _classPrivateFieldSet$1(this, _storeUnsubscribe, []);
}

function s_LOAD_CONFIG(app, html, config, storeAppOptions, storeUIOptions) {
  const svelteOptions = typeof config.options === 'object' ? config.options : {}; // TODO EVALUATE; COMMENTED OUT WHILE WORKING ON HandlebarsApplication.
  // if (typeof app.template === 'string' && typeof config.target !== 'string')
  // {
  //    throw new TypeError(
  //     `SvelteApplication - s_LOAD_CONFIG - Template defined and target selector not a string for config:\n${
  //      JSON.stringify(config)}`);
  // }

  let target;

  if (config.target instanceof HTMLElement) // A specific HTMLElement to append Svelte component.
    {
      target = config.target;
    } else if (typeof config.target === 'string') // A string target defines a selector to find in existing HTML.
    {
      target = html.find(config.target).get(0);
    } else // No target defined, create a document fragment.
    {
      target = document.createDocumentFragment();
    }

  if (target === void 0) {
    throw new Error(`SvelteApplication - s_LOAD_CONFIG - could not find target selector: ${config.target} for config:\n${JSON.stringify(config)}`);
  }

  const SvelteComponent = config.class;
  const svelteConfig = parseSvelteConfig(_objectSpread2$1(_objectSpread2$1({}, config), {}, {
    target
  }), app);
  const externalContext = svelteConfig.context.get('external'); // Inject the Foundry application instance as a Svelte prop.

  externalContext.foundryApp = app; // Always inject the appOptions and uiOptions stores.

  externalContext.storeAppOptions = storeAppOptions;
  externalContext.storeUIOptions = storeUIOptions;
  let eventbus; // Potentially inject any TyphonJS eventbus and track the proxy in the SvelteData instance.

  if (typeof app._eventbus === 'object' && typeof app._eventbus.createProxy === 'function') {
    eventbus = app._eventbus.createProxy();
    externalContext.eventbus = eventbus;
  } // Create the Svelte component.


  const component = new SvelteComponent(svelteConfig); // Set any eventbus to the config.

  svelteConfig.eventbus = eventbus;
  let element; // We can directly get the root element from components which follow the application store contract.

  if (isApplicationShell(component)) {
    element = component.elementRoot;
  } // Detect if target is a synthesized DocumentFragment with an child element. Child elements will be present
  // if the Svelte component mounts and renders initial content into the document fragment.


  if (config.target instanceof DocumentFragment && target.firstElementChild) {
    if (element === void 0) {
      element = target.firstElementChild;
    }

    html.append(target);
  } else if (config.target instanceof HTMLElement && element === void 0) {
    if (config.target instanceof HTMLElement && typeof svelteOptions.selectorElement !== 'string') {
      throw new Error(`SvelteApplication - s_LOAD_CONFIG - HTMLElement target with no 'selectorElement' defined for config:\n${JSON.stringify(config)}`);
    } // The target is an HTMLElement so find the Application element from `selectorElement` option.


    element = target.querySelector(svelteOptions.selectorElement);

    if (element === null || element === void 0) {
      throw new Error(`SvelteApplication - s_LOAD_CONFIG - HTMLElement target - could not find 'selectorElement' for config:\n${JSON.stringify(config)}`);
    }
  } // If the configuration / original target is an HTML element then do not inject HTML.


  const injectHTML = !(config.target instanceof HTMLElement);
  const result = {
    config: svelteConfig,
    component,
    element,
    injectHTML
  };
  Object.freeze(result);
  return result;
}

var _orignalPopOut = /*#__PURE__*/new WeakMap();

class HandlebarsFormApplication extends SvelteFormApplication {
  /**
   * Temporarily holds the original popOut value when rendering.
   *
   * @type {boolean}
   */

  /**
   * @inheritDoc
   */
  constructor(object, options) {
    super(object, options);

    _classPrivateFieldInitSpec$1(this, _orignalPopOut, {
      writable: true,
      value: void 0
    });

    if (this.popOut) {
      this.options.svelte = foundry.utils.mergeObject(typeof this.options.svelte === 'object' ? this.options.svelte : {}, {
        class: ApplicationShell,
        intro: true,
        target: document.body
      });
    }
  }
  /**
   * Temporarily set popOut to false to only render inner HTML. This inner HTML will be appended to the content area
   * of ApplicationShell if the original popOut value is true.
   *
   * @inheritDoc
   */


  async _render(force, options) {
    _classPrivateFieldSet$1(this, _orignalPopOut, this.options.popOut);

    this.options.popOut = false;
    await super._render(force, options);
    this.options.popOut = _classPrivateFieldGet$1(this, _orignalPopOut);
  }
  /**
   * Duplicates the FormApplication `_renderInner` method as SvelteFormApplication does not defer to super
   * implementations.
   *
   * @inheritDoc
   */


  async _renderInner(data) {
    const html = await super._renderInner(data);
    this.form = html.filter((i, el) => el instanceof HTMLFormElement)[0];

    if (!this.form) {
      this.form = html.find('form')[0];
    }

    return html;
  }

  _injectHTML(html) {
    var _this$svelte, _this$svelte$applicat;

    // Mounts any Svelte components.
    super._injectHTML(html); // Appends inner HTML content to application shell content element.


    if ((_this$svelte = this.svelte) !== null && _this$svelte !== void 0 && (_this$svelte$applicat = _this$svelte.applicationShell) !== null && _this$svelte$applicat !== void 0 && _this$svelte$applicat.elementContent) {
      this.svelte.applicationShell.elementContent.appendChild(...html);
    }
  }
  /**
   * Override replacing HTML as Svelte components control the rendering process. Only potentially change the outer
   * application frame / title for pop-out applications.
   *
   * @override
   * @inheritDoc
   */


  _replaceHTML(element, html) // eslint-disable-line no-unused-vars
  {
    var _this$svelte2, _this$svelte2$applica;

    if (!element.length) {
      return;
    }

    super._replaceHTML(element, html);

    if ((_this$svelte2 = this.svelte) !== null && _this$svelte2 !== void 0 && (_this$svelte2$applica = _this$svelte2.applicationShell) !== null && _this$svelte2$applica !== void 0 && _this$svelte2$applica.elementContent) {
      const elementContent = this.svelte.applicationShell.elementContent; // Remove existing children.

      while (elementContent.firstChild && !elementContent.lastChild.remove()) {} // eslint-disable-line no-empty


      elementContent.appendChild(...html); // Use the setter from `SvelteFormApplication` to set the title store.

      this.title = this.title; // eslint-disable-line no-self-assign
    } else {
      element.replaceWith(html);
      this._element = html;
      this.elementTarget = html[0];
    }
  }

}

export { HandlebarsApplication, HandlebarsFormApplication };
//# sourceMappingURL=index.js.map
