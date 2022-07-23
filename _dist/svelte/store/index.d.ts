import * as svelte_store from 'svelte/store';

/**
 * - The backing Svelte store; a writable w/ get method attached.
 */
type LSStore = svelte_store.Writable<any>;
/**
 * - The backing Svelte store; a writable w/ get method attached.
 */
type SSStore = svelte_store.Writable<any>;
type TJSDocumentOptions = {
    /**
     * - Optional delete function to invoke when document is deleted.
     */
    delete?: Function;
};
type TJSDocumentCollectionOptions = {
    /**
     * - Optional delete function to invoke when document is deleted.
     */
    delete?: Function;
};
/**
 * - Provides a Svelte store wrapping the Foundry `game` global variable. It is initialized
 * on the `ready` hook. You may use this store to access the global game state from a Svelte template. It is a read only
 * store and will receive no reactive updates during runtime.
 */
type GameState = svelte_store.Readable<any>;
/**
 * Provides a managed array with non-destructive reducing / filtering / sorting capabilities with subscription /
 * Svelte store support.
 *
 * @template T
 */
declare class DynArrayReducer<T> {
    /**
     * Provides a utility method to determine if the given data is iterable / implements iterator protocol.
     *
     * @param {*}  data - Data to verify as iterable.
     *
     * @returns {boolean} Is data iterable.
     */
    static "__#437360@#isIterable"(data: any): boolean;
    /**
     * Initializes DynArrayReducer. Any iterable is supported for initial data. Take note that if `data` is an array it
     * will be used as the host array and not copied. All non-array iterables otherwise create a new array / copy.
     *
     * @param {Iterable<T>|DynData<T>}   [data=[]] - Data iterable to store if array or copy otherwise.
     */
    constructor(data?: Iterable<T> | any);
    /**
     * Returns the internal data of this instance. Be careful!
     *
     * Note: if an array is set as initial data then that array is used as the internal data. If any changes are
     * performed to the data externally do invoke {@link index.update} with `true` to recalculate the index and notify
     * all subscribers.
     *
     * @returns {T[]} The internal data.
     */
    get data(): T[];
    /**
     * @returns {AdapterFilters<T>} The filters adapter.
     */
    get filters(): AdapterFilters<T>;
    /**
     * Returns the Indexer public API.
     *
     * @returns {IndexerAPI & Iterable<number>} Indexer API - is also iterable.
     */
    get index(): any;
    /**
     * Gets the main data / items length.
     *
     * @returns {number} Main data / items length.
     */
    get length(): number;
    /**
     * Sets reversed state and notifies subscribers.
     *
     * @param {boolean} reversed - New reversed state.
     */
    set reversed(arg: boolean);
    /**
     * Gets current reversed state.
     *
     * @returns {boolean} Reversed state.
     */
    get reversed(): boolean;
    /**
     * @returns {AdapterSort<T>} The sort adapter.
     */
    get sort(): AdapterSort<T>;
    /**
     * Removes internal data and pushes new data. This does not destroy any initial array set to internal data unless
     * `replace` is set to true.
     *
     * @param {T[] | Iterable<T>} data - New data to set to internal data.
     *
     * @param {boolean} [replace=false] - New data to set to internal data.
     */
    setData(data: T[] | Iterable<T>, replace?: boolean): void;
    /**
     *
     * @param {function(DynArrayReducer<T>): void} handler - Callback function that is invoked on update / changes.
     *                                                       Receives `this` reference.
     *
     * @returns {(function(): void)} Unsubscribe function.
     */
    subscribe(handler: (arg0: DynArrayReducer<T>) => void): (() => void);
    /**
     * Provides an iterator for data stored in DynArrayReducer.
     *
     * @returns {Generator<*, T, *>} Generator / iterator of all data.
     * @yields {T}
     */
    [Symbol.iterator](): Generator<any, T, any>;
    #private;
}
/**
 * @typedef {import('svelte/store').Writable} LSStore - The backing Svelte store; a writable w/ get method attached.
 */
