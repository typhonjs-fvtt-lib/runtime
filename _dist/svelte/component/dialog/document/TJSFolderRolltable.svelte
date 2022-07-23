<script>
   import { getContext }      from 'svelte';

   import { localize }        from '@typhonjs-fvtt/runtime/svelte/helper';
   import { TJSDocument }     from '@typhonjs-fvtt/runtime/svelte/store';

   export let document = void 0;

   const { application } = getContext('external');

   if (!(document instanceof Folder))
   {
      throw new TypeError(`TJSFolderRolltable error: 'document' is not an instance of Folder.`);
   }

   const doc = new TJSDocument(document, { delete: application.close.bind(application) });

   $: if ($doc !== document)
   {
      if (!(document instanceof Folder))
      {
         throw new TypeError(`TJSFolderRolltable error: 'document' is not an instance of Folder.`);
      }

      doc.set(document);

      application.data.set('title', `${localize('FOLDER.CreateTable')}: ${document.name}`);
   }

   /**
    * Creates roll table from folder documents.
    *
    * @returns {Promise<RollTable>}
    */
   export async function createTable()
   {
      const rollTable = await RollTable.fromFolder(document);

      application.options.resolve?.(rollTable);
      application.close();
   }
</script>

<svelte:options accessors={true}/>

{localize('FOLDER.CreateTableConfirm')}
