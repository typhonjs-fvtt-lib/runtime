<script>
   import { getContext }      from 'svelte';

   import { localize }        from '@typhonjs-fvtt/runtime/svelte/helper';

   import { TJSDocument }     from '@typhonjs-fvtt/runtime/svelte/store';

   export let document = void 0;

   export let packName;
   export let merge;
   export let keepId;

   let selected;

   $: packName = typeof packName === 'string' ? packName : void 0;
   $: merge = typeof merge === 'boolean' ? merge : true;
   $: keepId = typeof keepId === 'boolean' ? keepId : true;

   const { application } = getContext('external');

   if (!(document instanceof Folder))
   {
      throw new TypeError(`TJSFolderExport error: 'document' is not an instance of Folder.`);
   }

   const doc = new TJSDocument(document, { delete: application.close.bind(application) });

   // Get eligible pack destinations
   let packs = game.packs.filter(p => (p.documentName === document.type) && !p.locked);
   if (!packs.length)
   {
      ui.notifications.warn(localize('FOLDER.ExportWarningNone', { type: document.type }));
      application.options.resolve?.(null);
      application.close();
   }

   selected = packs[0].metadata.name;

   // Configure any default pack by ID search.
   for (const pack of packs)
   {
      if (pack.title === packName) { selected = pack.metadata.name; }
   }

   $:
   {
      // Update the title if document name changes
      application.data.set('title', `${localize('FOLDER.ExportTitle')}: ${$doc.name}`);
   }

   /**
    * Export folder documents to compendium.
    *
    * @returns {Promise<CompendiumCollection|boolean>}
    */
   export async function exportData()
   {
      // Find the pack; maybe it has been deleted or locked
      const pack = game.packs.find((p) => (p?.metadata?.package === 'world') && (p?.metadata?.name === selected));

      if (pack instanceof CompendiumCollection && !pack?.locked)
      {
         await document.exportToCompendium(pack, {
            updateByName: merge,
            keepId
         });

         application.options.resolve?.(pack);
      }
      else
      {
         application.options.resolve?.(false);
      }

      application.close();
   }
</script>

<svelte:options accessors={true}/>

<form on:submit|preventDefault={exportData} autocomplete=off>
    <p class=notes>{localize('FOLDER.ExportHint')}</p>
    <div class=form-group>
        <label>{localize('FOLDER.ExportDestination')}</label>
        <select name=pack bind:value={selected}>
            {#each packs as pack (pack.id)}
                <option value={pack.metadata.name}>{pack.title}</option>
            {/each}
        </select>
    </div>
    <div class=form-group>
        <label>{localize('FOLDER.ExportMerge')}</label>
        <input type=checkbox name=merge bind:checked={merge}/>
    </div>
    <div class=form-group>
        <label>{localize('FOLDER.ExportKeepId')}</label>
        <input type=checkbox name=keepId bind:checked={keepId}/>
    </div>
</form>
