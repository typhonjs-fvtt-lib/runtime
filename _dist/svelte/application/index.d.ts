import '@league-of-foundry-developers/foundry-vtt-types';
import * as svelte_store from 'svelte/store';

type SvelteData = {
    /**
     * -
     */
    config: object;
    /**
     * -
     */
    component: any;
    /**
     * -
     */
    element: HTMLElement;
    /**
     * -
     */
    eventbus: any;
};
/**
 * Provides a helper class for {@link SvelteApplication} by combining all methods that work on the {@link SvelteData[]}
 * of mounted components. This class is instantiated and can be retrieved by the getter `svelte` via SvelteApplication.
 */
declare class GetSvelteData {
    /**
     * Keep a direct reference to the SvelteData array in an associated {@link SvelteApplication}.
     *
     * @param {ApplicationShell[]|null[]}  applicationShellHolder - A reference to the ApplicationShell array.
     *
     * @param {SvelteData[]}  svelteData - A reference to the SvelteData array of mounted components.
     */
    constructor(applicationShellHolder: any[] | null[], svelteData: SvelteData[]);
    /**
     * Returns any mounted {@link ApplicationShell}.
     *
     * @returns {ApplicationShell|null} Any mounted application shell.
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
     * @returns {Generator<(number|*)[], void, *>} Svelte component entries iterator.
     * @yields
     */
    componentEntries(): Generator<(number | any)[], void, any>;
    /**
     * Returns the Svelte component values iterator.
     *
     * @returns {Generator<*, void, *>} Svelte component values iterator.
     * @yields
     */
    componentValues(): Generator<any, void, any>;
    /**
     * Returns the indexed SvelteData entry.
     *
     * @param {number}   index -
     *
     * @returns {object} The loaded Svelte config + component.
     */
    data(index: number): object;
    /**
     * Returns the SvelteData entries iterator.
     *
     * @returns {IterableIterator<[number, Object]>} SvelteData entries iterator.
     */
    dataEntries(): IterableIterator<[number, any]>;
    /**
     * Returns the SvelteData values iterator.
     *
     * @returns {IterableIterator<Object>} SvelteData values iterator.
     */
    dataValues(): IterableIterator<any>;
    get length(): number;
    #private;
}

/**
 * Provides a Svelte aware extension to Application to control the app lifecycle appropriately. You can declaratively
 * load one or more components from `defaultOptions`. For the time being please refer to this temporary demo code
 * in `typhonjs-quest-log` for examples of how to declare Svelte components.
 * {@link https://github.com/typhonjs-fvtt/typhonjs-quest-log/tree/master/src/view/demo}
 *
 * A repository of demos will be available soon.
 */
declare class SvelteApplication<P extends Application.Options = Application.Options> extends Application<P> {
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
    constructor(options: any);
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
     * Sets the content element.
     *
     * @param {HTMLElement} content - Content element.
     */
    set elementContent(arg: HTMLElement);
    /**
     * Returns the content element if an application shell is mounted.
     *
     * @returns {HTMLElement} Content element.
     */
    get elementContent(): HTMLElement;
    /**
     * Sets the target element or main element if no target defined.
     *
     * @param {HTMLElement} target - Target element.
     */
    set elementTarget(arg: HTMLElement);
    /**
     * Returns the target element or main element if no target defined.
     *
     * @returns {HTMLElement} Target element.
     */
    get elementTarget(): HTMLElement;
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
     * Returns the Svelte helper class w/ various methods to access mounted Svelte components.
     *
     * @returns {GetSvelteData} GetSvelteData
     */
    get svelte(): GetSvelteData;
    /**
     * Sets `this.options.title` which is reactive for application shells.
     *
     * @param {string}   title - Application title; will be localized, so a translation key is fine.
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
     * Sets `this.options.zIndex` which is reactive for application shells.
     *
     * @param {number}   zIndex - Application z-index.
     */
    set zIndex(arg: number);
    /**
     * Returns the zIndex app option.
     *
     * @returns {number} z-index app option.
     */
    get zIndex(): number;
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
     * @returns {Promise<void>}    A Promise which resolves once the application is closed
     */
    close(options?: {
        force: boolean;
    }): Promise<void>;
    _state: any;
    _element: JQuery<any>;
    _minimized: boolean;
    _scrollPositions: any;
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
     * Inject the Svelte components defined in `this.options.svelte`. The Svelte component can attach to the existing
     * pop-out of Application or provide no template and render into a document fragment which is then attached to the
     * DOM.
     *
     * @param {JQuery} html -
     *
     * @inheritDoc
     */
    _injectHTML(html: JQuery): void;
    /**
     * Provides a mechanism to update the UI options store for minimized.
     *
     * Note: the sanity check is duplicated from {@link Application.maximize} and the store is updated _before_
     * the actual parent method is invoked. This allows application shells to remove / show any resize handlers
     * correctly.
     *
     * @inheritDoc
     */
    maximize(): Promise<any>;
    /**
     * Provides a mechanism to update the UI options store for minimized.
     *
     * Note: the sanity check is duplicated from {@link Application.minimize} and the store is updated _before_
     * the actual parent method is invoked. This allows application shells to remove / show any resize handlers
     * correctly.
     *
     * @inheritDoc
     */
    minimize(): Promise<any>;
    /**
     * Provides a way to merge `options` into this applications options and update the appOptions store.
     *
     * @param {object}   options - The options object to merge with `this.options`.
     */
    mergeOptions(options: object): void;
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
     */
    _replaceHTML(element: any, html: any): void;
    /**
     * Render the inner application content. Only render a template if one is defined otherwise provide an empty
     * JQuery element.
     *
     * @param {Object} data         The data used to render the inner template
     *
     * @returns {Promise.<JQuery>}   A promise resolving to the constructed jQuery object
     *
     * @protected
     */
    protected _renderInner(data: any): Promise<JQuery>;
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
    setPosition({ left, top, width, height, scale, noHeight, noWidth }?: {
        left?: number | null;
        top?: number | null;
        width?: number | null;
        height?: number | string | null;
        scale?: number | null;
        noHeight?: boolean;
        noWidth?: boolean;
    }): {
        left: number;
        top: number;
        width: number;
        height: number;
        scale: number;
    };
    /**
     * Updates the UI Options store with the current header buttons. You may dynamically add / remove header buttons
     * if using an application shell Svelte component. In either overriding `_getHeaderButtons` or responding to the
     * Hooks fired return a new button array and the uiOptions store is updated and the application shell will render
     * the new buttons.
     *
     * Optionally you can set in the Foundry app options `headerButtonNoLabel` to true and labels will be removed from
     * the header buttons.
     */
    updateHeaderButtons(): void;
    #private;
}

