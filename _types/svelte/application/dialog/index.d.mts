/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
declare class TJSDocumentCreate {
    /**
     * Create a new Document of the type specified by `documentCls` by rendering a dialog window to provide basic
     * creation details.
     *
     * @param {object} documentCls - Document class to create.
     *
     * @param {object} [data] - Document data.
     *
     * @param {object} [context={}] - Additional context options or dialog positioning options.
     *
     * @param {object} [context.parent] - A parent Document within which these Documents should be embedded.
     *
     * @param {object} [context.pack] - A Compendium pack identifier within which the Documents should be modified.
     *
     * @param {boolean} [context.renderSheet] - Render the sheet for the new document.
     *
     * @param {...SvelteApplicationOptions} [context.options] - Rest of options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<foundry.abstract.Document|null>} The newly created document or a falsy value; either 'false' for
     *          cancelling or 'null' if the user closed the dialog via `<Esc>` or the close header button.
     */
    static show(documentCls: object, data?: object, { parent, pack, renderSheet, ...options }?: {
        parent?: object;
        pack?: object;
        renderSheet?: boolean;
        options?: SvelteApplicationOptions[];
    }, dialogData?: TJSDialogOptions): Promise<foundry.abstract.Document | null>;
    /**
     * Create a new Document of the type specified by `documentCls` by rendering a dialog window to provide basic
     * creation details.
     *
     * @param {object} documentCls - Document class to create.
     *
     * @param {object} [data] - Document data.
     *
     * @param {object} [context={}] - Additional context options or dialog positioning options.
     *
     * @param {object} [context.parent] - A parent Document within which these Documents should be embedded.
     *
     * @param {object} [context.pack] - A Compendium pack identifier within which the Documents should be modified.
     *
     * @param {boolean} [context.renderSheet] - Render the sheet for the new document.
     *
     * @param {...SvelteApplicationOptions} [context.options] - Rest of options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     */
    constructor(documentCls: object, data?: object, { parent, pack, renderSheet, ...options }?: {
        parent?: object;
        pack?: object;
        renderSheet?: boolean;
        options?: SvelteApplicationOptions[];
    }, dialogData?: TJSDialogOptions);
}

/**
 * Provides a reactive dialog for deleting documents that by default is modal and not draggable. An additional set of
 * accessors for the document assigned are available via the `this.reactive.document`. You may swap out the document at
 * any time by setting it to a different document.
 */
declare class TJSDocumentDelete {
    /**
     * Shows a modal / non-draggable dialog to delete a document.
     *
     * @param {foundry.abstract.Document} document - Document to delete.
     *
     * @param {object} [opts] - Additional context options or dialog positioning options.
     *
     * @param {object} [opts.context] - DocumentModificationContext.
     *
     * @param {...SvelteApplicationOptions} [opts.options] - Rest of options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<foundry.abstract.Document|boolean|null>} The document if deleted or a falsy value; either
     *          'false' for cancelling or 'null' if the user closed the dialog via `<Esc>` or the close header button.
     */
    static show(document: foundry.abstract.Document, { context, ...options }?: {
        context?: object;
        options?: SvelteApplicationOptions[];
    }, dialogData?: TJSDialogOptions): Promise<foundry.abstract.Document | boolean | null>;
    /**
     * @param {foundry.abstract.Document} document - Document to delete.
     *
     * @param {object} [opts] - Additional context options or dialog positioning options.
     *
     * @param {object} [opts.context] - DocumentModificationContext.
     *
     * @param {...SvelteApplicationOptions} [opts.options] - Rest of options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     */
    constructor(document: foundry.abstract.Document, { context, ...options }?: {
        context?: object;
        options?: SvelteApplicationOptions[];
    }, dialogData?: TJSDialogOptions);
}

/**
 * Provides several methods to create documents, folders, and modify them through use of TJSDialog and a modal and
 * non-draggable by default user experience.
 */
