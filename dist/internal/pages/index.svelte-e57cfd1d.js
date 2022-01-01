import{S as ye,i as Ne,s as De,e as E,j as U,c as m,a as I,l as O,d as h,b as D,f as S,H as k,J as K,K as F,L as z,M as x,t as q,g as R,N as Ge,O as ce,I as Q,P as Be,p as b,n as oe,o as Te,h as Ue,Q as ue,m as Oe,k as _e}from"../chunks/vendor-c3c01248.js";let f={};f.DIGITS="123456789";let he="ABCDEFGHI",pe=f.DIGITS,w=null,ge=null,X=null,ee=null,te=17,Y=81,le={easy:62,medium:53,hard:44,"very-hard":35,insane:26,inhuman:17};f.BLANK_CHAR=".";f.BLANK_BOARD=".................................................................................";function qe(){w=f._cross(he,pe),ge=f._get_all_units(he,pe),X=f._get_square_units_map(w,ge),ee=f._get_square_peers_map(w,X)}f.generate=function(e){(typeof e=="string"||typeof e=="undefined")&&(e=le[e]||le.easy),e=f._force_range(e,Y+1,te);let t="";for(let s=0;s<Y;++s)t+=".";let l=f._get_candidates_map(t),r=f._shuffle(w);for(let s in r){let n=r[s],i=f._rand_range(l[n].length),a=l[n][i];if(!f._assign(l,n,a))break;let c=[];for(let u in w){let _=w[u];l[_].length===1&&c.push(l[_])}if(c.length>=e&&f._strip_dups(c).length>=8){let u="",_=[];for(let p in w){let C=w[p];l[C].length===1?(u+=l[C],_.push(p)):u+=f.BLANK_CHAR}let d=_.length;if(d>e){_=f._shuffle(_);for(let p=0;p<d-e;++p){let C=parseInt(_[p]);u=u.substr(0,C)+f.BLANK_CHAR+u.substr(C+1)}}if(f.solve(u))return u}}return f.generate(e)};f.solve=function(e,t){let l=f.validate_board(e);if(l!==!0)throw l;let r=0;for(let i in e)e[i]!==f.BLANK_CHAR&&f._in(e[i],f.DIGITS)&&++r;if(r<te)throw"Too few givens. Minimum givens is "+te;t=t||!1;let s=f._get_candidates_map(e),n=f._search(s,t);if(n){let i="";for(let a in n)i+=n[a];return i}return!1};f.get_candidates=function(e){let t=f.validate_board(e);if(t!==!0)throw t;let l=f._get_candidates_map(e);if(!l)return!1;let r=[],s=[],n=0;for(let i in l){let a=l[i];s.push(a),n%9==8&&(r.push(s),s=[]),++n}return r};f._get_candidates_map=function(e){let t=f.validate_board(e);if(t!==!0)throw t;let l={},r=f._get_square_vals_map(e);for(let s in w)l[w[s]]=f.DIGITS;for(let s in r){let n=r[s];if(f._in(n,f.DIGITS)&&!f._assign(l,s,n))return!1}return l};f._search=function(e,t){if(!e)return!1;t=t||!1;let l=0;for(let i in w){let a=w[i],c=e[a].length;c>l&&(l=c)}if(l===1)return e;let r=10,s=null;for(let i in w){let a=w[i],c=e[a].length;c<r&&c>1&&(r=c,s=a)}let n=e[s];if(t)for(let i=n.length-1;i>=0;--i){let a=n[i],c=JSON.parse(JSON.stringify(e)),u=f._search(f._assign(c,s,a),t);if(u)return u}else for(let i in n){let a=n[i],c=JSON.parse(JSON.stringify(e)),u=f._search(f._assign(c,s,a));if(u)return u}return!1};f._assign=function(e,t,l){let r=e[t].replace(l,"");for(let s in r){let n=r[s];if(!f._eliminate(e,t,n))return!1}return e};f._eliminate=function(e,t,l){if(!f._in(l,e[t]))return e;e[t]=e[t].replace(l,"");let r=e[t].length;if(r===1){let s=e[t];for(let n in ee[t]){let i=ee[t][n];if(!f._eliminate(e,i,s))return!1}}if(r===0)return!1;for(let s in X[t]){let n=X[t][s],i=[];for(let a in n){let c=n[a];f._in(l,e[c])&&i.push(c)}if(i.length===0)return!1;if(i.length===1&&!f._assign(e,i[0],l))return!1}return e};f._get_square_vals_map=function(e){let t={};if(e.length!==w.length)throw"Board/squares length mismatch.";for(let l in w)t[w[l]]=e[l];return t};f._get_square_units_map=function(e,t){let l={};for(let r in e){let s=e[r],n=[];for(let i in t){let a=t[i];a.indexOf(s)!==-1&&n.push(a)}l[s]=n}return l};f._get_square_peers_map=function(e,t){let l={};for(let r in e){let s=e[r],n=t[s],i=[];for(let a in n){let c=n[a];for(let u in c){let _=c[u];i.indexOf(_)===-1&&_!==s&&i.push(_)}}l[s]=i}return l};f._get_all_units=function(e,t){let l=[];for(let n in e)l.push(f._cross(e[n],t));for(let n in t)l.push(f._cross(e,t[n]));let r=["ABC","DEF","GHI"],s=["123","456","789"];for(let n in r)for(let i in s)l.push(f._cross(r[n],s[i]));return l};f.board_string_to_grid=function(e){let t=[],l=[];for(let r in e)l.push(e[r]),r%9==8&&(t.push(l),l=[]);return t};f.board_grid_to_string=function(e){let t="";for(let l=0;l<9;++l)for(let r=0;r<9;++r)t+=e[l][r];return t};f.print_board=function(e){let t=f.validate_board(e);if(t!==!0)throw t;let l=" ",r=`
`,s="  ",n=`
`,i="";for(let a in e)i+=e[a]+l,a%3==2&&(i+=s),a%9==8&&(i+=r),a%27==26&&(i+=n);console.log(i)};f.validate_board=function(e){if(!e)return"Empty board";if(e.length!==Y)return"Invalid board size. Board must be exactly "+Y+" squares.";for(let t in e)if(!f._in(e[t],f.DIGITS)&&e[t]!==f.BLANK_CHAR)return"Invalid board character encountered at index "+t+": "+e[t];return!0};f._cross=function(e,t){let l=[];for(let r in e)for(let s in t)l.push(e[r]+t[s]);return l};f._in=function(e,t){return t.indexOf(e)!==-1};f._first_true=function(e){for(let t in e)if(e[t])return e[t];return!1};f._shuffle=function(e){let t=[];for(let l=0;l<e.length;++l)t.push(!1);for(let l in e){let r=f._rand_range(e.length);for(;t[r];)r=r+1>e.length-1?0:r+1;t[r]=e[l]}return t};f._rand_range=function(e,t){if(t=t||0,e)return Math.floor(Math.random()*(e-t))+t;throw"Range undefined"};f._strip_dups=function(e){let t=[],l={};for(let r in e){let s=e[r];l[s]||(t.push(s),l[s]=!0)}return t};f._force_range=function(e,t,l){return l=l||0,e=e||0,e<l?l:e>t?t:e};qe();function re(e){let t;Array.isArray(e)?t=e:t=Array.from(e);const l=[];let r=0;for(let s=0;s<t.length;s+=3)l.push([{digit:t[s],cellIndex:0,groupIndex:r},{digit:t[s+1],cellIndex:1,groupIndex:r},{digit:t[s+2],cellIndex:2,groupIndex:r},{digit:t[s+9],cellIndex:3,groupIndex:r},{digit:t[s+1+9],cellIndex:4,groupIndex:r},{digit:t[s+2+9],cellIndex:5,groupIndex:r},{digit:t[s+18],cellIndex:6,groupIndex:r},{digit:t[s+1+18],cellIndex:7,groupIndex:r},{digit:t[s+2+18],cellIndex:8,groupIndex:r}]),r++,r%3==0&&(s+=18);return l}function Re(e){const t=[];return t.push(e[0][0],e[0][1],e[0][2],e[1][0],e[1][1],e[1][2],e[2][0],e[2][1],e[2][2],e[0][3],e[0][4],e[0][5],e[1][3],e[1][4],e[1][5],e[2][3],e[2][4],e[2][5],e[0][6],e[0][7],e[0][8],e[1][6],e[1][7],e[1][8],e[2][6],e[2][7],e[2][8],e[3][0],e[3][1],e[3][2],e[4][0],e[4][1],e[4][2],e[5][0],e[5][1],e[5][2],e[3][3],e[3][4],e[3][5],e[4][3],e[4][4],e[4][5],e[5][3],e[5][4],e[5][5],e[3][6],e[3][7],e[3][8],e[4][6],e[4][7],e[4][8],e[5][6],e[5][7],e[5][8],e[6][0],e[6][1],e[6][2],e[7][0],e[7][1],e[7][2],e[8][0],e[8][1],e[8][2],e[6][3],e[6][4],e[6][5],e[7][3],e[7][4],e[7][5],e[8][3],e[8][4],e[8][5],e[6][6],e[6][7],e[6][8],e[7][6],e[7][7],e[7][8],e[8][6],e[8][7],e[8][8]),t.map(l=>l==null?void 0:l.digit).join("")}function de(e,t,l){const r=e.slice();return r[14]=t[l],r[16]=l,r}function Ee(e,t,l){const r=e.slice();return r[17]=t[l],r[19]=l,r}function me(e,t,l){const r=e.slice();return r[20]=t[l],r[22]=l,r}function Ce(e,t,l){const r=e.slice();return r[23]=t[l],r[16]=l,r}function He(e){let t,l=f.DIGITS,r=[];for(let s=0;s<l.length;s+=1)r[s]=ve(Ce(e,l,s));return{c(){t=E("div");for(let s=0;s<r.length;s+=1)r[s].c();this.h()},l(s){t=m(s,"DIV",{class:!0});var n=I(t);for(let i=0;i<r.length;i+=1)r[i].l(n);n.forEach(h),this.h()},h(){D(t,"class","candidates svelte-2v2vrl")},m(s,n){S(s,t,n);for(let i=0;i<r.length;i+=1)r[i].m(t,null)},p(s,n){if(n&1){l=f.DIGITS;let i;for(i=0;i<l.length;i+=1){const a=Ce(s,l,i);r[i]?r[i].p(a,n):(r[i]=ve(a),r[i].c(),r[i].m(t,null))}for(;i<r.length;i+=1)r[i].d(1);r.length=l.length}},d(s){s&&h(t),z(r,s)}}}function Le(e){let t,l=e[20].digit+"",r;return{c(){t=E("span"),r=q(l),this.h()},l(s){t=m(s,"SPAN",{class:!0});var n=I(t);r=R(n,l),n.forEach(h),this.h()},h(){D(t,"class","svelte-2v2vrl"),K(t,"user",e[20].user),K(t,"error",e[20].error)},m(s,n){S(s,t,n),k(t,r)},p:Q,d(s){s&&h(t)}}}function Pe(e){let t,l;return{c(){t=E("span"),l=q("\xA0"),this.h()},l(r){t=m(r,"SPAN",{class:!0});var s=I(t);l=R(s,"\xA0"),s.forEach(h),this.h()},h(){D(t,"class","svelte-2v2vrl")},m(r,s){S(r,t,s),k(t,l)},p:Q,d(r){r&&h(t)}}}function xe(e){let t,l=e[23]+"",r;return{c(){t=E("span"),r=q(l),this.h()},l(s){t=m(s,"SPAN",{class:!0});var n=I(t);r=R(n,l),n.forEach(h),this.h()},h(){D(t,"class","svelte-2v2vrl")},m(s,n){S(s,t,n),k(t,r)},p:Q,d(s){s&&h(t)}}}function ve(e){let t,l;function r(i,a){return(t==null||a&1)&&(t=!!i[0][i[19]][i[22]].digit.includes(i[23])),t?xe:Pe}let s=r(e,-1),n=s(e);return{c(){n.c(),l=_e()},l(i){n.l(i),l=_e()},m(i,a){n.m(i,a),S(i,l,a)},p(i,a){s===(s=r(i,a))&&n?n.p(i,a):(n.d(1),n=s(i),n&&(n.c(),n.m(l.parentNode,l)))},d(i){n.d(i),i&&h(l)}}}function Ie(e){let t,l,r;function s(c,u){if(c[20].digit!==".")return Le;if(c[1])return He}let n=s(e),i=n&&n(e);function a(...c){return e[8](e[20],...c)}return{c(){t=E("div"),i&&i.c(),this.h()},l(c){t=m(c,"DIV",{class:!0});var u=I(t);i&&i.l(u),u.forEach(h),this.h()},h(){D(t,"class","cell svelte-2v2vrl"),K(t,"selected",e[2]===e[20])},m(c,u){S(c,t,u),i&&i.m(t,null),l||(r=F(t,"click",a),l=!0)},p(c,u){e=c,n===(n=s(e))&&i?i.p(e,u):(i&&i.d(1),i=n&&n(e),i&&(i.c(),i.m(t,null))),u&36&&K(t,"selected",e[2]===e[20])},d(c){c&&h(t),i&&i.d(),l=!1,r()}}}function Se(e){let t,l,r=e[17],s=[];for(let n=0;n<r.length;n+=1)s[n]=Ie(me(e,r,n));return{c(){t=E("div");for(let n=0;n<s.length;n+=1)s[n].c();l=U(),this.h()},l(n){t=m(n,"DIV",{class:!0});var i=I(t);for(let a=0;a<s.length;a+=1)s[a].l(i);l=O(i),i.forEach(h),this.h()},h(){D(t,"class","row svelte-2v2vrl")},m(n,i){S(n,t,i);for(let a=0;a<s.length;a+=1)s[a].m(t,null);k(t,l)},p(n,i){if(i&103){r=n[17];let a;for(a=0;a<r.length;a+=1){const c=me(n,r,a);s[a]?s[a].p(c,i):(s[a]=Ie(c),s[a].c(),s[a].m(t,l))}for(;a<s.length;a+=1)s[a].d(1);s.length=r.length}},d(n){n&&h(t),z(s,n)}}}function ke(e){let t,l,r,s,n,i,a,c=f.DIGITS,u=[];for(let _=0;_<c.length;_+=1)u[_]=Ae(de(e,c,_));return{c(){t=E("div"),l=E("aside"),r=E("div");for(let _=0;_<u.length;_+=1)u[_].c();this.h()},l(_){t=m(_,"DIV",{class:!0});var d=I(t);l=m(d,"ASIDE",{style:!0,class:!0});var p=I(l);r=m(p,"DIV",{class:!0});var C=I(r);for(let H=0;H<u.length;H+=1)u[H].l(C);C.forEach(h),p.forEach(h),d.forEach(h),this.h()},h(){D(r,"class","row svelte-2v2vrl"),x(l,"position","absolute"),x(l,"top",e[3].top-e[3].height/3+"px"),x(l,"left",e[3].left-e[3].width/3+"px"),x(l,"width","6rem"),D(l,"class","svelte-2v2vrl"),D(t,"class","dialog svelte-2v2vrl")},m(_,d){S(_,t,d),k(t,l),k(l,r);for(let p=0;p<u.length;p+=1)u[p].m(r,null);n=!0,i||(a=F(t,"click",e[11]),i=!0)},p(_,d){if(d&128){c=f.DIGITS;let p;for(p=0;p<c.length;p+=1){const C=de(_,c,p);u[p]?u[p].p(C,d):(u[p]=Ae(C),u[p].c(),u[p].m(r,null))}for(;p<u.length;p+=1)u[p].d(1);u.length=c.length}(!n||d&8)&&x(l,"top",_[3].top-_[3].height/3+"px"),(!n||d&8)&&x(l,"left",_[3].left-_[3].width/3+"px")},i(_){n||(Ge(()=>{s||(s=ce(l,ue,{},!0)),s.run(1)}),n=!0)},o(_){s||(s=ce(l,ue,{},!1)),s.run(0),n=!1},d(_){_&&h(t),z(u,_),_&&s&&s.end(),i=!1,a()}}}function Ae(e){let t,l=e[14]+"",r,s,n,i;function a(){return e[10](e[14])}return{c(){t=E("span"),r=q(l),s=U(),this.h()},l(c){t=m(c,"SPAN",{class:!0});var u=I(t);r=R(u,l),s=O(u),u.forEach(h),this.h()},h(){D(t,"class","cell picker svelte-2v2vrl")},m(c,u){S(c,t,u),k(t,r),k(t,s),n||(i=F(t,"click",a),n=!0)},p(c,u){e=c},d(c){c&&h(t),n=!1,i()}}}function we(e){let t,l,r,s,n,i;return{c(){t=E("div"),l=E("aside"),r=E("h1"),s=q("A winner is you!"),this.h()},l(a){t=m(a,"DIV",{class:!0});var c=I(t);l=m(c,"ASIDE",{class:!0});var u=I(l);r=m(u,"H1",{});var _=I(r);s=R(_,"A winner is you!"),_.forEach(h),u.forEach(h),c.forEach(h),this.h()},h(){D(l,"class","svelte-2v2vrl"),D(t,"class","dialog svelte-2v2vrl")},m(a,c){S(a,t,c),k(t,l),k(l,r),k(r,s),n||(i=F(t,"click",e[12]),n=!0)},p:Q,d(a){a&&h(t),n=!1,i()}}}function je(e){let t,l,r,s,n,i,a,c,u,_,d,p,C,H,j,L=JSON.stringify(e[2])+"",G,B,T,W,M,Z,se,P=e[5],y=[];for(let o=0;o<P.length;o+=1)y[o]=Se(Ee(e,P,o));let v=e[2]&&(e[2].digit==="."||e[2].user)&&ke(e),N=e[4]&&we(e);return{c(){t=E("section"),l=E("div");for(let o=0;o<y.length;o+=1)y[o].c();r=U(),s=E("section"),n=E("label"),i=E("input"),a=U(),c=E("span"),u=q("Show all candidates"),_=U(),v&&v.c(),d=U(),N&&N.c(),p=U(),C=E("h3"),H=q("Selected"),j=U(),G=q(L),B=U(),T=E("style"),W=q(`body {
        font-family: system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 1500'%3E%3Cdefs%3E%3CradialGradient id='a' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%23FB3'/%3E%3Cstop offset='1' stop-color='%23ee5522'/%3E%3C/radialGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='0' y1='750' x2='1550' y2='750'%3E%3Cstop offset='0' stop-color='%23f7882b'/%3E%3Cstop offset='1' stop-color='%23ee5522'/%3E%3C/linearGradient%3E%3Cpath id='s' fill='url(%23b)' d='M1549.2 51.6c-5.4 99.1-20.2 197.6-44.2 293.6c-24.1 96-57.4 189.4-99.3 278.6c-41.9 89.2-92.4 174.1-150.3 253.3c-58 79.2-123.4 152.6-195.1 219c-71.7 66.4-149.6 125.8-232.2 177.2c-82.7 51.4-170.1 94.7-260.7 129.1c-90.6 34.4-184.4 60-279.5 76.3C192.6 1495 96.1 1502 0 1500c96.1-2.1 191.8-13.3 285.4-33.6c93.6-20.2 185-49.5 272.5-87.2c87.6-37.7 171.3-83.8 249.6-137.3c78.4-53.5 151.5-114.5 217.9-181.7c66.5-67.2 126.4-140.7 178.6-218.9c52.3-78.3 96.9-161.4 133-247.9c36.1-86.5 63.8-176.2 82.6-267.6c18.8-91.4 28.6-184.4 29.6-277.4c0.3-27.6 23.2-48.7 50.8-48.4s49.5 21.8 49.2 49.5c0 0.7 0 1.3-0.1 2L1549.2 51.6z'/%3E%3Cg id='g'%3E%3Cuse href='%23s' transform='scale(0.12) rotate(60)'/%3E%3Cuse href='%23s' transform='scale(0.2) rotate(10)'/%3E%3Cuse href='%23s' transform='scale(0.25) rotate(40)'/%3E%3Cuse href='%23s' transform='scale(0.3) rotate(-20)'/%3E%3Cuse href='%23s' transform='scale(0.4) rotate(-30)'/%3E%3Cuse href='%23s' transform='scale(0.5) rotate(20)'/%3E%3Cuse href='%23s' transform='scale(0.6) rotate(60)'/%3E%3Cuse href='%23s' transform='scale(0.7) rotate(10)'/%3E%3Cuse href='%23s' transform='scale(0.835) rotate(-40)'/%3E%3Cuse href='%23s' transform='scale(0.9) rotate(40)'/%3E%3Cuse href='%23s' transform='scale(1.05) rotate(25)'/%3E%3Cuse href='%23s' transform='scale(1.2) rotate(8)'/%3E%3Cuse href='%23s' transform='scale(1.333) rotate(-60)'/%3E%3Cuse href='%23s' transform='scale(1.45) rotate(-30)'/%3E%3Cuse href='%23s' transform='scale(1.6) rotate(10)'/%3E%3C/g%3E%3C/defs%3E%3Cg %3E%3Cg%3E%3Ccircle fill='url(%23a)' r='3000'/%3E%3Cg opacity='0.5'%3E%3Ccircle fill='url(%23a)' r='2000'/%3E%3Ccircle fill='url(%23a)' r='1800'/%3E%3Ccircle fill='url(%23a)' r='1700'/%3E%3Ccircle fill='url(%23a)' r='1651'/%3E%3Ccircle fill='url(%23a)' r='1450'/%3E%3Ccircle fill='url(%23a)' r='1250'/%3E%3Ccircle fill='url(%23a)' r='1175'/%3E%3Ccircle fill='url(%23a)' r='900'/%3E%3Ccircle fill='url(%23a)' r='750'/%3E%3Ccircle fill='url(%23a)' r='500'/%3E%3Ccircle fill='url(%23a)' r='380'/%3E%3Ccircle fill='url(%23a)' r='250'/%3E%3C/g%3E%3Cg transform=''%3E%3Cuse href='%23g' transform='rotate(10)'/%3E%3Cuse href='%23g' transform='rotate(120)'/%3E%3Cuse href='%23g' transform='rotate(240)'/%3E%3C/g%3E%3Ccircle fill-opacity='0.1' fill='url(%23a)' r='3000'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        background-attachment: fixed;
        background-size: cover;
    }`),this.h()},l(o){t=m(o,"SECTION",{class:!0});var g=I(t);l=m(g,"DIV",{class:!0});var A=I(l);for(let $=0;$<y.length;$+=1)y[$].l(A);A.forEach(h),g.forEach(h),r=O(o),s=m(o,"SECTION",{class:!0});var V=I(s);n=m(V,"LABEL",{});var J=I(n);i=m(J,"INPUT",{type:!0}),a=O(J),c=m(J,"SPAN",{});var ie=I(c);u=R(ie,"Show all candidates"),ie.forEach(h),J.forEach(h),V.forEach(h),_=O(o),v&&v.l(o),d=O(o),N&&N.l(o),p=O(o),C=m(o,"H3",{});var ne=I(C);H=R(ne,"Selected"),ne.forEach(h),j=O(o),G=R(o,L),B=O(o);const ae=Be('[data-svelte="svelte-14xigbt"]',document.head);T=m(ae,"STYLE",{});var fe=I(T);W=R(fe,`body {
        font-family: system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 2000 1500'%3E%3Cdefs%3E%3CradialGradient id='a' gradientUnits='objectBoundingBox'%3E%3Cstop offset='0' stop-color='%23FB3'/%3E%3Cstop offset='1' stop-color='%23ee5522'/%3E%3C/radialGradient%3E%3ClinearGradient id='b' gradientUnits='userSpaceOnUse' x1='0' y1='750' x2='1550' y2='750'%3E%3Cstop offset='0' stop-color='%23f7882b'/%3E%3Cstop offset='1' stop-color='%23ee5522'/%3E%3C/linearGradient%3E%3Cpath id='s' fill='url(%23b)' d='M1549.2 51.6c-5.4 99.1-20.2 197.6-44.2 293.6c-24.1 96-57.4 189.4-99.3 278.6c-41.9 89.2-92.4 174.1-150.3 253.3c-58 79.2-123.4 152.6-195.1 219c-71.7 66.4-149.6 125.8-232.2 177.2c-82.7 51.4-170.1 94.7-260.7 129.1c-90.6 34.4-184.4 60-279.5 76.3C192.6 1495 96.1 1502 0 1500c96.1-2.1 191.8-13.3 285.4-33.6c93.6-20.2 185-49.5 272.5-87.2c87.6-37.7 171.3-83.8 249.6-137.3c78.4-53.5 151.5-114.5 217.9-181.7c66.5-67.2 126.4-140.7 178.6-218.9c52.3-78.3 96.9-161.4 133-247.9c36.1-86.5 63.8-176.2 82.6-267.6c18.8-91.4 28.6-184.4 29.6-277.4c0.3-27.6 23.2-48.7 50.8-48.4s49.5 21.8 49.2 49.5c0 0.7 0 1.3-0.1 2L1549.2 51.6z'/%3E%3Cg id='g'%3E%3Cuse href='%23s' transform='scale(0.12) rotate(60)'/%3E%3Cuse href='%23s' transform='scale(0.2) rotate(10)'/%3E%3Cuse href='%23s' transform='scale(0.25) rotate(40)'/%3E%3Cuse href='%23s' transform='scale(0.3) rotate(-20)'/%3E%3Cuse href='%23s' transform='scale(0.4) rotate(-30)'/%3E%3Cuse href='%23s' transform='scale(0.5) rotate(20)'/%3E%3Cuse href='%23s' transform='scale(0.6) rotate(60)'/%3E%3Cuse href='%23s' transform='scale(0.7) rotate(10)'/%3E%3Cuse href='%23s' transform='scale(0.835) rotate(-40)'/%3E%3Cuse href='%23s' transform='scale(0.9) rotate(40)'/%3E%3Cuse href='%23s' transform='scale(1.05) rotate(25)'/%3E%3Cuse href='%23s' transform='scale(1.2) rotate(8)'/%3E%3Cuse href='%23s' transform='scale(1.333) rotate(-60)'/%3E%3Cuse href='%23s' transform='scale(1.45) rotate(-30)'/%3E%3Cuse href='%23s' transform='scale(1.6) rotate(10)'/%3E%3C/g%3E%3C/defs%3E%3Cg %3E%3Cg%3E%3Ccircle fill='url(%23a)' r='3000'/%3E%3Cg opacity='0.5'%3E%3Ccircle fill='url(%23a)' r='2000'/%3E%3Ccircle fill='url(%23a)' r='1800'/%3E%3Ccircle fill='url(%23a)' r='1700'/%3E%3Ccircle fill='url(%23a)' r='1651'/%3E%3Ccircle fill='url(%23a)' r='1450'/%3E%3Ccircle fill='url(%23a)' r='1250'/%3E%3Ccircle fill='url(%23a)' r='1175'/%3E%3Ccircle fill='url(%23a)' r='900'/%3E%3Ccircle fill='url(%23a)' r='750'/%3E%3Ccircle fill='url(%23a)' r='500'/%3E%3Ccircle fill='url(%23a)' r='380'/%3E%3Ccircle fill='url(%23a)' r='250'/%3E%3C/g%3E%3Cg transform=''%3E%3Cuse href='%23g' transform='rotate(10)'/%3E%3Cuse href='%23g' transform='rotate(120)'/%3E%3Cuse href='%23g' transform='rotate(240)'/%3E%3C/g%3E%3Ccircle fill-opacity='0.1' fill='url(%23a)' r='3000'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        background-attachment: fixed;
        background-size: cover;
    }`),fe.forEach(h),ae.forEach(h),this.h()},h(){D(l,"class","board svelte-2v2vrl"),D(t,"class","svelte-2v2vrl"),D(i,"type","checkbox"),D(s,"class","svelte-2v2vrl")},m(o,g){S(o,t,g),k(t,l);for(let A=0;A<y.length;A+=1)y[A].m(l,null);S(o,r,g),S(o,s,g),k(s,n),k(n,i),i.checked=e[1],k(n,a),k(n,c),k(c,u),S(o,_,g),v&&v.m(o,g),S(o,d,g),N&&N.m(o,g),S(o,p,g),S(o,C,g),k(C,H),S(o,j,g),S(o,G,g),S(o,B,g),k(document.head,T),k(T,W),M=!0,Z||(se=F(i,"change",e[9]),Z=!0)},p(o,[g]){if(g&103){P=o[5];let A;for(A=0;A<P.length;A+=1){const V=Ee(o,P,A);y[A]?y[A].p(V,g):(y[A]=Se(V),y[A].c(),y[A].m(l,null))}for(;A<y.length;A+=1)y[A].d(1);y.length=P.length}g&2&&(i.checked=o[1]),o[2]&&(o[2].digit==="."||o[2].user)?v?(v.p(o,g),g&4&&b(v,1)):(v=ke(o),v.c(),b(v,1),v.m(d.parentNode,d)):v&&(Oe(),oe(v,1,1,()=>{v=null}),Te()),o[4]?N?N.p(o,g):(N=we(o),N.c(),N.m(p.parentNode,p)):N&&(N.d(1),N=null),(!M||g&4)&&L!==(L=JSON.stringify(o[2])+"")&&Ue(G,L)},i(o){M||(b(v),M=!0)},o(o){oe(v),M=!1},d(o){o&&h(t),z(y,o),o&&h(r),o&&h(s),o&&h(_),v&&v.d(o),o&&h(d),N&&N.d(o),o&&h(p),o&&h(C),o&&h(j),o&&h(G),o&&h(B),h(T),Z=!1,se()}}}function Me(e,t,l){let r=f.generate(le.easy),s=re(r),n=re(f.get_candidates(r).flat()),i=!1,a=null,c=null,u=!1;function _(G,B){l(2,a=B),l(3,c=G.target.getBoundingClientRect())}function d(G){l(2,a.digit=G,a),l(2,a.user=!0,a),l(2,a.error=!Array.from(n[a.groupIndex][a.cellIndex].digit).includes(G),a),a.error||(r=Re(s),l(0,n=re(f.get_candidates(r).flat())));for(let B of s)if(B.some(T=>T.digit==="."||T.error))return;l(4,u=!0)}const p=(G,B)=>_(B,G);function C(){i=this.checked,l(1,i)}return[n,i,a,c,u,s,_,d,p,C,G=>d(G),()=>l(2,a=null),()=>l(4,u=!1)]}class Fe extends ye{constructor(t){super();Ne(this,t,Me,je,De,{})}}export{Fe as default};