/**
 * Provides a Foundry API compatible dialog alternative implemented w/ Svelte. There are several features including
 * a glasspane / modal option with various styling and transition capabilities.
 */
declare class TJSDialog extends SvelteApplication {
    static confirm({ title, content, yes, no, render, defaultYes, rejectClose, options, buttons, draggable, modal, modalOptions, popOut, resizable, transition, zIndex }?: {
        title: any;
        content: any;
        yes: any;
        no: any;
        render: any;
        defaultYes?: boolean;
        rejectClose?: boolean;
        options?: {};
        buttons?: {};
        draggable?: boolean;
        modal?: boolean;
        modalOptions?: {};
        popOut?: boolean;
        resizable?: boolean;
        transition?: {};
        zIndex: any;
    }): Promise<any>;
    static prompt({ title, content, label, callback, render, rejectClose, options, draggable, icon, modal, modalOptions, popOut, resizable, transition, zIndex }?: {
        title: any;
        content: any;
        label: any;
        callback: any;
        render: any;
        rejectClose?: boolean;
        options?: {};
        draggable?: boolean;
        icon?: string;
        modal?: boolean;
        modalOptions?: {};
        popOut?: boolean;
        resizable?: boolean;
        transition?: {};
        zIndex: any;
    }): Promise<any>;
    constructor(data: any, options: any);
    set content(arg: any);
    get content(): any;
    set data(arg: any);
    get data(): any;
    /**
     * Implemented only for backwards compatibility w/ default Foundry {@link Dialog} API.
     *
     * @param {JQuery}   html - JQuery element for content area.
     */
    activateListeners(html: JQuery): void;
    getDialogData(accessor: any, defaultValue: any): any;
    mergeDialogData(data: any): void;
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
     */
    setDialogData(accessor: string, value: any): void;
    #private;
}

/**
 * Provides game wide menu functionality.
 */
declare class TJSMenu {
    /**
     * Stores any active context menu.
     */
    static "__#460634@#contextMenu": any;
    /**
     * Creates and manages a game wide context menu.
     *
     * @param {object}   opts - Optional parameters.
     *
     * @param {string}   [opts.id] - A custom CSS ID to add to the menu.
     *
     * @param {number}   opts.x - X position for the top / left of the menu.
     *
     * @param {number}   opts.y - Y position for the top / left of the menu.
     *
     * @param {object[]} opts.items - Menu items to display.
     *
     * @param {number}   [opts.zIndex=10000] - Z-index for context menu.
     *
     * @param {...*}     [opts.transitionOptions] - The rest of opts defined the slideFade transition options.
     */
    static createContext({ id, x, y, items, zIndex, ...transitionOptions }?: {
        id?: string;
        x: number;
        y: number;
        items: object[];
        zIndex?: number;
        transitionOptions?: any[];
    }): void;
}

/**
 * - Application shell contract for Svelte components.
 */
type ApplicationShell = {
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

export { ApplicationShell, StoreAppOptions, StoreUIOptions, SvelteApplication, TJSDialog, TJSMenu };
