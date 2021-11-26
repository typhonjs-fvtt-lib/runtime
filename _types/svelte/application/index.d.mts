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
     * @param {MountedAppShell[]|null[]}  applicationShellHolder - A reference to the MountedAppShell array.
     *
     * @param {SvelteData[]}  svelteData - A reference to the SvelteData array of mounted components.
     */
    constructor(applicationShellHolder: any[] | null[], svelteData: SvelteData[]);

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

    /**
     * Returns the length of the mounted Svelte component list.
     *
     * @returns {number} Length of mounted Svelte component list.
     */
    get length(): number;
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
    constructor(options?: Partial<Application.Options>);

    /**
     * Sets `this.options.draggable` which is reactive for application shells.
     *
     * @param {boolean}  draggable - Sets the draggable option.
     */
    set draggable(draggable);

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
    set elementContent(content: HTMLElement);

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
    set elementTarget(target: HTMLElement);

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
    set minimizable(minimizable: boolean);

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
    set popOut(popOut: boolean);

    /**
     * @inheritDoc
     */
    get popOut(): boolean;

    /**
     * Sets `this.options.resizable` which is reactive for application shells.
     *
     * @param {boolean}  resizable - Sets the resizable option.
     */
    set resizable(resizable: boolean);

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
    set title(title: string);

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
    set zIndex(zIndex: number);

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
    override close(options?): Promise<void>;

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
    mergeOptions(options: Partial<P>): void;

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
}

/**
 * Provides a Foundry API compatible dialog alternative implemented w/ Svelte. There are several features including
 * a glasspane / modal option with various styling and transition capabilities.
 */
declare class TJSDialog<D extends object, P extends Application.Options = Application.Options> extends SvelteApplication<P> {
    /**
     * A helper factory method to create simple confirmation dialog windows which consist of simple yes/no prompts.
     * If you require more flexibility, a custom Dialog instance is preferred.
     *
     * @param {TJSConfirmConfig} config - Confirm dialog options.
     *
     * @return {Promise<*>} A promise which resolves once the user makes a choice or closes the window.
     *
     * @example
     * let d = Dialog.confirm({
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
     * @param {TJSPromptConfig} - Prompt dialog options.
     *
     * @return {Promise<*>} The returned value from the provided callback function, if any
     */
    static prompt({ title, content, label, callback, render, rejectClose, options, draggable, icon, modal, modalOptions, popOut, resizable, transition, zIndex }?: TJSPromptConfig): Promise<any>;

    /**
     * @param {object}   data - Dialog data.
     *
     * @param {object}   options -
     */
    constructor(data?: Partial<D>, options?: Partial<Application.Options>);

    /**
     * Sets the dialog data content field; this is reactive.
     *
     * @param {*} content - Content to set.
     */
    set content(content: any);

    /**
     * Returns the content field in dialog data.
     *
     * @returns {*} content field.
     */
    get content(): any;

    /**
     * Sets the dialog data; this is reactive.
     *
     * @param {Partial<D>}   data - Dialog data.
     */
    set data(data: Partial<D>);

    /**
     * Returns the dialog data.
     *
     * @returns {D} Dialog data.
     */
    get data(): D;

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
    getDialogData(accessor: string, defaultValue?: any): any;

    /**
     * @param {Partial<D>} data - Merge provided data object into Dialog data.
     */
    mergeDialogData(data: Partial<D>): void;

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
     * - A specific z-index for the dialog. *
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
     * - Additional rendering options passed to the Dialog
     */
    options?: object;
    /**
     * - The dialog is draggable when true.
     */
    draggable?: boolean;
    /**
     * - Set another icon besides `fa-check` for button.
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
     * - A specific z-index for the dialog. *
     */
    zIndex?: number | null;
};

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

export { MountedAppShell, StoreAppOptions, StoreUIOptions, SvelteApplication, TJSConfirmConfig, TJSDialog, TJSMenu, TJSPromptConfig };
