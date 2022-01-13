import { DOMPurify as DOMPurifyImpl } from '@typhonjs-fvtt/runtime/dompurify';

export class DOMPurify
{
   static sanitize(dirty)
   {
      return DOMPurifyImpl.sanitize(dirty);
   }

   static sanitizeWithVideo(dirty)
   {
      return DOMPurifyImpl.sanitizeWithVideo(dirty);
   }

   static onPluginLoad(ev)
   {
      const opts = { guard: true };

      const prepend = typeof ev?.pluginOptions?.eventPrepend === 'string' ? `${ev.pluginOptions.eventPrepend}:` : '';

      ev.eventbus.on(`${prepend}dompurify:sanitize`, this.sanitize, this, opts);
      ev.eventbus.on(`${prepend}dompurify:sanitize:video`, this.sanitizeWithVideo, this, opts);
   }
}