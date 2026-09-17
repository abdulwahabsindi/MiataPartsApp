function renderChrome(){
 const T_=t();
 document.querySelectorAll("[data-t]").forEach(el=>{const k=el.dataset.t;if(T_[k]!==undefined)el.textContent=T_[k];});
 $("#app").dir=T_.dir;
 $("#q").placeholder=T_.ph;
 $("#btn-en").setAttribute("aria-pressed",LANG==="en");
 $("#btn-ar").setAttribute("aria-pressed",LANG==="ar");
 const cats=[...new Set(PARTS.map(p=>p.cat))].sort();
 $("#cats").innerHTML=[["*",T_.all,PARTS.length]].concat(cats.map(c=>[c,catName(c),PARTS.filter(p=>p.cat===c).length]))
  .map(([v,l,n])=>`<button class="cat" data-cat="${esc(v)}" aria-pressed="${v===CAT}">${esc(l)}<span class="n">${n}</span></button>`).join("");
 $("#cats").querySelectorAll(".cat").forEach(b=>b.onclick=()=>{CAT=b.dataset.cat;renderChrome();renderGrid();});
 $("#faqlist").innerHTML=FAQ.map(f=>`<div class="faqq"><div class="q">${esc(LANG==="en"?f.en:f.ar)}</div><div class="a">${esc(T_.awaiting)}</div></div>`).join("");
 $("#vendors").innerHTML=VENDORS.map(v=>{
  const d=LANG==="en"?v.dEn:v.dAr, ty=LANG==="en"?v.tEn:v.tAr;
  return `<div class="vendor"><div class="vt">${esc(ty)}</div><div class="vn">${esc(vName(v))}</div>${d?`<div class="vd">${esc(d)}</div>`:""}${v.p?`<div class="vd mono">${esc(v.p)}</div>`:""}${v.u?`<div style="margin-top:6px"><a href="${esc(v.u)}" target="_blank" rel="noopener">${esc(v.u.replace(/^https?:\/\//,""))}</a></div>`:""}</div>`;
 }).join("");
}

function shortInt(n){
 if(!n)return "";
 const raw=n[LANG].i;
 let v=raw.split(LANG==="en"?/[\u2014;]/:/[\u2014\u061b\u060c]/)[0].trim();
 if(v.length>44)v=v.slice(0,42).trim()+"\u2026";
 return v;
}
function renderGrid(){
 const T_=t(),list=PARTS.filter(matches);
 $("#count").textContent=T_.count(list.length,PARTS.length);
 if(!list.length){$("#grid").innerHTML=`<div class="empty">${esc(T_.empty)}</div>`;return;}
 $("#grid").innerHTML=list.map(p=>{
  const i=PARTS.indexOf(p)+1,n=N[p.id],alts=p.rows.filter(r=>r[0]==="A").length;
  return `<button class="card" data-id="${esc(p.id)}">
   <div class="card-top">${IMG[p.id]?`<span class="thumb"><img src="${IMG[p.id].t.src}" width="${IMG[p.id].t.w}" height="${IMG[p.id].t.h}" alt="" loading="lazy"></span>`:""}<div class="ctxt"><h3>${esc(nm(p))}</h3><div class="alt-name">${esc(alt(p))}</div></div><span class="idx">${String(i).padStart(2,"0")}</span></div>
   <div style="display:flex;gap:5px;flex-wrap:wrap"><span class="chip chip-cat">${esc(catName(p.cat))}</span><span class="chip chip-int">${esc(shortInt(n))}</span></div>
   <div class="card-oem"><span class="lab">${esc(T_.oem)}</span><span class="val mono">${esc(p.oem)}</span></div>
   <div class="card-foot"><span><b>${alts}</b> ${esc(T_.alts(alts).replace(/^\d+\s*/,""))}</span><span class="viewcue">${esc(T_.view)}<span class="arrow">→</span></span></div>
  </button>`;
 }).join("");
 $("#grid").querySelectorAll(".card").forEach(b=>b.onclick=()=>openPart(b.dataset.id));
}

function srcBlock(label,str){
 const T_=t(),items=splitSrc(str);
 if(!items.length)return `<div class="src"><div class="st">${esc(label)}</div><div class="srcpills"><span class="pill">${esc(T_.none)}</span></div></div>`;
 return `<div class="src"><div class="st">${esc(label)}</div><div class="srcpills">${items.map(it=>{
  const v=it.v,lbl=v?vName(v):it.label;
  return v&&v.u?`<a class="pill" href="${esc(v.u)}" target="_blank" rel="noopener">${esc(lbl)}</a>`:`<span class="pill">${esc(lbl)}</span>`;
 }).join("")}</div></div>`;
}
