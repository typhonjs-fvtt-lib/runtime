let initialized = false;

function initializePlugins()
{
   if (!initialized)
   {
      initialized = true;
      import('./oembed-c9541dff.js');
   }
}

export { initializePlugins };
