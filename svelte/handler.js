function createMultiClick({single:e,double:t,delay:i=400,_clicks:c=0,_timer:l}={}){return()=>{1==++c?l=setTimeout((()=>{"function"==typeof e&&e(),c=0}),i):(clearTimeout(l),"function"==typeof t&&t(),c=0)}}export{createMultiClick};
//# sourceMappingURL=handler.js.map
