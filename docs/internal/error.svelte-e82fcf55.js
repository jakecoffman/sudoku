import{S as w,i as y,s as z,e as v,t as E,c as d,a as b,g as P,d as n,f as u,H as R,h as j,j as H,k as h,l as N,I as q}from"./chunks/vendor-2aaa525f.js";function C(r){let f,a=r[1].frame+"",t;return{c(){f=v("pre"),t=E(a)},l(l){f=d(l,"PRE",{});var s=b(f);t=P(s,a),s.forEach(n)},m(l,s){u(l,f,s),R(f,t)},p(l,s){s&2&&a!==(a=l[1].frame+"")&&j(t,a)},d(l){l&&n(f)}}}function I(r){let f,a=r[1].stack+"",t;return{c(){f=v("pre"),t=E(a)},l(l){f=d(l,"PRE",{});var s=b(f);t=P(s,a),s.forEach(n)},m(l,s){u(l,f,s),R(f,t)},p(l,s){s&2&&a!==(a=l[1].stack+"")&&j(t,a)},d(l){l&&n(f)}}}function A(r){let f,a,t,l,s=r[1].message+"",c,k,m,p,i=r[1].frame&&C(r),o=r[1].stack&&I(r);return{c(){f=v("h1"),a=E(r[0]),t=H(),l=v("pre"),c=E(s),k=H(),i&&i.c(),m=H(),o&&o.c(),p=h()},l(e){f=d(e,"H1",{});var _=b(f);a=P(_,r[0]),_.forEach(n),t=N(e),l=d(e,"PRE",{});var S=b(l);c=P(S,s),S.forEach(n),k=N(e),i&&i.l(e),m=N(e),o&&o.l(e),p=h()},m(e,_){u(e,f,_),R(f,a),u(e,t,_),u(e,l,_),R(l,c),u(e,k,_),i&&i.m(e,_),u(e,m,_),o&&o.m(e,_),u(e,p,_)},p(e,[_]){_&1&&j(a,e[0]),_&2&&s!==(s=e[1].message+"")&&j(c,s),e[1].frame?i?i.p(e,_):(i=C(e),i.c(),i.m(m.parentNode,m)):i&&(i.d(1),i=null),e[1].stack?o?o.p(e,_):(o=I(e),o.c(),o.m(p.parentNode,p)):o&&(o.d(1),o=null)},i:q,o:q,d(e){e&&n(f),e&&n(t),e&&n(l),e&&n(k),i&&i.d(e),e&&n(m),o&&o.d(e),e&&n(p)}}}function F({error:r,status:f}){return{props:{error:r,status:f}}}function B(r,f,a){let{status:t}=f,{error:l}=f;return r.$$set=s=>{"status"in s&&a(0,t=s.status),"error"in s&&a(1,l=s.error)},[t,l]}class G extends w{constructor(f){super();y(this,f,B,A,z,{status:0,error:1})}}export{G as default,F as load};
