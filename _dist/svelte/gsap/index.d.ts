type GsapData = Iterable<object> | Function;
type GsapPositionOptions = {
    /**
     * - An optional filter function to adjust position data in `onUpdate` callbacks. This is
     *    useful if you need to transform any data from GSAP / plugins into data Position can
     *    utilize.
     */
    filter?: Function;
    /**
     * - Provides an iterable of property keys to assign to initial position
     *    data. This is useful when you are using GSAP plugins that manipulate
     *    data automatically; Ex. MotionPathPlugin
     */
    initialProps?: Iterable<string>;
};
type GSAPTarget = string | object | any | Iterable<any> | Array<HTMLElement | object>;
type PositionInfo = {
    /**
     * -
     */
    position: any[];
    /**
     * -
     */
    positionData: any[];
    /**
     * - Contains the full data object when a list of object w/ position is used.
     */
    data: object[];
    /**
     * -
     */
    elements: HTMLElement[];
    /**
     * -
     */
    gsapData: Array<object[]>;
};
/**
 * @typedef {object} PositionInfo
 *
 * @property {Position[]}              position -
 *
 * @property {PositionDataExtended[]}  positionData -
 *
 * @property {object[]}                data - Contains the full data object when a list of object w/ position is used.
 *
 * @property {HTMLElement[]}           elements -
 *
 * @property {Array<object[]>}         gsapData -
 */
/**
 * Provides a data driven ways to connect a {@link Position} instance with a GSAP timeline and tweens.
 *
 * {@link GsapPosition.timeline} supports the following types: 'add', 'addLabel', 'addPause', 'call', 'from',
 * 'fromTo', 'set', 'to'.
 */
declare class GsapCompose {
    /**
     * @param {GSAPTarget} target - A standard GSAP target or Position.
     *
     * @param {object}   vars - GSAP vars object for `from`.
     *
     * @param {GsapPositionOptions} [options] - Options for filtering and initial data population for Position tweens.
     *
     * @returns {object} GSAP tween
     */
    static from(target: GSAPTarget, vars: object, options?: GsapPositionOptions): object;
    /**
     * @param {GSAPTarget} target - A standard GSAP target or Position.
     *
     * @param {object}   fromVars - GSAP fromVars object for `fromTo`
     *
     * @param {object}   toVars - GSAP toVars object for `fromTo`.
     *
     * @param {GsapPositionOptions} [options] - Options for filtering and initial data population.
     *
     * @returns {object} GSAP tween
     */
    static fromTo(target: GSAPTarget, fromVars: object, toVars: object, options?: GsapPositionOptions): object;
    /**
     * Checks the `gsap` module instance for existence of a method and GsapCompose for the same method name. This
     * is helpful to determine which new features are available. Ex. `quickTo` is not available until GSAP `3.10+`.
     *
     * @param {string}   name - Name of method to check.
     *
     * @returns {boolean} Gsap and GsapCompose support the given method.
     */
    static hasMethod(name: string): boolean;
    /**
     * @param {GSAPTarget} target - A standard GSAP target or Position.
     *
     * @param {string}   key - Property of position to manipulate.
     *
     * @param {object}   vars - GSAP vars object for `quickTo`.
     *
     * @param {GsapPositionOptions} [options] - Options for filtering and initial data population.
     *
     * @returns {Function}  GSAP quickTo function.
     */
    static quickTo(target: GSAPTarget, key: string, vars: object, options?: GsapPositionOptions): Function;
    /**
     * Defers to `gsap` module to register an easing function.
     *
     * @param {string}   name - Easing name.
     *
     * @param {Function} ease - An easing function.
     */
    static registerEase(name: string, ease: Function): void;
    /**
     * Defers to `gsap` module to register a plugin.
     *
     * @param {...Function} args - A list of plugins.
     */
    static registerPlugin(...args: Function[]): void;
    /**
     * @param {GSAPTarget} target - A standard GSAP target or Position.
     *
     * @param {object|GsapData}   [arg1] - Either an object defining timeline options or GsapData.
     *
     * @param {GsapData|GsapPositionOptions} [arg2] - When arg1 is defined as an object; arg2 defines GsapData.
     *
     * @param {GsapPositionOptions} [arg3] - Options for filtering and initial data population.
     *
     * @returns {object} GSAP timeline
     */
    static timeline(target: GSAPTarget, arg1?: object | GsapData, arg2?: GsapData | GsapPositionOptions, arg3?: GsapPositionOptions): object;
    /**
     * @param {GSAPTarget} target - A standard GSAP target or Position.
     *
     * @param {object}   vars - GSAP vars object for `to`.
     *
     * @param {GsapPositionOptions} [options] - Options for filtering and initial data population.
     *
     * @returns {object} GSAP tween
     */
    static to(target: GSAPTarget, vars: object, options?: GsapPositionOptions): object;
}
/**
 * @typedef {Iterable<object>|Function} GsapData
 */
/**
 * @typedef {object} GsapPositionOptions
 *
 * @property {Function} [filter] - An optional filter function to adjust position data in `onUpdate` callbacks. This is
 *                                 useful if you need to transform any data from GSAP / plugins into data Position can
 *                                 utilize.
 *
 * @property {Iterable<string>} [initialProps] - Provides an iterable of property keys to assign to initial position
 *                                               data. This is useful when you are using GSAP plugins that manipulate
 *                                               data automatically; Ex. MotionPathPlugin
 */
