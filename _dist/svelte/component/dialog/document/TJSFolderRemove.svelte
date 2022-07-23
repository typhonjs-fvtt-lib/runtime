<script>
   import { getContext }    from 'svelte';

   import { localize }      from '@typhonjs-fvtt/runtime/svelte/helper';
   import { TJSDocument }   from '@typhonjs-fvtt/runtime/svelte/store';

   export let document = void 0;

   const { application } = getContext('external');

   if (!(document instanceof Folder))
   {
      throw new TypeError(`TJSFolderRemove error: 'document' is not an instance of Folder.`);
   }

   const doc = new TJSDocument(document, { delete: application.close.bind(application) });

   $: if ($doc !== document)
   {
      if (!(document instanceof Folder))
      {
         throw new TypeError(`TJSFolderRemove error: 'document' is not an instance of Folder.`);
      }

      doc.set(document);

      application.data.set('title', `${localize('FOLDER.Remove')}: ${document.name}`);
   }

   /**
    * Removes a folder without deleting documents.
    *
    * @returns {Promise<Folder>}
    */
   export async function removeFolder()
   {
      // Remove the delete Document function callback as we are intentionally deleting below.
      doc.setOptions({ delete: void 0 });

      const folder = await document.delete({ deleteSubfolders: false, deleteContents: false });

      application.options.resolve?.(folder);
      application.close();
   }
</script>

<svelte:options accessors={true}/>

<h4>{localize('AreYouSure')}</h4>
<p>{localize('FOLDER.RemoveWarning')}</p>
