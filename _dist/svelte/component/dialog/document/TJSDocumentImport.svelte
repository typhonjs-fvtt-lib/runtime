<script>
   import { getContext }   from 'svelte';

   import { localize }     from '@typhonjs-fvtt/runtime/svelte/helper';
   import { TJSDocument }  from '@typhonjs-fvtt/runtime/svelte/store';

   /** @type {foundry.abstract.Document} */
   export let document = void 0;

   const { application } = getContext('external');

   if (!(document instanceof foundry.abstract.Document))
   {
      throw new TypeError(`TJSDocumentImport error: 'document' is not an instance of Document.`);
   }

   const doc = new TJSDocument(document, { delete: application.close.bind(application) });

   let form;

   let hint1 = localize('DOCUMENT.ImportDataHint1', { document: document.documentName });
   let hint2 = localize('DOCUMENT.ImportDataHint2', { name: document.name });

   $: if ($doc !== document)
   {
      if (!(document instanceof foundry.abstract.Document))
      {
         throw new TypeError(`TJSDocumentImport error: 'document' is not an instance of Document.`);
      }

      doc.set(document);

      hint1 = localize('DOCUMENT.ImportDataHint1', { document: document.documentName });
      hint2 = localize('DOCUMENT.ImportDataHint2', { name: document.name });

      application.data.set('title', `${localize('DOCUMENT.ImportData')}: ${document.name}`);
   }

   async function handleImport()
   {
      if (!form.data.files.length) { return ui.notifications.error('You did not upload a data file!'); }

      const json = await readTextFromFile(form.data.files[0]);

      const importedDoc = await document.importFromJSON(json);

      application.options.resolve?.(importedDoc);
      application.close();
   }

   export function requestSubmit()
   {
      form.requestSubmit();
   }
</script>

<svelte:options accessors={true}/>

<form bind:this={form} on:submit|preventDefault={handleImport} autocomplete=off>
    <p class=notes>{hint1}</p>
    <p class=notes>{hint2}</p>
    <div class=form-group>
        <label for=data>{localize('DOCUMENT.ImportSource')}</label>
        <input type=file id=data required />
    </div>
</form>