declare class TJSDocumentDialog {
    /**
     * Change ownership of a document by rendering a dialog to alter the default and all user / player ownership.
     *
     * @param {foundry.abstract.Document} document - Document instance to modify.
     *
     * @param {SvelteApplicationOptions} [options] - Rest of options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<foundry.abstract.Document|null>} The modified document or 'null' if the user closed the
     *          dialog via `<Esc>` or the close header button.
     */
    static configureOwnership(document: foundry.abstract.Document, options?: SvelteApplicationOptions, dialogData?: TJSDialogOptions): Promise<foundry.abstract.Document | null>;
    /**
     * Create a new Document of the type specified by `documentCls` by rendering a dialog window to provide basic
     * creation details.
     *
     * @param {object} documentCls - Document class to create.
     *
     * @param {object} [data] - Document data.
     *
     * @param {object} [context={}] - Additional context options or dialog positioning options.
     *
     * @param {object} [context.parent] - A parent Document within which these Documents should be embedded.
     *
     * @param {object} [context.pack] - A Compendium pack identifier within which the Documents should be modified.
     *
     * @param {boolean} [context.renderSheet] - Render the sheet for the new document.
     *
     * @param {...SvelteApplicationOptions} [context.options] - Rest of options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<foundry.abstract.Document|null>} The newly created document or a falsy value; either 'false'
     *          for cancelling or 'null' if the user closed the dialog via `<Esc>` or the close header button.
     */
    static documentCreate(documentCls: object, data?: object, { parent, pack, renderSheet, ...options }?: {
        parent?: object;
        pack?: object;
        renderSheet?: boolean;
        options?: SvelteApplicationOptions[];
    }, dialogData?: TJSDialogOptions): Promise<foundry.abstract.Document | null>;
    /**
     * Shows a modal / non-draggable dialog to delete a document.
     *
     * @param {foundry.abstract.Document} document - Document to delete.
     *
     * @param {object} [opts] - Additional context options or dialog positioning options.
     *
     * @param {object} [opts.context] - DocumentModificationContext.
     *
     * @param {...SvelteApplicationOptions} [opts.options] - Rest of options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<foundry.abstract.Document|boolean|null>} The document if deleted or a falsy value; either
     *          'false' for cancelling or 'null' if the user closed the dialog via `<Esc>` or the close header button.
     */
    static documentDelete(document: foundry.abstract.Document, { context, ...options }?: {
        context?: object;
        options?: SvelteApplicationOptions[];
    }, dialogData?: TJSDialogOptions): Promise<foundry.abstract.Document | boolean | null>;
    /**
     * Create a new Folder by rendering a dialog window to provide basic creation details.
     *
     * @param {object} folderData - Initial data with which to populate the creation form.
     *
     * @param {SvelteApplicationOptions} [options] - Options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<globalThis.Folder|null>} The newly created Folder or null if the dialog is closed.
     */
    static folderCreate(folderData: object, options?: SvelteApplicationOptions, dialogData?: TJSDialogOptions): Promise<globalThis.Folder | null>;
    /**
     * Deletes a folder and does delete subfolders / documents.
     *
     * @param {globalThis.Folder} document - Folder to delete.
     *
     * @param {SvelteApplicationOptions} [options] - Options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<globalThis.Folder|boolean|null>} The deleted Folder or a falsy value; either 'false' for cancelling or
     *          'null' if the user closed the dialog via `<Esc>` or the close header button.
     */
    static folderDelete(document: globalThis.Folder, options?: SvelteApplicationOptions, dialogData?: TJSDialogOptions): Promise<globalThis.Folder | boolean | null>;
    /**
     * Shows a modal / non-draggable dialog to export a folder to an eligible compendium pack.
     *
     * @param {globalThis.Folder} document - Folder to export.
     *
     * @param {object} [opts] - Additional options.
     *
     * @param {string} [opts.pack] - The name of the compendium pack to provide an initial selection value in the dialog.
     *
     * @param {boolean} [opts.merge=true] - Update existing entries in the Compendium pack, matching by name
     *
     * @param {boolean} [opts.keepId=true] - Keep document IDs.
     *
     * @param {...SvelteApplicationOptions} [opts.options] - Rest of options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<globalThis.CompendiumCollection|boolean|null>} The compendium collection the folder is exported
     *          to or a falsy value; either 'false' for cancelling or 'null' if the user closed the dialog via `<Esc>`
     *          or the close header button.
     */
    static folderExport(document: globalThis.Folder, { pack, merge, keepId, ...options }?: {
        pack?: string;
        merge?: boolean;
        keepId?: boolean;
        options?: SvelteApplicationOptions[];
    }, dialogData?: TJSDialogOptions): Promise<globalThis.CompendiumCollection | boolean | null>;
    /**
     * Removes a folder, but does not delete / remove sub-folders / documents.
     *
     * @param {globalThis.Folder} document - Folder to remove.
     *
     * @param {SvelteApplicationOptions} [options] - Options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<globalThis.Folder|boolean|null>} The removed Folder or a falsy value; either 'false' for
     *          cancelling or 'null' if the user closed the dialog via `<Esc>` or the close header button.
     */
    static folderRemove(document: globalThis.Folder, options?: SvelteApplicationOptions, dialogData?: TJSDialogOptions): Promise<globalThis.Folder | boolean | null>;
    /**
     * Create a RollTable from the contents of the Folder.
     *
     * @param {globalThis.Folder} document - Folder to create roll table from...
     *
     * @param {SvelteApplicationOptions} [options] - Options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<globalThis.RollTable|boolean|null>} The newly created RollTable or a falsy value; either
     *          'false' for cancelling or 'null' if the user closed the dialog via `<Esc>` or the close header button.
     */
    static folderRolltable(document: globalThis.Folder, options?: SvelteApplicationOptions, dialogData?: TJSDialogOptions): Promise<globalThis.RollTable | boolean | null>;
    /**
     * Updates an existing Folder by rendering a dialog window with basic details.
     *
     * @param {globalThis.Folder} document - The folder to edit.
     *
     * @param {SvelteApplicationOptions} [options] - Options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<globalThis.Folder|null>} The modified Folder or null if the dialog is closed.
     */
    static folderUpdate(document: globalThis.Folder, options?: SvelteApplicationOptions, dialogData?: TJSDialogOptions): Promise<globalThis.Folder | null>;
    /**
     * Render an import dialog for updating the data related to this Document through an exported JSON file
     *
     * @param {foundry.abstract.Document} document - The document to import JSON to...
     *
     * @param {SvelteApplicationOptions} [options] - Options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<foundry.abstract.Document|boolean|null>} The document after import completes or a falsy value;
     *          either 'false' for cancelling or 'null' if the user closed the dialog via `<Esc>` or the close header button.
     */
    static importFromJSON(document: foundry.abstract.Document, options?: SvelteApplicationOptions, dialogData?: TJSDialogOptions): Promise<foundry.abstract.Document | boolean | null>;
}

