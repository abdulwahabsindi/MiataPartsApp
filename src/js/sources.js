function vendorFor(name){const l=name.toLowerCase();for(const[m,k]of VMAP){if(l.includes(m))return VENDORS.find(v=>v.k===k);}return null;}
function splitSrc(s){if(!s)return[];const out=[],seen=new Set();s.split(",").forEach(x=>{const t=x.trim();if(!t)return;const v=vendorFor(t);const key=v?v.k:t.toLowerCase();if(seen.has(key))return;seen.add(key);out.push({label:t,v:v});});return out;}