declare class LocalStorage {
    /**
     * Creates a new LSStore for the given key.
     *
     * @param {string}   key - Key to lookup in stores map.
     *
     * @param {boolean}  [defaultValue] - A default value to set for the store.
     *
     * @returns {LSStore} The new LSStore.
     */
    static "__#437361@#createStore"(key: string, defaultValue?: boolean): svelte_store.Writable<any>;
    /**
     * Get value from the localStorage.
     *
     * @param {string}   key - Key to lookup in localStorage.
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
     * @param {string}   key - Key to lookup in localStorage.
     *
     * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
     *
     * @returns {LSStore} The Svelte store for this key.
     */
    getStore(key: string, defaultValue?: any): svelte_store.Writable<any>;
    /**
     * Sets the value for the given key in localStorage.
     *
     * @param {string}   key - Key to lookup in localStorage.
     *
     * @param {*}        value - A value to set for this key.
     */
    setItem(key: string, value: any): void;
    /**
     * Convenience method to swap a boolean value stored in session storage.
     *
     * @param {string}   key - Key to lookup in localStorage.
     *
     * @param {boolean}  [defaultValue] - A default value to return if key not present in session storage.
     *
     * @returns {boolean} The boolean swap for the given key.
     */
    swapItemBoolean(key: string, defaultValue?: boolean): boolean;
    #private;
}
/**
 * @typedef {import('svelte/store').Writable} SSStore - The backing Svelte store; a writable w/ get method attached.
 */
declare class SessionStorage {
    /**
     * Creates a new SSStore for the given key.
     *
     * @param {string}   key - Key to lookup in stores map.
     *
     * @param {boolean}  [defaultValue] - A default value to set for the store.
     *
     * @returns {LSStore} The new LSStore.
     */
    static "__#437362@#createStore"(key: string, defaultValue?: boolean): svelte_store.Writable<any>;
    /**
     * Get value from the sessionStorage.
     *
     * @param {string}   key - Key to lookup in sessionStorage.
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
     * @param {string}   key - Key to lookup in sessionStorage.
     *
     * @param {*}        [defaultValue] - A default value to return if key not present in session storage.
     *
     * @returns {LSStore} The Svelte store for this key.
     */
    getStore(key: string, defaultValue?: any): svelte_store.Writable<any>;
    /**
     * Sets the value for the given key in sessionStorage.
     *
     * @param {string}   key - Key to lookup in sessionStorage.
     *
     * @param {*}        value - A value to set for this key.
     */
    setItem(key: string, value: any): void;
    /**
     * Convenience method to swap a boolean value stored in session storage.
     *
     * @param {string}   key - Key to lookup in sessionStorage.
     *
     * @param {boolean}  [defaultValue] - A default value to return if key not present in session storage.
     *
     * @returns {boolean} The boolean swap for the given key.
     */
    swapItemBoolean(key: string, defaultValue?: boolean): boolean;
    #private;
}
/**
 * Provides a wrapper implementing the Svelte store / subscriber protocol around any Document / ClientMixinDocument.
 * This makes documents reactive in a Svelte component, but otherwise provides subscriber functionality external to
 * Svelte.
 *
 * @template {foundry.abstract.Document} T
 */
declare class TJSDocument<T extends any> {
    /**
     * @param {T|TJSDocumentOptions} [document] - Document to wrap or TJSDocumentOptions.
     *
     * @param {TJSDocumentOptions}   [options] - TJSDocument options.
     */
    constructor(document?: T | TJSDocumentOptions, options?: TJSDocumentOptions);
    /**
     * Returns the options passed on last update.
     *
     * @returns {object} Last update options.
     */
    get updateOptions(): any;
    /**
     * Returns the UUID assigned to this store.
     *
     * @returns {*} UUID
     */
    get uuidv4(): any;
    /**
     * Completely removes all internal subscribers, any optional delete callback, and unregisters from the
     * ClientDocumentMixin `apps` tracking object.
     */
    destroy(): void;
    /**
     * @returns {T | undefined} Current document
     */
    get(): T | undefined;
    /**
     * @param {T | undefined}  document - New document to set.
     *
     * @param {object}         [options] - New document update options to set.
     */
    set(document: T | undefined, options?: object): void;
    /**
     * Potentially sets new document from data transfer object.
     *
     * @param {object}   data - Document transfer data.
     *
     * @param {ParseDataTransferOptions & TJSDocumentOptions}   [options] - Optional parameters.
     *
     * @returns {Promise<boolean>} Returns true if new document set from data transfer blob.
     */
    setFromDataTransfer(data: object, options?: any & TJSDocumentOptions): Promise<boolean>;
    /**
     * Sets the document by Foundry UUID performing a lookup and setting the document if found.
     *
     * @param {string}   uuid - A Foundry UUID to lookup.
     *
     * @param {TJSDocumentOptions}   [options] - New document update options to set.
     *
     * @returns {Promise<boolean>} True if successfully set document from UUID.
     */
    setFromUUID(uuid: string, options?: TJSDocumentOptions): Promise<boolean>;
    /**
     * Sets options for this document wrapper / store.
     *
     * @param {TJSDocumentOptions}   options - Options for TJSDocument.
     */
    setOptions(options: TJSDocumentOptions): void;
    /**
     * @param {function(T, object): void} handler - Callback function that is invoked on update / changes.
     *
     * @returns {(function(): void)} Unsubscribe function.
     */
    subscribe(handler: (arg0: T, arg1: object) => void): (() => void);
    #private;
}
/**
 * @typedef {object} TJSDocumentOptions
 *
 * @property {Function} [delete] - Optional delete function to invoke when document is deleted.
 */