/**
 * Provides a reactive dialog for importing documents that by default is modal and not draggable. An additional set of
 * accessors for the document assigned are available via the `this.reactive.document`. You may swap out the document at
 * any time by setting it to a different document.
 */
declare class TJSDocumentImport {
    /**
     * Render an import dialog for updating the data related to this Document through an exported JSON file
     *
     * @param {foundry.abstract.Document} document - The document to import JSON to...
     *
     * @param {SvelteApplicationOptions} [options] - Options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<foundry.abstract.Document|boolean|null>} The document after import completes or a falsy value;
     *          either 'false' for cancelling or 'null' if the user closed the dialog via `<Esc>` or the close header
     *          button.
     */
    static show(document: foundry.abstract.Document, options?: SvelteApplicationOptions, dialogData?: TJSDialogOptions): Promise<foundry.abstract.Document | boolean | null>;
    /**
     * Render an import dialog for updating the data related to this Document through an exported JSON file
     *
     * @param {foundry.abstract.Document} document - The document to import JSON to...
     *
     * @param {SvelteApplicationOptions} [options] - Options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     */
    constructor(document: foundry.abstract.Document, options?: SvelteApplicationOptions, dialogData?: TJSDialogOptions);
}

/**
 * Provides a reactive dialog for permission control that by default is modal and not draggable. An additional set of
 * accessors for the document assigned are available via the `this.reactive.document`. You may swap out the document at
 * any time by setting it to a different document.
 */
