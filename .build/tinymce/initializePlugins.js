let initialized = false;

/**
 * Initializes and loads TinyMCE plugins once upon invocation.
 */
export function initializePlugins()
{
   if (!initialized)
   {
      initialized = true;
      import('./oembed.js');
   }
}