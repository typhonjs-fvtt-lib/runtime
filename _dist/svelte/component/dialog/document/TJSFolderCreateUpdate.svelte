<script>
   import { getContext }   from 'svelte';

   import {
      localize,
      radioBoxes }         from '@typhonjs-fvtt/runtime/svelte/helper';

   import { TJSDocument }  from '@typhonjs-fvtt/runtime/svelte/store';

   export let document = void 0;

   const s_REGEX_HEX_COLOR = /^#(?:[0-9a-fA-F]{3}){1,2}$/;

   const { application } = getContext('external');

   if (!(document instanceof Folder))
   {
      throw new TypeError(`TJSFolderCreateUpdate error: 'document' is not an instance of Folder.`);
   }

   const doc = new TJSDocument(document, { delete: application.close.bind(application) });
   const newName = localize('DOCUMENT.New', { type: localize(Folder.metadata.label) });
   const sortingModes = { a: 'FOLDER.SortAlphabetical', m: 'FOLDER.SortManual' };

   let form;

   let name = document?.id ? document.name : '';
   let color = document?.data?.color;

   let colorText = '';

   $: if ($doc !== document)
   {
      if (!(document instanceof Folder))
      {
         throw new TypeError(`TJSFolderCreateUpdate error: 'document' is not an instance of Folder.`);
      }

      doc.set(document);

      name = document?.id ? document.name : '';
      color = document?.data?.color;

      // Update the dialog button label and title.
      application.data.merge({
         buttons: {
            submit: {
               label: localize(document?.id ? 'FOLDER.Update' : 'FOLDER.Create')
            }
         },
         title: document?.id ? `${localize('FOLDER.Update')}: ${document.name}` : localize('FOLDER.Create')
      });
   }

   // Reactive block to test color and if it is not a valid hex color then reset colorText and set color to black.
   $: if (s_REGEX_HEX_COLOR.test(color))
   {
      colorText = color;
   }
   else
   {
      colorText = null;
      color = '#000000'
   }

   export function requestSubmit()
   {
      form.requestSubmit();
   }

   /**
    * Saves any form data / changes to document.
    *
    * @returns {Promise<void>}
    */
   async function saveData(event)
   {
      const formData = new FormDataExtended(event.target).toObject();

      if (!formData.parent) { formData.parent = null; }

      let modifiedDoc = document;

      if (document.id)
      {
         await document.update(formData);
      }
      else
      {
         document.data.update(formData);
         modifiedDoc = await Folder.create(document.data);
      }

      application.options.resolve?.(modifiedDoc);
      application.close();
   }
</script>

<svelte:options accessors={true}/>

<form bind:this={form} on:submit|preventDefault={saveData} id=folder-create autocomplete=off>
   <input type=hidden name=type value={document.data.type}/>
   <input type=hidden name=parent value={document.data.parent}/>

   <div class=form-group>
      <label>{localize('FOLDER.Name')}</label>
      <div class=form-fields>
         <input type=text name=name placeholder={newName} value={name} required/>
      </div>
   </div>

   <div class=form-group>
      <label>{localize('FOLDER.Color')}</label>
      <div class=form-fields>
         <input type=text name=color bind:value={colorText} readonly />
         <input type=color bind:value={color} data-edit=color />
         <button type=button on:click={() => color = null}><i class="fas fa-trash-restore"></i></button>
      </div>
   </div>

   <div class=form-group>
      <label>{localize('FOLDER.SortMode')}</label>
      <div class=form-fields>
         {@html radioBoxes('sorting', sortingModes, { checked: document.data.sorting, localize: true })}
      </div>
   </div>
</form>