declare class TJSDocumentOwnership {
    /**
     * Change permissions of a document by rendering a dialog to alter the default and all user / player permissions.
     *
     * @param {foundry.abstract.Document} document - Document instance to modify.
     *
     * @param {SvelteApplicationOptions} [options] - Rest of options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<foundry.abstract.Document|null>} The modified document or 'null' if the user closed the dialog
     *          via `<Esc>` or the close header button.
     */
    static show(document: foundry.abstract.Document, options?: SvelteApplicationOptions, dialogData?: TJSDialogOptions): Promise<foundry.abstract.Document | null>;
    /**
     * @param {foundry.abstract.Document} document - Document instance to modify.
     *
     * @param {SvelteApplicationOptions} [options] - Rest of options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     */
    constructor(document: foundry.abstract.Document, options?: SvelteApplicationOptions, dialogData?: TJSDialogOptions);
}

/**
 * Provides a reactive dialog for modifying folders that by default is modal and not draggable. An additional set of
 * accessors for the folder assigned are available via the `this.reactive.document`. You may swap out the folder at
 * any time by setting it to a different folder document.
 */
declare class TJSFolderCreateUpdate {
    /**
     * Create a new Folder by rendering a dialog window to provide basic creation details.
     *
     * @param {object} folderData - Initial data with which to populate the creation form.
     *
     * @param {object} [options] - Options to pass to TJSDialog / Application.
     *
     * @param {object} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<globalThis.Folder|null>} The newly created Folder or null if the dialog is closed.
     */
    static showCreate(folderData: object, options?: object, dialogData?: object): Promise<globalThis.Folder | null>;
    /**
     * Updates an existing Folder by rendering a dialog window with basic details.
     *
     * @param {globalThis.Folder} document - The folder to edit.
     *
     * @param {object} [options] - Options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<globalThis.Folder|null>} The modified Folder or null if the dialog is closed.
     */
    static showUpdate(document: globalThis.Folder, options?: object, dialogData?: TJSDialogOptions): Promise<globalThis.Folder | null>;
    /**
     * Updates an existing Folder by rendering a dialog window with basic details.
     *
     * @param {globalThis.Folder} document - The folder to edit.
     *
     * @param {object} [options] - Options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     */
    constructor(document: globalThis.Folder, options?: object, dialogData?: TJSDialogOptions);
}

/**
 * Provides a reactive dialog for deleting a folder that by default is modal and not draggable. An additional set of
 * accessors for the folder assigned are available via the `this.reactive.document`. You may swap out the folder at any
 * time by setting it to a different folder document.
 */
declare class TJSFolderDelete {
    /**
     * Deletes a folder and does delete sub-folders / documents.
     *
     * @param {globalThis.Folder} document - Folder to delete.
     *
     * @param {SvelteApplicationOptions} [options] - Options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<globalThis.Folder|boolean|null>} The deleted Folder or a falsy value; either 'false' for
     *          cancelling or 'null' if the user closed the dialog via `<Esc>` or the close header button.
     */
    static show(document: globalThis.Folder, options?: SvelteApplicationOptions, dialogData?: TJSDialogOptions): Promise<globalThis.Folder | boolean | null>;
    /**
     * Deletes a folder and does delete sub-folders / documents.
     *
     * @param {globalThis.Folder} document - Folder to delete.
     *
     * @param {SvelteApplicationOptions} [options] - Options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     */
    constructor(document: globalThis.Folder, options?: SvelteApplicationOptions, dialogData?: TJSDialogOptions);
}

/**
 * Provides a reactive dialog for exporting folders to a compendium that by default is modal and not draggable.
 */