/**
 * Provides a wrapper implementing the Svelte store / subscriber protocol around any DocumentCollection. This makes
 * document collections reactive in a Svelte component, but otherwise provides subscriber functionality external to
 * Svelte.
 *
 * @template {DocumentCollection} T
 */
declare class TJSDocumentCollection<T extends any> {
    /**
     * @param {T|TJSDocumentCollectionOptions}   [collection] - Collection to wrap or TJSDocumentCollectionOptions.
     *
     * @param {TJSDocumentCollectionOptions}     [options] - TJSDocumentCollection options.
     */
    constructor(collection?: T | TJSDocumentCollectionOptions, options?: TJSDocumentCollectionOptions);
    /**
     * Returns the options passed on last update.
     *
     * @returns {object} Last update options.
     */
    get updateOptions(): any;
    /**
     * Returns the UUID assigned to this store.
     *
     * @returns {*} UUID
     */
    get uuid(): any;
    /**
     * Completely removes all internal subscribers, any optional delete callback, and unregisters from the
     * DocumentCollection `apps` tracking array.
     */
    destroy(): void;
    /**
     * @returns {T | undefined} Current collection
     */
    get(): T | undefined;
    /**
     * @param {T | undefined}  collection - New collection to set.
     *
     * @param {object}         [options] - New collection update options to set.
     */
    set(collection: T | undefined, options?: object): void;
    /**
     * Sets options for this collection wrapper / store.
     *
     * @param {TJSDocumentCollectionOptions}   options - Options for TJSDocumentCollection.
     */
    setOptions(options: TJSDocumentCollectionOptions): void;
    /**
     * @param {function(T, object): void} handler - Callback function that is invoked on update / changes.
     *
     * @returns {(function(): void)} Unsubscribe function.
     */
    subscribe(handler: (arg0: T, arg1: object) => void): (() => void);
    #private;
}
/**
 * @typedef {import('svelte/store').Readable} GameState - Provides a Svelte store wrapping the Foundry `game` global variable. It is initialized
 * on the `ready` hook. You may use this store to access the global game state from a Svelte template. It is a read only
 * store and will receive no reactive updates during runtime.
 *
 * @property {import('svelte/store').Readable.subscribe} subscribe - Provides the Svelte store subscribe function.
 *
 * @property {Function} get - Provides a mechanism to directly access the Foundry game state without subscribing.
 */
/**
 * Registers game settings and creates a backing Svelte store for each setting. It is possible to add multiple
 * `onChange` callbacks on registration.
 */
declare class TJSGameSettings {
    /**
     * Creates a new GSWritableStore for the given key.
     *
     * @param {string}   initialValue - An initial value to set to new stores.
     *
     * @returns {GSWritableStore} The new GSWritableStore.
     */
    static "__#437365@#createStore"(initialValue: string): any;
    /**
     * Returns a readable Game Settings store for the associated key.
     *
     * @param {string}   key - Game setting key.
     *
     * @returns {GSReadableStore|undefined} The associated store for the given game setting key.
     */
    getReadableStore(key: string): any | undefined;
    /**
     * Returns a writable Game Settings store for the associated key.
     *
     * @param {string}   key - Game setting key.
     *
     * @returns {GSWritableStore|undefined} The associated store for the given game setting key.
     */
    getStore(key: string): any | undefined;
    /**
     * Returns a writable Game Settings store for the associated key.
     *
     * @param {string}   key - Game setting key.
     *
     * @returns {GSWritableStore|undefined} The associated store for the given game setting key.
     */
    getWritableStore(key: string): any | undefined;
    /**
     * @param {GameSetting} setting - A GameSetting instance to set to Foundry game settings.
     */
    register(setting: any): void;
    /**
     * Registers multiple settings.
     *
     * @param {Iterable<GameSetting>} settings - An iterable list of game setting configurations to register.
     */
    registerAll(settings: Iterable<any>): void;
    #private;
}
/**
 * @type {GameState} Provides a Svelte store wrapping the Foundry runtime / global game state.
 */
