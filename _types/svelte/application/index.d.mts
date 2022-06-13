import * as svelte_store from 'svelte/store';
import * as svelte from 'svelte';

/**
 * Contains the reactive functionality / Svelte stores associated with SvelteApplication.
 */
declare class SvelteReactive {
    /**
     * @param {SvelteApplication} application - The host Foundry application.
     */
    constructor(application: any);
    /**
     * Initializes reactive support. Package private for internal use.
     *
     * @returns {SvelteStores} Internal methods to interact with Svelte stores.
     * @package
     */
    initialize(): any;
    /**
     * Returns the current dragging UI state.
     *
     * @returns {boolean} Dragging UI state.
     */
    get dragging(): boolean;
    /**
     * Returns the current minimized UI state.
     *
     * @returns {boolean} Minimized UI state.
     */
    get minimized(): boolean;
    /**
     * Returns the current resizing UI state.
     *
     * @returns {boolean} Resizing UI state.
     */
    get resizing(): boolean;
    /**
     * Sets `this.options.draggable` which is reactive for application shells.
     *
     * @param {boolean}  draggable - Sets the draggable option.
     */
    set draggable(arg: boolean);
    /**
     * Returns the draggable app option.
     *
     * @returns {boolean} Draggable app option.
     */
    get draggable(): boolean;
    /**
     * Sets `this.options.headerButtonNoClose` which is reactive for application shells.
     *
     * @param {boolean}  headerButtonNoClose - Sets the headerButtonNoClose option.
     */
    set headerButtonNoClose(arg: boolean);
    /**
     * Returns the headerButtonNoClose app option.
     *
     * @returns {boolean} Remove the close the button in header app option.
     */
    get headerButtonNoClose(): boolean;
    /**
     * Sets `this.options.headerButtonNoLabel` which is reactive for application shells.
     *
     * @param {boolean}  headerButtonNoLabel - Sets the headerButtonNoLabel option.
     */
    set headerButtonNoLabel(arg: boolean);
    /**
     * Returns the headerButtonNoLabel app option.
     *
     * @returns {boolean} Remove the labels from buttons in header app option.
     */
    get headerButtonNoLabel(): boolean;
    /**
     * Sets `this.options.headerNoTitleMinimized` which is reactive for application shells.
     *
     * @param {boolean}  headerNoTitleMinimized - Sets the headerNoTitleMinimized option.
     */
    set headerNoTitleMinimized(arg: boolean);
    /**
     * Returns the headerNoTitleMinimized app option.
     *
     * @returns {boolean} When true removes the header title when minimized.
     */
    get headerNoTitleMinimized(): boolean;
    /**
     * Sets `this.options.minimizable` which is reactive for application shells that are also pop out.
     *
     * @param {boolean}  minimizable - Sets the minimizable option.
     */
    set minimizable(arg: boolean);
    /**
     * Returns the minimizable app option.
     *
     * @returns {boolean} Minimizable app option.
     */
    get minimizable(): boolean;
    /**
     * Sets `this.options.popOut` which is reactive for application shells. This will add / remove this application
     * from `ui.windows`.
     *
     * @param {boolean}  popOut - Sets the popOut option.
     */
    set popOut(arg: boolean);
    /**
     * @inheritDoc
     */
    get popOut(): boolean;
    /**
     * Sets `this.options.resizable` which is reactive for application shells.
     *
     * @param {boolean}  resizable - Sets the resizable option.
     */
    set resizable(arg: boolean);
    /**
     * Returns the resizable option.
     *
     * @returns {boolean} Resizable app option.
     */
    get resizable(): boolean;
    /**
     * Returns the store for app options.
     *
     * @returns {StoreAppOptions} App options store.
     */
    get storeAppOptions(): any;
    /**
     * Returns the store for UI options.
     *
     * @returns {StoreUIOptions} UI options store.
     */
    get storeUIState(): any;
    /**
     * Sets `this.options.title` which is reactive for application shells.
     *
     * Note: Will set empty string if title is undefined or null.
     *
     * @param {string|undefined|null}   title - Application title; will be localized, so a translation key is fine.
     */
    set title(arg: string);
    /**
     * Returns the title accessor from the parent Application class.
     * TODO: Application v2; note that super.title localizes `this.options.title`; IMHO it shouldn't.
     *
     * @returns {string} Title.
     */
    get title(): string;
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
    getOptions(accessor: string, defaultValue?: any): any;
    /**
     * Provides a way to merge `options` into this applications options and update the appOptions store.
     *
     * @param {object}   options - The options object to merge with `this.options`.
     */
    mergeOptions(options: object): void;
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
    setOptions(accessor: string, value: any): void;
    /**
     * Updates the UI Options store with the current header buttons. You may dynamically add / remove header buttons
     * if using an application shell Svelte component. In either overriding `_getHeaderButtons` or responding to the
     * Hooks fired return a new button array and the uiOptions store is updated and the application shell will render
     * the new buttons.
     *
     * Optionally you can set in the Foundry app options `headerButtonNoClose` to remove the close button and
     * `headerButtonNoLabel` to true and labels will be removed from the header buttons.
     *
     * @param {object} opts - Optional parameters (for internal use)
     *
     * @param {boolean} opts.headerButtonNoClose - The value for `headerButtonNoClose`.
     *
     * @param {boolean} opts.headerButtonNoLabel - The value for `headerButtonNoLabel`.
     */
    updateHeaderButtons({ headerButtonNoClose, headerButtonNoLabel }?: {
        headerButtonNoClose: boolean;
        headerButtonNoLabel: boolean;
    }): void;
    #private;
}

