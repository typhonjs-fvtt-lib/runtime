import { externalPathsLib } from '../local/externalPathsLib.js';

export const externalPathsRemote = {
   ...externalPathsLib,

   // runtime-base mapping:
   '@typhonjs-fvtt/runtime/data/color/colord': '/modules/typhonjs/remote/data/color/colord.js',
   '@typhonjs-fvtt/runtime/data/compress': '/modules/typhonjs/remote/data/compress.js',
   '@typhonjs-fvtt/runtime/data/format/base64': '/modules/typhonjs/remote/data/format/base64.js',
   '@typhonjs-fvtt/runtime/data/format/json5': '/modules/typhonjs/remote/data/format/json5.js',
   '@typhonjs-fvtt/runtime/data/format/msgpack': '/modules/typhonjs/remote/data/format/msgpack.js',
   '@typhonjs-fvtt/runtime/data/format/msgpack/compress': '/modules/typhonjs/remote/data/format/msgpack/compress.js',
   '@typhonjs-fvtt/runtime/data/format/unicode': '/modules/typhonjs/remote/data/format/unicode.js',
   '@typhonjs-fvtt/runtime/data/struct/cache/quick-lru': '/modules/typhonjs/remote/data/struct/cache/quick-lru.js',
   '@typhonjs-fvtt/runtime/data/struct/hash/array': '/modules/typhonjs/remote/data/struct/hash/array.js',
   '@typhonjs-fvtt/runtime/data/struct/search/trie': '/modules/typhonjs/remote/data/struct/search/trie.js',
   '@typhonjs-fvtt/runtime/data/struct/search/trie/query': '/modules/typhonjs/remote/data/struct/search/trie/query.js',
   '@typhonjs-fvtt/runtime/math/gl-matrix': '/modules/typhonjs/remote/math/gl-matrix.js',
   '@typhonjs-fvtt/runtime/math/interpolate': '/modules/typhonjs/remote/math/interpolate.js',
   '@typhonjs-fvtt/runtime/math/physics': '/modules/typhonjs/remote/math/physics.js',
   '@typhonjs-fvtt/runtime/math/util': '/modules/typhonjs/remote/math/util.js',
   '@typhonjs-fvtt/runtime/plugin/manager': '/modules/typhonjs/remote/plugin/manager.js',
   '@typhonjs-fvtt/runtime/plugin/manager/eventbus': '/modules/typhonjs/remote/plugin/manager/eventbus.js',
   '@typhonjs-fvtt/runtime/plugin/manager/eventbus/buses': '/modules/typhonjs/remote/plugin/manager/eventbus/buses.js',
   '@typhonjs-fvtt/runtime/svelte/action/animate': '/modules/typhonjs/remote/svelte/action/animate.js',
   '@typhonjs-fvtt/runtime/svelte/action/dom': '/modules/typhonjs/remote/svelte/action/dom.js',
   '@typhonjs-fvtt/runtime/svelte/action/util': '/modules/typhonjs/remote/svelte/action/util.js',
   '@typhonjs-fvtt/runtime/svelte/animate': '/modules/typhonjs/remote/svelte/animate.js',
   '@typhonjs-fvtt/runtime/svelte/store/dom': '/modules/typhonjs/remote/svelte/store/dom.js',
   '@typhonjs-fvtt/runtime/svelte/store/position': '/modules/typhonjs/remote/svelte/store/position.js',
   '@typhonjs-fvtt/runtime/svelte/store/reducer': '/modules/typhonjs/remote/svelte/store/reducer.js',
   '@typhonjs-fvtt/runtime/svelte/store/reducer/array-object': '/modules/typhonjs/remote/svelte/store/reducer/array-object.js',
   '@typhonjs-fvtt/runtime/svelte/store/web-storage': '/modules/typhonjs/remote/svelte/store/web-storage.js',
   '@typhonjs-fvtt/runtime/svelte/store/web-storage/msgpack': '/modules/typhonjs/remote/svelte/store/web-storage/msgpack.js',
   '@typhonjs-fvtt/runtime/svelte/store/writable-derived': '/modules/typhonjs/remote/svelte/store/writable-derived.js',
   '@typhonjs-fvtt/runtime/svelte/transition': '/modules/typhonjs/remote/svelte/transition.js',
   '@typhonjs-fvtt/runtime/svelte/util': '/modules/typhonjs/remote/svelte/util.js',
   '@typhonjs-fvtt/runtime/util': '/modules/typhonjs/remote/util.js',
   '@typhonjs-fvtt/runtime/util/animate': '/modules/typhonjs/remote/util/animate.js',
   '@typhonjs-fvtt/runtime/util/async': '/modules/typhonjs/remote/util/async.js',
   '@typhonjs-fvtt/runtime/util/browser': '/modules/typhonjs/remote/util/browser.js',
   '@typhonjs-fvtt/runtime/util/object': '/modules/typhonjs/remote/util/object.js',
   '@typhonjs-fvtt/runtime/util/store': '/modules/typhonjs/remote/util/store.js',

   // typhonjs-fvtt/svelte mapping:
   '@typhonjs-fvtt/runtime/svelte/application': '/modules/typhonjs/remote/svelte/application.js',
   '@typhonjs-fvtt/runtime/svelte/application/legacy': '/modules/typhonjs/remote/svelte/application/legacy.js',
   '@typhonjs-fvtt/runtime/svelte/component/core': '/modules/typhonjs/remote/svelte/component/core.js',
   '@typhonjs-fvtt/runtime/svelte/component/internal': '/modules/typhonjs/remote/svelte/component/internal.js',
   '@typhonjs-fvtt/runtime/svelte/gsap': '/modules/typhonjs/remote/svelte/gsap.js',
    // Note: `@typhonjs-fvtt/runtime/svelte/gsap/plugin` and `plugin/bonus` are compiled into end user package and not in the library.
   '@typhonjs-fvtt/runtime/svelte/helper': '/modules/typhonjs/remote/svelte/helper.js',
   '@typhonjs-fvtt/runtime/svelte/internal': '/modules/typhonjs/remote/svelte/internal.js',
   '@typhonjs-fvtt/runtime/svelte/store/fvtt': '/modules/typhonjs/remote/svelte/store/fvtt.js',
   '@typhonjs-fvtt/runtime/svelte/store/fvtt/document': '/modules/typhonjs/remote/svelte/store/fvtt/document.js',
   '@typhonjs-fvtt/runtime/svelte/store/fvtt/settings': '/modules/typhonjs/remote/svelte/store/fvtt/settings.js',
   '@typhonjs-fvtt/runtime/svelte/store/fvtt/settings/world': '/modules/typhonjs/remote/svelte/store/fvtt/settings/world.js',

   '@typhonjs-fvtt/runtime/security/client/dompurify': '/modules/typhonjs/remote/security/client/dompurify.js',

   '@typhonjs-fvtt/runtime/tinymce': '/modules/typhonjs/remote/tinymce/initializePlugins.js'
}
