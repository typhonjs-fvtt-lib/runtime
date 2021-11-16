let initialized = false;

export function initializePlugins()
{
   if (!initialized)
   {
      initialized = true;
      import('./oembed.js');
   }
}