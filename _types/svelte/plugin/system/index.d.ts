import * as svelte_store from 'svelte/store';
import { noop } from 'svelte/types/runtime/internal/utils';
import { get } from 'svelte/types/runtime/store';

/**
 * - The backing Svelte store; a writable w/ get method attached.
 */
type LSStore = ((key: any, value: any, start?: typeof noop) => {
    set: (new_value: any) => void;
    update: (fn: any) => void;
    subscribe: (run: any, invalidate?: typeof noop) => svelte_store.Unsubscriber;
}) & typeof get;
/**
 * - The backing Svelte store; a writable w/ get method attached.
 */
type SSStore = ((key: any, value: any, start?: typeof noop) => {
    set: (new_value: any) => void;
    update: (fn: any) => void;
    subscribe: (run: any, invalidate?: typeof noop) => svelte_store.Unsubscriber;
}) & typeof get;
/**
 * - Defines a game setting.
 */
type GameSetting = {
    /**
     * - The ID of the module / system.
     */
    moduleId: string;
    /**
     * - The setting key to register.
     */
    key: string;
    /**
     * - Configuration for setting data.
     */
    options: object;
};
declare class LocalStorage {
    onPluginLoad(ev: any): void;
    #private;
}
declare class SessionStorage {
    onPluginLoad(ev: any): void;
    #private;
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
declare class TJSGameSettings {
    register(moduleId: any, key: any, options: any): void;
    /**
     * Registers multiple settings.
     *
     * @param {Iterable<GameSetting>} settings - An iterable list of game setting configurations to register.
     */
    registerAll(settings: Iterable<GameSetting>): void;
    onPluginLoad(ev: any): void;
    _eventbus: any;
    #private;
}

export { GameSetting, LSStore, LocalStorage, SSStore, SessionStorage, TJSGameSettings };