declare class ApplicationState {
    /**
     * @param {ApplicationShellExt}   application - The application.
     */
    constructor(application: any);
    /**
     * Returns current application state along with any extra data passed into method.
     *
     * @param {object} [extra] - Extra data to add to application state.
     *
     * @returns {ApplicationData} Passed in object with current application state.
     */
    get(extra?: object): ApplicationData;
    /**
     * Returns any stored save state by name.
     *
     * @param {string}   name - Saved data set name.
     *
     * @returns {ApplicationData} The saved data set.
     */
    getSave({ name }: string): ApplicationData;
    /**
     * Removes and returns any application state by name.
     *
     * @param {object}   options - Options.
     *
     * @param {string}   options.name - Name to remove and retrieve.
     *
     * @returns {ApplicationData} Saved application data.
     */
    remove({ name }: {
        name: string;
    }): ApplicationData;
    /**
     * Restores a saved application state returning the data. Several optional parameters are available
     * to control whether the restore action occurs silently (no store / inline styles updates), animates
     * to the stored data, or simply sets the stored data. Restoring via {@link AnimationAPI.to} allows
     * specification of the duration, easing, and interpolate functions along with configuring a Promise to be
     * returned if awaiting the end of the animation.
     *
     * @param {object}            params - Parameters
     *
     * @param {string}            params.name - Saved data set name.
     *
     * @param {boolean}           [params.remove=false] - Remove data set.
     *
     * @param {boolean}           [params.async=false] - If animating return a Promise that resolves with any saved data.
     *
     * @param {boolean}           [params.animateTo=false] - Animate to restore data.
     *
     * @param {number}            [params.duration=0.1] - Duration in seconds.
     *
     * @param {Function}          [params.ease=linear] - Easing function.
     *
     * @param {Function}          [params.interpolate=lerp] - Interpolation function.
     *
     * @returns {ApplicationData|Promise<ApplicationData>} Saved application data.
     */
    restore({ name, remove, async, animateTo, duration, ease, interpolate }: {
        name: string;
        remove?: boolean;
        async?: boolean;
        animateTo?: boolean;
        duration?: number;
        ease?: Function;
        interpolate?: Function;
    }): ApplicationData | Promise<ApplicationData>;
    /**
     * Saves current application state with the opportunity to add extra data to the saved state.
     *
     * @param {object}   options - Options.
     *
     * @param {string}   options.name - name to index this saved data.
     *
     * @param {...*}     [options.extra] - Extra data to add to saved data.
     *
     * @returns {ApplicationData} Current application data
     */
    save({ name, ...extra }: {
        name: string;
        extra?: any[];
    }): ApplicationData;
    /**
     * Restores a saved application state returning the data. Several optional parameters are available
     * to control whether the restore action occurs silently (no store / inline styles updates), animates
     * to the stored data, or simply sets the stored data. Restoring via {@link AnimationAPI.to} allows
     * specification of the duration, easing, and interpolate functions along with configuring a Promise to be
     * returned if awaiting the end of the animation.
     *
     * @param {ApplicationData}   data - Saved data set name.
     *
     * @param {object}            opts - Optional parameters
     *
     * @param {boolean}           [opts.async=false] - If animating return a Promise that resolves with any saved data.
     *
     * @param {boolean}           [opts.animateTo=false] - Animate to restore data.
     *
     * @param {number}            [opts.duration=0.1] - Duration in seconds.
     *
     * @param {Function}          [opts.ease=linear] - Easing function.
     *
     * @param {Function}          [opts.interpolate=lerp] - Interpolation function.
     *
     * @returns {ApplicationShellExt|Promise<ApplicationShellExt>} When synchronous the application or Promise when
     *                                                             animating resolving with application.
     */
    set(data: ApplicationData, { async, animateTo, duration, ease, interpolate }: {
        async?: boolean;
        animateTo?: boolean;
        duration?: number;
        ease?: Function;
        interpolate?: Function;
    }): any | Promise<any>;
    #private;
}
type ApplicationData = {
    /**
     * - Application position.
     */
    position: any;
    /**
     * - Any application saved position state for #beforeMinimized
     */
    beforeMinimized: object;
    /**
     * - Application options.
     */
    options: object;
    /**
     * - Application UI state.
     */
    ui: object;
};

/**
 * Provides a helper class for {@link SvelteApplication} by combining all methods that work on the {@link SvelteData[]}
 * of mounted components. This class is instantiated and can be retrieved by the getter `svelte` via SvelteApplication.
 */
declare class GetSvelteData {
    /**
     * Keep a direct reference to the SvelteData array in an associated {@link SvelteApplication}.
     *
     * @param {MountedAppShell[]|null[]}  applicationShellHolder - A reference to the MountedAppShell array.
     *
     * @param {SvelteData[]}  svelteData - A reference to the SvelteData array of mounted components.
     */
    constructor(applicationShellHolder: any[] | null[], svelteData: any[]);
    /**
     * Returns any mounted {@link MountedAppShell}.
     *
     * @returns {MountedAppShell|null} Any mounted application shell.
     */
    get applicationShell(): any;
    /**
     * Returns the indexed Svelte component.
     *
     * @param {number}   index -
     *
     * @returns {object} The loaded Svelte component.
     */
    component(index: number): object;
    /**
     * Returns the Svelte component entries iterator.
     *
     * @returns {Generator<Array<number|SvelteComponent>>} Svelte component entries iterator.
     * @yields
     */
    componentEntries(): Generator<Array<number | any>>;
    /**
     * Returns the Svelte component values iterator.
     *
     * @returns {Generator<SvelteComponent>} Svelte component values iterator.
     * @yields
     */
    componentValues(): Generator<any>;
    /**
     * Returns the indexed SvelteData entry.
     *
     * @param {number}   index -
     *
     * @returns {SvelteData} The loaded Svelte config + component.
     */
    data(index: number): any;
    /**
     * Returns the {@link SvelteData} instance for a given component.
     *
     * @param {object} component - Svelte component.
     *
     * @returns {SvelteData} -  The loaded Svelte config + component.
     */
    dataByComponent(component: object): any;
    /**
     * Returns the SvelteData entries iterator.
     *
     * @returns {IterableIterator<[number, SvelteData]>} SvelteData entries iterator.
     */
    dataEntries(): IterableIterator<[number, any]>;
    /**
     * Returns the SvelteData values iterator.
     *
     * @returns {IterableIterator<SvelteData>} SvelteData values iterator.
     */
    dataValues(): IterableIterator<any>;
    /**
     * Returns the length of the mounted Svelte component list.
     *
     * @returns {number} Length of mounted Svelte component list.
     */
    get length(): number;
    #private;
}

declare class AnimationAPI {
    constructor(position: any, data: any);
    /**
     * Returns whether there are active animation instances for this Position.
     *
     * @returns {boolean} Are there active animation instances.
     */
    get isActive(): boolean;
    /**
     * Cancels all animation instances for this Position instance.
     */
    cancel(): void;
    /**
     * Provides animation
     *
     * @param {PositionDataExtended} toData - The destination position.
     *
     * @param {object}         [opts] - Optional parameters.
     *
     * @param {number}         [opts.duration] - Duration in seconds.
     *
     * @param {Function}       [opts.ease=linear] - Easing function.
     *
     * @param {Function}       [opts.interpolate=lerp] - Interpolation function.
     *
     * @returns {TJSBasicAnimation}  A control object that can cancel animation and provides a `finished` Promise.
     */
    to(toData: any, { duration, ease, interpolate }?: {
        duration?: number;
        ease?: Function;
        interpolate?: Function;
    }): any;
    #private;
}

