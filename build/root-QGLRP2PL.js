import{J as u,P as we,a as Ke,aa as ue,ba as fe,d as Y,f as ge,ha as xe,ia as ye,k as me,la as ve,na as je,o as be,oa as ke,xa as ze}from"/build/_shared/chunk-IZFMW3M4.js";import"/build/_shared/chunk-HBJK6BW3.js";import"/build/_shared/chunk-HYMQ7M2K.js";import"/build/_shared/chunk-OHOXABTA.js";import"/build/_shared/chunk-OCWQY3HK.js";import"/build/_shared/chunk-CPTH56EW.js";import{a as he}from"/build/_shared/chunk-3CVK3PYF.js";import"/build/_shared/chunk-J6FHCSRC.js";import{r as A,s as z,t as N}from"/build/_shared/chunk-S4SWV34C.js";import{a as pe}from"/build/_shared/chunk-GUCIBHGO.js";import{f as le,l as ce}from"/build/_shared/chunk-OCTKKCIL.js";import{a as P,d as I}from"/build/_shared/chunk-UAI5KRM7.js";import{e as f}from"/build/_shared/chunk-2NH4LW52.js";var Te="/build/_assets/app-HG4THSM4.css";var _e="/build/_assets/thebe-core-VKVHG5VY.css";var yt=f(Ke());function Z(o,e,t,r){function i(a){return a instanceof t?a:new t(function(d){d(a)})}return new(t||(t=Promise))(function(a,d){function n(c){try{l(r.next(c))}catch(g){d(g)}}function s(c){try{l(r.throw(c))}catch(g){d(g)}}function l(c){c.done?a(c.value):i(c.value).then(n,s)}l((r=r.apply(o,e||[])).next())})}var rt="ENTRIES",Me="KEYS",Le="VALUES",x="",q=class{constructor(e,t){let r=e._tree,i=Array.from(r.keys());this.set=e,this._type=t,this._path=i.length>0?[{node:r,keys:i}]:[]}next(){let e=this.dive();return this.backtrack(),e}dive(){if(this._path.length===0)return{done:!0,value:void 0};let{node:e,keys:t}=H(this._path);if(H(t)===x)return{done:!1,value:this.result()};let r=e.get(H(t));return this._path.push({node:r,keys:Array.from(r.keys())}),this.dive()}backtrack(){if(this._path.length===0)return;let e=H(this._path).keys;e.pop(),!(e.length>0)&&(this._path.pop(),this.backtrack())}key(){return this.set._prefix+this._path.map(({keys:e})=>H(e)).filter(e=>e!==x).join("")}value(){return H(this._path).node.get(x)}result(){switch(this._type){case Le:return this.value();case Me:return this.key();default:return[this.key(),this.value()]}}[Symbol.iterator](){return this}},H=o=>o[o.length-1],ot=(o,e,t)=>{let r=new Map;if(e===void 0)return r;let i=e.length+1,a=i+t,d=new Uint8Array(a*i).fill(t+1);for(let n=0;n<i;++n)d[n]=n;for(let n=1;n<a;++n)d[n*i]=n;return Ie(o,e,t,r,d,1,i,""),r},Ie=(o,e,t,r,i,a,d,n)=>{let s=a*d;e:for(let l of o.keys())if(l===x){let c=i[s-1];c<=t&&r.set(n,[o.get(l),c])}else{let c=a;for(let g=0;g<l.length;++g,++c){let p=l[g],m=d*c,h=m-d,b=i[m],w=Math.max(0,c-t-1),U=Math.min(d-1,c+t);for(let j=w;j<U;++j){let X=p!==e[j],Q=i[h+j]+ +X,W=i[h+j+1]+1,E=i[m+j]+1,V=i[m+j+1]=Math.min(Q,W,E);V<b&&(b=V)}if(b>t)continue e}Ie(o.get(l),e,t,r,i,c,d,n+l)}},B=class{constructor(e=new Map,t=""){this._size=void 0,this._tree=e,this._prefix=t}atPrefix(e){if(!e.startsWith(this._prefix))throw new Error("Mismatched prefix");let[t,r]=$(this._tree,e.slice(this._prefix.length));if(t===void 0){let[i,a]=ne(r);for(let d of i.keys())if(d!==x&&d.startsWith(a)){let n=new Map;return n.set(d.slice(a.length),i.get(d)),new B(n,e)}}return new B(t,e)}clear(){this._size=void 0,this._tree.clear()}delete(e){return this._size=void 0,it(this._tree,e)}entries(){return new q(this,rt)}forEach(e){for(let[t,r]of this)e(t,r,this)}fuzzyGet(e,t){return ot(this._tree,e,t)}get(e){let t=oe(this._tree,e);return t!==void 0?t.get(x):void 0}has(e){let t=oe(this._tree,e);return t!==void 0&&t.has(x)}keys(){return new q(this,Me)}set(e,t){if(typeof e!="string")throw new Error("key must be a string");return this._size=void 0,K(this._tree,e).set(x,t),this}get size(){if(this._size)return this._size;this._size=0;let e=this.entries();for(;!e.next().done;)this._size+=1;return this._size}update(e,t){if(typeof e!="string")throw new Error("key must be a string");this._size=void 0;let r=K(this._tree,e);return r.set(x,t(r.get(x))),this}fetch(e,t){if(typeof e!="string")throw new Error("key must be a string");this._size=void 0;let r=K(this._tree,e),i=r.get(x);return i===void 0&&r.set(x,i=t()),i}values(){return new q(this,Le)}[Symbol.iterator](){return this.entries()}static from(e){let t=new B;for(let[r,i]of e)t.set(r,i);return t}static fromObject(e){return B.from(Object.entries(e))}},$=(o,e,t=[])=>{if(e.length===0||o==null)return[o,t];for(let r of o.keys())if(r!==x&&e.startsWith(r))return t.push([o,r]),$(o.get(r),e.slice(r.length),t);return t.push([o,e]),$(void 0,"",t)},oe=(o,e)=>{if(e.length===0||o==null)return o;for(let t of o.keys())if(t!==x&&e.startsWith(t))return oe(o.get(t),e.slice(t.length))},K=(o,e)=>{let t=e.length;e:for(let r=0;o&&r<t;){for(let a of o.keys())if(a!==x&&e[r]===a[0]){let d=Math.min(t-r,a.length),n=1;for(;n<d&&e[r+n]===a[n];)++n;let s=o.get(a);if(n===a.length)o=s;else{let l=new Map;l.set(a.slice(n),s),o.set(e.slice(r,r+n),l),o.delete(a),o=l}r+=n;continue e}let i=new Map;return o.set(e.slice(r),i),i}return o},it=(o,e)=>{let[t,r]=$(o,e);if(t!==void 0){if(t.delete(x),t.size===0)Se(r);else if(t.size===1){let[i,a]=t.entries().next().value;Ae(r,i,a)}}},Se=o=>{if(o.length===0)return;let[e,t]=ne(o);if(e.delete(t),e.size===0)Se(o.slice(0,-1));else if(e.size===1){let[r,i]=e.entries().next().value;r!==x&&Ae(o.slice(0,-1),r,i)}},Ae=(o,e,t)=>{if(o.length===0)return;let[r,i]=ne(o);r.set(i+e,t),r.delete(i)},ne=o=>o[o.length-1],de="or",Ne="and",at="and_not",_=class{constructor(e){if(e?.fields==null)throw new Error('MiniSearch: option "fields" must be provided');let t=e.autoVacuum==null||e.autoVacuum===!0?re:e.autoVacuum;this._options=Object.assign(Object.assign(Object.assign({},te),e),{autoVacuum:t,searchOptions:Object.assign(Object.assign({},Ce),e.searchOptions||{}),autoSuggestOptions:Object.assign(Object.assign({},ct),e.autoSuggestOptions||{})}),this._index=new B,this._documentCount=0,this._documentIds=new Map,this._idToShortId=new Map,this._fieldIds={},this._fieldLength=new Map,this._avgFieldLength=[],this._nextId=0,this._storedFields=new Map,this._dirtCount=0,this._currentVacuum=null,this._enqueuedVacuum=null,this._enqueuedVacuumConditions=ae,this.addFields(this._options.fields)}add(e){let{extractField:t,tokenize:r,processTerm:i,fields:a,idField:d}=this._options,n=t(e,d);if(n==null)throw new Error(`MiniSearch: document does not have ID field "${d}"`);if(this._idToShortId.has(n))throw new Error(`MiniSearch: duplicate ID ${n}`);let s=this.addDocumentId(n);this.saveStoredFields(s,e);for(let l of a){let c=t(e,l);if(c==null)continue;let g=r(c.toString(),l),p=this._fieldIds[l],m=new Set(g).size;this.addFieldLength(s,p,this._documentCount-1,m);for(let h of g){let b=i(h,l);if(Array.isArray(b))for(let w of b)this.addTerm(p,s,w);else b&&this.addTerm(p,s,b)}}}addAll(e){for(let t of e)this.add(t)}addAllAsync(e,t={}){let{chunkSize:r=10}=t,i={chunk:[],promise:Promise.resolve()},{chunk:a,promise:d}=e.reduce(({chunk:n,promise:s},l,c)=>(n.push(l),(c+1)%r===0?{chunk:[],promise:s.then(()=>new Promise(g=>setTimeout(g,0))).then(()=>this.addAll(n))}:{chunk:n,promise:s}),i);return d.then(()=>this.addAll(a))}remove(e){let{tokenize:t,processTerm:r,extractField:i,fields:a,idField:d}=this._options,n=i(e,d);if(n==null)throw new Error(`MiniSearch: document does not have ID field "${d}"`);let s=this._idToShortId.get(n);if(s==null)throw new Error(`MiniSearch: cannot remove document with ID ${n}: it is not in the index`);for(let l of a){let c=i(e,l);if(c==null)continue;let g=t(c.toString(),l),p=this._fieldIds[l],m=new Set(g).size;this.removeFieldLength(s,p,this._documentCount,m);for(let h of g){let b=r(h,l);if(Array.isArray(b))for(let w of b)this.removeTerm(p,s,w);else b&&this.removeTerm(p,s,b)}}this._storedFields.delete(s),this._documentIds.delete(s),this._idToShortId.delete(n),this._fieldLength.delete(s),this._documentCount-=1}removeAll(e){if(e)for(let t of e)this.remove(t);else{if(arguments.length>0)throw new Error("Expected documents to be present. Omit the argument to remove all documents.");this._index=new B,this._documentCount=0,this._documentIds=new Map,this._idToShortId=new Map,this._fieldLength=new Map,this._avgFieldLength=[],this._storedFields=new Map,this._nextId=0}}discard(e){let t=this._idToShortId.get(e);if(t==null)throw new Error(`MiniSearch: cannot discard document with ID ${e}: it is not in the index`);this._idToShortId.delete(e),this._documentIds.delete(t),this._storedFields.delete(t),(this._fieldLength.get(t)||[]).forEach((r,i)=>{this.removeFieldLength(t,i,this._documentCount,r)}),this._fieldLength.delete(t),this._documentCount-=1,this._dirtCount+=1,this.maybeAutoVacuum()}maybeAutoVacuum(){if(this._options.autoVacuum===!1)return;let{minDirtFactor:e,minDirtCount:t,batchSize:r,batchWait:i}=this._options.autoVacuum;this.conditionalVacuum({batchSize:r,batchWait:i},{minDirtCount:t,minDirtFactor:e})}discardAll(e){let t=this._options.autoVacuum;try{this._options.autoVacuum=!1;for(let r of e)this.discard(r)}finally{this._options.autoVacuum=t}this.maybeAutoVacuum()}replace(e){let{idField:t,extractField:r}=this._options,i=r(e,t);this.discard(i),this.add(e)}vacuum(e={}){return this.conditionalVacuum(e)}conditionalVacuum(e,t){return this._currentVacuum?(this._enqueuedVacuumConditions=this._enqueuedVacuumConditions&&t,this._enqueuedVacuum!=null?this._enqueuedVacuum:(this._enqueuedVacuum=this._currentVacuum.then(()=>{let r=this._enqueuedVacuumConditions;return this._enqueuedVacuumConditions=ae,this.performVacuuming(e,r)}),this._enqueuedVacuum)):this.vacuumConditionsMet(t)===!1?Promise.resolve():(this._currentVacuum=this.performVacuuming(e),this._currentVacuum)}performVacuuming(e,t){return Z(this,void 0,void 0,function*(){let r=this._dirtCount;if(this.vacuumConditionsMet(t)){let i=e.batchSize||ie.batchSize,a=e.batchWait||ie.batchWait,d=1;for(let[n,s]of this._index){for(let[l,c]of s)for(let[g]of c)this._documentIds.has(g)||(c.size<=1?s.delete(l):c.delete(g));this._index.get(n).size===0&&this._index.delete(n),d%i===0&&(yield new Promise(l=>setTimeout(l,a))),d+=1}this._dirtCount-=r}yield null,this._currentVacuum=this._enqueuedVacuum,this._enqueuedVacuum=null})}vacuumConditionsMet(e){if(e==null)return!0;let{minDirtCount:t,minDirtFactor:r}=e;return t=t||re.minDirtCount,r=r||re.minDirtFactor,this.dirtCount>=t&&this.dirtFactor>=r}get isVacuuming(){return this._currentVacuum!=null}get dirtCount(){return this._dirtCount}get dirtFactor(){return this._dirtCount/(1+this._documentCount+this._dirtCount)}has(e){return this._idToShortId.has(e)}getStoredFields(e){let t=this._idToShortId.get(e);if(t!=null)return this._storedFields.get(t)}search(e,t={}){let r=this.executeQuery(e,t),i=[];for(let[a,{score:d,terms:n,match:s}]of r){let l=n.length||1,c={id:this._documentIds.get(a),score:d*l,terms:Object.keys(s),queryTerms:n,match:s};Object.assign(c,this._storedFields.get(a)),(t.filter==null||t.filter(c))&&i.push(c)}return e===_.wildcard&&t.boostDocument==null&&this._options.searchOptions.boostDocument==null||i.sort(Be),i}autoSuggest(e,t={}){t=Object.assign(Object.assign({},this._options.autoSuggestOptions),t);let r=new Map;for(let{score:a,terms:d}of this.search(e,t)){let n=d.join(" "),s=r.get(n);s!=null?(s.score+=a,s.count+=1):r.set(n,{score:a,terms:d,count:1})}let i=[];for(let[a,{score:d,terms:n,count:s}]of r)i.push({suggestion:a,terms:n,score:d/s});return i.sort(Be),i}get documentCount(){return this._documentCount}get termCount(){return this._index.size}static loadJSON(e,t){if(t==null)throw new Error("MiniSearch: loadJSON should be given the same options used when serializing the index");return this.loadJS(JSON.parse(e),t)}static loadJSONAsync(e,t){return Z(this,void 0,void 0,function*(){if(t==null)throw new Error("MiniSearch: loadJSON should be given the same options used when serializing the index");return this.loadJSAsync(JSON.parse(e),t)})}static getDefault(e){if(te.hasOwnProperty(e))return ee(te,e);throw new Error(`MiniSearch: unknown option "${e}"`)}static loadJS(e,t){let{index:r,documentIds:i,fieldLength:a,storedFields:d,serializationVersion:n}=e,s=this.instantiateMiniSearch(e,t);s._documentIds=G(i),s._fieldLength=G(a),s._storedFields=G(d);for(let[l,c]of s._documentIds)s._idToShortId.set(c,l);for(let[l,c]of r){let g=new Map;for(let p of Object.keys(c)){let m=c[p];n===1&&(m=m.ds),g.set(parseInt(p,10),G(m))}s._index.set(l,g)}return s}static loadJSAsync(e,t){return Z(this,void 0,void 0,function*(){let{index:r,documentIds:i,fieldLength:a,storedFields:d,serializationVersion:n}=e,s=this.instantiateMiniSearch(e,t);s._documentIds=yield J(i),s._fieldLength=yield J(a),s._storedFields=yield J(d);for(let[c,g]of s._documentIds)s._idToShortId.set(g,c);let l=0;for(let[c,g]of r){let p=new Map;for(let m of Object.keys(g)){let h=g[m];n===1&&(h=h.ds),p.set(parseInt(m,10),yield J(h))}++l%1e3===0&&(yield De(0)),s._index.set(c,p)}return s})}static instantiateMiniSearch(e,t){let{documentCount:r,nextId:i,fieldIds:a,averageFieldLength:d,dirtCount:n,serializationVersion:s}=e;if(s!==1&&s!==2)throw new Error("MiniSearch: cannot deserialize an index created with an incompatible version");let l=new _(t);return l._documentCount=r,l._nextId=i,l._idToShortId=new Map,l._fieldIds=a,l._avgFieldLength=d,l._dirtCount=n||0,l._index=new B,l}executeQuery(e,t={}){if(e===_.wildcard)return this.executeWildcardQuery(t);if(typeof e!="string"){let p=Object.assign(Object.assign(Object.assign({},t),e),{queries:void 0}),m=e.queries.map(h=>this.executeQuery(h,p));return this.combineResults(m,p.combineWith)}let{tokenize:r,processTerm:i,searchOptions:a}=this._options,d=Object.assign(Object.assign({tokenize:r,processTerm:i},a),t),{tokenize:n,processTerm:s}=d,g=n(e).flatMap(p=>s(p)).filter(p=>!!p).map(lt(d)).map(p=>this.executeQuerySpec(p,d));return this.combineResults(g,d.combineWith)}executeQuerySpec(e,t){let r=Object.assign(Object.assign({},this._options.searchOptions),t),i=(r.fields||this._options.fields).reduce((b,w)=>Object.assign(Object.assign({},b),{[w]:ee(r.boost,w)||1}),{}),{boostDocument:a,weights:d,maxFuzzy:n,bm25:s}=r,{fuzzy:l,prefix:c}=Object.assign(Object.assign({},Ce.weights),d),g=this._index.get(e.term),p=this.termResults(e.term,e.term,1,e.termBoost,g,i,a,s),m,h;if(e.prefix&&(m=this._index.atPrefix(e.term)),e.fuzzy){let b=e.fuzzy===!0?.2:e.fuzzy,w=b<1?Math.min(n,Math.round(e.term.length*b)):b;w&&(h=this._index.fuzzyGet(e.term,w))}if(m)for(let[b,w]of m){let U=b.length-e.term.length;if(!U)continue;h?.delete(b);let j=c*b.length/(b.length+.3*U);this.termResults(e.term,b,j,e.termBoost,w,i,a,s,p)}if(h)for(let b of h.keys()){let[w,U]=h.get(b);if(!U)continue;let j=l*b.length/(b.length+U);this.termResults(e.term,b,j,e.termBoost,w,i,a,s,p)}return p}executeWildcardQuery(e){let t=new Map,r=Object.assign(Object.assign({},this._options.searchOptions),e);for(let[i,a]of this._documentIds){let d=r.boostDocument?r.boostDocument(a,"",this._storedFields.get(i)):1;t.set(i,{score:d,terms:[],match:{}})}return t}combineResults(e,t=de){if(e.length===0)return new Map;let r=t.toLowerCase(),i=nt[r];if(!i)throw new Error(`Invalid combination operator: ${t}`);return e.reduce(i)||new Map}toJSON(){let e=[];for(let[t,r]of this._index){let i={};for(let[a,d]of r)i[a]=Object.fromEntries(d);e.push([t,i])}return{documentCount:this._documentCount,nextId:this._nextId,documentIds:Object.fromEntries(this._documentIds),fieldIds:this._fieldIds,fieldLength:Object.fromEntries(this._fieldLength),averageFieldLength:this._avgFieldLength,storedFields:Object.fromEntries(this._storedFields),dirtCount:this._dirtCount,index:e,serializationVersion:2}}termResults(e,t,r,i,a,d,n,s,l=new Map){if(a==null)return l;for(let c of Object.keys(d)){let g=d[c],p=this._fieldIds[c],m=a.get(p);if(m==null)continue;let h=m.size,b=this._avgFieldLength[p];for(let w of m.keys()){if(!this._documentIds.has(w)){this.removeTerm(p,w,t),h-=1;continue}let U=n?n(this._documentIds.get(w),t,this._storedFields.get(w)):1;if(!U)continue;let j=m.get(w),X=this._fieldLength.get(w)[p],Q=st(j,h,this._documentCount,X,b,s),W=r*i*g*U*Q,E=l.get(w);if(E){E.score+=W,pt(E.terms,e);let V=ee(E.match,t);V?V.push(c):E.match[t]=[c]}else l.set(w,{score:W,terms:[e],match:{[t]:[c]}})}}return l}addTerm(e,t,r){let i=this._index.fetch(r,Re),a=i.get(e);if(a==null)a=new Map,a.set(t,1),i.set(e,a);else{let d=a.get(t);a.set(t,(d||0)+1)}}removeTerm(e,t,r){if(!this._index.has(r)){this.warnDocumentChanged(t,e,r);return}let i=this._index.fetch(r,Re),a=i.get(e);a==null||a.get(t)==null?this.warnDocumentChanged(t,e,r):a.get(t)<=1?a.size<=1?i.delete(e):a.delete(t):a.set(t,a.get(t)-1),this._index.get(r).size===0&&this._index.delete(r)}warnDocumentChanged(e,t,r){for(let i of Object.keys(this._fieldIds))if(this._fieldIds[i]===t){this._options.logger("warn",`MiniSearch: document with ID ${this._documentIds.get(e)} has changed before removal: term "${r}" was not present in field "${i}". Removing a document after it has changed can corrupt the index!`,"version_conflict");return}}addDocumentId(e){let t=this._nextId;return this._idToShortId.set(e,t),this._documentIds.set(t,e),this._documentCount+=1,this._nextId+=1,t}addFields(e){for(let t=0;t<e.length;t++)this._fieldIds[e[t]]=t}addFieldLength(e,t,r,i){let a=this._fieldLength.get(e);a==null&&this._fieldLength.set(e,a=[]),a[t]=i;let n=(this._avgFieldLength[t]||0)*r+i;this._avgFieldLength[t]=n/(r+1)}removeFieldLength(e,t,r,i){if(r===1){this._avgFieldLength[t]=0;return}let a=this._avgFieldLength[t]*r-i;this._avgFieldLength[t]=a/(r-1)}saveStoredFields(e,t){let{storeFields:r,extractField:i}=this._options;if(r==null||r.length===0)return;let a=this._storedFields.get(e);a==null&&this._storedFields.set(e,a={});for(let d of r){let n=i(t,d);n!==void 0&&(a[d]=n)}}};_.wildcard=Symbol("*");var ee=(o,e)=>Object.prototype.hasOwnProperty.call(o,e)?o[e]:void 0,nt={[de]:(o,e)=>{for(let t of e.keys()){let r=o.get(t);if(r==null)o.set(t,e.get(t));else{let{score:i,terms:a,match:d}=e.get(t);r.score=r.score+i,r.match=Object.assign(r.match,d),Ue(r.terms,a)}}return o},[Ne]:(o,e)=>{let t=new Map;for(let r of e.keys()){let i=o.get(r);if(i==null)continue;let{score:a,terms:d,match:n}=e.get(r);Ue(i.terms,d),t.set(r,{score:i.score+a,terms:i.terms,match:Object.assign(i.match,n)})}return t},[at]:(o,e)=>{for(let t of e.keys())o.delete(t);return o}},dt={k:1.2,b:.7,d:.5},st=(o,e,t,r,i,a)=>{let{k:d,b:n,d:s}=a;return Math.log(1+(t-e+.5)/(e+.5))*(s+o*(d+1)/(o+d*(1-n+n*r/i)))},lt=o=>(e,t,r)=>{let i=typeof o.fuzzy=="function"?o.fuzzy(e,t,r):o.fuzzy||!1,a=typeof o.prefix=="function"?o.prefix(e,t,r):o.prefix===!0,d=typeof o.boostTerm=="function"?o.boostTerm(e,t,r):1;return{term:e,fuzzy:i,prefix:a,termBoost:d}},te={idField:"id",extractField:(o,e)=>o[e],tokenize:o=>o.split(gt),processTerm:o=>o.toLowerCase(),fields:void 0,searchOptions:void 0,storeFields:[],logger:(o,e)=>{typeof console?.[o]=="function"&&console[o](e)},autoVacuum:!0},Ce={combineWith:de,prefix:!1,fuzzy:!1,maxFuzzy:6,boost:{},weights:{fuzzy:.45,prefix:.375},bm25:dt},ct={combineWith:Ne,prefix:(o,e,t)=>e===t.length-1},ie={batchSize:1e3,batchWait:10},ae={minDirtFactor:.1,minDirtCount:20},re=Object.assign(Object.assign({},ie),ae),pt=(o,e)=>{o.includes(e)||o.push(e)},Ue=(o,e)=>{for(let t of e)o.includes(t)||o.push(t)},Be=({score:o},{score:e})=>e-o,Re=()=>new Map,G=o=>{let e=new Map;for(let t of Object.keys(o))e.set(parseInt(t,10),o[t]);return e},J=o=>Z(void 0,void 0,void 0,function*(){let e=new Map,t=0;for(let r of Object.keys(o))e.set(parseInt(r,10),o[r]),++t%1e3===0&&(yield De(0));return e}),De=o=>new Promise(e=>setTimeout(e,o)),gt=/[\n\r\p{Z}\p{P}]+/u;function mt(o){return{...o,tokenize:_.getDefault("tokenize"),processTerm:_.getDefault("processTerm"),extractField:fe}}function ht(o){let[e,...t]=o.entries();if(e===void 0)return[];let r=e[1],i=new Map(Array.from(r.entries(),([d,n])=>{let{id:s,score:l,terms:c,queryTerms:g,match:p,...m}=n;return[d,{id:d,queries:[{term:g[0],matches:p}],...m}]})),a=t.reduce((d,n)=>{let s=new Map;return n[1].forEach((c,g)=>{let p=d.get(g);if(p==null)return;let{queryTerms:m,match:h}=c;p.queries.push({term:m[0],matches:h}),s.set(g,p)}),s},i);return Array.from(a.values())}function Ee(o,e){let t=mt(e),r=new _(t);return r.addAll(o.map((i,a)=>({...i,id:a}))),async i=>{let a=t.tokenize(i).filter(d=>!!d);if(a.length){let d=new Map(a.map(n=>[n,new Map(r.search(n).map(s=>[s.id,s]))]));return ht(d)}else return}}var y=f(I(),1),Fe=f(P(),1);var bt={}.hasOwnProperty,R=function(o,e,t){let r=pe(t||e),i=e&&typeof e=="object"&&"cascade"in e?e.cascade:void 0,a=i??!0;return d(o);function d(n,s,l){let c=[];if(!r(n,s,l))return null;if(n.children){let m=-1;for(;++m<n.children.length;){let h=d(n.children[m],m,n);h&&c.push(h)}if(a&&n.children.length>0&&c.length===0)return null}let g={},p;for(p in n)bt.call(n,p)&&(g[p]=p==="children"?c:n[p]);return g}};var C=f(I(),1);var Pe=f(I(),1);var se=f(he(),1);function M({node:o,className:e,children:t}){let r=ge(),{key:i}=o,a=(0,se.default)(e,o.class),d=o.visibility==="hide"?"":`${r} subgrid-gap col-page [&>*]:col-page`;return(0,Pe.jsx)("div",{id:i,className:(0,se.default)("relative group/block py-6",a,{[d]:!(a&&a.includes("col-")),hidden:o.visibility==="remove"}),children:t},`block-${i}`)}function D(o){let{node:e,blockName:t}=o;return(0,C.jsx)(M,Object.assign({},o,{children:(0,C.jsxs)("div",{className:"relative",role:"alert",children:[(0,C.jsxs)("div",{className:"px-4 py-2 font-bold text-white bg-red-500 rounded-t",children:["Invalid block ",(0,C.jsx)("span",{className:"font-mono",children:t})]}),(0,C.jsxs)("div",{className:"border border-t-0 border-red-400 rounded-b ",children:[(0,C.jsx)("div",{className:"px-4 py-3 text-red-700 bg-red-100",children:(0,C.jsxs)("p",{children:["This '",t,"' block does not conform to the expected AST structure."]})}),(0,C.jsx)("div",{className:"px-4 py-3",children:(0,C.jsx)(u,{ast:e.children})})]})]})}))}var S=f(I(),1),He=f(P(),1);var Oe=f(he(),1);function O({node:o,className:e}){let{enumerator:t,depth:r,key:i,identifier:a,html_id:d}=o,n=d||a||i;return(0,He.createElement)(`h${r}`,{className:(0,Oe.default)(o.class,e,"group"),id:n},(0,S.jsxs)(S.Fragment,{children:[t&&(0,S.jsx)("span",{className:"mr-3 select-none",children:t}),(0,S.jsx)("span",{className:"heading-text",children:(0,S.jsx)(u,{ast:o.children})}),(0,S.jsx)(be,{id:n,kind:"Section",className:"font-normal",hover:!0,hideInPopup:!0,noWidth:!0})]}))}function F(o,e){let t;for(t=0;t<o.children.length;t++){let r=o.children[t];if(r.type==="heading"&&(e===void 0||r.depth===e))break}return t===o.children.length?{head:void 0,body:{type:"block",children:o.children}}:{head:{type:"block",children:o.children.slice(0,t+1)},body:{type:"block",children:o.children.slice(t+1)}}}function wt(o){let{node:e}=o,{image:t,body:r,links:i,subtitle:a,heading:d}=(0,Fe.useMemo)(()=>{var n,s;let{head:l,body:c}=F(e),g=N("link,crossReference",c),p=z("paragraph",l),m=z("heading",l),h=z("image",c);return{body:(s=(n=R(c,w=>!A("link[class*=button], crossReference[class*=button], image",w)))===null||n===void 0?void 0:n.children)!==null&&s!==void 0?s:[],image:h,links:g,subtitle:p,heading:m}},[e]);return!t||!r?(0,y.jsx)(D,Object.assign({},o,{blockName:"split-image"})):(0,y.jsx)(M,Object.assign({},o,{children:(0,y.jsxs)("div",{className:"relative rounded-md bg-stone-900 dark:bg-stone-800",children:[(0,y.jsx)("div",{className:"lg:absolute lg:h-full lg:w-[calc(50%)] md:absolute md:h-full md:w-[calc(100%/3)] h-80 relative [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:m-0 [&_picture]:m-0 [&_picture]:inline",children:(0,y.jsx)(u,{ast:t})}),(0,y.jsx)("div",{className:"relative py-24",children:(0,y.jsxs)("div",{className:"lg:ml-auto lg:w-[calc(50%)] lg:p-8 lg:pl-24 md:ml-auto md:w-[calc(2*100%/3)] md:pl-16 md:p-8 px-6",children:[a&&(0,y.jsx)("p",{className:"my-0 font-semibold prose text-indigo-400 uppercase  prose-invert",children:(0,y.jsx)(u,{ast:a.children})}),d&&(0,y.jsx)(O,{node:d,className:"mt-2 mb-0 text-5xl font-semibold tracking-tight text-white"}),(0,y.jsx)("div",{className:"mt-6",children:(0,y.jsx)(u,{ast:r,className:"prose prose-invert"})}),i&&(0,y.jsx)("div",{className:"flex items-center gap-4 mt-8",children:(0,y.jsx)(u,{ast:i,className:"prose prose-invert"})})]})})]})}))}var Ve={block:{"block[kind=split-image]":wt}};var k=f(I(),1),qe=f(P(),1);function ut(o){let{node:e}=o,{body:t,links:r,subtitle:i,heading:a}=(0,qe.useMemo)(()=>{var d,n;let{head:s,body:l}=F(e),c=N("link[class*=button], crossReference[class*=button]",l),g=z("paragraph",s),p=z("heading",s);return{body:(n=(d=R(l,h=>!A("link[class*=button], crossReference[class*=button]",h)))===null||d===void 0?void 0:d.children)!==null&&n!==void 0?n:[],links:c,subtitle:g,heading:p}},[e]);return t?(0,k.jsx)(M,Object.assign({},o,{children:(0,k.jsx)("div",{className:"relative text-center",children:(0,k.jsxs)("div",{className:"py-20 sm:py-28",children:[i&&(0,k.jsx)("p",{className:"my-0 font-semibold text-indigo-400 uppercase",children:(0,k.jsx)(u,{ast:i.children})}),a&&(0,k.jsx)(O,{node:a,className:"mt-2 mb-0 text-5xl font-semibold tracking-tight"}),t&&(0,k.jsx)("div",{className:"mt-6",children:(0,k.jsx)(u,{ast:t})}),r&&(0,k.jsx)("div",{className:"flex items-center justify-center gap-4 mt-8",children:(0,k.jsx)(u,{ast:r})})]})})})):(0,k.jsx)(D,Object.assign({},o,{blockName:"centered"}))}var We={block:{"block[kind=centered]":ut}};var v=f(I(),1),Ye=f(P(),1);function ft(o){let{node:e}=o,{body:t,links:r,subtitle:i,heading:a}=(0,Ye.useMemo)(()=>{var d,n;let{head:s,body:l}=F(e),c=N("link[class*=button], crossReference[class*=button]",l),g=z("paragraph",s),p=z("heading",s);return{body:(n=(d=R(l,h=>!A("link[class*=button], crossReference[class*=button]",h)))===null||d===void 0?void 0:d.children)!==null&&n!==void 0?n:[],links:c,subtitle:g,heading:p}},[e]);return t?(0,v.jsx)(M,Object.assign({},o,{children:(0,v.jsxs)("div",{className:"py-20 sm:py-28 lg:px-8",children:[i&&(0,v.jsx)("p",{className:"my-0 font-semibold text-indigo-400 uppercase",children:(0,v.jsx)(u,{ast:i.children})}),(0,v.jsxs)("div",{className:"flex flex-col lg:content-center lg:justify-between lg:flex-row",children:[(0,v.jsxs)("div",{className:"flex flex-col",children:[a&&(0,v.jsx)(O,{node:a,className:"mt-2 mb-0 text-5xl font-semibold tracking-tight"}),t&&(0,v.jsx)("div",{className:"mt-6",children:(0,v.jsx)(u,{ast:t})})]}),(0,v.jsx)("div",{className:"flex flex-col mt-8 lg:mt-0",children:r&&(0,v.jsx)("div",{className:"flex flex-row items-center gap-4",children:(0,v.jsx)(u,{ast:r})})})]})]})})):(0,v.jsx)(D,Object.assign({},o,{blockName:"justified"}))}var Ge={block:{"block[kind=justified]":ft}};var L=f(I(),1),Je=f(P(),1);function xt(o){let{node:e}=o,{grid:t,body:r,links:i}=(0,Je.useMemo)(()=>{var a,d;let n=z("grid",e),s=R(e,g=>g.type!=="grid"),l=N("link[class*=button], crossReference[class*=button]",s);return{body:(d=(a=R(s,g=>!A("link[class*=button], crossReference[class*=button]",g)))===null||a===void 0?void 0:a.children)!==null&&d!==void 0?d:[],grid:n,links:l}},[e]);return t?(0,L.jsx)(M,Object.assign({},o,{children:(0,L.jsxs)("div",{className:"py-20 text-center sm:py-28",children:[(0,L.jsx)("div",{className:"font-semibold",children:(0,L.jsx)(u,{ast:r})}),t&&(0,L.jsx)(u,{ast:t}),i&&(0,L.jsx)("div",{className:"flex items-center justify-center gap-4 mt-8",children:(0,L.jsx)(u,{ast:i})})]})})):(0,L.jsx)(D,Object.assign({},o,{blockName:"logo-cloud"}))}var Ze={block:{"block[kind=logo-cloud]":xt}};var $e=Y([Ve,We,Ge,Ze]);var Xe=f(P()),T=f(I()),vt=Y([xe,ze,$e]),jt=({data:o})=>{var e,t,r,i;return ve({title:(e=o==null?void 0:o.config)==null?void 0:e.title,description:(t=o==null?void 0:o.config)==null?void 0:t.description,twitter:(i=(r=o==null?void 0:o.config)==null?void 0:r.options)==null?void 0:i.twitter})},kt=()=>[{rel:"stylesheet",href:Te},{rel:"stylesheet",href:_e},{rel:"stylesheet",href:"https://cdn.jsdelivr.net/npm/jupyter-matplotlib@0.11.3/css/mpl_widget.css"},{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css"}];function zt(o){let e={fields:ue,storeFields:["hierarchy","content","url","type","id","position"],idField:"id",searchOptions:{fuzzy:.2,prefix:!0}};return Ee(o.records,e)}function Qe(){let{theme:o,config:e,CONTENT_CDN_PORT:t,MODE:r,BASE_URL:i}=ce(),a=(0,Xe.useCallback)(d=>zt(d),[]);return(0,T.jsx)(me,{factory:a,children:(0,T.jsxs)(je,{theme:o,config:e,scripts:r==="static"?void 0:(0,T.jsx)(we,{port:t}),staticBuild:r==="static",baseurl:i,renderers:vt,head:(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)("link",{rel:"icon",href:`${i||""}/favicon.ico`}),(0,T.jsx)("link",{rel:"stylesheet",href:`${i||""}/myst-theme.css`})]}),children:[(0,T.jsx)(ye,{targets:[{id:"skip-to-frontmatter",title:"Skip to article frontmatter"},{id:"skip-to-article",title:"Skip to article content"}]}),(0,T.jsx)(le,{})]})})}export{ke as ErrorBoundary,Qe as default,kt as links,jt as meta};
