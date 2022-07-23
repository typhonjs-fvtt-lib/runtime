import { LocalStorage as LocalStorage$1, SessionStorage as SessionStorage$1, TJSGameSettings as TJSGameSettings$1 } from '@typhonjs-fvtt/runtime/svelte/store';
import { isIterable } from '@typhonjs-fvtt/runtime/svelte/util';

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
 * Defines if logging setting changes to the console occurs.
 *
 * @type {boolean}
 */
let loggingEnabled = false;

/**
 * Defines a base class for dispatch handling from events triggered from the TJSGameSettings plugin. This is a
 * convenience mechanism and is not the only way to handle game settings related events. Use this for small to medium
 * scoped apps that do not have a lot of cross-cutting concerns.
 *
 * SettingsControl listens for all setting change events and attempts to invoke a method with the same name as the
 * setting located in the implementing child class.
 *
 * There is one additional event handled by SettingsControl:
 * `tjs:system:settings:control:log:enable` - When passed a truthy value console logging of setting changes occurs.
 */
class TJSSettingsControl
{
   #handleDispatch(data)
   {
      if (typeof data.setting !== 'string') { return; }

      if (loggingEnabled)
      {
         console.log(`TJSSettingsControl - handleDispatch - data:\n`, data);
      }

      const dispatchFunction = this[data.setting];

      if (typeof dispatchFunction === 'function')
      {
         dispatchFunction.call(this, data.value);
      }
   }

   onPluginLoad(ev)
   {
      this._eventbus = ev.eventbus;

      const opts = { guard: true };

      ev.eventbus.on('tjs:system:game:settings:change:any', this.#handleDispatch, this, opts);

      // Enables local logging of setting changes.
      ev.eventbus.on('tjs:system:settings:control:log:enable', (enabled) => loggingEnabled = enabled, void 0, opts);
   }
}

/**
 * Provides a TyphonJS plugin to add TJSGameSettings to the plugin eventbus.
 *
 * The following events are available for registration:
 *
 * `tjs:system:game:settings:store:get`          - Invokes `getWritableStore` from backing TJSGameSettings instance.
 * `tjs:system:game:settings:store:writable:get` - Invokes `getWritableStore` from backing TJSGameSettings instance.
 * `tjs:system:game:settings:store:readable:get` - Invokes `getReadableStore` from backing TJSGameSettings instance.
 * `tjs:system:game:settings:register`           - Registers a setting adding a callback to fire an event on change.
 * `tjs:system:game:settings:register:all`       - Registers multiple settings.
 *
 * The following events are triggered on change of a game setting.
 *
 * `tjs:system:game:settings:change:any`           - Provides an object containing the setting and value.
 * `tjs:system:game:settings:change:<SETTING KEY>` - Provides the value of the keyed event.
 */
class TJSGameSettings
{
   #gameSettings = new TJSGameSettings$1();

   /**
    * @param {GameSetting} setting - A GameSetting instance to set to Foundry game settings.
    */
   register(setting)
   {
      if (typeof setting !== 'object') { throw new TypeError(`TJSGameSettings - register: setting is not an object.`); }

      // TODO: Remove deprecation warning and fully remove support for `moduleId` in a future TRL release.
      if (typeof setting.moduleId === 'string')
      {
         console.warn(
          `TJSGameSettings - register deprecation warning: 'moduleId' should be replaced with 'namespace'.`);
         console.warn(`'moduleId' will cease to work in a future update of TRL / TJSGameSettings.`);
      }

      if (typeof setting.key !== 'string')
      {
         throw new TypeError(`TJSGameSettings - register: 'key' attribute is not a string.`);
      }

      if (typeof setting.options !== 'object')
      {
         throw new TypeError(`TJSGameSettings - register: 'options' attribute is not an object.`);
      }

      // TODO: Remove nullish coalescing operator in a future TRL release.
      const namespace = setting.namespace ?? setting.moduleId;
      const key = setting.key;

      if (typeof namespace !== 'string')
      {
         throw new TypeError(`TJSGameSettings - register: 'namespace' attribute is not a string.`);
      }

      /**
       * @type {GameSettingOptions}
       */
      const options = setting.options;

      const onChange = typeof options?.onChange === 'function' ? [options.onChange] : [];

      onChange.push((value) =>
      {
         if (this._eventbus)
         {
            this._eventbus.trigger(`tjs:system:game:settings:change:any`, { setting: key, value });
            this._eventbus.trigger(`tjs:system:game:settings:change:${key}`, value);
         }
      });

      this.#gameSettings.register({ namespace, key, options: { ...options, onChange } });
   }

   /**
    * Registers multiple settings.
    *
    * @param {Iterable<GameSetting>} settings - An iterable list of game setting configurations to register.
    */
   registerAll(settings)
   {
      if (!isIterable(settings)) { throw new TypeError(`TJSGameSettings - registerAll: settings is not iterable.`); }

      for (const entry of settings) { this.register(entry); }
   }

   onPluginLoad(ev)
   {
      this._eventbus = ev.eventbus;

      const opts = { guard: true };

      ev.eventbus.on(`tjs:system:game:settings:store:get`, this.#gameSettings.getWritableStore, this.#gameSettings,
       opts);

      ev.eventbus.on(`tjs:system:game:settings:store:readable:get`, this.#gameSettings.getReadableStore,
       this.#gameSettings, opts);

      ev.eventbus.on(`tjs:system:game:settings:store:writable:get`, this.#gameSettings.getWritableStore,
       this.#gameSettings, opts);

      ev.eventbus.on(`tjs:system:game:settings:register`, this.register, this, opts);

      ev.eventbus.on(`tjs:system:game:settings:register:all`, this.registerAll, this, opts);
   }
}

export { LocalStorage, SessionStorage, TJSGameSettings, TJSSettingsControl };
//# sourceMappingURL=index.js.map