declare class PositionStateAPI {
    constructor(position: any, data: any, transforms: any);
    /**
     * Returns any stored save state by name.
     *
     * @param {string}   name - Saved data set name.
     *
     * @returns {PositionDataExtended} The saved data set.
     */
    get({ name }: string): any;
    /**
     * Returns any associated default data.
     *
     * @returns {PositionDataExtended} Associated default data.
     */
    getDefault(): any;
    /**
     * Removes and returns any position state by name.
     *
     * @param {object}   options - Options.
     *
     * @param {string}   options.name - Name to remove and retrieve.
     *
     * @returns {PositionDataExtended} Saved position data.
     */
    remove({ name }: {
        name: string;
    }): any;
    /**
     * Resets data to default values and invokes set.
     *
     * @param {object}   [opts] - Optional parameters.
     *
     * @param {boolean}  [opts.keepZIndex=false] - When true keeps current z-index.
     *
     * @param {boolean}  [opts.invokeSet=true] - When true invokes set method.
     *
     * @returns {boolean} Operation successful.
     */
    reset({ keepZIndex, invokeSet }?: {
        keepZIndex?: boolean;
        invokeSet?: boolean;
    }): boolean;
    /**
     * Restores a saved positional state returning the data. Several optional parameters are available
     * to control whether the restore action occurs silently (no store / inline styles updates), animates
     * to the stored data, or simply sets the stored data. Restoring via {@link AnimationAPI.to} allows
     * specification of the duration, easing, and interpolate functions along with configuring a Promise to be
     * returned if awaiting the end of the animation.
     *
     * @param {object}            params - Parameters
     *
     * @param {string}            params.name - Saved data set name.
     *
     * @param {boolean}           [params.remove=false] - Remove data set.
     *
     * @param {Iterable<string>}  [params.properties] - Specific properties to set / animate.
     *
     * @param {boolean}           [params.silent] - Set position data directly; no store or style updates.
     *
     * @param {boolean}           [params.async=false] - If animating return a Promise that resolves with any saved data.
     *
     * @param {boolean}           [params.animateTo=false] - Animate to restore data.
     *
     * @param {number}            [params.duration=0.1] - Duration in seconds.
     *
     * @param {Function}          [params.ease=linear] - Easing function.
     *
     * @param {Function}          [params.interpolate=lerp] - Interpolation function.
     *
     * @returns {PositionDataExtended|Promise<PositionDataExtended>} Saved position data.
     */
    restore({ name, remove, properties, silent, async, animateTo, duration, ease, interpolate }: {
        name: string;
        remove?: boolean;
        properties?: Iterable<string>;
        silent?: boolean;
        async?: boolean;
        animateTo?: boolean;
        duration?: number;
        ease?: Function;
        interpolate?: Function;
    }): any | Promise<any>;
    /**
     * Saves current position state with the opportunity to add extra data to the saved state.
     *
     * @param {object}   opts - Options.
     *
     * @param {string}   opts.name - name to index this saved data.
     *
     * @param {...*}     [opts.extra] - Extra data to add to saved data.
     *
     * @returns {PositionData} Current position data
     */
    save({ name, ...extra }: {
        name: string;
        extra?: any[];
    }): any;
    /**
     * Directly sets a position state.
     *
     * @param {object}   opts - Options.
     *
     * @param {string}   opts.name - name to index this saved data.
     *
     * @param {...*}     [opts.data] - Position data to set.
     */
    set({ name, ...data }: {
        name: string;
        data?: any[];
    }): void;
    #private;
}

/**
 * Provides the output data for {@link Transforms.getData}.
 */
declare class TransformData {
    /**
     * @returns {DOMRect} The bounding rectangle.
     */
    get boundingRect(): DOMRect;
    /**
     * @returns {Vector3[]} The transformed corner points as vec3 in screen space.
     */
    get corners(): Float32Array[];
    /**
     * @returns {string} Returns the CSS style string for the transform matrix.
     */
    get css(): string;
    /**
     * @returns {Matrix4} The transform matrix.
     */
    get mat4(): Float32Array;
    /**
     * @returns {Matrix4[]} The pre / post translation matrices for origin translation.
     */
    get originTranslations(): Float32Array[];
    #private;
}

/**
 * Provides the storage and sequencing of managed position validators. Each validator added may be a bespoke function or
 * a {@link ValidatorData} object containing an `id`, `validator`, and `weight` attributes; `validator` is the only
 * required attribute.
 *
 * The `id` attribute can be anything that creates a unique ID for the validator; recommended strings or numbers. This
 * allows validators to be removed by ID easily.
 *
 * The `weight` attribute is a number between 0 and 1 inclusive that allows validators to be added in a
 * predictable order which is especially handy if they are manipulated at runtime. A lower weighted validator always
 * runs before a higher weighted validator. If no weight is specified the default of '1' is assigned and it is appended
 * to the end of the validators list.
 *
 * This class forms the public API which is accessible from the `.validators` getter in the main Position instance.
 * ```
 * const position = new Position(<PositionData>);
 * position.validators.add(...);
 * position.validators.clear();
 * position.validators.length;
 * position.validators.remove(...);
 * position.validators.removeBy(...);
 * position.validators.removeById(...);
 * ```
 */
declare class AdapterValidators {
    /**
     * @returns {number} Returns the length of the validators array.
     */
    get length(): number;
    /**
     * @param {...(ValidatorFn<T>|ValidatorData<T>)}   validators -
     */
    add(...validators: (ValidatorFn<any> | ValidatorData<any>)[]): void;
    clear(): void;
    /**
     * @param {...(ValidatorFn<T>|ValidatorData<T>)}   validators -
     */
    remove(...validators: (ValidatorFn<any> | ValidatorData<any>)[]): void;
    /**
     * Remove validators by the provided callback. The callback takes 3 parameters: `id`, `validator`, and `weight`.
     * Any truthy value returned will remove that validator.
     *
     * @param {function(*, ValidatorFn<T>, number): boolean} callback - Callback function to evaluate each validator
     *                                                                  entry.
     */
    removeBy(callback: (arg0: any, arg1: ValidatorFn<any>, arg2: number) => boolean): void;
    removeById(...ids: any[]): void;
    /**
     * Provides an iterator for validators.
     *
     * @returns {Generator<ValidatorData|undefined>} Generator / iterator of validators.
     * @yields {ValidatorData<T>}
     */
    [Symbol.iterator](): Generator<ValidatorData | undefined>;
    #private;
}
/**
 * - Position validator function that takes a {@link PositionData } instance potentially
 *                             modifying it or returning null if invalid.
 */
type ValidatorFn = (valData: any) => any | null;
type ValidatorData = {
    /**
     * - An ID associated with this validator. Can be used to remove the validator.
     */
    id?: any;
    /**
     * - Position validator function that takes a {@link PositionData } instance
     *   potentially modifying it or returning null if invalid.
     */
    validator: ValidatorFn;
    /**
     * - A number between 0 and 1 inclusive to position this validator against others.
     */
    weight?: number;
    /**
     * - Optional subscribe function following the Svelte store / subscribe pattern.
     */
    subscribe?: Function;
};

/**
 * Defines stored positional data.
 */
declare class PositionData {
    constructor({ height, left, maxHeight, maxWidth, minHeight, minWidth, rotateX, rotateY, rotateZ, scale, translateX, translateY, translateZ, top, transformOrigin, width, zIndex }?: {
        height?: any;
        left?: any;
        maxHeight?: any;
        maxWidth?: any;
        minHeight?: any;
        minWidth?: any;
        rotateX?: any;
        rotateY?: any;
        rotateZ?: any;
        scale?: any;
        translateX?: any;
        translateY?: any;
        translateZ?: any;
        top?: any;
        transformOrigin?: any;
        width?: any;
        zIndex?: any;
    });
    /**
     * @type {number|'auto'|null}
     */
    height: number | 'auto' | null;
    /**
     * @type {number|null}
     */
    left: number | null;
    /**
     * @type {number|null}
     */
    maxHeight: number | null;
    /**
     * @type {number|null}
     */
    maxWidth: number | null;
    /**
     * @type {number|null}
     */
    minHeight: number | null;
    /**
     * @type {number|null}
     */
    minWidth: number | null;
    /**
     * @type {number|null}
     */
    rotateX: number | null;
    /**
     * @type {number|null}
     */
    rotateY: number | null;
    /**
     * @type {number|null}
     */
    rotateZ: number | null;
    /**
     * @type {number|null}
     */
    scale: number | null;
    /**
     * @type {number|null}
     */
    top: number | null;
    /**
     * @type {string|null}
     */
    transformOrigin: string | null;
    /**
     * @type {number|null}
     */
    translateX: number | null;
    /**
     * @type {number|null}
     */
    translateY: number | null;
    /**
     * @type {number|null}
     */
    translateZ: number | null;
    /**
     * @type {number|'auto'|null}
     */
    width: number | 'auto' | null;
    /**
     * @type {number|null}
     */
    zIndex: number | null;
    /**
     * Copies given data to this instance.
     *
     * @param {PositionData}   data - Copy from this instance.
     *
     * @returns {PositionData} This instance.
     */
    copy(data: PositionData): PositionData;
}

