import initOembed_v5 from '@typhonjs-tinymce/oembed/v5/plugin';
import initOembed_v6 from '@typhonjs-tinymce/oembed/v6/plugin';

let MCE_OEMBED_PLUGIN_INITIALIZED = false;

if (!MCE_OEMBED_PLUGIN_INITIALIZED)
{
   MCE_OEMBED_PLUGIN_INITIALIZED = true;

   /**
    * Handle loading the TyphonJS oEmbed TinyMCE plugin based on Foundry version.
    *
    * v9 of Foundry ships with TinyMCE v5.
    * v10 of Foundry ships with TinyMCE v6.
    */
   Hooks.once('init', async () =>
   {
      const isV10 = !foundry.utils.isNewerVersion(10, game.version ?? game?.data?.version);

      try
      {
         if (isV10)
         {
            // Load oEmbed TinyMCE v6 plugin.
            initOembed_v6();
         }
         else
         {
            // Load oEmbed TinyMCE v5 plugin.
            initOembed_v5();
         }
      }
      catch (err)
      {
         console.warn(`TyphonJS Runtime Library warning: Failed to load TyphonJS oEmbed plugin.`);
      }
   });
}