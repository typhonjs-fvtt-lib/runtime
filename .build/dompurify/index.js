import DOMPurify from '../../node_modules/dompurify/dist/purify.es.mjs';

// Only allow YouTube and Vimeo embeds through.
const s_REGEX_DOMPURIFY = new RegExp('^(https://www.youtube.com/embed/|https://player.vimeo.com/)');

// When 'iframes' are allowed only accept ones where 'src' starts with a YouTube embed link; reject all others.
DOMPurify.addHook('uponSanitizeElement', (node, data) =>
{
   if (data.tagName === 'iframe')
   {
      const src = node.getAttribute('src') || '';
      if (!s_REGEX_DOMPURIFY.test(src))
      {
         return node.parentNode.removeChild(node);
      }
   }
});

/**
 * Provides a sanitize method that allows 'iframe' but only with sources from YouTube and Vimeo.
 *
 * @param {string | Node}   dirty - The content to sanitize.
 *
 * @returns {any}
 */
DOMPurify.sanitizeWithVideo = (dirty) =>
{
   return DOMPurify.sanitize(dirty, {
      ADD_TAGS: ['iframe'],
      ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
      CUSTOM_ELEMENT_HANDLING: {
         tagNameCheck: /^wc-/,                  // all custom element tags starting w/ `wc-`.
         attributeNameCheck: () => true,        // allow all attributes.
         allowCustomizedBuiltInElements: true   // allow customized built-ins.
      },
      // Note: FORCE_BODY allows 'style' tags to be entered into TinyMCE code editor.
      FORCE_BODY: true
   });
};

export { DOMPurify };