declare class Transforms {
    _data: {};
    /**
     * @returns {boolean} Whether there are active transforms in local data.
     */
    get isActive(): boolean;
    /**
     * Sets the local rotateX data if the value is a finite number otherwise removes the local data.
     *
     * @param {number|null|undefined}   value - A value to set.
     */
    set rotateX(arg: number);
    /**
     * @returns {number|undefined} Any local rotateX data.
     */
    get rotateX(): number;
    /**
     * Sets the local rotateY data if the value is a finite number otherwise removes the local data.
     *
     * @param {number|null|undefined}   value - A value to set.
     */
    set rotateY(arg: number);
    /**
     * @returns {number|undefined} Any local rotateY data.
     */
    get rotateY(): number;
    /**
     * Sets the local rotateZ data if the value is a finite number otherwise removes the local data.
     *
     * @param {number|null|undefined}   value - A value to set.
     */
    set rotateZ(arg: number);
    /**
     * @returns {number|undefined} Any local rotateZ data.
     */
    get rotateZ(): number;
    /**
     * Sets the local scale data if the value is a finite number otherwise removes the local data.
     *
     * @param {number|null|undefined}   value - A value to set.
     */
    set scale(arg: number);
    /**
     * @returns {number|undefined} Any local rotateZ scale.
     */
    get scale(): number;
    /**
     * Sets the local translateX data if the value is a finite number otherwise removes the local data.
     *
     * @param {number|null|undefined}   value - A value to set.
     */
    set translateX(arg: number);
    /**
     * @returns {number|undefined} Any local translateZ data.
     */
    get translateX(): number;
    /**
     * Sets the local translateY data if the value is a finite number otherwise removes the local data.
     *
     * @param {number|null|undefined}   value - A value to set.
     */
    set translateY(arg: number);
    /**
     * @returns {number|undefined} Any local translateZ data.
     */
    get translateY(): number;
    /**
     * Sets the local translateZ data if the value is a finite number otherwise removes the local data.
     *
     * @param {number|null|undefined}   value - A value to set.
     */
    set translateZ(arg: number);
    /**
     * @returns {number|undefined} Any local translateZ data.
     */
    get translateZ(): number;
    /**
     * Returns the matrix3d CSS transform for the given position / transform data.
     *
     * @param {object} [data] - Optional position data otherwise use local stored transform data.
     *
     * @returns {string} The CSS matrix3d string.
     */
    getCSS(data?: object): string;
    /**
     * Returns the matrix3d CSS transform for the given position / transform data.
     *
     * @param {object} [data] - Optional position data otherwise use local stored transform data.
     *
     * @returns {string} The CSS matrix3d string.
     */
    getCSSOrtho(data?: object): string;
    /**
     * Collects all data including a bounding rect, transform matrix, and points array of the given {@link PositionData}
     * instance with the applied local transform data.
     *
     * @param {PositionData} position - The position data to process.
     *
     * @param {TransformData} [output] - Optional TransformData output instance.
     *
     * @param {object} [validationData] - Optional validation data for adjustment parameters.
     *
     * @returns {TransformData} The output TransformData instance.
     */
    getData(position: any, output?: TransformData, validationData?: object): TransformData;
    /**
     * Creates a transform matrix based on local data applied in order it was added.
     *
     * If no data object is provided then the source is the local transform data. If another data object is supplied
     * then the stored local transform order is applied then all remaining transform keys are applied. This allows the
     * construction of a transform matrix in advance of setting local data and is useful in collision detection.
     *
     * @param {object}   [data] - PositionData instance or local transform data.
     *
     * @param {Matrix4}  [output] - The output mat4 instance.
     *
     * @returns {Matrix4} Transform matrix.
     */
    getMat4(data?: object, output?: any): any;
    /**
     * Provides an orthographic enhancement to convert left / top positional data to a translate operation.
     *
     * This transform matrix takes into account that the remaining operations are , but adds any left / top attributes from passed in data to
     * translate X / Y.
     *
     * If no data object is provided then the source is the local transform data. If another data object is supplied
     * then the stored local transform order is applied then all remaining transform keys are applied. This allows the
     * construction of a transform matrix in advance of setting local data and is useful in collision detection.
     *
     * @param {object}   [data] - PositionData instance or local transform data.
     *
     * @param {Matrix4}  [output] - The output mat4 instance.
     *
     * @returns {Matrix4} Transform matrix.
     */
    getMat4Ortho(data?: object, output?: any): any;
    /**
     * Tests an object if it contains transform keys and the values are finite numbers.
     *
     * @param {object} data - An object to test for transform data.
     *
     * @returns {boolean} Whether the given PositionData has transforms.
     */
    hasTransform(data: object): boolean;
    /**
     * Resets internal data from the given object containing valid transform keys.
     *
     * @param {object}   data - An object with transform data.
     */
    reset(data: object): void;
    #private;
}

/**
 * Provides a store for position following the subscriber protocol in addition to providing individual writable derived
 * stores for each independent variable.
 */