declare const gameState: svelte_store.Readable<any>;
/**
 * Provides a basic test for a given variable to test if it has the shape of a readable store by having a `subscribe`
 * function.
 *
 * Note: functions are also objects, so test that the variable might be a function w/ a `subscribe` function.
 *
 * @param {*}  store - variable to test that might be a store.
 *
 * @returns {boolean} Whether the variable tested has the shape of a store.
 */
declare function isReadableStore(store: any): boolean;
/**
 * Provides a basic test for a given variable to test if it has the shape of a writable store by having a `subscribe`
 * function and an `update` function.
 *
 * Note: functions are also objects, so test that the variable might be a function w/ a `subscribe` function.
 *
 * @param {*}  store - variable to test that might be a store.
 *
 * @returns {boolean} Whether the variable tested has the shape of a store.
 */
declare function isUpdatableStore(store: any): boolean;
/**
 * Provides a basic test for a given variable to test if it has the shape of a writable store by having a `subscribe`
 * `set`, and `update` functions.
 *
 * Note: functions are also objects, so test that the variable might be a function w/ `subscribe` & `set` functions.
 *
 * @param {*}  store - variable to test that might be a store.
 *
 * @returns {boolean} Whether the variable tested has the shape of a store.
 */
declare function isWritableStore(store: any): boolean;
/**
 * Create a store for a property value in an object contained in another store.
 * [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#named-export-propertystore)
 *
 * @param {Store} origin The store containing the object to get/set from.
 * @param {string|number|symbol|Array<string|number|symbol>} propName The property to get/set, or a path of
 * properties in nested objects.
 *
 * @returns {Store} A writable store.
 */
declare function propertyStore(origin: any, propName: string | number | symbol | Array<string | number | symbol>): any;
/**
 * Subscribes to the given store with two update functions provided. The first function is invoked on the initial
 * subscription. All future updates are dispatched to the update function.
 *
 * @param {import('svelte/store').Readable | import('svelte/store').Writable} store -
 *  Store to subscribe to...
 *
 * @param {import('svelte/store').Updater} first - Function to receive first update.
 *
 * @param {import('svelte/store').Updater} update - Function to receive future updates.
 *
 * @returns {import('svelte/store').Unsubscriber} Store unsubscribe function.
 */
declare function subscribeFirstRest(store: svelte_store.Readable<any> | svelte_store.Writable<any>, first: any, update: any): svelte_store.Unsubscriber;
/**
 * Subscribes to the given store with the update function provided and ignores the first automatic
 * update. All future updates are dispatched to the update function.
 *
 * @param {import('svelte/store').Readable | import('svelte/store').Writable} store -
 *  Store to subscribe to...
 *
 * @param {import('svelte/store').Updater} update - function to receive future updates.
 *
 * @returns {import('svelte/store').Unsubscriber} Store unsubscribe function.
 */
declare function subscribeIgnoreFirst(store: svelte_store.Readable<any> | svelte_store.Writable<any>, update: any): svelte_store.Unsubscriber;
/**
 * @external Store
 * @see [Svelte stores](https://svelte.dev/docs#component-format-script-4-prefix-stores-with-$-to-access-their-values-store-contract)
 */
