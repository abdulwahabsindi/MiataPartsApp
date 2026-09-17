let LANG="en",CAT="*",Q="";
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?"":s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const t=()=>T[LANG];
const nm=p=>LANG==="en"?p.en:p.ar;
const alt=p=>LANG==="en"?p.ar:p.en;
const catName=c=>LANG==="en"?c:(CAT_AR[c]||c);
const vName=v=>LANG==="en"?v.en:v.ar;

function matches(p){
 if(CAT!=="*"&&p.cat!==CAT)return false;
 if(!Q)return true;
 const hay=[p.en,p.ar,p.oem,p.sup,p.id,p.fit,p.cat,catName(p.cat)].concat(p.rows.map(r=>r[1]+" "+r[2])).join(" ").toLowerCase();
 return Q.split(/\s+/).every(w=>hay.includes(w));
}