declare class Position {
    /**
     * @returns {AnimationGroupAPI} Public Animation API.
     */
    static get Animate(): AnimationGroupAPI;
    /**
     * @returns {{browserCentered?: Centered, Centered?: *}} Initial position helpers.
     */
    static get Initial(): {
        browserCentered?: any;
        Centered?: any;
    };
    /**
     * Returns TransformData class / constructor.
     *
     * @returns {TransformData} TransformData class / constructor.
     */
    static get TransformData(): TransformData;
    /**
     * Returns default validators.
     *
     * Note: `basicWindow` and `BasicBounds` will eventually be removed.
     *
     * @returns {{basicWindow?: BasicBounds, transformWindow?: TransformBounds, TransformBounds?: *, BasicBounds?: *}}
     *  Available validators.
     */
    static get Validators(): {
        basicWindow?: any;
        transformWindow?: any;
        TransformBounds?: any;
        BasicBounds?: any;
    };
    /**
     * @param {PositionParent|PositionOptions}   [parent] - A potential parent element or object w/ `elementTarget`
     *                                                      getter. May also be the PositionOptions object w/ 1 argument.
     *
     * @param {PositionOptions}   options - Default values.
     */
    constructor(parent?: PositionParent | PositionOptions, options: PositionOptions);
    /**
     * Returns the animation API.
     *
     * @returns {AnimationAPI} Animation API.
     */
    get animate(): AnimationAPI;
    /**
     * Returns the dimension data for the readable store.
     *
     * @returns {{width: number | 'auto', height: number | 'auto'}} Dimension data.
     */
    get dimension(): {
        width: number | 'auto';
        height: number | 'auto';
    };
    /**
     * Returns the current HTMLElement being positioned.
     *
     * @returns {HTMLElement|undefined} Current HTMLElement being positioned.
     */
    get element(): HTMLElement;
    /**
     * Returns a promise that is resolved on the next element update with the time of the update.
     *
     * @returns {Promise<number>} Promise resolved on element update.
     */
    get elementUpdated(): Promise<number>;
    /**
     * Sets the associated {@link PositionParent} instance. Resets the style cache and default data.
     *
     * @param {PositionParent} parent - A PositionParent instance.
     */
    set parent(arg: any);
    /**
     * Returns the associated {@link PositionParent} instance.
     *
     * @returns {PositionParent} The PositionParent instance.
     */
    get parent(): any;
    /**
     * Returns the state API.
     *
     * @returns {PositionStateAPI} Position state API.
     */
    get state(): PositionStateAPI;
    /**
     * Returns the derived writable stores for individual data variables.
     *
     * @returns {StorePosition} Derived / writable stores.
     */
    get stores(): StorePosition;
    /**
     * Returns the transform data for the readable store.
     *
     * @returns {TransformData} Transform Data.
     */
    get transform(): TransformData;
    /**
     * Returns the validators.
     *
     * @returns {AdapterValidators} validators.
     */
    get validators(): AdapterValidators;
    /**
     * @param {number|'auto'|null} height -
     */
    set height(arg: number | "auto");
    /**
     * @returns {number|'auto'|null} height
     */
    get height(): number | "auto";
    /**
     * @param {number|null} left -
     */
    set left(arg: number);
    /**
     * @returns {number|null} left
     */
    get left(): number;
    /**
     * @param {number|null} maxHeight -
     */
    set maxHeight(arg: number);
    /**
     * @returns {number|null} maxHeight
     */
    get maxHeight(): number;
    /**
     * @param {number|null} maxWidth -
     */
    set maxWidth(arg: number);
    /**
     * @returns {number|null} maxWidth
     */
    get maxWidth(): number;
    /**
     * @param {number|null} minHeight -
     */
    set minHeight(arg: number);
    /**
     * @returns {number|null} minHeight
     */
    get minHeight(): number;
    /**
     * @param {number|null} minWidth -
     */
    set minWidth(arg: number);
    /**
     * @returns {number|null} minWidth
     */
    get minWidth(): number;
    /**
     * @param {number|null} rotateX -
     */
    set rotateX(arg: number);
    /**
     * @returns {number|null} rotateX
     */
    get rotateX(): number;
    /**
     * @param {number|null} rotateY -
     */
    set rotateY(arg: number);
    /**
     * @returns {number|null} rotateY
     */
    get rotateY(): number;
    /**
     * @param {number|null} rotateZ -
     */
    set rotateZ(arg: number);
    /**
     * @returns {number|null} rotateZ
     */
    get rotateZ(): number;
    /**
     * @param {number|null} rotateZ - alias for rotateZ
     */
    set rotation(arg: number);
    /**
     * @returns {number|null} alias for rotateZ
     */
    get rotation(): number;
    /**
     * @param {number|null} scale -
     */
    set scale(arg: number);
    /**
     * @returns {number|null} scale
     */
    get scale(): number;
    /**
     * @param {number|null} top -
     */
    set top(arg: number);
    /**
     * @returns {number|null} top
     */
    get top(): number;
    /**
     * @param {string} transformOrigin -
     */
    set transformOrigin(arg: string);
    /**
     * @returns {string} transformOrigin
     */
    get transformOrigin(): string;
    /**
     * @param {number|null} translateX -
     */
    set translateX(arg: number);
    /**
     * @returns {number|null} translateX
     */
    get translateX(): number;
    /**
     * @param {number|null} translateY -
     */
    set translateY(arg: number);
    /**
     * @returns {number|null} translateY
     */
    get translateY(): number;
    /**
     * @param {number|null} translateZ -
     */
    set translateZ(arg: number);
    /**
     * @returns {number|null} translateZ
     */
    get translateZ(): number;
    /**
     * @param {number|'auto'|null} width -
     */
    set width(arg: number | "auto");
    /**
     * @returns {number|'auto'|null} width
     */
    get width(): number | "auto";
    /**
     * @param {number|null} zIndex -
     */
    set zIndex(arg: number);
    /**
     * @returns {number|null} z-index
     */
    get zIndex(): number;
    /**
     * Assigns current position to object passed into method.
     *
     * @param {object|PositionData}  [position] - Target to assign current position data.
     *
     * @param {PositionGetOptions}   [options] - Defines options for specific keys and substituting null for numeric
     *                                           default values.
     *
     * @returns {PositionData} Passed in object with current position data.
     */
    get(position?: object | PositionData, options?: PositionGetOptions): PositionData;
    /**
     * @returns {PositionData} Current position data.
     */
    toJSON(): PositionData;
    /**
     * All calculation and updates of position are implemented in {@link Position}. This allows position to be fully
     * reactive and in control of updating inline styles for the application.
     *
     * Note: the logic for updating position is improved and changes a few aspects from the default
     * {@link Application.setPosition}. The gate on `popOut` is removed, so to ensure no positional application occurs
     * popOut applications can set `this.options.positionable` to false ensuring no positional inline styles are
     * applied.
     *
     * The initial set call on an application with a target element will always set width / height as this is
     * necessary for correct calculations.
     *
     * When a target element is present updated styles are applied after validation. To modify the behavior of set
     * implement one or more validator functions and add them from the application via
     * `this.position.validators.add(<Function>)`.
     *
     * Updates to any target element are decoupled from the underlying Position data. This method returns this instance
     * that you can then await on the target element inline style update by using {@link Position.elementUpdated}.
     *
     * @param {PositionDataExtended} [position] - Position data to set.
     *
     * @returns {Position} This Position instance.
     */
    set(position?: PositionDataExtended): Position;
    /**
     *
     * @param {function(PositionData): void} handler - Callback function that is invoked on update / changes. Receives
     *                                                 a copy of the PositionData.
     *
     * @returns {(function(): void)} Unsubscribe function.
     */
    subscribe(handler: (arg0: PositionData) => void): (() => void);
    #private;
}
type InitialHelper = {
    /**
     * - A function that takes the width parameter and returns the left position.
     */
    getLeft: Function;
    /**
     * - A function that takes the height parameter and returns the top position.
     */
    getTop: Function;
};
type PositionDataExtended = {
    /**
     * -
     */
    height?: number | 'auto' | null;
    /**
     * -
     */
    left?: number | null;
    /**
     * -
     */
    maxHeight?: number | null;
    /**
     * -
     */
    maxWidth?: number | null;
    /**
     * -
     */
    minHeight?: number | null;
    /**
     * -
     */
    minWidth?: number | null;
    /**
     * -
     */
    rotateX?: number | null;
    /**
     * -
     */
    rotateY?: number | null;
    /**
     * -
     */
    rotateZ?: number | null;
    /**
     * -
     */
    scale?: number | null;
    /**
     * -
     */
    top?: number | null;
    /**
     * -
     */
    transformOrigin?: string | null;
    /**
     * -
     */
    translateX?: number | null;
    /**
     * -
     */
    translateY?: number | null;
    /**
     * -
     */
    translateZ?: number | null;
    /**
     * -
     */
    width?: number | 'auto' | null;
    /**
     * -
     *
     * Extended properties -----------------------------------------------------------------------------------------------
     */
    zIndex?: number | null;
    /**
     * - When true any associated element is updated immediately.
     */
    immediateElementUpdate?: boolean;
    /**
     * - Alias for `rotateZ`.
     */
    rotation?: number | null;
};
type PositionGetOptions = {
    /**
     * - When provided only these keys are copied.
     */
    keys: Iterable<string>;
    /**
     * - When true any `null` values are converted into defaults.
     */
    numeric: boolean;
};
/**
 * - Options set in constructor.
 */