declare class TJSFolderExport {
    /**
     * Shows a modal / non-draggable dialog to export a folder to an eligible compendium pack.
     *
     * @param {globalThis.Folder} document - Folder to export.
     *
     * @param {object} [opts] - Additional options.
     *
     * @param {string} [opts.pack] - The name of the compendium pack to provide an initial selection value in the dialog.
     *
     * @param {boolean} [opts.merge=true] - Update existing entries in the Compendium pack, matching by name
     *
     * @param {boolean} [opts.keepId=true] - Keep document IDs.
     *
     * @param {...SvelteApplicationOptions} [opts.options] - Rest of options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<globalThis.CompendiumCollection|boolean|null>} The compendium collection the folder is exported
     *          to or a falsy value; either 'false' for cancelling or 'null' if the user closed the dialog via `<Esc>`
     *          or the close header button.
     */
    static show(document: globalThis.Folder, { pack, merge, keepId, ...options }?: {
        pack?: string;
        merge?: boolean;
        keepId?: boolean;
        options?: SvelteApplicationOptions[];
    }, dialogData?: TJSDialogOptions): Promise<globalThis.CompendiumCollection | boolean | null>;
    /**
     * Shows a modal / non-draggable dialog to export a folder to an eligible compendium pack.
     *
     * @param {globalThis.Folder} document - Folder to export.
     *
     * @param {object} [opts] - Additional options.
     *
     * @param {string} [opts.pack] - The name of the compendium pack to provide an initial selection value in the dialog.
     *
     * @param {boolean} [opts.merge=true] - Update existing entries in the Compendium pack, matching by name
     *
     * @param {boolean} [opts.keepId=true] - Keep document IDs.
     *
     * @param {...SvelteApplicationOptions} [opts.options] - Rest of options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<globalThis.CompendiumCollection|boolean|null>} The compendium collection the folder is exported
     *          to or a falsy value; either 'false' for cancelling or 'null' if the user closed the dialog via `<Esc>`
     *          or the close header button.
     */
    constructor(document: globalThis.Folder, { pack, merge, keepId, ...options }?: {
        pack?: string;
        merge?: boolean;
        keepId?: boolean;
        options?: SvelteApplicationOptions[];
    }, dialogData?: TJSDialogOptions);
    data: any;
}

/**
 * Provides a reactive dialog for removing a folder that by default is modal and not draggable. An additional set of
 * accessors for the folder assigned are available via the `this.reactive.document`. You may swap out the folder at any
 * time by setting it to a different folder document.
 */
declare class TJSFolderRemove {
    /**
     * Removes a folder, but does not delete / remove subfolders / documents.
     *
     * @param {globalThis.Folder} document - Folder to remove.
     *
     * @param {SvelteApplicationOptions} [options] - Options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<globalThis.Folder|boolean|null>} The removed Folder or a falsy value; either 'false' for
     *          cancelling or 'null' if the user closed the dialog via `<Esc>` or the close header button.
     */
    static show(document: globalThis.Folder, options?: SvelteApplicationOptions, dialogData?: TJSDialogOptions): Promise<globalThis.Folder | boolean | null>;
    /**
     * @param {globalThis.Folder} document - Folder to remove.
     *
     * @param {SvelteApplicationOptions} [options] - Options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     */
    constructor(document: globalThis.Folder, options?: SvelteApplicationOptions, dialogData?: TJSDialogOptions);
}

/**
 * Provides a reactive dialog for creating a RollTable from a folder that by default is modal and not draggable. An
 * additional set of accessors for the folder assigned are available via the `this.reactive.document`. You may swap out
 * the folder at any time by setting it to a different folder document.
 */
declare class TJSFolderRolltable {
    /**
     * Create a RollTable from the contents of the Folder.
     *
     * @param {globalThis.Folder} document - Folder to create roll table from...
     *
     * @param {SvelteApplicationOptions} [options] - Options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     *
     * @returns {Promise<globalThis.RollTable|boolean|null>} The newly created RollTable or a falsy value; either
     *          'false' for cancelling or 'null' if the user closed the dialog via `<Esc>` or the close header button.
     */
    static show(document: globalThis.Folder, options?: SvelteApplicationOptions, dialogData?: TJSDialogOptions): Promise<globalThis.RollTable | boolean | null>;
    /**
     * @param {globalThis.Folder} document - Folder to create roll table from...
     *
     * @param {SvelteApplicationOptions} [options] - Options to pass to TJSDialog / Application.
     *
     * @param {TJSDialogOptions} [dialogData] - Optional data to modify dialog.
     */
    constructor(document: globalThis.Folder, options?: SvelteApplicationOptions, dialogData?: TJSDialogOptions);
}

export { TJSDocumentCreate, TJSDocumentDelete, TJSDocumentDialog, TJSDocumentImport, TJSDocumentOwnership, TJSFolderCreateUpdate, TJSFolderDelete, TJSFolderExport, TJSFolderRemove, TJSFolderRolltable };
