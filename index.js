/* global dscc */
document.body.style.margin="0";
const wrap=document.createElement('div');
const sel=document.createElement('select');
const frame=document.createElement('iframe');
wrap.appendChild(sel); wrap.appendChild(frame); document.body.appendChild(wrap);
wrap.style.cssText="font:14px system-ui;color:#e5e7eb;background:#111827;border:1px solid #2c2f36;border-radius:12px;padding:10px";
sel.style.cssText="padding:8px;border-radius:8px;background:#0b1220;color:#fff;border:1px solid #334155;min-width:220px;margin-bottom:8px";
frame.style.cssText="width:100%;height:70vh;border:0;border-radius:10px;background:#0b1220";

const toEmbed=u=>{try{const m=new URL(u).pathname.match(/\/document\/d\/([^/]+)/);
return m?`https://docs.google.com/document/d/${m[1]}/preview`:u;}catch{return u;}};

const labelFromKey=k=>{
  const m=String(k||"").match(/^(\d{4})-(\d{2})$/);
  if(!m) return k||""; const d=new Date(Date.UTC(+m[1],+m[2]-1,1));
  return d.toLocaleString('en-US',{month:'long',year:'numeric',timeZone:'UTC'});
};

const normalize=raw=>{
  let rows=[]; try{raw=JSON.parse(raw);}catch{return [];}
  if(Array.isArray(raw)){ rows=raw.map(r=>({monthKey:r.monthKey||r.key||r.month||"",monthLabel:r.monthLabel||"",doc:r.doc||r.url||""})); }
  else if(raw&&typeof raw==="object"){ rows=Object.entries(raw).map(([k,v])=>({monthKey:k,monthLabel:"",doc:String(v||"")})); }
  rows=rows.map(r=>({...r,monthLabel:r.monthLabel||labelFromKey(r.monthKey)}))
           .filter(r=>r.monthKey&&r.doc)
           .sort((a,b)=>String(b.monthKey).localeCompare(String(a.monthKey)));
  return rows;
};

const render=data=>{
  const cfg=data.style||{};
  const json=(cfg.json&&cfg.json.value)?cfg.json.value:"[]";
  const vh=(cfg.height&&cfg.height.value)?Number(cfg.height.value):70;
  frame.style.height=`${vh}vh`;
  const rows=normalize(json);
  sel.innerHTML=""; rows.forEach(r=>{const o=document.createElement('option');
    o.value=r.doc; o.textContent=r.monthLabel||r.monthKey; o.dataset.key=r.monthKey; sel.appendChild(o);});
  if(rows.length){ frame.src=toEmbed(rows[0].doc); }
  sel.onchange=()=> frame.src=toEmbed(sel.value);
};

dscc.subscribeToData(render,{transform: dscc.tableTransform.NONE});