/**
 * Create a store similar to [Svelte's `derived`](https://svelte.dev/docs#run-time-svelte-store-writable),
 * but which has its own `set` and `update` methods and can send values back to the origin stores.
 * [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#default-export-writablederived)
 *
 * @param {Store|Store[]} origins One or more stores to derive from. Same as
 * [`derived`](https://svelte.dev/docs#run-time-svelte-store-writable)'s 1st parameter.
 * @param {!Function} derive The callback to determine the derived value. Same as
 * [`derived`](https://svelte.dev/docs#run-time-svelte-store-writable)'s 2nd parameter.
 * @param {!Function|{withOld: !Function}} reflect Called when the
 * derived store gets a new value via its `set` or `update` methods, and determines new values for
 * the origin stores. [Read more...](https://github.com/PixievoltNo1/svelte-writable-derived#new-parameter-reflect)
 * @param [initial] The new store's initial value. Same as
 * [`derived`](https://svelte.dev/docs#run-time-svelte-store-writable)'s 3rd parameter.
 *
 * @returns {Store} A writable store.
 */
declare function writableDerived(origins: any | any[], derive: Function, reflect: Function | {
    withOld: Function;
}, initial?: any): any;
/**
 * Provides the storage and sequencing of managed filters. Each filter added may be a bespoke function or a
 * {@link FilterData} object containing an `id`, `filter`, and `weight` attributes; `filter` is the only required
 * attribute.
 *
 * The `id` attribute can be anything that creates a unique ID for the filter; recommended strings or numbers. This
 * allows filters to be removed by ID easily.
 *
 * The `weight` attribute is a number between 0 and 1 inclusive that allows filters to be added in a
 * predictable order which is especially handy if they are manipulated at runtime. A lower weighted filter always runs
 * before a higher weighted filter. For speed and efficiency always set the heavier / more inclusive filter with a
 * lower weight; an example of this is a keyword / name that will filter out many entries making any further filtering
 * faster. If no weight is specified the default of '1' is assigned and it is appended to the end of the filters list.
 *
 * This class forms the public API which is accessible from the `.filters` getter in the main DynArrayReducer instance.
 * ```
 * const dynArray = new DynArrayReducer([...]);
 * dynArray.filters.add(...);
 * dynArray.filters.clear();
 * dynArray.filters.length;
 * dynArray.filters.remove(...);
 * dynArray.filters.removeBy(...);
 * dynArray.filters.removeById(...);
 * ```
 *
 * @template T
 */
declare class AdapterFilters<T> {
    /**
     * @param {Function} indexUpdate - update function for the indexer.
     *
     * @returns {[AdapterFilters<T>, {filters: FilterData<T>[]}]} Returns this and internal storage for filter adapters.
     */
    constructor(indexUpdate: Function);
    /**
     * @returns {number} Returns the length of the
     */
    get length(): number;
    /**
     * @param {...(FilterFn<T>|FilterData<T>)}   filters -
     */
    add(...filters: (any | any)[]): void;
    clear(): void;
    /**
     * @param {...(FilterFn<T>|FilterData<T>)}   filters -
     */
    remove(...filters: (any | any)[]): void;
    /**
     * Remove filters by the provided callback. The callback takes 3 parameters: `id`, `filter`, and `weight`.
     * Any truthy value returned will remove that filter.
     *
     * @param {function(*, FilterFn<T>, number): boolean} callback - Callback function to evaluate each filter entry.
     */
    removeBy(callback: (arg0: any, arg1: any, arg2: number) => boolean): void;
    removeById(...ids: any[]): void;
    /**
     * Provides an iterator for filters.
     *
     * @returns {Generator<number|undefined, FilterData<T>, *>} Generator / iterator of filters.
     * @yields {FilterData<T>}
     */
    [Symbol.iterator](): Generator<number | undefined, any, any>;
    #private;
}
/**
 * @template T
 */
declare class AdapterSort<T> {
    /**
     * @param {Function} indexUpdate - Function to update indexer.
     *
     * @returns {[AdapterSort<T>, {compareFn: CompareFn<T>}]} This and the internal sort adapter data.
     */
    constructor(indexUpdate: Function);
    /**
     * @param {CompareFn<T>|SortData<T>}  data -
     *
     * A callback function that compares two values. Return > 0 to sort b before a;
     * < 0 to sort a before b; or 0 to keep original order of a & b.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#parameters
     */
    set(data: any | any): void;
    reset(): void;
    #private;
}

export { DynArrayReducer, GameState, LSStore, LocalStorage, SSStore, SessionStorage, TJSDocument, TJSDocumentCollection, TJSDocumentCollectionOptions, TJSDocumentOptions, TJSGameSettings, gameState, isReadableStore, isUpdatableStore, isWritableStore, propertyStore, subscribeFirstRest, subscribeIgnoreFirst, writableDerived };
