function e({single:e,double:t,delay:o=400,_clicks:i=0,_timer:n}={}){return()=>{1==++i?n=setTimeout((()=>{"function"==typeof e&&e(),i=0}),o):(clearTimeout(n),"function"==typeof t&&t(),i=0)}}export{e as createMultiClick};
//# sourceMappingURL=handler.js.map