/**
 * @typedef {string|object|Position|Iterable<Position>|Array<HTMLElement|object>} GSAPTarget
 */
/**
 * Provides an action to enable pointer dragging of an HTMLElement using GSAP `to` or `quickTo` to invoke `position.set`
 * on a given {@link Position} instance provided. You may provide a `easeOptions` object sent to the tween to modify the
 * duration / easing. When the attached boolean store state changes the draggable action is enabled or disabled.
 *
 * Note: Requires GSAP `3.10+` for `quickTo` support.
 *
 * @param {HTMLElement}       node - The node associated with the action.
 *
 * @param {object}            params - Required parameters.
 *
 * @param {Position}          params.position - A position instance.
 *
 * @param {boolean}           [params.active=true] - A boolean value; attached to a readable store.
 *
 * @param {number}            [params.button=0] - MouseEvent button; {@link https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button}.
 *
 * @param {Writable<boolean>} [params.storeDragging] - A writable store that tracks "dragging" state.
 *
 * @param {boolean}           [params.ease=true] - When true easing is enabled.
 *
 * @param {boolean}           [params.inertia=false] - When true inertia easing is enabled.
 *
 * @param {object}            [params.easeOptions] - Gsap `to / `quickTo` vars object.
 *
 * @param {object}            [params.inertiaOptions] - Inertia Options.
 *
 * @returns {{update: Function, destroy: Function}} The action lifecycle methods.
 */
declare function draggableGsap(node: HTMLElement, { position, active, button, storeDragging, ease, inertia, easeOptions, inertiaOptions }: {
    position: any;
    active?: boolean;
    button?: number;
    storeDragging?: any;
    ease?: boolean;
    inertia?: boolean;
    easeOptions?: object;
    inertiaOptions?: object;
}): {
    update: Function;
    destroy: Function;
};
declare namespace draggableGsap {
    /**
     * Define a function to get a DraggableGsapOptions instance.
     *
     * @returns {DraggableGsapOptions} A new options instance.
     */
    function options(options: any): DraggableGsapOptions;
}
declare const easingFunc: {};
declare const easingList: string[];
declare let gsap: any;
/**
 * @param {string}   name - Name of GSAP plugin to load.
 *
 * @returns {Promise<*>} The loaded plugin.
 */
declare function gsapLoadPlugin(name: string): Promise<any>;
/**
 * Provides a store / object to make updating / setting draggableGsap options much easier.
 */
declare class DraggableGsapOptions {
    constructor({ ease, easeOptions, inertia, inertiaOptions }?: {
        ease: any;
        easeOptions: any;
        inertia: any;
        inertiaOptions: any;
    });
    ease: any;
    easeOptions: any;
    inertia: any;
    inertiaOptions: any;
    /**
     * @param {number}   duration - Set ease duration.
     */
    set easeDuration(arg: number);
    /**
     * @returns {number} Get ease duration
     */
    get easeDuration(): number;
    /**
     * @param {string|Function} value - Get easing function value.
     */
    set easeValue(arg: string | Function);
    /**
     * @returns {string|Function} Get easing function value.
     */
    get easeValue(): string | Function;
    /**
     * @param {number|Array|Function} end - Set inertia end.
     *
     * @see `end` {@link https://greensock.com/docs/v3/Plugins/InertiaPlugin}
     */
    set inertiaEnd(arg: number | Function | any[]);
    /**
     * @returns {number|Array|Function} Get inertia end.
     * @see `end` {@link https://greensock.com/docs/v3/Plugins/InertiaPlugin}
     */
    get inertiaEnd(): number | Function | any[];
    /**
     * @param {number}   max - Set inertia duration max.
     */
    set inertiaDurationMax(arg: number);
    /**
     * @returns {number} Get inertia duration max time (seconds)
     */
    get inertiaDurationMax(): number;
    /**
     * @param {number}   min - Set inertia duration min.
     */
    set inertiaDurationMin(arg: number);
    /**
     * @returns {number} Get inertia duration min time (seconds)
     */
    get inertiaDurationMin(): number;
    /**
     * @param {number}   resistance - Set inertia resistance. Default: 1000
     */
    set inertiaResistance(arg: number);
    /**
     * @returns {number} Get inertia resistance (1000 is default).
     */
    get inertiaResistance(): number;
    /**
     * @param {number}   velocityScale - Set inertia velocity scale.
     */
    set inertiaVelocityScale(arg: number);
    /**
     * @returns {number} Get inertia velocity scale.
     */
    get inertiaVelocityScale(): number;
    /**
     * @param {{min: number, max: number}} duration - Set inertia duration min & max.
     */
    set inertiaDuration(arg: {
        min: number;
        max: number;
    });
    /**
     * Resets all options data to default values.
     */
    reset(): void;
    /**
     * Resets easing options to default values.
     */
    resetEase(): void;
    /**
     * Resets inertia options to default values.
     */
    resetInertia(): void;
    /**
     * Store subscribe method.
     *
     * @param {function(DraggableGsapOptions): void} handler - Callback function that is invoked on update / changes.
     *                                                         Receives the DraggableOptions object / instance.
     *
     * @returns {(function(): void)} Unsubscribe function.
     */
    subscribe(handler: (arg0: DraggableGsapOptions) => void): (() => void);
    #private;
}

export { GSAPTarget, GsapCompose, GsapData, GsapPositionOptions, PositionInfo, draggableGsap, easingFunc, easingList, gsap, gsapLoadPlugin };
