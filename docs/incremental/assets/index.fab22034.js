const Xe=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))i(o);new MutationObserver(o=>{for(const l of o)if(l.type==="childList")for(const r of l.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&i(r)}).observe(document,{childList:!0,subtree:!0});function n(o){const l={};return o.integrity&&(l.integrity=o.integrity),o.referrerpolicy&&(l.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?l.credentials="include":o.crossorigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function i(o){if(o.ep)return;o.ep=!0;const l=n(o);fetch(o.href,l)}};Xe();function W(){}const Fe=t=>t;function De(t){return t()}function ve(){return Object.create(null)}function G(t){t.forEach(De)}function ge(t){return typeof t=="function"}function Ye(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function et(t){return Object.keys(t).length===0}const Be=typeof window!="undefined";let Ve=Be?()=>window.performance.now():()=>Date.now(),_e=Be?t=>requestAnimationFrame(t):W;const K=new Set;function qe(t){K.forEach(e=>{e.c(t)||(K.delete(e),e.f())}),K.size!==0&&_e(qe)}function Je(t){let e;return K.size===0&&_e(qe),{promise:new Promise(n=>{K.add(e={c:t,f:n})}),abort(){K.delete(e)}}}function u(t,e){t.appendChild(e)}function Ze(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function tt(t){const e=b("style");return nt(Ze(t),e),e.sheet}function nt(t,e){u(t.head||t,e)}function L(t,e,n){t.insertBefore(e,n||null)}function x(t){t.parentNode.removeChild(t)}function ot(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function b(t){return document.createElement(t)}function J(t){return document.createTextNode(t)}function v(){return J(" ")}function rt(){return J("")}function Q(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function h(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function it(t){return Array.from(t.childNodes)}function oe(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function lt(t,e,n,i){n===null?t.style.removeProperty(e):t.style.setProperty(e,n,i?"important":"")}function A(t,e,n){t.classList[n?"add":"remove"](e)}function at(t,e,{bubbles:n=!1,cancelable:i=!1}={}){const o=document.createEvent("CustomEvent");return o.initCustomEvent(t,n,i,e),o}const fe=new Map;let de=0;function st(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function ct(t,e){const n={stylesheet:tt(e),rules:{}};return fe.set(t,n),n}function we(t,e,n,i,o,l,r,a=0){const s=16.666/i;let c=`{
`;for(let k=0;k<=1;k+=s){const y=e+(n-e)*l(k);c+=k*100+`%{${r(y,1-y)}}
`}const g=c+`100% {${r(n,1-n)}}
}`,f=`__svelte_${st(g)}_${a}`,p=Ze(t),{stylesheet:d,rules:_}=fe.get(p)||ct(p,t);_[f]||(_[f]=!0,d.insertRule(`@keyframes ${f} ${g}`,d.cssRules.length));const M=t.style.animation||"";return t.style.animation=`${M?`${M}, `:""}${f} ${i}ms linear ${o}ms 1 both`,de+=1,f}function me(t,e){const n=(t.style.animation||"").split(", "),i=n.filter(e?l=>l.indexOf(e)<0:l=>l.indexOf("__svelte")===-1),o=n.length-i.length;o&&(t.style.animation=i.join(", "),de-=o,de||ft())}function ft(){_e(()=>{de||(fe.forEach(t=>{const{stylesheet:e}=t;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.rules={}}),fe.clear())})}let ne;function ee(t){ne=t}function dt(){if(!ne)throw new Error("Function called outside component initialization");return ne}function ut(t){dt().$$.on_mount.push(t)}const Y=[],xe=[],se=[],Me=[],pt=Promise.resolve();let be=!1;function ht(){be||(be=!0,pt.then(We))}function D(t){se.push(t)}const he=new Set;let re=0;function We(){const t=ne;do{for(;re<Y.length;){const e=Y[re];re++,ee(e),wt(e.$$)}for(ee(null),Y.length=0,re=0;xe.length;)xe.pop()();for(let e=0;e<se.length;e+=1){const n=se[e];he.has(n)||(he.add(n),n())}se.length=0}while(Y.length);for(;Me.length;)Me.pop()();be=!1,he.clear(),ee(t)}function wt(t){if(t.fragment!==null){t.update(),G(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(D)}}let X;function Ke(){return X||(X=Promise.resolve(),X.then(()=>{X=null})),X}function te(t,e,n){t.dispatchEvent(at(`${e?"intro":"outro"}${n}`))}const ce=new Set;let q;function mt(){q={r:0,c:[],p:q}}function bt(){q.r||G(q.c),q=q.p}function Z(t,e){t&&t.i&&(ce.delete(t),t.i(e))}function ze(t,e,n,i){if(t&&t.o){if(ce.has(t))return;ce.add(t),q.c.push(()=>{ce.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}}const Ge={duration:0};function ie(t,e,n){let i=e(t,n),o=!1,l,r,a=0;function s(){l&&me(t,l)}function c(){const{delay:f=0,duration:p=300,easing:d=Fe,tick:_=W,css:M}=i||Ge;M&&(l=we(t,0,1,p,f,d,M,a++)),_(0,1);const k=Ve()+f,y=k+p;r&&r.abort(),o=!0,D(()=>te(t,!0,"start")),r=Je(E=>{if(o){if(E>=y)return _(1,0),te(t,!0,"end"),s(),o=!1;if(E>=k){const U=d((E-k)/p);_(U,1-U)}}return o})}let g=!1;return{start(){g||(g=!0,me(t),ge(i)?(i=i(),Ke().then(c)):c())},invalidate(){g=!1},end(){o&&(s(),o=!1)}}}function Ae(t,e,n,i){let o=e(t,n),l=i?0:1,r=null,a=null,s=null;function c(){s&&me(t,s)}function g(p,d){const _=p.b-l;return d*=Math.abs(_),{a:l,b:p.b,d:_,duration:d,start:p.start,end:p.start+d,group:p.group}}function f(p){const{delay:d=0,duration:_=300,easing:M=Fe,tick:k=W,css:y}=o||Ge,E={start:Ve()+d,b:p};p||(E.group=q,q.r+=1),r||a?a=E:(y&&(c(),s=we(t,l,p,_,d,M,y)),p&&k(0,1),r=g(E,_),D(()=>te(t,p,"start")),Je(U=>{if(a&&U>a.start&&(r=g(a,_),a=null,te(t,r.b,"start"),y&&(c(),s=we(t,l,r.b,r.duration,0,M,o.css))),r){if(U>=r.end)k(l=r.b,1-l),te(t,r.b,"end"),a||(r.b?c():--r.group.r||G(r.group.c)),r=null;else if(U>=r.start){const m=U-r.start;l=r.a+r.d*M(m/r.duration),k(l,1-l)}}return!!(r||a)}))}return{run(p){ge(o)?Ke().then(()=>{o=o(),f(p)}):f(p)},end(){c(),r=a=null}}}function gt(t,e,n,i){const{fragment:o,on_mount:l,on_destroy:r,after_update:a}=t.$$;o&&o.m(e,n),i||D(()=>{const s=l.map(De).filter(ge);r?r.push(...s):G(s),t.$$.on_mount=[]}),a.forEach(D)}function _t(t,e){const n=t.$$;n.fragment!==null&&(G(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function yt(t,e){t.$$.dirty[0]===-1&&(Y.push(t),ht(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function kt(t,e,n,i,o,l,r,a=[-1]){const s=ne;ee(t);const c=t.$$={fragment:null,ctx:null,props:l,update:W,not_equal:o,bound:ve(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(s?s.$$.context:[])),callbacks:ve(),dirty:a,skip_bound:!1,root:e.target||s.$$.root};r&&r(c.root);let g=!1;if(c.ctx=n?n(t,e.props||{},(f,p,...d)=>{const _=d.length?d[0]:p;return c.ctx&&o(c.ctx[f],c.ctx[f]=_)&&(!c.skip_bound&&c.bound[f]&&c.bound[f](_),g&&yt(t,f)),p}):[],c.update(),g=!0,G(c.before_update),c.fragment=i?i(c.ctx):!1,e.target){if(e.hydrate){const f=it(e.target);c.fragment&&c.fragment.l(f),f.forEach(x)}else c.fragment&&c.fragment.c();e.intro&&Z(t.$$.fragment),gt(t,e.target,e.anchor,e.customElement),We()}ee(s)}class vt{$destroy(){_t(this,1),this.$destroy=W}$on(e,n){const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const o=i.indexOf(n);o!==-1&&i.splice(o,1)}}$set(e){this.$$set&&!et(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function Qe(t){const e=t-1;return e*e*e+1}function le(t,{delay:e=0,duration:n=400,easing:i=Qe,x:o=0,y:l=0,opacity:r=0}={}){const a=getComputedStyle(t),s=+a.opacity,c=a.transform==="none"?"":a.transform,g=s*(1-r);return{delay:e,duration:n,easing:i,css:(f,p)=>`
			transform: ${c} translate(${(1-f)*o}px, ${(1-f)*l}px);
			opacity: ${s-g*p}`}}function Le(t,{delay:e=0,duration:n=400,easing:i=Qe}={}){const o=getComputedStyle(t),l=+o.opacity,r=parseFloat(o.height),a=parseFloat(o.paddingTop),s=parseFloat(o.paddingBottom),c=parseFloat(o.marginTop),g=parseFloat(o.marginBottom),f=parseFloat(o.borderTopWidth),p=parseFloat(o.borderBottomWidth);return{delay:e,duration:n,easing:i,css:d=>`overflow: hidden;opacity: ${Math.min(d*20,1)*l};height: ${d*r}px;padding-top: ${d*a}px;padding-bottom: ${d*s}px;margin-top: ${d*c}px;margin-bottom: ${d*g}px;border-top-width: ${d*f}px;border-bottom-width: ${d*p}px;`}}function Se(t,e,n){const i=t.slice();return i[17]=e[n],i}function Ee(t){let e,n,i,o,l,r,a,s,c,g,f,p;return{c(){e=b("div"),n=b("span"),i=v(),o=b("span"),l=J(t[2]),r=v(),a=b("span"),s=b("button"),s.innerHTML='<svg xmlns="http://www.w3.org/2000/svg" class="h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>',h(n,"class","w-8"),h(a,"class","w-8 inline-flex items-center justify-center"),h(e,"class","bg-red-500 h-12 px-4 text-white text-center flex items-center justify-between")},m(d,_){L(d,e,_),u(e,n),u(e,i),u(e,o),u(o,l),u(e,r),u(e,a),u(a,s),g=!0,f||(p=Q(s,"click",t[14]),f=!0)},p(d,_){(!g||_&4)&&oe(l,d[2])},i(d){g||(D(()=>{c||(c=Ae(e,Le,{},!0)),c.run(1)}),g=!0)},o(d){c||(c=Ae(e,Le,{},!1)),c.run(0),g=!1},d(d){d&&x(e),d&&c&&c.end(),f=!1,p()}}}function Ie(t){var ye;let e,n,i,o,l,r,a,s,c,g,f,p,d,_,M,k,y,E,U,m,R,B,z,V,F,ue,pe,I=!t[1]&&Ne(t),N=t[1]&&He(t),H=t[1]&&Te(t),T=((ye=t[0].email)==null?void 0:ye.length)&&je(t),j=t[1]&&Ce(t),P=t[0].phone&&Oe(t),C=t[1]&&$e(t),O=t[0].ethereum&&Re(t),$=t[1]&&Ue(t);return{c(){e=b("main"),n=b("section"),I&&I.c(),i=v(),o=b("li"),l=b("div"),r=b("div"),r.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11zm8.921 2.012a1 1 0 01.831 1.145 19.86 19.86 0 01-.545 2.436 1 1 0 11-1.92-.558c.207-.713.371-1.445.49-2.192a1 1 0 011.144-.83z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M10 10a1 1 0 011 1c0 2.236-.46 4.368-1.29 6.304a1 1 0 01-1.838-.789A13.952 13.952 0 009 11a1 1 0 011-1z" clip-rule="evenodd"></path></svg> 
					<label for="user-id" class="font-bold tracking-widest ml-2 uppercase">User ID</label>`,a=v(),N&&N.c(),s=v(),H&&H.c(),g=v(),f=b("li"),p=b("div"),p.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg> 
				<label for="email" class="font-bold tracking-widest ml-2 uppercase">Email</label>`,d=v(),T&&T.c(),_=v(),j&&j.c(),k=v(),y=b("li"),E=b("div"),E.innerHTML=`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg> 
			<label for="phone" class="font-bold tracking-widest ml-2 uppercase">Phone</label>`,U=v(),P&&P.c(),m=v(),C&&C.c(),B=v(),z=b("li"),V=b("div"),V.innerHTML=`<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor"><path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"></path></svg> 
				<label for="ethereum-address" class="font-bold tracking-widest ml-2 uppercase">Ethereum Address</label>`,F=v(),O&&O.c(),ue=v(),$&&$.c(),h(r,"class","flex items-center"),h(l,"class","flex items-center justify-between"),h(o,"class","rounded-2xl bg-white dark:bg-[#262626] shadow-lg p-8"),A(o,"opacity-30",!t[1]),h(p,"class","flex items-center"),h(f,"class","opacity-30 rounded-2xl bg-white dark:bg-[#262626] shadow-lg p-8"),A(f,"opacity-30",!t[1]),h(E,"class","flex items-center"),h(y,"class","opacity-30 rounded-2xl bg-white dark:bg-[#262626] shadow-lg p-8"),A(y,"opacity-30",!t[1]),h(V,"class","flex items-center"),h(z,"class","opacity-30 rounded-2xl bg-white dark:bg-[#262626] shadow-lg p-8"),A(z,"opacity-30",!t[1]),h(n,"class","px-4 -mt-16 max-w-2xl mx-auto space-y-4"),h(e,"class","z-50 relative pb-20")},m(w,S){L(w,e,S),u(e,n),I&&I.m(n,null),u(n,i),u(n,o),u(o,l),u(l,r),u(l,a),N&&N.m(l,null),u(o,s),H&&H.m(o,null),u(n,g),u(n,f),u(f,p),u(f,d),T&&T.m(f,null),u(f,_),j&&j.m(f,null),u(n,k),u(n,y),u(y,E),u(y,U),P&&P.m(y,null),u(y,m),C&&C.m(y,null),u(n,B),u(n,z),u(z,V),u(z,F),O&&O.m(z,null),u(z,ue),$&&$.m(z,null)},p(w,S){var ke;w[1]?I&&(I.d(1),I=null):I?I.p(w,S):(I=Ne(w),I.c(),I.m(n,i)),w[1]?N?N.p(w,S):(N=He(w),N.c(),N.m(l,null)):N&&(N.d(1),N=null),w[1]?H?H.p(w,S):(H=Te(w),H.c(),H.m(o,null)):H&&(H.d(1),H=null),S&2&&A(o,"opacity-30",!w[1]),(ke=w[0].email)!=null&&ke.length?T?T.p(w,S):(T=je(w),T.c(),T.m(f,_)):T&&(T.d(1),T=null),w[1]?j?j.p(w,S):(j=Ce(w),j.c(),j.m(f,null)):j&&(j.d(1),j=null),S&2&&A(f,"opacity-30",!w[1]),w[0].phone?P?P.p(w,S):(P=Oe(w),P.c(),P.m(y,m)):P&&(P.d(1),P=null),w[1]?C?C.p(w,S):(C=$e(w),C.c(),C.m(y,null)):C&&(C.d(1),C=null),S&2&&A(y,"opacity-30",!w[1]),w[0].ethereum?O?O.p(w,S):(O=Re(w),O.c(),O.m(z,ue)):O&&(O.d(1),O=null),w[1]?$?$.p(w,S):($=Ue(w),$.c(),$.m(z,null)):$&&($.d(1),$=null),S&2&&A(z,"opacity-30",!w[1])},i(w){c||D(()=>{c=ie(o,le,{y:40,delay:0}),c.start()}),M||D(()=>{M=ie(f,le,{y:40,delay:100}),M.start()}),R||D(()=>{R=ie(y,le,{y:40,delay:200}),R.start()}),pe||D(()=>{pe=ie(z,le,{y:40,delay:300}),pe.start()})},o:W,d(w){w&&x(e),I&&I.d(),N&&N.d(),H&&H.d(),T&&T.d(),j&&j.d(),P&&P.d(),C&&C.d(),O&&O.d(),$&&$.d()}}}function Ne(t){let e,n,i,o,l,r;return{c(){e=b("li"),n=b("button"),i=J("\u014D\xA0\xA0\xA0Continue with Hell\u014D"),h(n,"id","hello-login-btn"),h(n,"class",o=t[4]?"hello-btn-black-on-dark hello-btn-hover-flare":"hello-btn-white-on-light"),A(n,"hello-btn-loader",t[5]),h(e,"class","relative rounded-2xl bg-white dark:bg-[#262626] shadow-lg p-8 flex items-center justify-center")},m(a,s){L(a,e,s),u(e,n),u(n,i),l||(r=Q(n,"click",t[9]),l=!0)},p(a,s){s&16&&o!==(o=a[4]?"hello-btn-black-on-dark hello-btn-hover-flare":"hello-btn-white-on-light")&&h(n,"class",o),s&48&&A(n,"hello-btn-loader",a[5])},d(a){a&&x(e),l=!1,r()}}}function He(t){let e,n,i;return{c(){e=b("button"),e.textContent="Log Out",h(e,"id","log-out-btn"),h(e,"class","hover:underline font-medium")},m(o,l){L(o,e,l),n||(i=Q(e,"click",t[10]),n=!0)},p:W,d(o){o&&x(e),n=!1,i()}}}function Te(t){let e,n=t[0].sub+"",i;return{c(){e=b("span"),i=J(n),h(e,"id","user-id"),h(e,"class","block text-xl mt-3 break-all font-mono")},m(o,l){L(o,e,l),u(e,i)},p(o,l){l&1&&n!==(n=o[0].sub+"")&&oe(i,n)},d(o){o&&x(e)}}}function je(t){let e,n=t[0].email,i=[];for(let o=0;o<n.length;o+=1)i[o]=Pe(Se(t,n,o));return{c(){e=b("ul");for(let o=0;o<i.length;o+=1)i[o].c();h(e,"id","email"),h(e,"class","text-xl mt-3 space-y-2")},m(o,l){L(o,e,l);for(let r=0;r<i.length;r+=1)i[r].m(e,null)},p(o,l){if(l&1){n=o[0].email;let r;for(r=0;r<n.length;r+=1){const a=Se(o,n,r);i[r]?i[r].p(a,l):(i[r]=Pe(a),i[r].c(),i[r].m(e,null))}for(;r<i.length;r+=1)i[r].d(1);i.length=n.length}},d(o){o&&x(e),ot(i,o)}}}function Pe(t){let e,n=t[17]+"",i,o;return{c(){e=b("li"),i=J(n),o=v(),h(e,"class","break-all")},m(l,r){L(l,e,r),u(e,i),u(e,o)},p(l,r){r&1&&n!==(n=l[17]+"")&&oe(i,n)},d(l){l&&x(e)}}}function Ce(t){let e,n=t[0].email.length?"\u014D&nbsp;&nbsp;&nbsp;Add another with Hell\u014D":"\u014D&nbsp;&nbsp;&nbsp;Add with Hell\u014D",i,o,l;return{c(){e=b("button"),e.disabled=t[6],h(e,"class",i=(t[4]?"hello-btn-white-and-static":"hello-btn-white-on-light")+" mt-3"),A(e,"hello-btn-loader",t[6])},m(r,a){L(r,e,a),e.innerHTML=n,o||(l=Q(e,"click",t[11]),o=!0)},p(r,a){a&1&&n!==(n=r[0].email.length?"\u014D&nbsp;&nbsp;&nbsp;Add another with Hell\u014D":"\u014D&nbsp;&nbsp;&nbsp;Add with Hell\u014D")&&(e.innerHTML=n),a&64&&(e.disabled=r[6]),a&16&&i!==(i=(r[4]?"hello-btn-white-and-static":"hello-btn-white-on-light")+" mt-3")&&h(e,"class",i),a&80&&A(e,"hello-btn-loader",r[6])},d(r){r&&x(e),o=!1,l()}}}function Oe(t){let e,n,i=t[0].phone+"",o;return{c(){e=b("ul"),n=b("li"),o=J(i),h(n,"class","break-all"),h(e,"id","phone"),h(e,"class","text-xl mt-3 space-y-2")},m(l,r){L(l,e,r),u(e,n),u(n,o)},p(l,r){r&1&&i!==(i=l[0].phone+"")&&oe(o,i)},d(l){l&&x(e)}}}function $e(t){let e,n=t[0].phone?"\u014D&nbsp;&nbsp;&nbsp;Update with Hell\u014D":"\u014D&nbsp;&nbsp;&nbsp;Add with Hell\u014D",i,o,l;return{c(){e=b("button"),e.disabled=t[7],h(e,"class",i=(t[4]?"hello-btn-white-and-static":"hello-btn-white-on-light")+" mt-3"),A(e,"hello-btn-loader",t[7])},m(r,a){L(r,e,a),e.innerHTML=n,o||(l=Q(e,"click",t[12]),o=!0)},p(r,a){a&1&&n!==(n=r[0].phone?"\u014D&nbsp;&nbsp;&nbsp;Update with Hell\u014D":"\u014D&nbsp;&nbsp;&nbsp;Add with Hell\u014D")&&(e.innerHTML=n),a&128&&(e.disabled=r[7]),a&16&&i!==(i=(r[4]?"hello-btn-white-and-static":"hello-btn-white-on-light")+" mt-3")&&h(e,"class",i),a&144&&A(e,"hello-btn-loader",r[7])},d(r){r&&x(e),o=!1,l()}}}function Re(t){let e,n,i=t[0].ethereum+"",o;return{c(){e=b("ul"),n=b("li"),o=J(i),h(n,"class","break-all font-mono"),h(e,"id","ethereum-address"),h(e,"class","text-xl mt-3 space-y-2")},m(l,r){L(l,e,r),u(e,n),u(n,o)},p(l,r){r&1&&i!==(i=l[0].ethereum+"")&&oe(o,i)},d(l){l&&x(e)}}}function Ue(t){let e,n=t[0].ethereum?"\u014D&nbsp;&nbsp;&nbsp;Update with Hell\u014D":"\u014D&nbsp;&nbsp;&nbsp;Add with Hell\u014D",i,o,l;return{c(){e=b("button"),e.disabled=t[8],h(e,"class",i=(t[4]?"hello-btn-white-and-static":"hello-btn-white-on-light")+" mt-3"),A(e,"hello-btn-loader",t[8])},m(r,a){L(r,e,a),e.innerHTML=n,o||(l=Q(e,"click",t[13]),o=!0)},p(r,a){a&1&&n!==(n=r[0].ethereum?"\u014D&nbsp;&nbsp;&nbsp;Update with Hell\u014D":"\u014D&nbsp;&nbsp;&nbsp;Add with Hell\u014D")&&(e.innerHTML=n),a&256&&(e.disabled=r[8]),a&16&&i!==(i=(r[4]?"hello-btn-white-and-static":"hello-btn-white-on-light")+" mt-3")&&h(e,"class",i),a&272&&A(e,"hello-btn-loader",r[8])},d(r){r&&x(e),o=!1,l()}}}function xt(t){let e,n,i,o,l,r=t[2]&&Ee(t),a=t[3]&&Ie(t);return{c(){r&&r.c(),e=v(),n=b("header"),n.innerHTML=`<h1 class="mt-16 text-3xl font-semibold text-center z-50 text-gray-700 dark:text-white">Incremental Profile Demo</h1> 
	<span class="absolute w-full left-0 h-56 bg-gradient-to-b from-transparent to-white dark:to-[#161616]"></span>`,i=v(),a&&a.c(),o=rt(),h(n,"class","h-56 w-full flex justify-center px-4 bg-top bg-no-repeat bg-cover from-red-500 to-transparent"),lt(n,"background-image","url(banner.jpeg)")},m(s,c){r&&r.m(s,c),L(s,e,c),L(s,n,c),L(s,i,c),a&&a.m(s,c),L(s,o,c),l=!0},p(s,[c]){s[2]?r?(r.p(s,c),c&4&&Z(r,1)):(r=Ee(s),r.c(),Z(r,1),r.m(e.parentNode,e)):r&&(mt(),ze(r,1,1,()=>{r=null}),bt()),s[3]?a?(a.p(s,c),c&8&&Z(a,1)):(a=Ie(s),a.c(),Z(a,1),a.m(o.parentNode,o)):a&&(a.d(1),a=null)},i(s){l||(Z(r),Z(a),l=!0)},o(s){ze(r),l=!1},d(s){r&&r.d(s),s&&x(e),s&&x(n),s&&x(i),a&&a.d(s),s&&x(o)}}}function ae(){return([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,t=>(t^crypto.getRandomValues(new Uint8Array(1))[0]&15>>t/4).toString(16))}function Mt(t,e,n){const i={AUTHORIZATION_ENDPOINT:"https://consent.hello.coop/",CLIENT_ID:"1693bedb-58ac-4ba1-a95b-a72effc71dfb"},o=Object.preventExtensions({sub:"",email:[],phone:"",ethereum:""});let l=!1,r="";const a=new URL(i.AUTHORIZATION_ENDPOINT);a.searchParams.set("client_id",i.CLIENT_ID),a.searchParams.set("redirect_uri",window.location.origin+window.location.pathname),a.searchParams.set("response_type","id_token");let s=!1,c=!1;ut(async()=>{if(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches&&n(4,c=!0),window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change",m=>{m.matches?n(4,c=!0):n(4,c=!1)}),sessionStorage.data)try{const m=JSON.parse(sessionStorage.data);for(const R in m)n(0,o[R]=m[R],o)}catch(m){console.error(m),sessionStorage.removeItem("data")}if(window.location.hash){const m=new URLSearchParams(window.location.hash.substring(1));if(m.has("id_token")){const R=new URL("/oauth/introspect",i.AUTHORIZATION_ENDPOINT),B={token:m.get("id_token"),client_id:i.CLIENT_ID,nonce:sessionStorage.nonce};sessionStorage.removeItem("nonce");try{const V=await(await fetch(R,{method:"POST",mode:"cors",cache:"no-cache",headers:{"Content-type":"application/x-www-form-urlencoded"},body:new URLSearchParams(B).toString()})).json();for(const F in o)!V[F]||(Array.isArray(o[F])?(o[F].push(V[F]),n(0,o[F]=[...new Set(o[F])],o)):n(0,o[F]=V[F],o));sessionStorage.setItem("data",JSON.stringify(o)),console.info("Introspection Response:",JSON.stringify(V,null,2))}catch(z){console.error(z)}}if(m.has("error")){const R={access_denied:"User cancelled request"},B=m.get("error");R[B]&&n(2,r=R[B])}history.replaceState(null,null," ")}n(3,s=!0)});let g=!1;function f(){n(5,g=!0);const m=ae();sessionStorage.setItem("nonce",m),a.searchParams.set("scope","openid"),a.searchParams.set("nonce",m),window.location.href=a.href}function p(){sessionStorage.clear(),n(1,l=!1);for(const m in o)Array.isArray(o[m])?n(0,o[m]=[],o):n(0,o[m]="",o)}let d=!1;function _(){n(6,d=!0);const m=ae();sessionStorage.setItem("nonce",m),a.searchParams.set("scope","openid email profile_update"),a.searchParams.set("nonce",m),window.location.href=a.href}let M=!1;function k(){n(7,M=!0);const m=ae();sessionStorage.setItem("nonce",m),a.searchParams.set("scope","openid phone profile_update"),a.searchParams.set("nonce",m),window.location.href=a.href}let y=!1;function E(){n(8,y=!0);const m=ae();sessionStorage.setItem("nonce",m),a.searchParams.set("scope","openid ethereum profile_update"),a.searchParams.set("nonce",m),window.location.href=a.href}const U=()=>n(2,r="");return t.$$.update=()=>{if(t.$$.dirty&1){o.sub&&n(1,l=!0);const{email:m,phone:R,ethereum:B}=o;(m.length||R.length||B.length)&&n(1,l=!0)}},[o,l,r,s,c,g,d,M,y,f,p,_,k,E,U]}class zt extends vt{constructor(e){super(),kt(this,e,Mt,xt,Ye,{})}}new zt({target:document.getElementById("app")});