type PositionOptions = {
    /**
     * - When true always calculate transform data.
     */
    calculateTransform: boolean;
    /**
     * - Provides a helper for setting initial position data.
     */
    initialHelper: InitialHelper;
    /**
     * - Sets Position to orthographic mode using just transform / matrix3d for positioning.
     */
    ortho: boolean;
    /**
     * - Set to true when there are subscribers to the readable transform store.
     */
    transformSubscribed: boolean;
};
type PositionParent = HTMLElement | object;
type ResizeObserverData = {
    /**
     * -
     */
    contentHeight: number | undefined;
    /**
     * -
     */
    contentWidth: number | undefined;
    /**
     * -
     */
    offsetHeight: number | undefined;
    /**
     * -
     */
    offsetWidth: number | undefined;
};
/**
 * - Provides individual writable stores for {@link Position }.
 */
type StorePosition = {
    /**
     * - Readable store for dimension
     *   data.
     */
    dimension: svelte_store.Readable<{
        width: number;
        height: number;
    }>;
    /**
     * - Readable store for current element.
     */
    element: svelte_store.Readable<HTMLElement>;
    /**
     * - Derived store for `left` updates.
     */
    left: svelte_store.Writable<number | null>;
    /**
     * - Derived store for `top` updates.
     */
    top: svelte_store.Writable<number | null>;
    /**
     * - Derived store for `width` updates.
     */
    width: svelte_store.Writable<number | 'auto' | null>;
    /**
     * - Derived store for `height` updates.
     */
    height: svelte_store.Writable<number | 'auto' | null>;
    /**
     * - Derived store for `maxHeight` updates.
     */
    maxHeight: svelte_store.Writable<number | null>;
    /**
     * - Derived store for `maxWidth` updates.
     */
    maxWidth: svelte_store.Writable<number | null>;
    /**
     * - Derived store for `minHeight` updates.
     */
    minHeight: svelte_store.Writable<number | null>;
    /**
     * - Derived store for `minWidth` updates.
     */
    minWidth: svelte_store.Writable<number | null>;
    /**
     * - Readable store for `contentHeight`.
     */
    resizeContentHeight: svelte_store.Readable<number | undefined>;
    /**
     * - Readable store for `contentWidth`.
     */
    resizeContentWidth: svelte_store.Readable<number | undefined>;
    /**
     * - Protected store for resize observer updates.
     */
    resizeObserved: svelte_store.Writable<ResizeObserverData>;
    /**
     * - Readable store for `offsetHeight`.
     */
    resizeOffsetHeight: svelte_store.Readable<number | undefined>;
    /**
     * - Readable store for `offsetWidth`.
     */
    resizeOffsetWidth: svelte_store.Readable<number | undefined>;
    /**
     * - Derived store for `rotate` updates.
     */
    rotate: svelte_store.Writable<number | null>;
    /**
     * - Derived store for `rotateX` updates.
     */
    rotateX: svelte_store.Writable<number | null>;
    /**
     * - Derived store for `rotateY` updates.
     */
    rotateY: svelte_store.Writable<number | null>;
    /**
     * - Derived store for `rotateZ` updates.
     */
    rotateZ: svelte_store.Writable<number | null>;
    /**
     * - Derived store for `scale` updates.
     */
    scale: svelte_store.Writable<number | null>;
    /**
     * - Readable store for transform data.
     */
    transform: svelte_store.Readable<TransformData>;
    /**
     * - Derived store for `transformOrigin`.
     */
    transformOrigin: svelte_store.Writable<string>;
    /**
     * - Derived store for `translateX` updates.
     */
    translateX: svelte_store.Writable<number | null>;
    /**
     * - Derived store for `translateY` updates.
     */
    translateY: svelte_store.Writable<number | null>;
    /**
     * - Derived store for `translateZ` updates.
     */
    translateZ: svelte_store.Writable<number | null>;
    /**
     * - Derived store for `zIndex` updates.
     */
    zIndex: svelte_store.Writable<number | null>;
};
type ValidationData = {
    /**
     * -
     */
    position: PositionData;
    /**
     * -
     */
    parent: PositionParent;
    /**
     * -
     */
    el: HTMLElement;
    /**
     * -
     */
    computed: CSSStyleDeclaration;
    /**
     * -
     */
    transforms: Transforms;
    /**
     * -
     */
    height: number;
    /**
     * -
     */
    width: number;
    /**
     * -
     */
    marginLeft: number | undefined;
    /**
     * -
     */
    marginTop: number | undefined;
    /**
     * -
     */
    maxHeight: number | undefined;
    /**
     * -
     */
    maxWidth: number | undefined;
    /**
     * -
     */
    minHeight: number | undefined;
    /**
     * -
     */
    minWidth: number | undefined;
    /**
     * - The rest of any data submitted to {@link Position.set }
     */
    rest: object;
};

/**
 * Provides a public API for grouping multiple animations together with the AnimationManager.
 */
declare class AnimationGroupAPI {
    /**
     * Cancels any animation for given Position data.
     *
     * @param {Position|{position: Position}|Iterable<Position>|Iterable<{position: Position}>} data -
     */
    static cancel(data: Position | {
        position: Position;
    } | Iterable<Position> | Iterable<{
        position: Position;
    }>): void;
    /**
     * Cancels all Position animation.
     */
    static cancelAll(): void;
    /**
     * Animates one or more Position instances as a group.
     *
     * @param {Position|{position: Position}|Iterable<Position>|Iterable<{position: Position}>} position -
     *
     * @param {object|Function}   toData -
     *
     * @param {object|Function}   options -
     *
     * @returns {TJSBasicAnimation} Basic animation control.
     */
    static to(position: Position | {
        position: Position;
    } | Iterable<Position> | Iterable<{
        position: Position;
    }>, toData: object | Function, options: object | Function): any;
}

/**
 * Provides a Svelte aware extension to Application to control the app lifecycle appropriately. You can declaratively
 * load one or more components from `defaultOptions`.
 */
