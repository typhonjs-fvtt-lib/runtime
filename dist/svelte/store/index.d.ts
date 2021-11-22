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
    /**
     * Get value from the localstorage.
     *
     * @param {string}   key - Key to lookup in localstorage.
     *
     * @param {*}        [defaultValue] - A default value to return if key not present in local storage.
     *
     * @returns {*} Value from local storage or if not defined any default value provided.
     */
    getItem(key: string, defaultValue?: any): any;
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
    getStore(key: string, defaultValue?: any): LSStore;
    /**
     * Sets the value for the given key in localstorage.
     *
     * @param {string}   key - Key to lookup in localstorage.
     *
     * @param {*}        value - A value to set for this key.
     */
    setItem(key: string, value: any): void;
    /**
     * Convenience method to swap a boolean value stored in local storage.
     *
     * @param {string}   key - Key to lookup in localstorage.
     *
     * @param {boolean}  [defaultValue] - A default value to return if key not present in local storage.
     *
     * @returns {boolean} The boolean swap for the given key.
     */
    swapItemBoolean(key: string, defaultValue?: boolean): boolean;
}
declare class SessionStorage {
    /**
     * Get value from the sessionstorage.
     *
     * @param {string}   key - Key to lookup in sessionstorage.
     *
     * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
     *
     * @returns {*} Value from session storage or if not defined any default value provided.
     */
    getItem(key: string, defaultValue?: any): any;
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
    getStore(key: string, defaultValue?: any): LSStore;
    /**
     * Sets the value for the given key in sessionstorage.
     *
     * @param {string}   key - Key to lookup in sessionstorage.
     *
     * @param {*}        value - A value to set for this key.
     */
    setItem(key: string, value: any): void;
    /**
     * Convenience method to swap a boolean value stored in session storage.
     *
     * @param {string}   key - Key to lookup in sessionstorage.
     *
     * @param {boolean}  [defaultValue] - A default value to return if key not present in session storage.
     *
     * @returns {boolean} The boolean swap for the given key.
     */
    swapItemBoolean(key: string, defaultValue?: boolean): boolean;
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
 * Registers game settings and creates a backing Svelte store for each setting. It is possible to add multiple
 * `onChange` callbacks on registration.
 */
declare class TJSGameSettings {
    getStore(key: any): any;
    register(moduleId: any, key: any, options?: {}): void;
    /**
     * Registers multiple settings.
     *
     * @param {Iterable<GameSetting>} settings - An iterable list of game setting configurations to register.
     */
    registerAll(settings: Iterable<GameSetting>): void;
    #private;
}

export { GameSetting, LSStore, LocalStorage, SSStore, SessionStorage, TJSGameSettings };
