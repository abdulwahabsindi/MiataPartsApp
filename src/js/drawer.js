let lastFocus=null;
function openPart(id){
 const T_=t(),p=PARTS.find(x=>x.id===id),i=PARTS.indexOf(p)+1,n=N[p.id][LANG];
 lastFocus=document.activeElement;
 $("#drawer").innerHTML=`
  <div class="dhead">
   <button class="dclose" id="dclose" aria-label="${esc(T_.close)}">&times;</button>
   <div class="idx2">${String(i).padStart(2,"0")} / ${PARTS.length} &nbsp;·&nbsp; ${esc(p.id)}</div>
   <h2 id="dtitle">${esc(nm(p))}</h2>
   <div class="alt2">${esc(alt(p))}</div>
   <div class="chips"><span class="chip chip-cat">${esc(catName(p.cat))}</span><span class="chip chip-int">${esc(n.i)}</span></div>
  </div>
  <div class="dbody">
   ${IMG[p.id]?`<section class="sec"><div class="dimg"><img src="${IMG[p.id].f.src}" width="${IMG[p.id].f.w}" height="${IMG[p.id].f.h}" style="aspect-ratio:${IMG[p.id].f.w}/${IMG[p.id].f.h}" alt="${esc(nm(p))}"></div><div class="imgcap">${esc(T_.imgCap)}</div></section>`:""}
   <section class="sec"><div class="sh"><span>${esc(T_.sFit)}</span></div>
    <dl class="kv">
     <dt>${esc(T_.lFit)}</dt><dd>${esc(p.fit)}</dd>
     <dt>${esc(T_.lOem)}</dt><dd class="pn mono">${esc(p.oem)}</dd>
     ${p.sup?`<dt>${esc(T_.lSup)}</dt><dd><div class="sups">${p.sup.split(",").map(s=>`<span class="sup">${esc(s.trim())}</span>`).join("")}</div></dd>`:""}
     <dt>${esc(T_.lInt)}</dt><dd>${esc(n.i)}</dd>
    </dl></section>

   <section class="sec"><details class="why-d">
    <summary class="sh why-sum"><span>${esc(T_.sWhy)}</span><span class="why-chev">▾</span></summary>
    <div class="note"><div class="why">${esc(n.w)}</div><ul class="sym">${n.p.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></div>
   </details></section>

   <section class="sec"><div class="sh"><span>${esc(T_.sX)}</span><span class="mono" style="color:var(--ink-3)">${p.rows.length}</span></div>
    <div class="tblwrap"><table><thead><tr><th>${esc(T_.tBrand)}</th><th>${esc(T_.tNum)}</th><th>${esc(T_.tType)}</th></tr></thead><tbody>
    ${p.rows.map(r=>`<tr class="${r[0]==="O"?"oemrow":""}"><td class="brand">${esc(r[1])}</td><td class="num">${esc(r[2])}</td><td><span class="eq ${r[0]==="O"?"eq-oem":"eq-dir"}">${esc(r[0]==="O"?T_.eqOem:T_.eqDir)}</span></td></tr>`).join("")}
    </tbody></table></div></section>

   <section class="sec"><div class="sh"><span>${esc(T_.sBuy)}</span></div>
    <div class="srcgrid">
     ${srcBlock(T_.inKsa,[...new Set(p.rows.map(r=>r[4]>=0?KSA[r[4]]:"").filter(Boolean))].join(", "))}
     ${srcBlock(T_.intl,[...new Set(p.rows.map(r=>r[5]>=0?INTL[r[5]]:"").filter(Boolean))].join(", "))}
    </div></section>

   <section class="sec"><div class="sh"><span>${esc(T_.sNotes)}</span></div>
    <div class="faqq"><div class="a" style="font-style:italic">${esc(T_.noteEmpty)}</div></div></section>
  </div>`;
 $("#drawer").classList.add("on");$("#scrim").classList.add("on");
 $("#dclose").onclick=closePart;$("#drawer").focus();
}
function closePart(){$("#drawer").classList.remove("on");$("#scrim").classList.remove("on");if(lastFocus)lastFocus.focus();}