declare class SvelteApplication {
    /**
     * Specifies the default options that SvelteApplication supports.
     *
     * @returns {object} options - Application options.
     * @see https://foundryvtt.com/api/Application.html#options
     */
    static get defaultOptions(): any;
    /**
     * @inheritDoc
     */
    constructor(options?: {});
    /**
     * Returns the content element if an application shell is mounted.
     *
     * @returns {HTMLElement} Content element.
     */
    get elementContent(): HTMLElement;
    /**
     * Returns the target element or main element if no target defined.
     *
     * @returns {HTMLElement} Target element.
     */
    get elementTarget(): HTMLElement;
    /**
     * Returns the reactive accessors & Svelte stores for SvelteApplication.
     *
     * @returns {SvelteReactive} The reactive accessors & Svelte stores.
     */
    get reactive(): SvelteReactive;
    /**
     * Returns the application state manager.
     *
     * @returns {ApplicationState} The application state manager.
     */
    get state(): ApplicationState;
    /**
     * Returns the Svelte helper class w/ various methods to access mounted Svelte components.
     *
     * @returns {GetSvelteData} GetSvelteData
     */
    get svelte(): GetSvelteData;
    /**
     * In this case of when a template is defined in app options `html` references the inner HTML / template. However,
     * to activate classic v1 tabs for a Svelte component the element target is passed as an array simulating JQuery as
     * the element is retrieved immediately and the core listeners use standard DOM queries.
     *
     * @inheritDoc
     * @protected
     * @ignore
     */
    protected _activateCoreListeners(html: any): void;
    /**
     * Provide an override to set this application as the active window regardless of z-index. Changes behaviour from
     * Foundry core. This is important / used for instance in dialog key handling for left / right button selection.
     *
     * @param {object} [opts] - Optional parameters.
     *
     * @param {boolean} [opts.force=false] - Force bring to top; will increment z-index by popOut order.
     *
     */
    bringToTop({ force }?: {
        force?: boolean;
    }): void;
    /**
     * Note: This method is fully overridden and duplicated as Svelte components need to be destroyed manually and the
     * best visual result is to destroy them after the default slide up animation occurs, but before the element
     * is removed from the DOM.
     *
     * If you destroy the Svelte components before the slide up animation the Svelte elements are removed immediately
     * from the DOM. The purpose of overriding ensures the slide up animation is always completed before
     * the Svelte components are destroyed and then the element is removed from the DOM.
     *
     * Close the application and un-register references to it within UI mappings.
     * This function returns a Promise which resolves once the window closing animation concludes
     *
     * @param {object}   [options] - Optional parameters.
     *
     * @param {boolean}  [options.force] - Force close regardless of render state.
     *
     * @returns {Promise<void>}    A Promise which resolves once the application is closed.
     * @ignore
     */
    close(options?: {
        force?: boolean;
    }): Promise<void>;
    /**
     * @ignore
     */
    _state: any;
    /**
     * @ignore
     */
    _element: any;
    /**
     * @ignore
     */
    _minimized: boolean;
    /**
     * @ignore
     */
    _scrollPositions: any;
    /**
     * Inject the Svelte components defined in `this.options.svelte`. The Svelte component can attach to the existing
     * pop-out of Application or provide no template and render into a document fragment which is then attached to the
     * DOM.
     *
     * @param {JQuery} html -
     *
     * @inheritDoc
     * @ignore
     */
    _injectHTML(html: any): void;
    /**
     * Provides a mechanism to update the UI options store for maximized.
     *
     * Note: the sanity check is duplicated from {@link Application.maximize} the store is updated _before_
     * performing the rest of animations. This allows application shells to remove / show any resize handlers
     * correctly. Extra constraint data is stored in a saved position state in {@link SvelteApplication.minimize}
     * to animate the content area.
     *
     * @param {object}   [opts] - Optional parameters.
     *
     * @param {boolean}  [opts.animate=true] - When true perform default maximizing animation.
     *
     * @param {number}   [opts.duration=0.1] - Controls content area animation duration in seconds.
     */
    maximize({ animate, duration }?: {
        animate?: boolean;
        duration?: number;
    }): Promise<void>;
    /**
     * Provides a mechanism to update the UI options store for minimized.
     *
     * Note: the sanity check is duplicated from {@link Application.minimize} the store is updated _before_
     * performing the rest of animations. This allows application shells to remove / show any resize handlers
     * correctly. Extra constraint data is stored in a saved position state in {@link SvelteApplication.minimize}
     * to animate the content area.
     *
     * @param {object}   [opts] - Optional parameters
     *
     * @param {boolean}  [opts.animate=true] - When true perform default minimizing animation.
     *
     * @param {number}   [opts.duration=0.1] - Controls content area animation duration in seconds.
     */
    minimize({ animate, duration }?: {
        animate?: boolean;
        duration?: number;
    }): Promise<void>;
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
    onSvelteMount({ element, elementContent, elementTarget }?: {
        element?: HTMLElement;
        elementContent?: HTMLElement;
        elementTarget?: HTMLElement;
    }): void;
    /**
     * Override replacing HTML as Svelte components control the rendering process. Only potentially change the outer
     * application frame / title for pop-out applications.
     *
     * @inheritDoc
     * @ignore
     */
    _replaceHTML(element: any, html: any): void;
    /**
     * Provides an override verifying that a new Application being rendered for the first time doesn't have a
     * corresponding DOM element already loaded. This is a check that only occurs when `this._state` is
     * `Application.RENDER_STATES.NONE`. It is useful in particular when SvelteApplication has a static ID
     * explicitly set in `this.options.id` and long intro / outro transitions are assigned. If a new application
     * sharing this static ID attempts to open / render for the first time while an existing DOM element sharing
     * this static ID exists then the initial render is cancelled below rather than crashing later in the render
     * cycle {@link Position.set}.
     *
     * @inheritDoc
     * @protected
     * @ignore
     */
    protected _render(force?: boolean, options?: {}): Promise<void>;
    /**
     * Render the inner application content. Only render a template if one is defined otherwise provide an empty
     * JQuery element per the core Foundry API.
     *
     * @param {Object} data         The data used to render the inner template
     *
     * @returns {Promise.<JQuery>}   A promise resolving to the constructed jQuery object
     *
     * @protected
     * @ignore
     */
    protected _renderInner(data: any): Promise<any>;
    /**
     * Stores the initial z-index set in `_renderOuter` which is used in `_injectHTML` to set the target element
     * z-index after the Svelte component is mounted.
     *
     * @returns {Promise<JQuery>} Outer frame / unused.
     * @protected
     * @ignore
     */
    protected _renderOuter(): Promise<any>;
    /**
     * All calculation and updates of position are implemented in {@link Position.set}. This allows position to be fully
     * reactive and in control of updating inline styles for the application.
     *
     * This method remains for backward compatibility with Foundry. If you have a custom override quite likely you need
     * to update to using the {@link Position.validators} functionality.
     *
     * @param {PositionDataExtended}   [position] - Position data.
     *
     * @returns {Position} The updated position object for the application containing the new values
     */
    setPosition(position?: any): Position;
    #private;
}
type SvelteData = {
    /**
     * -
     */
    config: object;
    /**
     * -
     */
    component: svelte.SvelteComponent;
    /**
     * -
     */
    element: HTMLElement;
    /**
     * -
     */
    injectHTML: boolean;
};
type SvelteStores = {
    /**
     * - Update function for app options store.
     */
    appOptionsUpdate: any;
    /**
     * - Subscribes to local stores.
     */
    subscribe: Function;
    /**
     * - Update function for UI options store.
     */
    uiOptionsUpdate: any;
    /**
     * - Unsubscribes from local stores.
     */
    unsubscribe: Function;
};

declare class DialogData {
    /**
     * @param {SvelteApplication} application - The host Foundry application.
     */
    constructor(application: any);
    /**
     * Provides a way to safely get this dialogs data given an accessor string which describes the
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
    get(accessor: string, defaultValue?: any): any;
    /**
     * @param {object} data - Merge provided data object into Dialog data.
     */
    merge(data: object): void;
    /**
     * Provides a way to safely set this dialogs data given an accessor string which describes the
     * entries to walk. To access deeper entries into the object format the accessor string with `.` between entries
     * to walk.
     *
     * Automatically the dialog data will be updated in the associated DialogShell Svelte component.
     *
     * // TODO DOCUMENT the accessor in more detail.
     *
     * @param {string}   accessor - The path / key to set. You can set multiple levels.
     *
     * @param {*}        value - Value to set.
     *
     * @returns {boolean} True if successful.
     */
    set(accessor: string, value: any): boolean;
    #private;
}

