import { SvelteComponent } from 'svelte/types/runtime/internal/Component';

declare class ApplicationShell extends SvelteComponent {
    constructor(options: any);
    set elementContent(arg: any);
    get elementContent(): any;
    set elementRoot(arg: any);
    get elementRoot(): any;
    set children(arg: any);
    get children(): any;
    set heightChanged(arg: any);
    get heightChanged(): any;
    set transition(arg: any);
    get transition(): any;
    set inTransition(arg: any);
    get inTransition(): any;
    set outTransition(arg: any);
    get outTransition(): any;
    set transitionOptions(arg: any);
    get transitionOptions(): any;
    set inTransitionOptions(arg: any);
    get inTransitionOptions(): any;
    set outTransitionOptions(arg: any);
    get outTransitionOptions(): any;
}
declare class DialogContent extends SvelteComponent {
    constructor(options: any);
}
declare class DialogShell extends SvelteComponent {
    constructor(options: any);
    set elementRoot(arg: any);
    get elementRoot(): any;
    set data(arg: any);
    get data(): any;
}
declare class TJSApplicationHeader extends SvelteComponent {
    constructor(options: any);
}
declare class TJSApplicationShell extends SvelteComponent {
    constructor(options: any);
    set elementContent(arg: any);
    get elementContent(): any;
    set elementRoot(arg: any);
    get elementRoot(): any;
    set children(arg: any);
    get children(): any;
    set heightChanged(arg: any);
    get heightChanged(): any;
    set transition(arg: any);
    get transition(): any;
    set inTransition(arg: any);
    get inTransition(): any;
    set outTransition(arg: any);
    get outTransition(): any;
    set transitionOptions(arg: any);
    get transitionOptions(): any;
    set inTransitionOptions(arg: any);
    get inTransitionOptions(): any;
    set outTransitionOptions(arg: any);
    get outTransitionOptions(): any;
}
declare class TJSComponentShell extends SvelteComponent {
    constructor(options: any);
    set children(arg: any);
    get children(): any;
}
declare class TJSContainer extends SvelteComponent {
    constructor(options: any);
    set warn(arg: any);
    get warn(): any;
    set children(arg: any);
    get children(): any;
}
declare class TJSContextMenu extends SvelteComponent {
    constructor(options: any);
}
declare class TJSGlassPane extends SvelteComponent {
    constructor(options: any);
    set id(arg: any);
    get id(): any;
    set zIndex(arg: any);
    get zIndex(): any;
    set background(arg: any);
    get background(): any;
    set captureInput(arg: any);
    get captureInput(): any;
    set preventDefault(arg: any);
    get preventDefault(): any;
    set stopPropagation(arg: any);
    get stopPropagation(): any;
    set transition(arg: any);
    get transition(): any;
    set inTransition(arg: any);
    get inTransition(): any;
    set outTransition(arg: any);
    get outTransition(): any;
    set transitionOptions(arg: any);
    get transitionOptions(): any;
    set inTransitionOptions(arg: any);
    get inTransitionOptions(): any;
    set outTransitionOptions(arg: any);
    get outTransitionOptions(): any;
}
declare class TJSHeaderButton extends SvelteComponent {
    constructor(options: any);
    set button(arg: any);
    get button(): any;
}

export { ApplicationShell, DialogContent, DialogShell, TJSApplicationHeader, TJSApplicationShell, TJSComponentShell, TJSContainer, TJSContextMenu, TJSGlassPane, TJSHeaderButton };
