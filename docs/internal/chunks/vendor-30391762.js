function g(){}const D=t=>t;function ut(t,e){for(const n in e)t[n]=e[n];return t}function J(t){return t()}function K(){return Object.create(null)}function b(t){t.forEach(J)}function L(t){return typeof t=="function"}function at(t,e){return t!=t?e==e:t!==e||t&&typeof t=="object"||typeof t=="function"}function ft(t){return Object.keys(t).length===0}function Dt(t,e,n,i){if(t){const s=Q(t,e,n,i);return t[0](s)}}function Q(t,e,n,i){return t[1]&&i?ut(n.ctx.slice(),t[1](i(e))):n.ctx}function Lt(t,e,n,i){if(t[2]&&i){const s=t[2](i(n));if(e.dirty===void 0)return s;if(typeof s=="object"){const u=[],r=Math.max(e.dirty.length,s.length);for(let o=0;o<r;o+=1)u[o]=e.dirty[o]|s[o];return u}return e.dirty|s}return e.dirty}function Pt(t,e,n,i,s,u){if(s){const r=Q(e,n,i,u);t.p(r,s)}}function Tt(t){if(t.ctx.length>32){const e=[],n=t.ctx.length/32;for(let i=0;i<n;i++)e[i]=-1;return e}return-1}const U=typeof window!="undefined";let V=U?()=>window.performance.now():()=>Date.now(),P=U?t=>requestAnimationFrame(t):g;const $=new Set;function X(t){$.forEach(e=>{e.c(t)||($.delete(e),e.f())}),$.size!==0&&P(X)}function Y(t){let e;return $.size===0&&P(X),{promise:new Promise(n=>{$.add(e={c:t,f:n})}),abort(){$.delete(e)}}}let j=!1;function _t(){j=!0}function dt(){j=!1}function ht(t,e,n,i){for(;t<e;){const s=t+(e-t>>1);n(s)<=i?t=s+1:e=s}return t}function mt(t){if(t.hydrate_init)return;t.hydrate_init=!0;let e=t.childNodes;if(t.nodeName==="HEAD"){const c=[];for(let l=0;l<e.length;l++){const _=e[l];_.claim_order!==void 0&&c.push(_)}e=c}const n=new Int32Array(e.length+1),i=new Int32Array(e.length);n[0]=-1;let s=0;for(let c=0;c<e.length;c++){const l=e[c].claim_order,_=(s>0&&e[n[s]].claim_order<=l?s+1:ht(1,s,a=>e[n[a]].claim_order,l))-1;i[c]=n[_]+1;const f=_+1;n[f]=c,s=Math.max(f,s)}const u=[],r=[];let o=e.length-1;for(let c=n[s]+1;c!=0;c=i[c-1]){for(u.push(e[c-1]);o>=c;o--)r.push(e[o]);o--}for(;o>=0;o--)r.push(e[o]);u.reverse(),r.sort((c,l)=>c.claim_order-l.claim_order);for(let c=0,l=0;c<r.length;c++){for(;l<u.length&&r[c].claim_order>=u[l].claim_order;)l++;const _=l<u.length?u[l]:null;t.insertBefore(r[c],_)}}function pt(t,e){t.appendChild(e)}function Z(t){if(!t)return document;const e=t.getRootNode?t.getRootNode():t.ownerDocument;return e&&e.host?e:t.ownerDocument}function yt(t){const e=tt("style");return gt(Z(t),e),e}function gt(t,e){pt(t.head||t,e)}function bt(t,e){if(j){for(mt(t),(t.actual_end_child===void 0||t.actual_end_child!==null&&t.actual_end_child.parentElement!==t)&&(t.actual_end_child=t.firstChild);t.actual_end_child!==null&&t.actual_end_child.claim_order===void 0;)t.actual_end_child=t.actual_end_child.nextSibling;e!==t.actual_end_child?(e.claim_order!==void 0||e.parentNode!==t)&&t.insertBefore(e,t.actual_end_child):t.actual_end_child=e.nextSibling}else(e.parentNode!==t||e.nextSibling!==null)&&t.appendChild(e)}function Bt(t,e,n){j&&!n?bt(t,e):(e.parentNode!==t||e.nextSibling!=n)&&t.insertBefore(e,n||null)}function xt(t){t.parentNode.removeChild(t)}function Ft(t,e){for(let n=0;n<t.length;n+=1)t[n]&&t[n].d(e)}function tt(t){return document.createElement(t)}function $t(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function T(t){return document.createTextNode(t)}function Ht(){return T(" ")}function It(){return T("")}function Wt(t,e,n,i){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n,i)}function Gt(t,e,n){n==null?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function wt(t){return Array.from(t.childNodes)}function vt(t){t.claim_info===void 0&&(t.claim_info={last_index:0,total_claimed:0})}function et(t,e,n,i,s=!1){vt(t);const u=(()=>{for(let r=t.claim_info.last_index;r<t.length;r++){const o=t[r];if(e(o)){const c=n(o);return c===void 0?t.splice(r,1):t[r]=c,s||(t.claim_info.last_index=r),o}}for(let r=t.claim_info.last_index-1;r>=0;r--){const o=t[r];if(e(o)){const c=n(o);return c===void 0?t.splice(r,1):t[r]=c,s?c===void 0&&t.claim_info.last_index--:t.claim_info.last_index=r,o}}return i()})();return u.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,u}function nt(t,e,n,i){return et(t,s=>s.nodeName===e,s=>{const u=[];for(let r=0;r<s.attributes.length;r++){const o=s.attributes[r];n[o.name]||u.push(o.name)}u.forEach(r=>s.removeAttribute(r))},()=>i(e))}function Jt(t,e,n){return nt(t,e,n,tt)}function Kt(t,e,n){return nt(t,e,n,$t)}function Et(t,e){return et(t,n=>n.nodeType===3,n=>{const i=""+e;if(n.data.startsWith(i)){if(n.data.length!==i.length)return n.splitText(i.length)}else n.data=i},()=>T(e),!0)}function Qt(t){return Et(t," ")}function Ut(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function Vt(t,e,n,i){t.style.setProperty(e,n,i?"important":"")}function Xt(t,e,n){t.classList[n?"add":"remove"](e)}function kt(t,e,n=!1){const i=document.createEvent("CustomEvent");return i.initCustomEvent(t,n,!1,e),i}function Yt(t,e=document.body){return Array.from(e.querySelectorAll(t))}const B=new Set;let q=0;function St(t){let e=5381,n=t.length;for(;n--;)e=(e<<5)-e^t.charCodeAt(n);return e>>>0}function F(t,e,n,i,s,u,r,o=0){const c=16.666/i;let l=`{
`;for(let m=0;m<=1;m+=c){const x=e+(n-e)*u(m);l+=m*100+`%{${r(x,1-x)}}
`}const _=l+`100% {${r(n,1-n)}}
}`,f=`__svelte_${St(_)}_${o}`,a=Z(t);B.add(a);const d=a.__svelte_stylesheet||(a.__svelte_stylesheet=yt(t).sheet),h=a.__svelte_rules||(a.__svelte_rules={});h[f]||(h[f]=!0,d.insertRule(`@keyframes ${f} ${_}`,d.cssRules.length));const p=t.style.animation||"";return t.style.animation=`${p?`${p}, `:""}${f} ${i}ms linear ${s}ms 1 both`,q+=1,f}function it(t,e){const n=(t.style.animation||"").split(", "),i=n.filter(e?u=>u.indexOf(e)<0:u=>u.indexOf("__svelte")===-1),s=n.length-i.length;s&&(t.style.animation=i.join(", "),q-=s,q||At())}function At(){P(()=>{q||(B.forEach(t=>{const e=t.__svelte_stylesheet;let n=e.cssRules.length;for(;n--;)e.deleteRule(n);t.__svelte_rules={}}),B.clear())})}let v;function E(t){v=t}function H(){if(!v)throw new Error("Function called outside component initialization");return v}function Zt(t){H().$$.on_mount.push(t)}function te(t){H().$$.after_update.push(t)}function ee(t,e){H().$$.context.set(t,e)}const k=[],rt=[],M=[],I=[],Ct=Promise.resolve();let W=!1;function Nt(){W||(W=!0,Ct.then(st))}function S(t){M.push(t)}function ne(t){I.push(t)}const G=new Set;let O=0;function st(){const t=v;do{for(;O<k.length;){const e=k[O];O++,E(e),jt(e.$$)}for(E(null),k.length=0,O=0;rt.length;)rt.pop()();for(let e=0;e<M.length;e+=1){const n=M[e];G.has(n)||(G.add(n),n())}M.length=0}while(k.length);for(;I.length;)I.pop()();W=!1,G.clear(),E(t)}function jt(t){if(t.fragment!==null){t.update(),b(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(S)}}let A;function ct(){return A||(A=Promise.resolve(),A.then(()=>{A=null})),A}function C(t,e,n){t.dispatchEvent(kt(`${e?"intro":"outro"}${n}`))}const R=new Set;let y;function ie(){y={r:0,c:[],p:y}}function re(){y.r||b(y.c),y=y.p}function qt(t,e){t&&t.i&&(R.delete(t),t.i(e))}function se(t,e,n,i){if(t&&t.o){if(R.has(t))return;R.add(t),y.c.push(()=>{R.delete(t),i&&(n&&t.d(1),i())}),t.o(e)}}const ot={duration:0};function ce(t,e,n){let i=e(t,n),s=!0,u;const r=y;r.r+=1;function o(){const{delay:c=0,duration:l=300,easing:_=D,tick:f=g,css:a}=i||ot;a&&(u=F(t,1,0,l,c,_,a));const d=V()+c,h=d+l;S(()=>C(t,!1,"start")),Y(p=>{if(s){if(p>=h)return f(0,1),C(t,!1,"end"),--r.r||b(r.c),!1;if(p>=d){const m=_((p-d)/l);f(1-m,m)}}return s})}return L(i)?ct().then(()=>{i=i(),o()}):o(),{end(c){c&&i.tick&&i.tick(1,0),s&&(u&&it(t,u),s=!1)}}}function oe(t,e,n,i){let s=e(t,n),u=i?0:1,r=null,o=null,c=null;function l(){c&&it(t,c)}function _(a,d){const h=a.b-u;return d*=Math.abs(h),{a:u,b:a.b,d:h,duration:d,start:a.start,end:a.start+d,group:a.group}}function f(a){const{delay:d=0,duration:h=300,easing:p=D,tick:m=g,css:x}=s||ot,z={start:V()+d,b:a};a||(z.group=y,y.r+=1),r||o?o=z:(x&&(l(),c=F(t,u,a,h,d,p,x)),a&&m(0,1),r=_(z,h),S(()=>C(t,a,"start")),Y(N=>{if(o&&N>o.start&&(r=_(o,h),o=null,C(t,r.b,"start"),x&&(l(),c=F(t,u,r.b,r.duration,0,p,s.css))),r){if(N>=r.end)m(u=r.b,1-u),C(t,r.b,"end"),o||(r.b?l():--r.group.r||b(r.group.c)),r=null;else if(N>=r.start){const lt=N-r.start;u=r.a+r.d*p(lt/r.duration),m(u,1-u)}}return!!(r||o)}))}return{run(a){L(s)?ct().then(()=>{s=s(),f(a)}):f(a)},end(){l(),r=o=null}}}function le(t,e){const n={},i={},s={$$scope:1};let u=t.length;for(;u--;){const r=t[u],o=e[u];if(o){for(const c in r)c in o||(i[c]=1);for(const c in o)s[c]||(n[c]=o[c],s[c]=1);t[u]=o}else for(const c in r)s[c]=1}for(const r in i)r in n||(n[r]=void 0);return n}function ue(t){return typeof t=="object"&&t!==null?t:{}}function ae(t,e,n){const i=t.$$.props[e];i!==void 0&&(t.$$.bound[i]=n,n(t.$$.ctx[i]))}function fe(t){t&&t.c()}function _e(t,e){t&&t.l(e)}function Mt(t,e,n,i){const{fragment:s,on_mount:u,on_destroy:r,after_update:o}=t.$$;s&&s.m(e,n),i||S(()=>{const c=u.map(J).filter(L);r?r.push(...c):b(c),t.$$.on_mount=[]}),o.forEach(S)}function Ot(t,e){const n=t.$$;n.fragment!==null&&(b(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}function Rt(t,e){t.$$.dirty[0]===-1&&(k.push(t),Nt(),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function de(t,e,n,i,s,u,r,o=[-1]){const c=v;E(t);const l=t.$$={fragment:null,ctx:null,props:u,update:g,not_equal:s,bound:K(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(e.context||(c?c.$$.context:[])),callbacks:K(),dirty:o,skip_bound:!1,root:e.target||c.$$.root};r&&r(l.root);let _=!1;if(l.ctx=n?n(t,e.props||{},(f,a,...d)=>{const h=d.length?d[0]:a;return l.ctx&&s(l.ctx[f],l.ctx[f]=h)&&(!l.skip_bound&&l.bound[f]&&l.bound[f](h),_&&Rt(t,f)),a}):[],l.update(),_=!0,b(l.before_update),l.fragment=i?i(l.ctx):!1,e.target){if(e.hydrate){_t();const f=wt(e.target);l.fragment&&l.fragment.l(f),f.forEach(xt)}else l.fragment&&l.fragment.c();e.intro&&qt(t.$$.fragment),Mt(t,e.target,e.anchor,e.customElement),dt(),st()}E(c)}class he{$destroy(){Ot(this,1),this.$destroy=g}$on(e,n){const i=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return i.push(n),()=>{const s=i.indexOf(n);s!==-1&&i.splice(s,1)}}$set(e){this.$$set&&!ft(e)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}const w=[];function me(t,e=g){let n;const i=new Set;function s(o){if(at(t,o)&&(t=o,n)){const c=!w.length;for(const l of i)l[1](),w.push(l,t);if(c){for(let l=0;l<w.length;l+=2)w[l][0](w[l+1]);w.length=0}}}function u(o){s(o(t))}function r(o,c=g){const l=[o,c];return i.add(l),i.size===1&&(n=e(s)||g),o(t),()=>{i.delete(l),i.size===0&&(n(),n=null)}}return{set:s,update:u,subscribe:r}}function zt(t){const e=t-1;return e*e*e+1}function pe(t,{delay:e=0,duration:n=400,easing:i=D}={}){const s=+getComputedStyle(t).opacity;return{delay:e,duration:n,easing:i,css:u=>`opacity: ${u*s}`}}function ye(t,{delay:e=0,duration:n=400,easing:i=zt,start:s=0,opacity:u=0}={}){const r=getComputedStyle(t),o=+r.opacity,c=r.transform==="none"?"":r.transform,l=1-s,_=o*(1-u);return{delay:e,duration:n,easing:i,css:(f,a)=>`
			transform: ${c} scale(${1-l*a});
			opacity: ${o-_*a}
		`}}export{Ot as A,ut as B,me as C,Dt as D,Pt as E,Tt as F,Lt as G,bt as H,g as I,$t as J,Kt as K,Xt as L,Wt as M,Ft as N,rt as O,ae as P,Vt as Q,S as R,he as S,oe as T,b as U,ne as V,Yt as W,ye as X,pe as Y,ce as Z,wt as a,Gt as b,Jt as c,xt as d,tt as e,Bt as f,Et as g,Ut as h,de as i,Ht as j,It as k,Qt as l,ie as m,se as n,re as o,qt as p,ee as q,te as r,at as s,T as t,Zt as u,fe as v,_e as w,Mt as x,le as y,ue as z};