/**
 * Provides a Foundry API compatible dialog alternative implemented w/ Svelte. There are several features including
 * a glasspane / modal option with various styling and transition capabilities.
 *
 * TODO: document all dialog data parameters; keep track of newly added like button -> styles, title; modal,
 * draggable, transition options, modal transitions
 */
declare class TJSDialog extends SvelteApplication {
    /**
     * A helper factory method to create simple confirmation dialog windows which consist of simple yes/no prompts.
     * If you require more flexibility, a custom Dialog instance is preferred.
     *
     * @param {TJSConfirmConfig} config - Confirm dialog options.
     *
     * @returns {Promise<*>} A promise which resolves once the user makes a choice or closes the window.
     *
     * @example
     * let d = TJSDialog.confirm({
     *  title: "A Yes or No Question",
     *  content: "<p>Choose wisely.</p>",
     *  yes: () => console.log("You chose ... wisely"),
     *  no: () => console.log("You chose ... poorly"),
     *  defaultYes: false
     * });
     */
    static confirm({ title, content, yes, no, render, defaultYes, rejectClose, options, buttons, draggable, modal, modalOptions, popOut, resizable, transition, zIndex }?: TJSConfirmConfig): Promise<any>;
    /**
     * A helper factory method to display a basic "prompt" style Dialog with a single button
     *
     * @param {TJSPromptConfig} config - Prompt dialog options.
     *
     * @returns {Promise<*>} The returned value from the provided callback function, if any
     */
    static prompt({ title, content, label, callback, render, rejectClose, options, draggable, icon, modal, modalOptions, popOut, resizable, transition, zIndex }?: TJSPromptConfig): Promise<any>;
    /**
     * @param {object}   data - Dialog data.
     *
     * @param {object}   [options] - SvelteApplication options.
     */
    constructor(data: object, options?: object);
    /**
     * Sets the dialog data; this is reactive.
     *
     * @param {object}   data - Dialog data.
     */
    set data(arg: DialogData);
    /**
     * Returns the dialog data.
     *
     * @returns {DialogData} Dialog data.
     */
    get data(): DialogData;
    /**
     * Implemented only for backwards compatibility w/ default Foundry {@link Dialog} API.
     *
     * @param {JQuery}   html - JQuery element for content area.
     */
    activateListeners(html: any): void;
    #private;
}
/**
 * - Configuration options for the confirm dialog.
 */
type TJSConfirmConfig = {
    /**
     * - The confirmation window title
     */
    title: string;
    /**
     * - The confirmation message
     */
    content: string;
    /**
     * - Callback function upon yes
     */
    yes?: Function;
    /**
     * - Callback function upon no
     */
    no?: Function;
    /**
     * - A function to call when the dialog is rendered
     */
    render?: Function;
    /**
     * - Make "yes" the default choice?
     */
    defaultYes?: boolean;
    /**
     * - Reject the Promise if the Dialog is closed without making a choice.
     */
    rejectClose?: boolean;
    /**
     * - Additional rendering options passed to the Dialog
     */
    options?: object;
    /**
     * - Provides a button override that is merged with default buttons.
     */
    buttons?: object;
    /**
     * - The dialog is draggable when true.
     */
    draggable?: boolean;
    /**
     * - When true a modal dialog is displayed.
     */
    modal?: boolean;
    /**
     * - Additional options for modal dialog display.
     */
    modalOptions?: object;
    /**
     * - When true the dialog is a pop out Application.
     */
    popOut?: boolean;
    /**
     * - When true the dialog is resizable.
     */
    resizable?: boolean;
    /**
     * - Transition options for the dialog.
     */
    transition?: object;
    /**
     * - A specific z-index for the dialog.
     */
    zIndex?: number | null;
};
/**
 * - Configuration options for the confirm dialog.
 */
type TJSPromptConfig = {
    /**
     * - The confirmation window title
     */
    title: string;
    /**
     * - The confirmation message
     */
    content: string;
    /**
     * - The confirmation button text.
     */
    label?: string;
    /**
     * - A callback function to fire when the button is clicked.
     */
    callback?: Function;
    /**
     * - A function to call when the dialog is rendered.
     */
    render?: Function;
    /**
     * - Reject the Promise if the Dialog is closed without making a choice.
     */
    rejectClose?: boolean;
    /**
     * - Additional application options passed to the TJSDialog.
     */
    options?: object;
    /**
     * - The dialog is draggable when true.
     */
    draggable?: boolean;
    /**
     * fas fa-check"></i>"] - Set another icon besides `fa-check` for button.
     */
    icon?: string;
    /**
     * - When true a modal dialog is displayed.
     */
    modal?: boolean;
    /**
     * - Additional options for modal dialog display.
     */
    modalOptions?: object;
    /**
     * - When true the dialog is a pop out Application.
     */
    popOut?: boolean;
    /**
     * - When true the dialog is resizable.
     */
    resizable?: boolean;
    /**
     * - Transition options for the dialog.
     */
    transition?: object;
    /**
     * - A specific z-index for the dialog.
     */
    zIndex?: number | null;
};

/**
 * - Application shell contract for Svelte components.
 */
type MountedAppShell = {
    /**
     * - The root element / exported prop.
     */
    elementRoot: HTMLElement;
    /**
     * - The content element / exported prop.
     */
    elementContent?: HTMLElement;
    /**
     * - The target element / exported prop.
     */
    elementTarget?: HTMLElement;
};
/**
 * - Provides a custom readable Svelte store for Application options state.
 */
type StoreAppOptions = {
    /**
     * - Subscribe to all app options updates.
     */
    subscribe: any;
    /**
     * - Derived store for `draggable` updates.
     */
    draggable: svelte_store.Readable<boolean>;
    /**
     * - Derived store for `minimizable` updates.
     */
    minimizable: svelte_store.Readable<boolean>;
    /**
     * - Derived store for `popOut` updates.
     */
    popOut: svelte_store.Readable<boolean>;
    /**
     * - Derived store for `resizable` updates.
     */
    resizable: svelte_store.Readable<boolean>;
    /**
     * - Derived store for `title` updates.
     */
    title: svelte_store.Readable<string>;
    /**
     * - Derived store for `zIndex` updates.
     */
    zIndex: svelte_store.Readable<number>;
};
/**
 * - Provides a custom readable Svelte store for UI options state.
 */
type StoreUIOptions = {
    /**
     * - Subscribe to all UI options updates.
     */
    subscribe: any;
    /**
     * - Derived store for
     *   `headerButtons` updates.
     */
    headerButtons: svelte_store.Readable<any[]>;
    /**
     * - Derived store for `minimized` updates.
     */
    minimized: svelte_store.Readable<boolean>;
};

export { InitialHelper, MountedAppShell, Position, PositionDataExtended, PositionGetOptions, PositionOptions, PositionParent, ResizeObserverData, StoreAppOptions, StorePosition, StoreUIOptions, SvelteApplication, SvelteData, SvelteStores, TJSConfirmConfig, TJSDialog, TJSPromptConfig, ValidationData };
