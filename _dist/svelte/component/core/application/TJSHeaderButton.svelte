<script>
   /**
    * Provides an app header button conforming to the Foundry {@link ApplicationHeaderButton} type. Additionally a
    * `title` field is supported to give a tool tip for the button. The `onclick` function if defined is invoked when
    * the button is clicked and state is updated accordingly.
    */
   import { applyStyles }   from '@typhonjs-fvtt/runtime/svelte/action';
   import { localize }      from '@typhonjs-fvtt/runtime/svelte/helper';

   export let button;

   const s_REGEX_HTML = /^\s*<.*>$/;

   let icon, label, title, styles

   $: if (button)
   {
      title = typeof button.title === 'string' ? localize(button.title) : '';

      // Handle icon and treat bare strings as the icon class; otherwise assume the icon is fully formed HTML.
      icon = typeof button.icon !== 'string' ? void 0 : s_REGEX_HTML.test(button.icon) ? button.icon :
       `<i class="${button.icon}" title="${title}"></i>`;

      label = typeof button.label === 'string' ? localize(button.label) : '';

      styles = typeof button.styles === 'object' ? button.styles : void 0;
   }

   function onClick(event)
   {
      // Accept either callback or onclick as the function / data to invoke.
      const invoke = button.callback ?? button.onclick;

      if (typeof invoke === 'function')
      {
         invoke.call(button, event);
         button = button; // This provides a reactive update if button data changes.
      }
   }

</script>

<svelte:options accessors={true}/>

<!-- Need to capture pointerdown / dblclick to prevent further action by TJSApplicationHeader -->
<a on:click|capture|preventDefault|stopPropagation={onClick}
   on:pointerdown|capture|preventDefault|stopPropagation={()=>null}
   on:mousedown|capture|preventDefault|stopPropagation={()=>null}
   on:dblclick|capture|preventDefault|stopPropagation={()=>null}
   use:applyStyles={styles}
   class="header-button {button.class}">
    {@html icon}{label}
</a>
