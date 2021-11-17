import{SvelteComponent as t,init as n,safe_not_equal as i,flush as e,empty as o,insert as s,group_outros as r,transition_out as a,check_outros as l,transition_in as c,detach as u,element as p,attr as d,noop as $,create_component as f,mount_component as h,get_spread_update as m,get_spread_object as g,destroy_component as y,destroy_each as T,assign as O,create_slot as b,listen as x,update_slot_base as v,get_all_dirty_from_scope as w,get_slot_changes as j,add_render_callback as z,create_in_transition as I,create_out_transition as C,binding_callbacks as A,text as R,append as k,set_data as E,space as D,action_destroyer as N,is_function as L,run_all as M,component_subscribe as P,add_resize_listener as H,null_to_empty as _,set_style as S,create_bidirectional_transition as U,globals as X,current_component as W,HtmlTag as q,stop_propagation as B,prevent_default as F,update_keyed_each as G,destroy_block as Y,bind as J,add_flush_callback as Q,get_current_component as K}from"/modules/typhonjs/svelte/internal.js";import{s_DEFAULT_TRANSITION as V,s_DEFAULT_TRANSITION_OPTIONS as Z,slideFade as tt}from"/modules/typhonjs/svelte/transition.js";import{draggable as nt}from"/modules/typhonjs/svelte/action.js";import{localize as it}from"/modules/typhonjs/svelte/helper.js";import{outroAndDestroy as et,isSvelteComponent as ot,parseSvelteConfig as st}from"/modules/typhonjs/svelte/util.js";import{fade as rt}from"/modules/typhonjs/svelte/transition.js";function at(t,n){K().$$.context.set(t,n)}function lt(t){return K().$$.context.get(t)}function ct(t,n,i){const e=t.slice();return e[2]=n[i],e}function ut(t){let n;return{c(){n=p("p"),n.textContent="Container warning: No children.",d(n,"class","svelte-1s361pr")},m(t,i){s(t,n,i)},p:$,i:$,o:$,d(t){t&&u(n)}}}function pt(t){let n,i,e=t[1],p=[];for(let n=0;n<e.length;n+=1)p[n]=dt(ct(t,e,n));const d=t=>a(p[t],1,1,(()=>{p[t]=null}));return{c(){for(let t=0;t<p.length;t+=1)p[t].c();n=o()},m(t,e){for(let n=0;n<p.length;n+=1)p[n].m(t,e);s(t,n,e),i=!0},p(t,i){if(2&i){let o;for(e=t[1],o=0;o<e.length;o+=1){const s=ct(t,e,o);p[o]?(p[o].p(s,i),c(p[o],1)):(p[o]=dt(s),p[o].c(),c(p[o],1),p[o].m(n.parentNode,n))}for(r(),o=e.length;o<p.length;o+=1)d(o);l()}},i(t){if(!i){for(let t=0;t<e.length;t+=1)c(p[t]);i=!0}},o(t){p=p.filter(Boolean);for(let t=0;t<p.length;t+=1)a(p[t]);i=!1},d(t){T(p,t),t&&u(n)}}}function dt(t){let n,i,e;const p=[t[2].props];var d=t[2].class;function $(t){let n={};for(let t=0;t<p.length;t+=1)n=O(n,p[t]);return{props:n}}return d&&(n=new d($())),{c(){n&&f(n.$$.fragment),i=o()},m(t,o){n&&h(n,t,o),s(t,i,o),e=!0},p(t,e){const o=2&e?m(p,[g(t[2].props)]):{};if(d!==(d=t[2].class)){if(n){r();const t=n;a(t.$$.fragment,1,0,(()=>{y(t,1)})),l()}d?(n=new d($()),f(n.$$.fragment),c(n.$$.fragment,1),h(n,i.parentNode,i)):n=null}else d&&n.$set(o)},i(t){e||(n&&c(n.$$.fragment,t),e=!0)},o(t){n&&a(n.$$.fragment,t),e=!1},d(t){t&&u(i),n&&y(n,t)}}}function $t(t){let n,i,e,p,d;const $=[pt,ut],f=[];function h(t,i){return(null==n||2&i)&&(n=!!Array.isArray(t[1])),n?0:t[0]?1:-1}return~(i=h(t,-1))&&(e=f[i]=$[i](t)),{c(){e&&e.c(),p=o()},m(t,n){~i&&f[i].m(t,n),s(t,p,n),d=!0},p(t,[n]){let o=i;i=h(t,n),i===o?~i&&f[i].p(t,n):(e&&(r(),a(f[o],1,1,(()=>{f[o]=null})),l()),~i?(e=f[i],e?e.p(t,n):(e=f[i]=$[i](t),e.c()),c(e,1),e.m(p.parentNode,p)):e=null)},i(t){d||(c(e),d=!0)},o(t){a(e),d=!1},d(t){~i&&f[i].d(t),t&&u(p)}}}function ft(t,n,i){let{warn:e=!1}=n,{children:o}=n;return t.$$set=t=>{"warn"in t&&i(0,e=t.warn),"children"in t&&i(1,o=t.children)},[e,o]}Promise.resolve();class ht extends t{constructor(t){super(),n(this,t,ft,$t,i,{warn:0,children:1})}get warn(){return this.$$.ctx[0]}set warn(t){this.$$set({warn:t}),e()}get children(){return this.$$.ctx[1]}set children(t){this.$$set({children:t}),e()}}function mt(t){let n,i;return n=new ht({props:{children:t[0],warn:!0}}),{c(){f(n.$$.fragment)},m(t,e){h(n,t,e),i=!0},p:$,i(t){i||(c(n.$$.fragment,t),i=!0)},o(t){a(n.$$.fragment,t),i=!1},d(t){y(n,t)}}}function gt(t,n,i){let{children:e}=n;const o=lt("external"),s=Array.isArray(e)?e:"object"==typeof o?o.children:void 0;return t.$$set=t=>{"children"in t&&i(1,e=t.children)},[s,e]}class yt extends t{constructor(t){super(),n(this,t,gt,mt,i,{children:1})}get children(){return this.$$.ctx[1]}set children(t){this.$$set({children:t}),e()}}function Tt(t){let n,i,e,o,r,l;const $=t[17].default,f=b($,t,t[16],null);return{c(){n=p("div"),f&&f.c(),d(n,"id",t[4]),d(n,"tabindex","0"),d(n,"class","tjs-glass-pane svelte-71db55")},m(i,e){s(i,n,e),f&&f.m(n,null),t[18](n),o=!0,r||(l=x(n,"keydown",t[6]),r=!0)},p(i,[e]){t=i,f&&f.p&&(!o||65536&e)&&v(f,$,t,t[16],o?j($,t[16],e,null):w(t[16]),null),(!o||16&e)&&d(n,"id",t[4])},i(s){o||(c(f,s),z((()=>{e&&e.end(1),i=I(n,t[0],t[2]),i.start()})),o=!0)},o(s){a(f,s),i&&i.invalidate(),e=C(n,t[1],t[3]),o=!1},d(i){i&&u(n),f&&f.d(i),t[18](null),i&&e&&e.end(),r=!1,l()}}}function Ot(t,n,i){let e,o,s,{$$slots:r={},$$scope:a}=n,{id:l}=n,{zIndex:c=Number.MAX_SAFE_INTEGER}=n,{background:u="#50505080"}=n,{captureInput:p=!0}=n,{preventDefault:d=!0}=n,{stopPropagation:$=!0}=n,{transition:f}=n,{inTransition:h=V}=n,{outTransition:m=V}=n,{transitionOptions:g}=n,{inTransitionOptions:y=Z}=n,{outTransitionOptions:T=Z}=n;return t.$$set=t=>{"id"in t&&i(4,l=t.id),"zIndex"in t&&i(7,c=t.zIndex),"background"in t&&i(8,u=t.background),"captureInput"in t&&i(9,p=t.captureInput),"preventDefault"in t&&i(10,d=t.preventDefault),"stopPropagation"in t&&i(11,$=t.stopPropagation),"transition"in t&&i(12,f=t.transition),"inTransition"in t&&i(0,h=t.inTransition),"outTransition"in t&&i(1,m=t.outTransition),"transitionOptions"in t&&i(13,g=t.transitionOptions),"inTransitionOptions"in t&&i(2,y=t.inTransitionOptions),"outTransitionOptions"in t&&i(3,T=t.outTransitionOptions),"$$scope"in t&&i(16,a=t.$$scope)},t.$$.update=()=>{if(32&t.$$.dirty&&e&&(i(5,e.style.maxWidth="100%",e),i(5,e.style.maxHeight="100%",e),i(5,e.style.width="100%",e),i(5,e.style.height="100%",e)),544&t.$$.dirty&&e&&(p&&e.focus(),i(5,e.style.pointerEvents=p?"auto":"none",e)),288&t.$$.dirty&&e&&i(5,e.style.background=u,e),160&t.$$.dirty&&e&&i(5,e.style.zIndex=c,e),20480&t.$$.dirty&&o!==f){const t=V!==f&&"function"==typeof f?f:V;i(0,h=t),i(1,m=t),i(14,o=t)}if(40960&t.$$.dirty&&s!==g){const t=g!==Z&&"object"==typeof g?g:Z;i(2,y=t),i(3,T=t),i(15,s=t)}1&t.$$.dirty&&"function"!=typeof h&&i(0,h=V),2&t.$$.dirty&&"function"!=typeof m&&i(1,m=V),4&t.$$.dirty&&"object"!=typeof y&&i(2,y=Z),8&t.$$.dirty&&"object"!=typeof T&&i(3,T=Z)},[h,m,y,T,l,e,function(t){p&&(d&&t.preventDefault(),$&&t.stopPropagation())},c,u,p,d,$,f,g,o,s,a,r,function(t){A[t?"unshift":"push"]((()=>{e=t,i(5,e),i(9,p),i(8,u),i(7,c)}))}]}class bt extends t{constructor(t){super(),n(this,t,Ot,Tt,i,{id:4,zIndex:7,background:8,captureInput:9,preventDefault:10,stopPropagation:11,transition:12,inTransition:0,outTransition:1,transitionOptions:13,inTransitionOptions:2,outTransitionOptions:3})}get id(){return this.$$.ctx[4]}set id(t){this.$$set({id:t}),e()}get zIndex(){return this.$$.ctx[7]}set zIndex(t){this.$$set({zIndex:t}),e()}get background(){return this.$$.ctx[8]}set background(t){this.$$set({background:t}),e()}get captureInput(){return this.$$.ctx[9]}set captureInput(t){this.$$set({captureInput:t}),e()}get preventDefault(){return this.$$.ctx[10]}set preventDefault(t){this.$$set({preventDefault:t}),e()}get stopPropagation(){return this.$$.ctx[11]}set stopPropagation(t){this.$$set({stopPropagation:t}),e()}get transition(){return this.$$.ctx[12]}set transition(t){this.$$set({transition:t}),e()}get inTransition(){return this.$$.ctx[0]}set inTransition(t){this.$$set({inTransition:t}),e()}get outTransition(){return this.$$.ctx[1]}set outTransition(t){this.$$set({outTransition:t}),e()}get transitionOptions(){return this.$$.ctx[13]}set transitionOptions(t){this.$$set({transitionOptions:t}),e()}get inTransitionOptions(){return this.$$.ctx[2]}set inTransitionOptions(t){this.$$set({inTransitionOptions:t}),e()}get outTransitionOptions(){return this.$$.ctx[3]}set outTransitionOptions(t){this.$$set({outTransitionOptions:t}),e()}}function xt(t){let n,i,e,o,r,a,l,c,f=it(t[0].label)+"";return{c(){n=p("a"),i=p("i"),r=R(f),d(i,"class",e=t[0].icon),d(i,"title",o=it(t[0].title)),d(n,"class",a="header-button "+t[0].class)},m(e,o){s(e,n,o),k(n,i),k(n,r),l||(c=x(n,"click",t[1]),l=!0)},p(t,[s]){1&s&&e!==(e=t[0].icon)&&d(i,"class",e),1&s&&o!==(o=it(t[0].title))&&d(i,"title",o),1&s&&f!==(f=it(t[0].label)+"")&&E(r,f),1&s&&a!==(a="header-button "+t[0].class)&&d(n,"class",a)},i:$,o:$,d(t){t&&u(n),l=!1,c()}}}function vt(t,n,i){let{button:e}=n;return t.$$set=t=>{"button"in t&&i(0,e=t.button)},[e,function(){"function"==typeof e.onclick&&(e.onclick.call(e),i(0,e))}]}class wt extends t{constructor(t){super(),n(this,t,vt,xt,i,{button:0})}get button(){return this.$$.ctx[0]}set button(t){this.$$set({button:t}),e()}}function jt(t,n,i){const e=t.slice();return e[12]=n[i],e}function zt(t){let n,i;return n=new wt({props:{button:t[12]}}),{c(){f(n.$$.fragment)},m(t,e){h(n,t,e),i=!0},p(t,i){const e={};8&i&&(e.button=t[12]),n.$set(e)},i(t){i||(c(n.$$.fragment,t),i=!0)},o(t){a(n.$$.fragment,t),i=!1},d(t){y(n,t)}}}function It(t){let n,i,e,o,$,f,h,m,g,y=it(t[2])+"",O=t[3],b=[];for(let n=0;n<O.length;n+=1)b[n]=zt(jt(t,O,n));const v=t=>a(b[t],1,1,(()=>{b[t]=null}));return{c(){n=p("header"),i=p("h4"),e=R(y),o=D();for(let t=0;t<b.length;t+=1)b[t].c();d(i,"class","window-title"),d(n,"class","window-header flexrow")},m(r,a){s(r,n,a),k(n,i),k(i,e),k(n,o);for(let t=0;t<b.length;t+=1)b[t].m(n,null);h=!0,m||(g=[x(n,"pointerdown",t[5]),N($=nt.call(null,n,{positionable:t[4],booleanStore:t[0]})),N(f=t[10].call(null,n,t[1]))],m=!0)},p(t,[i]){if((!h||4&i)&&y!==(y=it(t[2])+"")&&E(e,y),8&i){let e;for(O=t[3],e=0;e<O.length;e+=1){const o=jt(t,O,e);b[e]?(b[e].p(o,i),c(b[e],1)):(b[e]=zt(o),b[e].c(),c(b[e],1),b[e].m(n,null))}for(r(),e=O.length;e<b.length;e+=1)v(e);l()}$&&L($.update)&&1&i&&$.update.call(null,{positionable:t[4],booleanStore:t[0]}),f&&L(f.update)&&2&i&&f.update.call(null,t[1])},i(t){if(!h){for(let t=0;t<O.length;t+=1)c(b[t]);h=!0}},o(t){b=b.filter(Boolean);for(let t=0;t<b.length;t+=1)a(b[t]);h=!1},d(t){t&&u(n),T(b,t),m=!1,M(g)}}}function Ct(t,n,i){let e,o,s,r;const a=lt("external"),l=a.foundryApp,c="boolean"==typeof l.options.popOut&&l.options.popOut?()=>l.bringToTop.call(l):()=>{},u=a.storeAppOptions.title;P(t,u,(t=>i(2,s=t)));const p=a.storeAppOptions.draggable;P(t,p,(t=>i(0,e=t)));const d=a.storeUIOptions.headerButtons;P(t,d,(t=>i(3,r=t)));const $=a.storeAppOptions.minimizable;return P(t,$,(t=>i(1,o=t))),[e,o,s,r,l,c,u,p,d,$,function(t,n){const i=l._onToggleMinimize.bind(l);function e(){t.addEventListener("dblclick",i)}function o(){t.removeEventListener("dblclick",i)}return n&&e(),{update:({booleanStore:t})=>{t?e():o()},destroy:()=>o()}}]}class At extends t{constructor(t){super(),n(this,t,Ct,It,i,{})}}function Rt(t){let n,i,e,o;return{c(){n=p("div"),n.innerHTML='<i class="fas fa-arrows-alt-h"></i>',d(n,"class","window-resizable-handle")},m(r,a){s(r,n,a),t[7](n),e||(o=N(i=t[4].call(null,n,t[1])),e=!0)},p(t,[n]){i&&L(i.update)&&2&n&&i.update.call(null,t[1])},i:$,o:$,d(i){i&&u(n),t[7](null),e=!1,o()}}}function kt(t,n,i){let e,o,{isResizable:s=!1}=n;const r=lt("external"),a=lt("getElementRoot"),l=r.foundryApp,c=r.storeAppOptions.resizable;P(t,c,(t=>i(1,o=t)));const u=r.storeUIOptions.minimized;let p;return P(t,u,(t=>i(6,e=t))),t.$$set=t=>{"isResizable"in t&&i(5,s=t.isResizable)},t.$$.update=()=>{if(97&t.$$.dirty&&p){i(0,p.style.display=s&&!e?"block":"none",p);const t=a();t&&t.classList[s?"add":"remove"]("resizable")}},[p,o,c,u,function(t,n){let e=null,o={},r=0,c=n;const u={resizeDown:["pointerdown",t=>function(t){t.preventDefault();const n=Date.now();n-r<1e3/60||(r=n,e=foundry.utils.duplicate(l.position),"auto"===e.height&&(e.height=a().clientHeight),"auto"===e.width&&(e.width=a().clientWidth),o={x:t.clientX,y:t.clientY},globalThis.addEventListener(...u.resizeMove),globalThis.addEventListener(...u.resizeUp))}(t),!1],resizeMove:["pointermove",t=>{return(n=t).preventDefault(),void(c&&l.setPosition({width:e.width+(n.clientX-o.x),height:e.height+(n.clientY-o.y)}));var n},!1],resizeUp:["pointerup",t=>{return(n=t).preventDefault(),globalThis.removeEventListener(...u.resizeMove),globalThis.removeEventListener(...u.resizeUp),void l._onResize(n);var n},!1]};function p(){c=!0,t.addEventListener(...u.resizeDown),i(5,s=!0),t.style.display="block"}function d(){c=!1,t.removeEventListener(...u.resizeDown),t.removeEventListener(...u.resizeMove),t.removeEventListener(...u.resizeUp),t.style.display="none",i(5,s=!1)}return c?p():t.style.display="none",{update:t=>{t?p():d()},destroy:()=>d()}},s,e,function(t){A[t?"unshift":"push"]((()=>{p=t,i(0,p),i(5,s),i(6,e)}))}]}class Et extends t{constructor(t){super(),n(this,t,kt,Rt,i,{isResizable:5})}}function Dt(t){let n,i,e,o,r,l,$,m,g,T,O,b,x,v;i=new At({});const w=[Mt,Lt],j=[];return r=function(t,n){return Array.isArray(t[9])?0:1}(t),l=j[r]=w[r](t),m=new Et({}),{c(){n=p("div"),f(i.$$.fragment),e=D(),o=p("section"),l.c(),$=D(),f(m.$$.fragment),d(o,"class","window-content"),d(n,"id",g=t[7].id),d(n,"class",T="app window-app "+t[7].options.classes.join(" ")+" svelte-3vt5in"),d(n,"data-appid",O=t[7].appId)},m(a,l){s(a,n,l),h(i,n,null),k(n,e),k(n,o),j[r].m(o,null),t[21](o),k(n,$),h(m,n,null),t[22](n),v=!0},p(i,e){t=i,l.p(t,e),(!v||128&e&&g!==(g=t[7].id))&&d(n,"id",g),(!v||128&e&&T!==(T="app window-app "+t[7].options.classes.join(" ")+" svelte-3vt5in"))&&d(n,"class",T),(!v||128&e&&O!==(O=t[7].appId))&&d(n,"data-appid",O)},i(e){v||(c(i.$$.fragment,e),c(l),c(m.$$.fragment,e),z((()=>{x&&x.end(1),b=I(n,t[0],t[2]),b.start()})),v=!0)},o(e){a(i.$$.fragment,e),a(l),a(m.$$.fragment,e),b&&b.invalidate(),x=C(n,t[1],t[3]),v=!1},d(e){e&&u(n),y(i),j[r].d(),t[21](null),y(m),t[22](null),e&&x&&x.end()}}}function Nt(t){let n,i,e,o,r,l,$,m,g,T,O,b,x,v,w,j;i=new At({});const A=[Ht,Pt],R=[];return r=function(t,n){return Array.isArray(t[9])?0:1}(t),l=R[r]=A[r](t),g=new Et({}),{c(){n=p("div"),f(i.$$.fragment),e=D(),o=p("section"),l.c(),m=D(),f(g.$$.fragment),d(o,"class","window-content"),z((()=>t[18].call(o))),d(n,"id",T=t[7].id),d(n,"class",O="app window-app "+t[7].options.classes.join(" ")+" svelte-3vt5in"),d(n,"data-appid",b=t[7].appId),z((()=>t[19].call(n)))},m(a,l){s(a,n,l),h(i,n,null),k(n,e),k(n,o),R[r].m(o,null),t[17](o),$=H(o,t[18].bind(o)),k(n,m),h(g,n,null),x=H(n,t[19].bind(n)),t[20](n),j=!0},p(i,e){t=i,l.p(t,e),(!j||128&e&&T!==(T=t[7].id))&&d(n,"id",T),(!j||128&e&&O!==(O="app window-app "+t[7].options.classes.join(" ")+" svelte-3vt5in"))&&d(n,"class",O),(!j||128&e&&b!==(b=t[7].appId))&&d(n,"data-appid",b)},i(e){j||(c(i.$$.fragment,e),c(l),c(g.$$.fragment,e),z((()=>{w&&w.end(1),v=I(n,t[0],t[2]),v.start()})),j=!0)},o(e){a(i.$$.fragment,e),a(l),a(g.$$.fragment,e),v&&v.invalidate(),w=C(n,t[1],t[3]),j=!1},d(e){e&&u(n),y(i),R[r].d(),t[17](null),$(),y(g),x(),t[20](null),e&&w&&w.end()}}}function Lt(t){let n;const i=t[16].default,e=b(i,t,t[15],null);return{c(){e&&e.c()},m(t,i){e&&e.m(t,i),n=!0},p(t,o){e&&e.p&&(!n||32768&o)&&v(e,i,t,t[15],n?j(i,t[15],o,null):w(t[15]),null)},i(t){n||(c(e,t),n=!0)},o(t){a(e,t),n=!1},d(t){e&&e.d(t)}}}function Mt(t){let n,i;return n=new ht({props:{children:t[9]}}),{c(){f(n.$$.fragment)},m(t,e){h(n,t,e),i=!0},p:$,i(t){i||(c(n.$$.fragment,t),i=!0)},o(t){a(n.$$.fragment,t),i=!1},d(t){y(n,t)}}}function Pt(t){let n;const i=t[16].default,e=b(i,t,t[15],null);return{c(){e&&e.c()},m(t,i){e&&e.m(t,i),n=!0},p(t,o){e&&e.p&&(!n||32768&o)&&v(e,i,t,t[15],n?j(i,t[15],o,null):w(t[15]),null)},i(t){n||(c(e,t),n=!0)},o(t){a(e,t),n=!1},d(t){e&&e.d(t)}}}function Ht(t){let n,i;return n=new ht({props:{children:t[9]}}),{c(){f(n.$$.fragment)},m(t,e){h(n,t,e),i=!0},p:$,i(t){i||(c(n.$$.fragment,t),i=!0)},o(t){a(n.$$.fragment,t),i=!1},d(t){y(n,t)}}}function _t(t){let n,i,e,r;const l=[Nt,Dt],p=[];return n=function(t,n){return t[8]?0:1}(t),i=p[n]=l[n](t),{c(){i.c(),e=o()},m(t,i){p[n].m(t,i),s(t,e,i),r=!0},p(t,[n]){i.p(t,n)},i(t){r||(c(i),r=!0)},o(t){a(i),r=!1},d(t){p[n].d(t),t&&u(e)}}}function St(t,n,i){let{$$slots:e={},$$scope:o}=n,{elementContent:s}=n,{elementRoot:r}=n,{children:a}=n,{heightChanged:l=!1}=n;const c=!!l;at("getElementContent",(()=>s)),at("getElementRoot",(()=>r));const u=lt("external"),p=u.foundryApp,d=Array.isArray(a)?a:"object"==typeof u?u.children:void 0;let $,f,{transition:h}=n,{inTransition:m=V}=n,{outTransition:g=V}=n,{transitionOptions:y}=n,{inTransitionOptions:T=Z}=n,{outTransitionOptions:O=Z}=n;return t.$$set=t=>{"elementContent"in t&&i(4,s=t.elementContent),"elementRoot"in t&&i(5,r=t.elementRoot),"children"in t&&i(10,a=t.children),"heightChanged"in t&&i(6,l=t.heightChanged),"transition"in t&&i(11,h=t.transition),"inTransition"in t&&i(0,m=t.inTransition),"outTransition"in t&&i(1,g=t.outTransition),"transitionOptions"in t&&i(12,y=t.transitionOptions),"inTransitionOptions"in t&&i(2,T=t.inTransitionOptions),"outTransitionOptions"in t&&i(3,O=t.outTransitionOptions),"$$scope"in t&&i(15,o=t.$$scope)},t.$$.update=()=>{if(10240&t.$$.dirty&&$!==h){const t=V!==h&&"function"==typeof h?h:V;i(0,m=t),i(1,g=t),i(13,$=t)}if(20480&t.$$.dirty&&f!==y){const t=y!==Z&&"object"==typeof y?y:Z;i(2,T=t),i(3,O=t),i(14,f=t)}1&t.$$.dirty&&"function"!=typeof m&&i(0,m=V),130&t.$$.dirty&&("function"!=typeof g&&i(1,g=V),p&&"boolean"==typeof p?.options?.jqueryCloseAnimation&&i(7,p.options.jqueryCloseAnimation=g===V,p)),4&t.$$.dirty&&"object"!=typeof T&&i(2,T=Z),8&t.$$.dirty&&"object"!=typeof O&&i(3,O=Z)},[m,g,T,O,s,r,l,p,c,d,a,h,y,$,f,o,e,function(t){A[t?"unshift":"push"]((()=>{s=t,i(4,s)}))},function(){l=this.clientHeight,i(6,l)},function(){l=this.clientHeight,i(6,l)},function(t){A[t?"unshift":"push"]((()=>{r=t,i(5,r)}))},function(t){A[t?"unshift":"push"]((()=>{s=t,i(4,s)}))},function(t){A[t?"unshift":"push"]((()=>{r=t,i(5,r)}))}]}class Ut extends t{constructor(t){super(),n(this,t,St,_t,i,{elementContent:4,elementRoot:5,children:10,heightChanged:6,transition:11,inTransition:0,outTransition:1,transitionOptions:12,inTransitionOptions:2,outTransitionOptions:3})}get elementContent(){return this.$$.ctx[4]}set elementContent(t){this.$$set({elementContent:t}),e()}get elementRoot(){return this.$$.ctx[5]}set elementRoot(t){this.$$set({elementRoot:t}),e()}get children(){return this.$$.ctx[10]}set children(t){this.$$set({children:t}),e()}get heightChanged(){return this.$$.ctx[6]}set heightChanged(t){this.$$set({heightChanged:t}),e()}get transition(){return this.$$.ctx[11]}set transition(t){this.$$set({transition:t}),e()}get inTransition(){return this.$$.ctx[0]}set inTransition(t){this.$$set({inTransition:t}),e()}get outTransition(){return this.$$.ctx[1]}set outTransition(t){this.$$set({outTransition:t}),e()}get transitionOptions(){return this.$$.ctx[12]}set transitionOptions(t){this.$$set({transitionOptions:t}),e()}get inTransitionOptions(){return this.$$.ctx[2]}set inTransitionOptions(t){this.$$set({inTransitionOptions:t}),e()}get outTransitionOptions(){return this.$$.ctx[3]}set outTransitionOptions(t){this.$$set({outTransitionOptions:t}),e()}}function Xt(t){let n,i,e,o,r,l,$,m,g,T,O,b,x,v;i=new At({});const w=[Bt,qt],j=[];return r=function(t,n){return Array.isArray(t[9])?0:1}(t),l=j[r]=w[r](t),m=new Et({}),{c(){n=p("div"),f(i.$$.fragment),e=D(),o=p("section"),l.c(),$=D(),f(m.$$.fragment),d(o,"class","window-content"),d(n,"id",g=t[7].id),d(n,"class",T="tjs-app tjs-window-app "+t[7].options.classes.join(" ")),d(n,"data-appid",O=t[7].appId)},m(a,l){s(a,n,l),h(i,n,null),k(n,e),k(n,o),j[r].m(o,null),t[21](o),k(n,$),h(m,n,null),t[22](n),v=!0},p(i,e){t=i,l.p(t,e),(!v||128&e&&g!==(g=t[7].id))&&d(n,"id",g),(!v||128&e&&T!==(T="tjs-app tjs-window-app "+t[7].options.classes.join(" ")))&&d(n,"class",T),(!v||128&e&&O!==(O=t[7].appId))&&d(n,"data-appid",O)},i(e){v||(c(i.$$.fragment,e),c(l),c(m.$$.fragment,e),z((()=>{x&&x.end(1),b=I(n,t[0],t[2]),b.start()})),v=!0)},o(e){a(i.$$.fragment,e),a(l),a(m.$$.fragment,e),b&&b.invalidate(),x=C(n,t[1],t[3]),v=!1},d(e){e&&u(n),y(i),j[r].d(),t[21](null),y(m),t[22](null),e&&x&&x.end()}}}function Wt(t){let n,i,e,o,r,l,$,m,g,T,O,b,x,v,w,j;i=new At({});const A=[Gt,Ft],R=[];return r=function(t,n){return Array.isArray(t[9])?0:1}(t),l=R[r]=A[r](t),g=new Et({}),{c(){n=p("div"),f(i.$$.fragment),e=D(),o=p("section"),l.c(),m=D(),f(g.$$.fragment),d(o,"class","window-content"),z((()=>t[18].call(o))),d(n,"id",T=t[7].id),d(n,"class",O="tjs-app tjs-window-app "+t[7].options.classes.join(" ")),d(n,"data-appid",b=t[7].appId),z((()=>t[19].call(n)))},m(a,l){s(a,n,l),h(i,n,null),k(n,e),k(n,o),R[r].m(o,null),t[17](o),$=H(o,t[18].bind(o)),k(n,m),h(g,n,null),x=H(n,t[19].bind(n)),t[20](n),j=!0},p(i,e){t=i,l.p(t,e),(!j||128&e&&T!==(T=t[7].id))&&d(n,"id",T),(!j||128&e&&O!==(O="tjs-app tjs-window-app "+t[7].options.classes.join(" ")))&&d(n,"class",O),(!j||128&e&&b!==(b=t[7].appId))&&d(n,"data-appid",b)},i(e){j||(c(i.$$.fragment,e),c(l),c(g.$$.fragment,e),z((()=>{w&&w.end(1),v=I(n,t[0],t[2]),v.start()})),j=!0)},o(e){a(i.$$.fragment,e),a(l),a(g.$$.fragment,e),v&&v.invalidate(),w=C(n,t[1],t[3]),j=!1},d(e){e&&u(n),y(i),R[r].d(),t[17](null),$(),y(g),x(),t[20](null),e&&w&&w.end()}}}function qt(t){let n;const i=t[16].default,e=b(i,t,t[15],null);return{c(){e&&e.c()},m(t,i){e&&e.m(t,i),n=!0},p(t,o){e&&e.p&&(!n||32768&o)&&v(e,i,t,t[15],n?j(i,t[15],o,null):w(t[15]),null)},i(t){n||(c(e,t),n=!0)},o(t){a(e,t),n=!1},d(t){e&&e.d(t)}}}function Bt(t){let n,i;return n=new ht({props:{children:t[9]}}),{c(){f(n.$$.fragment)},m(t,e){h(n,t,e),i=!0},p:$,i(t){i||(c(n.$$.fragment,t),i=!0)},o(t){a(n.$$.fragment,t),i=!1},d(t){y(n,t)}}}function Ft(t){let n;const i=t[16].default,e=b(i,t,t[15],null);return{c(){e&&e.c()},m(t,i){e&&e.m(t,i),n=!0},p(t,o){e&&e.p&&(!n||32768&o)&&v(e,i,t,t[15],n?j(i,t[15],o,null):w(t[15]),null)},i(t){n||(c(e,t),n=!0)},o(t){a(e,t),n=!1},d(t){e&&e.d(t)}}}function Gt(t){let n,i;return n=new ht({props:{children:t[9]}}),{c(){f(n.$$.fragment)},m(t,e){h(n,t,e),i=!0},p:$,i(t){i||(c(n.$$.fragment,t),i=!0)},o(t){a(n.$$.fragment,t),i=!1},d(t){y(n,t)}}}function Yt(t){let n,i,e,r;const l=[Wt,Xt],p=[];return n=function(t,n){return t[8]?0:1}(t),i=p[n]=l[n](t),{c(){i.c(),e=o()},m(t,i){p[n].m(t,i),s(t,e,i),r=!0},p(t,[n]){i.p(t,n)},i(t){r||(c(i),r=!0)},o(t){a(i),r=!1},d(t){p[n].d(t),t&&u(e)}}}function Jt(t,n,i){let{$$slots:e={},$$scope:o}=n,{elementContent:s}=n,{elementRoot:r}=n,{children:a}=n,{heightChanged:l=!1}=n;const c=!!l;at("getElementContent",(()=>s)),at("getElementRoot",(()=>r));const u=lt("external"),p=u.foundryApp,d=Array.isArray(a)?a:"object"==typeof u?u.children:void 0;let $,f,{transition:h}=n,{inTransition:m=V}=n,{outTransition:g=V}=n,{transitionOptions:y}=n,{inTransitionOptions:T=Z}=n,{outTransitionOptions:O=Z}=n;return t.$$set=t=>{"elementContent"in t&&i(4,s=t.elementContent),"elementRoot"in t&&i(5,r=t.elementRoot),"children"in t&&i(10,a=t.children),"heightChanged"in t&&i(6,l=t.heightChanged),"transition"in t&&i(11,h=t.transition),"inTransition"in t&&i(0,m=t.inTransition),"outTransition"in t&&i(1,g=t.outTransition),"transitionOptions"in t&&i(12,y=t.transitionOptions),"inTransitionOptions"in t&&i(2,T=t.inTransitionOptions),"outTransitionOptions"in t&&i(3,O=t.outTransitionOptions),"$$scope"in t&&i(15,o=t.$$scope)},t.$$.update=()=>{if(10240&t.$$.dirty&&$!==h){const t=V!==h&&"function"==typeof h?h:V;i(0,m=t),i(1,g=t),i(13,$=t)}if(20480&t.$$.dirty&&f!==y){const t=y!==Z&&"object"==typeof y?y:Z;i(2,T=t),i(3,O=t),i(14,f=t)}1&t.$$.dirty&&"function"!=typeof m&&i(0,m=V),130&t.$$.dirty&&("function"!=typeof g&&i(1,g=V),p&&"boolean"==typeof p?.options?.jqueryCloseAnimation&&i(7,p.options.jqueryCloseAnimation=g===V,p)),4&t.$$.dirty&&"object"!=typeof T&&i(2,T=Z),8&t.$$.dirty&&"object"!=typeof O&&i(3,O=Z)},[m,g,T,O,s,r,l,p,c,d,a,h,y,$,f,o,e,function(t){A[t?"unshift":"push"]((()=>{s=t,i(4,s)}))},function(){l=this.clientHeight,i(6,l)},function(){l=this.clientHeight,i(6,l)},function(t){A[t?"unshift":"push"]((()=>{r=t,i(5,r)}))},function(t){A[t?"unshift":"push"]((()=>{s=t,i(4,s)}))},function(t){A[t?"unshift":"push"]((()=>{r=t,i(5,r)}))}]}class Qt extends t{constructor(t){super(),n(this,t,Jt,Yt,i,{elementContent:4,elementRoot:5,children:10,heightChanged:6,transition:11,inTransition:0,outTransition:1,transitionOptions:12,inTransitionOptions:2,outTransitionOptions:3})}get elementContent(){return this.$$.ctx[4]}set elementContent(t){this.$$set({elementContent:t}),e()}get elementRoot(){return this.$$.ctx[5]}set elementRoot(t){this.$$set({elementRoot:t}),e()}get children(){return this.$$.ctx[10]}set children(t){this.$$set({children:t}),e()}get heightChanged(){return this.$$.ctx[6]}set heightChanged(t){this.$$set({heightChanged:t}),e()}get transition(){return this.$$.ctx[11]}set transition(t){this.$$set({transition:t}),e()}get inTransition(){return this.$$.ctx[0]}set inTransition(t){this.$$set({inTransition:t}),e()}get outTransition(){return this.$$.ctx[1]}set outTransition(t){this.$$set({outTransition:t}),e()}get transitionOptions(){return this.$$.ctx[12]}set transitionOptions(t){this.$$set({transitionOptions:t}),e()}get inTransitionOptions(){return this.$$.ctx[2]}set inTransitionOptions(t){this.$$set({inTransitionOptions:t}),e()}get outTransitionOptions(){return this.$$.ctx[3]}set outTransitionOptions(t){this.$$set({outTransitionOptions:t}),e()}}const{document:Kt}=X;function Vt(t,n,i){const e=t.slice();return e[15]=n[i],e}function Zt(t){let n,i,e,o,r,a,l=it(t[15].label)+"";function c(){return t[10](t[15])}return{c(){n=p("li"),i=p("i"),o=R(l),d(i,"class",e=_(t[15].icon)+" svelte-thdn97"),d(n,"class","tjs-context-item svelte-thdn97")},m(t,e){s(t,n,e),k(n,i),k(n,o),r||(a=x(n,"click",c),r=!0)},p(n,s){t=n,2&s&&e!==(e=_(t[15].icon)+" svelte-thdn97")&&d(i,"class",e),2&s&&l!==(l=it(t[15].label)+"")&&E(o,l)},d(t){t&&u(n),r=!1,a()}}}function tn(t){let n,i,e,o,r,a,l,c=t[1],$=[];for(let n=0;n<c.length;n+=1)$[n]=Zt(Vt(t,c,n));return{c(){n=D(),i=p("nav"),e=p("ol");for(let t=0;t<$.length;t+=1)$[t].c();d(e,"class","tjs-context-items svelte-thdn97"),d(i,"id",t[0]),d(i,"class","tjs-context-menu svelte-thdn97"),S(i,"z-index",t[2])},m(o,c){s(o,n,c),s(o,i,c),k(i,e);for(let t=0;t<$.length;t+=1)$[t].m(e,null);t[11](i),r=!0,a||(l=x(Kt.body,"pointerdown",t[6]),a=!0)},p(t,[n]){if(34&n){let i;for(c=t[1],i=0;i<c.length;i+=1){const o=Vt(t,c,i);$[i]?$[i].p(o,n):($[i]=Zt(o),$[i].c(),$[i].m(e,null))}for(;i<$.length;i+=1)$[i].d(1);$.length=c.length}(!r||1&n)&&d(i,"id",t[0]),(!r||4&n)&&S(i,"z-index",t[2])},i(n){r||(z((()=>{o||(o=U(i,t[4],{},!0)),o.run(1)})),r=!0)},o(n){o||(o=U(i,t[4],{},!1)),o.run(0),r=!1},d(e){e&&u(n),e&&u(i),T($,e),t[11](null),e&&o&&o.end(),a=!1,l()}}}function nn(t,n,i){let e,{id:o=""}=n,{x:s=0}=n,{y:r=0}=n,{items:a=[]}=n,{zIndex:l=1e4}=n,{transitionOptions:c}=n;const u=W,p=function(){const t=K();return(n,i)=>{t.$$.callbacks[n]}}();let d=!1;function $(t){"function"==typeof t&&t(),d||(p("close"),d=!0,et(u))}return t.$$set=t=>{"id"in t&&i(0,o=t.id),"x"in t&&i(7,s=t.x),"y"in t&&i(8,r=t.y),"items"in t&&i(1,a=t.items),"zIndex"in t&&i(2,l=t.zIndex),"transitionOptions"in t&&i(9,c=t.transitionOptions)},[o,a,l,e,function(t){const n=r+t.clientHeight>document.body.clientHeight,i=s+t.clientWidth>document.body.clientWidth;return t.style.top=n?null:`${r}px`,t.style.bottom=n?document.body.clientHeight-r+"px":null,t.style.left=i?null:`${s}px`,t.style.right=i?document.body.clientWidth-s+"px":null,tt(t,c)},$,async function(t){t.target===e||e.contains(t.target)||Math.floor(t.pageX)===s&&Math.floor(t.pageY)===r||d||(p("close"),d=!0,et(u))},s,r,c,t=>$(t.onclick),function(t){A[t?"unshift":"push"]((()=>{e=t,i(3,e)}))}]}class en extends t{constructor(t){super(),n(this,t,nn,tn,i,{id:0,x:7,y:8,items:1,zIndex:2,transitionOptions:9})}}function on(t,n,i){const e=t.slice();return e[9]=n[i],e}function sn(t){let n,i,e;const p=[t[3]];var d=t[2];function $(t){let n={};for(let t=0;t<p.length;t+=1)n=O(n,p[t]);return{props:n}}return d&&(n=new d($())),{c(){n&&f(n.$$.fragment),i=o()},m(t,o){n&&h(n,t,o),s(t,i,o),e=!0},p(t,e){const o=8&e?m(p,[g(t[3])]):{};if(d!==(d=t[2])){if(n){r();const t=n;a(t.$$.fragment,1,0,(()=>{y(t,1)})),l()}d?(n=new d($()),f(n.$$.fragment),c(n.$$.fragment,1),h(n,i.parentNode,i)):n=null}else d&&n.$set(o)},i(t){e||(n&&c(n.$$.fragment,t),e=!0)},o(t){n&&a(n.$$.fragment,t),e=!1},d(t){t&&u(i),n&&y(n,t)}}}function rn(t){let n,i;return{c(){n=new q,i=o(),n.a=i},m(e,o){n.m(t[0],e,o),s(e,i,o)},p(t,i){1&i&&n.p(t[0])},i:$,o:$,d(t){t&&u(i),t&&n.d()}}}function an(t,n){let i,e,o,r,a,l,c,$,f=n[9].icon+"",h=n[9].label+"";function m(){return n[7](n[9])}return{key:t,first:null,c(){i=p("button"),e=new q,o=D(),r=new q,a=D(),e.a=o,r.a=a,d(i,"class",l="dialog-button "+n[9].cssClass),this.first=i},m(t,n){s(t,i,n),e.m(f,i),k(i,o),r.m(h,i),k(i,a),c||($=x(i,"click",m),c=!0)},p(t,o){n=t,2&o&&f!==(f=n[9].icon+"")&&e.p(f),2&o&&h!==(h=n[9].label+"")&&r.p(h),2&o&&l!==(l="dialog-button "+n[9].cssClass)&&d(i,"class",l)},d(t){t&&u(i),c=!1,$()}}}function ln(t){let n,i,e,o,$,f,h,m,g,y=[],T=new Map;const O=[rn,sn],b=[];function v(t,n){return"string"==typeof t[0]?0:t[2]?1:-1}~(e=v(t))&&(o=b[e]=O[e](t));let w=t[1];const j=t=>t[9].id;for(let n=0;n<w.length;n+=1){let i=on(t,w,n),e=j(i);T.set(e,y[n]=an(e,i))}return{c(){n=D(),i=p("div"),o&&o.c(),$=D(),f=p("div");for(let t=0;t<y.length;t+=1)y[t].c();d(i,"class","dialog-content"),d(f,"class","dialog-buttons svelte-14xg9ru")},m(o,r){s(o,n,r),s(o,i,r),~e&&b[e].m(i,null),s(o,$,r),s(o,f,r);for(let t=0;t<y.length;t+=1)y[t].m(f,null);h=!0,m||(g=x(document.body,"keydown",B(F(t[5]))),m=!0)},p(t,[n]){let s=e;e=v(t),e===s?~e&&b[e].p(t,n):(o&&(r(),a(b[s],1,1,(()=>{b[s]=null})),l()),~e?(o=b[e],o?o.p(t,n):(o=b[e]=O[e](t),o.c()),c(o,1),o.m(i,null)):o=null),18&n&&(w=t[1],y=G(y,n,j,1,t,w,T,f,Y,an,null,on))},i(t){h||(c(o),h=!0)},o(t){a(o),h=!1},d(t){t&&u(n),t&&u(i),~e&&b[e].d(),t&&u($),t&&u(f);for(let t=0;t<y.length;t+=1)y[t].d();m=!1,g()}}}function cn(t,n,i){let e,o,s,{data:r={}}=n,a={},l=lt("external").foundryApp;function c(t){try{"function"==typeof t.callback&&t.callback(l.options.jQuery?l.element:l.element[0]),l.close()}catch(t){throw ui.notifications.error(t),new Error(t)}}return t.$$set=t=>{"data"in t&&i(6,r=t.data)},t.$$.update=()=>{if(64&t.$$.dirty&&i(1,e="object"!=typeof r.buttons?[]:Object.keys(r.buttons).reduce(((t,n)=>{const i=r.buttons[n];return!1!==i.condition&&t.push({...i,id:n,cssClass:[n,r.default===n?"default":""].filterJoin(" ")}),t}),[])),65&t.$$.dirty){i(0,o=r.content);try{if(ot(o))i(2,s=o),i(3,a={});else if("object"==typeof o){const t=st(o,l);i(2,s=t.class),i(3,a=t.props??{});const n=t?.context?.get("external")?.children;Array.isArray(n)&&i(3,a.children=n,a)}else i(2,s=void 0),i(3,a={})}catch(t){i(2,s=void 0),i(3,a={}),i(0,o=t.message),console.error(t)}}},[o,e,s,a,c,function(t){switch(t.key){case"Escape":return l.close();case"Enter":c(r.buttons[r.default])}},r,t=>c(t)]}class un extends t{constructor(t){super(),n(this,t,cn,ln,i,{data:6})}}function pn(t){let n,i,e;const o=[t[4]];function s(n){t[8](n)}let r={$$slots:{default:[$n]},$$scope:{ctx:t}};for(let t=0;t<o.length;t+=1)r=O(r,o[t]);return void 0!==t[0]&&(r.elementRoot=t[0]),n=new Ut({props:r}),A.push((()=>J(n,"elementRoot",s))),{c(){f(n.$$.fragment)},m(t,i){h(n,t,i),e=!0},p(t,e){const s=16&e?m(o,[g(t[4])]):{};2050&e&&(s.$$scope={dirty:e,ctx:t}),!i&&1&e&&(i=!0,s.elementRoot=t[0],Q((()=>i=!1))),n.$set(s)},i(t){e||(c(n.$$.fragment,t),e=!0)},o(t){a(n.$$.fragment,t),e=!1},d(t){y(n,t)}}}function dn(t){let n,i;const e=[{id:t[2].id},{stopPropagation:!1},t[5],{zIndex:t[6]}];let o={$$slots:{default:[hn]},$$scope:{ctx:t}};for(let t=0;t<e.length;t+=1)o=O(o,e[t]);return n=new bt({props:o}),{c(){f(n.$$.fragment)},m(t,e){h(n,t,e),i=!0},p(t,i){const o=100&i?m(e,[4&i&&{id:t[2].id},e[1],32&i&&g(t[5]),64&i&&{zIndex:t[6]}]):{};2067&i&&(o.$$scope={dirty:i,ctx:t}),n.$set(o)},i(t){i||(c(n.$$.fragment,t),i=!0)},o(t){a(n.$$.fragment,t),i=!1},d(t){y(n,t)}}}function $n(t){let n,i;return n=new un({props:{data:t[1]}}),{c(){f(n.$$.fragment)},m(t,e){h(n,t,e),i=!0},p(t,i){const e={};2&i&&(e.data=t[1]),n.$set(e)},i(t){i||(c(n.$$.fragment,t),i=!0)},o(t){a(n.$$.fragment,t),i=!1},d(t){y(n,t)}}}function fn(t){let n,i;return n=new un({props:{data:t[1]}}),{c(){f(n.$$.fragment)},m(t,e){h(n,t,e),i=!0},p(t,i){const e={};2&i&&(e.data=t[1]),n.$set(e)},i(t){i||(c(n.$$.fragment,t),i=!0)},o(t){a(n.$$.fragment,t),i=!1},d(t){y(n,t)}}}function hn(t){let n,i,e;const o=[t[4]];function s(n){t[7](n)}let r={$$slots:{default:[fn]},$$scope:{ctx:t}};for(let t=0;t<o.length;t+=1)r=O(r,o[t]);return void 0!==t[0]&&(r.elementRoot=t[0]),n=new Ut({props:r}),A.push((()=>J(n,"elementRoot",s))),{c(){f(n.$$.fragment)},m(t,i){h(n,t,i),e=!0},p(t,e){const s=16&e?m(o,[g(t[4])]):{};2050&e&&(s.$$scope={dirty:e,ctx:t}),!i&&1&e&&(i=!0,s.elementRoot=t[0],Q((()=>i=!1))),n.$set(s)},i(t){e||(c(n.$$.fragment,t),e=!0)},o(t){a(n.$$.fragment,t),e=!1},d(t){y(n,t)}}}function mn(t){let n,i,e,p;const d=[dn,pn],$=[];function f(t,n){return t[3]?0:1}return n=f(t),i=$[n]=d[n](t),{c(){i.c(),e=o()},m(t,i){$[n].m(t,i),s(t,e,i),p=!0},p(t,[o]){let s=n;n=f(t),n===s?$[n].p(t,o):(r(),a($[s],1,1,(()=>{$[s]=null})),l(),i=$[n],i?i.p(t,o):(i=$[n]=d[n](t),i.c()),c(i,1),i.m(e.parentNode,e))},i(t){p||(c(i),p=!0)},o(t){a(i),p=!1},d(t){$[n].d(t),t&&u(e)}}}function gn(t,n,i){let{elementRoot:e}=n,{data:o={}}=n;const s=lt("external").foundryApp,r=rt,a={duration:200};let l;const c={transition:void 0,inTransition:void 0,outTransition:void 0,transitionOptions:void 0,inTransitionOptions:void 0,outTransitionOptions:void 0},u={background:void 0,transition:void 0,inTransition:void 0,outTransition:void 0,transitionOptions:void 0,inTransitionOptions:void 0,outTransitionOptions:void 0};let p;return void 0===l&&(l="boolean"==typeof o?.modal&&o.modal),t.$$set=t=>{"elementRoot"in t&&i(0,e=t.elementRoot),"data"in t&&i(1,o=t.data)},t.$$.update=()=>{if(78&t.$$.dirty&&"object"==typeof o){const t=Number.isInteger(o.zIndex)||null===o.zIndex?o.zIndex:l?Number.MAX_SAFE_INTEGER:Number.MAX_SAFE_INTEGER-1;p!==t&&i(6,p=t);const n=o.draggable??!0;s.draggable!==n&&i(2,s.draggable=n,s);const e=o.popOut??!0;s.popOut!==e&&i(2,s.popOut=e,s);const r=o.resizable??!1;s.resizable!==r&&i(2,s.resizable=r,s);const a=o.title??"Dialog";a!==s?.options?.title&&i(2,s.title=a,s),s.zIndex!==p&&i(2,s.zIndex=p,s)}if(18&t.$$.dirty&&"object"==typeof o?.transition){const t=o.transition;t?.transition!==c.transition&&i(4,c.transition=t.transition,c),t?.inTransition!==c.inTransition&&i(4,c.inTransition=t.inTransition,c),t?.outTransition!==c.outTransition&&i(4,c.outTransition=t.outTransition,c),t?.transitionOptions!==c.transitionOptions&&i(4,c.transitionOptions=t.transitionOptions,c),t?.inTransitionOptions!==c.inTransitionOptions&&i(4,c.inTransitionOptions=t.inTransitionOptions,c),t?.outTransitionOptions!==c.outTransitionOptions&&i(4,c.outTransitionOptions=t.outTransitionOptions,c)}if(34&t.$$.dirty){const t="string"==typeof o?.modalOptions?.background?o.modalOptions.background:"#50505080";t!==u.background&&i(5,u.background=t,u)}if(34&t.$$.dirty)if("object"==typeof o?.modalOptions?.transition){const t=o.modalOptions.transition;t?.transition!==u.transition&&i(5,u.transition="function"==typeof t?.transition?t.transition:r,u),t?.inTransition!==u.inTransition&&i(5,u.inTransition=t.inTransition,u),t?.outTransition!==u.outTransition&&i(5,u.outTransition=t.outTransition,u),t?.transitionOptions!==u.transitionOptions&&i(5,u.transitionOptions="object"==typeof t?.transitionOptions?t.transitionOptions:a,u),t?.inTransitionOptions!==u.inTransitionOptions&&i(5,u.inTransitionOptions=t.inTransitionOptions,u),t?.outTransitionOptions!==u.outTransitionOptions&&i(5,u.outTransitionOptions=t.outTransitionOptions,u)}else{const t="function"==typeof o?.modalOptions?.transition?.transition?o.modalOptions.transition.transition:r;t!==u.transition&&i(5,u.transition=t,u);const n="object"==typeof o?.modalOptions?.transitionOptions?o.modalOptions.transitionOptions:a;n!==u.transitionOptions&&i(5,u.transitionOptions=n,u)}},[e,o,s,l,c,u,p,function(t){e=t,i(0,e)},function(t){e=t,i(0,e)}]}class yn extends t{constructor(t){super(),n(this,t,gn,mn,i,{elementRoot:0,data:1})}get elementRoot(){return this.$$.ctx[0]}set elementRoot(t){this.$$set({elementRoot:t}),e()}get data(){return this.$$.ctx[1]}set data(t){this.$$set({data:t}),e()}}export{Ut as ApplicationShell,un as DialogContent,yn as DialogShell,At as TJSApplicationHeader,Qt as TJSApplicationShell,yt as TJSComponentShell,ht as TJSContainer,en as TJSContextMenu,bt as TJSGlassPane,wt as TJSHeaderButton};
