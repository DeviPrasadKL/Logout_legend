import{E as h,p as b,r as p,c as x,m as s,_ as D,j as c,n as m}from"./index-D42QtNAg.js";import{s as u,b as q,M as G,P as j,c as v,d as J,e as Q,f as C,F as Z,a as oo}from"./ThemeChanger-BCtVSfAP.js";function eo(o){return b("MuiDialog",o)}const P=h("MuiDialog",["root","scrollPaper","scrollBody","container","paper","paperScrollPaper","paperScrollBody","paperWidthFalse","paperWidthXs","paperWidthSm","paperWidthMd","paperWidthLg","paperWidthXl","paperFullWidth","paperFullScreen"]),A=p.createContext({}),ao=["aria-describedby","aria-labelledby","BackdropComponent","BackdropProps","children","className","disableEscapeKeyDown","fullScreen","fullWidth","maxWidth","onBackdropClick","onClick","onClose","open","PaperComponent","PaperProps","scroll","TransitionComponent","transitionDuration","TransitionProps"],to=u(q,{name:"MuiDialog",slot:"Backdrop",overrides:(o,e)=>e.backdrop})({zIndex:-1}),so=o=>{const{classes:e,scroll:a,maxWidth:t,fullWidth:r,fullScreen:i}=o,n={root:["root"],container:["container",`scroll${x(a)}`],paper:["paper",`paperScroll${x(a)}`,`paperWidth${x(String(t))}`,r&&"paperFullWidth",i&&"paperFullScreen"]};return C(n,eo,e)},io=u(G,{name:"MuiDialog",slot:"Root",overridesResolver:(o,e)=>e.root})({"@media print":{position:"absolute !important"}}),ro=u("div",{name:"MuiDialog",slot:"Container",overridesResolver:(o,e)=>{const{ownerState:a}=o;return[e.container,e[`scroll${x(a.scroll)}`]]}})(({ownerState:o})=>s({height:"100%","@media print":{height:"auto"},outline:0},o.scroll==="paper"&&{display:"flex",justifyContent:"center",alignItems:"center"},o.scroll==="body"&&{overflowY:"auto",overflowX:"hidden",textAlign:"center","&::after":{content:'""',display:"inline-block",verticalAlign:"middle",height:"100%",width:"0"}})),lo=u(j,{name:"MuiDialog",slot:"Paper",overridesResolver:(o,e)=>{const{ownerState:a}=o;return[e.paper,e[`scrollPaper${x(a.scroll)}`],e[`paperWidth${x(String(a.maxWidth))}`],a.fullWidth&&e.paperFullWidth,a.fullScreen&&e.paperFullScreen]}})(({theme:o,ownerState:e})=>s({margin:32,position:"relative",overflowY:"auto","@media print":{overflowY:"visible",boxShadow:"none"}},e.scroll==="paper"&&{display:"flex",flexDirection:"column",maxHeight:"calc(100% - 64px)"},e.scroll==="body"&&{display:"inline-block",verticalAlign:"middle",textAlign:"left"},!e.maxWidth&&{maxWidth:"calc(100% - 64px)"},e.maxWidth==="xs"&&{maxWidth:o.breakpoints.unit==="px"?Math.max(o.breakpoints.values.xs,444):`max(${o.breakpoints.values.xs}${o.breakpoints.unit}, 444px)`,[`&.${P.paperScrollBody}`]:{[o.breakpoints.down(Math.max(o.breakpoints.values.xs,444)+32*2)]:{maxWidth:"calc(100% - 64px)"}}},e.maxWidth&&e.maxWidth!=="xs"&&{maxWidth:`${o.breakpoints.values[e.maxWidth]}${o.breakpoints.unit}`,[`&.${P.paperScrollBody}`]:{[o.breakpoints.down(o.breakpoints.values[e.maxWidth]+32*2)]:{maxWidth:"calc(100% - 64px)"}}},e.fullWidth&&{width:"calc(100% - 64px)"},e.fullScreen&&{margin:0,width:"100%",maxWidth:"100%",height:"100%",maxHeight:"none",borderRadius:0,[`&.${P.paperScrollBody}`]:{margin:0,maxWidth:"100%"}})),yo=p.forwardRef(function(e,a){const t=v({props:e,name:"MuiDialog"}),r=J(),i={enter:r.transitions.duration.enteringScreen,exit:r.transitions.duration.leavingScreen},{"aria-describedby":n,"aria-labelledby":l,BackdropComponent:d,BackdropProps:k,children:U,className:F,disableEscapeKeyDown:$=!1,fullScreen:_=!1,fullWidth:I=!1,maxWidth:E="sm",onBackdropClick:R,onClick:T,onClose:W,open:w,PaperComponent:L=j,PaperProps:B={},scroll:Y="paper",TransitionComponent:X=Z,transitionDuration:N=i,TransitionProps:z}=t,H=D(t,ao),f=s({},t,{disableEscapeKeyDown:$,fullScreen:_,fullWidth:I,maxWidth:E,scroll:Y}),y=so(f),M=p.useRef(),K=g=>{M.current=g.target===g.currentTarget},O=g=>{T&&T(g),M.current&&(M.current=null,R&&R(g),W&&W(g,"backdropClick"))},S=Q(l),V=p.useMemo(()=>({titleId:S}),[S]);return c.jsx(io,s({className:m(y.root,F),closeAfterTransition:!0,components:{Backdrop:to},componentsProps:{backdrop:s({transitionDuration:N,as:d},k)},disableEscapeKeyDown:$,onClose:W,open:w,ref:a,onClick:O,ownerState:f},H,{children:c.jsx(X,s({appear:!0,in:w,timeout:N,role:"presentation"},z,{children:c.jsx(ro,{className:m(y.container),onMouseDown:K,ownerState:f,children:c.jsx(lo,s({as:L,elevation:24,role:"dialog","aria-describedby":n,"aria-labelledby":S},B,{className:m(y.paper,B.className),ownerState:f,children:c.jsx(A.Provider,{value:V,children:U})}))})}))}))});function no(o){return b("MuiDialogActions",o)}h("MuiDialogActions",["root","spacing"]);const co=["className","disableSpacing"],po=o=>{const{classes:e,disableSpacing:a}=o;return C({root:["root",!a&&"spacing"]},no,e)},uo=u("div",{name:"MuiDialogActions",slot:"Root",overridesResolver:(o,e)=>{const{ownerState:a}=o;return[e.root,!a.disableSpacing&&e.spacing]}})(({ownerState:o})=>s({display:"flex",alignItems:"center",padding:8,justifyContent:"flex-end",flex:"0 0 auto"},!o.disableSpacing&&{"& > :not(style) ~ :not(style)":{marginLeft:8}})),Mo=p.forwardRef(function(e,a){const t=v({props:e,name:"MuiDialogActions"}),{className:r,disableSpacing:i=!1}=t,n=D(t,co),l=s({},t,{disableSpacing:i}),d=po(l);return c.jsx(uo,s({className:m(d.root,r),ownerState:l,ref:a},n))});function go(o){return b("MuiDialogContent",o)}h("MuiDialogContent",["root","dividers"]);function xo(o){return b("MuiDialogTitle",o)}const mo=h("MuiDialogTitle",["root"]),fo=["className","dividers"],ho=o=>{const{classes:e,dividers:a}=o;return C({root:["root",a&&"dividers"]},go,e)},bo=u("div",{name:"MuiDialogContent",slot:"Root",overridesResolver:(o,e)=>{const{ownerState:a}=o;return[e.root,a.dividers&&e.dividers]}})(({theme:o,ownerState:e})=>s({flex:"1 1 auto",WebkitOverflowScrolling:"touch",overflowY:"auto",padding:"20px 24px"},e.dividers?{padding:"16px 24px",borderTop:`1px solid ${(o.vars||o).palette.divider}`,borderBottom:`1px solid ${(o.vars||o).palette.divider}`}:{[`.${mo.root} + &`]:{paddingTop:0}})),So=p.forwardRef(function(e,a){const t=v({props:e,name:"MuiDialogContent"}),{className:r,dividers:i=!1}=t,n=D(t,fo),l=s({},t,{dividers:i}),d=ho(l);return c.jsx(bo,s({className:m(d.root,r),ownerState:l,ref:a},n))}),Do=["className","id"],vo=o=>{const{classes:e}=o;return C({root:["root"]},xo,e)},Co=u(oo,{name:"MuiDialogTitle",slot:"Root",overridesResolver:(o,e)=>e.root})({padding:"16px 24px",flex:"0 0 auto"}),Po=p.forwardRef(function(e,a){const t=v({props:e,name:"MuiDialogTitle"}),{className:r,id:i}=t,n=D(t,Do),l=t,d=vo(l),{titleId:k=i}=p.useContext(A);return c.jsx(Co,s({component:"h2",className:m(d.root,r),ownerState:l,ref:a,variant:"h6",id:i??k},n))});export{yo as D,Po as a,So as b,Mo as c};