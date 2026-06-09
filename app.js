// ═══════════════════════════════════════════════════════════════════
// app.js — Rehab Bor v11 — CAPA DE LÓGICA
// Los DATOS viven en data.js (SESSIONS, EX_DB, WEIGHTED_EX, MOB_BLOCK_*,
// START_DATE, NEURAL_DAYS, CRITERIA_F3). Este archivo NO los redeclara.
// Reconstruido desde rehab_v10.html y adaptado al HTML de index.html v11.
// ═══════════════════════════════════════════════════════════════════

// ─── ESTADO Y CONSTANTES DE RUNTIME ────────────────────────────────
const NEURAL = NEURAL_DAYS; // alias (NEURAL_DAYS se define en data.js)
const TODAY = new Date();
const DS = ['Dom','Lun','Mar','Mie','Jue','Vie','Sab'];
const DC = {0:{h:'#3C3489',l:'#EEEDFE22'},1:{h:'#185FA5',l:'#E6F1FB22'},2:{h:'#0F6E56',l:'#E1F5EE22'},3:{h:'#888780',l:'#F1EFE822'},4:{h:'#185FA5',l:'#E6F1FB22'},5:{h:'#993C1D',l:'#FAECE722'},6:{h:'#888780',l:'#F1EFE822'}};
let curDay = TODAY.getDay(), openBlks = {}, syncTimeout = null;
let PROG_STAGE = localStorage.getItem('rehab_prog_stage_v8') || 'S1-2';

const SK_ENT='rehab_ent_v8', SK_WTS='rehab_wts_v8', SK_CRIT='rehab_crit_v8';
const SK_DONE = k => 'rehab_done_v8_' + k;
const SK_PLAN = 'rehab_plan_v9';

function computeWeekNum(){return Math.max(1,Math.floor((TODAY-START_DATE)/(7*86400000))+1);}
let WEEK_NUM = parseInt(localStorage.getItem('rehab_week_override_v11')) || computeWeekNum();
function changeWeek(delta){
  WEEK_NUM = Math.max(1, WEEK_NUM + delta);
  localStorage.setItem('rehab_week_override_v11', WEEK_NUM);
  const wd = document.getElementById('weekDisplay'); if(wd) wd.textContent = WEEK_NUM;
  renderAll(); renderWtSummary(); renderDash();
}

// ─── STORAGE HELPERS ───────────────────────────────────────────────
function loadEntries(){try{return JSON.parse(localStorage.getItem(SK_ENT)||'{}')}catch{return{}}}
function saveEntries(e){localStorage.setItem(SK_ENT,JSON.stringify(e));scheduleSync();}
function loadWeights(){try{return JSON.parse(localStorage.getItem(SK_WTS)||'{}')}catch{return{}}}
function saveWeights(w){localStorage.setItem(SK_WTS,JSON.stringify(w));scheduleSync();}
function loadDone(k){try{return JSON.parse(localStorage.getItem(SK_DONE(k))||'{}')}catch{return{}}}
function saveDone(k,d){localStorage.setItem(SK_DONE(k),JSON.stringify(d));scheduleSync();}
function loadCriteria(){try{return JSON.parse(localStorage.getItem(SK_CRIT)||'[]')}catch{return[]}}
function saveCriteria(c){localStorage.setItem(SK_CRIT,JSON.stringify(c));}
function loadVStages(){try{return JSON.parse(localStorage.getItem('rehab_vstg_v8')||'{}')}catch{return{}}}
function saveVStages(v){localStorage.setItem('rehab_vstg_v8',JSON.stringify(v));}
function getSheetsUrl(){return localStorage.getItem('sheets_url_v8')||''}
function loadPlan(){try{return JSON.parse(localStorage.getItem(SK_PLAN)||'{}')}catch{return{}}}
function savePlan(p){localStorage.setItem(SK_PLAN,JSON.stringify(p));}

// ─── FECHAS ────────────────────────────────────────────────────────
function todayKey(){return TODAY.toISOString().split('T')[0];}
function getWeekDays(){const dow=TODAY.getDay(),m=new Date(TODAY);m.setDate(TODAY.getDate()-((dow+6)%7));return Array.from({length:7},(_,i)=>{const d=new Date(m);d.setDate(m.getDate()+i);return d;});}

// ─── PLAN FLEXIBLE ─────────────────────────────────────────────────
const DEFAULT_PLAN={0:{sessId:0,mode:'home'},1:{sessId:1,mode:'gym'},2:{sessId:2,mode:'gym'},4:{sessId:4,mode:'gym'},5:{sessId:5,mode:'gym'},6:{sessId:6,mode:'home'}};
function getPlanForDate(dateKey){const p=loadPlan();return p[dateKey]||null;}
function setPlanForDate(dateKey,sessId,mode){
  const p=loadPlan();
  if(sessId===null){delete p[dateKey];}
  else{p[dateKey]={sessId,mode:mode||'gym'};}
  savePlan(p);
}
function getDefaultSessForDow(dow){
  if(DEFAULT_PLAN[dow])return{sessId:DEFAULT_PLAN[dow].sessId,mode:DEFAULT_PLAN[dow].mode};
  if(NEURAL.has(dow))return{sessId:dow,mode:'neural'};
  return null;
}
function getPlanEntry(dateKey,dow){
  const p=loadPlan();
  if(p[dateKey])return p[dateKey];
  return getDefaultSessForDow(dow);
}
// En v11 las sesiones neurales (3,6) viven dentro de SESSIONS (no hay NEURAL_SESS)
function getSessionById(sessId){return SESSIONS[sessId]||null;}
function getCurSession(){
  const entry=getPlanEntry(curDateKey(),curDow());
  if(!entry||entry.mode==='rest')return null;
  if(entry.mode==='neural'){
    const nid=typeof entry.sessId==='number'?entry.sessId:curDow();
    return SESSIONS[nid]||SESSIONS[3]||null;
  }
  return SESSIONS[entry.sessId]||null;
}
function getCurMode(){const entry=getPlanEntry(curDateKey(),curDow());return entry?entry.mode:'gym';}
function curDow(){return curDay;}
function curDateKey(){
  const days=getWeekDays();
  const d=days.find(d=>d.getDay()===curDay);
  return d?d.toISOString().split('T')[0]:todayKey();
}

// ─── SUGERENCIA AUTOMATICA ─────────────────────────────────────────
const SESS_ORDER=[1,2,4,5];
const LUMBAR_HIGH=new Set([1]);
function getSuggestions(){
  const days=getWeekDays();
  const plan=loadPlan();
  const assigned=new Set();
  days.forEach(d=>{
    const dk=d.toISOString().split('T')[0];
    const dow=d.getDay();
    const entry=getPlanEntry(dk,dow);
    if(entry&&entry.sessId&&entry.mode!=='rest'&&entry.mode!=='neural'){assigned.add(entry.sessId);}
  });
  const pending=SESS_ORDER.filter(id=>!assigned.has(id));
  const today=TODAY.toISOString().split('T')[0];
  const freeDays=days.filter(d=>{
    const dk=d.toISOString().split('T')[0];
    if(dk<today)return false;
    const dow=d.getDay();
    const explicit=plan[dk];
    if(explicit&&explicit.mode==='rest')return false;
    if(explicit&&explicit.sessId)return false;
    const def=DEFAULT_PLAN[dow];
    if(def&&(def.mode==='gym')&&assigned.has(def.sessId))return false;
    if(!def&&NEURAL.has(dow))return false;
    if(def&&def.mode!=='gym')return false;
    return true;
  });
  const suggestions=[];
  let pendingCopy=[...pending];
  freeDays.forEach(d=>{
    if(!pendingCopy.length)return;
    const dk=d.toISOString().split('T')[0];
    const dow=d.getDay();
    const prevDay=new Date(d);prevDay.setDate(d.getDate()-1);
    const prevDk=prevDay.toISOString().split('T')[0];
    const prevEntry=getPlanEntry(prevDk,prevDay.getDay());
    const prevHighLumbar=prevEntry&&LUMBAR_HIGH.has(prevEntry.sessId);
    let pick=pendingCopy.find(id=>!prevHighLumbar||!LUMBAR_HIGH.has(id));
    if(!pick)pick=pendingCopy[0];
    if(pick){
      pendingCopy=pendingCopy.filter(id=>id!==pick);
      const s=SESSIONS[pick];
      suggestions.push({dateKey:dk,dow,sessId:pick,sessName:s?s.name:'?',hasHome:!!(s&&s.homeLoc)});
    }
  });
  return{pending,suggestions};
}

function initDefaultWeights(){
  const wts=loadWeights();let changed=false;
  WEIGHTED_EX.forEach(ex=>{if(ex.w65init&&(!wts[ex.id]||!wts[ex.id].w65)){if(!wts[ex.id])wts[ex.id]={};wts[ex.id].w65=ex.w65init;changed=true;}});
  if(changed)saveWeights(wts);
}

// ─── PESOS ─────────────────────────────────────────────────────────
function roundKg(v){return Math.round(v*2)/2;}
function calcWeight(wid,wk){
  const wts=loadWeights(),data=wts[wid]||{},w65=data.w65||0;
  if(!w65)return null;
  let w=w65;const hist=data.history||{};
  for(let i=1;i<wk;i++){const s=hist[i];if(s==='green')w=roundKg(w*1.05);else if(s==='red')w=roundKg(w*0.95);}
  return{w,w65,est100:roundKg(w65/0.65),warmup:roundKg(w*0.6),topset:roundKg(w*1.05)};
}

// ─── ERGÓMETRO LOG ─────────────────────────────────────────────────
function buildErgLog(){
  const SK='rehab_erg_v8';
  function loadErg(){try{return JSON.parse(localStorage.getItem(SK)||'{}')}catch{return{}}}
  const key=todayKey();
  const d=loadErg();
  const entry=d[key]||{t:'',p:'',m:''};
  const isOpen=window._ergOpen;
  let html='<div class="wt-widget" id="erg_widget" style="margin-top:6px">';
  if(entry.t||entry.p){
    html+='<div class="wt-closed" onclick="toggleErgLog()" style="cursor:pointer">'
      +'<div class="wt-closed-left"><div class="wt-closed-row1">'
      +(entry.t?'<span class="wt-closed-cur" style="font-size:15px">'+entry.t+'</span><span class="wt-closed-unit">min</span>':'')
      +(entry.p?'<span style="font-size:11px;color:var(--text3);font-family:var(--mono);margin-left:8px">500m: '+entry.p+'</span>':'')
      +'</div><div class="wt-closed-row2"><span class="wt-closed-label">2000m — registro de hoy</span></div></div>'
      +'<span class="wt-closed-chev'+(isOpen?' open':'')+'">▼</span></div>';
  } else {
    html+='<div class="wt-no-data" onclick="toggleErgLog()" style="cursor:pointer">'
      +'<span style="font-size:14px">🚣</span><span>Registrar 2000m</span>'
      +'<span class="wt-closed-chev'+(isOpen?' open':'')+'" style="margin-left:auto">▼</span></div>';
  }
  html+='<div id="erg_body" style="display:'+(isOpen?'block':'none')+';padding:10px 12px;border-top:1px solid var(--b5)">';
  html+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px">';
  html+='<div class="wt-input-group"><div class="wt-input-lbl">Tiempo total (min:seg)</div>'
    +'<input class="wt-input" type="text" inputmode="text" placeholder="ej: 7:42" value="'+entry.t+'" id="erg_t" oninput="saveErgField(&apos;t&apos;,this.value)"></div>';
  html+='<div class="wt-input-group"><div class="wt-input-lbl">Mejor parcial 500m</div>'
    +'<input class="wt-input" type="text" inputmode="text" placeholder="ej: 1:52" value="'+entry.p+'" id="erg_p" oninput="saveErgField(&apos;p&apos;,this.value)"></div>';
  html+='</div>';
  html+='<div class="wt-input-group"><div class="wt-input-lbl">Nota (opcional)</div>'
    +'<input class="wt-input" type="text" placeholder="fc, sensaciones..." value="'+entry.m+'" id="erg_m" oninput="saveErgField(&apos;m&apos;,this.value)"></div>';
  html+='</div></div>';
  return html;
}
function toggleErgLog(){
  window._ergOpen=!window._ergOpen;
  const body=document.getElementById('erg_body');
  if(body)body.style.display=window._ergOpen?'block':'none';
  const chev=document.querySelector('#erg_widget .wt-closed-chev');
  if(chev)chev.classList.toggle('open',!!window._ergOpen);
}
function saveErgField(field,val){
  const SK='rehab_erg_v8';
  function loadErg(){try{return JSON.parse(localStorage.getItem(SK)||'{}')}catch{return{}}}
  const d=loadErg();const key=todayKey();
  if(!d[key])d[key]={t:'',p:'',m:''};
  d[key][field]=val;
  localStorage.setItem(SK,JSON.stringify(d));
  scheduleSync();
}

function buildWW(wid){
  const ex=WEIGHTED_EX.find(e=>e.id===wid);if(!ex)return'';
  const wts=loadWeights(),data=wts[wid]||{},w65=data.w65||0,hist=data.history||{};
  const wd=w65?calcWeight(wid,WEEK_NUM):null,curW=wd?wd.w:null,wkS=hist[WEEK_NUM]||'';
  const SC={green:'#3B9A6A',amber:'#D4831A',red:'#C94040'};
  const SB={green:'#132A1E',amber:'#2A1E0A',red:'#2A1010'};
  const SI={green:'↑',amber:'=',red:'↓'};
  const wwOpen=window._wwOpen&&window._wwOpen[wid];
  let pillsHtml='';
  for(let wk=Math.max(1,WEEK_NUM-1);wk<=WEEK_NUM+3;wk++){
    const pd=w65?calcWeight(wid,wk):null,isCur=wk===WEEK_NUM,wkH=hist[wk];
    const bg=isCur?(wkS?SB[wkS]:'var(--dblue)'):'var(--bg3)';
    const col=isCur?(wkS?SC[wkS]:'var(--blue)'):'var(--text2)';
    const hI=wkH?SI[wkH]:'';
    pillsHtml+='<div class="wt-prog-pill'+(isCur?' current':'')+'" style="background:'+bg+';color:'+col+'" data-wid="'+wid+'" data-wk="'+wk+'" onclick="cycleWeekStatus(this.dataset.wid,+this.dataset.wk)">S'+wk+'<br><b>'+(pd?pd.w+'kg':'—')+'</b>'+(hI?'<br><span style="font-size:11px">'+hI+'</span>':'')+'</div>';
  }
  let miniPills='';
  for(let wk=Math.max(1,WEEK_NUM-1);wk<=WEEK_NUM+1;wk++){
    const pd=w65?calcWeight(wid,wk):null;
    const wkH=hist[wk];
    const isCur=wk===WEEK_NUM;
    const bg=isCur?(wkS?SB[wkS]:'var(--dblue)'):'var(--bg2)';
    const col=isCur?(wkS?SC[wkS]:'var(--blue)'):'var(--text3)';
    miniPills+='<span class="wt-mini-pill" style="background:'+bg+';color:'+col+';border:1px solid '+(isCur?(wkS?SC[wkS]:'var(--blue)'):'var(--b5)')+'">S'+wk+' '+(pd?pd.w+'kg':'—')+(wkH?' '+SI[wkH]:'')+'</span>';
  }
  let html='<div class="wt-widget" id="ww_'+wid+'" style="'+(wkS?'border-color:'+SC[wkS]+'55':'')+';">';
  if(w65&&curW){
    html+='<div class="wt-closed" onclick="toggleWW(\''+wid+'\')">'
      +'<div class="wt-closed-left"><div class="wt-closed-row1">'
      +'<span class="wt-closed-cur">'+curW+'</span><span class="wt-closed-unit">kg</span>'
      +'<span class="wt-closed-week">S'+WEEK_NUM+(wkS?' '+SI[wkS]:'')+'</span>'
      +(wd?'<span style="font-size:10px;color:var(--text3);font-family:var(--mono)">· 60%: '+wd.warmup+'kg · +5%: '+wd.topset+'kg</span>':'')
      +'</div><div class="wt-closed-row2"><span class="wt-closed-label">'+ex.name+'</span><div class="wt-mini-pills">'+miniPills+'</div></div></div>'
      +'<span class="wt-closed-chev'+(wwOpen?' open':'')+'">▼</span></div>';
  } else {
    html+='<div class="wt-no-data" onclick="toggleWW(\''+wid+'\')">'
      +'<span style="font-size:14px">⚖</span><span>'+ex.name+' — introducir peso 65%</span>'
      +'<span class="wt-closed-chev'+(wwOpen?' open':'')+'" style="margin-left:auto">▼</span></div>';
  }
  html+='<div class="wt-body" id="ww_body_'+wid+'" style="display:'+(wwOpen?'block':'none')+'">';
  html+='<div class="wt-input-row">'
    +'<div class="wt-input-group"><div class="wt-input-lbl">Peso al 65% — '+ex.note+'</div>'
    +'<div style="display:flex;align-items:center;gap:6px"><input class="wt-input" type="number" inputmode="decimal" step="0.5" min="0.5" max="500" value="'+(w65||'')+'" placeholder="ej: 40" data-wid="'+wid+'" oninput="setW65Input(this)"> <span style="font-size:12px;color:var(--text3)">kg</span></div></div>'
    +(w65?'<div class="wt-input-group" style="flex:0 0 auto;min-width:80px"><div class="wt-input-lbl">100% estimado</div><div style="padding:6px 8px;border:1.5px solid var(--blue)44;border-radius:var(--rsm);font-size:16px;font-weight:700;color:var(--blue);background:var(--dblue);text-align:center;font-family:var(--mono)">'+roundKg(w65/0.65)+'kg</div></div>':'')
  +'</div>';
  if(w65&&curW){
    html+='<div class="wt-calc">'
      +'<div class="wt-calc-item"><div class="wt-calc-val">'+wd.warmup+'kg</div><div class="wt-calc-lbl">Calentamiento</div></div>'
      +'<div class="wt-calc-item"><div class="wt-calc-val main">'+curW+'kg</div><div class="wt-calc-lbl">Trabajo S'+WEEK_NUM+'</div></div>'
      +'<div class="wt-calc-item"><div class="wt-calc-val">'+wd.topset+'kg</div><div class="wt-calc-lbl">Top set</div></div></div>'
      +'<div class="wt-prog-row">'+pillsHtml+'</div>'
      +'<div class="wt-action-row">'
      +'<button class="wt-action-btn" style="background:#132A1E;color:#3B9A6A;border:1px solid #3B9A6A44" data-wid="'+wid+'" data-st="green" onclick="logWt(this.dataset.wid,this.dataset.st)">↑ Avanzar</button>'
      +'<button class="wt-action-btn" style="background:#2A1E0A;color:#D4831A;border:1px solid #D4831A44" data-wid="'+wid+'" data-st="amber" onclick="logWt(this.dataset.wid,this.dataset.st)">= Mantener</button>'
      +'<button class="wt-action-btn" style="background:#2A1010;color:#C94040;border:1px solid #C9404044" data-wid="'+wid+'" data-st="red" onclick="logWt(this.dataset.wid,this.dataset.st)">↓ Reducir</button></div>';
  } else {
    html+='<div style="font-size:11px;color:var(--text3);padding:4px 0;font-family:var(--mono)">'+(w65?'Calculando…':'Introduce el peso al 65% de esfuerzo percibido')+'</div>';
  }
  if(data.lastLog)html+='<div style="font-size:10px;color:var(--text3);margin-top:8px;font-family:var(--mono);padding-top:8px;border-top:1px solid var(--b5)">'+data.lastLog+'</div>';
  html+='</div></div>';
  return html;
}
function setW65Input(el){
  clearTimeout(el._t);
  el._t=setTimeout(()=>{const v=parseFloat(el.value);if(!v||v<=0)return;const wts=loadWeights();if(!wts[el.dataset.wid])wts[el.dataset.wid]={};wts[el.dataset.wid].w65=v;saveWeights(wts);refreshWW(el.dataset.wid);renderWtSummary();},600);
}
function logWt(wid,status){
  const wts=loadWeights();if(!wts[wid])wts[wid]={};if(!wts[wid].history)wts[wid].history={};
  wts[wid].history[WEEK_NUM]=status;
  const L={green:'Avanzado',amber:'Mantenido',red:'Reducido'};
  wts[wid].lastLog='S'+WEEK_NUM+': '+L[status]+' ('+new Date().toLocaleDateString('es-ES')+')';
  saveWeights(wts);refreshWW(wid);renderWtSummary();
}
function cycleWeekStatus(wid,wk){
  const wts=loadWeights();if(!wts[wid])wts[wid]={};if(!wts[wid].history)wts[wid].history={};
  const cur=wts[wid].history[wk];const cyc={undefined:'green',green:'amber',amber:'red',red:undefined};
  const nxt=cyc[String(cur)];if(nxt)wts[wid].history[wk]=nxt;else delete wts[wid].history[wk];
  saveWeights(wts);refreshWW(wid);
}
function toggleWW(wid){
  if(!window._wwOpen)window._wwOpen={};
  window._wwOpen[wid]=!window._wwOpen[wid];
  const body=document.getElementById('ww_body_'+wid);
  if(body)body.style.display=window._wwOpen[wid]?'block':'none';
  const widget=document.getElementById('ww_'+wid);
  if(widget){const chev=widget.querySelector('.wt-closed-chev');if(chev)chev.classList.toggle('open',!!window._wwOpen[wid]);}
}
function refreshWW(wid){const old=document.getElementById('ww_'+wid);if(old){const nw=document.createElement('div');nw.innerHTML=buildWW(wid);if(nw.firstChild)old.replaceWith(nw.firstChild);}}

function renderWtSummary(){
  const el=document.getElementById('wtSummary');if(!el)return;
  const wts=loadWeights();
  const DN={0:'Dom',1:'Lun',2:'Mar',4:'Jue',5:'Vie',6:'Sab'};
  const SC={green:'#3B9A6A',amber:'#D4831A',red:'#C94040'};
  const SB={green:'#132A1E',amber:'#2A1E0A',red:'#2A1010'};
  const SI={green:'+',amber:'=',red:'-'};
  const rows=WEIGHTED_EX.map(ex=>{
    const data=wts[ex.id]||{},w65=data.w65||0;
    const wd=w65?calcWeight(ex.id,WEEK_NUM):null;
    const wkS=(data.history||{})[WEEK_NUM];
    return '<tr><td style="font-weight:600;font-size:12px">'+ex.name+'<br><span style="font-size:10px;color:var(--text3)">'+(DN[ex.day]||'Dom')+' · '+ex.note+'</span></td>'
      +'<td style="text-align:center;font-family:var(--mono);font-size:12px">'+(w65?w65+'kg':'—')+'</td>'
      +'<td style="text-align:center;font-family:var(--mono);font-size:12px">'+(w65?roundKg(w65/0.65)+'kg':'—')+'</td>'
      +'<td style="text-align:center;font-weight:700;color:var(--blue);font-family:var(--mono);font-size:12px">'+(wd?wd.w+'kg':'—')+'</td>'
      +'<td style="text-align:center">'+(wkS?'<span style="background:'+SB[wkS]+';color:'+SC[wkS]+';font-size:11px;font-weight:700;padding:2px 6px;border-radius:20px">'+SI[wkS]+'</span>':'—')+'</td></tr>';
  }).join('');
  el.innerHTML='<div style="overflow-x:auto"><table class="wt-table"><thead><tr><th>Ejercicio</th><th>65%</th><th>100%</th><th>S'+WEEK_NUM+'</th><th>Est.</th></tr></thead><tbody>'+rows+'</tbody></table></div>';
}

// ─── VARIANTES POR EJERCICIO ───────────────────────────────────────
function getExStage(exName){
  const vs=loadVStages();
  const exData=vs[exName]||{};
  const logged=Object.keys(exData).map(Number).filter(w=>w<=WEEK_NUM).sort((a,b)=>b-a);
  return logged.length?exData[logged[0]]:PROG_STAGE;
}
function getVariantForExercise(exName,variantStr){
  if(!variantStr)return null;
  const stage=getExStage(exName);
  const parts=variantStr.split(' · ');
  const match=parts.find(p=>p.startsWith(stage));
  return match||parts[parts.length-1];
}

// ─── TRACKER ───────────────────────────────────────────────────────
let curPain={m:-1,d:-1,n:-1};
const PAIN_DESC=['Sin dolor','Minimo','Leve','Leve notable','Moderado','Moderado alto','Considerable','Intenso','Muy intenso','Severo','Maximo'];
function switchTrkTab(slot){
  ['m','d','n'].forEach(s=>{
    const tid={m:'trkTabM',d:'trkTabD',n:'trkTabN'}[s];
    const pid={m:'trkPanelM',d:'trkPanelD',n:'trkPanelN'}[s];
    const t=document.getElementById(tid),p=document.getElementById(pid);
    if(t)t.classList.toggle('active',s===slot);
    if(p)p.classList.toggle('active',s===slot);
  });
}
function renderPainRow(slot){
  const ids={m:'painRowM',d:'painRowD',n:'painRowN'};
  const descIds={m:'painDescM',d:'painDescD',n:'painDescN'};
  const row=document.getElementById(ids[slot]);if(!row)return;
  row.innerHTML='';
  const val=curPain[slot];
  for(let i=0;i<=10;i++){
    const b=document.createElement('button');b.className='p-btn';b.textContent=i;
    if(val===i)b.classList.add(i<=3?'sl':i<=6?'sm':'sh');
    b.onclick=(v=>()=>{curPain[slot]=v;renderPainRow(slot);})(i);
    row.appendChild(b);
  }
  const desc=document.getElementById(descIds[slot]);
  if(desc)desc.textContent=val>=0?val+'/10 — '+PAIN_DESC[val]:'Selecciona un valor';
}
function renderAllPainRows(){['m','d','n'].forEach(s=>renderPainRow(s));}
function toggleChip(el){el.classList.toggle('active');}
function toggleZone(el){el.classList.toggle('active');}
function getAC(id){return[...document.querySelectorAll('#'+id+' .chip.active, #'+id+' .body-zone.active')].map(c=>(c.dataset.z||c.textContent).trim());}

function saveDayEntry(){
  const ent=loadEntries();
  const pains=[curPain.m,curPain.d,curPain.n].filter(x=>x>=0);
  const painMax=pains.length?Math.max(...pains):-1;
  ent[todayKey()]={
    pain:painMax,
    slots:{
      m:{pain:curPain.m,ptype:getAC('ptChipsM'),irr:getAC('irrChipsM')},
      d:{pain:curPain.d,ptype:getAC('ptChipsD'),irr:getAC('irrChipsD')},
      n:{pain:curPain.n,ptype:getAC('ptChipsN'),irr:getAC('irrChipsN')},
    },
    zones:getAC('bodyMap'),
    irrZones:getAC('irrMap'),
    stiff:getAC('stiffRow'),
    acts:getAC('actChips'),
    note:document.getElementById('dayNote')?.value||'',
    ts:new Date().toISOString()
  };
  saveEntries(ent);renderWStrip();renderMetrics();renderDash();
  const btn=document.querySelector('[onclick="saveDayEntry()"]');
  if(btn){btn.textContent='Guardado ✓';btn.style.background='#3B9A6A';setTimeout(()=>{btn.textContent='Guardar registro del día';btn.style.background='';},2500);}
}

// ─── WEEK STRIP + METRICAS ─────────────────────────────────────────
function renderWStrip(id='wstrip'){
  const ent=loadEntries(),el=document.getElementById(id);if(!el)return;
  el.innerHTML=getWeekDays().map(d=>{
    const k=d.toISOString().split('T')[0],e=ent[k];
    let dot='var(--b5)';if(e&&e.pain>=0)dot=e.pain>=7?'var(--red)':e.pain>=4?'var(--amber)':'var(--green)';
    const isT=d.toDateString()===TODAY.toDateString(),isN=NEURAL.has(d.getDay());
    return '<div class="ws-d" style="'+(isT?'border:2px solid var(--blue);':'')+(isN?'background:var(--damber);':'')+'">'
      +'<div class="ws-n">'+DS[d.getDay()]+'</div><div class="ws-num" style="'+(isT?'color:var(--blue);':isN?'color:var(--amber);':'')+'">'+(d.getDate())+'</div>'
      +'<div class="ws-dot" style="background:'+dot+'"></div></div>';
  }).join('');
}
function renderMetrics(){
  const ent=loadEntries(),keys=getWeekDays().map(d=>d.toISOString().split('T')[0]);
  const rec=keys.filter(k=>ent[k]&&ent[k].pain>=0),pains=rec.map(k=>ent[k].pain);
  const avg=pains.length?Math.round(pains.reduce((a,b)=>a+b,0)/pains.length*10)/10:null;
  const ses=keys.filter(k=>ent[k]&&(ent[k].acts||[]).some(a=>a!=='Descanso neural')).length;
  const irrCheck=e=>{if(!e)return false;if(e.slots)return['m','d','n'].some(s=>(e.slots[s]?.irr||[]).some(z=>z&&!z.includes('Sin')));return(e.irr||[]).some(z=>z&&!z.includes('Sin'));};
  const irr=keys.filter(k=>irrCheck(ent[k])).length;
  const s=x=>document.getElementById(x);
  if(s('mD'))s('mD').textContent=rec.length+'/7';
  if(s('mP'))s('mP').textContent=avg!==null?avg:'—';
  if(s('mS'))s('mS').textContent=ses;
  if(s('mI'))s('mI').textContent=irr;
}

// ─── DASHBOARD ─────────────────────────────────────────────────────
function renderDash(){
  const ent=loadEntries();
  const s=x=>document.getElementById(x);
  if(s('dWk'))s('dWk').textContent=WEEK_NUM;
  if(s('dDays'))s('dDays').textContent=Object.keys(ent).length;
  if(s('dStreak'))s('dStreak').textContent=computeStreak(ent);
  renderPainChart('painChart');
  renderWtTableBody();
  renderCriteria();
}
function computeStreak(ent){
  let streak=0;const d=new Date(TODAY);
  for(;;){const k=d.toISOString().split('T')[0];if(ent[k]&&ent[k].pain>=0){streak++;d.setDate(d.getDate()-1);}else break;}
  return streak;
}
function renderWtTableBody(){
  const tb=document.getElementById('wtTableBody');if(!tb)return;
  const wts=loadWeights();
  const SI={green:'↑',amber:'=',red:'↓'};
  tb.innerHTML=WEIGHTED_EX.map(ex=>{
    const data=wts[ex.id]||{},w65=data.w65||0;
    const wd=w65?calcWeight(ex.id,WEEK_NUM):null;
    const wkS=(data.history||{})[WEEK_NUM];
    return '<tr><td style="font-size:12px;font-weight:600">'+ex.name+'</td>'
      +'<td style="text-align:center;font-family:var(--mono);font-size:12px;color:var(--blue);font-weight:700">'+(wd?wd.w+'kg':'—')+'</td>'
      +'<td style="text-align:center;font-family:var(--mono);font-size:12px">'+(w65?w65+'kg':'—')+'</td>'
      +'<td style="text-align:center">'+(wkS?SI[wkS]:'—')+'</td></tr>';
  }).join('');
}
function renderPainChart(elId){
  const el=document.getElementById(elId);if(!el)return;
  const ent=loadEntries();
  const weeks=[];
  for(let w=3;w>=0;w--){
    const start=new Date(START_DATE);start.setDate(start.getDate()+(WEEK_NUM-1-w)*7);
    const days=Array.from({length:7},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return d.toISOString().split('T')[0];});
    const pains=days.map(k=>ent[k]&&ent[k].pain>=0?ent[k].pain:null).filter(x=>x!==null);
    const avg=pains.length?Math.round(pains.reduce((a,b)=>a+b,0)/pains.length*10)/10:null;
    weeks.push({label:'S'+(WEEK_NUM-w),avg});
  }
  el.innerHTML=weeks.map(wk=>{
    const h=wk.avg!==null?Math.max(10,Math.round(wk.avg/10*64)):0;
    const color=wk.avg===null?'var(--b5)':wk.avg>=7?'var(--red)':wk.avg>=4?'var(--amber)':'var(--green)';
    return '<div class="pain-bar-wrap"><div class="pain-bar" style="height:'+h+'px;background:'+color+'"></div><div class="pain-bar-lbl">'+wk.label+'</div><div class="pain-bar-lbl">'+(wk.avg!==null?wk.avg:'—')+'</div></div>';
  }).join('');
}
function renderCriteria(){
  const el=document.getElementById('criteriaList');if(!el)return;
  const saved=loadCriteria();
  el.innerHTML=CRITERIA_F3.map((c,i)=>{
    const done=saved[i]||false;
    return '<div class="criteria-item"><div class="crit-chk'+(done?' done':'')+'" onclick="toggleCriteria('+i+')" data-i="'+i+'"></div><div class="crit-txt">'+c+'</div></div>';
  }).join('');
  const count=saved.filter(Boolean).length;
  const bar=document.getElementById('critBar');if(bar)bar.style.width=Math.round(count/CRITERIA_F3.length*100)+'%';
  const cnt=document.getElementById('critCount');if(cnt)cnt.textContent=count+' / '+CRITERIA_F3.length+' cumplidos';
}
function toggleCriteria(i){const c=loadCriteria();while(c.length<CRITERIA_F3.length)c.push(false);c[i]=!c[i];saveCriteria(c);renderCriteria();}

// ─── INFORME ───────────────────────────────────────────────────────
function generateReport(){
  const box=document.getElementById('reportBox');if(!box)return;
  const ent=loadEntries(),e=ent[todayKey()];
  if(!e){box.textContent='Guarda el registro del día primero.';return;}
  const dstr=TODAY.toLocaleDateString('es-ES',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  const slots=e.slots||{};
  const slotStr=s=>{const sl=slots[s];if(!sl||sl.pain<0)return'No registrado';return sl.pain+'/10'+(sl.irr&&sl.irr.some(x=>!x.includes('Sin'))?' — irr: '+sl.irr.filter(x=>!x.includes('Sin')).join(', '):'');};
  const r='INFORME DE SEGUIMIENTO DIARIO\nFecha: '+dstr+'\nDx: Discopatia L4-L5 y L5-S1 · Extrusion bilateral activa · Semana '+WEEK_NUM+'\n\nDOLOR\nMañana: '+slotStr('m')+'\nMediodia: '+slotStr('d')+'\nNoche: '+slotStr('n')+'\nUbicacion: '+((e.zones||[]).join(', ')||'No especificada')+'\nRigidez matutina: '+((e.stiff||[]).join(', ')||'—')+'\n\nACTIVIDAD\n'+((e.acts||[]).join(', ')||'—')+'\n\nOBSERVACIONES\n'+(e.note||'Sin observaciones.')+'\n\n---\nGenerado por Rehab Bor v11.';
  box.textContent=r;
}

// ─── SMART NOTE ────────────────────────────────────────────────────
function smartNote(ex){
  const key=typeof findExercise==='function'?findExercise(ex.n):null;
  const dbEx=key&&typeof EX_DB!=='undefined'?EX_DB[key]:null;
  const full=dbEx?.notas_columna||'';
  const stage=getExStage(ex.n);
  let summary='';
  if(full){
    const stagePattern=new RegExp(stage.replace('+','\\+')+'\\s*(?:\\([^)]*\\))?\\s*[:：]\\s*([^]+?)(?=\\s+(?:S1-2|S3-4|S5-6|S7\\+|F3)\\s*(?:\\(|[^\\w])|$)');
    const m=full.match(stagePattern);
    const raw=m?m[1].trim():full;
    summary=raw.length>120?raw.slice(0,117).replace(/[,;\s]+$/,'')+'…':raw.replace(/\.\s*$/,'');
  } else if(ex.note){summary=ex.note;}
  return full||summary?{stage,summary,full:full||summary}:null;
}

// ─── SESSION RENDER ────────────────────────────────────────────────
function renderDaySel(){
  const sel=document.getElementById('daySelector');if(!sel)return;sel.innerHTML='';
  const {suggestions}=getSuggestions();
  const suggMap={};suggestions.forEach(sg=>suggMap[sg.dateKey]=sg);
  getWeekDays().forEach(d=>{
    const dow=d.getDay(),dk=d.toISOString().split('T')[0];
    const entry=getPlanEntry(dk,dow);
    const isNeural=entry&&entry.mode==='neural';
    const isRest=!entry||entry.mode==='rest';
    const isHome=entry&&entry.mode==='home';
    const isA=dow===curDay;
    const hasSugg=!entry&&suggMap[dk];
    const s=entry&&entry.sessId!=null?getSessionById(entry.sessId):null;
    const shortTag=isRest?'Descanso':isNeural?'Neural':isHome?(s?s.name+' 🏠':DS[dow]):s?s.name:hasSugg?'+ Asignar':'Libre';
    const el=document.createElement('div');
    el.className='day-btn'+(isA?' active':'')+(isNeural?' neural':'')+(isRest?' rest-day':'');
    if(isA&&isNeural)el.classList.add('active','neural');
    if(isHome)el.style.cssText+='border-color:var(--teal)';
    if(hasSugg)el.style.cssText+='border-color:var(--amber)44;border-style:dashed';
    el.innerHTML='<span class="dn">'+DS[dow]+'</span><span class="dt" style="font-size:9px;max-width:54px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+shortTag+'</span>'
      +(isHome?'<span style="font-size:8px;color:var(--teal)">CASA</span>':'')
      +(hasSugg?'<span style="font-size:8px;color:var(--amber)">SUGERIDA</span>':'');
    el.onclick=()=>{curDay=dow;renderAll();};
    el.oncontextmenu=(e)=>{e.preventDefault();openPlanModal(dk,dow);};
    let lpt;el.addEventListener('touchstart',()=>{lpt=setTimeout(()=>openPlanModal(dk,dow),500)},{passive:true});
    el.addEventListener('touchend',()=>clearTimeout(lpt),{passive:true});
    sel.appendChild(el);
  });
  renderSuggBanner();
}
function renderSuggBanner(){
  const el=document.getElementById('suggBanner');if(!el)return;
  const {pending,suggestions}=getSuggestions();
  if(!suggestions.length||!pending.length){el.style.display='none';return;}
  el.style.display='block';
  const DS2=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  el.innerHTML='<div style="font-size:11px;font-weight:700;color:var(--amber);font-family:var(--mono);margin-bottom:6px">SESIONES PENDIENTES</div>'
    +suggestions.map(sg=>`<div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--b5)44">
      <span style="font-size:12px;color:var(--text2)">${DS2[sg.dow]} — <b style="color:var(--text)">${sg.sessName}</b></span>
      <div style="display:flex;gap:6px">
        <button onclick="applyPlan('${sg.dateKey}',${sg.sessId},'gym')" style="font-size:10px;padding:3px 8px;background:var(--dblue);border:1px solid var(--blue);color:var(--blue);border-radius:5px;cursor:pointer">GYM</button>
        ${sg.hasHome?`<button onclick="applyPlan('${sg.dateKey}',${sg.sessId},'home')" style="font-size:10px;padding:3px 8px;background:var(--lteal);border:1px solid var(--teal);color:var(--teal);border-radius:5px;cursor:pointer">CASA</button>`:''}
      </div>
    </div>`).join('');
}
function applyPlan(dateKey,sessId,mode){setPlanForDate(dateKey,sessId,mode);renderAll();}
function openPlanModal(dateKey,dow){
  const DS2=['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const modal=document.getElementById('planModal');if(!modal)return;
  document.getElementById('planModalTitle').textContent='Asignar — '+DS2[dow];
  const body=document.getElementById('planModalBody');
  const current=getPlanEntry(dateKey,dow);
  const rows=[
    {sessId:1,label:'Lunes — Cadena posterior + Core'},
    {sessId:2,label:'Martes — Tiro vertical + Glúteo'},
    {sessId:4,label:'Jueves — Pecho + Tiro horizontal'},
    {sessId:5,label:'Viernes — Pierna completa + Hombro'},
    {sessId:0,label:'Domingo — Recuperación activa (casa)'},
    {sessId:'neural',label:'Descanso neural'},
    {sessId:null,label:'Descanso completo'},
  ];
  body.innerHTML=rows.map(r=>{
    const isCur=current&&(current.sessId===r.sessId||(r.sessId===null&&current.mode==='rest')||(r.sessId==='neural'&&current.mode==='neural'));
    return `<div style="margin-bottom:6px">
      <div style="font-size:12px;font-weight:600;color:${isCur?'var(--blue)':'var(--text2)'};margin-bottom:4px">${r.label}${isCur?' ✓':''}</div>
      <div style="display:flex;gap:6px">
        ${r.sessId==='neural'
          ?`<button onclick="applyPlan('${dateKey}','neural','neural');closePlanModal()" style="flex:1;font-size:11px;padding:5px;background:var(--damber);border:1px solid var(--amber);color:var(--amber);border-radius:6px;cursor:pointer">NEURAL 🧘</button>`
          :r.sessId===null
          ?`<button onclick="applyPlan('${dateKey}',null,'rest');closePlanModal()" style="flex:1;font-size:11px;padding:5px;background:var(--bg3);border:1px solid var(--b6);color:var(--text2);border-radius:6px;cursor:pointer">DESCANSO 💤</button>`
          :`<button onclick="applyPlan('${dateKey}',${r.sessId},'gym');closePlanModal()" style="flex:1;font-size:11px;padding:5px;background:var(--dblue);border:1px solid var(--blue);color:var(--blue);border-radius:6px;cursor:pointer">GYM 🏋</button>`
          +((r.sessId===0||(SESSIONS[r.sessId]&&SESSIONS[r.sessId].homeLoc))
          ?`<button onclick="applyPlan('${dateKey}',${r.sessId},'home');closePlanModal()" style="flex:1;font-size:11px;padding:5px;background:var(--lteal);border:1px solid var(--teal);color:var(--teal);border-radius:6px;cursor:pointer">CASA 🏠</button>`
          :'')}
      </div>
    </div>`;
  }).join('');
  const resetBtn=document.createElement('div');
  resetBtn.style.cssText='margin-top:10px;padding-top:10px;border-top:1px solid var(--b5)';
  const btn=document.createElement('button');
  btn.style.cssText='width:100%;font-size:11px;padding:5px;background:var(--bg3);border:1px solid var(--b5);color:var(--text3);border-radius:6px;cursor:pointer';
  btn.textContent='↺ Restablecer por defecto';
  btn.dataset.dk=dateKey;
  btn.onclick=function(){resetPlanDay(this.dataset.dk);};
  resetBtn.appendChild(btn);
  body.appendChild(resetBtn);
  modal.style.display='flex';
}
function closePlanModal(){document.getElementById('planModal').style.display='none';}
function resetPlanDay(dateKey){const p=loadPlan();delete p[dateKey];savePlan(p);closePlanModal();renderAll();}

function renderHero(){
  const heroEl=document.getElementById('sessionHero');if(!heroEl)return;
  const s=getCurSession();const mode=getCurMode();
  if(!s){
    const dk=curDateKey(),dow=curDow();
    if(mode==='rest'){heroEl.innerHTML='<div class="neural-day"><div class="neural-icon">💤</div><div class="neural-title" style="color:var(--text2)">Descanso</div><div class="neural-desc">Día de recuperación asignado · Movilidad suave si apetece</div><button onclick="openPlanModal(\''+dk+'\','+dow+')" style="margin-top:10px;font-size:11px;padding:5px 14px;background:var(--bg3);border:1px solid var(--b6);color:var(--text2);border-radius:6px;cursor:pointer">✏️ Cambiar</button></div>';}
    else{heroEl.innerHTML='<div class="neural-day" style="background:var(--bg2);border-color:var(--b5)"><div class="neural-icon">📅</div><div class="neural-title" style="color:var(--text2)">Sin sesión asignada</div><button onclick="openPlanModal(\''+dk+'\','+dow+')" style="margin-top:10px;font-size:11px;padding:5px 14px;background:var(--dblue);border:1px solid var(--blue);color:var(--blue);border-radius:6px;cursor:pointer">+ Asignar sesión</button></div>';}
    return;
  }
  const c=DC[curDay]||DC[1];
  if(s.neural){heroEl.innerHTML='<div class="neural-day"><div class="neural-icon">N</div><div class="neural-title">Descanso neural — '+s.name+'</div><div class="neural-desc">Sin carga axial · Sin levantamientos · Sin impacto<br>Movilidad matutina + Iso lumbar + Descompresion restaurativa</div><button onclick="openPlanModal(\''+curDateKey()+'\','+curDow()+')" style="margin-top:10px;font-size:11px;padding:5px 14px;background:var(--bg3);border:1px solid var(--b6);color:var(--text2);border-radius:6px;cursor:pointer">✏️ Cambiar</button></div>';return;}
  const doneObj=loadDone(curDateKey());
  const all=s.blocks.reduce((a,b)=>a+b.exs.length,0);
  const dn=Object.values(doneObj).filter(Boolean).length;
  const pct=all>0?Math.round(dn/all*100):0;
  const modeBadge=mode==='home'?'<span style="font-size:10px;font-weight:700;background:var(--lteal);border:1px solid var(--teal);color:var(--teal);padding:2px 8px;border-radius:10px;margin-left:6px">🏠 CASA</span>':'<span style="font-size:10px;font-weight:700;background:var(--dblue);border:1px solid var(--blue);color:var(--blue);padding:2px 8px;border-radius:10px;margin-left:6px">🏋 GYM</span>';
  const infoRows=[];
  if(s.keyExs)infoRows.push({icon:'★',label:'Ejercicios clave',val:s.keyExs,col:'var(--blue)',bg:'var(--dblue)'});
  if(s.cardio)infoRows.push({icon:'♥',label:'Cardio',val:s.cardio,col:'var(--green)',bg:'var(--lgreen)'});
  if(s.pool)infoRows.push({icon:'~',label:'Piscina',val:s.pool,col:'var(--teal)',bg:'var(--lteal)'});
  const infoHtml=infoRows.length?'<div style="display:flex;flex-direction:column;gap:6px;margin:10px 0 8px">'
    +infoRows.map(r=>'<div style="display:flex;align-items:flex-start;gap:8px;background:'+r.bg+';border-radius:8px;padding:7px 10px">'
      +'<span style="font-size:12px;color:'+r.col+';flex-shrink:0;margin-top:1px;font-family:var(--mono)">'+r.icon+'</span>'
      +'<div style="min-width:0"><div style="font-size:9px;font-weight:700;color:'+r.col+';text-transform:uppercase;letter-spacing:0.08em;font-family:var(--mono);margin-bottom:2px">'+r.label+'</div>'
      +'<div style="font-size:12px;color:var(--text);line-height:1.4;word-break:break-word">'+r.val+'</div></div></div>').join('')
    +'</div>':'';
  heroEl.innerHTML='<div class="s-hero">'
    +'<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:6px">'
    +'<div><div class="s-ttl" style="color:'+c.h+'">'+s.name+' — '+s.tag+'</div>'+modeBadge+'</div>'
    +'<span style="font-size:14px;font-weight:700;color:'+c.h+'">'+pct+'%</span></div>'
    +'<div class="s-meta"><span class="chip-sm" style="background:'+c.l+';color:'+c.h+'">'+s.dur+'</span>'
    +'<span class="chip-sm" style="background:'+(mode==='home'?'var(--lteal)':''+c.l)+';color:'+(mode==='home'?'var(--teal)':''+c.h)+'">'+((mode==='home'&&s.homeLoc)?s.homeLoc:s.loc)+'</span>'
    +'<span class="chip-sm" style="background:'+c.l+';color:'+c.h+'">'+dn+'/'+all+'</span>'
    +'<span class="chip-sm" style="background:var(--bg3);border:1px solid var(--b6);color:var(--text2);cursor:pointer" onclick="openPlanModal(\''+curDateKey()+'\','+curDow()+')">✏️ Cambiar</span>'
    +'</div>'+infoHtml
    +'<div class="prog-wrap"><div class="prog-bar" style="width:'+pct+'%;background:'+c.h+'"></div></div>'
    +'<div class="prog-lbl">'+(pct===0?'Sin empezar':pct===100?'Sesion completada':dn+' / '+all+' completados')+'</div>'
    +'</div>';
}
function renderBlocks(){
  const con=document.getElementById('blocksContainer');if(!con)return;
  const s=getCurSession();if(!s){con.innerHTML='';return;}
  const mode=getCurMode();
  const isHome=mode==='home';
  const doneObj=loadDone(curDateKey());
  con.innerHTML='';
  s.blocks.forEach(blk=>{
    const bk=String(curDay)+'_'+blk.id;
    const isOpen=blk.id==='A'?(openBlks[bk]===true):openBlks[bk]!==false;
    const resolvedExs=blk.exs.map(ex=>{
      if(isHome&&ex.gym&&ex.homeAlt){
        return Object.assign({},ex.homeAlt,{_isHomeAlt:true,_origName:ex.n,wid:ex.homeAlt.wid||null,variant:ex.homeAlt.variant||ex.variant});
      }
      return ex;
    });
    const dn=resolvedExs.filter((_,i2)=>doneObj[bk+'_'+i2]).length;
    const isMob=blk.id==='A',isLH=blk.id==='LH',isPool=['F','G','H'].includes(blk.id);
    const badge=isMob?'<span class="mob-badge">DIARIO</span>':isLH?'<span class="mob-badge">LUMBAR</span>':isPool?'<span class="mob-badge" style="background:var(--lteal);color:var(--teal)">PISCINA</span>':'';
    const blkDiv=document.createElement('div');blkDiv.className='blk-sec';
    const hdr=document.createElement('div');hdr.className='blk-hdr';hdr.style.cssText='background:'+blk.color+'18;border-color:'+blk.color+'33';hdr.dataset.bk=bk;hdr.onclick=function(){toggleBlk(this.dataset.bk);};
    hdr.innerHTML='<div class="blk-letter" style="background:'+blk.color+'">'+blk.id+'</div>'
      +'<div><div class="blk-name" style="color:'+blk.color+'">'+blk.name+badge+'</div><div style="font-size:11px;color:'+blk.color+'88">'+blk.dur+' · '+dn+'/'+resolvedExs.length+'</div></div>'
      +'<div class="blk-chev '+(isOpen?'open':'')+'" style="color:'+blk.color+'">v</div>';
    const body=document.createElement('div');body.className='blk-body';body.id='bb_'+bk;if(!isOpen)body.style.display='none';
    resolvedExs.forEach((ex,i2)=>{
      const ek=bk+'_'+i2,isDone=!!doneObj[ek];
      const row=document.createElement('div');row.className='ex-row';
      if(ex._isHomeAlt)row.style.cssText='background:var(--lteal)18;border-left:2px solid var(--teal)44';
      const chk=document.createElement('div');chk.className='ex-chk'+(isDone?' done':'');chk.dataset.ek=ek;chk.onclick=function(){toggleEx(this.dataset.ek);};
      const info=document.createElement('div');info.className='ex-info';
      const top=document.createElement('div');top.className='ex-top';
      const nm=document.createElement('span');nm.className='ex-name'+(isDone?' done-txt':'');nm.textContent=ex.n;nm.dataset.ek=ek;nm.onclick=function(){toggleEx(this.dataset.ek);};
      const infoBtn=document.createElement('button');infoBtn.className='info-btn';infoBtn.textContent='i';infoBtn.dataset.nm=ex.n;infoBtn.onclick=function(e){e.stopPropagation();openEx(this.dataset.nm);};
      if(ex._isHomeAlt){const hp=document.createElement('span');hp.style.cssText='font-size:9px;font-weight:700;background:var(--lteal);border:1px solid var(--teal);color:var(--teal);padding:1px 5px;border-radius:4px;margin-right:4px;flex-shrink:0';hp.textContent='CASA';top.appendChild(hp);}
      top.appendChild(nm);top.appendChild(infoBtn);
      info.appendChild(top);
      const exStage=getExStage(ex.n);
      const stageVariant=ex.variant?getVariantForExercise(ex.n,ex.variant):null;
      const det=document.createElement('div');det.className='ex-det';det.textContent=ex.d;info.appendChild(det);
      if(ex.variant){
        const vwrap=document.createElement('div');vwrap.style.cssText='margin-top:4px';
        const stages=['S1-2','S3-4','S5-6','S7+','F3'];
        const stageColors={
          'S1-2':{bg:'#132A1E',border:'#3B9A6A',text:'#3B9A6A',dot:'#3B9A6A'},
          'S3-4':{bg:'#1E2A10',border:'#7A9A3B',text:'#7A9A3B',dot:'#7A9A3B'},
          'S5-6':{bg:'#2A2210',border:'#D4831A',text:'#D4831A',dot:'#D4831A'},
          'S7+': {bg:'#2A1A10',border:'#C96A30',text:'#C96A30',dot:'#C96A30'},
          'F3':  {bg:'#2A1010',border:'#C94040',text:'#C94040',dot:'#C94040'},
        };
        const vtag=document.createElement('div');
        vtag.style.cssText='display:inline-flex;align-items:center;gap:5px;cursor:pointer;user-select:none';
        const curCol=stageColors[exStage]||stageColors['S1-2'];
        const shortVariant=(stageVariant||'').slice(0,60)+((stageVariant||'').length>60?'…':'');
        vtag.innerHTML='<span style="font-size:10px;font-weight:700;font-family:var(--mono);padding:2px 8px;border-radius:5px;background:'+curCol.bg+';border:1px solid '+curCol.border+';color:'+curCol.text+'">'+exStage+'</span>'
          +'<span style="font-size:10px;color:var(--text3);font-family:var(--mono)">'+shortVariant+'</span>'
          +'<span style="font-size:9px;color:var(--text3)">▼</span>';
        const vpanel=document.createElement('div');
        vpanel.style.cssText='display:none;margin-top:6px;border-radius:8px;overflow:hidden;border:1px solid var(--b5)';
        stages.forEach(st=>{
          const parts=(ex.variant||'').split(' · ');
          const match=parts.find(p=>p.startsWith(st));
          if(!match)return;
          const text=match.slice(st.length).replace(/^[:\s·\-]+/,'');
          const col=stageColors[st];
          const isCur=st===exStage;
          const vrow=document.createElement('div');
          vrow.style.cssText='display:flex;align-items:flex-start;gap:8px;padding:7px 10px;background:'+(isCur?col.bg:'var(--bg3)')+';border-bottom:1px solid var(--b5)44;cursor:pointer';
          vrow.innerHTML='<span style="flex-shrink:0;width:7px;height:7px;border-radius:50%;background:'+col.dot+';margin-top:5px"></span>'
            +'<span style="flex-shrink:0;font-size:10px;font-weight:700;font-family:var(--mono);color:'+col.text+';min-width:32px">'+st+'</span>'
            +'<span style="font-size:12px;color:'+(isCur?'var(--text)':'var(--text2)')+';font-weight:'+(isCur?600:400)+';line-height:1.4">'+text+'</span>'
            +(isCur?'<span style="margin-left:auto;font-size:10px;color:'+col.text+'">✓</span>':'');
          vrow.dataset.st=st;vrow.dataset.exn=ex.n;
          vrow.onclick=function(e){
            e.stopPropagation();
            const st=this.dataset.st,exn=this.dataset.exn;
            const vs=loadVStages();if(!vs[exn])vs[exn]={};vs[exn][WEEK_NUM]=st;
            saveVStages(vs);renderAll();
          };
          vpanel.appendChild(vrow);
        });
        vtag.onclick=function(e){e.stopPropagation();const open=vpanel.style.display==='block';vpanel.style.display=open?'none':'block';vtag.querySelector('span:last-child').textContent=open?'▲':'▼';};
        vwrap.appendChild(vtag);vwrap.appendChild(vpanel);info.appendChild(vwrap);
      }
      if((ex.note||ex.wid)&&blk.id!=='G'){
        const sn=smartNote(ex);
        if(sn){
          const SCOL={'S1-2':'#3B9A6A','S3-4':'#7A9A3B','S5-6':'#D4831A','S7+':'#C96A30','F3':'#C94040'};
          const SBG={'S1-2':'#132A1E','S3-4':'#1E2A10','S5-6':'#2A2210','S7+':'#2A1A10','F3':'#2A1010'};
          const col=SCOL[sn.stage]||'var(--teal)';
          const bg=SBG[sn.stage]||'var(--lteal)';
          const snWrap=document.createElement('div');snWrap.className='sn-wrap';
          const snHdr=document.createElement('div');snHdr.className='sn-hdr';
          const snBody=document.createElement('div');snBody.className='sn-body';
          snHdr.innerHTML='<span class="sn-stage" style="background:'+bg+';border:1px solid '+col+'44;color:'+col+'">'+sn.stage+'</span>'
            +'<span class="sn-summary">'+sn.summary+'</span><span class="sn-chev">▼</span>';
          snBody.textContent=sn.full;
          snHdr.onclick=function(e){e.stopPropagation();const open=snBody.style.display==='block';snBody.style.display=open?'none':'block';snHdr.querySelector('.sn-chev').classList.toggle('open',!open);};
          snWrap.appendChild(snHdr);snWrap.appendChild(snBody);info.appendChild(snWrap);
        }
      }
      if(ex.wid){const wwDiv=document.createElement('div');wwDiv.innerHTML=(ex.wid==='ergometro'?buildErgLog():buildWW(ex.wid));if(wwDiv.firstChild)info.appendChild(wwDiv.firstChild);}
      row.appendChild(chk);row.appendChild(info);body.appendChild(row);
    });
    blkDiv.appendChild(hdr);blkDiv.appendChild(body);con.appendChild(blkDiv);
  });
}
function toggleBlk(k){openBlks[k]=openBlks[k]===false;const bb=document.getElementById('bb_'+k);const chev=bb.previousElementSibling.querySelector('.blk-chev');if(openBlks[k]){bb.style.display='none';chev.classList.remove('open');}else{bb.style.display='block';chev.classList.add('open');}renderHero();}
function toggleEx(k){const d=loadDone(curDateKey());d[k]=!d[k];saveDone(curDateKey(),d);renderAll();}

// ─── MOVILIDAD (pestaña nueva v11) ─────────────────────────────────
function mobCard(ex,color){
  return '<div class="card" style="margin-bottom:8px;border-left:3px solid '+color+'">'
    +'<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">'
    +'<div style="font-weight:600;font-size:14px;color:var(--text)">'+ex.n+'</div>'
    +'<button class="info-btn" onclick="openEx(\''+ex.n.replace(/'/g,"\\'")+'\')">i</button></div>'
    +'<div style="font-size:12px;color:var(--text2);font-family:var(--mono);margin-top:2px">'+ex.d+'</div>'
    +(ex.note?'<div style="font-size:12px;color:var(--text3);margin-top:4px;line-height:1.4">'+ex.note+'</div>':'')
    +(ex.variant?'<div style="font-size:11px;color:var(--text3);margin-top:6px;font-family:var(--mono);line-height:1.6">'+ex.variant.replace(/ · /g,'<br>')+'</div>':'')
    +'</div>';
}
function renderMob(){
  const render=(blk,elId)=>{const el=document.getElementById(elId);if(!el||!blk)return;el.innerHTML=blk.exs.map(ex=>mobCard(ex,blk.color)).join('');};
  render(typeof MOB_BLOCK_HIP!=='undefined'?MOB_BLOCK_HIP:null,'mobHipContainer');
  render(typeof MOB_BLOCK_MOVILIDAD_CADERA!=='undefined'?MOB_BLOCK_MOVILIDAD_CADERA:null,'mobCaderaContainer');
  render(typeof MOB_BLOCK_MOVILIDAD_ESPALDA!=='undefined'?MOB_BLOCK_MOVILIDAD_ESPALDA:null,'mobEspaldaContainer');
  render(typeof MOB_BLOCK_ESTABILIDAD_FOAM!=='undefined'?MOB_BLOCK_ESTABILIDAD_FOAM:null,'mobFoamContainer');
}

// ─── TIMER ─────────────────────────────────────────────────────────
let tSecs=60,tPreset=60,tRunning=false,tIv=null;
function openTimer(){document.getElementById('timerModal').style.display='flex';}
function closeTimer(){document.getElementById('timerModal').style.display='none';clearInterval(tIv);tRunning=false;}
function setTimer(s){tPreset=s;tSecs=s;clearInterval(tIv);tRunning=false;document.getElementById('tStartBtn').textContent='Iniciar';updT();}
function resetTimer(){clearInterval(tIv);tRunning=false;tSecs=tPreset;document.getElementById('tStartBtn').textContent='Iniciar';updT();}
function updT(){const m=Math.floor(tSecs/60),s=tSecs%60;const el=document.getElementById('tDisp');if(el)el.textContent=String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');}
function toggleTimer(){if(tRunning){clearInterval(tIv);tRunning=false;document.getElementById('tStartBtn').textContent='Continuar';}else{tRunning=true;document.getElementById('tStartBtn').textContent='Pausar';tIv=setInterval(()=>{if(tSecs>0){tSecs--;updT();}else{clearInterval(tIv);tRunning=false;document.getElementById('tStartBtn').textContent='Iniciar';if(navigator.vibrate)navigator.vibrate([200,100,200]);}},1000);}}

// ─── SYNC ──────────────────────────────────────────────────────────
function setSyncStatus(state,msg){const dot=document.getElementById('syncDot'),st=document.getElementById('syncStatus');if(!dot||!st)return;dot.className='sync-dot '+(state==='ok'?'ok':state==='err'?'err':state==='syncing'?'syncing':'');st.textContent=msg;}
function scheduleSync(){if(!getSheetsUrl())return;clearTimeout(syncTimeout);syncTimeout=setTimeout(()=>syncToSheets(),3000);}
async function syncToSheets(){const url=getSheetsUrl();if(!url)return;setSyncStatus('syncing','Sincronizando...');try{const payload={entries:loadEntries(),weights:loadWeights(),criteria:loadCriteria(),vStages:loadVStages(),week:WEEK_NUM,ts:new Date().toISOString()};const res=await fetch(url,{method:'POST',body:JSON.stringify(payload)});if(res.ok){setSyncStatus('ok','Sync OK — '+new Date().toLocaleTimeString('es-ES'));}else{setSyncStatus('err','Error HTTP '+res.status);}}catch(e){setSyncStatus('err','Sin conexion');}}
async function testSync(){const url=getSheetsUrl();if(!url){alert('Primero introduce la URL del Apps Script.');return;}await syncToSheets();}
// ─── PULL / RESTAURACION desde Google Sheets ───────────────────────
async function loadFromSheets(){
  const url=getSheetsUrl();if(!url)return null;
  const res=await fetch(url,{method:'GET'});
  if(!res.ok)throw new Error('HTTP '+res.status);
  const data=await res.json();
  if(!data||data.empty)return null;
  return data; // {entries,weights,criteria,vStages,week,ts}
}
function applyRemote_(data){
  if(!data)return false;
  if(data.entries)localStorage.setItem(SK_ENT,JSON.stringify(data.entries));
  if(data.weights)localStorage.setItem(SK_WTS,JSON.stringify(data.weights));
  if(data.criteria)localStorage.setItem(SK_CRIT,JSON.stringify(data.criteria));
  if(data.vStages)localStorage.setItem('rehab_vstg_v8',JSON.stringify(data.vStages));
  return true;
}
async function restoreFromSheets(){
  const url=getSheetsUrl();
  if(!url){alert('Primero introduce y guarda la URL del Apps Script en Ajustes.');return;}
  if(!confirm('Esto SOBRESCRIBIRA los datos locales con la copia de Google Sheets. ¿Continuar?'))return;
  setSyncStatus('syncing','Descargando...');
  try{
    const data=await loadFromSheets();
    if(!data){setSyncStatus('ok','La copia esta vacia');alert('No hay datos guardados en Google Sheets todavia. Haz primero una sincronizacion (Probar) para subir tus datos.');return;}
    applyRemote_(data);
    setSyncStatus('ok','Restaurado — '+new Date().toLocaleTimeString('es-ES'));
    renderAll();renderWtSummary();renderDash();
    alert('Datos restaurados desde Google Sheets correctamente.');
  }catch(e){setSyncStatus('err','Error al descargar');alert('Error al descargar de Sheets: '+e.message);}
}

// ─── SETTINGS ──────────────────────────────────────────────────────
function renderSettingsStatus(){
  const el=document.getElementById('appStatus');
  const wd=document.getElementById('weekDisplay');if(wd)wd.textContent=WEEK_NUM;
  const url=getSheetsUrl();
  if(el)el.textContent='Version: v11\nSemana: '+WEEK_NUM+'\nInicio F2: 21/03/2026\nSheets: '+(url?'Configurado':'No configurado')+'\nDias registrados: '+Object.keys(loadEntries()).length+'\nEjercicios con peso: '+WEIGHTED_EX.filter(e=>{const d=loadWeights()[e.id];return d&&d.w65>0}).length;
  const urlInput=document.getElementById('sheetsUrl');if(urlInput&&url&&!urlInput.value)urlInput.value=url;
}
function saveUrl(){const inp=document.getElementById('sheetsUrl');if(!inp)return;localStorage.setItem('sheets_url_v8',inp.value.trim());setSyncStatus(inp.value.trim()?'ok':'','URL guardada');}
function exportLocal(){const data={entries:loadEntries(),weights:loadWeights(),criteria:loadCriteria(),vStages:loadVStages(),week:WEEK_NUM,ts:new Date().toISOString()};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='rehab_bor_v11_'+todayKey()+'.json';a.click();}
function importLocal(){const f=document.getElementById('importFileInput');if(f)f.click();}
function handleImport(event){
  const file=event.target.files[0];if(!file)return;
  const r=new FileReader();
  r.onload=e=>{try{
    const d=JSON.parse(e.target.result);
    if(d.entries)localStorage.setItem(SK_ENT,JSON.stringify(d.entries));
    if(d.weights)localStorage.setItem(SK_WTS,JSON.stringify(d.weights));
    if(d.criteria)localStorage.setItem(SK_CRIT,JSON.stringify(d.criteria));
    if(d.vStages)localStorage.setItem('rehab_vstg_v8',JSON.stringify(d.vStages));
    renderAll();renderWtSummary();renderDash();alert('Datos importados correctamente.');
  }catch(err){alert('Error al importar: '+err.message);}};
  r.readAsText(file);
}
function confirmClearData(){if(confirm('Borrar TODOS los datos locales?')){[SK_ENT,SK_WTS,SK_CRIT].forEach(k=>localStorage.removeItem(k));getWeekDays().forEach(d=>localStorage.removeItem(SK_DONE(d.toISOString().split('T')[0])));renderAll();renderWtSummary();renderDash();alert('Datos borrados.');}}

// ─── TAB ───────────────────────────────────────────────────────────
function switchTab(t){
  const tabs=['today','tracker','weights','mob','dash','settings'];
  tabs.forEach(n=>{
    const cap=n.charAt(0).toUpperCase()+n.slice(1);
    const p=document.getElementById('panel'+cap);if(p)p.classList.toggle('active',t===n);
    const nb=document.getElementById('tab'+cap);if(nb)nb.classList.toggle('active',t===n);
  });
  if(t==='weights')renderWtSummary();
  if(t==='mob')renderMob();
  if(t==='dash')renderDash();
  if(t==='settings')renderSettingsStatus();
  if(t==='tracker'){renderWStrip();renderAllPainRows();renderMetrics();renderCriteria();}
}

// ─── PROGRESSION ───────────────────────────────────────────────────
function setProgStage(stage){PROG_STAGE=stage;localStorage.setItem('rehab_prog_stage_v8',stage);renderBlocks();}

// ─── RENDER ALL ────────────────────────────────────────────────────
function renderAll(){
  renderDaySel();renderHero();renderBlocks();renderWStrip();renderAllPainRows();renderMetrics();
  const b=document.getElementById('topWeekBadge');if(b)b.textContent='Sem '+WEEK_NUM;
}

// ─── MODAL EJERCICIO (ficha — 4 pestañas v11) ──────────────────────
function openEx(nm){
  const key=typeof findExercise==='function'?findExercise(nm):null;
  const ex=(key&&typeof EX_DB!=='undefined')?EX_DB[key]:null;
  const g=id=>document.getElementById(id);
  if(g('exModalTitle'))g('exModalTitle').textContent=ex?ex.nombre:nm;
  if(g('exCat'))g('exCat').textContent=ex?ex.categoria:'—';
  if(g('exDesc'))g('exDesc').textContent=ex?ex.descripcion:'Ficha detallada no disponible para este ejercicio.';
  if(g('exPos'))g('exPos').textContent=ex?(ex.posicion||'—'):'—';
  if(g('exCol'))g('exCol').textContent=ex?(ex.notas_columna||'—'):'—';
  if(g('exSteps'))g('exSteps').innerHTML=(ex&&ex.pasos)?ex.pasos.map(s=>'<li>'+s+'</li>').join(''):'<li>Sin pasos detallados.</li>';
  if(g('exErrors'))g('exErrors').innerHTML=(ex&&ex.errores)?ex.errores.map(e=>'<li>'+e+'</li>').join(''):'<li>—</li>';
  if(g('exVariantesList'))g('exVariantesList').innerHTML=buildVariantes(ex);
  switchExTab('info');
  if(g('exModal'))g('exModal').style.display='flex';
}
function buildVariantes(ex){
  if(!ex||!ex.variantes||!ex.variantes.length)return '<p class="ex-desc">Sin variantes registradas.</p>';
  const stages=['S1-2','S3-4','S5-6','S7+','F3'];
  const exStage=getExStage(ex.nombre||'');
  return ex.variantes.map(v=>{
    const ms=stages.find(s=>v.startsWith(s));
    const isA=ms&&ms===exStage;
    const badge=ms||'';
    const text=ms?v.slice(ms.length).replace(/^[:\s·\-]+/,''):v;
    return '<div class="ex-variant-item">'
      +(badge?'<span class="ex-variant-badge'+(isA?' current':'')+'">'+badge+'</span>':'')
      +'<span class="ex-variant-text'+(isA?' current':'')+'">'+text+'</span></div>';
  }).join('');
}
function switchExTab(tab){
  const map={info:'exTabInfo',pasos:'exTabPasos',errores:'exTabErrores',variantes:'exTabVariantes'};
  Object.entries(map).forEach(([t,id])=>{const el=document.getElementById(id);if(el)el.classList.toggle('active',t===tab);});
  const order=['info','pasos','errores','variantes'];
  document.querySelectorAll('#exModal .ex-modal-tab').forEach((b,i)=>b.classList.toggle('active',order[i]===tab));
}
function closeExModal(){const m=document.getElementById('exModal');if(m)m.style.display='none';}

// ═══════════════════════════════════════════════════════════════════
// ─── findExercise + EX_DB extendido (portado de rehab_v10) ─────────
// (se añade a continuación por el script de ensamblado)
// ═══════════════════════════════════════════════════════════════════

// Funcion auxiliar para buscar el ejercicio correcto
function findExercise(name) {
  const nm = name.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^a-z0-9 ]/g,'');
  
  const map = {
    'heel sit': 'heel-sit-ex', 'heel-sit': 'heel-sit-ex', 'heel sit ex': 'heel-sit-ex',
    'camel': 'camel', 'camel desde heel sit': 'camel',
    'outer hip': 'outer-hip', 'outer hip dropset': 'outer-hip',
    'pigeon strength': 'pigeon-strength',
    'inner hip': 'inner-hip', 'inner hip dropset': 'inner-hip',
    'seated gm': 'seated-gm', 'seated gm iso hold': 'seated-gm', 'bisagra sentado': 'seated-gm',
    'hip flexor': 'hip-flexor', 'hip flexor stretch': 'hip-flexor', 'psoas': 'hip-flexor',
    'hamstring squeeze': 'hamstring-squeeze', 'hamstring squeeze iso': 'hamstring-squeeze', 'iso hold cinta': 'iso-hold-cinta', 'iso hold cinta yoga': 'iso-hold-cinta', 'l-sit': 'l-sit', 'l sit': 'l-sit', 'l sit progresion': 'l-sit',
    'rodillas al pecho': 'rodillas-pecho', 'rodillas pecho': 'rodillas-pecho',
    'pies en silla': 'pies-silla', 'pies silla': 'pies-silla', 'pies en silla 90': 'pies-silla',
    'viparita': 'viparita', 'viparita karani': 'viparita', 'legs up': 'viparita', 'legs up wall': 'viparita', 'legs up the wall': 'viparita',
    'prono almohada': 'prono-almohada', 'prono con almohada': 'prono-almohada',
    'neural flossing': 'neural-flossing', 'flossing': 'neural-flossing', 'flossing nervio': 'neural-flossing',
    'respiracion': 'respiracion-diafragmatica', 'respiracion diafragmatica': 'respiracion-diafragmatica', 'respiracion diafragmatica profunda': 'respiracion-diafragmatica',
    'aqua jogging': 'aqua-jogging', 'aquajogging': 'aqua-jogging',
    'aquabike': 'aquabike', 'bici bajo el agua': 'aquabike', 'bici agua': 'aquabike',
    'aqua jumping': 'aqua-jumping', 'aquajumping': 'aqua-jumping', 'cama elastica': 'aqua-jumping',
    'rdl mancuernas': 'rdl-mancuernas', 'rdl mancuerna': 'rdl-mancuernas', 'rdl con mancuernas': 'rdl-mancuernas',
    'rdl barra': 'rdl-barra', 'rdl con barra': 'rdl-barra',
    'good morning': 'good-morning', 'good morning banda': 'good-morning', 'good morning con banda': 'good-morning',
    'hiperextension': 'hiperext', 'hiperextension banco': 'hiperext', 'hyperextension': 'hiperext',
    'elephant walk': 'elephant-walk', 'elephant': 'elephant-walk',
    'single leg hyper': 'single-leg-hyper', 'single leg reverse hyper': 'single-leg-hyper', 'reverse hyper': 'single-leg-hyper',
    'cable pull through': 'cable-pull-through', 'pull through': 'cable-pull-through', 'pull-through': 'cable-pull-through', 'pull through polea': 'cable-pull-through',
    'scapular pull': 'scapular-pull', 'dead hang escapular': 'scapular-pull', 'scapular pull barra': 'scapular-pull',
    'rotacion externa banda': 'ext-rotation-banda', 'external rotation': 'ext-rotation-banda', 'rotacion externa manguito': 'ext-rotation-banda',
    'rotacion interna banda': 'int-rotation-banda', 'internal rotation': 'int-rotation-banda', 'rotacion interna manguito': 'int-rotation-banda',
    'prone y': 'prone-y-banda', 'prone y banda': 'prone-y-banda', 'y banda': 'prone-y-banda', 'trapecio inferior banda': 'prone-y-banda',
    'jalon ancho': 'jalon-ancho', 'jalon agarre ancho': 'jalon-ancho', 'jalon al pecho': 'jalon-ancho', 'jalon pecho': 'jalon-ancho',
    'jalon neutro': 'jalon-neutro', 'jalon agarre neutro': 'jalon-neutro', 'jalon agarre estrecho': 'jalon-neutro',
    'pull over': 'pull-over', 'pullover': 'pull-over', 'pull over polea': 'pull-over',
    'press smith': 'press-smith', 'press maquina': 'press-smith',
    'face pull': 'face-pull', 'face pull polea': 'face-pull',
    'remo maquina': 'remo-maquina', 'remo sentado': 'remo-maquina', 'remo en maquina': 'remo-maquina',
    'remo mancuerna': 'remo-mancuerna', 'remo un brazo': 'remo-mancuerna', 'remo con mancuerna': 'remo-mancuerna',
    'remo polea': 'remo-polea-baja', 'remo polea baja': 'remo-polea-baja',
    'dead bug': 'dead-bug', 'deadbug': 'dead-bug', 'deadbug activacion': 'dead-bug',
    'bird dog': 'bird-dog', 'bird-dog': 'bird-dog',
    'plank anterior': 'plank-anterior', 'plank frontal': 'plank-anterior', 'plancha frontal': 'plank-anterior',
    'plank lateral': 'plank-lateral', 'plancha lateral': 'plank-lateral',
    'pallof press': 'pallof-press', 'pallof': 'pallof-press', 'pallof press con banda': 'pallof-press',
    'streamline': 'hollow-body', 'plancha flotante': 'hollow-body', 'hollow body hang': 'hollow-body',
    'suitcase': 'flexion-lateral-mancuerna', 'suitcase carry': 'flexion-lateral-mancuerna', 'suitcase hold': 'flexion-lateral-mancuerna',
    'hollow body': 'hollow-body', 'hollow': 'hollow-body', 'hollow body hold': 'hollow-body',
    'glute bridge bilateral': 'glute-bridge', 'puente gluteo bilateral': 'glute-bridge', 'puente gluteo dinamico': 'glute-bridge',
    'glute bridge unilateral': 'glute-bridge-uni', 'puente gluteo unilateral': 'glute-bridge-uni', 'glute bridge uni': 'glute-bridge-uni',
    'glute bridge': 'glute-bridge', 'puente gluteo': 'glute-bridge',
    'l sit': 'l-sit', 'l-sit': 'l-sit', 'l sit progresion': 'l-sit',
    'leg raise': 'leg-raise-polea', 'leg raise polea': 'leg-raise-polea',
    'hip thrust': 'hip-thrust', 'hip thrust banco': 'hip-thrust', 'hip-thrust': 'hip-thrust',
    'hip cars': 'hip-cars', 'cars': 'hip-cars', 'hip cars lentos': 'hip-cars',
    'clamshell': 'clamshell', 'clamshell banda': 'clamshell', 'clamshell dinamico': 'clamshell',
    'monster walk': 'monster-walk', 'monster walk lateral': 'monster-walk',
    'hiperextension unilateral': 'hiperext-uni', 'hiperextension unilateral banco': 'hiperext-uni', 'hiperext uni': 'hiperext-uni',
    'rdl unilateral banco': 'rdl-uni-banco', 'rdl unilateral': 'rdl-uni-banco', 'rdl uni banco': 'rdl-uni-banco',
    'bloque 1 espalda': 'aqua-jogging', 'bloque 2 crol': 'aqua-jogging', 'bloque 3 braza': 'aqua-jogging', 'bloque 1': 'aqua-jogging', 'bloque 2': 'aqua-jogging', 'bloque 3': 'aqua-jogging',
    '90 90 stretch activo': '90-90', '90 90 stretch': '90-90', 'stretch activo': '90-90',
    'aperturas cable': 'aperturas-cable', 'aperturas en polea cruzada': 'aperturas-cable', 'aperturas polea': 'aperturas-cable',
    'catcow': 'cat-cow', 'catcow toracico': 'cat-cow', 'cat cow toracico': 'cat-cow', 'cat-cow toracico': 'cat-cow',
    'lsit': 'l-sit', 'lsit progresion': 'l-sit', 'l sit progresion': 'l-sit', 'l-sit progresion': 'l-sit',
    'cable pancake en suelo': 'cable-pancake', 'cable pancake': 'cable-pancake', 'pancake': 'cable-pancake',
    'curl biceps barra': 'curl-barra', 'curl de biceps en barra': 'curl-barra', 'curl barra z': 'curl-barra',
    'curl martillo con mancuernas': 'curl-martillo', 'curl martillo': 'curl-martillo',
    'l sit progresion': 'l-sit', 'l-sit progresion': 'l-sit',
    'abduccion de cadera en maquina': 'abduccion-maq', 'abduccion cadera maquina': 'abduccion-maq', 'abduccion maquina': 'abduccion-maq',
    'extension de triceps en polea': 'triceps-polea', 'extension triceps polea': 'triceps-polea', 'triceps polea': 'triceps-polea',
    'press en maquina smith': 'press-smith', 'press smith 30': 'press-smith',
    'piriforme gluteo piscina': 'est-gluteo-agua', 'piriforme': 'est-gluteo-agua',
    'aquabike o marcha en cinta acuatica': 'aquabike', 'aquabike o marcha': 'aquabike', 'marcha acuatica': 'aquabike',
    'isometricos en barra traccion lumbar': 'traccion-barra-agua', 'isometricos en barra': 'traccion-barra-agua',
    'deep water running': 'aqua-jogging', 'deep water running cinturon': 'aqua-jogging', 'deep water running suave': 'aqua-jogging',
    'intervalos sprint agua profunda': 'aqua-jogging', 'intervalos sprint agua': 'aqua-jogging',
    'sombra acuatica': 'rotacion-agua', 'boxeo en agua': 'rotacion-agua', 'sombra acuatica combinaciones': 'rotacion-agua',
    'intervalos sombra acuatica': 'rotacion-agua',
    'largos de natacion': 'aqua-jogging', 'kick drill con tabla': 'aqua-jogging',
    'drills finales': 'aqua-jogging',
    '90 90': '90-90', 'stretch 90': '90-90', '90 90 stretch': '90-90',
    'pigeon': 'pigeon-pose', 'pigeon pose': 'pigeon-pose', 'pigeon banco': 'pigeon-pose', 'pigeon pose banco': 'pigeon-pose', 'pigeon pose escalerilla': 'est-gluteo-agua',
    'prensa': 'prensa', 'prensa inclinada': 'prensa',
    'bulgara': 'bulgara', 'sentadilla bulgara': 'bulgara', 'split squat': 'bulgara',
    'step up': 'step-up', 'step up banco': 'step-up',
    'wall sit': 'wall-sit', 'wall-sit': 'wall-sit',
    'reverse lunge': 'reverse-lunge', 'zancada atras': 'reverse-lunge', 'zancada hacia atras': 'reverse-lunge',
    'sumo banda': 'sumo-banda', 'sentadilla sumo': 'sumo-banda', 'sumo': 'sumo-banda', 'sentadilla sumo con banda': 'sumo-banda',
    'sentadilla bw': 'sentadilla-bw', 'sentadilla bodyweight': 'sentadilla-bw', 'squat bodyweight': 'sentadilla-bw',
    'elevaciones lat': 'elevaciones-lat', 'elevaciones laterales': 'elevaciones-lat',
    'pajaros': 'pajaros', 'rear delt': 'pajaros', 'pajaros banda': 'pajaros',
    'pike pushup': 'pike-pushup', 'pike push up': 'pike-pushup', 'pike push-up': 'pike-pushup',
    'fondos triceps': 'fondos-triceps', 'fondos de triceps': 'fondos-triceps', 'dips banco': 'fondos-triceps',
    'dislocaciones': 'dislocaciones', 'dislocaciones banda': 'dislocaciones',
    'retraccion escapular': 'retraccion-escapular', 'apertura de pecho': 'retraccion-escapular', 'retraccion': 'retraccion-escapular',
    'rotacion hombro': 'rot-hombro-banda', 'rotacion interna': 'rot-hombro-banda', 'rotacion externa': 'rot-hombro-banda', 'rotacion interna y externa': 'rot-hombro-banda',
    'cat cow': 'cat-cow', 'cat-cow': 'cat-cow', 'cat cow toracico': 'cat-cow',
    'rotacion toracica': 'rotacion-toracica', 'rotacion toracica suelo': 'rotacion-toracica', 'rotacion toracica agua': 'rotacion-agua',
    'foam roller': 'ext-toracica-foam', 'extension toracica': 'ext-toracica-foam', 'extension toracica foam': 'ext-toracica-foam',
    'child pose': 'child-pose', 'balasana': 'child-pose', 'child pose soporte': 'child-pose',
    'pelvic clock': 'pelvic-clock', 'reloj pelvico': 'pelvic-clock',
    'leg swing': 'leg-swing', 'leg swings': 'leg-swing', 'leg swing frontal': 'leg-swing', 'leg swing lateral': 'leg-swing',
    'couch stretch': 'couch-stretch',
    'superman': 'superman', 'superman hold': 'superman',
    'dead hang': 'dead-hang', 'hang': 'dead-hang',
    'slump test': 'slump-test',
    'goblet squat': 'goblet-squat', 'goblet': 'goblet-squat',
    'hack squat': 'hack-squat', 'hack': 'hack-squat',
    'hundred': 'hundred-modificado',
    'supine twist': 'supine-twist',
    'reclined butterfly': 'reclined-butterfly', 'butterfly': 'reclined-butterfly',
    'remo trx': 'remo-trx', 'remo anillas': 'remo-trx',
    'traccion barra agua': 'traccion-barra-agua', 'traccion lumbar': 'traccion-barra-agua', 'traccion barra': 'traccion-barra-agua',
    'psoas escalerilla': 'psoas-escalerilla', 'estiramiento psoas escalerilla': 'psoas-escalerilla',
    'hamstring barra agua': 'hamstring-barra-agua', 'hamstring stretch barra': 'hamstring-barra-agua', 'hamstring stretch': 'hamstring-barra-agua',
    'flotacion supino': 'flotacion-supino', 'flotacion': 'flotacion-supino',
    'sauna': 'sauna', 'bano caliente': 'sauna', 'sauna zona caliente': 'sauna',
    'ergometro': 'ergometro', 'ergometro de remo': 'ergometro', 'remo ergometro': 'ergometro',
    'eliptica': 'eliptica',
    'bici estatica': 'bici-estatica', 'spinning': 'bici-estatica', 'bicicleta estatica': 'bici-estatica',
    'est pectoral agua': 'est-pectoral-agua', 'estiramiento pectoral': 'est-pectoral-agua', 'pectoral esquina': 'est-pectoral-agua',
    'est dorsal agua': 'est-dorsal-agua', 'estiramiento dorsal': 'est-dorsal-agua', 'dorsal borde': 'est-dorsal-agua', 'stretch serrato': 'est-dorsal-agua',
    'est tfl agua': 'est-tfl-agua', 'tfl borde': 'est-tfl-agua', 'estiramiento tfl': 'est-tfl-agua',
    'est gluteo agua': 'est-gluteo-agua', 'gluteo stretch': 'est-gluteo-agua', 'pigeon escalerilla': 'est-gluteo-agua',
    'est abductor agua': 'est-abductor-agua', 'abductor stretch': 'est-abductor-agua',
    'est deltoides agua': 'est-deltoides-agua', 'deltoides posterior agua': 'est-deltoides-agua',
    'est cuadriceps agua': 'est-cuadriceps-agua', 'quadriceps stretch': 'est-cuadriceps-agua', 'cuadriceps borde': 'est-cuadriceps-agua',
    // Lotes de videos
    'side lying decomp': 'side-lying-decomp', 'side-lying decomp': 'side-lying-decomp', 'side lying decompression': 'side-lying-decomp', 'descompresion lateral': 'side-lying-decomp',
    'towel cobra': 'towel-cobra', 'cobra toalla': 'towel-cobra',
    'cat cow segmentado': 'cat-cow-segmentado', 'segmental cat cow': 'cat-cow-segmentado', 'cat cow segmental': 'cat-cow-segmentado',
    'cossack shifts': 'cossack-shifts', 'deep cossack': 'cossack-shifts', 'cossack profundo': 'cossack-shifts',
    'cossack standing': 'cossack-standing', 'cossack to standing': 'cossack-standing',
    'cossack rotations': 'cossack-rotations', 'cossack rotacion': 'cossack-rotations',
    'banded hip rotation': 'banded-hip-rotation', 'rotacion cadera banda': 'banded-hip-rotation',
    'prone hip rotation': 'prone-hip-rotation', 'rotacion cadera prono': 'prone-hip-rotation',
    'fire hydrant': 'fire-hydrant', 'hidrante': 'fire-hydrant',
    'wall squat overhead': 'wall-squat-overhead', 'overhead squat pared': 'wall-squat-overhead',
    'sissy reach': 'sissy-reach', 'sissy single leg': 'sissy-reach',
    'lumbar ext rotation': 'lumbar-ext-rotation', 'hiperextension rotacion': 'lumbar-ext-rotation', 'extensions with rotations': 'lumbar-ext-rotation',
    'aductores barra pie': 'aductores-barra-pie', 'estiramiento aductores barra': 'aductores-barra-pie',
    'copenhagen plank': 'copenhagen-plank', 'copenhagen': 'copenhagen-plank', 'plancha copenhagen': 'copenhagen-plank',
    'flexion lateral mancuerna': 'flexion-lateral-mancuerna', 'flexion lateral columna': 'flexion-lateral-mancuerna',
    'elevaciones pierna sentado': 'elevaciones-pierna-sentado', 'elevacion pierna sentado': 'elevaciones-pierna-sentado',
    'ext toracica pelota': 'ext-toracica-pelota', 'extension toracica pelota': 'ext-toracica-pelota', 'pelota medicinal toracica': 'ext-toracica-pelota',
    'dislocaciones prono': 'dislocaciones-prono', 'dislocaciones suelo': 'dislocaciones-prono',
    'equilibrio baston': 'equilibrio-giros-baston', 'equilibrio giros baston': 'equilibrio-giros-baston',
    'lunge movilidad taburete': 'lunge-movilidad-taburete', 'lunge movilidad': 'lunge-movilidad-taburete',
    'ext cadera prono basico': 'ext-cadera-prono-basico', 'extension cadera prono': 'ext-cadera-prono-basico',
    'giros torso rodillas': 'giros-torso-rodillas', 'giro torso rodilla': 'giros-torso-rodillas',
    'half kneeling open book': 'half-kneeling-open-book', 'open book banda': 'half-kneeling-open-book',
    'side lying pelvic': 'side-lying-pelvic', 'pelvic isolation': 'side-lying-pelvic', 'aislamiento pelvico': 'side-lying-pelvic',
    'prone serapes': 'prone-serapes', 'serapes prono': 'prone-serapes',
    'wall nordics': 'wall-nordics', 'nordicos pared': 'wall-nordics',
  };

  for (const [key, val] of Object.entries(map)) {
    if (nm.includes(key)) return val;
  }
  return null;
}

// ─── Fichas portadas desde rehab_v10 (no sobrescriben las de data.js) ───
const _PORT = {

  // ─── DESCOMPRESION ───────────────────────────────────────────
  "traccion-barra": {
    nombre: "Traccion en barra / maquina lumbar",
    categoria: "Descompresion",
    color: "#0F6E56",
    descripcion: "Suspension del peso corporal en una barra fija o maquina de traccion lumbar para crear espacio entre los discos vertebrales L4-S1 mediante separacion pasiva de las vertebras.",
    posicion: "De pie debajo de la barra, agarre prono (palmas hacia fuera) a anchura de hombros. Pies pueden quedar despegados del suelo o con contacto minimo.",
    pasos: [
      "Agarra la barra con ambas manos, anchura de hombros o ligeramente mas ancha.",
      "Deja que el peso corporal cargue completamente — no hagas fuerza hacia abajo.",
      "Activa los hombros ligeramente (escapulas hacia abajo, no encogidas) para proteger el manguito rotador.",
      "Relaja completamente la zona lumbar, las caderas y las piernas.",
      "Respira lento y profundo. Mantén 40-60 segundos.",
      "Para bajar: flexiona rodillas gradualmente hasta apoyar pies. No saltes."
    ],
    errores: [
      "Encoger los hombros hacia las orejas — activa el trapecio en lugar de descomprimir.",
      "Tensar la musculatura lumbar activamente — contraproducente, bloquea la separacion.",
      "Soltar de golpe al bajar — puede provocar microtraumatismo en el disco.",
      "Rotar la pelvis en el aire — mantén las caderas simétricas."
    ],
    variantes: [
      "F2 sem 4-5: Dead hang pasivo 30-40 seg x3.",
      "F2 sem 6-7: Dead hang 45-60 seg x4 con respiracion diafragmatica activa.",
      "F3: Agregar leve flexion de cadera (rodillas al pecho en suspension) para traccion activa L5-S1."
    ],
    notas_columna: "Con extrusion L4-L5 y L5-S1, la traccion pasiva crea espacio en el segmento afectado. La separacion vertebral reduce la presion del nucleo pulposo sobre la raiz S1 izquierda. Hacer siempre como primer ejercicio del dia, antes de cualquier carga axial. Si aparece irradiacion durante la suspension: bajar inmediatamente y registrar en tracker."
  },

  "rodillas-pecho": {
    nombre: "Rodillas al pecho bilateral",
    categoria: "Descompresion",
    color: "#0F6E56",
    descripcion: "Flexion pasiva de la columna lumbar en decubito supino para descomprimir los segmentos posteriores L4-S1 y elongar la musculatura paravertebral.",
    posicion: "Tumbado boca arriba sobre superficie firme (colchoneta o suelo). Piernas extendidas al inicio.",
    pasos: [
      "Desde posicion supina, lleva ambas rodillas hacia el pecho simultaneamente.",
      "Abraza las rodillas con ambos manos, una mano en cada rodilla o entrelazadas.",
      "Lleva las rodillas lo mas cerca del pecho posible SIN que el sacro se levante del suelo.",
      "Mantén la cabeza apoyada en el suelo — no levantes el cuello.",
      "Respira profundo: en la exhala, usa el peso de los brazos para acercar un poco mas las rodillas.",
      "Mantén 45 segundos. Suelta lentamente."
    ],
    errores: [
      "Levantar la cabeza y el cuello — genera tension cervical innecesaria.",
      "Hacer rebotes con las rodillas — es un estiramiento pasivo, no dinamico.",
      "Tirar de las espinillas (no de las rodillas) — puede estresar la rodilla.",
      "Mantener la respiracion — la exhalacion potencia la elongacion."
    ],
    variantes: [
      "F2: Bilateral 45 seg x3. Tambien: una rodilla cada vez (single knee to chest) si el bilateral produce irradiacion.",
      "F2 avanzada: Pequeños circulos con las rodillas para movilizacion segmentaria lumbar.",
      "Descanso neural: 3 minutos continuos como posicion de recuperacion."
    ],
    notas_columna: "Especialmente indicado para la extrusion L5-S1 izquierda: la flexion lumbar en descarga abre el espacio intervertebral posterior y reduce la presion sobre la raiz S1. Hacer cada manana antes de levantarse de la cama. Si el bilateral aumenta la irradiacion, pasar a unilateral con la pierna derecha primero."
  },

  "pies-silla": {
    nombre: "Pies en silla 90/90 (posicion de descarga)",
    categoria: "Descompresion",
    color: "#0F6E56",
    descripcion: "Posicion de reposo activo con caderas y rodillas en 90 grados de flexion, apoyando las piernas en una silla o sofa. Elimina la lordosis lumbar y reduce la presion discal a valores minimos.",
    posicion: "Tumbado boca arriba en el suelo. Silla o sofa frente a ti a la altura correcta para que caderas y rodillas queden a 90 grados.",
    pasos: [
      "Tumbate en el suelo y sube las piernas a la silla — pantorrillas apoyadas, rodillas a 90 grados.",
      "Comprueba que la zona lumbar esta completamente apoyada en el suelo — no debe haber espacio.",
      "Brazos a los lados o sobre el abdomen. Hombros relajados.",
      "Activa la respiracion diafragmatica: inhala 4 seg (el abdomen sube, no el pecho), exhala 6 seg.",
      "Mantén la posicion 10-20 minutos. Puedes leer, escuchar audio o simplemente descansar.",
      "Para levantarte: rueda hacia un lado, usa los brazos para incorporarte — nunca hagas un crunch."
    ],
    errores: [
      "Silla demasiado alta: la lordosis lumbar no se elimina completamente.",
      "Silla demasiado baja: tension en isquiotibiales que tira de la pelvis.",
      "Respiracion toracica (pecho sube): no activa el relajacion del diafragma.",
      "Levantarse con un crunch: carga discal alta en flexion."
    ],
    variantes: [
      "Version basica: cualquier superficie a la altura correcta.",
      "Version avanzada: anadir respiracion diafragmatica consciente 4-6-4.",
      "Descanso neural: hasta 20 minutos continuos como posicion principal del dia."
    ],
    notas_columna: "Esta es la posicion con menor presion intradiscal conocida (inferior incluso al decubito supino con piernas extendidas). Indicada especialmente para la reagudizacion activa S1 izquierda. La eliminacion de la lordosis lumbar reduce directamente la presion sobre el material extruido en L5-S1. Usar como posicion de lectura, trabajo remoto o descanso post-sesion."
  },

  "aqua-jogging": {
    nombre: "Aqua jogging con cinturon de flotacion",
    categoria: "Descompresion / Cardio",
    color: "#0F6E56",
    descripcion: "Carrera simulada en agua profunda con cinturon de flotacion. Permite el patron de marcha/carrera con descarga axial completa de la columna y las articulaciones de carga.",
    posicion: "En la parte profunda de la piscina con cinturon de flotacion ajustado a la cintura. Vertical, sin contacto con el suelo.",
    pasos: [
      "Ajusta el cinturon de flotacion firmemente a la cintura — debe mantenerte vertical sin esfuerzo.",
      "Posicion: tronco ligeramente inclinado hacia adelante (5-10 grados), core levemente activo.",
      "Mueve las piernas como si corrieras: flexion de rodilla 60-80 grados, extension de cadera completa.",
      "Los brazos se mueven en oposicion a las piernas, codos a 90 grados.",
      "La cabeza sale del agua — no bucees.",
      "Mantén un ritmo constante. En F2: ritmo de marcha rapida, no sprint.",
      "FC objetivo en F2: 105-120 bpm. Usa pulsometro o cuenta las pulsaciones."
    ],
    errores: [
      "Posicion sentada en el agua (pelvis caida): no activa los extensores de cadera.",
      "Zancada corta: reduce el beneficio cardiovascular y no trabaja la extension de cadera.",
      "Tension en hombros y cuello: mantén brazos relajados.",
      "Ritmo demasiado alto con irradiacion activa: reducir a marcha suave o suspender."
    ],
    variantes: [
      "F2 reagudizacion: solo flotacion estatica, sin movimiento de piernas.",
      "F2 estandar: aqua jogging 10-15 min FC <115.",
      "F2 avanzada: intervalos — 2 min ritmo moderado / 1 min suave x5.",
      "F3: aqua jogging sin cinturon (requiere flotacion activa del core)."
    ],
    notas_columna: "El aqua jogging es el unico cardio que combina patron de carrera con descarga axial del 90% del peso corporal. Para L4-S1 con extrusion activa es la alternativa ideal a la carrera terrestre. La extension de cadera en el agua activa el gluteo mayor sin compression discal — beneficio directo para la estabilizacion lumbopelvica. Con irradiacion S1 activa: reducir a flotacion pasiva unicamente."
  },

  // ─── AQUABIKE ────────────────────────────────────────────────
  "aquabike": {
    nombre: "Aquabike — bici bajo el agua",
    categoria: "Cardio articular",
    color: "#185FA5",
    descripcion: "Pedaleo en bicicleta estática sumergida en agua hasta la cintura o el pecho. La flotacion reduce la carga articular y la resistencia del agua aumenta el trabajo muscular sin impacto.",
    posicion: "Sentado en el sillin a la altura correcta: rodilla ligeramente flexionada en la extension maxima del pedal. Espalda erguida, manos en el manillar con codos relajados.",
    pasos: [
      "Ajusta el sillin: en la extension, la rodilla debe quedar ligeramente flexionada (5-10 grados), no bloqueada.",
      "Posicion de espalda: erguida, no inclinada hacia adelante. Core ligeramente activo.",
      "Manos en el manillar con contacto suave — NO apoyar el peso del tronco en los brazos.",
      "Inicia el pedaleo a cadencia libre, sin resistencia los primeros 3 minutos.",
      "Aumenta la resistencia progresivamente hasta alcanzar la FC objetivo.",
      "Mantén la cadencia uniforme. En F2: 70-85 rpm es lo ideal.",
      "Respira con ritmo: no contengas el aliento al aumentar la resistencia."
    ],
    errores: [
      "Standing (pedalear de pie): elimina el beneficio de la flotacion y genera carga axial — PROHIBIDO en F2.",
      "Apoyar el peso en el manillar con los brazos: provoca hiperlordosis lumbar.",
      "Sillin demasiado bajo: exceso de flexion de rodilla y tension en isquiotibiales.",
      "Resistencia alta desde el inicio: musculatura fria, riesgo de compensacion lumbar."
    ],
    variantes: [
      "F2 sem 4-5: 15 min, resistencia 1-3/10, FC 110-120. Sin standing.",
      "F2 sem 6-7: 20 min, resistencia 3-4/10, FC 120-130. Sin standing.",
      "F2 avanzada: intervalos 2 min moderado / 1 min suave x5.",
      "F3: 25-30 min. Standing breve (30 seg) si sin irradiacion. Resistencia 4-6/10."
    ],
    notas_columna: "La flotacion del agua elimina el 70-90% de la carga axial sobre L4-S1 durante el pedaleo. Esto permite trabajo cardiovascular de intensidad media sin compresion discal. La posicion sentada erguida en agua es significativamente menos compresiva que la bici estatica seca porque el agua soporta parte del peso del tronco. Usar siempre como bloque B (calentamiento) antes de los levantamientos, nunca despues."
  },

  // ─── AQUA JUMPING ────────────────────────────────────────────
  "aqua-jumping": {
    nombre: "Aqua jumping — cama elastica acuatica",
    categoria: "Cardio articular",
    color: "#0F6E56",
    descripcion: "Ejercicio cardiovascular en cama elastica sumergida en agua. El agua absorbe el impacto del rebote, permitiendo trabajo de cardio y coordinacion con minima carga articular.",
    posicion: "De pie sobre la cama elastica, agua al nivel del pecho o la cintura. Pies a anchura de caderas, rodillas ligeramente flexionadas.",
    pasos: [
      "Sube a la cama elastica con cuidado — es inestable en agua.",
      "Posicion de partida: pies separados anchura caderas, rodillas en semiflexion, tronco erguido.",
      "En F2: step alternado — levanta un pie cada vez, sin salto bilateral simultaneo.",
      "Coordina los brazos: movimiento de marcha (brazo contrario a la pierna que sube).",
      "Mantén el core activo para estabilizar la pelvis en cada step.",
      "Progresion dentro de la sesion: primero marcha, luego step mas alto, luego lateral.",
      "FC objetivo F2: 110-125 bpm. Para si supera 135 bpm."
    ],
    errores: [
      "Salto bilateral en F2: genera pico de impacto incluso en agua — PROHIBIDO hasta sem 7.",
      "Rodillas bloqueadas en el aterrizaje: toda la carga va al disco.",
      "Tronco inclinado hacia adelante excesivamente: carga en flexion lumbar.",
      "Ritmo demasiado rapido al inicio: musculatura lumbar no preparada."
    ],
    variantes: [
      "F2 sem 4-6: step alternado puro, 12-15 min FC <120.",
      "F2 sem 7-8: step alto + salto bajo (<10 cm) si sin irradiacion, 15-20 min.",
      "F2 variante: movimiento lateral (shuffle) en la cama — trabaja gluteo medio.",
      "F3: salto completo + coreografia. No antes de criterios F3 cumplidos."
    ],
    notas_columna: "El agua reduce el impacto del rebote aproximadamente un 80% respecto a la cama elastica seca. En F2, el step alternado (sin salto bilateral) elimina el pico de carga axial del aterrizaje. El movimiento de extension de cadera en cada step activa el gluteo mayor, que es el estabilizador primario de L5-S1. Especialmente util en martes y viernes como calentamiento pre-squat y pre-jalon."
  },

  // ─── HIP HINGE ───────────────────────────────────────────────
  "rdl-mancuernas": {
    nombre: "RDL — Romanian Deadlift con mancuernas",
    categoria: "Hip hinge",
    color: "#3C3489",
    descripcion: "Bisagra de cadera con carga excéntrica en los isquiotibiales y gluteo mayor. Es el patron fundamental de flexion de tronco segura con la columna en posicion neutra.",
    posicion: "De pie, pies a anchura de caderas, mancuernas a los lados del cuerpo, palmas hacia los muslos. Rodillas ligeramente flexionadas (10-15 grados, no bloqueadas).",
    pasos: [
      "Inspira y activa el core antes de iniciar el movimiento (maniobra de Valsalva suave).",
      "Empuja las caderas hacia ATRAS (no hacia abajo). Las mancuernas bajan pegadas a las piernas.",
      "Mantén la espalda completamente neutra: ni hiperlordosis ni cifosis. Cabeza en linea con la columna.",
      "Baja hasta sentir tension en isquiotibiales (para la mayoria: mancuernas a la altura de las rodillas o ligeramente por debajo).",
      "NO fuerces el rango — si se pierde la posicion neutra de la espalda, es el limite.",
      "Exhala y activa el gluteo para volver a la posicion inicial. El movimiento viene de las caderas, no de la espalda.",
      "Pausa 1 segundo arriba, repite."
    ],
    errores: [
      "Redondear la espalda lumbar: es el error mas peligroso con extrusion discal activa.",
      "Flexionar demasiado las rodillas (convertirlo en sentadilla): pierde el patron hinge.",
      "Dejar las mancuernas separadas del cuerpo: aumenta el momento de fuerza lumbar.",
      "Bajar hasta el suelo forzando el rango: el limite es la tension de isquiotibiales con espalda neutra.",
      "No activar el gluteo en la subida: la espalda se convierte en el motor primario."
    ],
    variantes: [
      "S1-2: 8-10 kg c/u — patron hinge y activacion glutea, 3x8 exc 3s.",
      "S3-4: 12-14 kg — rango parcial hasta rodillas, 3x8.",
      "S5-6: 16-18 kg — rango completo, 3x8 exc 3s.",
      "S7+: 20 kg+ tecnica impecable sin irradiacion — criterio F3.",
      "F3: Progresar a RDL con barra. Single-leg RDL peso corporal primero.",
      "En banco — mitad de rango: tumbado en decubito prono sobre un banco plano, torso en el banco y piernas colgando desde la cadera. Mancuernas en cada mano, brazos colgando. Realizar el patron de bisagra SOLO desde las caderas hasta la horizontal (mitad inferior del rango). Elimina completamente la carga axial sobre la columna. Util en dias de mayor sensibilidad lumbar o como introduccion al patron RDL. 3x10 exc 3 seg."
    ],
    notas_columna: "S1-2 (8-10 kg, activacion glutea): el objetivo no es la carga sino aprender el patron hinge — la columna neutra bajo cualquier carga en F2 es el criterio de exito. S3-4 (12-14 kg, rango parcial): el rango parcial hasta rodillas reduce el momento de flexion lumbar a la mitad — carga eficiente con riesgo minimo sobre L4-L5. S5-6 (16-18 kg, rango completo): el rango completo requiere que los isquiotibiales permitan la inclinacion sin que la lumbar se redondee — si se redondea, es S3-4 todavia. S7+ (20 kg+, criterio F3): el peso es secundario — el criterio es tecnica impecable sin irradiacion en ninguna repeticion del set. En banco-mitad de rango: elimina completamente la carga axial — util en dias de alta sensibilidad lumbar sin perder el estimulo de cadena posterior."
  },

  "rdl-barra": {
    nombre: "RDL — Romanian Deadlift con barra",
    categoria: "Hip hinge",
    color: "#3C3489",
    descripcion: "Version avanzada del RDL con barra olimpica. Permite mayor carga y mejor control de la posicion de la columna. Introducir en semana 6+ de F2.",
    posicion: "De pie detras de la barra (en soporte o cogida con agarre mixto o prono). Pies a anchura de caderas, barra pegada a las piernas, rodillas en semiflexion.",
    pasos: [
      "Agarra la barra con prono o agarre mixto, anchura de hombros.",
      "Activa el core con Valsalva suave. Escapulas juntas y hacia abajo.",
      "Empuja caderas hacia atras. La barra desciende pegada a las piernas (roza muslos y espinillas).",
      "Espalda neutra en todo momento — el cinturon lumbar puede usarse si superas el 60% 1RM.",
      "Para en el punto donde sientes tension de isquiotibiales con espalda neutra.",
      "Activa gluteo y empuja caderas hacia adelante para subir. La barra sube por la misma trayectoria.",
      "Bloquea arriba sin hiperlordosis — pelvis en posicion neutra."
    ],
    errores: [
      "Separar la barra del cuerpo: aumenta dramaticamente el momento de flexion lumbar.",
      "Relajar el core en la parte baja: el disco queda sin proteccion con la carga.",
      "Usar las lumbares para subir (extensores lumbares como motor): gluteo primero.",
      "Demasiado peso precozmente: en F2 maximo 50% 1RM hasta criterios F3."
    ],
    variantes: [
      "F2 sem 6: 40% 1RM, 3x8, excentrico 3 seg.",
      "F2 sem 7-8: 45-50% 1RM, 4x8.",
      "F3: Progresion normal. Introducir sumo deadlift si el convencional genera tension S1."
    ],
    notas_columna: "Solo introducir cuando: RDL con mancuernas es tecnicamente impecable, dolor en reposo <3/10, y sin irradiacion activa en la semana previa. La barra permite mejor retroalimentacion propioceptiva de la posicion de la columna que las mancuernas. Si aparece irradiacion durante el movimiento: parar el set, registrar en tracker y volver a mancuernas la semana siguiente."
  },

  "good-morning": {
    nombre: "Good morning con banda elastica",
    categoria: "Hip hinge",
    color: "#3C3489",
    descripcion: "Patron de bisagra de cadera con resistencia minima de banda elastica. Activa los extensores de cadera y la cadena posterior sin carga axial significativa.",
    posicion: "De pie, banda elastica enganchada detras del cuello o en los hombros (como una barra), pies a anchura de caderas.",
    pasos: [
      "Coloca la banda en los hombros o detras del cuello. La tension debe ser ligera.",
      "Rodillas en semiflexion (15 grados), core activo.",
      "Inclina el tronco hacia adelante empujando las caderas hacia atras — identico al RDL.",
      "Para cuando el tronco quede paralelo al suelo o antes si se pierde la posicion neutra.",
      "Activa gluteo y vuelve a la posicion erguida.",
      "El movimiento es lento y controlado — no es un swing."
    ],
    errores: [
      "Redondear la espalda lumbar: aunque la carga sea minima, el patron incorrecto refuerza el mal habito.",
      "Tension demasiado alta en la banda: convierte el ejercicio en carga pesada.",
      "Velocidad excesiva: pierde el beneficio propioceptivo del patron hinge."
    ],
    variantes: [
      "F2: banda ligera, 3x12, enfocado en patron y activacion glutea.",
      "F3: barra vacia (20 kg), progresando a barra cargada."
    ],
    notas_columna: "Ejercicio de enseñanza del patron hinge para programar el movimiento correcto antes de la carga pesada. Especialmente util como tercer ejercicio del bloque C (despues de RDL con peso) para reforzar el patron con fatiga parcial. La activacion del gluteo en este ejercicio es directamente transferible a la estabilizacion de L5-S1 en movimientos de la vida diaria."
  },

  // ─── TIRO VERTICAL ───────────────────────────────────────────
  "jalon-amplio": {
    nombre: "Jalon al pecho agarre ancho",
    categoria: "Tiro vertical",
    color: "#3C3489",
    descripcion: "Ejercicio de tiro vertical que trabaja el dorsal ancho, redondo mayor y biceps. Patron fundamental de la fuerza de tiro vertical con la columna descargada.",
    posicion: "Sentado en la maquina de jalon, rodillas bajo el apoyo. Agarre prono a una anchura mayor que los hombros (1.5x anchura de hombros aproximadamente).",
    pasos: [
      "Agarra la barra ampliamente, palmas hacia adelante.",
      "Inclinate ligeramente hacia atras (10-15 grados) — NO te tumbes hacia atras.",
      "Activa las escapulas ANTES de doblar los codos: imagina que intentas meter las escapulas en los bolsillos traseros.",
      "Tira la barra hacia el pecho superior (claviculas), no hacia la cara.",
      "Los codos se mueven hacia abajo y ligeramente hacia atras.",
      "Excentrico lento — 3 segundos de vuelta a la posicion inicial.",
      "Extiende completamente los brazos arriba (estiramiento de dorsal) antes de la siguiente rep."
    ],
    errores: [
      "Tirar hacia detras del cuello: carga cervical y riesgo de lesion de hombro.",
      "Usar el momentum (balanceo del tronco): la espalda hace el trabajo, no el impulso.",
      "No activar las escapulas primero: el biceps se convierte en motor principal.",
      "Hiperlordosis lumbar durante el movimiento: el respaldo debe eliminar la tentacion de arquear."
    ],
    variantes: [
      "F2: carga moderada, excentrico 3 seg, escapulas activas.",
      "F2 avanzada: supinacion del agarre en la parte baja del movimiento.",
      "F3: weighted pull-up si se controla el peso corporal."
    ],
    notas_columna: "El jalon es uno de los ejercicios mas seguros para la columna lumbar porque toda la carga es axial NEGATIVA (traccion, no compresion). La activacion del dorsal ancho es directamente beneficiosa para la estabilizacion lumbar (el dorsal tiene inserciones en la fascia toracolumbar que conecta con L4-L5). Mantén siempre el respaldo ligeramente inclinado y el apoyo de rodillas firme para evitar movimiento lumbar durante el ejercicio."
  },

  "jalon-neutro": {
    nombre: "Jalon neutro agarre estrecho",
    categoria: "Tiro vertical",
    color: "#3C3489",
    descripcion: "Variante del jalon con agarre neutro (palmas enfrentadas) y agarre estrecho. Enfatiza el dorsal ancho en su parte interna y el redondo mayor, con menor tension en el manguito rotador.",
    posicion: "Igual que el jalon amplio pero con el accesorio de agarre neutro (triangulo o barra paralela estrecha).",
    pasos: [
      "Agarra el triangulo o barra paralela con palmas enfrentadas.",
      "Misma posicion de tronco: ligeramente inclinado atras, core activo.",
      "Activa escapulas primero (retraccion escapular). Luego dobla codos.",
      "Tira hacia el pecho/esternon (mas bajo que en el agarre ancho).",
      "Al final del movimiento: pausa 1 segundo con el pecho tocando o casi tocando el accesorio.",
      "Sube lentamente, controlando el excentrico."
    ],
    errores: [
      "Dejar que los codos suban por encima de los hombros en la bajada: pierde la activacion del dorsal.",
      "No llegar al rango completo: la contraccion maxima del dorsal ocurre cuando el codo esta por debajo del nivel del hombro."
    ],
    variantes: [
      "F2: 3x10, contraccion 1 seg en el punto bajo.",
      "F3: lastrado con chaleco o aumentar carga progresivamente."
    ],
    notas_columna: "El agarre neutro reduce la tension en el manguito rotador respecto al agarre prono, siendo preferible si hay alguna molestia de hombro. El patron de retraccion escapular que entrena este ejercicio es directamente transferible a la correccion postural (hipercifosis toracica que frecuentemente acompaña al dolor lumbar cronico)."
  },

  "pull-over": {
    nombre: "Pull-over en polea alta",
    categoria: "Tiro vertical",
    color: "#3C3489",
    descripcion: "Ejercicio de extension de hombro con la polea alta. Trabaja el dorsal ancho, el serrato anterior y el pectoral mayor en un arco de movimiento que no carga la columna lumbar.",
    posicion: "De pie frente a la polea alta, agarre recto o con cuerda. Inclinacion hacia adelante de 45 grados aproximadamente, brazos extendidos hacia arriba.",
    pasos: [
      "Posicion: a un paso de la maquina, inclinado 45 grados, brazos extendidos hacia la polea.",
      "Mantén los codos ligeramente flexionados (5-10 grados) — no los bloquees.",
      "Tira hacia abajo describiendo un arco, llevando las manos hacia los muslos.",
      "El movimiento es de hombros (extension), no de codos.",
      "En el punto bajo: siente la contraccion del dorsal. Pausa 1 seg.",
      "Sube lentamente controlando el excentrico — los brazos vuelven al punto de partida."
    ],
    errores: [
      "Flexionar excesivamente los codos: convierte el ejercicio en un press descendente.",
      "Rotar la columna lumbar durante el movimiento: mantén el tronco estatico.",
      "Usar demasiado peso: la forma se rompe y la columna compensa."
    ],
    variantes: [
      "F2: cuerda o barra recta, 3x12, peso moderado.",
      "F3: aumentar el arco de movimiento y la carga progresivamente."
    ],
    notas_columna: "El pull-over activa el serrato anterior, que estabiliza la escapula y mejora la mecanica del hombro. Una escapula bien estabilizada reduce la tendencia a la hipercifosis toracica, que a su vez reduce la compensacion lumbar. Ejercicio util para complementar el patron de empuje y mejorar la postura global."
  },

  // ─── EMPUJE ──────────────────────────────────────────────────
  "press-smith": {
    nombre: "Press en maquina Smith 30 grados",
    categoria: "Empuje",
    color: "#3C3489",
    descripcion: "Press de pecho inclinado en maquina Smith. La guia de la maquina elimina la necesidad de estabilizacion lateral, permitiendo cargar el patron de empuje sin riesgo de caida y con minima tension lumbar.",
    posicion: "Banco inclinado a 30 grados dentro de la maquina Smith. Espalda COMPLETAMENTE apoyada en el banco — no despegues la zona lumbar. Barra a nivel del pecho superior.",
    pasos: [
      "Ajusta el banco a 30 grados y posicionalo correctamente bajo la barra.",
      "Siéntate y apoya toda la espalda: gluteos, zona lumbar, zona toracica, y cabeza en el banco.",
      "Agarra la barra ligeramente mas ancha que los hombros.",
      "Desbloquea la barra. Inspira y activa el core.",
      "Baja la barra lentamente hacia el pecho superior (claviculas). Los codos bajan a 45 grados del tronco.",
      "Empuja hacia arriba y ligeramente hacia atras (siguiendo la guia). Exhala al empujar.",
      "No bloquees los codos en la extension — mantén tension continua."
    ],
    errores: [
      "Despegar la zona lumbar del banco para aumentar el arco: carga lumbar en extension. PROHIBIDO.",
      "Codos a 90 grados del tronco (en T): aumenta la tension en el manguito rotador.",
      "Botar la barra en el pecho: riesgo de lesion y perdida del control excentrico.",
      "Peso excesivo que obliga a compensar con la columna."
    ],
    variantes: [
      "F2: 4x10, carga moderada (60-70% 1RM), excentrico 2 seg.",
      "F3: aumentar angulo, progresar a press libre con barra si espalda neutra es consistente."
    ],
    notas_columna: "La maquina Smith es preferible al press libre en F2 porque elimina el componente de estabilizacion lateral que puede provocar compensaciones lumbares. El angulo de 30 grados es el punto optimo entre activacion del pectoral superior y minima carga en el manguito rotador. Asegurarse SIEMPRE de que la zona lumbar esta en contacto con el banco — si se despega, reducir el peso."
  },

  "face-pull": {
    nombre: "Face pull en polea",
    categoria: "Empuje / Postura",
    color: "#3C3489",
    descripcion: "Ejercicio de rotacion externa de hombro con la polea alta. Trabaja los rotadores externos del hombro, el manguito rotador y los retractores escapulares. Fundamental para la salud postural.",
    posicion: "De pie frente a la polea alta con la cuerda. La polea debe estar a la altura de la cara o ligeramente por encima. Agarra la cuerda con ambas manos.",
    pasos: [
      "Posicion: un paso atras de la maquina, agarre con los pulgares hacia ti.",
      "Activa el core para evitar extension lumbar durante el movimiento.",
      "Tira la cuerda hacia la cara, separando las dos puntas hacia los lados de la cabeza.",
      "Al final del movimiento: codos al nivel de los hombros o ligeramente por encima, manos al lado de las orejas.",
      "La clave es la ROTACION EXTERNA del hombro en el punto final — siente como las escapulas se juntan.",
      "Excentrico controlado de vuelta a la posicion inicial.",
      "No uses momentum — es un ejercicio de control motor, no de fuerza."
    ],
    errores: [
      "Extension lumbar al tirar: el core debe ser el ancla. Si se arquea la espalda, reducir peso.",
      "Codos por debajo de los hombros: pierde la activacion de los rotadores externos.",
      "Peso demasiado alto: convierte el ejercicio en un remo y pierde el patron de rotacion."
    ],
    variantes: [
      "F2: 4x15, peso ligero, enfocado en rotacion externa maxima.",
      "F3: aumentar peso progresivamente manteniendo la mecanica."
    ],
    notas_columna: "El face pull es probablemente el ejercicio mas infravalorado para el dolor lumbar cronico. La debilidad de los rotadores externos del hombro contribuye a la hipercifosis toracica, que aumenta la carga compensatoria en la columna lumbar. Hacer 4 series de face pull por cada 3 series de press es la proporcion recomendada para mantener el equilibrio muscular del hombro."
  },

  // ─── TIRO HORIZONTAL ─────────────────────────────────────────
  "remo-maquina": {
    nombre: "Remo en maquina sentado",
    categoria: "Tiro horizontal",
    color: "#3C3489",
    descripcion: "Ejercicio de tiro horizontal bilateral con la columna soportada por el pecho de la maquina. Trabaja romboides, trapecio medio, dorsal ancho y biceps.",
    posicion: "Sentado en la maquina de remo, pecho apoyado en el soporte. Pies en las plataformas, rodillas ligeramente flexionadas. Brazos extendidos hacia adelante.",
    pasos: [
      "Ajusta el asiento para que los brazos queden extendidos horizontalmente al coger los mangos.",
      "El pecho debe estar en contacto con el soporte durante todo el movimiento.",
      "Activa las escapulas ANTES de doblar los codos (retraccion escapular primero).",
      "Tira los mangos hacia la cintura, codos pegados al cuerpo.",
      "En el punto final: escapulas completamente retraidas, codos detras del plano del cuerpo.",
      "Mantén 1 segundo. Suelta lentamente controlando el excentrico.",
      "NO te inclines hacia adelante para ayudarte — el pecho contra el soporte previene esto."
    ],
    errores: [
      "Flexionar la columna lumbar para alcanzar los mangos en la extension: la columna debe ser estatica.",
      "Usar momentum del tronco para iniciar el movimiento.",
      "No llegar a la retraccion escapular completa: el trapecio medio no se activa.",
      "Codos muy separados del cuerpo (en T): sobrecarga el manguito rotador."
    ],
    variantes: [
      "F2: 4x10, carga moderada, codos pegados.",
      "F2 variante: agarre neutro (palmas enfrentadas) para menor tension en manguito.",
      "F3: remo con barra si la tecnica es solida."
    ],
    notas_columna: "La maquina de remo con soporte de pecho es ideal en F2 porque fija completamente la columna durante el movimiento, eliminando cualquier carga de extension o flexion lumbar. El fortalecimiento de romboides y trapecio medio mejora la postura toracica, reduciendo indirectamente la carga compensatoria en L4-L5."
  },

  "pec-deck": {
    nombre: "Aperturas en maquina pec deck",
    categoria: "Empuje horizontal",
    color: "#3C3489",
    descripcion: "Aduccion horizontal de hombro en maquina con respaldo fijo. Aislamiento del pectoral mayor sin carga axial ni demanda estabilizadora de columna. Ideal en F2 por el soporte completo de la espalda.",
    posicion: "Sentado en la maquina, espalda completamente apoyada en el respaldo durante todo el movimiento. Pies en el suelo. Antebrazos en los acolchados, codos a altura de hombros.",
    pasos: [
      "Ajusta el asiento para que los codos queden a la altura de los hombros.",
      "Espalda pegada al respaldo — no despegar en ningun momento.",
      "Cierra los brazos hacia el centro del cuerpo en aduccion horizontal.",
      "En el punto de cierre: pausa 1 segundo contrayendo el pectoral.",
      "Abre lentamente controlando el excentrico — no dejar caer.",
      "No llevar los codos mas atras del plano del cuerpo en la apertura maxima."
    ],
    errores: [
      "Despegar la espalda del respaldo para ganar rango — carga la columna.",
      "Codos por encima de los hombros — sobrecarga el manguito rotador.",
      "Apertura excesiva mas alla del plano del cuerpo — tension excesiva en capsula anterior del hombro.",
      "Sin pausa en contraccion — pierde el estimulo de tension maxima del pectoral."
    ],
    variantes: [
      "S1-2: carga ligera rango parcial.",
      "S3-4: carga media rango completo.",
      "S5-6: carga alta excentrico 3s.",
      "S7+: carga alta pausa 1s en contraccion maxima.",
      "F3: combinar con aperturas cable para variacion de angulo."
    ],
    notas_columna: "La pec deck es el ejercicio de pecho mas seguro en F2 con extrusion lumbar activa. El respaldo fijo elimina completamente cualquier necesidad de estabilizacion lumbar, a diferencia del press o las aperturas con mancuernas. No genera carga axial. Priorizar sobre mancuernas hasta alcanzar F3."
  },

  "press-smith-plano": {
    nombre: "Press plano en Smith",
    categoria: "Empuje horizontal",
    color: "#3C3489",
    descripcion: "Press de pecho horizontal en barra guiada Smith. La trayectoria fija elimina la demanda estabilizadora del press libre, permitiendo trabajar el patron de empuje horizontal con mayor seguridad en F2.",
    posicion: "Tumbado en banco plano bajo la barra Smith. Pies apoyados en el suelo. Lumbar pegada al banco — activar abdomen antes de cada serie para mantener pelvis neutra.",
    pasos: [
      "Activar abdomen antes de coger la barra — lumbar contra el banco.",
      "Agarre ligeramente mas estrecho que el convencional — reduce tension en hombro.",
      "Escapulas retraidas y deprimidas — fijas en el banco durante todo el movimiento.",
      "Bajar la barra con excentrico controlado 3-4 seg hasta rozar el pecho.",
      "Empujar sin bloquear codos arriba completamente — mantener tension continua.",
      "NO arquear la lumbar para ganar rango — si aparece arco, reducir peso."
    ],
    errores: [
      "Anteversion pelvica durante el movimiento — lumbar debe estar pegada al banco.",
      "Arco lumbar excesivo para aumentar el rango — contraindicado con extrusion activa.",
      "Bajar la barra de golpe sin control excentrico.",
      "Agarre demasiado ancho — sobrecarga el hombro anterior.",
      "Bloquear codos arriba — pierde tension y carga el codo."
    ],
    variantes: [
      "S1-2: carga ligera foco en lumbar neutra excentrico 3s.",
      "S3-4: carga media excentrico 3s.",
      "S5-6: carga alta excentrico 3s pausa 1s abajo.",
      "S7+: carga alta excentrico 4s.",
      "F3: progresar a press libre con barra."
    ],
    notas_columna: "El Smith guia la trayectoria eliminando la demanda estabilizadora del press libre. En F2, esto es clave porque evita las compensaciones lumbares involuntarias que aparecen cuando la barra libre requiere control en los tres planos. La pelvis neutra activa es obligatoria — cualquier anteversion durante el movimiento transfiere carga directamente a L4-S1. Señal de parada inmediata: cualquier irradiacion durante o tras la serie."
  },

  "crunches-fitball": {
    nombre: "Crunches en fitball",
    categoria: "Core — flexion",
    color: "#993C1D",
    descripcion: "Flexion de tronco sobre fitball. La curvatura de la fitball permite un rango de movimiento controlado sin forzar la flexion lumbar completa. Progresion desde crunch recto hasta rotacion codo-rodilla.",
    posicion: "Sentado sobre la fitball, deslizarse hasta que la zona lumbar quede apoyada en la curva superior. Pies bien apoyados en el suelo separados a anchura de cadera. Manos en las sienes o cruzadas en el pecho.",
    pasos: [
      "Posicion inicial: lumbar apoyada en la fitball, no mas abajo del neutro.",
      "Activar el abdomen antes de iniciar la flexion.",
      "Flexionar el tronco hacia arriba — NO superar el punto donde la lumbar se despega de la fitball.",
      "En el punto alto: pausa 1 segundo contrayendo el abdomen.",
      "Bajar controlado hasta neutro — no ir mas alla en extension."
    ],
    errores: [
      "Bajar mas alla del neutro — extiende la lumbar sobre la fitball cargando los discos.",
      "Tirar del cuello con las manos — la cabeza va relajada.",
      "Rotacion brusca o con momentum — el movimiento debe ser lento y controlado.",
      "Pies sin apoyo firme — inestabilidad que puede generar compensacion lumbar."
    ],
    variantes: [
      "S1-2: crunch recto sin rotacion ROM minimo cabeza relajada.",
      "S3-4: crunch recto ROM medio pausa 1s arriba.",
      "S5-6: inicio rotacion suave codo hacia rodilla opuesta — derecho primero.",
      "S7+: codo-rodilla rango completo controlado alternando lados.",
      "F3: con peso en pecho para aumentar resistencia."
    ],
    notas_columna: "La fitball es superior al crunch en suelo en F2 porque la curva limita naturalmente la extension lumbar en el descenso — punto critico de mayor presion intradiscal en el crunch convencional. La rotacion (codo-rodilla) solo se introduce desde S5-6 porque combina flexion y rotacion simultaneas, aumentando la presion en L4-L5 y L5-S1. Con extrusion paramedial derecha en L4-L5, iniciar la rotacion hacia el lado derecho con mayor precaucion. Parar inmediatamente si aparece irradiacion."
  },

  "remo-mancuerna": {
    nombre: "Remo con mancuerna un brazo",
    categoria: "Tiro horizontal",
    color: "#3C3489",
    descripcion: "Remo unilateral con apoyo en banco. Permite mayor rango de movimiento y activacion del dorsal que el remo bilateral. El apoyo contralateral protege la columna.",
    posicion: "Arrodillado en el banco con la rodilla y la mano del lado no trabajador apoyadas. El otro pie apoyado en el suelo. Espalda horizontal y neutra.",
    pasos: [
      "Posicion de la espalda: horizontal, neutra. Ni cifosis ni lordosis.",
      "La mancuerna cuelga en el brazo extendido, palma hacia ti.",
      "Activa la escapula del lado que trabaja — retraccion inicial.",
      "Tira la mancuerna hacia la cadera ipsilateral, codo pegado al cuerpo.",
      "En el punto alto: la mancuerna queda al nivel de la cadera, codo por encima de la espalda.",
      "Baja lentamente controlando el excentrico — la escapula se aleja.",
      "No rotar la columna para ayudarte — el movimiento es solo del brazo."
    ],
    errores: [
      "Rotar la columna para ganar rango: la rotacion debe ser minima y escapular, no lumbar.",
      "Apoyo de mano demasiado adelantado: pone la columna en flexion lateral.",
      "Usar momentum — el remo debe ser puro tiron sin swing.",
      "No llegar al rango completo: la mancuerna debe quedar a nivel de la cadera."
    ],
    variantes: [
      "F2: 3x10 cada lado, carga moderada.",
      "F3: aumentar carga. Progresar a remo con barra t-bar."
    ],
    notas_columna: "El apoyo contralateral en el banco mantiene la columna lumbar en posicion neutra durante el movimiento. Es importante que el apoyo de rodilla sea firme y la espalda completamente horizontal — si la espalda se inclina hacia abajo o hacia arriba, la columna lumbar carga el movimiento. Con extrusion L4-L5 activa, limitar el rango de movimiento al que no produce molestia en la zona lumbar."
  },

  "remo-polea-baja": {
    nombre: "Remo en polea baja sentado",
    categoria: "Tiro horizontal",
    color: "#3C3489",
    descripcion: "Remo horizontal con la polea baja en posicion sentada. Permite cargar el tiro horizontal con excelente aislamiento del dorsal y los romboides.",
    posicion: "Sentado en el suelo o banco frente a la polea baja, pies apoyados en la plataforma, rodillas ligeramente flexionadas. Espalda erguida y neutra.",
    pasos: [
      "Agarra el triangulo neutro o la barra paralela. Brazos extendidos.",
      "La espalda debe estar erguida — ni inclinada adelante ni atras. Pelvis neutra.",
      "Activa escapulas (retraccion) antes de doblar codos.",
      "Tira hacia el abdomen, codos pegados al cuerpo.",
      "Pausa 1 segundo con escapulas completamente retraidas.",
      "Suelta lento — NO dejes que la espalda se redondee hacia adelante para ganar rango."
    ],
    errores: [
      "Inclinar el tronco adelante y atras (rocking): convierte el ejercicio en un movimiento de columna.",
      "Redondear la espalda al soltar: tension discal en flexion con carga.",
      "Codos muy separados del cuerpo."
    ],
    variantes: [
      "F2: 3x12, pausa 1 seg, agarre neutro.",
      "F3: aumentar carga, progresar a remo con barra."
    ],
    notas_columna: "Mantén la espalda completamente estatica durante el ejercicio. La tentacion de inclinar el tronco hacia adelante al soltar aumenta la carga en flexion lumbar. Si esto ocurre consistentemente, reducir el peso y trabajar la activacion escapular aislada antes del ejercicio completo."
  },

  // ─── CORE F2 ─────────────────────────────────────────────────
  "dead-bug": {
    nombre: "Dead bug con extension completa",
    categoria: "Core F2",
    color: "#993C1D",
    descripcion: "Ejercicio de estabilizacion del core que entrena la anti-extension lumbar. Requiere mantener la columna lumbar pegada al suelo mientras se mueven los brazos y piernas de forma coordinada.",
    posicion: "Tumbado boca arriba. Brazos extendidos hacia el techo. Caderas y rodillas a 90 grados (posicion de mesa).",
    pasos: [
      "Desde la posicion inicial, presiona activamente la zona lumbar contra el suelo. Este contacto debe mantenerse DURANTE TODO EL EJERCICIO.",
      "Inspira preparando el movimiento.",
      "Exhala y extiende simultaneamente el brazo derecho (hacia atras, sobre la cabeza) y la pierna izquierda (hacia adelante, sin tocar el suelo).",
      "La zona lumbar NO debe despegarse del suelo — si lo hace, el rango es excesivo.",
      "Vuelve lentamente a la posicion inicial.",
      "Repite con brazo izquierdo y pierna derecha.",
      "Movimiento lento y controlado — 2 seg en la extension, 2 seg en la vuelta."
    ],
    errores: [
      "La zona lumbar se despega del suelo: DETENER EL MOVIMIENTO. Reducir el rango hasta que no ocurra.",
      "Contener la respiracion: la coordinacion con la respiracion es parte del ejercicio.",
      "Velocidad excesiva: el beneficio es el control, no la repeticion rapida.",
      "Extensiones asimétricas: el cuerpo debe ser simetrico."
    ],
    variantes: [
      "F2 inicio (reagudizacion): solo extension de un miembro a la vez (brazo solo, o pierna sola).",
      "F2 estandar: extension contralateral completa 3x10 cada lado.",
      "F2 avanzada: anadir press de palma contra rodilla (isometrico) en la posicion de mesa.",
      "F3: dead bug con fitball entre brazos y piernas."
    ],
    notas_columna: "S1-2 (un miembro): la reduccion de palanca minimiza la presion intradiscal — seguro con irradiacion activa. S3-4 (contralateral): el patron cruzado activa los multifidos ipsilaterales al segmento afectado L5-S1 izq — directamente terapeutico. S5-6 (press palma-rodilla): el isometrico anadido aumenta la co-contraccion del core sin aumentar el rango — carga cualitativa, no cuantitativa. S7+ (con peso en pie): aumenta la palanca de la pierna, incrementa la demanda anti-extension — solo si lumbar pegada al suelo en TODO el rango. La lumbar despegada convierte el ejercicio en extension lumbar bajo carga: contraproducente con extrusion bilateral activa."
  },

  "bird-dog": {
    nombre: "Bird dog con pausa",
    categoria: "Core F2",
    color: "#993C1D",
    descripcion: "Ejercicio de estabilizacion cuadrupeda que entrena el control pelvico y la coordinacion de la cadena posterior. Activa los multifidos lumbares sin carga compresiva significativa.",
    posicion: "A cuatro patas: rodillas bajo las caderas, manos bajo los hombros. Columna en posicion neutra — ni cifosis ni lordosis. Cabeza en linea con la columna.",
    pasos: [
      "Antes de mover ningun miembro: activa el core suavemente (20% de contraccion maxima).",
      "Extiende el brazo derecho hacia adelante y la pierna izquierda hacia atras SIMULTANEAMENTE.",
      "El objetivo es que el brazo, tronco y pierna formen una linea recta horizontal.",
      "Mantén la pelvis completamente nivelada — ni debe rotar ni inclinarse lateralmente.",
      "Pausa 2-3 segundos. Respira durante la pausa.",
      "Vuelve lentamente a la posicion cuadrupeda.",
      "Repite con el lado contrario.",
      "Comprueba en espejo lateral si es posible."
    ],
    errores: [
      "La pelvis rota hacia el lado de la pierna extendida: es la compensacion mas comun.",
      "Hiperlordosis lumbar al extender la pierna: el gluteo no esta activado.",
      "La pierna levantada sube por encima de la linea del tronco: tension en L5-S1.",
      "Inestabilidad del hombro de apoyo: fortalecer primero con ejercicios de escapula."
    ],
    variantes: [
      "F2 inicio: extension de brazo solo, o de pierna sola.",
      "F2 estandar: contralateral completo, pausa 3 seg, 3x10 cada lado.",
      "F2 avanzada: trazar un rectangulo con la mano antes de volver.",
      "F3: bird dog con banda en tobillo."
    ],
    notas_columna: "S1-2 (un miembro): reducir la palanca para no irritar la raiz S1 — brazo O pierna, nunca los dos a la vez en reagudizacion. S3-4 (contralateral + pausa 3s): la pausa activa los multifidos de forma sostenida — los estudios de EMG muestran mayor activacion con pausa que con movimiento continuo. S5-6 (banda tobillo): la resistencia anadida aumenta la demanda de estabilizacion lateral de la pelvis — trabaja el gluteo medio del lado afectado. S7+ (superficie inestable): el bosu o la colchoneta fina aumentan la demanda propioceptiva segmentaria en L4-L5 sin aumentar la carga. Los multifidos lumbares muestran atrofia ipsilateral confirmada por RMN en tu caso — este ejercicio es la rehabilitacion especifica de ese deficit."
  },

  "plank-anterior": {
    nombre: "Plank anterior (isometrico frontal)",
    categoria: "Core F2",
    color: "#993C1D",
    descripcion: "Ejercicio isometrico de anti-extension del core. Mantiene la columna en posicion neutra bajo carga de gravedad mediante la activacion simultanea de todos los musculos del core.",
    posicion: "Boca abajo apoyado en antebrazos y puntas de los pies. Codos directamente bajo los hombros. Cuerpo en linea recta de cabeza a talones.",
    pasos: [
      "Posicion de antebrazos: codos bajo hombros, manos juntas o paralelas.",
      "Activa el core: imagina que vas a recibir un puñetazo en el abdomen — esa tension.",
      "Aprieta el gluteo: es el motor secundario del plank.",
      "La cabeza en extension neutra — ni la dejes caer ni la levantes.",
      "Empuja el suelo con los codos (imagina que intentas alejar los codos de las manos): activa el serrato.",
      "Respira con normalidad durante el plank.",
      "Mantén el tiempo indicado. Si la forma se rompe — para."
    ],
    errores: [
      "Las caderas suben (posicion de tienda de campaña): el core no esta activo.",
      "Las caderas bajan (sagging): los extensores lumbares estan trabajando en exceso.",
      "Contener la respiracion: aumenta la presion intraabdominal innecesariamente.",
      "Cuello en hiperextension: tension cervical innecesaria."
    ],
    variantes: [
      "F2 inicio: plank de rodillas.",
      "F2 estandar: plank completo 3x 20-35 seg.",
      "F2 avanzada: plank con elevacion de un brazo o una pierna.",
      "F3: plank dinamico (plank to push-up), plank con fitball."
    ],
    notas_columna: "S1-2 (rodillas, 20s): reduce la palanca un 40% — la presion intradiscal en anti-extension de rodillas es comparable al plank completo pero con mucho menor riesgo de perdida de control lumbar. S3-4 (completo 30s): la posicion completa activa el transverso abdominis y los multifidos de forma maxima — el marcador es que la lumbar no se hunda. S5-6 (45s): el tiempo anadido aumenta la resistencia muscular sin aumentar la carga articular — mas tiempo no es mas riesgo si la tecnica es correcta. S7+ (elevacion alterna): el desequilibrio fuerza la estabilizacion unilateral del core — directamente terapeutico para la asimetria L5-S1 izquierda. Tiempo maximo util por set: 60s — mas alla la activacion decrece sin beneficio adicional."
  },

  "plank-lateral": {
    nombre: "Plank lateral",
    categoria: "Core F2",
    color: "#993C1D",
    descripcion: "Ejercicio isometrico de anti-flexion lateral del core. Trabaja el cuadrado lumbar, oblicuos y gluteo medio — musculos clave para la estabilidad lumbopelvica lateral.",
    posicion: "Tumbado de lado, apoyado en el antebrazo inferior (codo bajo el hombro) y el borde del pie. Cuerpo en linea recta lateral.",
    pasos: [
      "Codo directamente bajo el hombro. El hombro debe estar activo — no hundido.",
      "Eleva las caderas del suelo hasta que el cuerpo forme una linea recta.",
      "El pie superior sobre el inferior, o separados ligeramente.",
      "La cadera superior no debe ni hundirse ni subir en exceso.",
      "Core activo: imagina que comprimes las costillas hacia la pelvis lateralmente.",
      "Mantén el tiempo. Baja lentamente."
    ],
    errores: [
      "La cadera inferior se hunde hacia el suelo: gluteo medio y cuadrado lumbar no estan activos.",
      "La cadera sube en exceso (banana invertida): compensacion con el oblicuo externo.",
      "El hombro de apoyo se hunde: riesgo de lesion de hombro y falta de activacion del serrato."
    ],
    variantes: [
      "F2 inicio: plank lateral de rodillas.",
      "F2 estandar: plank lateral completo 2x15-20 seg cada lado.",
      "F2 avanzada: con abduccion de la pierna superior.",
      "F3: plank lateral con rotacion de cadera."
    ],
    notas_columna: "S1-2 (rodillas, 20s): la palanca reducida baja la demanda del cuadrado lumbar un 40% — si hay irradiacion en el plank lateral izquierdo, practicar solo el lado derecho hasta que remita. S3-4 (completo 25s): activacion maxima del cuadrado lumbar y oblicuo externo ipsilateral — directamente terapeutico para la estabilizacion lateral de L4-L5. S5-6 (35s): la resistencia del cuadrado lumbar se desarrolla — musculo clave en la prevencion de recaidas lumbares. S7+ (abduccion pierna): el gluteo medio se activa simultaneamente al cuadrado lumbar — patron completo de estabilizacion lumbopelvica lateral. Si el plank lateral izquierdo es mas debil que el derecho, confirma asimetria de cuadrado lumbar izquierdo por afectacion L4-L5."
  },

  "pallof-press": {
    nombre: "Pallof press en polea",
    categoria: "Core F2",
    color: "#993C1D",
    descripcion: "Ejercicio de anti-rotacion del core con polea. Entrena la resistencia del core a la rotacion — patron fundamental para proteger la columna en movimientos cotidianos.",
    posicion: "De pie lateral a la polea, a una distancia de un brazo. Agarre de la cuerda o del mango con ambas manos frente al pecho. Pies a anchura de hombros.",
    pasos: [
      "Posicion inicial: cuerda o mango pegado al pecho esternal, manos entrelazadas.",
      "Activa el core: resiste la tension de la polea que intenta rotarte hacia ella.",
      "Extiende los brazos hacia adelante (press) lentamente — la polea intentara rotarte.",
      "Mantén el cuerpo completamente de frente — sin rotar el tronco.",
      "Mantén 1-2 segundos con brazos extendidos.",
      "Vuelve lentamente al pecho.",
      "El cuerpo debe sentirse como un muro que resiste la rotacion."
    ],
    errores: [
      "Rotar el tronco al extender los brazos: el ejercicio pierde su funcion.",
      "Demasiado peso: obliga a rotar o a compensar con los pies.",
      "Pies demasiado juntos: base de sustentacion insuficiente para la anti-rotacion.",
      "Respiracion bloqueada."
    ],
    variantes: [
      "S1-2: isometrico al pecho — sostenido 3x10s cada lado, sin press dinamico. La tension de polea se resiste pero los brazos no se extienden. Carga minima.",
      "S3-4: press diagonal — polea a altura de pecho, press diagonal hacia abajo-adelante. El plano diagonal activa oblicuos y cuadrado lumbar con mayor especificidad que el press neutro.",
      "S5-6: press + paso lateral — mientras se mantiene el press, dar un paso lateral alejandose de la polea. Carga anti-rotacion con base de sustentacion reducida.",
      "F3: con sentadilla — Pallof press sostenido mientras se realiza una sentadilla parcial. Patron funcional de alta demanda."
    ],
    notas_columna: "S1-2 (isometrico al pecho): sin extension de brazos — la resistencia a la rotacion es maxima con el brazo de palanca minimo. Seguro con irradiacion activa. S3-4 (press diagonal): el plano diagonal incorpora los oblicuos internos y externos — especialmente relevante para la extrusion L5-S1 izq donde la rotacion hacia la izquierda es el patron de mayor riesgo. S5-6 (press + paso): la base reducida exige mayor activacion del gluteo medio contralateral — directamente terapeutico para la inestabilidad lumbopelvica. La capacidad de resistir la rotacion lumbar es uno de los predictores mas fuertes de ausencia de recaida en dolor lumbar cronico."
  },

  "hollow-body": {
    nombre: "Hollow body hold",
    categoria: "Core F2",
    color: "#993C1D",
    descripcion: "Posicion isometrica de anti-extension maxima del core. Es el patron basico de la gimnasia artistica y el precursor del V-sit. Requiere activacion maxima del transverso abdominis.",
    posicion: "Tumbado boca arriba. Brazos extendidos sobre la cabeza. Piernas extendidas.",
    pasos: [
      "Desde posicion supina, presiona activamente la zona lumbar contra el suelo.",
      "Extiende los brazos sobre la cabeza (biceps junto a las orejas).",
      "Levanta los hombros ligeramente del suelo (como un crunch parcial pero sin flexion cervical).",
      "Levanta las piernas a 30-45 grados del suelo (o mas alto si la lumbar se despega).",
      "La zona lumbar debe estar PEGADA al suelo en todo momento.",
      "Mantén la posicion respirando con normalidad.",
      "Si la lumbar se despega: sube mas las piernas (reducir el brazo de palanca)."
    ],
    errores: [
      "La zona lumbar se despega del suelo: el brazo de palanca de las piernas es excesivo. Subir piernas.",
      "Las piernas muy bajas sin control lumbar: extension lumbar bajo carga isometrica.",
      "Contener la respiracion.",
      "Tension cervical excesiva al levantar los hombros."
    ],
    variantes: [
      "S1-2: rodillas en mesa (90°), brazos extendidos — 3x15s.",
      "S3-4: piernas a 45°, lumbar pegada al suelo — 3x20s.",
      "S5-6: piernas a 30° — 3x25s.",
      "S7+: piernas a 15° del suelo — 3x30s.",
      "F3 — Hollow body hold en barra: dead hang con cuerpo en tension hollow completa. Brazos en barra, escapulas activas (no encogidas), pelvis en retroversion, piernas unidas y extendidas hacia adelante. La columna lumbar NO esta en extension — el core mantiene el patron hollow en suspension. Iniciar con 3x10-15s y progresar hasta 3x30s antes de pasar a variantes dinamicas (toes-to-bar, muscle-up kip)."
    ],
    notas_columna: "S1-2 (rodillas en mesa 15s): la palanca corta mantiene la presion intradiscal minima — el transverso abdominis se activa sin riesgo de despegue lumbar. S3-4 (piernas 45° 20s): la palanca media exige co-contraccion maxima del core — el marcador es que la lumbar no se despegue en ningun momento. S5-6 (piernas 30° 25s): zona de mayor eficiencia terapeutica para tu caso — suficiente palanca para activar el core profundo sin llegar al umbral de compression L5-S1. S7+ (piernas 15° 30s): palanca maxima, solo posible con control total. F3 en barra: añade traccion descompresiva lumbar sobre el patron hollow — el puente directo hacia calistenia. Solo introducir sin irradiacion activa."
  },

  // ─── GLUTEO ──────────────────────────────────────────────────
  "glute-bridge": {
    nombre: "Glute bridge bilateral",
    categoria: "Gluteo F2",
    color: "#993C1D",
    descripcion: "Extension de cadera en decubito supino con apoyo bilateral de pies. Activa el gluteo mayor como motor primario, enseñando la disociacion cadera-columna.",
    posicion: "Tumbado boca arriba. Rodillas flexionadas a 90 grados, pies apoyados en el suelo a anchura de caderas. Brazos a los lados.",
    pasos: [
      "Pies a anchura de caderas, talones a 30 cm aproximadamente del gluteo.",
      "Activa el core ligeramente. Presiona los pies contra el suelo.",
      "Eleva las caderas apretando el GLUTEO (no los isquiotibiales ni la espalda baja).",
      "Sube hasta que el cuerpo forme una linea recta de hombros a rodillas.",
      "Pausa 2 segundos arriba — aprieta al maximo el gluteo.",
      "Baja lentamente controlando el excentrico.",
      "La zona lumbar NO debe hiperlordosear en la posicion alta — la pelvis se inclina posterioramente (retroversion)."
    ],
    errores: [
      "Subir con la espalda baja en lugar del gluteo: los erectores lumbares hacen el trabajo.",
      "Hiperlordosis en el punto alto: extiende el disco L5-S1 bajo carga.",
      "Pies demasiado lejos del cuerpo: los isquiotibiales toman el protagonismo.",
      "No llegar a la extension completa de cadera."
    ],
    variantes: [
      "F2 inicio (reagudizacion): glute bridge isometrico (no dinamico, solo mantener la posicion alta).",
      "F2 estandar: 3x15 con pausa 2 seg.",
      "F2 avanzada: con banda sobre las rodillas (resistencia a la abduccion).",
      "F3: single leg glute bridge, hip thrust con barra."
    ],
    notas_columna: "S1-2 (isometrico 5s): sin movimiento dinamico — la contraccion estatica del gluteo mayor estabiliza la sacroiliaca sin carga de cizalla sobre L5-S1. S3-4 (15 reps pausa 2s): la pausa en posicion alta maximiza la activacion del gluteo y enseña la disociacion cadera-columna — patron que se transfiere directamente a la vida diaria. S5-6 (banda muslos): la resistencia a la abduccion activa simultaneamente el gluteo medio — patron bilateral completo de estabilizacion lumbopelvica. S7+: progresar a hip thrust con mayor rango y carga. La hiperlordosis en la posicion alta es la señal de alarma — indica que los erectores lumbares estan compensando al gluteo y aumentando la compression sobre los discos extruidos."
  },

  "hip-thrust-banco": {
    nombre: "Hip thrust en banco (peso corporal)",
    categoria: "Gluteo F2",
    color: "#993C1D",
    descripcion: "Extension de cadera con el tronco elevado sobre un banco. Mayor rango de movimiento que el glute bridge y mayor activacion del gluteo mayor en la posicion alta.",
    posicion: "Hombros apoyados en el borde de un banco (altura de rodillas). Pies apoyados en el suelo a anchura de caderas. Caderas en el punto mas bajo al iniciar.",
    pasos: [
      "Posicion en el banco: los omoplatos deben apoyar en el borde del banco, no el cuello.",
      "Pies a anchura de caderas, rodillas a 90 grados en la posicion alta.",
      "Desde la posicion baja (caderas casi en el suelo): activa el gluteo y empuja hacia arriba.",
      "Posicion alta: cuerpo paralelo al suelo, rodillas a 90 grados, columna neutra.",
      "La columna NO debe hiperlordosear. La pelvis se inclina ligeramente en retroversion.",
      "Pausa 1-2 segundos apretando el gluteo al maximo.",
      "Baja lentamente controlando el excentrico."
    ],
    errores: [
      "Los omoplatos se deslizan por el banco: subir mas el banco o anclar con las manos.",
      "Los pies demasiado lejos: los isquiotibiales predominan.",
      "Hiperlordosis lumbar en el punto alto.",
      "Las rodillas se juntan en la subida: usar banda para corregir."
    ],
    variantes: [
      "F2 sem 4-5: peso corporal, 3x12, excentrico 2 seg.",
      "F2 sem 6-7: con mancuerna sobre el pubis, o con banda de resistencia.",
      "F2 sem 7-8: con barra (30-40% peso corporal).",
      "F3: hip thrust con barra, progresion de carga normal."
    ],
    notas_columna: "S1-2 (bilateral pausa 2s): la pausa elimina el momentum — la activacion del gluteo es maxima y la carga sobre L5-S1 es minima porque no hay fase de aceleracion. S3-4 (bilateral + banda): la banda sobre los muslos activa el gluteo medio simultaneamente al mayor — patron completo de estabilizacion sacroiliaca. S5-6 (unilateral): el hip thrust unilateral es 40% mas dificil que el bilateral pero permite detectar asimetrias — si el lado izquierdo es mas debil, hay transferencia directa de ese deficit a la inestabilidad L5-S1 izq. S7+ (bilateral con barra): la carga externa aumenta el estimulo de reclutamiento del gluteo mayor — el marcador de que es seguro es que la posicion alta mantenga columna neutra sin hiperlordosis."
  },

  "clamshell": {
    nombre: "Clamshell con banda elastica",
    categoria: "Gluteo F2",
    color: "#993C1D",
    descripcion: "Abduccion y rotacion externa de cadera en decubito lateral. Activa especificamente el gluteo medio y el piriforme, fundamentales para la estabilizacion lumbopelvica.",
    posicion: "Tumbado de lado, caderas y rodillas flexionadas a 45 grados. Banda elastica sobre los muslos (por encima de las rodillas). Cadera inferior apoyada en el suelo.",
    pasos: [
      "Posicion lateral: caderas apiladas verticalmente, rodillas juntas.",
      "Banda sobre los muslos, tensionada ligeramente en la posicion de partida.",
      "Abre la rodilla superior hacia arriba como una almeja que se abre — manteniendo los pies juntos.",
      "La pelvis NO debe rotar hacia atras durante la apertura. Es el error mas comun.",
      "Abre hasta donde la pelvis permanezca quieta.",
      "Mantén 1 segundo arriba. Baja lentamente.",
      "Siente la activacion en la parte lateral-superior del gluteo."
    ],
    errores: [
      "La pelvis rota hacia atras: es compensacion del tensor de la fascia lata (TFL) en lugar del gluteo medio.",
      "Banda demasiado alta (sobre las rodillas vs sobre los muslos): cambia el angulo de activacion.",
      "Rango excesivo que obliga a rotar la pelvis.",
      "Velocidad excesiva: el gluteo medio necesita tiempo bajo tension."
    ],
    variantes: [
      "F2: banda ligera, 3x15 cada lado, control de pelvis.",
      "F2 avanzada: con banda mas resistente.",
      "F3: clamshell con pesa en la pierna superior."
    ],
    notas_columna: "El gluteo medio es el estabilizador lateral de la pelvis. Su debilidad provoca el signo de Trendelenburg (la pelvis cae hacia el lado no apoyado al caminar), que aumenta el stress asimetrico sobre L5-S1. Con la extrusion izquierda activa, el gluteo medio izquierdo esta frecuentemente inhibido por el dolor — el clamshell lo reactiva de forma segura sin carga axial."
  },

  "monster-walk": {
    nombre: "Monster walk lateral con banda",
    categoria: "Gluteo F2",
    color: "#993C1D",
    descripcion: "Marcha lateral con banda de resistencia. Activa el gluteo medio de forma dinamica en cadena cinetica cerrada, integrando la estabilizacion pelvica con el patron de marcha.",
    posicion: "De pie, banda elastica sobre los tobillos o por encima de las rodillas. Pies a anchura de caderas, rodillas en semiflexion.",
    pasos: [
      "Posicion de partida: semiflexion de rodillas (atletica), tronco erguido.",
      "Da un paso lateral con el pie derecho, manteniendo la tension en la banda.",
      "Sigue con el pie izquierdo — sin dejar que los pies se junten completamente.",
      "Mantén las rodillas en semiflexion durante TODO el movimiento.",
      "La cadera no debe subir y bajar con cada paso — mantén la altura constante.",
      "Tronco erguido: no te inclines hacia el lado del paso.",
      "15 pasos en una direccion, 15 en la otra."
    ],
    errores: [
      "Las rodillas se enderezan entre pasos: pierde la activacion del gluteo.",
      "El tronco se inclina lateralmente: es compensacion del cuadrado lumbar.",
      "Pasos demasiado grandes: sobrecarga el TFL.",
      "Las rodillas colapsan hacia adentro (valgo): banda demasiado resistente."
    ],
    variantes: [
      "F2: banda sobre muslos, 3x12m, semiflexion constante.",
      "F2 avanzada: banda sobre tobillos (mayor brazo de palanca).",
      "F3: monster walk con peso adicional (chaleco o mancuernas)."
    ],
    notas_columna: "El monster walk integra la activacion del gluteo medio con el patron de marcha, haciendo la transferencia funcional mas directa que el clamshell. Especialmente importante para corregir el patron de marcha compensatorio que frecuentemente se desarrolla con el dolor lumbar y la irradiacion ciatica."
  },

  "cable-kickback": {
    nombre: "Cable kickback en polea baja",
    categoria: "Gluteo F2",
    color: "#993C1D",
    descripcion: "Extension de cadera unilateral con polea baja. Activa el gluteo mayor en rango completo de movimiento en posicion de carga parcial.",
    posicion: "De pie frente a la polea baja, tobillo conectado al cable. Manos apoyadas en la maquina para estabilizar. Ligera inclinacion hacia adelante del tronco.",
    pasos: [
      "Conecta el accesorio de tobillo al cable de la polea baja.",
      "Posicion: ligera inclinacion de tronco hacia adelante (20 grados), manos en la maquina.",
      "Activa el core para evitar compensacion lumbar.",
      "Extiende la cadera hacia atras manteniendo la rodilla ligeramente flexionada.",
      "El movimiento es SOLO de cadera — la columna lumbar no se mueve.",
      "Extension maxima sin hiperlordosis lumbar. El gluteo debe estar apretado al maximo.",
      "Baja lentamente controlando el excentrico."
    ],
    errores: [
      "Hiperlordosis lumbar al extender la cadera: los erectores compensan al gluteo debil.",
      "Extension de rodilla durante el movimiento: cambia el patron muscular.",
      "Rotacion de pelvis hacia el lado que trabaja.",
      "Demasiado peso: la columna empieza a moverse."
    ],
    variantes: [
      "F2: 3x12 cada lado, rango controlado sin hiperlordosis.",
      "F3: mayor rango, mayor carga, combinar con extension de rodilla."
    ],
    notas_columna: "El cable kickback permite aislar la extension de cadera sin la demanda de estabilizacion lumbar que tiene el hip thrust. Util como ejercicio de cierre del bloque de gluteo para agotar el gluteo mayor con minimo stress lumbar. La clave es mantener la columna completamente estatica — si se mueve, reducir el peso."
  },

  // ─── HIP MOBILITY ────────────────────────────────────────────
  "hip-cars": {
    nombre: "Hip CARs — Controlled Articular Rotations",
    categoria: "Movilidad de cadera",
    color: "#0F6E56",
    descripcion: "Rotaciones articulares controladas de la cadera. Entrena el control activo en todo el rango de movimiento articular disponible, mejorando la propiocepcion y la salud del cartilago.",
    posicion: "De pie sobre una pierna o apoyado en una pared para equilibrio. Peso en la pierna de apoyo.",
    pasos: [
      "De pie, apoya una mano en la pared si necesitas equilibrio.",
      "Eleva la rodilla de la pierna que trabaja hasta 90 grados (o hasta donde puedas sin dolor).",
      "Desde ahi: mueve la cadera en un circulo lo mas grande posible.",
      "El movimiento debe ser LENTO (4 segundos por cada fase del circulo).",
      "Fase de abduccion: la rodilla se mueve hacia el lado.",
      "Fase de extension: la rodilla va hacia atras.",
      "Fase de adduccion: la rodilla cruza hacia el otro lado.",
      "Fase de flexion: vuelta al punto de partida.",
      "El tronco debe permanecer completamente estatico durante todo el circulo."
    ],
    errores: [
      "Mover el tronco para compensar la falta de movilidad de cadera: el movimiento es SOLO de la cadera.",
      "Velocidad excesiva: los CARs son lentos por definicion.",
      "Dolor durante el arco: reducir el rango hasta que sea indoloro.",
      "Perder el equilibrio: usar apoyo de pared."
    ],
    variantes: [
      "F2 inicio: CARs con apoyo de pared, rango reducido.",
      "F2 estandar: 2x5 cada cadera, rango completo sin dolor.",
      "F3: CARs sin apoyo, rango completo, con resistencia de banda."
    ],
    notas_columna: "Los CARs de cadera son el primer ejercicio a introducir despues de la reagudizacion porque trabajan el rango articular activo sin carga axial en la columna. La rigidez de la cadera que frecuentemente acompaña a la extrusion L5-S1 (por espasmo del psoas y piriforme) mejora significativamente con CARs diarios. El circulo completo debe ser indoloro — cualquier dolor durante el arco indica que ese angulo especifico debe trabajarse con mas tiempo."
  },

  "stretch-90-90": {
    nombre: "90/90 stretch activo",
    categoria: "Movilidad de cadera",
    color: "#0F6E56",
    descripcion: "Estiramiento activo de la cadera en posicion 90/90. Trabaja simultaneamente la rotacion interna de la cadera delantera y la rotacion externa de la trasera.",
    posicion: "Sentado en el suelo con ambas piernas en angulo de 90 grados: pierna delantera con la rodilla y el tobillo en el suelo, pierna trasera igualmente en 90 grados hacia atras.",
    pasos: [
      "Siéntate en el suelo con la pierna delantera en 90 grados: cadera, rodilla y tobillo formando un angulo recto.",
      "La pierna trasera tambien en 90 grados detras de ti.",
      "Posicion inicial: tronco erguido sobre la pierna delantera.",
      "Activa: intenta empujar la rodilla delantera contra el suelo sin que se levante el pie.",
      "Mantén la activacion 5-10 segundos.",
      "Luego: inclina el tronco hacia adelante sobre la tibia delantera para aumentar el estiramiento.",
      "No fuerces el rango — respira durante el estiramiento.",
      "Cambia de lado."
    ],
    errores: [
      "El sacro rota excesivamente al inclinar el tronco: la pelvis debe mantenerse relativamente neutra.",
      "Dolor en la rodilla delantera: el tobillo no esta bien alineado (debe estar en dorsiflexion).",
      "Intentar forzar el rango con las manos: el estiramiento debe ser progresivo."
    ],
    variantes: [
      "F2: pasivo (sin activacion), solo inclinacion hacia adelante.",
      "F2 estandar: activo con empuje de rodilla contra el suelo.",
      "F3: rotacion de tronco sobre la cadera delantera, alcanzar con el brazo contrario."
    ],
    notas_columna: "La restriccion de la rotacion interna de cadera (frecuente con espasmo del piriforme y gluteo medio) es uno de los principales factores que aumentan la carga en L5-S1 durante la marcha. El 90/90 activo mejora especificamente esa rotacion interna que el lado izquierdo tiene comprometida por la irradiacion S1."
  },

  "pigeon-banco": {
    nombre: "Pigeon pose en banco",
    categoria: "Movilidad de cadera",
    color: "#0F6E56",
    descripcion: "Version adaptada del pigeon pose yoga sobre un banco. Estira el piriforme, gluteo medio y rotadores externos de la cadera de forma intensa pero sin cargar la columna lumbar.",
    posicion: "De pie frente a un banco o mesa. Pierna que se estira apoyada horizontalmente sobre el banco.",
    pasos: [
      "Coloca la pierna a estirar sobre el banco: la tibia horizontal, tobillo al borde del banco.",
      "La cadera de esa pierna debe estar en rotacion externa (el pie mira hacia afuera o hacia adelante).",
      "La pierna de apoyo esta en el suelo, ligeramente flexionada.",
      "Mantén el tronco erguido inicialmente — siente el estiramiento en el gluteo.",
      "Para aumentar: inclina suavemente el tronco hacia adelante sobre la pierna apoyada.",
      "Respira profundo durante el estiramiento — cada exhala permite un mayor rango.",
      "Mantén 40-45 segundos. Cambia de lado."
    ],
    errores: [
      "La rodilla de la pierna apoyada apunta hacia arriba en lugar de hacia el lado: la cadera no esta en rotacion externa.",
      "Inclinar excesivamente el tronco compensando con flexion lumbar.",
      "Forzar el rango con dolor: el piriforme puede estar muy contracturado y necesita progresion."
    ],
    variantes: [
      "F2: banco alto (menos rango), 2x40 seg.",
      "F2 avanzada: banco mas bajo (mayor rango).",
      "F3: pigeon pose en el suelo completo."
    ],
    notas_columna: "El piriforme tiene una relacion anatomica directa con la raiz S1 — en aproximadamente el 15% de las personas, el nervio ciatico atraviesa el piriforme en lugar de pasar por debajo. El espasmo del piriforme (frecuente con extrusion L5-S1) puede atrapar el nervio ciatico adicionalmente al atrapamiento discal. El pigeon pose en banco es la forma mas segura de relajar este musculo."
  },

  // ─── NEURODYNAMICS ────────────────────────────────────────────
  "slump-test": {
    nombre: "Slump test pasivo progresivo",
    categoria: "Neurodynamics",
    color: "#993C1D",
    descripcion: "Movilizacion del nervio ciatico en su recorrido desde la columna lumbar hasta el pie. Libera adhesiones neurales que contribuyen al dolor irradiado.",
    posicion: "Sentado en el borde de una silla o banco, con postura erguida.",
    pasos: [
      "Siéntate erguido en el borde de la silla.",
      "Flexiona ligeramente el cuello (barbilla hacia el pecho).",
      "Desde esa posicion, extiende lentamente la rodilla del lado afectado (izquierdo).",
      "Detente al primer signo de tension neuronal (tiron detras del muslo o en la pantorrilla).",
      "Mantén 2-3 segundos en ese punto.",
      "Flexiona la rodilla ligeramente para liberar la tension.",
      "Repite el movimiento como un flossing suave (10 veces).",
      "Si el estiramiento reproduce la irradiacion exacta: es positivo — hacerlo con mas cuidado y menor rango."
    ],
    errores: [
      "Forzar la extension de rodilla con dolor intenso: puede aumentar la inflamacion neural.",
      "Hacer el movimiento demasiado rapido: el flossing neural necesita ser suave.",
      "Ignorar el lado no afectado: hacerlo tambien en la derecha para comparacion."
    ],
    variantes: [
      "F2 inicio: solo flexion cervical sin extension de rodilla (si hay irradiacion activa).",
      "F2 estandar: flossing suave 2x5 cada lado.",
      "F2 avanzada: agregar dorsiflexion del tobillo simultanea.",
      "F3: slump completo con tension maxima mantenida."
    ],
    notas_columna: "El test de slump es positivo en tu caso — la extrusion L5-S1 izquierda con contacto en la raiz S1 genera sensibilizacion mecanica del nervio. El flossing neural (movimiento suave que desliza el nervio en su canal) reduce esa sensibilizacion progressivamente. Es uno de los ejercicios mas documentados para la reduccion del dolor irradiado ciatico. Registrar en el tracker si el flossing reproduce o alivia la irradiacion."
  },

  "neural-flossing": {
    nombre: "Neural flossing nervio ciatico",
    categoria: "Neurodynamics",
    color: "#993C1D",
    descripcion: "Movilizacion del nervio ciatico mediante movimientos alternos de tension y liberacion. Mejora la movilidad neural y reduce la sensibilizacion del nervio comprimido.",
    posicion: "Sentado en una silla, espalda erguida. O tumbado en decubito supino.",
    pasos: [
      "Version sentado: siéntate erguido con ambos pies en el suelo.",
      "Extiende la rodilla izquierda mientras simultáneamente flexionas el cuello (barbilla al pecho).",
      "Cuando sientas tension (tiron): mantén 1 segundo.",
      "Flexiona la rodilla izquierda mientras simultáneamente llevas la cabeza hacia atras (extension cervical).",
      "Este movimiento alternado (extension rodilla + flexion cervical / flexion rodilla + extension cervical) es el flossing.",
      "Ritmo suave, 10 repeticiones.",
      "Version supino: similar pero con el talon en el suelo y deslizando la pierna."
    ],
    errores: [
      "Movimiento demasiado brusco: el flossing neural debe ser suave.",
      "Trabajar con dolor intenso: una ligera tension es normal, el dolor agudo indica exceso.",
      "Hacer solo extension (tension): el flossing requiere alternar tension y liberacion."
    ],
    variantes: [
      "F2 inicio (con irradiacion activa): solo version supina suave, rango minimo.",
      "F2 estandar: 2x10 cada lado, sentado.",
      "F3: con dorsiflexion de tobillo simultanea."
    ],
    notas_columna: "El nervio ciatico necesita 4 cm de deslizamiento longitudinal en su canal durante la marcha normal. Con la extrusion L5-S1 y la irradiacion S1 activa, ese deslizamiento esta comprometido. El flossing neural restaura progresivamente esa capacidad de deslizamiento, reduciendo el componente neural del dolor. Hacer siempre despues del bloque de pesas, nunca antes."
  },

  // ─── SQUAT ────────────────────────────────────────────────────
  "goblet-squat": {
    nombre: "Goblet squat con kettlebell",
    categoria: "Squat adaptado",
    color: "#3C3489",
    descripcion: "Sentadilla con peso delante del pecho. El contrapeso anterior mejora naturalmente la postura de la sentadilla (tronco erguido) y reduce la carga en la columna lumbar respecto a la sentadilla con barra.",
    posicion: "De pie, pies a anchura de hombros o ligeramente mas ancha. El kettlebell sostenido con ambas manos frente al pecho, codos apuntando hacia el suelo.",
    pasos: [
      "Sostén el kettlebell por el asa superior con ambas manos, pegado al pecho.",
      "Pies a anchura de hombros, puntas ligeramente hacia afuera (15-30 grados).",
      "Opcional en F2: talones ligeramente elevados (disco o calzado con tacon) para facilitar la profundidad sin flexion lumbar.",
      "Inspira, activa el core.",
      "Empuja las rodillas hacia afuera (en la direccion de los pies) y desciende.",
      "Espalda erguida: el kettlebell delante del pecho actua como contrapeso natural.",
      "Desciende hasta donde puedas con espalda neutra — en F2 rango parcial es aceptable.",
      "Empuja el suelo con los pies para subir. Exhala al subir."
    ],
    errores: [
      "La espalda se redondea al bajar: el contrapeso del kettlebell es insuficiente o el rango es excesivo.",
      "Las rodillas colapsan hacia adentro: activar el gluteo medio y empujar rodillas afuera.",
      "El talon se levanta: elevarlo con un disco o mejorar la movilidad de tobillo.",
      "Inclinacion excesiva del tronco hacia adelante: el kettlebell esta demasiado bajo."
    ],
    variantes: [
      "F2: 4x10, rango parcial, talones elevados si necesario.",
      "F2 avanzada: rango completo, talones en el suelo.",
      "F3: aumentar peso del kettlebell. Progresion a sentadilla goblet profunda."
    ],
    notas_columna: "El goblet squat es la sentadilla mas segura para L4-L5 porque el peso delante fuerza naturalmente un tronco mas erguido (menor momento de flexion lumbar) respecto a la sentadilla con barra en la espalda. Con extrusion bilateral activa: rango parcial (hasta paralela o ligeramente por encima) es suficiente y mas seguro. La elevacion de talones reduce la tension en los isquiotibiales, que frecuentemente limita la profundidad en pacientes con irradiacion ciatica."
  },

  "hack-squat": {
    nombre: "Hack squat en maquina",
    categoria: "Squat adaptado",
    color: "#3C3489",
    descripcion: "Sentadilla guiada en maquina con el peso en los hombros y el tronco inclinado hacia atras. Menor carga lumbar que la sentadilla libre porque la maquina absorbe las fuerzas de cizalla.",
    posicion: "En la maquina hack squat: hombros y espalda contra el respaldo inclinado. Pies en la plataforma a anchura de hombros.",
    pasos: [
      "Coloca los pies en la plataforma a anchura de hombros, ligeramente hacia afuera.",
      "Hombros contra los apoyos. Espalda completamente en contacto con el respaldo.",
      "Desbloquea la maquina.",
      "Desciende lentamente controlando el excentrico (3 segundos).",
      "Rango en F2: hasta que las rodillas queden a 90 grados o ligeramente menos.",
      "Empuja la plataforma hacia abajo y atras para subir — el gluteo debe sentirse activo.",
      "No bloquees las rodillas en la extension. Bloquea la maquina antes de salir."
    ],
    errores: [
      "La espalda se separa del respaldo al bajar: el rango es excesivo para tu flexibilidad actual.",
      "Los talones se levantan de la plataforma.",
      "Rodillas que colapsan hacia adentro.",
      "Bajar demasiado en F2: en la fase subaguda, el rango parcial es suficiente."
    ],
    variantes: [
      "F2: rango hasta 90 grados, 3x10, excentrico 3 seg.",
      "F2 avanzada: rango completo, mayor carga.",
      "F3: sentadilla libre con barra."
    ],
    notas_columna: "La maquina hack squat guia el movimiento eliminando las fuerzas de cizalla anteroposterior que son especialmente dañinas para los discos L4-L5 en la sentadilla libre. En F2, es preferible a la sentadilla libre porque permite cargar el patron sin los requisitos de estabilizacion lumbar que la sentadilla libre demanda. El rango parcial (hasta 90 grados) en F2 reduce adicionalmente el stress sobre L5-S1."
  },

  "prensa": {
    nombre: "Prensa inclinada 45 grados",
    categoria: "Squat adaptado",
    color: "#3C3489",
    descripcion: "Extension de piernas en maquina de prensa inclinada. Permite carga progresiva del tren inferior con la columna en posicion neutra y sin carga axial directa.",
    posicion: "Tumbado en la maquina de prensa a 45 grados. Espalda completamente apoyada en el respaldo. Pies en la plataforma a anchura de hombros.",
    pasos: [
      "Ajusta el asiento para que en la posicion baja las rodillas queden a 90 grados.",
      "Pies a anchura de hombros, ligeramente hacia afuera.",
      "Desbloquea la plataforma.",
      "Flexiona las rodillas lentamente — la zona lumbar debe mantenerse apoyada en el respaldo.",
      "Baja hasta 90 grados de flexion de rodilla en F2 (no mas).",
      "Empuja la plataforma con toda la planta del pie — no solo con los dedos.",
      "No bloquees las rodillas en la extension completa."
    ],
    errores: [
      "La zona lumbar se despega del respaldo al bajar: el rango es excesivo o el peso es demasiado.",
      "Solo empujar con los dedos del pie: activa el cuadriceps pero no el gluteo.",
      "Bajar mas de 90 grados en F2: aumenta la carga en la cadera y en L5-S1.",
      "Bloquear las rodillas arriba: carga articular innecesaria."
    ],
    variantes: [
      "F2: 3x10, rango 90 grados, carga moderada.",
      "F3: rango completo, mayor carga, variante unilateral."
    ],
    notas_columna: "La prensa es la alternativa mas segura a la sentadilla libre en F2 porque la posicion inclinada reduce la carga axial directa sobre la columna lumbar. El respaldo fijo elimina la necesidad de estabilizacion activa del tronco, que puede sobrecargar los discos en F2. Ideal como segundo o tercer ejercicio del bloque de squat despues del goblet."
  },

  // ─── ESPALDA BAJA ─────────────────────────────────────────────
  "superman": {
    nombre: "Superman hold en suelo",
    categoria: "Espalda baja",
    color: "#993C1D",
    descripcion: "Extension simultanea de brazos y piernas en decubito prono. Activa los extensores lumbares, el gluteo mayor y los musculos paravertebrales en posicion de extension.",
    posicion: "Tumbado boca abajo sobre una colchoneta. Brazos extendidos sobre la cabeza, piernas extendidas.",
    pasos: [
      "Posicion prona: frente mirando hacia el suelo, brazos extendidos.",
      "Activa el gluteo ANTES de levantar nada.",
      "Eleva simultaneamente los brazos y las piernas del suelo.",
      "La altura de elevation debe ser moderada — no fuerces la hiperlordosis.",
      "El cuello debe estar en posicion neutra: mira hacia el suelo, no hacia adelante.",
      "Mantén la posicion 2-3 segundos. Siente el trabajo en la zona lumbar y el gluteo.",
      "Baja lentamente."
    ],
    errores: [
      "Hiperlordosis cervical (mirar hacia adelante): tension en las vertebras cervicales.",
      "Elevar excesivamente las piernas: hiperlordosis lumbar exagerada.",
      "No activar el gluteo: los erectores lumbares hacen todo el trabajo.",
      "Hacer el movimiento demasiado rapido: pierde el control de la extension."
    ],
    variantes: [
      "F2: extension alterna (brazo derecho + pierna izquierda, como un bird dog prono).",
      "F2 estandar: bilateral, pausa 3 seg, 3x8.",
      "F3: Superman con banda en los tobillos."
    ],
    notas_columna: "El superman activa los extensores lumbares en la posicion de extension, que es el patron de fuerza que mas perdemos con el dolor lumbar cronico. En F2 es seguro porque la posicion prona reduce la presion en los discos anteriores. La activacion del gluteo antes de levantar las piernas es critica — si se omite, los erectores lumbares generan toda la fuerza de extension, sobrecargando L4-L5."
  },

  "bulgara": {
    nombre: "Sentadilla bulgara (split squat elevado)",
    categoria: "Squat / Pierna",
    color: "#3C3489",
    descripcion: "Sentadilla unilateral con pie trasero elevado en banco. Elimina practicamente toda la carga axial sobre la columna lumbar respecto a la sentadilla libre bilateral, mientras mantiene la activacion de cuadriceps y gluteo mayor. Es el ejercicio de squat mas seguro para F2 avanzada.",
    posicion: "De pie de espaldas al banco. Pie trasero apoyado sobre el banco (empeine o punta del pie). Pie delantero adelantado lo suficiente para que la rodilla no sobrepase la punta del pie al bajar. Tronco completamente erguido.",
    pasos: [
      "Activa el core antes de iniciar. Tronco erguido en todo momento — no inclinarse hacia adelante.",
      "Baja flexionando la rodilla delantera. La rodilla trasera desciende hacia el suelo sin tocarlo.",
      "Descenso controlado en 3 segundos. La rodilla delantera no sobrepasa la punta del pie.",
      "El peso recae sobre el talon del pie delantero — no sobre la punta.",
      "Sube empujando con el talon delantero. El motor es el gluteo y el cuadriceps de la pierna delantera.",
      "Pausa 1 segundo arriba. Repite sin perder la posicion del tronco.",
      "PARAR si aparece irradiacion S1 en cualquier fase del movimiento."
    ],
    errores: [
      "Inclinar el tronco hacia adelante: aumenta la carga lumbar y pierde la ventaja sobre la sentadilla libre.",
      "Rodilla delantera en valgo (hacia dentro): debilidad de gluteo medio.",
      "Pie delantero demasiado cerca del banco: obliga a inclinar el tronco.",
      "Bajar demasiado rapido: perder el control excentrico aumenta el riesgo."
    ],
    variantes: [
      "S1-2: no introducir — control lumbopelvico insuficiente aun.",
      "S3-4: peso corporal — ROM parcial (rodilla trasera a 20cm del suelo) — 3x8.",
      "S5-6: peso corporal — ROM completo — 3x10.",
      "S7+: mancuernas ligeras (5-8 kg c/u) — 3x10.",
      "F3: barra en espalda o mancuernas progresivas."
    ],
    notas_columna: "La bulgara es superior a la sentadilla libre para F2 porque la base unilateral reduce la carga axial lumbar en un 40-50% respecto a la sentadilla bilateral con la misma carga total. El tronco erguido es el marcador tecnico clave — si el tronco se inclina, el ejercicio pierde su ventaja y se convierte en un good morning con rodilla flexionada. Introducir en S3-4 solo si el glute bridge unilateral y la prensa unilateral son solidos."
  },

  "step-up-banco": {
    nombre: "Step up al banco",
    categoria: "Squat / Pierna",
    color: "#3C3489",
    descripcion: "Subida unilateral a un banco o escalon. Patron de extension de cadera y rodilla con impacto nulo y carga axial minima. Entrena la fuerza funcional de pierna en el patron de subir escaleras — directamente transferible a la vida diaria.",
    posicion: "De pie frente al banco. Altura del banco a nivel de rodilla aproximadamente (35-45 cm). Un pie completo sobre el banco — talon incluido.",
    pasos: [
      "Apoya el pie completo sobre el banco. El talon debe estar firme — no solo la punta.",
      "Empuja hacia abajo con el talon del pie elevado para subir. El motor es el gluteo y cuadriceps de la pierna de trabajo.",
      "La pierna que queda en el suelo solo ayuda si es necesario — el objetivo es que no ayude.",
      "Sube hasta extension completa de cadera y rodilla. Pausa 2 segundos arriba.",
      "Baja controlado en 3 segundos. La pierna de trabajo controla el descenso excentrico.",
      "No dejar caer el pie al suelo — controlar hasta el final."
    ],
    errores: [
      "Empujar con la pierna del suelo: convierte el ejercicio en un salto asistido.",
      "Inclinar el tronco hacia adelante al subir: carga lumbar innecesaria.",
      "Banco demasiado alto: obliga a compensar con el tronco.",
      "Bajar sin control excentrico: la fase excentrica es la mas valiosa."
    ],
    variantes: [
      "S1-2: escalon bajo 20 cm — peso corporal — 3x8.",
      "S3-4: banco 35-40 cm — peso corporal — 3x10.",
      "S5-6: banco 35-40 cm + pausa arriba 2s — 3x10.",
      "S7+: mancuernas ligeras (5-8 kg c/u) — 3x10.",
      "F3: mancuernas progresivas o chaleco lastrado."
    ],
    notas_columna: "El step up es el ejercicio de pierna con menor carga axial lumbar de todos los patrones de squat. La altura del banco regula directamente la demanda sobre la columna — a mayor altura, mayor demanda de flexion de cadera y menor compensacion lumbar. Ideal como segundo ejercicio del bloque D despues de la prensa, cuando los estabilizadores lumbares ya estan activos pero no fatigados."
  },

  "wall-sit": {
    nombre: "Wall sit isometrico",
    categoria: "Squat / Pierna",
    color: "#3C3489",
    descripcion: "Isometrico de cuadriceps con espalda apoyada en la pared. Carga axial absolutamente nula — la pared soporta el tronco completamente. Activa cuadriceps, gluteo y estabilizadores de rodilla sin ningun stress discal.",
    posicion: "De pie de espaldas a la pared. Deslizar la espalda hacia abajo hasta que las rodillas esten a 90 grados. Pies separados a anchura de caderas, plantados completamente en el suelo. Espalda completamente en contacto con la pared.",
    pasos: [
      "Espalda pegada a la pared en todo momento — no debe haber espacio lumbar.",
      "Rodillas a 90 grados o ligeramente por encima si hay molestia.",
      "Pies completamente apoyados — no de puntillas.",
      "Respiracion normal durante el isometrico — no contener la respiracion.",
      "Mantener la posicion el tiempo indicado.",
      "Para bajar: deslizar la espalda hacia arriba controlado."
    ],
    errores: [
      "Espalda separada de la pared: pierde la ventaja de carga axial nula.",
      "Pies demasiado cerca: aumenta el stress rotuliano.",
      "Rodillas en valgo: activar el gluteo medio para mantener la alineacion.",
      "Contener la respiracion: aumenta la presion intraabdominal innecesariamente."
    ],
    variantes: [
      "S1-2: angulo 100-110° — 3x20s.",
      "S3-4: 90° — 3x30s.",
      "S5-6: 90° — 3x45s.",
      "S7+: unilateral — una pierna — 3x20s.",
      "F3: unilateral con mancuerna en muslo — 3x25s."
    ],
    notas_columna: "El wall sit es el unico ejercicio de cuadriceps con carga axial absolutamente cero — la pared absorbe todo el peso del tronco. Es seguro desde S1-2 porque no existe mecanismo de compresion discal. Util como ejercicio de cierre del bloque de squat cuando la fatiga lumbar acumulada no permite mas ejercicios de pie."
  },

  "reverse-lunge": {
    nombre: "Reverse lunge (zancada atras)",
    categoria: "Squat / Pierna",
    color: "#3C3489",
    descripcion: "Zancada hacia atras. Genera menos carga lumbar que la zancada frontal porque el centro de gravedad permanece mas estable y el tronco no necesita inclinarse. Es el patron de lunge mas seguro para la columna lumbar en F2.",
    posicion: "De pie, pies juntos. Tronco completamente erguido. Manos en caderas o a los lados.",
    pasos: [
      "Da un paso largo hacia atras con una pierna. El pie trasero apoya solo en la punta.",
      "Baja la rodilla trasera hacia el suelo de forma controlada — no tocar el suelo.",
      "La rodilla delantera permanece alineada con el pie — no en valgo.",
      "El tronco permanece completamente erguido durante todo el movimiento.",
      "Empuja con el talon delantero para volver a la posicion inicial.",
      "Alterna piernas o completa todas las repeticiones de un lado antes de cambiar.",
      "PARAR si aparece irradiacion S1 durante el movimiento."
    ],
    errores: [
      "Inclinar el tronco hacia adelante: el error mas comun y el mas peligroso para la columna.",
      "Paso demasiado corto: obliga a inclinar el tronco para mantener el equilibrio.",
      "Rodilla delantera en valgo: debilidad de gluteo medio.",
      "Bajar demasiado rapido sin control excentrico."
    ],
    variantes: [
      "S1-2: no introducir.",
      "S3-4: peso corporal — paso corto — ROM parcial — 3x8 cada lado.",
      "S5-6: peso corporal — ROM completo — pausa abajo 2s — 3x10.",
      "S7+: mancuernas ligeras (4-6 kg c/u) — 3x10.",
      "F3: mancuernas progresivas o zancada con paso caminando."
    ],
    notas_columna: "La zancada atras es preferible a la frontal con extrusion discal activa porque el vector de fuerza es mas vertical y el tronco no necesita inclinarse hacia adelante para mantener el equilibrio. Introduce despues de que la bulgara y el step up esten consolidados — es un patron mas complejo de estabilizar."
  },

  "sentadilla-sumo-banda": {
    nombre: "Sentadilla sumo con banda elastica",
    categoria: "Squat / Pierna",
    color: "#3C3489",
    descripcion: "Sentadilla con pies muy abiertos y resistencia de banda elastica. La apertura de pies reduce la demanda de movilidad de cadera y activa preferentemente el gluteo medio, gluteo menor y aductores. La banda elimina la carga axial que tendria con barra.",
    posicion: "Pies a 1.5 veces la anchura de hombros. Puntas hacia fuera 45 grados. Banda bajo los pies, agarrada con ambas manos frente al cuerpo (goblet) o en los hombros. Tronco erguido.",
    pasos: [
      "Activa el core. Tronco completamente erguido.",
      "Empuja las rodillas hacia fuera — en la direccion de los pies — durante todo el movimiento.",
      "Baja de forma controlada en 3 segundos. Las rodillas siguen la linea de los pies.",
      "Baja hasta que los muslos esten paralelos al suelo o hasta donde la movilidad lo permita sin compensacion lumbar.",
      "Sube empujando el suelo hacia abajo. El gluteo es el motor.",
      "Mantener las rodillas hacia fuera tambien en la subida."
    ],
    errores: [
      "Rodillas cayendo hacia dentro (valgo): activar el gluteo medio.",
      "Inclinacion excesiva del tronco: talones elevados si hay limitacion de tobillo.",
      "No empujar las rodillas hacia fuera: pierde la activacion del gluteo medio.",
      "Demasiada profundidad con compensacion lumbar: el rango util termina donde la espalda se mantiene neutra."
    ],
    variantes: [
      "S1-2: banda ligera — ROM parcial — 3x10.",
      "S3-4: banda media — ROM completo — 3x12.",
      "S5-6: banda fuerte — 3x15.",
      "S7+: mancuerna goblet (10-14 kg) — 3x12.",
      "F3: mancuerna goblet progresiva o barra en sumo."
    ],
    notas_columna: "La postura sumo reduce la profundidad de flexion de cadera necesaria para alcanzar paralelo, lo que disminuye la tension en L5-S1 respecto a la sentadilla convencional. La banda como resistencia permite empezar el patron sin carga axial. Es ideal para trabajar el patron de squat mientras los criterios de goblet squat sin irradiacion aun no estan cumplidos."
  },

  "couch-stretch": {
    nombre: "Couch stretch",
    categoria: "Estiramiento / Movilidad",
    color: "#1E8A7A",
    descripcion: "Estiramiento profundo del psoas iliaco y el recto femoral con la rodilla trasera apoyada en el suelo junto a una pared. Es uno de los estiramientos mas efectivos para el psoas, cuya rigidez genera anteversion pelvica y aumenta directamente la presion sobre los discos L4-L5 y L5-S1.",
    posicion: "Rodilla trasera apoyada en el suelo junto a la pared (a 5-10 cm). El pie trasero apoyado verticalmente contra la pared. Pie delantero adelantado, rodilla a 90 grados. Tronco erguido.",
    pasos: [
      "Coloca la rodilla trasera en el suelo lo mas cerca posible de la pared.",
      "El pie trasero sube por la pared — cuanto mas cerca este la rodilla de la pared, mas intenso el estiramiento.",
      "Adelanta el pie delantero hasta que la rodilla este a 90 grados.",
      "Aprieta el gluteo de la pierna trasera — esto inclina la pelvis hacia atras y profundiza el estiramiento del psoas.",
      "Mantén el tronco erguido. No arquear la espalda lumbar.",
      "Respira lentamente. En cada exhalacion permite que la cadera baje un poco mas.",
      "PARAR si aparece irradiacion S1 — reducir la intensidad alejando la rodilla de la pared."
    ],
    errores: [
      "Arquear la espalda lumbar: el estiramiento se pierde y aumenta la compresion discal.",
      "No activar el gluteo: sin la retroversion pelvica el psoas no se estira en profundidad.",
      "Rodilla demasiado lejos de la pared al inicio: ir progresando la distancia semana a semana.",
      "Inclinarse hacia adelante: indica que la intensidad es excesiva — reducir."
    ],
    variantes: [
      "S1-2: tronco erguido, manos apoyadas en la rodilla delantera, rodilla a 10-15 cm de la pared.",
      "S3-4: tronco erguido, manos en caderas, rodilla a 5-8 cm de la pared.",
      "S5-6: tronco ligeramente inclinado hacia atras, rodilla pegada a la pared.",
      "S7+: tronco completamente vertical, pie en pared, gluteo activo maxima retroversion."
    ],
    notas_columna: "El psoas mayor tiene insercion directa en los cuerpos vertebrales de L1 a L5 y en los procesos transversos. Un psoas acortado — muy frecuente tras meses de reposo y posicion antalgica — genera anteversion pelvica que aumenta la lordosis lumbar y la presion posterior sobre los discos L4-L5 y L5-S1. El couch stretch es el estiramiento mas especifico para el psoas iliaco y debe hacerse antes de cualquier sesion de cadena posterior o squat para normalizar la posicion pelvica antes de cargar."
  },

  "cable-pancake": {
    nombre: "Cable pancake en suelo",
    categoria: "Estiramiento / Cadena posterior",
    color: "#3C3489",
    descripcion: "Estiramiento activo-pasivo en posicion de pancake (piernas abiertas en suelo) con cable o polea tirando del tronco hacia adelante. Combina el estiramiento de isquiotibiales, aductores y erectores lumbares en un unico patron de elongacion de cadena posterior completa. Sin carga axial.",
    posicion: "Sentado en el suelo frente a la polea baja. Piernas extendidas y abiertas en V. Cable a la altura del pecho sujeto con ambas manos. Espalda erguida antes de iniciar la inclinacion.",
    pasos: [
      "Siéntate en el suelo con las piernas abiertas en V. Encuentra el angulo de apertura donde los isquiotibiales no esten en tension maxima — ese es el punto de partida.",
      "Agarra el cable con ambas manos a la altura del pecho. El cable debe tener tension suave.",
      "Inclina el tronco hacia adelante dejando que el cable tire — no forzar activamente.",
      "La inclinacion debe venir de la bisagra de cadera (pelvis inclinandose hacia adelante), no de redondear la espalda.",
      "Llega al punto donde sientas estiramiento en isquiotibiales y aductores. Mantén 30-45 segundos.",
      "Variante asimetrica: inclinar ligeramente hacia el lado izquierdo para cargar preferentemente la raiz S1 izquierda — solo sin irradiacion activa.",
      "Salir del estiramiento activamente — no colapsar."
    ],
    errores: [
      "Redondear la espalda lumbar para alcanzar mas profundidad: contraproducente — el estiramiento se pierde en la espalda y no llega a los isquiotibiales.",
      "Apertura excesiva desde el inicio: la tension en aductores impide la inclinacion del tronco.",
      "Demasiado peso en el cable: convierte el estiramiento en un tirón brusco.",
      "Contener la respiracion: exhalar durante la inclinacion para relajar la cadena posterior."
    ],
    variantes: [
      "S1-2: apertura minima 30-40°, tronco erguido sin inclinacion, cable como punto de apoyo.",
      "S3-4: apertura 45°, inclinacion suave del tronco hacia el cable.",
      "S5-6: apertura 60°, mayor inclinacion, mantener espalda neutra.",
      "S7+: apertura maxima comoda + variante asimetrica hacia lado izquierdo para L5-S1."
    ],
    notas_columna: "S1-2 (apertura 30-40°, tronco erguido): el cable como punto de apoyo sin inclinacion — entrena la conciencia de la bisagra de cadera sin estiramiento intenso. El objetivo es aprender a separar la inclinacion de la cadera del redondeo lumbar. S3-4 (apertura 45°, inclinacion suave): la traccion del cable genera descompresion pasiva suave sobre L4-L5 y L5-S1 al inclinar el tronco hacia adelante — efecto descompresivo directo sobre los discos extruidos. S5-6 (apertura 60°, mayor inclinacion): la elongacion simultanea de isquiotibiales, aductores y cadena posterior izquierda trabaja la restriccion de movilidad que contribuye a la carga asimetrica sobre L5-S1 izq. S7+ (variante asimetrica izquierda): la inclinacion hacia el lado izquierdo elongan selectivamente la cadena posterior izquierda — puede reducir la tension mecanica sobre la raiz S1 izquierda. Solo en ausencia de irradiacion activa."
  },

  "leg-raise-polea": {
    nombre: "Leg raise en polea baja",
    categoria: "Core avanzado",
    color: "#993C1D",
    descripcion: "Flexion de cadera bilateral en decubito supino con resistencia horizontal de polea baja en tobillos. La traccion horizontal desplaza el pico de carga al rango medio-alto, eliminando el momento de extension lumbar critico que hace peligroso el leg raise libre en fases tempranas.",
    posicion: "Tumbado boca arriba en el suelo frente a la polea baja. Pies orientados hacia la polea, cable en tobillos con tobilleras. Brazos a los lados o sujetando un soporte fijo detras de la cabeza para ancla. Zona lumbar activamente pegada al suelo.",
    pasos: [
      "Antes de iniciar: imprime la lumbar contra el suelo y mantenla ahi durante todo el ejercicio.",
      "Con rodillas semiflexionadas (S5-6) o piernas mas extendidas (S7+), eleva las piernas tirando del cable hacia ti.",
      "El movimiento es de flexion de cadera — las piernas suben hacia el techo mientras el cable resiste.",
      "Sube hasta 70-80 grados de flexion de cadera (no es necesario llegar a la vertical).",
      "Desciende controlado en 2-3 segundos. El cable frena la bajada.",
      "CRITICO: si en cualquier repeticion la lumbar se despega del suelo, el ejercicio termina. Reducir peso o ROM.",
      "No usar momentum — cada repeticion comienza desde parado."
    ],
    errores: [
      "Lumbar despegada del suelo: el error mas peligroso. Terminar el set inmediatamente.",
      "Bajar las piernas demasiado: el brazo de palanca aumenta y la lumbar cede. Limitar el descenso a 30-40 grados.",
      "Usar demasiado peso demasiado pronto: impide mantener la lumbar neutra.",
      "Contencion de respiracion: exhalar en la subida, inhalar en la bajada."
    ],
    variantes: [
      "S1-4: no introducir — el control lumbopelvico no es suficiente aun.",
      "S5-6: rodillas semiflexionadas — peso minimo — 3x8 — ROM limitado (30 a 70 grados).",
      "S7+: piernas mas extendidas — 3x10 — aumentar peso progresivamente.",
      "F3: piernas rectas — rango completo — progresion natural hacia toes-to-bar."
    ],
    notas_columna: "La resistencia horizontal de la polea invierte el perfil de carga respecto al leg raise libre: en la posicion de mayor riesgo (piernas bajas) la traccion del cable es casi paralela al suelo y genera minima demanda de extension lumbar. El pico de esfuerzo se produce en el rango medio donde el control lumbopelvico es mas facil de mantener. Es la progresion logica entre el L-sit y el leg raise gravitacional completo, y puede introducirse en S5-6 siempre que el hollow body a 30 grados sea limpio y sin irradiacion."
  },

  "single-leg-reverse-hyper": {
    nombre: "Single leg reverse hyper",
    categoria: "Espalda baja / Gluteo",
    color: "#3C3489",
    descripcion: "Extension unilateral de cadera en decubito prono sobre un banco. El motor es el gluteo mayor y los isquiotibiales de la pierna de trabajo. Sin carga axial sobre la columna lumbar — la posicion horizontal elimina la compresion discal mientras activa la cadena posterior.",
    posicion: "Tumbado boca abajo sobre un banco firme o mesa. Las caderas al borde del banco. La pierna de trabajo cuelga libremente. La pierna de apoyo en el suelo o sobre el banco. Manos agarrando el banco para estabilizacion.",
    pasos: [
      "Activa el core antes de iniciar — transverso abdominis ligeramente contraido.",
      "Extiende la pierna de trabajo hacia atras y arriba hasta la horizontal (no sobrepasar la altura de la cadera).",
      "El motor del movimiento es el GLUTEO, no los erectores lumbares. La espalda no se mueve.",
      "Pausa 1 segundo en la posicion alta — aprieta el gluteo.",
      "Desciende controlado en 2-3 segundos.",
      "La pelvis permanece completamente horizontal durante todo el movimiento.",
      "PARAR inmediatamente si aparece irradiacion S1 durante la extension."
    ],
    errores: [
      "Hiperlordosis lumbar al subir la pierna: la columna compensa la falta de movilidad de cadera.",
      "Rotacion de pelvis: indica desequilibrio gluteo medio — reducir ROM.",
      "Subir la pierna por encima de la horizontal: aumenta la tension en L5-S1.",
      "Usar momentum en lugar de contraccion concentrica controlada."
    ],
    variantes: [
      "S1-2: sin peso — ROM parcial (45°) — 3x8 cada lado.",
      "S3-4: sin peso — ROM completo hasta horizontal — 3x10 cada lado.",
      "S5-6: tobillera ligera 1-2 kg — 3x12 cada lado.",
      "S7+: tobillera 3-4 kg — 3x12 exc 2s cada lado.",
      "F3: banda elastica en tobillo desde polea baja — mayor resistencia en rango final."
    ],
    notas_columna: "El reverse hyper unilateral es uno de los pocos ejercicios que activa el gluteo mayor de forma concentrica sin ninguna carga axial sobre los discos L4-L5 y L5-S1. La version unilateral es preferible a la bilateral porque permite detectar asimetrias de activacion (frecuentes con extrusion izquierda L5-S1) y evita la hiperlordosis compensatoria que aparece en la version bilateral. Es el ejercicio de cadena posterior mas seguro para F2 junto con el glute bridge y el RDL con mancuernas."
  },

  "hiperextension": {
    nombre: "Hiperextension en banco 45 grados",
    categoria: "Espalda baja",
    color: "#993C1D",
    descripcion: "Extension de tronco en banco inclinado a 45 grados. Trabaja los extensores lumbares, el gluteo y los isquiotibiales en cadena cinetica cerrada.",
    posicion: "En el banco de hiperextension a 45 grados. Las caderas apoyadas en el soporte, pies anclados en los apoyos.",
    pasos: [
      "Posicion en el banco: el soporte debe quedar en la parte alta del muslo / bajo del gluteo, NO en la zona lumbar.",
      "Brazos cruzados en el pecho o detras de la cabeza.",
      "Desde la posicion baja (tronco caido hacia abajo): activa el gluteo.",
      "Sube el tronco hasta la posicion horizontal (paralela al suelo) — NO mas arriba en F2.",
      "Mantén 1 segundo en la posicion horizontal.",
      "Baja lentamente.",
      "El rango en F2 es de la posicion baja hasta horizontal — NO entrar en hiperlordosis."
    ],
    errores: [
      "Subir mas alla de la posicion horizontal (hiperlordosis): compresion posterior de L4-L5.",
      "El soporte en la zona lumbar en lugar de los muslos: actua como fulcro sobre los discos.",
      "Velocidad excesiva: perder el control de la posicion.",
      "Manos detras de la nuca con traccion del cuello."
    ],
    variantes: [
      "F2: sin peso, rango hasta horizontal, 3x10.",
      "F2 avanzada: con mancuerna cruzada al pecho, rango hasta horizontal.",
      "F3: mayor rango, con peso adicional."
    ],
    notas_columna: "S1-2: isometrico en posicion neutra — los extensores se activan sin movimiento, sin compression posterior. Es el unico modo seguro con irradiacion activa S1. S3-4: rango parcial hasta horizontal — permite carga excentrica progresiva sobre gluteo e isquiotibiales sin sobrepasar el umbral de compression L4-L5. S5-6 en adelante: rango completo con peso adicional — el marcador clave es que la posicion alta mantenga la columna neutra sin hiperlordosis. El soporte debe quedar en los muslos, NO en la cintura — si queda en la zona lumbar actua como palanca compresiva sobre los discos extruidos."
  },

  // ─── MOVILIDAD TORACICA ───────────────────────────────────────
  "cat-cow-toracico": {
    nombre: "Cat-cow toracico (segmento T)",
    categoria: "Movilidad toracica",
    color: "#3C3489",
    descripcion: "Version adaptada del cat-cow clasico, limitada exclusivamente al segmento toracico. Mejora la movilidad de la columna toracica sin cargar los discos lumbares.",
    posicion: "A cuatro patas: rodillas bajo caderas, manos bajo hombros. Columna en posicion neutra.",
    pasos: [
      "Posicion cuadrupeda con columna neutra.",
      "Para el CAT toracico: lleva solo el segmento toracico (entre T1 y T12) hacia arriba. La zona lumbar permanece NEUTRA.",
      "Para el COW toracico: extiende solo el segmento toracico hacia abajo. La zona lumbar permanece NEUTRA.",
      "El truco para aislar: imagina que solo el pecho se mueve, no la cadera ni la cabeza.",
      "Moverse lentamente — 3 segundos en cada posicion.",
      "Si no consigues aislar: usa una toalla enrollada en la zona lumbar como referencia tactil."
    ],
    errores: [
      "Llevar el movimiento a la zona lumbar: es el cat-cow convencional, no la version toracica adaptada.",
      "Solo mover la cabeza y el cuello: el segmento toracico debe ser el protagonista.",
      "Velocidad excesiva: el aislamiento toracico requiere movimiento lento y consciente."
    ],
    variantes: [
      "F2: 2x10 ciclos, solo toracico.",
      "F3: cat-cow completo (lumbar incluida) cuando los discos esten estables."
    ],
    notas_columna: "Con extrusion lumbar activa, el cat-cow convencional (que incluye la flexion y extension lumbar) esta contraindicado temporalmente porque carga los discos L4-L5 y L5-S1 en ambos extremos del rango. La version toracica exclusiva permite mejorar la movilidad de la columna superior sin ninguna carga lumbar. La hipercifosis toracica aumenta la compensacion lumbar — mejorarla reduce indirectamente la carga en L4-S1."
  },

  "rotacion-toracica": {
    nombre: "Rotacion toracica en suelo",
    categoria: "Movilidad toracica",
    color: "#3C3489",
    descripcion: "Estiramiento de rotacion de la columna toracica en decubito lateral. Mejora la movilidad de rotacion toracica que frecuentemente se pierde con el dolor lumbar.",
    posicion: "Tumbado de lado con caderas y rodillas en angulo de 90 grados (piernas apiladas). Ambos brazos extendidos hacia adelante, palmas juntas.",
    pasos: [
      "Posicion lateral: caderas y rodillas en 90 grados, piernas apiladas. Las rodillas no deben moverse.",
      "Brazos extendidos al frente, palmas juntas.",
      "Lleva el brazo superior en un arco hacia el lado contrario, siguiendo el movimiento con la mirada.",
      "El hombro debe tocar el suelo (o intentarlo). Las rodillas NO se mueven.",
      "Mantén 2-3 segundos respirando. En la exhalacion el pecho se abre un poco mas.",
      "Vuelve lentamente al punto de partida.",
      "Repite del otro lado."
    ],
    errores: [
      "Las rodillas se mueven o se separan: la columna lumbar esta rotando en lugar de la toracica.",
      "El brazo va demasiado rapido: pierde el control de la rotacion segmentaria.",
      "No mirar el brazo con la mirada: la rotacion cervical acompaña a la toracica."
    ],
    variantes: [
      "F2: rango segun tolerancia, 2x8 cada lado.",
      "F3: con mayor velocidad, integrando el patron en movimiento complejo."
    ],
    notas_columna: "La restriccion de rotacion toracica es uno de los hallazgos mas constantes en pacientes con dolor lumbar cronico. Cuando la toracica no rota, la lumbar compensa la rotacion — especialmente perjudicial con discos comprometidos. Este ejercicio debe hacerse siempre despues del calentamiento y nunca con frio."
  },

  "extension-toracica-foam": {
    nombre: "Extension toracica en foam roller",
    categoria: "Movilidad toracica",
    color: "#3C3489",
    descripcion: "Movilizacion de la columna toracica sobre un foam roller. Mejora la extension toracica (frecuentemente restringida en hipercifosis) sin afectar a la columna lumbar.",
    posicion: "Tumbado boca arriba con el foam roller perpendicular a la columna, a nivel toracico (T4-T10).",
    pasos: [
      "Coloca el foam roller a nivel de la zona media de la espalda (entre los omoplatos y la cintura).",
      "Manos detras de la cabeza para apoyar el cuello.",
      "Deja que la gravedad extienda la columna sobre el foam roller.",
      "Rueda LENTAMENTE hacia arriba y hacia abajo — solo en la zona toracica.",
      "Para en las zonas donde sientas mas restriccion. Respira profundo.",
      "En la exhalacion, el pecho cae ligeramente mas hacia el suelo.",
      "El limite superior es T4 (entre los omoplatos). El limite inferior es T12 (fin de las costillas).",
      "NUNCA rodar sobre la zona lumbar."
    ],
    errores: [
      "Rodar sobre la zona lumbar: compresion directa de L4-L5. PROHIBIDO.",
      "Velocidad excesiva: pierde el efecto de movilizacion.",
      "Tension en el cuello: las manos deben sostener la cabeza.",
      "Aguantar la respiracion."
    ],
    variantes: [
      "F2: 2-3 minutos, rodando suave en T4-T10.",
      "F3: con brazos extendidos sobre la cabeza para mayor extension."
    ],
    notas_columna: "La extension toracica es el movimiento mas perdido en pacientes con dolor lumbar y trabajo sedentario. La hipercifosis toracica desplaza el centro de gravedad hacia adelante, aumentando la carga compresiva en L4-L5. El foam roller es la herramienta mas eficiente para recuperar la extension toracica. NUNCA usarlo en la zona lumbar — actuaria como palanca sobre los discos extruidos."
  },

  // ─── YOGA Y PILATES ───────────────────────────────────────────
  "child-pose": {
    nombre: "Child pose con soporte (Balasana)",
    categoria: "Yoga restaurativo",
    color: "#3B6D11",
    descripcion: "Posicion de descanso y elongacion de la columna. Descomprime la zona lumbar mediante flexion completa y elongacion de la cadena posterior.",
    posicion: "Arrodillado en el suelo con los gluteos sobre los talones. Tronco inclinado hacia adelante, frente en el suelo o en un bloque.",
    pasos: [
      "Arrodillate con los pies juntos (o separados si los gluteos no llegan a los talones).",
      "Inclinante hacia adelante bajando el tronco sobre los muslos.",
      "Brazos extendidos hacia adelante o a los lados del cuerpo.",
      "La frente apoyada en el suelo o en un bloque de yoga.",
      "Respira profundo — en cada inhala la espalda se expande, en la exhala el tronco cae un poco mas.",
      "Mantén 2-3 minutos. Completamente pasivo."
    ],
    errores: [
      "Tension en los hombros: dejar que los brazos y la cabeza caigan por gravedad.",
      "Gluteos muy separados de los talones: usar un bloque o mantas bajo el gluteo.",
      "Respiracion superficial: la respiracion profunda es la herramienta principal."
    ],
    variantes: [
      "Con thread the needle: desde child pose, desliza un brazo bajo el cuerpo para rotar la toracica.",
      "Con bloque bajo la frente para mayor comodidad.",
      "Con mantas bajo las rodillas si hay molestia."
    ],
    notas_columna: "El child pose en flexion no es recomendable durante la reagudizacion aguda (la flexion carga el disco anterior). En fase subaguda es util para la descompresion de los elementos posteriores y el alivio del espasmo de los multifidos. Si produce irradiacion durante el mantenimiento: salir de la posicion y documentar."
  },

  "legs-up-wall": {
    nombre: "Legs up the wall (Viparita Karani)",
    categoria: "Yoga restaurativo",
    color: "#3B6D11",
    descripcion: "Posicion invertida suave con las piernas apoyadas en la pared. Descomprime la columna lumbar, reduce el edema en las extremidades inferiores y activa el sistema nervioso parasimpatico.",
    posicion: "Tumbado boca arriba, gluteos lo mas cerca posible de la pared, piernas extendidas hacia arriba apoyadas en la pared.",
    pasos: [
      "Siéntate lateral a la pared con un lado del cuerpo pegado a ella.",
      "Gira y tumba las piernas hacia arriba mientras te tumbas boca arriba.",
      "Los gluteos deben estar lo mas cerca posible de la pared (o en contacto).",
      "Piernas extendidas hacia arriba, apoyadas en la pared. Pies relajados.",
      "Brazos a los lados, palmas hacia arriba. Ojos cerrados.",
      "Respiracion diafragmatica suave.",
      "Mantén 5-10 minutos. No hay limite superior de tiempo."
    ],
    errores: [
      "Gluteos muy separados de la pared: la curva lumbar no se elimina completamente.",
      "Piernas tensas: dejar que los isquiotibiales se estiren pasivamente.",
      "Salir bruscamente: rodar hacia un lado antes de incorporarse."
    ],
    variantes: [
      "Con manta bajo el sacro para mayor apoyo.",
      "Con piernas en mariposa (pies juntos, rodillas abiertas) para estiramiento de aductores.",
      "En la oscuridad con respiracion consciente como practica de relajacion profunda."
    ],
    notas_columna: "Esta posicion reduce la lordosis lumbar y descarga completamente la columna. La inversion parcial facilita el retorno venoso de las piernas, reduciendo el edema que frecuentemente acompaña al dolor neuropatico ciatico. Con la raiz S1 irritada, la reduccion del edema neural es beneficiosa. Recomendada especialmente en dias con irradiacion activa."
  },

  "pelvic-clock": {
    nombre: "Pelvic clock (reloj pelvico)",
    categoria: "Pilates",
    color: "#3C3489",
    descripcion: "Ejercicio de control segmentario lumbar. Mueve la pelvis en todas las direcciones identificando y corrigiendo asimetrias de movilidad lumbopelvica.",
    posicion: "Tumbado boca arriba. Rodillas flexionadas a 90 grados, pies apoyados en el suelo.",
    pasos: [
      "Imagina que hay un reloj sobre tu abdomen: el 12 en el ombligo, el 6 en el pubis.",
      "Mueve la pelvis hacia el 12 (retroversion pelvica): la zona lumbar se aplana contra el suelo.",
      "Mueve hacia el 6 (anteversion): la zona lumbar se arquea ligeramente.",
      "Mueve hacia el 3 y el 9 (inclinacion lateral).",
      "Luego conecta todos los puntos en un circulo fluido.",
      "El movimiento debe ser suave y continuo — solo se mueve la pelvis, no el tronco.",
      "2x8 circulos en cada direccion."
    ],
    errores: [
      "El tronco se mueve: solo la pelvis debe ser movil.",
      "Movimientos bruscos: el reloj pelvico es control motor, no estiramiento.",
      "Aguantar la respiracion."
    ],
    variantes: [
      "F2: solo el movimiento 12-6 (retroversion-anteversion).",
      "F2 estandar: circulo completo.",
      "F3: de pie o sentado en fitball."
    ],
    notas_columna: "El reloj pelvico es el primer ejercicio del protocolo de Pilates porque establece la conciencia de la posicion neutra de la pelvis — la base de todos los demas ejercicios. Con extrusion lumbar, la posicion de retroversion (12 en el reloj) es la mas segura para los discos. La capacidad de encontrar y mantener la posicion neutra es fundamental para la vida diaria."
  },

  "hundred-modificado": {
    nombre: "Hundred modificado (piernas en mesa)",
    categoria: "Pilates",
    color: "#3C3489",
    descripcion: "Ejercicio clasico de Pilates adaptado para proteger la columna lumbar. Entrena la resistencia del core con las piernas en posicion de mesa (sin extension).",
    posicion: "Tumbado boca arriba. Caderas y rodillas a 90 grados (posicion de mesa). Brazos a los lados.",
    pasos: [
      "Desde posicion supina: lleva las piernas a posicion de mesa (90/90).",
      "Activa el core: lumbar pegada al suelo.",
      "Levanta la cabeza y los hombros del suelo (flexion toracica alta, no cervical).",
      "Extiende los brazos paralelos al suelo a los lados.",
      "Pulsa los brazos arriba y abajo en movimientos pequenos (10 cm) — 5 pulsos en la inhala, 5 en la exhala.",
      "100 pulsos en total = 10 ciclos respiratorios.",
      "La zona lumbar debe mantenerse pegada al suelo en TODO momento."
    ],
    errores: [
      "La lumbar se despega del suelo: las piernas deben subir mas (reducir el brazo de palanca).",
      "Tension en el cuello: mirar hacia las rodillas, no hacia el techo.",
      "Respiracion incorrecta: 5 pulsos en la inhala, 5 en la exhala.",
      "Piernas extendidas (version completa): contraindicada en F2."
    ],
    variantes: [
      "F2: piernas en mesa 90/90 siempre.",
      "F2 avanzada: piernas en mesa con ligera inclinacion (80 grados).",
      "F3: piernas extendidas a 45 grados si la lumbar no se despega."
    ],
    notas_columna: "La version completa del Hundred con piernas extendidas a 45 grados genera un momento de flexion lumbar significativo. Con extrusion L4-L5 y L5-S1, esta contraindicada hasta F3. La version modificada con piernas en mesa es completamente segura y trabaja el mismo patron respiratorio y de core."
  },

  // ─── DESCANSO NEURAL ────────────────────────────────────────
  "respiracion-diafragmatica": {
    nombre: "Respiracion diafragmatica profunda",
    categoria: "Descanso neural",
    color: "#444441",
    descripcion: "Tecnica de respiracion abdominal que activa el sistema nervioso parasimpatico. Reduce el tono del sistema simpatico que mantiene el ciclo de tension-dolor-tension.",
    posicion: "Tumbado boca arriba o sentado comodamente. Una mano en el pecho, otra en el abdomen.",
    pasos: [
      "Posicion comoda. Una mano en el pecho, otra en el abdomen.",
      "Inhala por la nariz durante 4 segundos: el abdomen (mano baja) debe subir. El pecho (mano alta) debe permanecer quieto.",
      "Mantén la respiracion 1-2 segundos.",
      "Exhala por la boca o nariz durante 6 segundos: el abdomen baja.",
      "La exhalacion mas larga que la inhalacion es la clave para activar el parasimpatico.",
      "10 ciclos = 1 minuto. Practica 5-10 minutos.",
      "Objetivo: que el pecho permanezca completamente quieto durante toda la respiracion."
    ],
    errores: [
      "El pecho sube en la inhala: respiracion toracica, no activa el diafragma.",
      "Ritmo demasiado rapido: no da tiempo a la respuesta parasimpatica.",
      "Tension en los hombros y cuello: parte de la respuesta simpatica que debes relajar."
    ],
    variantes: [
      "4-6-4: inhala 4 seg, mantén 6 seg, exhala 4 seg (para mayor activacion parasimpatica).",
      "Box breathing: 4-4-4-4 (inhala 4, mantén 4, exhala 4, pausa 4) para mayor control.",
      "Coherencia cardiaca: 5 seg inhala, 5 seg exhala (6 respiraciones/minuto)."
    ],
    notas_columna: "El dolor cronico y la irradiacion neural mantienen un nivel elevado de activacion del sistema nervioso simpatico, que a su vez aumenta la sensibilizacion central al dolor. La respiracion diafragmatica es la intervencion mas eficiente y rapida para interrumpir ese ciclo. 5 minutos de respiracion diafragmatica reduce los marcadores de estres oxidativo y el umbral de dolor de forma medible."
  },

  "supine-twist": {
    nombre: "Supine twist suave",
    categoria: "Yoga restaurativo",
    color: "#3B6D11",
    descripcion: "Rotacion suave de la columna toracica en decubito supino. Estira los rotadores toracicos y el cuadrado lumbar de forma pasiva.",
    posicion: "Tumbado boca arriba. Rodillas juntas, flexionadas a 90 grados.",
    pasos: [
      "Tumbado boca arriba, rodillas juntas y flexionadas.",
      "Extiende los brazos en T (a 90 grados del tronco).",
      "Deja caer ambas rodillas hacia un lado lentamente — sin forzar.",
      "Los hombros deben permanecer en contacto con el suelo.",
      "Mira hacia el lado contrario de las rodillas.",
      "Respira profundo. En la exhala, las rodillas pueden caer un poco mas.",
      "Mantén 1 minuto cada lado."
    ],
    errores: [
      "Los hombros se levantan del suelo: reducir el rango de la rotacion.",
      "Forzar las rodillas hacia el suelo: debe ser completamente pasivo.",
      "Tension en el cuello."
    ],
    variantes: [
      "F2: con una almohada bajo las rodillas para reducir el rango.",
      "F3: con la pierna superior extendida para mayor intensidad."
    ],
    notas_columna: "El supine twist debe ser pasivo — la gravedad hace el trabajo. Con extrusion lumbar activa, asegurarse de que las rodillas no caen completamente al suelo si eso produce irradiacion. El rango debe ser el que permita la rotacion toracica sin dolor lumbar. Si produce irradiacion izquierda al girar hacia la izquierda: evitar ese lado temporalmente."
  },

  "reclined-butterfly": {
    nombre: "Reclined butterfly (Supta Baddha Konasana)",
    categoria: "Yoga restaurativo",
    color: "#3B6D11",
    descripcion: "Posicion de yoga restaurativo que estira los aductores y el suelo pelvico mientras activa el sistema parasimpatico.",
    posicion: "Tumbado boca arriba. Plantas de los pies juntas, rodillas caidas hacia los lados.",
    pasos: [
      "Tumbado boca arriba: junta las plantas de los pies y deja caer las rodillas hacia los lados.",
      "Ajusta la distancia de los pies al cuerpo: mas cerca = mas intensidad.",
      "Brazos a los lados con las palmas hacia arriba.",
      "Cierra los ojos. Respiracion diafragmatica.",
      "La gravedad abre gradualmente las caderas — completamente pasivo.",
      "Mantén 3-5 minutos.",
      "Para salir: lleva las rodillas al centro con las manos antes de levantarte."
    ],
    errores: [
      "Forzar las rodillas hacia el suelo: debe ser completamente pasivo.",
      "Tension en los hombros.",
      "Levantarse bruscamente: puede provocar mareo."
    ],
    variantes: [
      "Con mantas bajo las rodillas para menor intensidad.",
      "Con bloque bajo el sacro para elevacion leve.",
      "Con manta enrollada bajo la columna para apertura toracica simultanea."
    ],
    notas_columna: "El estiramiento de los aductores y el suelo pelvico en esta posicion complementa el trabajo de los rotadores externos de cadera del clamshell. Especialmente util en los dias de descanso neural como cierre de la sesion de yoga."
  },

  "dead-hang": {
    nombre: "Dead hang en barra (calistenia)",
    categoria: "Calistenia",
    color: "#3C3489",
    descripcion: "Suspension pasiva del peso corporal en barra de dominadas. Combina la traccion lumbar del dead hang de descompresion con la activacion de la fuerza de agarre y la estabilizacion escapular.",
    posicion: "Agarre a la barra, brazos extendidos, pies despegados del suelo.",
    pasos: [
      "Agarra la barra con agarre prono (palmas hacia adelante), anchura de hombros.",
      "Deja que el peso corporal cuelgue completamente.",
      "Activa los hombros: escapulas hacia abajo, no encogidas. Este es el unico punto de activacion.",
      "El tronco, las caderas y las piernas completamente relajados.",
      "Respira con normalidad. Mantén 40-50 segundos.",
      "Progresivamente ir aumentando el tiempo cada semana."
    ],
    errores: [
      "Hombros encogidos (shrug): riesgo de impingement de hombro.",
      "Tension en el tronco: pierde el efecto de descompresion.",
      "Soltar bruscamente."
    ],
    variantes: [
      "F2: dead hang pasivo 4x40 seg.",
      "F2 avanzada: dead hang activo con retraccion escapular.",
      "F3: dead hang con flexion de rodillas (mas traccion L5-S1), progresar a chin-up."
    ],
    notas_columna: "El dead hang en el contexto de la calistenia del sabado tiene doble funcion: descompresion lumbar (igual que en los bloques A) y trabajo de fuerza de agarre y escapula. La fuerza de agarre es un marcador indirecto de la salud del sistema nervioso — en pacientes con neuropatia S1 frecuentemente esta reducida en el lado afectado. Documentar en el tracker si hay diferencia de fuerza de agarre entre manos."
  },

  "remo-trx": {
    nombre: "Remo en anillas o TRX",
    categoria: "Calistenia",
    color: "#3C3489",
    descripcion: "Remo horizontal con suspension de anillas o TRX usando el peso corporal. Permite ajustar la intensidad mediante el angulo del cuerpo. Trabaja toda la cadena posterior.",
    posicion: "Tumbado bajo las anillas o TRX, agarre neutro. El cuerpo en posicion inclinada (45-60 grados respecto al suelo en F2).",
    pasos: [
      "Ajusta la altura de las anillas/TRX para el angulo deseado (F2: 45-60 grados).",
      "Agarra las anillas con agarre neutro, palmas enfrentadas.",
      "Cuerpo en posicion inclinada: linea recta de cabeza a talones.",
      "Activa las escapulas (retraccion).",
      "Tira del cuerpo hacia las anillas, codos pegados al cuerpo.",
      "En el punto alto: pecho a las manos, escapulas completamente retraidas.",
      "Baja lentamente — excentrico 3 segundos."
    ],
    errores: [
      "Las caderas caen (sagging): core no activo.",
      "Los codos se separan del cuerpo.",
      "Angulo demasiado horizontal para F2: aumenta la dificultad y el riesgo de compensacion."
    ],
    variantes: [
      "F2: angulo de 45-60 grados (mas vertical = mas facil).",
      "F3: angulo mas horizontal, progresar a dominadas."
    ],
    notas_columna: "El remo en TRX tiene la ventaja de ser completamente ajustable en dificultad. En F2, el angulo de 45-60 grados permite trabajar el patron de tiro horizontal con el peso corporal sin ningun impacto en la columna. Util los sabados cuando no hay acceso al gym."
  },

  "sentadilla-sumo": {
    nombre: "Sentadilla sumo bodyweight",
    categoria: "Calistenia",
    color: "#3C3489",
    descripcion: "Sentadilla con apertura de cadera amplia y pies girados hacia afuera. Trabaja el tren inferior con mayor activacion del gluteo y los aductores, menor demanda en los isquiotibiales.",
    posicion: "De pie, pies separados mas alla del ancho de hombros (1.5x), puntas de los pies a 45 grados.",
    pasos: [
      "Pies separados ampliamente, puntas a 45 grados hacia afuera.",
      "Manos juntas delante del pecho (goblet position) o brazos extendidos al frente.",
      "Inspira, activa el core.",
      "Empuja las rodillas hacia afuera (en la direccion de los pies) al descender.",
      "Desciende hasta paralela o ligeramente por debajo si la movilidad lo permite.",
      "El tronco permanece erguido. Las rodillas no deben colapsar hacia adentro.",
      "Sube empujando el suelo. Exhala al subir."
    ],
    errores: [
      "Las rodillas colapsan hacia adentro (valgo): activar gluteo medio y empujar las rodillas afuera.",
      "Inclinacion excesiva del tronco.",
      "Talones que se levantan: reducir el rango o elevar talones."
    ],
    variantes: [
      "F2: peso corporal, rango parcial.",
      "F3: con kettlebell (sumo goblet squat con mayor apertura)."
    ],
    notas_columna: "La sentadilla sumo tiene menor demanda en la flexibilidad de los isquiotibiales que la sentadilla convencional, siendo mas accesible con la irradiacion ciatica izquierda que frecuentemente genera tension en ese musculo. La apertura de cadera activa los rotadores externos y el gluteo medio de forma diferente a la sentadilla convencional."
  },

  // ─── LOTES DE VIDEOS — NUEVOS EJERCICIOS ────────────────────────────────

  "side-lying-decomp": {
    nombre: "Side-lying spinal decompression",
    categoria: "Descompresion / Movilidad lumbar",
    color: "#1A3A5C",
    descripcion: "Descompresion lateral pasiva tumbado sobre el lado no sinomatico. Crea apertura foraminal en el lado afectado mediante flexion lateral pasiva.",
    posicion: "Tumbado sobre el lado derecho (lado no sinomatico). Almohada gruesa o toalla enrollada bajo la cintura/flanco lumbar.",
    pasos: [
      "Tumbarse sobre el lado no sinomatico (derecho).",
      "Colocar almohada gruesa o toalla firmemente enrollada justo bajo la cintura.",
      "Dejar caer la cadera y las costillas hacia el colchon abrazando la curva.",
      "Relajarse por completo. Respiracion diafragmatica.",
      "Mantener 2-3 minutos."
    ],
    errores: [
      "Tumbarse sobre el lado sinomatico: cierra el foramen en lugar de abrirlo.",
      "Almohada demasiado pequena: no genera la apertura lateral necesaria.",
      "Tension muscular activa: debe ser completamente pasivo."
    ],
    variantes: [
      "Duracion progresiva: 2 min → 3 min.",
      "Anadir respiracion diafragmatica consciente sincronizada con la apertura lateral."
    ],
    notas_columna: "La flexion lateral pasiva sobre el lado derecho abre fisicamente los neuroforamenes del lado izquierdo (L5-S1 izquierda). Posicion de referencia para recuperacion en dias de mayor sensibilidad. Complementa la posicion de Viparita Karani como herramienta de descompresion pasiva."
  },

  "towel-cobra": {
    nombre: "Towel cobra extension",
    categoria: "Descompresion / Movilidad lumbar",
    color: "#1A3A5C",
    descripcion: "Extension en cobra asistida con toalla como fulcro mecanico. Localiza la extension en el segmento L4-S1 sin extension lumbar global descontrolada.",
    posicion: "Tumbado boca abajo en el suelo. Toalla larga horizontal en la zona L4-S1.",
    pasos: [
      "Tumbarse boca abajo.",
      "Pasar una toalla larga de forma horizontal por la espalda baja a nivel L4-S1.",
      "Sujetar los extremos con las manos firmemente contra el suelo.",
      "Empujar el torso hacia arriba en extension (postura de cobra) mientras la toalla fija el segmento inferior.",
      "Mantener la toalla con tension constante durante toda la extension.",
      "Extension progresiva: empezar con angulo minimo."
    ],
    errores: [
      "Toalla sobre proceso espinoso directamente: reposicionar en tejido blando lateral.",
      "Extension brusca sin control.",
      "Soltar la tension de la toalla durante el movimiento."
    ],
    variantes: [
      "Extension minima mantenida 20s.",
      "Extension media mantenida 15s.",
      "Extension progresiva con control respiratorio."
    ],
    notas_columna: "La toalla actua como fulcro que localiza la extension en el segmento deseado. Util como puente entre descompresion pasiva y extension activa. Vigilar que la toalla no genere presion directa sobre proceso espinoso."
  },

  "cat-cow-segmentado": {
    nombre: "Segmental spinal cat-cow",
    categoria: "Control motor / Movilidad",
    color: "#2A3A1A",
    descripcion: "Cat-cow ejecutado vertebra a vertebra de forma deliberada. Restaura el control motor independiente de cada segmento vertebral.",
    posicion: "Cuadrupedia. Munecas bajo hombros, rodillas bajo caderas.",
    pasos: [
      "Cuadrupedia con columna neutra.",
      "Iniciar el movimiento exclusivamente desde el coccis: meterlo hacia adentro lentamente.",
      "Sentir como se curva progresivamente: zona lumbar → espalda media → espalda alta → cabeza cae.",
      "Para revertir: iniciar de nuevo desde el coccis hacia la cabeza — no desde arriba.",
      "Cada segmento debe moverse de forma independiente.",
      "Velocidad muy lenta: 8-10 segundos por ciclo completo."
    ],
    errores: [
      "Mover toda la espalda de golpe: pierde el efecto segmentario.",
      "Iniciar el movimiento desde la cabeza en lugar del coccis.",
      "Velocidad rapida: elimina la conciencia segmentaria."
    ],
    variantes: [
      "Lento con atencion plena por segmentos.",
      "Velocidad ligeramente mayor manteniendo segmentacion.",
      "Pausa 2s en cada posicion extrema."
    ],
    notas_columna: "Diferencia clave con el cat-cow estandar: este es deliberadamente mas lento y segmentado. El dolor cronico congela la espalda baja en un bloque rigido — este ejercicio devuelve la movilidad articular segmentaria. Pueden coexistir en la misma sesion: el cat-cow estandar como calentamiento, el segmentado como trabajo neuromuscular."
  },

  "cossack-shifts": {
    nombre: "Deep Cossack shifts",
    categoria: "Movilidad de cadera",
    color: "#2A1A3A",
    descripcion: "Transiciones profundas laterales en posicion de sumo amplio. Moviliza aductores e ingle en rangos maximos de flexion de cadera sin carga lumbar.",
    posicion: "Pies muy separados (posicion sumo amplia). Puntas ligeramente hacia afuera.",
    pasos: [
      "Postura de piernas muy abiertas.",
      "Bajar la cadera hacia un lado flexionando completamente una rodilla.",
      "La otra pierna queda 100% estirada con el pie apuntando al techo.",
      "Para pasar al otro lado: arrastrar la cadera pegada al suelo — no ponerse de pie.",
      "El centro de gravedad permanece bajo durante toda la transicion."
    ],
    errores: [
      "Ponerse de pie entre transiciones: pierde la demanda de movilidad.",
      "Pie de la pierna estirada no apunta al techo.",
      "Tronco que se inclina excesivamente hacia adelante."
    ],
    variantes: [
      "Con apoyo de manos en suelo.",
      "Apoyo en una mano.",
      "Sin apoyo, tronco erguido.",
      "Transiciones lentas encadenadas 5-8 rep."
    ],
    notas_columna: "Tronco completamente erguido durante el movimiento. Si hay tendencia a inclinar hacia adelante, regresar a la version con apoyo de manos."
  },

  "cossack-standing": {
    nombre: "Cossack to standing",
    categoria: "Movilidad de cadera",
    color: "#2A1A3A",
    descripcion: "Sentadilla Cossack completa con subida a posicion vertical. Desarrolla fuerza asimetrica real y detecta desequilibrios entre pierna izquierda y derecha.",
    posicion: "Posicion de Cossack profunda en un lado.",
    pasos: [
      "Descender al Cossack squat.",
      "Talón del pie de apoyo completamente plano en el suelo.",
      "Tronco completamente erguido.",
      "Subir a posicion de pie empujando con el talon.",
      "Control total durante la subida."
    ],
    errores: [
      "Talon del pie de apoyo que se levanta.",
      "Tronco que se inclina hacia adelante al subir.",
      "Rodilla que colapsa hacia adentro."
    ],
    variantes: [
      "Con apoyo de manos en suelo o banco.",
      "Una mano de apoyo.",
      "Sin apoyo, tronco erguido.",
      "Rompiendo el paralelo (cadera pasa la linea de rodilla).",
      "Explosivo hacia arriba."
    ],
    notas_columna: "Introducir cuando el Deep Cossack shift sea comodo y la columna permanezca neutral durante toda la transicion."
  },

  "cossack-rotations": {
    nombre: "Cossack rotations",
    categoria: "Movilidad de cadera",
    color: "#2A1A3A",
    descripcion: "Rotaciones de cadera activas en posicion Cossack profunda estatica. Estira y fortalece la capsula profunda de cadera bajo carga.",
    posicion: "Posicion Cossack profunda estatica en un lado.",
    pasos: [
      "Mantener la posicion Cossack profunda.",
      "Con la pierna estirada, rotar la cadera activamente.",
      "Girar los dedos del pie hacia el suelo (rotacion interna).",
      "Luego girar los dedos hacia el techo (rotacion externa), pivotando sobre el talon.",
      "Movimiento controlado y deliberado.",
      "12 repeticiones por lado."
    ],
    errores: [
      "Movimiento rapido o con inercia.",
      "La pelvis se mueve con la rotacion: debe permanecer estable.",
      "Introducir antes de dominar el Cossack estatico comodo."
    ],
    variantes: [
      "ROM parcial de rotacion.",
      "ROM completo.",
      "Mantener cada posicion 3s.",
      "Anadir carga ligera en el torso."
    ],
    notas_columna: "Sin rotacion de cadera disponible en esta posicion, la columna lumbar compensa girando. Introducir solo cuando el Cossack profundo estatico sea comodo y la columna permanezca neutral."
  },

  "banded-hip-rotation": {
    nombre: "Banded hip rotation",
    categoria: "Rotacion de cadera aislada",
    color: "#2A1A3A",
    descripcion: "Rotacion de cadera con banda elasica. La banda genera distraccion articular — crea espacio articular y elimina el roce mecanico.",
    posicion: "Tumbado boca arriba o de lado. Banda anclada a un poste, colocada alrededor del tobillo o rodilla.",
    pasos: [
      "Anclar la banda a un poste a nivel del suelo.",
      "Colocar la banda alrededor del tobillo o rodilla.",
      "Tumbado boca arriba o de lado.",
      "Realizar movimientos de rotacion de cadera hacia adentro y hacia afuera venciendo la tension de la banda.",
      "Movimiento controlado: 20 repeticiones lentas por lado."
    ],
    errores: [
      "Movimiento rapido con inercia.",
      "La pelvis se mueve con la rotacion.",
      "Banda demasiado tensa para el rango disponible."
    ],
    variantes: [
      "Banda muy ligera ROM parcial.",
      "Banda ligera ROM completo.",
      "Banda media 20 rep.",
      "Alternar interno/externo en la misma serie."
    ],
    notas_columna: "La banda genera distraccion articular — tira sutilmente de la cabeza del femur fuera de la pelvis, creando espacio articular. Util para reducir el roce mecanico y los clicks de cadera."
  },

  "prone-hip-rotation": {
    nombre: "Prone hip rotation",
    categoria: "Rotacion de cadera aislada",
    color: "#2A1A3A",
    descripcion: "Rotacion de cadera en decubito prono con pelvis bloqueada. Aisla al 100% los rotadores internos y externos cortos sin compensacion lumbar.",
    posicion: "Tumbado boca abajo. Una rodilla flexionada a 90 grados, planta del pie mirando al techo.",
    pasos: [
      "Tumbarse boca abajo.",
      "Flexionar una rodilla a 90 grados: planta del pie mira al techo.",
      "Mantener la pelvis completamente pegada al suelo en todo momento.",
      "Mover el pie hacia afuera (rotacion interna de cadera).",
      "Mover el pie hacia adentro (rotacion externa).",
      "12 repeticiones controladas. Sin levantar la cadera."
    ],
    errores: [
      "La pelvis se levanta: compensacion con columna.",
      "Movimiento de tobillo en lugar de rotacion de cadera.",
      "Velocidad excesiva."
    ],
    variantes: [
      "ROM parcial sin compensacion pelvica.",
      "ROM completo.",
      "Pausa 2s en cada posicion extrema.",
      "Tobillera muy ligera."
    ],
    notas_columna: "Con la pelvis bloqueada contra el suelo es imposible compensar con la columna. El reto real es mantener la pelvis completamente pegada al suelo durante toda la rotacion."
  },

  "fire-hydrant": {
    nombre: "Fire hydrant",
    categoria: "Gluteo / Rotadores externos",
    color: "#3A2A1A",
    descripcion: "Abduccion lateral de cadera desde cuadrupedia con rodilla flexionada. Fortalece el gluteo medio y el piriforme de forma aislada sin compensacion lumbar.",
    posicion: "Cuadrupedia. Espalda completamente neutra. Munecas bajo hombros, rodillas bajo caderas.",
    pasos: [
      "Cuadrupedia con espalda neutra.",
      "Mantener la rodilla doblada a 90 grados.",
      "Levantar la pierna hacia el lateral como un perro en un hidrante.",
      "La espalda baja no debe arquearse.",
      "El cuerpo no debe inclinarse hacia el lado contrario.",
      "Todo el movimiento nace del gluteo.",
      "Bajar controlado."
    ],
    errores: [
      "La espalda lumbar se arquea al subir la pierna.",
      "El cuerpo se inclina hacia el lado contrario: compensacion de QL.",
      "ROM excesivo que supera la capacidad de rotacion externa de cadera."
    ],
    variantes: [
      "ROM parcial sin compensacion.",
      "ROM completo.",
      "Pausa 2s arriba.",
      "Tobillera ligera.",
      "Circulo completo en la posicion alta."
    ],
    notas_columna: "Diferencia con el clamshell: el fire hydrant trabaja el gluteo medio en cadena abierta desde cuadrupedia, el clamshell en decubito lateral. Son complementarios. El reto real es que ni la espalda ni la pelvis se muevan durante la abduccion."
  },

  "wall-squat-overhead": {
    nombre: "Wall squat / Overhead squat progressions",
    categoria: "Patron squat / Movilidad",
    color: "#1A3A1A",
    descripcion: "Sentadilla profunda con restriccion de pared y brazos overhead. Requiere extension toracica perfecta, movilidad de cadera y dorsiflexion de tobillo simultaneas.",
    posicion: "De espaldas o de cara a la pared segun la variante.",
    pasos: [
      "Version basica: espaldas a la pared, sostener disco al frente como contrapeso.",
      "Descender a sentadilla profunda manteniendo el tronco vertical.",
      "Version avanzada: cara a la pared, puntas de pie casi tocandola.",
      "Brazos completamente extendidos hacia arriba (barra o banda ligera).",
      "Sentadilla profunda sin que cara, manos o rodillas toquen la pared."
    ],
    errores: [
      "Las manos o cara tocan la pared: falta de extension toracica o movilidad de cadera.",
      "Los talones se levantan: falta de dorsiflexion de tobillo.",
      "Rodillas que colapsan."
    ],
    variantes: [
      "Basica: disco como contrapeso de espaldas a la pared.",
      "Sin contrapeso.",
      "Cara a la pared con brazos a 90 grados.",
      "Brazos completamente extendidos overhead.",
      "Reducir distancia a la pared progresivamente."
    ],
    notas_columna: "Introducir cuando la sentadilla bulgara y la prensa sean solidas. Referencia avanzada de movilidad global — si no se puede ejecutar, indica deficit especifico en extension toracica, movilidad de cadera o dorsiflexion de tobillo."
  },

  "sissy-reach": {
    nombre: "Sissy reach single leg",
    categoria: "Patron squat / Movilidad",
    color: "#1A3A1A",
    descripcion: "Carga de cuadriceps y tendon rotuliano en rango profundo con estiramiento del psoas bajo tension. Mejora la rigidez de muslo y rodilla que genera estres en la zona lumbar.",
    posicion: "De pie sobre una sola pierna. Apoyo suave en pared permitido.",
    pasos: [
      "De pie sobre una sola pierna.",
      "Flexionar la rodilla hacia adelante de forma exagerada permitiendo que el talon se levante.",
      "Las caderas van hacia el frente.",
      "El torso se reclina ligeramente hacia atras.",
      "Brazo opuesto extendido buscando alcance.",
      "Mantener el control durante la bajada y la subida."
    ],
    errores: [
      "La rodilla colapsa hacia adentro.",
      "El tronco se inclina hacia adelante en lugar de reclinarse.",
      "Descenso sin control."
    ],
    variantes: [
      "Apoyo en pared con dos manos.",
      "Un dedo de apoyo.",
      "Sin apoyo.",
      "Contrapeso ligero en brazo extendido.",
      "Descenso mas profundo."
    ],
    notas_columna: "Introducir cuando el step-up y la bulgara sean solidos. Elimina la rigidez de muslo y rodilla que genera estres de frenado en la zona lumbar al caminar o correr."
  },

  "lumbar-ext-rotation": {
    nombre: "Lumbar extensions with rotations",
    categoria: "Cadena posterior / Extensores",
    color: "#3A1A1A",
    descripcion: "Hiperextension en banco con rotacion de torso en la posicion alta. Entrena los rotadores profundos (multifidos) para estabilizar bajo tension de extension simultanea.",
    posicion: "Banco de extensiones a 45 grados. Posicion estandar de hiperextension.",
    pasos: [
      "Posicion estandar de hiperextension en banco.",
      "Subir a la posicion alta de extension.",
      "En el punto alto, rotar el torso lentamente hacia un lado.",
      "Volver al centro.",
      "Rotar al otro lado.",
      "Descender de forma controlada."
    ],
    errores: [
      "Rotar desde la lumbar en lugar de la toracica.",
      "Introducir antes de dominar la hiperextension con carga.",
      "Rotacion brusca o con inercia."
    ],
    variantes: [
      "Isometrico estatico en posicion alta sin rotacion.",
      "Rotacion suave sin carga.",
      "Rotacion con disco ligero pegado al pecho.",
      "Rotacion con disco extendido lejos del cuerpo."
    ],
    notas_columna: "Introducir solo cuando la hiperextension bilateral con carga sea solida. La rotacion debe originarse en la toracica — la lumbar permanece neutra. Diferencia con la hiperextension estandar: anade el componente rotacional de multifidos. Son ejercicios distintos y complementarios."
  },

  "aductores-barra-pie": {
    nombre: "Estiramiento dinamico aductores de pie en barra",
    categoria: "Aductores / Movilidad",
    color: "#1A2A3A",
    descripcion: "Estiramiento dinamico de aductores de pie con pierna apoyada lateralmente en barra elevada. Mayor rango que el estiramiento en suelo.",
    posicion: "De pie junto a la barra. Una pierna apoyada lateralmente sobre la barra a altura ajustable.",
    pasos: [
      "Colocar una pierna lateralmente sobre la barra a la altura deseada.",
      "El pie de apoyo en el suelo firme.",
      "Inclinar el torso hacia la pierna elevada.",
      "Movimiento dinamico, no estatico.",
      "Alternar el impulso con la respiracion."
    ],
    errores: [
      "Altura de barra excesiva para el rango disponible.",
      "La pelvis rota para compensar: debe permanecer de frente.",
      "Rebote brusco."
    ],
    variantes: [
      "Barra baja a altura de cadera.",
      "Barra media por encima de cadera.",
      "Inclinacion mas pronunciada del torso.",
      "Balanceo dinamico suave."
    ],
    notas_columna: "La pelvis debe permanecer orientada hacia adelante durante todo el movimiento — si rota para compensar, bajar la altura de la barra."
  },

  "copenhagen-plank": {
    nombre: "Copenhagen plank",
    categoria: "Aductores / Estabilidad lateral",
    color: "#1A2A3A",
    descripcion: "Plancha lateral con pie superior apoyado en banco. Activa aductores como estabilizadores de la pelvis en cadena lateral. Gluten medio y aductor en co-contraccion.",
    posicion: "Plancha lateral. Pie superior apoyado en un banco o cajon. Pie inferior segun variante.",
    pasos: [
      "Colocar el pie superior sobre el banco.",
      "Posicion de plancha lateral: cuerpo en linea recta.",
      "El aductor de la pierna superior es el motor principal.",
      "Mantener la pelvis nivelada sin que caiga.",
      "El pie inferior puede apoyarse o suspenderse segun la variante."
    ],
    errores: [
      "La cadera cae hacia el suelo.",
      "El tronco rota.",
      "Apoyo excesivo en el brazo quitando carga al aductor."
    ],
    variantes: [
      "Rodilla inferior en suelo + pie superior en banco.",
      "Cuerpo completo recto + pie superior en banco.",
      "Pie inferior suspendido sin apoyo.",
      "Copenhagen dips: bajar la cadera hacia el suelo y subir de forma controlada — maxima exigencia de aductor."
    ],
    notas_columna: "Diferencia con el plank lateral estandar: el plank lateral trabaja QL y oblicuo. El Copenhagen añade el aductor como motor principal. Introducir tras consolidar el plank lateral estandar."
  },

  "flexion-lateral-mancuerna": {
    nombre: "Flexion lateral de columna con mancuerna",
    categoria: "Cuadrado lumbar lateral",
    color: "#2A3A1A",
    descripcion: "Flexion lateral del tronco con mancuerna. Fortalece el cuadrado lumbar en el plano frontal mediante carga isotonica lateral.",
    posicion: "De pie, mancuerna en una mano a un costado.",
    pasos: [
      "De pie, mancuerna en una mano.",
      "Inclinar el torso lateralmente hacia el lado de la mancuerna.",
      "Contraccion excentrica del lado opuesto.",
      "Volver a la posicion neutral.",
      "No compensar con la cadera."
    ],
    errores: [
      "Compensacion con la cadera lateral.",
      "Rotacion del tronco durante la inclinacion.",
      "Rango excesivo con perdida de control."
    ],
    variantes: [
      "Mancuerna ligera ROM parcial.",
      "Mancuerna ligera ROM completo exc 3s.",
      "Mancuerna media.",
      "Pausa 2s en posicion de maximo estiramiento.",
      "Progresion: barra en espalda → barra overhead de pie → barra overhead de rodillas."
    ],
    notas_columna: "El QL como cable de tension lateral de la columna. Vigilar que la inclinacion hacia la izquierda no genere irradiacion — si ocurre, trabajar solo hacia la derecha temporalmente."
  },

  "elevaciones-pierna-sentado": {
    nombre: "Elevaciones alternas de pierna sentado",
    categoria: "Flexores de cadera / Psoas",
    color: "#1A3A2A",
    descripcion: "Elevaciones alternas de pierna estirada desde sedestacion con apoyo posterior. Activa el psoas ilíaco sin compresion lumbar directa.",
    posicion: "Sentado en el suelo. Manos apoyadas detras del cuerpo.",
    pasos: [
      "Sentarse en el suelo con la columna neutra.",
      "Manos apoyadas detras para soporte.",
      "Elevar una pierna estirada de forma alterna.",
      "La lumbar permanece neutra — no compensar arqueando.",
      "Bajar controlado."
    ],
    errores: [
      "La lumbar se arquea al elevar la pierna.",
      "Las dos piernas se elevan a la vez (aumenta la demanda excesivamente).",
      "Velocidad excesiva."
    ],
    variantes: [
      "Rodilla semiflexionada elevacion parcial.",
      "Pierna extendida elevacion parcial.",
      "Pierna extendida ROM completo.",
      "Pausa 2s arriba.",
      "Alternancia mas rapida."
    ],
    notas_columna: "Puente natural entre el dead bug y el L-sit. Introducir cuando el dead bug contralateral sea solido."
  },

  "ext-toracica-pelota": {
    nombre: "Extension toracica con pelota medicinal y baston",
    categoria: "Extension toracica / Apertura de hombros",
    color: "#2A1A3A",
    descripcion: "Extension toracica pasiva con pelota medicinal como fulcro localizado. Mayor especificidad de segmento que el foam roller.",
    posicion: "Tumbado boca arriba. Espalda alta (T4-T8) apoyada sobre la pelota medicinal.",
    pasos: [
      "Colocar la pelota medicinal bajo la espalda alta a nivel T4-T8.",
      "Nunca bajo la zona lumbar.",
      "Llevar los brazos hacia atras con un baston desde el pecho hasta overhead.",
      "Dejar que la gravedad abra la extension toracica.",
      "Respiracion diafragmatica durante la posicion."
    ],
    errores: [
      "Pelota bajo la lumbar: contraindicado.",
      "Forzar activamente la extension: debe ser pasivo.",
      "Avanzar demasiado rapido en el rango."
    ],
    variantes: [
      "Solo apoyo pasivo sin baston.",
      "Con baston arco parcial.",
      "Con baston arco completo.",
      "Pausa 5s en posicion de maxima apertura.",
      "Carga muy ligera en el baston."
    ],
    notas_columna: "Complemento mas especifico del foam roller — puede alternarse por dias. La pelota medicinal permite localizar el fulcro en un segmento toracico especifico."
  },

  "dislocaciones-prono": {
    nombre: "Dislocaciones en prono en suelo",
    categoria: "Extension toracica / Apertura de hombros",
    color: "#2A1A3A",
    descripcion: "Dislocaciones con baston en decubito prono. El cuerpo fijo al suelo elimina la compensacion lumbar — aisla la movilidad glenohumeral y toracica pura.",
    posicion: "Tumbado boca abajo en el suelo. Cuerpo completamente pegado al suelo.",
    pasos: [
      "Tumbarse boca abajo, cuerpo pegado al suelo.",
      "Coger el baston con agarre amplio.",
      "Realizar el arco completo de dislocaciones: de delante hacia atras.",
      "Sin despegar ningun punto del cuerpo del suelo.",
      "Movimiento lento y controlado."
    ],
    errores: [
      "El cuerpo se despega del suelo para compensar.",
      "Arquear la lumbar durante el arco.",
      "Agarre demasiado estrecho para la movilidad disponible."
    ],
    variantes: [
      "Agarre muy ancho arco parcial (frente → sobre cabeza).",
      "Arco completo agarre ancho.",
      "Agarre progresivamente mas estrecho.",
      "Pausa 3s en posicion overhead."
    ],
    notas_columna: "Diferencia con dislocaciones de pie: en prono no hay posibilidad de compensacion lumbar. Progresion natural — primero de pie, luego en prono. Introducir cuando las dislocaciones de pie sean solidas."
  },

  "equilibrio-giros-baston": {
    nombre: "Equilibrio monopodal con giros de baston",
    categoria: "Equilibrio / Control motor",
    color: "#2A2A3A",
    descripcion: "Equilibrio sobre un pie con rotaciones lentas de torso manteniendo un baston tras los hombros. Combina propiocepcion con control rotacional sin carga axial.",
    posicion: "De pie sobre un solo pie. Baston apoyado tras los hombros.",
    pasos: [
      "Posicion sobre un solo pie, rodilla ligeramente flexionada.",
      "Baston apoyado en los hombros detras del cuello.",
      "Realizar rotaciones lentas del torso.",
      "Mantener el equilibrio durante toda la rotacion.",
      "Pausa en cada extremo del rango de rotacion."
    ],
    errores: [
      "Rodilla del pie de apoyo bloqueada: reduce la propiocepcion.",
      "Rotacion brusca que rompe el equilibrio.",
      "Mirada hacia abajo: usar punto fijo al frente."
    ],
    variantes: [
      "Suelo plano equilibrio un pie sin baston.",
      "Suelo plano + giro de baston.",
      "Taburete bajo + giro de baston.",
      "Taburete + giro con pausa 2s en cada extremo."
    ],
    notas_columna: "Introducir cuando el equilibrio monopodal en suelo plano sea solido (step-up y bulgara consolidados)."
  },

  "lunge-movilidad-taburete": {
    nombre: "Lunge de movilidad con pie elevado",
    categoria: "Flexores de cadera / Movilidad en zancada",
    color: "#1A3A2A",
    descripcion: "Zancada con pie trasero elevado orientada a movilidad activa del psoas y recto femoral, no a fuerza. Cadencia lenta y exploratoria.",
    posicion: "Zancada con el pie trasero elevado en un taburete.",
    pasos: [
      "Posicion de zancada con el pie trasero apoyado en un taburete.",
      "Tronco erguido.",
      "Inclinar el torso hacia adelante y hacia atras explorando el rango.",
      "Sin buscar la posicion extrema: movimiento exploratorio.",
      "Respiracion consciente durante todo el movimiento."
    ],
    errores: [
      "Buscar la posicion extrema en lugar de explorar el rango.",
      "La lumbar se arquea al inclinar hacia atras.",
      "Velocidad excesiva."
    ],
    variantes: [
      "Pie trasero en suelo zancada estatica.",
      "Pie trasero en taburete bajo.",
      "Pie trasero en taburete medio + inclinacion de torso.",
      "Movimiento dinamico ritmico en la posicion."
    ],
    notas_columna: "Diferencia con la sentadilla bulgara y el reverse lunge: el objetivo aqui es movilidad activa, no fuerza. Complementa el hip flexor stretch estatico con un patron dinamico."
  },

  "ext-cadera-prono-basico": {
    nombre: "Extension de cadera en prono con elevacion de muslos",
    categoria: "Extension de cadera / Gluteo",
    color: "#3A1A1A",
    descripcion: "Version basica de la extension de cadera en decubito prono. Solo la articulacion de la cadera se mueve — sin extension lumbar activa. Prerequisito del single leg reverse hyper.",
    posicion: "Tumbado boca abajo en el suelo. Rodillas flexionadas.",
    pasos: [
      "Tumbarse boca abajo.",
      "Flexionar las rodillas.",
      "Elevar los muslos del suelo activando los gluteos.",
      "El movimiento es solo de la articulacion de la cadera — la lumbar no se arquea.",
      "Bajar controlado."
    ],
    errores: [
      "La lumbar se arquea al elevar los muslos: reducir el rango.",
      "Tension en el cuello: mantener cabeza neutra.",
      "Movimiento de rodillas en lugar de cadera."
    ],
    variantes: [
      "Elevacion bilateral ROM minimo.",
      "Elevacion bilateral ROM completo.",
      "Elevacion unilateral alterna.",
      "Pausa 2s en posicion alta.",
      "Progresar a single leg reverse hyper en banco."
    ],
    notas_columna: "Prerequisito natural del single leg reverse hyper. Introducir antes de usar el banco de extensiones para la version unilateral."
  },

  "giros-torso-rodillas": {
    nombre: "Giros de torso con elevacion de rodillas sentado",
    categoria: "Coordinacion torso / Psoas",
    color: "#2A2A1A",
    descripcion: "Integracion de la flexion de cadera con la rotacion toracica en patron coordinado. Reproduce la mecanica de la marcha sin carga lumbar. Util en dias neurales.",
    posicion: "Sentado en un taburete o banco firme.",
    pasos: [
      "Sentarse erguido en el taburete.",
      "Elevar una rodilla hacia el pecho.",
      "Coordinar un giro de torso y brazos hacia el lado de la rodilla que sube.",
      "Alternar lados de forma ritmica.",
      "Mantener la columna erguida durante todo el movimiento."
    ],
    errores: [
      "La columna se flexiona hacia adelante al elevar la rodilla.",
      "El giro se realiza desde la lumbar en lugar de la toracica.",
      "Ritmo demasiado rapido que elimina la coordinacion."
    ],
    variantes: [
      "Giro de torso solo sin elevacion de rodillas.",
      "Elevacion de rodilla sin giro.",
      "Coordinacion rodilla + giro ROM parcial.",
      "Coordinacion completa ritmo lento.",
      "Ritmo moderado."
    ],
    notas_columna: "Util para dias neurales. El giro debe originarse en la toracica — la lumbar permanece estable como en todos los ejercicios de rotacion del pool."
  },

  "half-kneeling-open-book": {
    nombre: "Half-kneeling open book con banda",
    categoria: "Rotacion toracica / Estabilizacion pelvica",
    color: "#2A3A1A",
    descripcion: "Open book con resistencia de banda desde posicion de semiarrodillado. La pelvis debe estabilizarse activamente — mayor demanda de control lumbopelvico que la version en suelo.",
    posicion: "Semiarrodillado. Banda anclada al lado a la altura del pecho.",
    pasos: [
      "Posicion de semiarrodillado: una rodilla en el suelo, otra a 90 grados.",
      "Anclar la banda al lado a la altura del pecho.",
      "Coger la banda con ambas manos frente al pecho.",
      "Rotar el torso abriendo el pecho contra la resistencia de la banda.",
      "La pelvis permanece completamente estatica durante toda la rotacion.",
      "Retorno controlado venciendo la resistencia."
    ],
    errores: [
      "La pelvis rota con el torso: toda la rotacion debe ser toracica.",
      "La rodilla del suelo se levanta.",
      "Rotacion brusca sin control en el retorno."
    ],
    variantes: [
      "Rotacion toracica en suelo sin banda (prerequisito).",
      "Open book en suelo sin banda.",
      "Half-kneeling sin banda ROM parcial.",
      "Half-kneeling con banda ligera.",
      "Half-kneeling con banda media."
    ],
    notas_columna: "Diferencia con la rotacion toracica en suelo: en suelo la pelvis esta fija por la posicion. En semiarrodillado la pelvis debe estabilizarse activamente — mayor demanda de control lumbopelvico. La rotacion es toracica pura."
  },

  "side-lying-pelvic": {
    nombre: "Side-lying pelvic isolation",
    categoria: "Control pelvico profundo",
    color: "#1A2A3A",
    descripcion: "Aislamiento pelvico lateral con pies en pared. Disocia el movimiento de la pelvis del movimiento de la pierna — patron que se pierde con el dolor cronico.",
    posicion: "Tumbado de lado. Pies apoyados contra la pared.",
    pasos: [
      "Tumbarse de lado con los pies apoyados en la pared.",
      "La pierna de abajo debe permanecer completamente quieta en todo momento.",
      "Rotar la pelvis hacia adelante y hacia atras de forma dinamica.",
      "Solo la pelvis se mueve — la pierna de abajo no.",
      "Pausa 2s en cada extremo del rango."
    ],
    errores: [
      "La pierna de abajo se mueve: la pelvis esta compensando con la cadera.",
      "El movimiento es de columna en lugar de pelvis.",
      "Rango excesivo que arrastra la pierna."
    ],
    variantes: [
      "Rotacion pelvica minima con pierna de abajo asistida por la pared.",
      "Rotacion media manteniendo pierna inmovil.",
      "Rotacion completa con pausa 2s en cada extremo.",
      "Circulo pelvico completo."
    ],
    notas_columna: "El reto real es que la pierna de abajo no se mueva en ningun momento. Si se mueve, la pelvis esta compensando con la cadera en lugar de moverse de forma autonoma. Activa rotadores profundos de cadera y suelo pelvico sin carga axial."
  },

  "prone-serapes": {
    nombre: "Prone serapes",
    categoria: "Cadena espiral / Rotacion en descarga",
    color: "#3A2A1A",
    descripcion: "Movimiento dinamico desde plancha que activa la cadena espiral: dorsal + gluteo contralateral + oblicuos. Patron rotacional sin carga axial vertical.",
    posicion: "Posicion de plancha anterior. Cuerpo en linea recta.",
    pasos: [
      "Posicion de plancha anterior solida.",
      "Rotar el torso llevando un codo hacia la rodilla contralateral.",
      "Mantener la base de plancha durante toda la rotacion.",
      "La lumbar permanece neutral — la rotacion es toracica.",
      "Volver a la posicion inicial de forma controlada.",
      "Alternar lados."
    ],
    errores: [
      "La cadera sube o baja durante la rotacion.",
      "La lumbar rota en lugar de la toracica.",
      "Perdida de la posicion de plancha base.",
      "Introducir antes de que la plancha sea solida."
    ],
    variantes: [
      "Plancha estatica consolidada (prerequisito).",
      "Rotacion de cadera en plancha sin elevar extremidades.",
      "Serape parcial codo hacia rodilla ROM minimo.",
      "Serape completo ROM completo.",
      "Velocidad controlada progresiva."
    ],
    notas_columna: "Introducir cuando la plancha anterior sea solida a 35+ segundos sin compensacion lumbar. La cadena espiral (dorsal + gluteo contralateral + oblicuos) es el patron funcional de la marcha y la carrera."
  },

  "wall-nordics": {
    nombre: "Wall Nordics",
    categoria: "Cadena posterior / Isquiotibiales excentrico",
    color: "#3A1A1A",
    descripcion: "Nordico de isquiotibiales con pies apoyados en pared. Excentrico de isquiotibiales con autorregulacion de carga. Sin carga axial.",
    posicion: "Tumbado boca arriba. Pies apoyados contra la pared, rodillas flexionadas.",
    pasos: [
      "Tumbarse boca arriba con los pies en la pared.",
      "Rodillas flexionadas, pies a altura de rodillas.",
      "Empujar contra la pared para elevar la cadera.",
      "Bajar de forma excentrica muy controlada.",
      "La pared permite autorregular la carga."
    ],
    errores: [
      "Descenso rapido sin control excentrico: el excentrico es el ejercicio.",
      "Introducir antes de que RDL y single leg reverse hyper sean solidos.",
      "La lumbar se arquea durante la bajada."
    ],
    variantes: [
      "Elevacion isometrica mantenida 5s.",
      "Descenso excentrico muy lento desde posicion alta.",
      "Rango parcial excentrico.",
      "Rango completo excentrico.",
      "Pausa 2s en posicion baja antes de subir."
    ],
    notas_columna: "El reto real es el control excentrico en la bajada — la fase concentrica (subida) es secundaria. Introducir cuando el RDL y el single leg reverse hyper sean solidos. El excentrico de isquiotibiales bajo alta carga requiere cadena posterior consolidada."
  }
};
_PORT['heel-sit-ex'] = {
  nombre:'Heel sit (posicion de descanso en talones)',
  categoria:'Descompresion / Movilidad',
  color:'#0F6E56',
  descripcion:'Posicion de descarga lumbar activa. Los gluteos sobre los talones crean una flexion de cadera profunda que abre el espacio posterior lumbar y descomprime los discos L4-L5 y L5-S1. Es la posicion de partida del camel y uno de los ejercicios mas seguros del protocolo.',
  posicion:'Arrodillado en el suelo, nalgas apoyadas sobre los talones. Tronco erguido, columna neutra. Manos sobre los muslos o en el suelo al frente.',
  pasos:[
    'Arrodillate y lleva los gluteos hacia los talones lentamente.',
    'Asegurate de que ambos gluteos contactan ambos talones — sin desviacion lateral.',
    'Tronco erguido: no redondees la espalda ni inclines el tronco hacia adelante.',
    'Respira de forma diafragmatica — en cada exhala, los gluteos se hunden un poco mas.',
    'Mantén la posicion el tiempo indicado. Si hay dolor en rodillas, coloca una almohada entre gluteos y talones.',
  ],
  errores:[
    'Redondear la espalda lumbar — la posicion debe ser neutra, no en cifosis.',
    'Inclinar el tronco hacia adelante para compensar falta de flexion de tobillo.',
    'Separar las rodillas en exceso — ancho de caderas es suficiente.',
    'Forzar si hay dolor agudo en rodilla — reducir rango o usar almohada.',
  ],
  variantes:[
    'Con almohada entre gluteos y talones: reduce la flexion de rodilla si molesta.',
    'Tronco inclinado ligeramente adelante (manos al suelo): aumenta la apertura posterior lumbar.',
    'Con cinturon alrededor de muslos: mantiene la posicion sin esfuerzo.',
  ],
  notas_columna:'El heel sit crea una traccion lumbar suave por el peso del tronco. La posicion reduce la presion intradiscal en L4-L5 y L5-S1 al eliminar la lordosis sin carga axial activa. Ejecutar siempre en el bloque B de calentamiento — despues de al menos 30 min en bipedestacion y movimiento, cuando el disco ha liberado el exceso de hidratacion nocturna y es mas elastico y menos vulnerable. La ejecucion debe ser estricta: tronco erguido en diagonal, cuadriceps activos frenando el descenso, sin colapso de lordosis ni retroversion. Si hay irradiacion S1 en esta posicion, reducir el tiempo y monitorizar.',
};

_PORT['rodillas-pecho'] = {
  nombre:'Rodillas al pecho bilateral',
  categoria:'Descompresion / Movilidad',
  color:'#0F6E56',
  descripcion:'Descompresion activa de L5-S1 en decubito supino. Lleva ambas rodillas al pecho simultaneamente creando una flexion lumbar suave que abre el espacio posterior discal y reduce la presion intradiscal. Es el ejercicio de descompresion activa mas importante del protocolo.',
  posicion:'Tumbado boca arriba en el suelo. Piernas inicialmente extendidas o con rodillas flexionadas.',
  pasos:[
    'Tumbado boca arriba, lleva ambas rodillas hacia el pecho abrazandolas con los brazos.',
    'La zona lumbar debe contactar el suelo — no arquear.',
    'Lleva las rodillas hasta donde el estiramiento sea comodo, sin dolor.',
    'Mantén la posicion respirando con el diafragma — en cada exhala, las rodillas se acercan un poco mas al pecho de forma pasiva.',
    'Mantén 45 segundos. Bajar las piernas lentamente.',
  ],
  errores:[
    'Levantar la cabeza y el cuello — mantener la nuca en el suelo.',
    'Forzar el rango — el movimiento debe ser pasivo y sin dolor.',
    'Aguantar la respiracion — la respiracion diafragmatica es parte del ejercicio.',
    'Hacer el movimiento rapido — lento y controlado siempre.',
  ],
  variantes:[
    'Unilateral: una rodilla al pecho mientras la otra pierna esta extendida — menor intensidad.',
    'Con oscilacion lateral suave: movilizacion adicional de sacroiliaca.',
    'Con towel bajo la zona lumbar: si el suelo duro genera molestia.',
  ],
  notas_columna:'La flexion bilateral de cadera en supino es la posicion que mas reduce la presion intradiscal en L4-L5 y L5-S1 — inferior incluso a la bipedestacion. En tu caso, con extrusion izquierda L5-S1 con contacto S1, este ejercicio alivia la tension radicular al abrir el canal posterior. Si aparece irradiacion al hacer el ejercicio, reducir el rango hasta que desaparezca.',
};

_PORT['pies-silla'] = {
  nombre:'Pies en silla 90/90 (supino con caderas y rodillas a 90°)',
  categoria:'Descompresion / Relajacion',
  color:'#0F6E56',
  descripcion:'Posicion de maxima descarga lumbar pasiva. Con caderas y rodillas a 90 grados apoyadas en una silla, la musculatura paravertebral se relaja completamente y la presion intradiscal lumbar cae a su minimo fisiologico. Ideal para periodos prolongados de descompresion.',
  posicion:'Tumbado boca arriba en el suelo. Piernas apoyadas sobre una silla o sofa de forma que caderas y rodillas formen aproximadamente 90 grados cada una.',
  pasos:[
    'Coloca una silla o sofa junto a tu esterilla.',
    'Tumbate boca arriba y sube las piernas hasta apoyar las pantorrillas en el asiento.',
    'Ajusta la distancia a la silla hasta que caderas y rodillas esten a aproximadamente 90 grados.',
    'Deja caer los brazos a los lados con las palmas hacia arriba.',
    'Cierra los ojos. Respira con el diafragma — el abdomen sube en la inhala, baja en la exhala.',
    'Mantén el tiempo indicado sin moverte.',
  ],
  errores:[
    'Silla demasiado cerca: las caderas quedan mas de 90 grados y se pierde la descarga optima.',
    'Silla demasiado lejos: tension en isquiotibiales que impide la relajacion completa.',
    'Respiracion toracica en lugar de diafragmatica — el pecho no debe moverse.',
    'Tensionar los brazos o los hombros — todo el cuerpo debe estar pasivo.',
  ],
  variantes:[
    'Viparita Karani (piernas en pared): alternativa sin necesidad de silla, con beneficio venoso anadido.',
    'Con almohada bajo la cabeza: si hay tension cervical.',
    'Con ojos cerrados y respiracion guiada: maxima activacion parasimpatica.',
  ],
  notas_columna:'Esta posicion elimina practicamente toda la carga sobre los discos lumbares. La posicion psoas-neutral (cadera a 90°) elimina la traccion del iliopsoas sobre L1-L5, que en posicion de pie genera una compresion anterior constante. Para ti es especialmente util primera hora del dia y despues de sesiones de gym donde la carga axial acumulada es alta.',
};

_PORT['viparita'] = {
  nombre:'Viparita Karani (piernas en la pared)',
  categoria:'Descompresion / Recuperacion venosa',
  color:'#0F6E56',
  descripcion:'Postura de yoga restaurativa. Las piernas elevadas verticalmente contra la pared combinan descompresion lumbar pasiva con retorno venoso desde los miembros inferiores. Activa el sistema parasimpatico y reduce la inflamacion periradicular al facilitar el drenaje linfatico.',
  posicion:'Tumbado boca arriba junto a la pared. Piernas apoyadas verticalmente contra la pared, gluteos lo mas cerca posible del rodapie.',
  pasos:[
    'Coloca la esterilla perpendicular a la pared.',
    'Sientate de lado junto a la pared y gira el cuerpo llevando las piernas hacia arriba mientras te tumbas.',
    'Ajusta la distancia hasta que las piernas queden casi verticales — no es necesario que sean exactamente 90 grados.',
    'Brazos a los lados, palmas hacia arriba.',
    'Cierra los ojos. Respiracion diafragmatica lenta: 4 seg inhala, 6 seg exhala.',
    'Mantén el tiempo indicado. Para salir: dobla las rodillas, gira de lado y levantate lentamente.',
  ],
  errores:[
    'Gluteos muy separados de la pared: se pierde la verticalidad y el beneficio venoso.',
    'Rodillas bloqueadas en hiperextension: mantener una ligera flexion comoda.',
    'Tension en cuello o hombros: usar almohada bajo la cabeza si es necesario.',
    'Levantarse bruscamente: riesgo de hipotension ortostatica — salir siempre lentamente.',
  ],
  variantes:[
    'Pies en silla 90/90: alternativa sin pared, misma descarga lumbar.',
    'Con banda alrededor de muslos: mantiene las piernas juntas sin esfuerzo.',
    'Con ojos tapados y musica: maximiza la respuesta parasimpatica.',
    'Version corta 3 min: igual de efectiva para descompresion rapida post-sesion.',
  ],
  notas_columna:'En tu caso, la elevacion de piernas facilita el retorno venoso desde L5-S1 izquierdo, reduciendo el edema periradicular que mantiene activa la sensibilizacion del nervio S1. Ademas, la gravedad en esta posicion ejerce una traccion suave sobre los segmentos lumbares inferiores. Es la version mas eficiente de descompresion pasiva de tu protocolo y la prioridad en dias neurales.',
};

_PORT['prono-almohada'] = {
  nombre:'Prono con almohada abdominal',
  categoria:'Descompresion / Posicion de descarga',
  color:'#0F6E56',
  descripcion:'Decubito prono modificado para descompresion lumbar. La almohada bajo el abdomen neutraliza la lordosis lumbar en prono, convirtiendo una posicion potencialmente compresiva en una posicion de descarga real. Sin almohada, el prono aumenta la lordosis y comprime los discos posteriores.',
  posicion:'Tumbado boca abajo. Almohada o rollon colocado bajo el abdomen, entre el ombligo y las crestas iliacas. Brazos a los lados del cuerpo o doblados con la frente apoyada en las manos.',
  pasos:[
    'Coloca una almohada gruesa o rollon de yoga en el suelo.',
    'Tumbate boca abajo posicionando la almohada bajo el abdomen — entre ombligo y crestas iliacas.',
    'Ajusta hasta que la zona lumbar se sienta neutra o ligeramente en flexion — nunca en hiperlordosis.',
    'Brazos relajados. Frente apoyada o cabeza girada a un lado.',
    'Respira con el diafragma. El abdomen presiona la almohada en cada inhala.',
    'Permanece el tiempo indicado sin tension activa.',
  ],
  errores:[
    'Usar almohada demasiado fina: no neutraliza la lordosis — sin efecto descompresivo.',
    'Almohada demasiado alta: crea flexion excesiva que puede tensar los extensores.',
    'Colocar la almohada bajo el pecho: no modifica la lordosis lumbar.',
    'Usar prono sin almohada: contraindicado en F2 con extrusiones activas.',
  ],
  variantes:[
    'Rollon de yoga: mas firme y con altura regulable segun necesidad.',
    'Almohadas apiladas: permite ajuste fino de la altura.',
    'Con bolsa de calor encima de la lumbar: suma vasodilatacion a la descarga.',
  ],
  notas_columna:'Ejercicio opcional — usar solo si hay sensacion subjetiva de compresion posterior que no cede con las posturas de flexion. En presencia de extrusiones con migracion caudal en L4-L5 y L5-S1, el prono sin almohada esta contraindicado porque aumenta la lordosis y puede desplazar el fragmento extruido hacia el canal. Con almohada, la lordosis se neutraliza y el prono pasa a ser una posicion de descarga valida.',
};

_PORT['neural-flossing'] = {
  nombre:'Neural flossing nervio ciatico',
  categoria:'Movilizacion neural / Nervio ciatico',
  color:'#0F6E56',
  descripcion:'Tecnica de movilizacion neural que desliza el nervio ciatico en su trayecto desde L4-S3 hasta el pie. A diferencia del estiramiento pasivo, el flossing no mantiene la tension sino que la alterna — creando un efecto de "hilo dental" que mejora la movilidad neural sin irritar el nervio.',
  posicion:'Tumbado boca arriba. Una pierna extendida en el suelo. La pierna a trabajar con rodilla flexionada, pie en el aire.',
  pasos:[
    'Tumbado boca arriba, rodilla de la pierna a trabajar llevada hacia el pecho a 90 grados aproximadamente.',
    'Desde esa posicion: extiende la rodilla (estira la pierna) mientras flexionas el pie (punta hacia ti) — tension neural.',
    'Inmediatamente: flexiona la rodilla de nuevo y lleva el pie en punta (relaja la tension).',
    'El movimiento es continuo y ritmico — como un latido suave. Sin pausa en el punto de tension.',
    'Velocidad: 1 rep cada 2 segundos aproximadamente.',
    'PARAR si aparece irradiacion electrica hacia la pierna — reducir el angulo de partida.',
  ],
  errores:[
    'Mantener la posicion de tension (eso es un estiramiento, no flossing).',
    'Elevar demasiado la pierna al inicio — comenzar con un angulo bajo (45-60 grados).',
    'Hacer el movimiento demasiado rapido — el control es fundamental.',
    'Ignorar la irradiacion — si aparece, reducir el angulo hasta que desaparezca.',
  ],
  variantes:[
    'Sentado en silla: extension y flexion de rodilla — version mas suave, buena para inicio.',
    'Con dorsiflexion de tobillo: aumenta la tension neural — solo cuando no hay sintomas.',
    'Bilateral alternado: una pierna extiende mientras la otra flexiona — coordinacion anadida.',
  ],
  notas_columna:'El nervio ciatico emerge de L4-S3 y en tu caso el nervio S1 izquierdo tiene contacto documentado con la extrusion L5-S1. El flossing mejora la capacidad del nervio de deslizarse en su lecho sin generar tension acumulada. Diferencia clave con el estiramiento: el estiramiento estatico del nervio puede aumentar la sensibilizacion; el flossing dinamico la reduce. Empezar siempre con el lado derecho (menos afectado) para calibrar el rango comodo antes de trabajar el izquierdo.',
};

_PORT['respiracion-diafragmatica'] = {
  nombre:'Respiracion diafragmatica profunda',
  categoria:'Sistema nervioso / Recuperacion',
  color:'#0F6E56',
  descripcion:'Tecnica de respiracion que activa el diafragma como musculo principal de la inhala, desactivando los musculos accesorios del cuello y hombros. Activa el sistema nervioso parasimpatico, reduce el cortisol y la tension muscular paravertebral, y mejora la presion intraabdominal necesaria para la estabilidad lumbar.',
  posicion:'Tumbado boca arriba o sentado con respaldo. Una mano en el abdomen, otra en el pecho.',
  pasos:[
    'Coloca una mano sobre el abdomen (bajo el ombligo) y otra sobre el pecho.',
    'Inhala lentamente por la nariz en 4 segundos: el abdomen debe subir, el pecho debe quedarse quieto.',
    'Mantén 1-2 segundos con el aire dentro.',
    'Exhala lentamente por la boca en 6-8 segundos: el abdomen baja, el pecho sigue quieto.',
    'La mano del pecho es el control — si se mueve, la respiracion no es diafragmatica.',
    'Repetir durante el tiempo indicado sin forzar el ritmo.',
  ],
  errores:[
    'Pecho que sube en la inhala — indica respiracion toracica, no diafragmatica.',
    'Exhala demasiado corta — la exhala lenta es la que activa el parasimpatico.',
    'Forzar el abdomen hacia fuera activamente — el movimiento debe ser pasivo, consecuencia de la bajada del diafragma.',
    'Apnea entre respiraciones — el ciclo debe ser continuo y fluido.',
  ],
  variantes:[
    '4-7-8: inhala 4s, mantén 7s, exhala 8s — maxima activacion parasimpatica.',
    'Respiracion de caja (box breathing): 4s inhala, 4s hold, 4s exhala, 4s hold — equilibrio SN.',
    'Respiracion coherente: 5s inhala, 5s exhala — ritmo cardiaco sincronizado.',
  ],
  notas_columna:'El diafragma tiene inserciones en los cuerpos vertebrales de L1-L3 y en las apofisis costales. Una respiracion diafragmatica correcta genera un aumento ciclico de la presion intraabdominal que actua como estabilizador hidraulico de la columna lumbar — complementando la accion del transverso abdominal. En dias de dolor elevado o reagudizacion, la respiracion diafragmatica es el primer recurso: reduce el espasmo paravertebral reflejo y baja la sensibilizacion central.',
};

// ══════════════════════════════════════════════
// FIN BLOQUE 1
// ══════════════════════════════════════════════

// ══════════════════════════════════════════════
// BLOQUE 2 — CORE + ESTABILIZACION
// ══════════════════════════════════════════════

_PORT['dead-bug'] = {
  nombre:'Dead bug con extension completa',
  categoria:'Core / Estabilizacion segmentaria',
  color:'#993C1D',
  descripcion:'Ejercicio de coactivacion transverso-multifidos con movimiento distal de extremidades. La clave es mantener la zona lumbar pegada al suelo mientras se mueven brazos y piernas de forma contralateral. Es el ejercicio de core mas seguro y efectivo para discopatia activa porque entrena la estabilizacion sin carga axial.',
  posicion:'Tumbado boca arriba. Brazos extendidos hacia el techo. Caderas y rodillas a 90 grados (mesa). Zona lumbar pegada al suelo.',
  pasos:['Tumbado boca arriba, lleva las rodillas a 90 grados y los brazos extendidos hacia el techo.','Activa el core: haz una espiracion lenta y aplana la zona lumbar contra el suelo.','Mantén la lumbar pegada al suelo durante todo el ejercicio. Si se despega, el ejercicio termina.','Baja simultaneamente el brazo derecho hacia atras y la pierna izquierda extendiendola hacia el suelo.','Lleva hasta donde la lumbar no se despegue. Vuelve al inicio.','Alterna: brazo izquierdo + pierna derecha. Eso es 1 repeticion.'],
  errores:['Lumbar que se despega del suelo — reducir el rango inmediatamente.','Aguantar la respiracion — respirar de forma continua.','Movimiento demasiado rapido — control total en todo el rango.','No activar el core antes de mover — la activacion previa es obligatoria.'],
  variantes:['S1-2: un solo miembro (solo brazo o solo pierna) — lumbar pegada al suelo obligatorio.','S3-4: contralateral completo.','S5-6: press de palma contra rodilla en el punto inicial.','S7+: con peso en el pie de la pierna que desciende.'],
  notas_columna:'El dead bug entrena la coactivacion del transverso abdominal y los multifidos — los dos musculos de estabilizacion segmentaria mas importantes para L4-L5 y L5-S1. A diferencia del crunch, no genera flexion lumbar activa ni presion intradiscal elevada. La lumbar pegada al suelo es innegociable.',
};

_PORT['bird-dog'] = {
  nombre:'Bird dog con pausa',
  categoria:'Core / Estabilizacion multifidos',
  color:'#993C1D',
  descripcion:'Ejercicio de estabilizacion en cuadrupedia. Extiende simultaneamente el brazo y la pierna contralaterales manteniendo la pelvis completamente estable. Activa los multifidos lumbares de forma intensa y entrena el control motor segmentario en una posicion sin carga axial directa.',
  posicion:'A cuatro patas. Manos bajo los hombros, rodillas bajo las caderas. Columna neutra. Cabeza en linea con la columna.',
  pasos:['Posicion de cuadrupedia: manos bajo hombros, rodillas bajo caderas, columna neutra.','Activa el core ligeramente — zona lumbar neutra.','Extiende simultaneamente el brazo derecho hacia adelante y la pierna izquierda hacia atras.','La pelvis debe quedar completamente horizontal — sin rotacion ni inclinacion lateral.','Mantén la pausa indicada (3 seg) respirando normalmente.','Vuelve al inicio con control. Alterna lado.'],
  errores:['Rotacion de pelvis al extender la pierna — el gluteo no debe elevarse mas de un lado.','Hiperlordosis lumbar al extender — columna neutra siempre.','Levantar demasiado la pierna — extension maxima hasta la horizontal en F2.','No hacer pausa — la pausa es donde ocurre la estabilizacion real.'],
  variantes:['S1-2: solo brazo o solo pierna por separado.','S3-4: contralateral completo con pausa 3 seg.','S5-6: con banda elastica en el tobillo de la pierna extendida.','S7+: sobre superficie inestable.'],
  notas_columna:'El bird dog genera la mayor activacion de multifidos lumbares de todos los ejercicios en cuadrupedia. Los multifidos tienen insercion directa en los procesos espinosos de cada vertebra y son los principales estabilizadores segmentarios de L4-L5 y L5-S1.',
};

_PORT['plank-anterior'] = {
  nombre:'Plank anterior (plancha frontal)',
  categoria:'Core / Anti-extension',
  color:'#993C1D',
  descripcion:'Ejercicio isometrico de anti-extension lumbar. El objetivo es mantener la columna completamente neutra resistiendo la tendencia a la hiperlordosis. Activa transverso, multifidos, gluteo y serratos de forma simultanea sin carga axial.',
  posicion:'Boca abajo apoyado en antebrazos y pies. Codos bajo los hombros. Cuerpo en linea recta desde talones hasta cabeza.',
  pasos:['Apoyate en los antebrazos — codos exactamente bajo los hombros.','Pies juntos o al ancho de caderas. Puntas de pie en el suelo.','Activa el gluteo maximo: aprieta las nalgas.','Activa el core: exhala y lleva el ombligo ligeramente hacia dentro.','Empuja el suelo con los codos como si quisieras alejarlos de tus pies — activa el serrato.','Mantén sin dejar que la cadera caiga o se eleve.'],
  errores:['Cadera que cae — hiperlordosis lumbar. Reducir el tiempo inmediatamente.','Cadera elevada — compensa pero pierde el estimulo.','Cabeza caida o adelantada — mirada al suelo, cuello neutro.','No activar el gluteo — sin gluteo activo la lumbar carga todo.'],
  variantes:['S1-2: apoyado en rodillas, 20 seg.','S3-4: completo 30 seg.','S5-6: completo 45 seg.','S7+: elevacion alterna de un pie 5 seg por lado.'],
  notas_columna:'En F2 el plank es preferible al crunch porque es anti-extension — no aumenta la presion intradiscal. Si la cadera cae antes de 20 seg, mejor hacer la version en rodillas con buena forma que aguantar con mala postura.',
};

_PORT['plank-lateral'] = {
  nombre:'Plank lateral',
  categoria:'Core / Anti-inclinacion lateral',
  color:'#993C1D',
  descripcion:'Ejercicio isometrico de anti-inclinacion lateral. Activa el cuadrado lumbar, el gluteo medio y el oblicuo contralateral. Esencial para la estabilidad lateral de la columna lumbar, que protege los discos de las fuerzas de cizalla laterales.',
  posicion:'De lado apoyado en un antebrazo. Cuerpo en linea recta lateral. Cadera elevada del suelo.',
  pasos:['Apoyate en el antebrazo del lado inferior — codo bajo el hombro.','Pies uno sobre el otro o pie superior adelantado para mas estabilidad.','Eleva la cadera del suelo hasta que el cuerpo forme una linea recta lateral.','Mano libre en la cadera o extendida hacia el techo.','Activa el gluteo del lado superior para mantener la cadera elevada.','Mantén sin dejar que la cadera caiga.'],
  errores:['Cadera que cae hacia el suelo — reducir el tiempo.','Rotacion del tronco — el cuerpo debe estar en el plano lateral.','Codo no bajo el hombro — genera tension en el hombro.','Cuello en flexion lateral — cabeza en linea con la columna.'],
  variantes:['S1-2: apoyado en rodilla inferior flexionada, 20 seg.','S3-4: completo 25 seg.','S5-6: completo 35 seg.','S7+: abduccion de la pierna superior mientras se mantiene el plank.'],
  notas_columna:'S1-2 (rodillas, 20s): palanca reducida — si irradiacion en lado izquierdo, solo lado derecho. S3-4 (completo 25s): activacion maxima cuadrado lumbar y oblicuo externo — directamente terapeutico L4-L5. S5-6 (35s): resistencia del cuadrado lumbar. S7+ (abduccion pierna): gluteo medio + cuadrado lumbar — patron lumbopelvico lateral completo.',
};

_PORT['hollow-body'] = {
  nombre:'Hollow body hold',
  categoria:'Core / Tension global',
  color:'#993C1D',
  descripcion:'Posicion isometrica de tension global de core. La columna lumbar se aplana contra el suelo mientras se mantienen brazos y piernas elevados. Activa el recto abdominal, transverso y psoas sin flexion lumbar activa.',
  posicion:'Tumbado boca arriba. Zona lumbar pegada al suelo. Brazos extendidos sobre la cabeza. Piernas elevadas segun estadio.',
  pasos:['Tumbado boca arriba, brazos extendidos sobre la cabeza.','Exhala completamente y aplana la zona lumbar contra el suelo.','Eleva los hombros ligeramente del suelo — como un crunch inicial muy suave.','Eleva las piernas segun el estadio (ver variantes).','Mantén la lumbar pegada al suelo durante todo el tiempo.','Respirar de forma continua — no aguantar el aire.'],
  errores:['Lumbar que se despega del suelo — subir las piernas hasta que pueda mantenerse pegada.','Aguantar la respiracion — el core debe funcionar independientemente.','Cuello en tension excesiva.','Piernas demasiado bajas para el nivel actual.'],
  variantes:['S1-2: rodillas flexionadas a 90 grados elevadas, 15 seg.','S3-4: piernas a 45 grados, 20 seg.','S5-6: piernas a 30 grados, 25 seg.','S7+: piernas a 15 grados, 30 seg.','F3: hollow body hang en barra, 3x10-15 seg.'],
  notas_columna:'El hollow body es la progresion del dead bug hacia la tension global. La lumbar aplana pasivamente por la activacion del transverso — no hay flexion lumbar activa. No introducir si la lumbar se despega en cualquier variante.',
};

_PORT['glute-bridge'] = {
  nombre:'Glute bridge bilateral',
  categoria:'Gluteo / Estabilizacion lumbopelvica',
  color:'#993C1D',
  descripcion:'Puente de gluteos bilateral. Activa el gluteo maximo sin carga axial lumbar. Base de toda la progresion de cadena posterior en F2 y el ejercicio de activacion glutea mas seguro del protocolo.',
  posicion:'Tumbado boca arriba. Rodillas a 90 grados. Pies plantados al ancho de caderas. Brazos a los lados.',
  pasos:['Tumbado boca arriba, pies plantados, rodillas a 90 grados.','Activa el core ligeramente antes de subir.','Empuja el suelo con los talones — no con las puntas del pie.','Eleva la cadera hasta que muslos, caderas y tronco formen una linea recta.','En la cima: aprieta el gluteo maximo durante la pausa indicada.','Baja de forma controlada.'],
  errores:['Hiperlordosis lumbar en la cima — columna neutra, no arqueada.','Empujar con las puntas de pie — cambia el musculo activado.','No apretar el gluteo en la cima — la pausa es donde ocurre el trabajo real.','Rodillas que se cierran o abren.'],
  variantes:['S1-2: isometrico 5 seg x8.','S3-4: 15 reps con pausa 2 seg.','S5-6: con banda elastica en los muslos.','S7+: progresion a hip thrust con barra.'],
  notas_columna:'Un gluteo maximo fuerte reduce la carga en L4-L5 y L5-S1 durante los patrones de extension de cadera. El glute bridge es la base de toda la cadena posterior en F2.',
};

_PORT['glute-bridge-uni'] = {
  nombre:'Glute bridge unilateral',
  categoria:'Gluteo / Estabilizacion pelvica',
  color:'#993C1D',
  descripcion:'Puente de gluteos con una sola pierna. Anade la demanda de estabilizacion pelvica lateral al trabajo de extension de cadera. Activa el gluteo medio ademas del maximo y exige un control neuromuscular superior al bilateral.',
  posicion:'Tumbado boca arriba. Una pierna con pie plantado y rodilla a 90 grados. La otra pierna extendida en el aire.',
  pasos:['Tumbado boca arriba, pierna de trabajo con pie plantado y rodilla a 90 grados.','Pierna libre extendida en el aire a la misma altura que la rodilla de la pierna de trabajo.','Activa el core. Empuja con el talon de la pierna de trabajo.','Eleva la cadera hasta que muslos y tronco formen una linea recta.','La pelvis debe quedar horizontal — el lado de la pierna libre no debe caer.','Mantén la pausa apretando el gluteo. Baja con control.'],
  errores:['Pelvis que cae hacia el lado de la pierna libre — debilidad del gluteo medio.','Rotacion de pelvis.','Hiperextension lumbar en la cima.','Comenzar siempre por el lado derecho.'],
  variantes:['S1-2: bilateral como base.','S3-4: unilateral con pierna libre flexionada en el aire.','S5-6: unilateral con pierna libre extendida.','S7+: con mancuerna sobre la cadera de trabajo.'],
  notas_columna:'S1-2 (bilateral como base): el glute bridge bilateral es el prerequisito — si la pelvis cae en el bilateral, el unilateral esta contraindicado. S3-4 (pierna libre flexionada): la pierna libre flexionada reduce el brazo de palanca y la demanda de estabilizacion pelvica — detectable la asimetria gluteo medio izq vs der. S5-6 (pierna libre extendida): el brazo de palanca maximo exige gluteo medio a plena activacion — si la pelvis cae hacia el lado libre, debilidad de gluteo medio L5 (raiz afectada). S7+ (mancuerna en cadera): carga externa añadida solo cuando la pelvis se mantiene horizontal en todo el rango sin mancuerna. La caida de pelvis hacia el lado derecho en el unilateral izquierdo es el signo clinico mas claro de debilidad del gluteo medio izquierdo por afectacion L5.',
};

_PORT['pallof-press'] = {
  nombre:'Pallof press en polea',
  categoria:'Core / Anti-rotacion',
  color:'#993C1D',
  descripcion:'Ejercicio de anti-rotacion con polea. La resistencia lateral genera un momento rotatorio que el core neutraliza isometricamente. Activa oblicuos, transverso y multifidos sin carga axial. El ejercicio de core mas especifico para la estabilidad rotacional lumbar.',
  posicion:'De pie o arrodillado de lado a la polea a la altura del pecho. Agarra el tirador con ambas manos frente al pecho.',
  pasos:['Coloca la polea a la altura del pecho. Agarra el tirador con ambas manos.','Alejate de la polea hasta que haya tension en el cable con los brazos pegados al pecho.','Pies al ancho de hombros, ligera flexion de rodillas.','Activa el core. Extiende los brazos hacia adelante lentamente.','Mantén la posicion extendida sin rotar el tronco.','Vuelve los brazos al pecho. Cambiar de lado.'],
  errores:['Rotacion del tronco hacia la polea — el core debe impedirlo.','Demasiado peso — si el tronco rota, reducir la carga.','Pies muy juntos — reducen la base de soporte.','Aguantar la respiracion.'],
  variantes:['S1-2: isometrico pegado al pecho sin extender los brazos.','S3-4: press diagonal completo.','S5-6: press diagonal con paso lateral.','Arrodillado: mas demanda de core puro.'],
  notas_columna:'Las fuerzas rotatorias son de las mas peligrosas para los discos con extrusion. El pallof press entrena especificamente la resistencia a estas fuerzas sin generarlas.',
};

_PORT['l-sit'] = {
  nombre:'L-sit progresion',
  categoria:'Core / Compresion abdominal',
  color:'#993C1D',
  descripcion:'Ejercicio de suspension o apoyo en el que el cuerpo forma una L con las piernas elevadas. Activa el core en compresion, el psoas y el cuadriceps. La progresion va desde pies ligeramente elevados hasta piernas completamente extendidas horizontales.',
  posicion:'Sentado entre dos superficies de apoyo. Manos apoyadas con brazos extendidos empujando para elevar el cuerpo.',
  pasos:['Siéntate entre dos superficies de apoyo (paralelas, cajoneras o manos en el suelo).','Manos en las superficies, brazos extendidos. Empuja hacia abajo para elevar las caderas.','Desde esta posicion, eleva las piernas segun el estadio.','Mantén el tiempo indicado con respiracion continua.','Las escapulas deben estar activas — empujar activamente hacia abajo.'],
  errores:['Escapulas pasivas — hombro sube hacia la oreja.','Piernas que caen — reducir al estadio correcto.','Aguantar la respiracion.','Realizar si hay irradiacion activa — contraindicado.'],
  variantes:['S1-2: pies a 5 cm del suelo, 8 seg.','S3-4: tucked (rodillas al pecho elevadas), 10 seg.','S5-6: tucked 15 seg.','S7+: piernas extendidas horizontales.','F3: en barra (tuck L-sit hang).'],
  notas_columna:'Contraindicado con irradiacion activa — la flexion de cadera bajo carga puede tensar la raiz S1 izquierda a traves del nervio ciatico. S1-2 (pies 5 cm, 8s): la palanca corta minimiza la traccion neural — si aparece cualquier irradiacion, suspender y no retomar hasta semana sin irradiacion. S3-4 (tucked 10s): las rodillas flexionadas acortan el brazo de palanca del psoas y reducen la tension sobre L4-L5. S5-6 (tucked 15s): la resistencia muscular del core profundo se desarrolla — el psoas actua como estabilizador de la columna lumbar en esta posicion. S7+ (piernas extendidas): la palanca maxima genera la mayor activacion del core pero tambien la maxima tension neural — solo en ausencia total de irradiacion durante la semana previa. F3 en barra: añade traccion descompresiva lumbar — el objetivo mas avanzado del protocolo de core.',
};

_PORT['leg-raise-polea'] = {
  nombre:'Leg raise en polea baja',
  categoria:'Core / Flexion de cadera',
  color:'#993C1D',
  descripcion:'Elevacion de piernas en decubito supino con resistencia de polea baja en los tobillos. Activa el psoas y el recto abdominal inferior con carga progresiva. La polea permite regular la resistencia con precision — mucho mas controlable que el leg raise libre.',
  posicion:'Tumbado boca arriba con la cabeza hacia la polea baja. Tobilleras conectadas al cable. Piernas extendidas en el suelo.',
  pasos:['Tumbado boca arriba con cabeza hacia la polea. Tobilleras en los tobillos conectadas al cable.','Aplana la zona lumbar contra el suelo antes de comenzar.','Eleva las piernas lentamente manteniendo la lumbar pegada al suelo.','Si la lumbar se despega antes de los 45 grados, ese es tu rango maximo actual.','Baja las piernas de forma controlada.','PARAR inmediatamente si la lumbar se despega del suelo.'],
  errores:['Lumbar que se despega del suelo — el error critico. Reducir el peso a cero y dominar el rango primero.','Movimiento rapido en la bajada — la bajada excentrica es donde ocurre el trabajo.','Piernas extendidas sin tension core previa.','Realizar con irradiacion activa — contraindicado.'],
  variantes:['S1-4: no introducir — primero dominar dead bug y hollow body.','S5-6: rodillas semiflexionadas, peso minimo, 3x8.','S7+: piernas mas extendidas, 3x10.','F3: piernas rectas rango completo sin polea.'],
  notas_columna:'S1-4 (no introducir): el leg raise exige un nivel de control del core que no esta disponible hasta dominar dead bug y hollow body — introducirlo antes genera extension lumbar bajo carga, exactamente lo contrario de lo que necesitas. S5-6 (rodillas semiflexionadas, peso minimo): las rodillas flexionadas reducen el brazo de palanca a la mitad — si la lumbar se despega con rodillas flexionadas, el ejercicio es prematuro. S7+ (piernas mas extendidas): el aumento de la palanca solo es seguro si la lumbar no se ha despegado en S5-6. F3 (piernas rectas sin polea): el leg raise libre con piernas rectas es el ejercicio de core con mayor activacion de psoas del protocolo — el psoas en este caso actua como estabilizador de L1-L5 con el disco ya reabsorbido. La lumbar despegada del suelo en cualquier repeticion es criterio absoluto de parada — no una advertencia, una parada.',
};

// ══════════════════════════════════════════════
// FIN BLOQUE 2
// ══════════════════════════════════════════════

// ══════════════════════════════════════════════
// BLOQUE 3 — CADENA POSTERIOR GYM
// ══════════════════════════════════════════════

_PORT['rdl-mancuernas'] = {
  nombre:'RDL con mancuernas (Romanian Deadlift)',
  categoria:'Cadena posterior / Patron bisagra',
  color:'#3C3489',
  descripcion:'Bisagra de cadera con mancuernas. Es el patron de movimiento mas importante de tu protocolo: extiende los isquiotibiales y los gluteos mientras mantiene la columna completamente neutra. A diferencia del peso muerto convencional, el RDL no llega al suelo — el rango se limita al punto donde la espalda puede mantenerse neutra.',
  posicion:'De pie, pies al ancho de caderas. Mancuernas frente a los muslos, agarre prono. Rodillas ligeramente flexionadas (10-15 grados) — no bloqueadas.',
  pasos:['De pie con las mancuernas frente a los muslos. Pies al ancho de caderas.','Activa el core y lleva los hombros atras y abajo — escapulas bajas.','Inicia el movimiento empujando las caderas hacia atras (no doblando la espalda).','Las mancuernas deslizan por los muslos hacia abajo mientras el tronco se inclina.','Llega hasta donde la espalda puede mantenerse completamente neutra — para la mayoria esto es hasta la rodilla o ligeramente por debajo.','PARAR si la espalda se redondea — ese es tu rango maximo actual.','Vuelve empujando las caderas hacia adelante hasta la posicion inicial.'],
  errores:['Redondear la espalda lumbar — el error mas peligroso. Reducir el rango hasta que desaparezca.','Flexionar las rodillas en exceso — se convierte en una sentadilla, no en una bisagra.','Mancuernas que se separan del cuerpo — deben rozar los muslos durante todo el recorrido.','Mirar al techo al subir — cuello neutro siempre.','Irradiacion S1 — parar inmediatamente y reducir el rango.'],
  variantes:['S1-2: 8-10 kg, patron y activacion glutea — rango parcial hasta rodillas.','S3-4: 12-14 kg rango parcial hasta rodillas.','S5-6: 16-18 kg rango completo.','S7+: 20 kg+ tecnica impecable — criterio de transicion a F3.'],
  notas_columna:'El RDL es el ejercicio bisagra de referencia de F2. La columna neutra en todo el rango es innegociable: en el momento en que la lumbar se redondea, la presion sobre los discos extruidos L4-L5 y L5-S1 se multiplica. El excentrico (bajada) es la fase mas importante — controlarlo en 3-4 segundos genera adaptacion tendinosa e isquiotibial sin irritar el sistema nervioso. Si aparece irradiacion S1 izquierda durante el ejercicio, parar y sustituir por el seated GM iso hold hasta que ceda.',
};

_PORT['hiperext'] = {
  nombre:'Hiperextension en banco 45 grados',
  categoria:'Cadena posterior / Extensores lumbares',
  color:'#3C3489',
  descripcion:'Ejercicio de extension lumbar y de cadera en banco inclinado a 45 grados. Es el ejercicio principal de fortalecimiento de los extensores lumbares (erector espinal, multifidos) y del gluteo maximo en F2. La progresion comienza con isometricos y avanza hacia el rango completo con carga.',
  posicion:'Banco de hiperextension a 45 grados. Caderas apoyadas en el almohadillado — el borde del acolchado queda justo en el pliegue de la cadera. Pies fijados en los soportes. Brazos cruzados en el pecho o detras de la cabeza.',
  pasos:['Posicionarse en el banco: el almohadillado en el pliegue de la cadera, no en la zona lumbar.','Brazos cruzados en el pecho. Cuerpo en linea con el banco (posicion neutra).','Baja el tronco de forma controlada hasta el angulo del estadio actual.','En la posicion baja: activar el gluteo y los extensores.','Sube volviendo a la posicion neutra — NO hiperextender por encima de la linea del cuerpo.','Excentrico controlado: 3-4 segundos bajando.'],
  errores:['Hiperextender en la cima — la posicion final es horizontal, no arqueada hacia atras.','Almohadillado mal colocado sobre la zona lumbar — debe estar en la cadera.','Movimiento demasiado rapido — el excentrico lento es la clave del ejercicio.','Flexion de rodillas en exceso — reduce la activacion de isquiotibiales.','Mover los brazos para coger impulso — la fuerza viene del gluteo y los extensores.'],
  variantes:['Iso-1 (S1-2): iso hold en posicion neutra 4x25 seg.','Iso-2: iso hold con rango parcial (30 grados de bajada) 4x20 seg.','S2din: rango parcial sin peso 4x10 exc 4 seg.','S3: rango completo sin peso exc 3 seg.','S4: +10 kg 4x10 exc 3 seg.','S5: +20 kg 4x8 exc 3 seg.','S6: +28 kg 4x8.','S7: +40 kg 4x6-8.','A una pierna (unilateral): una pierna fijada en el soporte, la otra libre colgando. Activa el gluteo del lado de trabajo de forma aislada y reduce la carga sobre la columna respecto al bilateral. Introducir en S5+ cuando el bilateral con carga sea solido. Sin peso, rango parcial, 3x8 cada lado. PARAR si aparece irradiacion S1 izquierda al trabajar el lado derecho.'],
  notas_columna:'La hiperextension en banco 45 grados es el ejercicio que mas activa los multifidos y el erector espinal en F2 sin carga axial directa. La progresion comienza obligatoriamente en isometrico porque el disco extruido necesita adaptarse al patron de extension antes de carga dinamica. El criterio de transicion a F3 es completar S7 (40 kg / ~50% del peso corporal) con tecnica impecable y sin irradiacion.',
};

_PORT['elephant-walk'] = {
  nombre:'Elephant walk estatico',
  categoria:'Cadena posterior / Isquiotibiales',
  color:'#3C3489',
  descripcion:'Estiramiento activo isometrico de isquiotibiales con apoyo de manos en una superficie elevada. Las piernas extendidas y el tronco inclinado crean una elongacion de toda la cadena posterior. La version estatica (hold) es la apropiada para F2 — la version dinamica alternando talones se reserva para F3.',
  posicion:'De pie frente a una superficie elevada (banco, barra o pared a la altura apropiada). Manos apoyadas en la superficie. Piernas extendidas. Tronco inclinado hacia adelante en posicion de bisagra.',
  pasos:['Colocate frente a la superficie de apoyo a la altura de tu estadio actual.','Apoya las manos en la superficie y lleva las caderas hacia atras hasta que las piernas esten extendidas.','La espalda debe estar completamente neutra — sin redondear la zona lumbar.','Empuja los talones hacia el suelo activamente — isometrico de isquiotibiales.','Mantén el hold el tiempo indicado respirando normalmente.','PARAR si aparece irradiacion — reducir la altura de las manos.'],
  errores:['Redondear la espalda lumbar — la columna debe ser neutra durante todo el hold.','Flexionar las rodillas — las piernas deben estar extendidas para el estiramiento isquiotibial.','Altura de manos demasiado baja para el estadio actual.','Ignorar la irradiacion — si aparece, subir la altura de apoyo.'],
  variantes:['S1-2: manos en banco alto 60-70 cm, 4x15 seg.','S3-4: banco bajo 40-45 cm, 4x20 seg.','S5-6: cajon bajo 20-25 cm, 4x25 seg.','S7+: manos en el suelo, 4x30 seg.','F3: version dinamica alternando talones.'],
  notas_columna:'S1-2 (manos banco alto 60-70 cm, 15s): el angulo reducido de la bisagra mantiene la tension de isquiotibiales por debajo del umbral de irritacion neural del nervio ciatico. La altura alta de apoyo es la variable de seguridad. S3-4 (banco bajo 40-45 cm, 20s): mayor angulo de bisagra — los isquiotibiales se estiran mas y la tension neural aumenta. Solo avanzar si no hay irradiacion en S1-2. S5-6 (cajon 20-25 cm, 25s): posicion casi paralela al suelo — maxima elongacion de isquiotibiales en este protocolo. Activacion isometrica sostenida de los extensores de cadera. S7+ (manos en suelo, 30s): angulo de bisagra completo. La compresion por la banda iliotibial puede aparecer — reducir si hay tension lateral de rodilla. PARAR siempre si aparece irradiacion — la altura de las manos es la variable de control.',
};

_PORT['good-morning'] = {
  nombre:'Good morning con banda elastica',
  categoria:'Cadena posterior / Patron bisagra',
  color:'#3C3489',
  descripcion:'Patron de bisagra de cadera con resistencia de banda elastica. La banda genera una resistencia proporcional al rango — minima en la posicion inicial y maxima en la cima. Ideal para aprender y reforzar el patron de bisagra sin la carga axial del good morning con barra.',
  posicion:'De pie. Banda elastica bajo los pies y sobre los hombros (como una barra). Pies al ancho de caderas. Rodillas ligeramente flexionadas.',
  pasos:['Coloca la banda bajo los pies y lleva los extremos sobre los hombros — como una sentadilla alta con barra.','Pies al ancho de caderas, rodillas ligeramente flexionadas.','Activa el core. Empuja las caderas hacia atras iniciando la bisagra.','El tronco se inclina hacia adelante manteniendo la espalda completamente neutra.','Llega hasta donde la espalda puede mantenerse neutra — tipicamente paralelo al suelo.','Vuelve empujando las caderas hacia adelante y apretando el gluteo en la cima.'],
  errores:['Redondear la espalda — la columna neutra es innegociable.','Flexionar las rodillas en exceso — se convierte en squat.','Mirar al techo — cuello neutro en todo el rango.','Banda demasiado fuerte para el estadio — comenzar con banda ligera.'],
  variantes:['S1-2: banda ligera 3x12.','S3-4: banda media 3x10.','S5-6: banda fuerte 3x10.','S7+: barra vacia 3x10.','F3: seated GM con barra.'],
  notas_columna:'S1-2 (banda ligera 3x12): la resistencia minima permite practicar el patron de bisagra sin riesgo — el objetivo es aprender a separar el movimiento de la cadera del de la columna, no generar carga. S3-4 (banda media): la mayor resistencia activa los extensores de cadera con mas intensidad — el patron ya debe estar consolidado antes de subir la banda. S5-6 (banda fuerte): cerca del umbral de activacion muscular optima para la cadena posterior — preparacion directa para RDL con mancuernas pesadas. S7+ (barra vacia): la barra añade carga axial minima pero propiocepcion maxima — el tronco siente la posicion neutra con mayor claridad que con banda. F3 (seated GM con barra): transicion al patron con carga axial real. Contraindicacion: si aparece irradiacion durante cualquier estadio, volver al estadio anterior.',
};

_PORT['seated-gm'] = {
  nombre:'Seated GM iso hold (good morning isometrico sentado)',
  categoria:'Cadena posterior / Patron bisagra',
  color:'#3C3489',
  descripcion:'Good morning isometrico en posicion sentada. Trabaja el patron de bisagra de cadera con la columna en descarga, activando los extensores de cadera e isquiotibiales sin carga axial. Es la version mas segura del patron de bisagra y el punto de partida para todos los ejercicios de cadena posterior.',
  posicion:'Sentado en el borde de una silla o banco. Pies plantados al ancho de caderas. Espalda neutra.',
  pasos:['Sentado en el borde de la silla, manos en las caderas o en los muslos.','Activa el core ligeramente — zona lumbar neutra.','Realiza una bisagra de cadera hacia adelante: inclina el tronco desde la cadera, NO desde la espalda.','El movimiento es como una reverencia: el tronco se inclina manteniendo la espalda recta.','Lleva hasta donde la tension de isquiotibiales lo permita sin que la espalda se redondee.','Mantén la posicion isometrica 20-30 seg. Vuelve empujando las caderas hacia adelante.'],
  errores:['Redondear la espalda al inclinarse — toda la inclinacion debe venir de la articulacion de la cadera.','Movimiento demasiado rapido — es un ejercicio de control, no de velocidad.','Llegar mas alla del punto donde la espalda se redondea.','No activar el core — sin tension abdominal minima, la lumbar compensa.'],
  variantes:['F2 inicio: inclinacion minima (20-30 grados) con manos en rodillas como apoyo.','F2 estandar: inclinacion 45 grados iso hold 20-30 seg x3.','F2 avanzada: manos cruzadas en el pecho, sin apoyo.','F3: pasar al good morning de pie con banda elastica.'],
  notas_columna:'El seated GM iso hold es el ejercicio puente entre la movilidad pura y el patron de fuerza en bisagra. Al estar sentado, la carga axial sobre L4-L5 y L5-S1 es minima. La activacion isometrica de los isquiotibiales en elongacion genera una traccion suave sobre los multifidos lumbares que mejora la propiocepcion segmentaria. Prepara directamente el patron para el good morning con banda y el RDL.',
};

_PORT['single-leg-hyper'] = {
  nombre:'Single leg reverse hyper',
  categoria:'Cadena posterior / Extension de cadera',
  color:'#3C3489',
  descripcion:'Extension de cadera unilateral en decubito prono sobre un banco. El tronco apoyado en el banco elimina la carga axial mientras la pierna libre realiza una extension pura de cadera. Activa el gluteo maximo y los isquiotibiales de forma aislada sin comprimir la columna lumbar.',
  posicion:'Tumbado boca abajo sobre el extremo de un banco. Las crestas iliacas en el borde del banco. Manos agarrando los laterales del banco. Una pierna en el suelo, la otra libre.',
  pasos:['Posicionarse boca abajo en el extremo del banco: crestas iliacas en el borde, pecho en el banco.','Manos agarrando los laterales del banco para estabilidad.','Pierna de trabajo colgando libre. Pierna de apoyo en el suelo.','Activa el gluteo de la pierna de trabajo y eleva la pierna hacia el techo.','La extension debe venir de la cadera — no de la zona lumbar. La pelvis no debe rotar.','Sube hasta la horizontal o ligeramente por encima. Baja de forma controlada.','PARAR si aparece irradiacion S1.'],
  errores:['Extension lumbar en lugar de extension de cadera — el movimiento debe ser solo de la articulacion de la cadera.','Rotacion de pelvis al subir la pierna — mantener las crestas iliacas paralelas al banco.','Elevar demasiado — por encima de la horizontal genera hiperextension lumbar.','Movimiento demasiado rapido — control en toda la amplitud.'],
  variantes:['S1-2: sin peso, ROM parcial, 3x8.','S3-4: sin peso, ROM completo, 3x10.','S5-6: tobillera ligera 1-2 kg, 3x12.','S7+: tobillera 3-4 kg, 3x12 exc 2 seg.'],
  notas_columna:'S1-2 (sin peso ROM parcial): el movimiento corto activa el gluteo sin tensar la raiz S1 — detecta desde el primer dia si hay asimetria izq/der. S3-4 (ROM completo): el rango completo exige el gluteo mayor en toda su amplitud — la asimetria de fuerza izq vs der visible en este estadio indica debilidad por afectacion L5-S1 izq. S5-6 (tobillera 1-2kg): la carga añadida aumenta la traccion descompresiva sobre L5-S1 ipsilateral — beneficio doble de activacion y descompresion. S7+ (tobillera 3-4kg): carga progresiva — el marcador de avance es que no aparezca irradiacion S1 al trabajar el lado derecho (que tracciona sobre la raiz izquierda).',
};

_PORT['hiperext-uni'] = {
  nombre:'Hiperextension unilateral en banco 45 grados',
  categoria:'Lumbar unilateral / Extension de cadera',
  color:'#3C3489',
  descripcion:'Hiperextension en banco a 45 grados con una pierna fijada y la otra libre colgando. La asimetria de carga activa el extensor de cadera, el gluteo y el erector espinal ipsilaterales de forma aislada. Detecta y corrige la asimetria de fuerza entre lado izquierdo y derecho — especialmente relevante con afectacion L5-S1 izquierda.',
  posicion:'En el banco de hiperextension a 45 grados. Las caderas en el soporte. Un pie fijado en el apoyo inferior. La otra pierna libre colgando hacia el suelo.',
  pasos:['Posicionarse en el banco con UN SOLO pie fijado en el soporte — el pie de la pierna que trabaja esta libre y cuelga.','La pierna libre cuelga perpendicular al suelo — esto ya genera una ligera asimetria de carga.','Brazos cruzados en el pecho.','Desde la posicion baja: activar el gluteo y el erector del lado de la pierna fijada.','Subir el tronco hasta la posicion horizontal — NO hiperextender.','La pierna libre puede ayudar ligeramente en las primeras semanas, pero el objetivo es que el trabajo venga del lado fijado.','Empezar SIEMPRE por el lado izquierdo para detectar la asimetria.'],
  errores:['Hiperextension por encima de la horizontal — igual que el bilateral.','Rotacion del tronco hacia el lado de la pierna libre — el tronco debe subir en linea recta.','Compensar con la pierna libre empujando el suelo — dejarla colgar libre.','Subir demasiado rapido — el control excentrico es clave.'],
  variantes:['S1-2: sin peso ROM parcial 3x6 cada lado — detectar asimetria.','S3-4: sin peso ROM completo 3x8 — consolidar patron unilateral.','S5-6: tobillera 1kg ROM completo 3x8 exc 3s.','S7+: tobillera 2-3kg 3x8 exc 3s — igualar fuerza izq/der.','F3: tobillera 4kg + pausa 2s en horizontal.'],
  notas_columna:'S1-2 (sin peso ROM parcial): la asimetria de fuerza L izq vs der es maxima en fase aguda — este es el ejercicio que la cuantifica. Si el lado izquierdo es significativamente mas debil, documentarlo como evidencia de afectacion motora L5. S3-4 (ROM completo): el patron unilateral completo activa los multifidos ipsilaterales con mayor especificidad que el bilateral — rehabilitacion directa del segmento afectado. S5-6 (tobillera 1kg): la carga asimetrica obliga a mayor activacion del cuadrado lumbar y el erector ipsilateral para estabilizar — patron funcional que se transfiere a la marcha. S7+ (tobillera 2-3kg): el objetivo es igualar la fuerza entre ambos lados antes de transitar a F3 — la simetria es el criterio de alta funcional.',
};

_PORT['rdl-uni-banco'] = {
  nombre:'RDL unilateral en banco — mancuerna',
  categoria:'Cadena posterior unilateral / Integracion dorsal-cadera',
  color:'#3C3489',
  descripcion:'Romanian Deadlift unilateral realizado en decubito prono sobre un banco con mancuerna en la mano ipsilateral. El tronco apoyado elimina la carga axial. El brazo de trabajo cuelga y realiza simultaneamente la bisagra de cadera (extension) y la retraccion escapular — activando erector espinal, isquiotibial y dorsal inferior del mismo lado en un unico movimiento integrado. Es la variante mas especifica para la rehabilitacion unilateral de L4-L5 y L5-S1.',
  posicion:'Tumbado boca abajo sobre el extremo de un banco. Crestas iliacas en el borde. Mano contralateral agarra el lateral del banco para estabilidad. Mano de trabajo con la mancuerna, brazo colgando perpendicular al suelo. Piernas apoyadas o con una libre.',
  pasos:['Posicionarse boca abajo en el extremo del banco: crestas iliacas en el borde del banco.','Mano contralateral agarra el banco para estabilidad. Mano ipsilateral sostiene la mancuerna — el brazo cuelga recto.','FASE 1 — bisagra: activa el gluteo y el isquiotibial del lado de trabajo — siente como el femur se extiende hacia el techo mientras el brazo cuelga.','FASE 2 — retraccion: retrae la escapula del lado de trabajo llevando el codo hacia el techo — la mancuerna sube siguiendo el cuerpo como en un remo pero sin movimiento activo del codo.','Los dos movimientos ocurren simultaneamente: extension de cadera + retraccion escapular ipsilateral.','Mantén 1s en la posicion alta. Baja de forma controlada en 3s.','El tronco NO rota — permanece plano sobre el banco.'],
  errores:['Rotar el tronco para subir la mancuerna mas alto — el movimiento viene del gluteo y la escapula.','Flexionar el codo activamente como en un remo — el codo solo sube como consecuencia del movimiento de la escapula.','Lumbar que se extiende para ayudar — el banco elimina la carga axial pero no la compensacion lumbar.','No activar el gluteo — el movimiento debe iniciar en la cadera.'],
  variantes:['S1-2: sin peso — patron ROM parcial 3x8 — aprender coordinacion gluteo+escapula.','S3-4: 6-8kg ROM parcial exc 3s.','S5-6: 10-12kg ROM completo exc 3s.','S7+: 14-16kg ROM completo exc 3s pausa 1s arriba.','F3: 18kg+ serie tecnica impecable — criterio de fuerza unilateral.'],
  notas_columna:'S1-2 (sin peso, patron): el objetivo no es la carga sino aprender la coordinacion gluteo-escapula ipsilateral — patron que el cuerpo pierde con el dolor cronico. S3-4 (6-8kg): la carga activa el erector espinal de forma unilateral — los estudios de EMG muestran mayor activacion del multifido ipsilateral en ejercicios unilaterales vs bilaterales. S5-6 (10-12kg): la integracion dorsal-cadera del mismo lado activa la cadena fascial toracolumbar ipsilateral — exactamente el tejido comprometido en la extrusion L4-L5 y L5-S1 izquierda. S7+ (14-16kg): la asimetria de fuerza entre lado izquierdo y derecho en este ejercicio es el indicador mas sensible de recuperacion del segmento afectado — cuando ambos lados igualan la carga, la fase 2 esta completada.',
};

// ══════════════════════════════════════════════
// FIN BLOQUE 3
// ══════════════════════════════════════════════

// ══════════════════════════════════════════════
// BLOQUE 4 — HIP + GLUTEO
// ══════════════════════════════════════════════

_PORT['hip-thrust'] = {
  nombre:'Hip thrust en banco (peso corporal)',
  categoria:'Gluteo / Extension de cadera',
  color:'#993C1D',
  descripcion:'Extension de cadera con el tronco apoyado en un banco. El hip thrust es la evolucion del glute bridge — la posicion con el tronco elevado permite un mayor rango de extension de cadera y una activacion glutea superior. En F2 se realiza con peso corporal hasta dominar la tecnica.',
  posicion:'Sentado en el suelo con la espalda apoyada en el lateral de un banco. Pies plantados al ancho de caderas, rodillas a 90 grados. El borde del banco a la altura de los omoplatos.',
  pasos:['Siéntate en el suelo con la espalda apoyada en el lateral del banco — el borde del banco a la altura de los omoplatos.','Pies plantados al ancho de caderas, rodillas a 90 grados.','Activa el core. Empuja con los talones.','Eleva las caderas hasta que muslos y tronco formen una linea recta — ni mas ni menos.','En la cima: aprieta el gluteo maximo maxima contraccion. Pausa 2 seg.','Baja de forma controlada.'],
  errores:['Hiperextension lumbar en la cima — la posicion final es horizontal, no arqueada.','Empujar con las puntas de pie en lugar de los talones.','Banco mal posicionado — si esta demasiado alto o bajo, el rango se compromete.','Rodillas que caen hacia dentro — mantener alineadas con los pies.','No apretar el gluteo en la cima.'],
  variantes:['S1-2: bilateral con pausa 2 seg x12.','S3-4: bilateral con banda en muslos.','S5-6: unilateral — una pierna extendida.','S7+: bilateral con barra.'],
  notas_columna:'El hip thrust genera mayor activacion del gluteo maximo que el glute bridge por el mayor rango de extension. El gluteo actua como el principal sinergista de la columna lumbar en los movimientos de extension de cadera — un gluteo fuerte reduce directamente la carga en L4-L5 y L5-S1. La posicion no genera carga axial en F2 (sin barra), por lo que es segura para discopatia activa.',
};

_PORT['hip-cars'] = {
  nombre:'Hip CARs (Controlled Articular Rotations)',
  categoria:'Movilidad articular / Cadera',
  color:'#1E8A7A',
  descripcion:'Rotaciones articulares controladas de cadera en toda la amplitud disponible sin dolor. El objetivo es mantener y explorar el rango de movimiento activo de la articulacion de la cadera, manteniendo el tronco completamente estatico. Es movilidad activa — el movimiento es generado por los musculos de la cadera, no por la gravedad.',
  posicion:'De pie apoyado en una pared o superficie estable. Peso en la pierna de apoyo. La pierna de trabajo libre.',
  pasos:['Apoyate en una pared con la mano del lado de apoyo. Peso en la pierna de apoyo.','Eleva la rodilla de la pierna de trabajo hacia el pecho.','Desde esa posicion, lleva la rodilla hacia afuera (abduccion y rotacion externa).','Continua el arco llevando la rodilla hacia atras (extension de cadera) y de vuelta al inicio.','El circulo debe ser lo mas amplio posible dentro del rango sin dolor.','El tronco permanece completamente estatico durante todo el movimiento.','Haz el mismo numero de repeticiones en sentido contrario.'],
  errores:['Tronco que rota o se inclina — el movimiento debe ser solo de la articulacion de la cadera.','Rango de movimiento forzado — ir hasta donde el control activo lo permite.','Movimiento demasiado rapido — lento y controlado para que sea activo.','Compensar con la columna lumbar — si la lumbar se mueve, reducir el rango.'],
  variantes:['Version reducida en dia neural: rango 50-60% del maximo, muy lento.','Version cuadrupedia: apoyado en manos y rodillas, mas estabilidad.','Version tumbado lateral: para personas con dificultad de equilibrio.'],
  notas_columna:'Los Hip CARs mantienen la salud articular de la cadera y la propiocepcion de la articulacion coxofemoral. Una cadera con buen rango activo reduce las compensaciones en la columna lumbar — cuando la cadera no tiene movilidad suficiente, la lumbar asume el movimiento y se sobrecargan los discos. Realizarlos diariamente antes de la sesion.',
};

_PORT['outer-hip'] = {
  nombre:'Outer hip dropset (rotadores externos en progresion)',
  categoria:'Movilidad / Rotadores externos',
  color:'#1E8A7A',
  descripcion:'Serie de tres posiciones progresivas para los rotadores externos de cadera (piriforme, obturador, gemelos) realizadas como dropset: desde la posicion mas facil (pie) hasta la mas intensa (pierna extendida). Cada posicion aumenta la palanca y la intensidad del estiramiento.',
  posicion:'Tumbado boca arriba. La pierna a trabajar con el tobillo cruzado sobre la rodilla contraria (figura 4).',
  pasos:['Tumbado boca arriba. Cruza el tobillo derecho sobre la rodilla izquierda — figura 4.','Nivel 1 (pie): mantén esta posicion basica 30 seg. El piriforme se estira con el simple cruce.','Nivel 2 (rodilla): lleva ambas piernas hacia el pecho agarrando el muslo de la pierna de apoyo. Aumenta la intensidad.','Nivel 3 (pierna extendida): estira completamente la pierna de apoyo hacia el techo mientras mantienes el cruce. Maxima intensidad.','En cada nivel: mantén 20-30 seg. Si aparece irradiacion en nivel 3, quedate en nivel 2.','Cambiar de lado.'],
  errores:['Forzar la pierna cruzada hacia el suelo — el estiramiento viene del cruce, no de la presion.','Levantar la cabeza y el cuello del suelo.','Continuar si aparece irradiacion — el nivel 3 puede irritar el nervio ciatico.','No respetar la progresion de niveles.'],
  variantes:['Dia neural: solo niveles 1-2.','Version sentado en silla: cruzar el tobillo sobre la rodilla y inclinar el tronco hacia adelante.','Con banda alrededor del muslo: para anadir resistencia en nivel 1-2.'],
  notas_columna:'El piriforme tiene una relacion directa con el nervio ciatico — en muchos casos de ciatalgia, el piriforme comprimido contribuye a la irritacion del nervio. En tu caso, la extrusion izquierda L5-S1 ya irrita el S1 — el outer hip dropset reduce la tension adicional del piriforme sobre el nervio. Comenzar siempre por el lado derecho. El nivel 3 izquierdo solo si no hay irradiacion activa.',
};

_PORT['inner-hip'] = {
  nombre:'Inner hip dropset (rotadores internos en progresion)',
  categoria:'Movilidad / Rotadores internos',
  color:'#1E8A7A',
  descripcion:'Serie de tres posiciones progresivas para los rotadores internos de cadera realizadas como dropset. Complementa el outer hip dropset equilibrando la movilidad rotacional de la articulacion de la cadera. Los rotadores internos (gluteo menor, TFL) son frecuentemente rigidos en personas con discopatia lumbar.',
  posicion:'Tumbado boca arriba. La pierna a trabajar con la rodilla flexionada y el pie hacia fuera (rotacion interna de cadera).',
  pasos:['Tumbado boca arriba. Flexiona la rodilla derecha a 90 grados, pie apoyado en el suelo.','Lleva el pie hacia afuera (hacia la derecha si trabajas la pierna derecha) — la rodilla cae hacia dentro. Esto es rotacion interna de cadera.','Nivel 1 (pie): mantén el pie fuera con la rodilla en el suelo 30 seg.','Nivel 2 (rodilla): desde la posicion de pie fuera, lleva la rodilla al suelo hacia el lado contrario activamente.','Nivel 3 (pierna extendida): extiende la pierna manteniendo la rotacion interna maxima.','Cambiar de lado.'],
  errores:['Rotacion de pelvis para compensar la falta de rotacion interna — el movimiento debe ser solo de la cadera.','Forzar el nivel 3 sin haber dominado el nivel 1-2.','Continuar si aparece irradiacion en el nivel 3.'],
  variantes:['Dia neural: solo niveles 1-2.','Version sentado: sentado en el suelo con rodillas flexionadas, dejar caer ambas rodillas hacia el mismo lado.','90/90 stretch activo: posicion de 90/90 para trabajar ambas rotaciones simultaneamente.'],
  notas_columna:'El equilibrio entre rotacion interna y externa de cadera es fundamental para la mecanica lumbar. Una cadera rigida en rotacion interna (comun en sedentarios) fuerza compensaciones en la lumbar durante actividades como caminar, subir escaleras o agacharse. Los inner hip dropsets corrigen este patron y reducen las fuerzas de torsion sobre L4-L5 y L5-S1.',
};

_PORT['pigeon-pose'] = {
  nombre:'Pigeon pose en banco',
  categoria:'Estiramiento / Piriforme',
  color:'#1E8A7A',
  descripcion:'Estiramiento del piriforme y los rotadores externos profundos de la cadera en posicion modificada sobre un banco. La version en banco es mas segura que la version en el suelo porque permite controlar mejor la intensidad y no requiere movilidad extrema de cadera ni de rodilla.',
  posicion:'De pie frente a un banco. Una pierna apoyada en el banco con la espinilla horizontal — rodilla flexionada a 90 grados, tobillo en el borde opuesto del banco. La otra pierna en el suelo.',
  pasos:['De pie frente al banco. Coloca la espinilla de la pierna a estirar en el banco — rodilla a 90 grados, tobillo apoyado en el borde opuesto.','La pierna de apoyo en el suelo, ligeramente flexionada.','Mantén el tronco erguido. Activa el core.','Para aumentar el estiramiento: inclina el tronco hacia adelante desde la cadera (no desde la espalda).','El estiramiento debe sentirse en la nalga y la cadera lateral de la pierna apoyada en el banco.','Mantén el tiempo indicado. Comenzar siempre por el lado izquierdo (L5-S1 afectado).'],
  errores:['Inclinar el tronco desde la espalda en lugar de desde la cadera.','Rodilla de la pierna apoyada en posicion de dolor — si hay dolor en la rodilla, no en la cadera, ajustar la posicion.','Demasiada inclinacion de tronco al inicio — progresar gradualmente.','No comenzar por el lado izquierdo.'],
  variantes:['Version pasiva: mantener el tronco erguido sin inclinacion.','Version activa: inclinacion progresiva del tronco hacia adelante.','En escalerilla de piscina: la flotacion reduce el peso corporal y facilita el estiramiento.','En suelo (pigeon clasico): para estadios mas avanzados con mayor movilidad de cadera.'],
  notas_columna:'El piriforme tiene una insercion proxima al nervio ciatico — su rigidez puede comprimir o irritar el nervio adicionalmente a la compresion radicular ya existente en L5-S1. El pigeon pose en banco estira el piriforme izquierdo, reduciendo la tension adicional sobre el nervio S1. Comenzar siempre por el lado izquierdo porque es el mas afectado y el que mas necesita el estiramiento.',
};

_PORT['clamshell'] = {
  nombre:'Clamshell con banda elastica',
  categoria:'Gluteo medio / Rotadores externos',
  color:'#993C1D',
  descripcion:'Abduccion y rotacion externa de cadera en decubito lateral con banda elastica. Activa el gluteo medio y los rotadores externos profundos de cadera. El gluteo medio es el principal estabilizador lateral de la pelvis y su debilidad contribuye al colapso pelvico durante la marcha y los ejercicios de carga.',
  posicion:'Tumbado de lado. Cadera y rodillas flexionadas a 45-60 grados. Pies juntos. Banda elastica alrededor de los muslos justo por encima de las rodillas.',
  pasos:['Tumbado de lado, cadera y rodillas flexionadas a 45-60 grados. Pies apilados uno sobre el otro.','Banda elastica en los muslos, por encima de las rodillas.','Mantén los pies juntos durante todo el movimiento.','Abre la rodilla superior hacia el techo — como una almeja que se abre.','El movimiento es puro de abduccion y rotacion externa de cadera — la pelvis no debe rotar hacia atras.','Baja de forma controlada. Repetir el numero indicado. Cambiar de lado.'],
  errores:['Pelvis que rota hacia atras al abrir la rodilla — indica que el gluteo medio no puede solo y la pelvis compensa.','Rango de movimiento excesivo — llegar solo hasta donde la pelvis no rote.','Pies que se separan — mantenerlos juntos garantiza la rotacion externa.','Movimiento demasiado rapido — control en todo el rango.'],
  variantes:['Sin banda: version inicial si la banda genera irradiacion.','Banda ligera: version estandar F2.','Banda media: progresion.','Clamshell dinamico (en calentamiento): version mas rapida sin pausa.'],
  notas_columna:'Sin banda (inicio): si la banda genera irradiacion al activar el gluteo medio izquierdo, indica sensibilizacion neural alta — hacer sin banda hasta que la irradiacion remita. Banda ligera (F2 estandar): activa el gluteo medio con resistencia suficiente para reentrenar la inhibicion por dolor cronico — el dolor lumbar inhibe el gluteo medio ipsilateral de forma refleja. Banda media (progresion): mayor activacion — el criterio de avance es que la pelvis no rote en ninguna repeticion. Dinamico (calentamiento): version rapida pre-ejercicio para preactivar el gluteo medio antes de los patrones de carga. Un gluteo medio izquierdo debil genera colapso pelvico contralateral (trendelenburg) en la marcha, lo que aumenta las fuerzas de cizalla sobre L5-S1 izquierdo — exactamente la zona afectada.',
};

_PORT['monster-walk'] = {
  nombre:'Monster walk lateral con banda',
  categoria:'Gluteo medio / Activacion',
  color:'#993C1D',
  descripcion:'Marcha lateral con banda elastica en los muslos. Activa el gluteo medio de forma dinamica en un patron funcional — la marcha lateral imita los patrones de carga que ocurren durante la marcha y los deportes. Es el ejercicio de activacion de gluteo medio mas funcional del protocolo.',
  posicion:'De pie. Banda elastica alrededor de los muslos o justo por encima de las rodillas. Pies al ancho de caderas. Ligera flexion de rodillas (posicion atletica).',
  pasos:['Banda elastica en los muslos. Posicion atletica: ligera flexion de rodillas, tronco ligeramente inclinado hacia adelante con espalda neutra.','Paso lateral con el pie derecho — separar mas alla del ancho de caderas.','Arrastra el pie izquierdo hasta volver al ancho de caderas. No juntes los pies completamente.','Mantén la tension en la banda durante todo el trayecto — los pies nunca deben acercarse tanto que la banda se afloje.','Realiza los pasos indicados en una direccion, luego vuelve en la direccion contraria.','La pelvis debe mantenerse nivelada durante todo el movimiento.'],
  errores:['Pelvis que oscila lateralmente — el movimiento debe ser de los pies, la pelvis permanece estable.','Pasos demasiado rapidos — el control del gluteo medio se pierde con la velocidad.','Juntrar los pies completamente — se pierde la tension de la banda y el estimulo.','Tronco inclinado en exceso o espalda redondeada.'],
  variantes:['Banda en tobillos: mayor activacion del gluteo medio pero mayor riesgo de irradiacion si hay sensibilizacion neural.','Hacia adelante y atras (monster walk frontal): activa el gluteo en extension.','Con sentadilla entre pasos: mayor demanda funcional — para S5+.'],
  notas_columna:'Banda en muslos (F2 estandar): la posicion proximal de la banda reduce la tension neural en el trayecto del nervio ciatico — preferible a la banda en tobillos con irradiacion activa. Banda en tobillos: mayor palanca y activacion del gluteo medio, pero puede irritar el nervio ciatico si hay sensibilizacion — solo sin irradiacion. Monster walk frontal: activa el gluteo en extension — patron mas especifico para la transferencia a la marcha. Con sentadilla entre pasos (S5+): la mayor demanda funcional integra el patron en un contexto mas real. La pelvis que oscila lateralmente al caminar (colapso de Trendelenburg) es el signo de que el gluteo medio no esta compensando la carga — este ejercicio entrena especificamente esa debilidad.',
};

_PORT['cable-kickback'] = {
  nombre:'Cable kickback en polea baja',
  categoria:'Gluteo / Extension de cadera pura',
  color:'#993C1D',
  descripcion:'Extension de cadera con cable en polea baja. Aislamiento del gluteo maximo en el patron de extension sin involucrar los isquiotibiales de forma relevante. La polea permite una tension constante durante todo el rango a diferencia de los ejercicios con peso libre.',
  posicion:'De pie frente a la polea baja. Tobillera en el tobillo de la pierna de trabajo. Manos apoyadas en la maquina para estabilidad. Ligera inclinacion del tronco hacia adelante.',
  pasos:['Coloca la tobillera en el tobillo de trabajo. Alejate lo suficiente para que haya tension en el cable con la pierna en posicion neutra.','Apoyate en la maquina con ambas manos. Ligera inclinacion del tronco — espalda neutra.','Lleva la pierna de trabajo hacia atras en extension de cadera pura.','El movimiento es solo de la articulacion de la cadera — la rodilla no se flexiona.','Llega hasta donde el gluteo alcanza la maxima contraccion sin que la lumbar se extienda.','Vuelve de forma controlada. Cambiar de lado.'],
  errores:['Extension lumbar en lugar de extension de cadera — el movimiento debe ser solo de la cadera.','Flexion de rodilla durante el kickback — pierde el aislamiento del gluteo.','Rotacion de pelvis al elevar la pierna — la pelvis permanece cuadrada.','Demasiado peso — si la tecnica falla, reducir el peso.'],
  variantes:['Con rodilla flexionada a 90 grados: activa mas el gluteo y menos el isquiotibial.','Unilateral con pausa en la cima: mayor activacion.','Con tobillera y banda: combinacion de resistencia constante y variable.'],
  notas_columna:'Extension pura de cadera sin carga axial: el gluteo maximo se activa como motor de extension sin que la columna lumbar tenga que estabilizarse bajo carga — util en dias de alta sensibilidad lumbar. Con rodilla flexionada 90°: mayor aislamiento del gluteo mayor y menor participacion del isquiotibial — mas especifico cuando hay tension neural posterior. Con pausa en la cima: la contraccion isometrica sostenida del gluteo mayor estabiliza la articulacion sacroiliaca directamente — la sacroiliaca inestable es una complicacion frecuente de la discopatia lumbar. La clave absoluta: si la lumbar se arquea para llevar la pierna mas atras, la carga se transfiere a los discos extruidos — el rango util es solo hasta donde el gluteo es el motor.',
};

// ══════════════════════════════════════════════
// FIN BLOQUE 4
// ══════════════════════════════════════════════

// ══════════════════════════════════════════════
// BLOQUE 5 — SQUAT + PIERNA
// ══════════════════════════════════════════════

_PORT['prensa'] = {
  nombre:'Prensa inclinada 45 grados',
  categoria:'Cuadriceps / Patron squat sin carga axial',
  color:'#3C3489',
  descripcion:'Patron de squat en maquina inclinada a 45 grados. Trabaja cuadriceps, gluteos e isquiotibiales sin la carga axial que genera la sentadilla con barra. Es el ejercicio principal de patron de squat en F2 porque la inclinacion traslada la fuerza de reaccion del suelo lejos de la columna vertebral.',
  posicion:'Sentado en la maquina de prensa inclinada. Espalda y cabeza completamente apoyadas en el respaldo. Pies en la plataforma al ancho de caderas o ligeramente mas ancho. Rodillas a 90 grados en la posicion de partida.',
  pasos:['Sentarse en la maquina con la espalda completamente apoyada.','Pies en la plataforma al ancho de caderas — puntas ligeramente hacia fuera (15-30 grados).','Desbloquea los seguros de la maquina.','Flexiona las rodillas bajando la plataforma de forma controlada — descenso 3 seg.','Llega hasta donde las rodillas formen 90 grados o hasta donde la zona lumbar no se despegue del respaldo.','Empuja con los talones hasta la extension casi completa — no bloquear las rodillas.','NUNCA dejar que la zona lumbar se despegue del respaldo — ese es el limite del rango.'],
  errores:['Zona lumbar que se despega del respaldo — indica demasiado rango o demasiado peso.','Rodillas que caen hacia dentro — mantener alineadas con los pies.','Bloquear las rodillas en la extension — mantener una ligera flexion.','Pies demasiado bajos en la plataforma — activa mas cuadriceps y menos gluteo.','Descenso demasiado rapido — el control excentrico es fundamental.'],
  variantes:['S1-2: carga ligera con talones elevados — reduce la demanda de flexibilidad de tobillo.','S3-4: carga media.','S5-6: rango completo.','S7+: unilateral — una pierna a la vez.'],
  notas_columna:'S1-2 (carga ligera talones elevados): los talones elevados (disco o cuna) compensan la limitacion de movilidad de tobillo — el tronco puede mantenerse mas erguido y la lumbar no se despega del respaldo. La carga ligera en S1-2 permite aprender el patron sin riesgo. S3-4 (carga media): el incremento de carga solo es seguro si la zona lumbar no se ha despegado del respaldo en ningun momento de S1-2. S5-6 (rango completo): el rango completo exige que los isquiotibiales permitan la flexion maxima de cadera sin que la pelvis se retroverse — si la lumbar se despega, reducir el rango. S7+ (unilateral): la prensa unilateral detecta asimetrias de fuerza pierna izq vs der — util como indicador clinico de afectacion motora. La zona lumbar despegada del respaldo es la señal de alarma absoluta — en ese momento la carga se traslada directamente a los discos extruidos.',
};

_PORT['bulgara'] = {
  nombre:'Sentadilla bulgara (split squat elevado)',
  categoria:'Cuadriceps / Gluteo unilateral',
  color:'#3C3489',
  descripcion:'Sentadilla unilateral con el pie trasero elevado en un banco. Trabaja el cuadriceps, el gluteo maximo y los estabilizadores del tren inferior de forma unilateral. La posicion split reduce la carga axial sobre la columna en comparacion con la sentadilla bilateral con barra.',
  posicion:'De pie frente a un banco. Pie trasero apoyado en el banco en el empeine. Pie delantero suficientemente adelantado para que la rodilla no supere la punta del pie al bajar.',
  pasos:['Posicionarse con el pie trasero en el banco (empeine apoyado) y el pie delantero adelantado.','El pie delantero a una distancia tal que al bajar la rodilla quede sobre el tobillo.','Tronco completamente erguido — no inclinarse hacia adelante.','Baja flexionando la rodilla delantera hasta que la rodilla trasera casi toque el suelo.','La rodilla delantera no debe superar la punta del pie.','Sube empujando con el talon del pie delantero.'],
  errores:['Tronco inclinado hacia adelante — aumenta la carga lumbar. Tronco erguido siempre.','Rodilla delantera que supera la punta del pie — alejar mas el pie delantero.','Rodilla delantera que cae hacia dentro — alinear con el pie.','Pie trasero en la punta en lugar del empeine — inestabilidad y carga en el tobillo.'],
  variantes:['S1-2: no introducir.','S3-4: peso corporal ROM parcial.','S5-6: peso corporal ROM completo.','S7+: mancuernas ligeras.','F3: barra.'],
  notas_columna:'S1-2 (no introducir): requiere un core ya consolidado y ausencia de irradiacion — no es segura con reagudizacion activa S1. S3-4 (peso corporal ROM parcial): el ROM parcial reduce la carga lumbar — el tronco erguido es el criterio de tecnica, no la profundidad. S5-6 (peso corporal ROM completo): el rango completo exige mayor activacion del gluteo mayor y menor del cuadriceps — patron mas funcional. S7+ (mancuernas ligeras): la carga externa solo es segura si el tronco se mantiene erguido con ROM completo sin carga. La inclinacion del tronco hacia adelante es la señal de alarma — indica que el cuadriceps esta compensando al gluteo, lo que transfiere carga a la columna lumbar. El tronco erguido en la bulgara es clinicamente mas exigente que en la prensa, lo que la hace mas avanzada en el protocolo.',
};

_PORT['step-up'] = {
  nombre:'Step up al banco',
  categoria:'Cuadriceps / Gluteo / Patron funcional',
  color:'#3C3489',
  descripcion:'Subida unilateral a un banco o cajon. Patron funcional que activa el cuadriceps, el gluteo maximo y el gluteo medio de forma simultanea. Imita el patron de subir escaleras y es uno de los ejercicios de pierna mas seguros para la columna lumbar porque la carga axial es minima.',
  posicion:'De pie frente al banco a la altura del estadio actual. Una pierna sube al banco, la otra permanece en el suelo.',
  pasos:['De pie frente al banco. Coloca el pie completo de la pierna de trabajo en el banco.','El talon debe estar completamente apoyado en el banco — no solo la punta.','Empuja con el talon de la pierna elevada para subir — la pierna del suelo ayuda lo minimo posible.','En la cima: extiende completamente la pierna de trabajo. La pierna libre cuelga o se eleva.','Baja de forma controlada en 3 seg — el excentrico es el trabajo principal.','Alterna o completa todas las reps del mismo lado antes de cambiar.'],
  errores:['Empujar con la pierna del suelo en lugar de con la pierna del banco.','Talon que no contacta completamente el banco — solo la punta del pie.','Tronco inclinado hacia adelante en exceso.','Bajada rapida — el excentrico controlado es fundamental.','Rodilla de la pierna de trabajo que cae hacia dentro al subir.'],
  variantes:['S1-2: escalon bajo 20 cm.','S3-4: banco 35-40 cm.','S5-6: banco + pausa arriba 2 seg.','S7+: mancuernas ligeras.'],
  notas_columna:'S1-2 (escalon 20 cm): la altura baja reduce el angulo de flexion de cadera y la demanda de estabilizacion pelvica — el paso de la pierna libre no genera moment de cizalla sobre L5-S1. S3-4 (banco 35-40 cm): la mayor altura aumenta el trabajo del gluteo mayor — el talon completo apoyado es el marcador de la buena tecnica en este estadio. S5-6 (banco + pausa 2s arriba): la pausa en la cima exige equilibrio unilateral completo — activa el gluteo medio del lado de trabajo de forma sostenida. La asimetria de fuerza (si el lado izquierdo requiere mas ayuda de la pierna libre) indica debilidad de cuadriceps o gluteo por afectacion L4-L5 izquierda. S7+ (mancuernas): solo con patron perfecto — el excentrico controlado de bajada es donde ocurre el mayor estimulo.',
};

_PORT['wall-sit'] = {
  nombre:'Wall sit isometrico',
  categoria:'Cuadriceps / Isometrico',
  color:'#3C3489',
  descripcion:'Sentadilla isometrica contra la pared. Activa el cuadriceps de forma pura sin carga axial — la pared absorbe las fuerzas de reaccion. Es el ejercicio de cuadriceps mas seguro para discopatia lumbar porque elimina completamente la carga compresiva sobre la columna.',
  posicion:'De pie con la espalda apoyada en la pared. Deslizarse hasta que las rodillas formen 90 grados. Pies al ancho de caderas, algo separados de la pared.',
  pasos:['Apoya la espalda completamente contra la pared — toda la espalda en contacto.','Desliza los pies hacia adelante y baja hasta que las rodillas formen 90 grados.','Los pies deben estar suficientemente adelantados para que las rodillas no superen los tobillos.','Mantén la posicion el tiempo indicado. Respiracion continua.','La zona lumbar debe mantenerse apoyada en la pared — sin espacio.','Para subir: desliza la espalda por la pared hasta la posicion inicial.'],
  errores:['Zona lumbar despegada de la pared — hiperlordosis compensatoria.','Rodillas que superan los tobillos — pies demasiado cerca de la pared.','Rodillas que caen hacia dentro — activar el gluteo para mantener la alineacion.','Aguantar la respiracion.'],
  variantes:['S1-2: angulo 100-110 grados, 20 seg.','S3-4: 90 grados, 30 seg.','S5-6: 90 grados, 45 seg.','S7+: unilateral, 20 seg.'],
  notas_columna:'S1-2 (angulo 100-110°, 20s): el angulo obtuso reduce la carga isometrica sobre el cuadriceps y la demanda de flexion de cadera — la zona lumbar se mantiene facilmente apoyada en la pared. S3-4 (90°, 30s): el angulo recto es el maximo estimulo de cuadriceps sin carga axial — la pared absorbe toda la fuerza de reaccion. S5-6 (90°, 45s): el tiempo añadido desarrolla la resistencia muscular — mas tiempo bajo tension sin mayor riesgo lumbar. S7+ (unilateral, 20s): la version unilateral detecta asimetria de fuerza cuadriceps izq vs der — la debilidad del cuadriceps izquierdo es un signo clinico de afectacion L4 (el cuadriceps esta inervado principalmente por L4). La zona lumbar despegada de la pared en cualquier estadio indica hiperlordosis compensatoria — reducir el angulo o el tiempo.',
};

_PORT['reverse-lunge'] = {
  nombre:'Reverse lunge (zancada hacia atras)',
  categoria:'Cuadriceps / Gluteo / Patron unilateral',
  color:'#3C3489',
  descripcion:'Zancada hacia atras. A diferencia de la zancada frontal, el paso hacia atras genera menos carga lumbar porque el momento de fuerza anterior es menor. El tronco se mantiene mas erguido de forma natural, reduciendo la tension sobre los discos lumbares.',
  posicion:'De pie, pies juntos. El tronco erguido, core activo.',
  pasos:['De pie con tronco erguido y core activo.','Da un paso largo hacia atras con la pierna de trabajo.','La rodilla trasera desciende casi hasta el suelo sin tocarlo.','La rodilla delantera se mantiene sobre el tobillo delantero — no supera la punta del pie.','El tronco permanece completamente erguido durante todo el movimiento.','Empuja con el talon delantero para volver a la posicion inicial.','Alterna piernas o completa todas las reps del mismo lado.'],
  errores:['Tronco inclinado hacia adelante — aumenta la carga lumbar.','Rodilla trasera que toca el suelo bruscamente.','Rodilla delantera que supera la punta del pie.','Paso trasero demasiado corto — reduce el rango y la activacion glutea.'],
  variantes:['S1-2: no introducir.','S3-4: peso corporal.','S5-6: pausa abajo 2 seg.','S7+: mancuernas ligeras.'],
  notas_columna:'S1-2 (no introducir): el paso dinamico hacia atras requiere coordinacion y estabilidad de core consolidadas — con irradiacion activa el riesgo de compensacion lumbar es alto. S3-4 (peso corporal): el paso hacia atras mantiene el centro de masa cercano a la base de soporte — el tronco se mantiene mas erguido de forma natural que en el lunge frontal, reduciendo el momento de flexion lumbar. S5-6 (pausa 2s abajo): la pausa exige estabilizacion activa del core en la posicion de maxima demanda — activa el gluteo medio del lado delantero de forma sostenida. S7+ (mancuernas ligeras): la carga externa solo es segura si el tronco se mantiene erguido durante todo el rango. La diferencia clinica con el lunge frontal es que el reverse lunge genera ~30% menos carga lumbar — siempre preferible en F2.',
};

_PORT['sumo-banda'] = {
  nombre:'Sentadilla sumo con banda',
  categoria:'Cuadriceps / Gluteo medio / Aductores',
  color:'#3C3489',
  descripcion:'Sentadilla con postura amplia y banda elastica en los muslos. La postura sumo (pies muy abiertos, puntas hacia fuera) activa mas el gluteo medio y los aductores que la sentadilla convencional. La banda en los muslos anade activacion del gluteo medio para resistir la tendencia de las rodillas a caer hacia dentro.',
  posicion:'De pie con los pies mas anchos que los hombros. Puntas hacia fuera 45 grados. Banda elastica por encima de las rodillas. Tronco erguido.',
  pasos:['Posicion sumo: pies anchos, puntas a 45 grados. Banda en muslos.','Activa el core y mantén el tronco erguido durante todo el movimiento.','Empuja las rodillas hacia fuera (contra la banda) mientras bajas.','Baja de forma controlada hasta el rango del estadio actual.','Las rodillas deben estar alineadas con los pies durante todo el rango — no dejarlas caer hacia dentro.','Sube empujando con los talones y apretando el gluteo en la cima.'],
  errores:['Rodillas que caen hacia dentro — la banda debe generar resistencia activa.','Tronco inclinado hacia adelante en exceso.','Talones que se elevan del suelo — falta de movilidad de tobillo.','Lumbar que se redondea en la posicion baja.'],
  variantes:['S1-2: banda ligera ROM parcial.','S3-4: banda media ROM completo.','S5-6: banda fuerte.','S7+: mancuerna goblet (sostenida al pecho).'],
  notas_columna:'S1-2 (banda ligera ROM parcial): el ROM parcial con banda ligera permite aprender el patron sumo sin exigir movilidad de cadera completa — util en la fase de mayor rigidez matutina. S3-4 (banda media ROM completo): el ROM completo activa el gluteo medio de forma maxima en la posicion baja — la banda obliga a las rodillas a seguir los pies en todo el rango. S5-6 (banda fuerte): mayor resistencia a la abduccion — el gluteo medio trabaja contra la banda durante todo el movimiento, no solo en la subida. S7+ (mancuerna goblet): la mancuerna al pecho actua como contrapeso que facilita mantener el tronco erguido — patron mas eficiente para el cuadriceps y el gluteo simultaneamente. La postura sumo reduce la demanda de movilidad de tobillo respecto a la sentadilla convencional — ventaja para quien tiene rigidez de tobillo post-sedentarismo.',
};

_PORT['sentadilla-bw'] = {
  nombre:'Sentadilla bodyweight con pausa',
  categoria:'Cuadriceps / Patron squat',
  color:'#1E8A7A',
  descripcion:'Sentadilla con peso corporal y pausa en la posicion baja. Sin carga adicional, sirve como calentamiento del patron de squat y como evaluacion del rango de movimiento disponible. La pausa en la posicion baja mejora la movilidad de tobillo, cadera y toracica.',
  posicion:'De pie, pies al ancho de hombros o ligeramente mas. Puntas ligeramente hacia fuera. Brazos extendidos al frente para contrapeso.',
  pasos:['De pie, pies al ancho de hombros, puntas ligeramente hacia fuera.','Brazos extendidos hacia adelante para contrapeso.','Baja de forma controlada flexionando rodillas y caderas simultaneamente.','El tronco se inclina ligeramente hacia adelante — esto es normal.','La zona lumbar debe mantenerse neutra — no redondearse en la posicion baja.','Mantén la pausa indicada en la posicion baja.','Sube empujando con los talones.'],
  errores:['Lumbar redondeada en la posicion baja (butt wink) — indica falta de movilidad de cadera o tobillo.','Talones que se elevan — falta de movilidad de tobillo.','Rodillas que caen hacia dentro.','Tronco demasiado erguido — puede causar caida hacia atras.'],
  variantes:['Con pausa 2 seg: calentamiento y evaluacion de rango.','Con talon elevado (disco bajo talon): reduce la demanda de movilidad de tobillo.','Como criterio de evaluacion: squat a profundidad completa con tronco erguido es criterio F3.'],
  notas_columna:'La sentadilla bodyweight es el primer ejercicio de squat que se introduce en F2 — solo como calentamiento y evaluacion. Si hay dolor lumbar durante la sentadilla bodyweight, no progresar a ejercicios de squat con carga. La lumbar redondeada en la posicion baja (butt wink) indica que el rango actual supera la movilidad disponible — reducir la profundidad.',
};

// ══════════════════════════════════════════════
// FIN BLOQUE 5
// ══════════════════════════════════════════════

// ══════════════════════════════════════════════
// BLOQUE 6 — TIRO + EMPUJE GYM
// ══════════════════════════════════════════════

_PORT['jalon-ancho'] = {
  nombre:'Jalon al pecho agarre ancho',
  categoria:'Dorsal / Tiro vertical',
  color:'#3C3489',
  descripcion:'Tiro vertical con agarre ancho en maquina de jalon. Trabaja el dorsal ancho, el redondo mayor, el biceps y los estabilizadores escapulares. El agarre ancho enfatiza la parte externa del dorsal y la retraccion escapular. El excentrico lento es fundamental para el desarrollo del dorsal.',
  posicion:'Sentado en la maquina con las rodillas bajo los apoyos. Agarre prono ancho en la barra — manos a 1.5 veces el ancho de hombros. Tronco ligeramente inclinado hacia atras (10-15 grados).',
  pasos:['Sentarse bajo la barra. Agarre prono ancho. Rodillas bajo los apoyos de la maquina.','Ligera inclinacion del tronco hacia atras — mantener esta posicion durante todo el ejercicio.','Retrae las escapulas antes de iniciar el tirón — llevar los hombros atras y abajo.','Tira de la barra hacia el pecho superior manteniendo los codos apuntando hacia abajo y hacia atras.','La barra debe llegar a la altura del mentón o el pecho superior.','Vuelve de forma controlada en el excentrico — 3-4 segundos.'],
  errores:['Columna lumbar que se flexiona al tirar — tronco estable durante todo el movimiento.','Codos que apuntan hacia fuera en lugar de hacia abajo.','No retraer las escapulas antes de tirar — el movimiento debe iniciar desde las escapulas.','Excentrico rapido — el dorsal se desarrolla principalmente en la fase excentrica.','Tirar demasiado abajo (por debajo del pecho) — aumenta el riesgo de lesion de hombro.'],
  variantes:['S1-2: 50% carga maxima, excentrico 4 seg.','S3-4: 60% carga maxima, excentrico 3 seg.','S5-6: 70% con pausa en la posicion de maxima contraccion.','S7+: dominada asistida como progresion.'],
  notas_columna:'S1-2 (50% exc 4s): la carga reducida con excentrico largo desarrolla el dorsal sin generar ninguna carga lumbar — el tronco esta apoyado y la fuerza es vertical. El excentrico largo es donde ocurre el mayor estimulo de hipertrofia. S3-4 (60% exc 3s): incremento gradual de carga — el criterio de avance es completar las 4x10 con la forma perfecta sin fatiga postural. S5-6 (70% pausa abajo): la pausa en extension maxima de codo estira el dorsal al maximo — mayor reclutamiento muscular y mejor movilidad toracica. S7+ (dominada asistida): la dominada es el patron de tiro vertical mas completo — activa escapulares, dorsal, biceps y core de forma integrada. El jalon es el ejercicio de mayor volumen del protocolo sin riesgo lumbar: el tronco apoyado y la carga vertical lo hacen completamente seguro con extrusion activa.',
};

_PORT['jalon-neutro'] = {
  nombre:'Jalon agarre neutro estrecho',
  categoria:'Dorsal / Tiro vertical',
  color:'#3C3489',
  descripcion:'Tiro vertical con agarre neutro (palmas enfrentadas) y estrecho. Trabaja la parte interna del dorsal, el redondo mayor y el biceps braquial con mayor intensidad que el agarre ancho. El agarre neutro es mas natural para el hombro y reduce el estres en la articulacion glenohumeral.',
  posicion:'Sentado en la maquina de jalon. Agarre neutro en la barra en V o triangular — manos enfrentadas, separadas 20-30 cm. Tronco ligeramente inclinado hacia atras.',
  pasos:['Sentarse bajo la barra en V. Agarre neutro, manos enfrentadas.','Rodillas bajo los apoyos. Tronco ligeramente inclinado hacia atras.','Retrae las escapulas antes de iniciar el tiron.','Tira del agarre hacia el pecho superior — los codos apuntan hacia abajo y hacia atras.','La barra en V debe acercarse al esternón.','Excentrico controlado 3-4 segundos hasta extension completa de los codos.'],
  errores:['No extender completamente los codos en el excentrico — perder el rango de estiramiento del dorsal.','Codos que se abren hacia los lados — mantenerlos apuntando hacia abajo.','Lumbar que se flexiona al tirar.','Agarre demasiado apretado — relaja los antebrazos para sentir mas el dorsal.'],
  variantes:['S1-4: pausa 1 seg en la posicion de maxima contraccion.','S5-6: excentrico 4 seg.','S7+: dominada neutra como progresion.'],
  notas_columna:'S1-4 (pausa 1s abajo): la pausa en extension maxima mantiene el dorsal bajo tension en su rango de mayor elongacion — mas eficiente que el movimiento continuo para desarrollo muscular con menos carga. S5-6 (exc 4s): el excentrico de 4 segundos aumenta el tiempo bajo tension sin aumentar el peso — progresion de densidad, no de carga. S7+ (dominada neutra): el agarre neutro es el mas natural para el codo y el hombro — la dominada neutra es generalmente la primera dominada que se domina. La posicion de agarre neutro reduce 40% el estres en la articulacion glenohumeral respecto al agarre prono — preferible si hay antecedentes de tension de hombro.',
};

_PORT['pull-over'] = {
  nombre:'Pull-over en polea alta',
  categoria:'Dorsal / Serrato / Movilidad toracica',
  color:'#3C3489',
  descripcion:'Extension de hombro con polea alta. Trabaja el dorsal ancho y el serrato anterior en un rango de movimiento que ningún otro ejercicio de espalda cubre — la elongacion maxima del dorsal con los brazos sobre la cabeza. La polea alta permite una tension constante durante todo el arco de movimiento.',
  posicion:'De pie frente a la polea alta con los brazos extendidos sobre la cabeza. Agarre en la barra recta o cuerda. Ligera flexion de rodillas para estabilidad.',
  pasos:['De pie frente a la polea alta. Agarra la barra con agarre prono al ancho de hombros.','Lleva los brazos sobre la cabeza (posicion inicial) — maxima elongacion del dorsal.','Activa el core. Espalda neutra.','Tira de la barra hacia abajo en un arco hasta que llegue a los muslos.','Los codos permanecen ligeramente flexionados durante todo el movimiento.','Vuelve de forma controlada hasta la posicion inicial — excentrico 3 seg.'],
  errores:['Flexionar los codos en exceso — el ejercicio se convierte en un pulldown, no en un pull-over.','Hiperlordosis lumbar al tirar — activa el core para mantener la posicion neutra.','Rango de movimiento incompleto — llegar hasta la elongacion maxima sobre la cabeza.','Movimiento demasiado rapido.'],
  variantes:['Con cuerda: mayor rango de rotacion de hombro.','Con barra recta: mas estabilidad y tension en el dorsal.','Tumbado en banco con mancuerna: version clasica sin polea.'],
  notas_columna:'El pull-over activa el serrato anterior — el musculo que conecta las costillas con la escapula y es fundamental para la salud del hombro y la postura toracica. Una buena activacion del serrato mejora la mecanica escapular y reduce la tension en los trapecios superiores, que frecuentemente se contracturan en personas con dolor lumbar cronico.',
};

_PORT['face-pull'] = {
  nombre:'Face pull en polea',
  categoria:'Rotadores externos / Hombro posterior',
  color:'#3C3489',
  descripcion:'Tiro horizontal hacia la cara con polea y cuerda. Activa los rotadores externos del hombro (infraespinoso, redondo menor) y el deltoides posterior. Es el ejercicio preventivo mas importante del protocolo para el equilibrio del hombro — debe realizarse en una proporcion 1:1 o superior con los ejercicios de press.',
  posicion:'De pie frente a la polea alta a la altura de la cara. Agarra la cuerda con ambas manos en agarre neutro. Ligera flexion de rodillas.',
  pasos:['Agarra la cuerda con ambas manos — pulgar hacia arriba.','Alejate de la polea hasta que haya tension con los brazos extendidos.','Tira de la cuerda hacia la cara — los codos suben y se abren hacia los lados.','En la posicion final: codos por encima de los hombros, manos a los lados de la cara.','Rotacion externa maxima: los nudillos apuntan hacia atras.','Vuelve de forma controlada.'],
  errores:['Codos que no suben por encima de los hombros — la rotacion externa no ocurre.','Demasiado peso — el ejercicio pierde la rotacion externa y se convierte en un remo.','Tronco que se inclina hacia atras para ayudar — mantener el tronco vertical.','Muñecas que se doblan — mantener neutras.'],
  variantes:['Activacion (calentamiento): banda ligera 2x15.','Trabajo principal: polea a la altura de la cara.','Con polea baja: activa mas el deltoides posterior.','Con separacion de la cuerda al final: enfatiza la rotacion externa maxima.'],
  notas_columna:'Activacion pre-press (2x15 banda ligera): activa los rotadores externos antes del press para preestabilizar el manguito — reduce el riesgo de impingement. Trabajo principal (polea a la altura de la cara): la polea permite carga constante en toda la rotacion externa — superior a la banda para trabajo de fuerza. Con polea baja: el angulo de tiro cambia hacia el deltoides posterior — util si hay tension en el manguito. La razon 1:1 con el press (mismas series que el press Smith) es la prescripcion preventiva estandar para mantener el equilibrio rotadores internos/externos. Con extrusion lumbar activa, la postura encorvada compensatoria aumenta la tension cervical y en el manguito — el face pull contrarresta directamente esa postura.',
};

_PORT['remo-maquina'] = {
  nombre:'Remo en maquina sentado',
  categoria:'Espalda media / Tiro horizontal',
  color:'#3C3489',
  descripcion:'Tiro horizontal con maquina de remo sentado. Trabaja los romboides, el trapecio medio, el dorsal inferior y el biceps. La maquina con respaldo elimina la inestabilidad del remo con barra o mancuerna, permitiendo mas carga sin riesgo lumbar.',
  posicion:'Sentado en la maquina de remo. Espalda apoyada en el respaldo si disponible, o tronco erguido sin apoyo. Pies en los apoyos. Rodillas ligeramente flexionadas.',
  pasos:['Sentarse en la maquina. Espalda erguida — no apoyada en el respaldo durante el movimiento si hay respaldo movil.','Agarra el tirador con ambas manos en agarre neutro o prono.','Retrae las escapulas antes de iniciar el tiron.','Tira del tirador hacia el abdomen bajo manteniendo los codos pegados al torso.','En la posicion final: escapulas completamente retraidas, codos detras del cuerpo.','Vuelve de forma controlada extendiendo los brazos completamente — excentrico 3 seg.'],
  errores:['Flexionar la columna lumbar para ayudar en el tiron — el tronco permanece erguido y estatico.','No retraer las escapulas — el movimiento debe iniciarse desde las escapulas, no desde los brazos.','Codos que se abren hacia fuera — mantenerlos pegados al torso.','Excentrico rapido.'],
  variantes:['S1-4: pausa 1 seg en la posicion de maxima contraccion con escapulas retraidas.','S5-6: excentrico 4 seg.','S7+: incremento de carga progresivo.'],
  notas_columna:'S1-4 (pausa 1s contraccion maxima): la pausa con escapulas completamente retraidas activa los romboides de forma maxima — desarrolla la musculatura que contrarresta la postura encorvada compensatoria del dolor lumbar. S5-6 (exc 4s): el excentrico largo estira el dorsal y los romboides en su rango mas largo — mayor estimulo con la misma carga. S7+ (incremento de carga): el remo en maquina es el ejercicio de tiro horizontal con mayor seguridad lumbar porque el tronco esta apoyado — puede cargarse mas que el remo libre sin riesgo. La clave absoluta: si la columna lumbar se flexiona para ayudar en el tiron, el ejercicio pierde su beneficio y añade riesgo.',
};

_PORT['remo-mancuerna'] = {
  nombre:'Remo con mancuerna un brazo',
  categoria:'Dorsal / Tiro horizontal unilateral',
  color:'#3C3489',
  descripcion:'Remo unilateral con mancuerna apoyado en un banco. Trabaja el dorsal ancho, el romboides y el biceps de forma unilateral, permitiendo mayor rango de movimiento que el remo bilateral. El apoyo en el banco elimina la carga sobre la columna lumbar.',
  posicion:'Apoyado en el banco con la mano y la rodilla del lado contrario al que trabaja. La pierna de trabajo en el suelo, ligeramente flexionada. La mancuerna en la mano libre colgando perpendicular al suelo.',
  pasos:['Posicion de apoyo en el banco: mano y rodilla ipsilaterales en el banco, espalda completamente neutra y horizontal.','La mancuerna cuelga del brazo de trabajo, perpendicular al suelo.','Retrae la escapula del lado de trabajo antes de iniciar el tiron.','Tira de la mancuerna hacia la cadera — el codo pasa por encima de la espalda.','En la posicion final: el codo esta detras y por encima del tronco, escapula retraida.','Baja de forma controlada hasta extension completa — excentrico 3 seg.'],
  errores:['Rotacion de pelvis para subir la mancuerna mas alto — el movimiento debe ser solo del brazo.','No extender completamente el brazo en el excentrico — perder el rango de estiramiento del dorsal.','Espalda que se redondea — mantener la posicion horizontal neutra.','Tirar hacia el pecho en lugar de hacia la cadera — cambia el musculo activado.'],
  variantes:['S1-4: carga ligera, foco en la retraccion escapular.','S5-6: incremento de carga con excentrico 3 seg.','S7+: carga alta con pausa en la posicion de contraccion maxima.'],
  notas_columna:'S1-4 (carga ligera, foco escapular): el patron correcto antes de la carga — la retraccion escapular debe iniciar el tiron, no el biceps. S5-6 (exc 3s): el excentrico largo con carga moderada es el mayor estimulo de hipertrofia del dorsal disponible en este protocolo. S7+ (carga alta con pausa): la pausa en contraccion maxima con carga alta activa los romboides profundos y el infraespinoso. El apoyo en banco elimina completamente la carga axial lumbar — este ejercicio puede cargarse con mas agresividad que el remo bilateral. La asimetria del remo unilateral es util: si el lado izquierdo es mas debil que el derecho, indica debilidad de la cadena dorsal izquierda — relevante para la simetria de activacion en L5-S1 izquierda.',
};

// ══════════════════════════════════════════════
// FIN BLOQUE 6
// ══════════════════════════════════════════════

// ══════════════════════════════════════════════
// BLOQUE 7 — HOMBRO + BRAZO + ACCESORIOS
// ══════════════════════════════════════════════

_PORT['elevaciones-lat'] = {
  nombre:'Elevaciones laterales con mancuernas',
  categoria:'Deltoides medio',
  color:'#3C3489',
  descripcion:'Aislamiento del deltoides medio mediante abduccion de hombro con mancuernas. El deltoides medio da anchura al hombro y es fundamental para la salud articular glenohumeral. Realizarlo sentado elimina la contribucion del trapecio superior y el torso.',
  posicion:'Sentado en un banco con respaldo o de pie. Mancuernas a los lados del cuerpo, ligera flexion de codo (10-15 grados). Tronco erguido.',
  pasos:['Sentado o de pie con las mancuernas a los lados. Codos ligeramente flexionados — esta posicion se mantiene fija durante todo el ejercicio.','Activa el core y mantén el tronco completamente estatico.','Eleva las mancuernas lateralmente hasta la altura de los hombros — no mas arriba.','La muñeca debe estar al mismo nivel o ligeramente mas baja que el codo durante todo el arco.','Baja de forma controlada en 3 segundos.'],
  errores:['Elevar por encima de los hombros — compresion subacromial.','Usar impulso del torso para subir — indica peso excesivo.','Muñecas que suben por encima de los codos — rotar ligeramente el meñique hacia arriba.','Codos que se doblan en exceso durante el movimiento.'],
  variantes:['Sentado (F2): elimina el impulso del torso.','De pie: mayor rango funcional.','Con cables: tension constante en todo el rango — superior a mancuernas.','Con banda: resistencia progresiva.'],
  notas_columna:'Las elevaciones laterales no generan carga axial significativa. Realizarlas sentado en F2 es una precaucion adicional para evitar cualquier movimiento lumbar compensatorio con pesos elevados. El deltoides medio contribuye a la estabilidad del hombro durante los jalones y los remos — su fortalecimiento mejora la eficiencia de toda la cadena.',
};

_PORT['pajaros'] = {
  nombre:'Pajaros (rear delt fly)',
  categoria:'Deltoides posterior / Rotadores externos',
  color:'#3C3489',
  descripcion:'Aislamiento del deltoides posterior mediante abduccion horizontal con el cuerpo inclinado. El deltoides posterior es el musculo mas importante para la postura — su debilidad contribuye a la postura encorvada con hombros adelantados que aumenta la carga sobre la columna cervical y toracica.',
  posicion:'De pie inclinado hacia adelante a 45-90 grados con apoyo en maquina o banco, o sentado en maquina pec deck invertida. Mancuernas colgando perpendiculares al suelo.',
  pasos:['Inclinado hacia adelante con apoyo o en maquina pec-deck invertida. Mancuernas colgando.','Ligera flexion de codos — esta se mantiene fija.','Eleva las mancuernas lateralmente en un arco hasta la altura de los hombros.','Los codos apuntan hacia arriba en la posicion final — no hacia atras.','Baja de forma controlada.'],
  errores:['Usar el trapecio superior para subir — el movimiento debe venir del deltoides posterior.','Extender los codos al subir — la ligera flexion se mantiene fija.','Rango de movimiento insuficiente — llegar hasta la horizontal.','Usar demasiado peso — el deltoides posterior es un musculo pequeño.'],
  variantes:['En maquina pec deck invertida: tension constante.','Con cables cruzados: excelente alternativa.','Con banda: resistencia progresiva.','Version activacion (calentamiento): banda ligera 2x12.'],
  notas_columna:'El deltoides posterior es frecuentemente debil en personas con dolor cronico lumbar — la postura antalgica con hombros hacia adelante lo inhibe progresivamente. Su fortalecimiento corrige la postura toracica, reduce la tension en los trapecios y mejora la mecanica respiratoria.',
};

_PORT['pike-pushup'] = {
  nombre:'Pike push-up',
  categoria:'Deltoides anterior / Triceps',
  color:'#3C3489',
  descripcion:'Flexion de codos en posicion de pica (caderas elevadas). Trabaja el deltoides anterior y el triceps de forma similar al press vertical pero sin carga axial sobre la columna. Es la alternativa al press de hombros con barra para F2.',
  posicion:'Posicion de flexion con las caderas elevadas formando una V invertida. Manos al ancho de hombros. Cabeza entre los brazos mirando hacia los pies.',
  pasos:['Posicion de flexion. Eleva las caderas hacia el techo hasta formar una V invertida con el cuerpo.','Manos al ancho de hombros. Cabeza entre los brazos.','Flexiona los codos bajando la cabeza hacia el suelo entre las manos.','La cabeza casi toca el suelo en la posicion baja.','Empuja para volver a la posicion de pica — extension completa de codos.'],
  errores:['Caderas que caen durante el movimiento — mantener la V durante todo el ejercicio.','Codos que se abren demasiado — mantener un angulo de 45 grados aproximadamente.','Rango incompleto — la cabeza debe casi tocar el suelo.','Cuello en tension — la cabeza cuelga naturalmente entre los brazos.'],
  variantes:['Manos elevadas en banco: version mas facil — menor angulo de inclinacion.','Pies elevados en banco: version mas dificil — mayor componente vertical.','Con pausa en la posicion baja: mayor tiempo bajo tension.'],
  notas_columna:'El pike push-up es el sustituto del press vertical con barra en F2. Al ser un ejercicio con el peso corporal, la carga es proporcional al peso del usuario y es progresable elevando los pies. No genera carga axial directa sobre la columna lumbar. Las escapulas deben estar activas durante todo el movimiento.',
};

_PORT['fondos-triceps'] = {
  nombre:'Fondos de triceps en banco',
  categoria:'Triceps / Pecho inferior',
  color:'#3C3489',
  descripcion:'Extension de codos con las manos apoyadas en el borde de un banco y los pies en el suelo. Trabaja el triceps, el pecho inferior y el deltoides anterior. En F2 se realiza con rodillas flexionadas para reducir la carga total.',
  posicion:'Sentado en el borde del banco. Manos en el borde con los dedos hacia adelante. Pies en el suelo, rodillas a 90 grados.',
  pasos:['Sentado en el borde del banco, manos apoyadas en el borde al ancho de los hombros.','Desliza el cuerpo hacia adelante hasta que las caderas queden fuera del banco.','Flexiona los codos bajando el cuerpo — los codos apuntan hacia atras, no hacia fuera.','Baja hasta que los codos formen 90 grados — no mas abajo para proteger el hombro.','Empuja extendiendo los codos hasta volver a la posicion inicial.'],
  errores:['Codos que se abren hacia fuera — deben apuntar hacia atras.','Bajar mas alla de 90 grados de flexion de codo — riesgo de impingement de hombro.','Hombros que suben hacia las orejas — mantener los hombros bajos.','Cuerpo demasiado lejos del banco — aumenta el estres en el hombro anterior.'],
  variantes:['Rodillas flexionadas (F2): menor carga total.','Piernas extendidas: mayor carga.','Pies elevados: maxima carga — solo F3.','Con disco sobre los muslos: carga adicional.'],
  notas_columna:'Los fondos en banco no generan carga axial lumbar significativa. El limite de rango (90 grados de codo) es importante para evitar la sobrecarga del hombro anterior que puede irradiar al trapecio y cervicales. Mantener los hombros bajos y los codos hacia atras durante todo el movimiento.',
};

_PORT['dislocaciones'] = {
  nombre:'Dislocaciones con banda elastica',
  categoria:'Movilidad de hombro / Calentamiento',
  color:'#1E8A7A',
  descripcion:'Rotacion completa de hombros con banda elastica. Lleva los brazos desde el frente hasta detras del cuerpo en un arco continuo. Mejora la movilidad glenohumeral y de la cintura escapular. Es el mejor ejercicio de calentamiento para el hombro antes de sesiones de press y tiro.',
  posicion:'De pie. Banda elastica en ambas manos con agarre ancho. Brazos extendidos frente al cuerpo.',
  pasos:['Agarra la banda con ambas manos a un ancho que permita pasar los brazos por detras sin tension excesiva.','Brazos extendidos frente al cuerpo, palmas hacia abajo.','Eleva los brazos sobre la cabeza manteniendo los codos extendidos.','Continua el arco llevando los brazos hacia detras del cuerpo hasta que lleguen a los gluteos.','Vuelve por el mismo arco al frente. Eso es 1 repeticion.','Si los codos se doblan, ampliar mas el agarre.'],
  errores:['Codos que se doblan durante el arco — indica agarre demasiado estrecho.','Compensar con la zona lumbar arqueandose — core activo durante todo el movimiento.','Movimiento demasiado rapido — lento y controlado para movilidad.','Forzar el rango — la banda debe estar tensa pero sin dolor.'],
  variantes:['Agarre muy ancho: para principiantes o alta rigidez de hombro.','Agarre progresivamente mas estrecho: conforme mejora la movilidad.','Solo la mitad del arco (frente a sobre la cabeza): si no hay rango completo.'],
  notas_columna:'Las dislocaciones con banda son el ejercicio de calentamiento de hombro mas efectivo del protocolo. Mejoran la movilidad toracica ademas de la glenohumeral — la extension toracica es necesaria para que el hombro pueda moverse en rotacion completa sin compensar con la lumbar.',
};

_PORT['retraccion-escapular'] = {
  nombre:'Retraccion escapular activa',
  categoria:'Escapulas / Postura',
  color:'#1E8A7A',
  descripcion:'Movimiento controlado de retraccion y depresion escapular. Activa los romboides y el trapecio medio de forma aislada. Es la base de todos los ejercicios de tiro — sin retraccion escapular previa, los jalones y los remos se realizan principalmente con los brazos en lugar de con la espalda.',
  posicion:'De pie o sentado con los brazos a los lados. Codos a 90 grados.',
  pasos:['De pie o sentado, codos flexionados a 90 grados a los lados del cuerpo.','Lleva los hombros hacia atras y abajo — alejandolos de las orejas.','Intenta juntar los omoplatos sin mover los brazos — el movimiento es solo de las escapulas.','Mantén la posicion retraida 2 segundos apretando los romboides.','Vuelve a la posicion inicial de forma controlada.','Repetir el numero indicado.'],
  errores:['Mover los brazos en lugar de las escapulas — aislar el movimiento escapular.','Hombros que suben hacia las orejas al retraer — retraer Y bajar simultaneamente.','No mantener la pausa — la pausa es donde ocurre la activacion de romboides.','Compensar con extension lumbar.'],
  variantes:['Con banda: anadir resistencia al movimiento de retraccion.','En polea: con el cable a la altura del pecho, retraer antes de tirar.','Como activacion pre-jalon: 2x12 antes de cada sesion de tiro.'],
  notas_columna:'La retraccion escapular deficiente es uno de los patrones mas comunes en personas con dolor lumbar cronico — la postura antalgica con hombros adelantados inhibe los romboides y el trapecio medio. Corregir este patron mejora la postura global, reduce la tension cervical y mejora la eficiencia de todos los ejercicios de espalda.',
};

_PORT['rot-hombro-banda'] = {
  nombre:'Rotacion interna y externa de hombro con banda',
  categoria:'Manguito rotador / Hombro',
  color:'#1E8A7A',
  descripcion:'Ejercicio de fortalecimiento del manguito rotador con banda elastica. Trabaja el infraespinoso y el supraespinoso (rotacion externa) y el subescapular (rotacion interna). Fundamental para la salud del hombro y la prevencion de lesiones en los movimientos de press y tiro.',
  posicion:'De pie con el codo pegado al costado, flexionado a 90 grados. Banda elastica fijada a un punto lateral.',
  pasos:['Fija la banda a un punto lateral a la altura del codo.','Codo pegado al costado, flexionado a 90 grados — mantener esta posicion durante todo el ejercicio.','Para rotacion externa: partiendo con el antebrazo hacia el centro del cuerpo, llevar el antebrazo hacia afuera.','Para rotacion interna: partiendo con el antebrazo hacia afuera, llevar el antebrazo hacia el centro.','El movimiento es exclusivamente del antebrazo — el codo no se mueve.','Realizar el numero indicado en cada direccion y cada brazo.'],
  errores:['El codo se separa del costado — el codo debe permanecer pegado.','Compensar con el hombro o el tronco.','Rango de movimiento forzado — ir hasta donde el hombro lo permite sin dolor.','Banda demasiado tensa — reducir la resistencia si el codo se separa.'],
  variantes:['Solo rotacion externa: si hay debilidad especifica del infraespinoso.','Con mancuerna ligera: version alternativa sin banda.','Tumbado de lado: rotacion externa con mayor estabilidad.'],
  notas_columna:'El manguito rotador centra la cabeza humeral en la glenoides durante todos los movimientos de hombro. Su debilidad permite la migracion superior de la cabeza humeral durante la elevacion, generando impingement subacromial. En personas con dolor lumbar que han estado en descanso prolongado, el manguito puede haberse debilitado — el trabajo preventivo es esencial antes de reanudar el press y el jalon.',
};

// ══════════════════════════════════════════════
// FIN BLOQUE 7
// ══════════════════════════════════════════════

// ══════════════════════════════════════════════
// BLOQUE 8 — MOVILIDAD + CALENTAMIENTO
// ══════════════════════════════════════════════

_PORT['camel'] = {
  nombre:'Camel desde heel sit',
  categoria:'Movilidad / Extension de cadera',
  color:'#0F6E56',
  descripcion:'Transicion desde heel sit hasta posicion de rodillas con extension de cadera. Moviliza la articulacion de la cadera en extension activa desde una posicion de descarga. Es la progresion natural del heel sit y el ejercicio que conecta la descompresion matutina con la movilidad activa.',
  posicion:'Comenzar en heel sit: rodillas en el suelo, gluteos sobre los talones, tronco erguido.',
  pasos:['Comenzar en heel sit — gluteos sobre talones, tronco erguido.','Eleva las caderas llevando el cuerpo a la posicion de rodillas — rodillas en el suelo, cadera extendida.','En la posicion de rodillas: extiende ligeramente la cadera sin hiperlordosis lumbar.','La extension debe venir de la cadera, no de la zona lumbar.','Vuelve a heel sit de forma controlada. Eso es 1 repeticion.','El movimiento debe ser lento y continuo — 2-3 seg en cada direccion.'],
  errores:['Hiperlordosis lumbar al extender la cadera — la extension debe ser de la cadera, no de la espalda.','Movimiento demasiado rapido — el control es fundamental.','Separar las rodillas en exceso al subir.','Empujar con los brazos para subir — la fuerza debe venir de las caderas y el gluteo.'],
  variantes:['Version reducida en dia neural: solo llegar a la posicion de rodillas sin extension adicional.','Con apoyo de manos al frente: para personas con debilidad de cuadriceps.','Con brazos extendidos sobre la cabeza en la posicion alta: mayor extension toracica.'],
  notas_columna:'El camel desde heel sit es el unico ejercicio del protocolo que trabaja la extension de cadera activa desde la posicion de maxima descarga lumbar. La transicion entre la flexion maxima (heel sit) y la extension (posicion de rodillas) moviliza el segmento L4-L5 y L5-S1 en el plano sagital sin carga axial. Realizarlo lento y con control es la clave.',
};

_PORT['cat-cow'] = {
  nombre:'Cat-cow toracico',
  categoria:'Movilidad toracica / Calentamiento',
  color:'#1E8A7A',
  descripcion:'Flexion y extension segmentaria de la columna toracica en cuadrupedia. La clave es movilizar SOLO la zona toracica manteniendo la zona lumbar completamente estable. Es el ejercicio de movilidad toracica mas importante del protocolo y el complemento esencial a todos los ejercicios de espalda.',
  posicion:'A cuatro patas. Manos bajo los hombros, rodillas bajo las caderas. Columna en posicion neutra.',
  pasos:['Posicion de cuadrupedia: manos bajo hombros, rodillas bajo caderas, columna neutra.','Fase cat (flexion): exhala y redondea SOLO la zona toracica — llevar el esternon hacia el suelo y separar las escapulas.','La zona lumbar permanece estatica durante la fase cat — solo se mueve la toracica.','Fase cow (extension): inhala y extiende SOLO la zona toracica — llevar el esternon hacia arriba y juntar ligeramente las escapulas.','La zona lumbar permanece estatica durante la fase cow tambien.','El movimiento toracico debe ser visible — si no hay movimiento toracico, la tecnica es incorrecta.'],
  errores:['Mover la zona lumbar en lugar de la toracica — el error mas comun. La lumbar debe estar fija.','Movimiento demasiado rapido — lento y controlado para sentir el movimiento toracico.','Cuello que se mueve en exceso — el cuello puede acompañar suavemente pero no liderar.','Rango insuficiente — la toracica debe moverse visiblemente.'],
  variantes:['Solo extension toracica (solo cow): si la flexion toracica genera molestia.','Con foam roller bajo la zona toracica: para movilizar segmentos especificos.','Sentado en silla: version mas facil para personas con dificultad en cuadrupedia.'],
  notas_columna:'La rigidez toracica es extremadamente comun en personas con dolor lumbar cronico — la postura antalgica inmoviliza la columna toracica y las fuerzas de movimiento se transfieren a la lumbar. Mejorar la movilidad toracica reduce directamente la carga sobre L4-L5 y L5-S1. En tu caso, la rectificacion de la lordosis documentada en la RMN puede beneficiarse de la extension toracica activa.',
};

_PORT['rotacion-toracica'] = {
  nombre:'Rotacion toracica en suelo',
  categoria:'Movilidad toracica / Rotacion',
  color:'#1E8A7A',
  descripcion:'Rotacion de la columna toracica en decubito lateral. Moviliza la toracica en rotacion manteniendo la pelvis completamente fija. Es el ejercicio de rotacion toracica mas seguro porque el decubito lateral estabiliza la pelvis y la gravedad no interfiere.',
  posicion:'Tumbado de lado. Rodillas y caderas flexionadas a 90 grados (posicion fetal). Brazos extendidos al frente, palmas juntas.',
  pasos:['Tumbado de lado en posicion fetal — caderas y rodillas a 90 grados.','Brazos extendidos al frente, palmas juntas.','Mantén las rodillas y la pelvis completamente fijas durante todo el ejercicio.','Lleva el brazo superior describiendo un arco hacia el otro lado del cuerpo — abriendo el pecho.','El brazo superior llega hasta el suelo del lado contrario si el rango lo permite.','La cabeza sigue al brazo — gira suavemente.','Vuelve de forma controlada. Cambiar de lado.'],
  errores:['Pelvis que rota — las rodillas deben permanecer en el suelo durante todo el movimiento.','Brazo que no llega al suelo por falta de rango — ir hasta donde el rango permita, no forzar.','Movimiento demasiado rapido.','Rodillas que se separan — mantenerlas juntas y en el suelo.'],
  variantes:['Con la mano superior apoyada en el suelo del lado contrario: facilita el control de la pelvis.','Con foam roller entre las rodillas: garantiza que las rodillas no se separen.','En agua (piscina): la flotacion facilita el rango.'],
  notas_columna:'La rotacion toracica en decubito lateral es el ejercicio mas seguro para mejorar la movilidad rotatoria de la columna. La toracica necesita 35-40 grados de rotacion por lado para la marcha normal — su rigidez transfiere las fuerzas rotatorias a la lumbar, que solo tolera 5-7 grados. Mejorar la rotacion toracica reduce directamente las fuerzas de torsion sobre los discos extruidos.',
};

_PORT['90-90'] = {
  nombre:'90/90 stretch activo',
  categoria:'Movilidad / Rotacion interna y externa cadera',
  color:'#1E8A7A',
  descripcion:'Estiramiento activo en posicion de 90/90. Ambas rodillas forman 90 grados — una en rotacion externa y otra en rotacion interna de cadera. Es la posicion mas completa para trabajar simultaneamente la rotacion interna y externa de la cadera y el piriforme.',
  posicion:'Sentado en el suelo. Pierna delantera: rodilla y cadera a 90 grados con la espinilla perpendicular al tronco. Pierna trasera: rodilla y cadera a 90 grados con la espinilla paralela al tronco.',
  pasos:['Sentado en el suelo en posicion 90/90: pierna delantera con la espinilla perpendicular al tronco, pierna trasera con la espinilla paralela.','Tronco erguido sobre la pierna delantera.','Para el estiramiento de rotacion externa (pierna delantera): inclina el tronco hacia adelante desde la cadera.','Para el estiramiento de rotacion interna (pierna trasera): inclina el tronco hacia la pierna trasera.','Mantén 40 segundos en cada posicion. Cambiar de lado.','La version activa incluye contraccion del gluteo de la pierna de trabajo en la posicion de estiramiento.'],
  errores:['Tronco que se redondea al inclinarse — la inclinacion debe venir de la cadera.','Pelvis que rota al inclinarse — mantener las crestas iliacas cuadradas.','Rango forzado — ir hasta donde el control permita.','Saltar entre posiciones rapidamente.'],
  variantes:['Pasivo: solo mantener la posicion sin contraccion activa.','Activo: contraccion del gluteo en la posicion de estiramiento — mejora la propiocepcion.','Con apoyo de manos al frente: para personas con limitacion de movilidad.'],
  notas_columna:'La restriccion de rotacion interna de cadera izquierda es un hallazgo frecuente en la extrusion L5-S1 izquierda — el espasmo reflejo del piriforme protege la articulacion pero limita el movimiento. La version pasiva (solo mantener la posicion): estira el piriforme y los rotadores externos sin activacion — adecuada en dias de mayor sensibilidad. La version activa (contraccion del gluteo en posicion de estiramiento): mejora el control neuromuscular ademas de la movilidad — mas eficiente para la rehabilitacion. Con apoyo de manos: la variante inicial cuando la posicion 90/90 completa genera tension excesiva. La mejora de la rotacion interna de cadera izquierda reduce directamente la tension sobre el nervio ciatico en su trayecto por el piriforme.',
};

_PORT['pelvic-clock'] = {
  nombre:'Pelvic clock (reloj pelvico)',
  categoria:'Control motor / Propiocepcion lumbar',
  color:'#0F6E56',
  descripcion:'Ejercicio de control motor pelvico en decubito supino. Imagina un reloj en la pelvis e inclina la pelvis hacia cada hora del reloj de forma controlada. Mejora la propiocepcion lumbar y el control segmentario de la pelvis — la base de toda la estabilizacion lumbar.',
  posicion:'Tumbado boca arriba, rodillas flexionadas a 90 grados, pies plantados. La zona lumbar en posicion neutra.',
  pasos:['Tumbado boca arriba, rodillas a 90 grados, pies plantados.','Imagina un reloj en el abdomen — las 12 estan en el ombligo, las 6 en el pubis.','Inclina la pelvis hacia las 12 (anteversion — lordosis aumenta).','Vuelve al centro. Inclina hacia las 6 (retroversion — lumbar se aplana).','Trabaja cada hora del reloj de forma progresiva: 3, 6, 9, 12.','El objetivo es hacer el movimiento lo mas pequeno y controlado posible.'],
  errores:['Movimiento demasiado grande — la clave es el microcontrol.','Usar los gluteos o los abdominales para mover la pelvis — el movimiento debe venir del control lumbar-pelvico.','Respiracion contenida — respirar de forma continua.','Saltar horas sin control.'],
  variantes:['Sentado en fitball: la inestabilidad del fitball hace el ejercicio mas demandante.','Solo anterversion-retroversion: version simplificada para inicio.','Con biofeedback manual: mano bajo la zona lumbar para sentir el movimiento.'],
  notas_columna:'El pelvic clock es el ejercicio de propiocepcion lumbar mas importante del protocolo. La propiocepcion de la columna lumbar — la capacidad de sentir y controlar la posicion del segmento — es la primera funcion que se recupera en la rehabilitacion lumbar. Sin propiocepcion, los ejercicios de fuerza no generan estabilizacion real.',
};

_PORT['child-pose'] = {
  nombre:'Child pose con soporte',
  categoria:'Estiramiento / Descompresion',
  color:'#0F6E56',
  descripcion:'Postura de yoga restaurativa en posicion de flexion lumbar pasiva. Los brazos extendidos al frente crean una traccion suave sobre la columna toracica y los hombros. Con soporte bajo el pecho o la frente, la posicion es mas comoda y sostenible.',
  posicion:'Arrodillado en el suelo, rodillas separadas al ancho de caderas o mas anchas. Los gluteos hacia los talones. Brazos extendidos al frente en el suelo.',
  pasos:['Comienza en heel sit.','Extiende los brazos hacia adelante en el suelo mientras los gluteos permanecen sobre los talones.','Si los gluteos no llegan a los talones, colocar una almohada entre gluteos y talones.','La frente apoya en el suelo o en un bloque de yoga.','Respira con el diafragma — siente como la espalda se expande en cada inhala.','Mantén el tiempo indicado sin tension activa.'],
  errores:['Gluteos que se elevan de los talones — colocar almohada entre gluteos y talones.','Tension en los hombros — los brazos deben estar completamente relajados.','Cuello en tension — la frente debe estar apoyada.','Realizar si hay dolor en las rodillas — usar almohada o modificar la posicion.'],
  variantes:['Con rodillas juntas: mayor estiramiento de la zona lumbar.','Con rodillas separadas: mas comodo, menor tension lumbar.','Con almohada bajo el pecho: version mas pasiva y relajante.','Con brazos hacia un lado: estiramiento lateral adicional.'],
  notas_columna:'La child pose crea una flexion lumbar pasiva que abre el espacio posterior discal L4-L5 y L5-S1. Es una alternativa a las rodillas al pecho cuando hay mayor rigidez matutina o cuando se prefiere una posicion mas de yoga. En tu caso, la flexion lumbar en posicion de carga parcial (los brazos sostienen algo del peso) es segura y beneficiosa.',
};

_PORT['ext-toracica-foam'] = {
  nombre:'Extension toracica en foam roller',
  categoria:'Movilidad toracica / Extension',
  color:'#1E8A7A',
  descripcion:'Extension toracica sobre un foam roller colocado perpendicular a la columna. El foam roller actua como fulcro que permite movilizar segmentos especificos de la columna toracica en extension. Solo debe usarse en la zona toracica — jamas en la zona lumbar.',
  posicion:'Tumbado boca arriba con el foam roller perpendicular a la columna a la altura de los omoplatos. Rodillas flexionadas. Manos detras de la cabeza o brazos cruzados en el pecho.',
  pasos:['Coloca el foam roller perpendicular a la columna a la altura de los omoplatos (T4-T10).','Apoya la columna toracica en el foam roller con las rodillas flexionadas y los pies en el suelo.','Manos detras de la cabeza para soportar el cuello.','Deja que la columna toracica se extienda sobre el foam roller de forma pasiva.','Puedes mover el cuerpo ligeramente arriba y abajo para movilizar diferentes segmentos toracicos.','NUNCA colocar el foam roller en la zona lumbar.'],
  errores:['Colocar el foam roller en la zona lumbar — CONTRAINDICADO en discopatia lumbar activa.','Extension lumbar en lugar de toracica — la lumbar debe permanecer en posicion neutra.','Tension en el cuello — las manos soportan el peso de la cabeza.','Presion excesiva sobre los procesos espinosos — si hay dolor en los procesos, elevar la posicion.'],
  variantes:['Solo apoyo sin movimiento: extension toracica pasiva.','Con movimiento de brazos: llevar los brazos sobre la cabeza mientras se extiende.','Por segmentos: T4-T6, T6-T8, T8-T10 por separado.'],
  notas_columna:'La extension toracica sobre foam roller mejora la lordosis toracica natural, que en tu caso puede estar comprometida por la postura antalgica cronica. Una toracica mas movil reduce la transferencia de cargas a la lumbar. El limite lumbar es absoluto — el foam roller en la zona lumbar puede comprimir directamente los discos extruidos.',
};

_PORT['leg-swing'] = {
  nombre:'Leg swings (frontales y laterales)',
  categoria:'Movilidad dinamica / Cadera',
  color:'#1E8A7A',
  descripcion:'Balanceos dinamicos de la pierna en los planos frontal y sagital. Mejoran la movilidad dinamica de la cadera y activan los flexores y abductores de cadera como calentamiento pre-ejercicio. A diferencia del estiramiento estatico, los balanceos no reducen la activacion muscular.',
  posicion:'De pie apoyado en una pared o superficie estable con una mano. Peso en la pierna de apoyo. La pierna de trabajo libre.',
  pasos:['FRONTALES: Apoyate en la pared. Balancea la pierna hacia adelante y hacia atras de forma ritmica. El rango aumenta gradualmente con cada balanceo. El tronco permanece erguido — no se inclina con la pierna.','LATERALES: Apoyate en la pared con la mano del mismo lado. Balancea la pierna hacia afuera (abduccion) y hacia dentro (aduccion) de forma ritmica. El tronco permanece estatico.','En ambos casos: empezar con rango reducido y aumentar gradualmente durante las repeticiones.','Velocidad moderada — no demasiado rapido.'],
  errores:['Tronco que se inclina con la pierna — el movimiento debe ser solo de la articulacion de la cadera.','Rango demasiado grande desde el inicio — aumentar gradualmente.','Movimiento demasiado rapido — perder el control.','Girar la pelvis para aumentar el rango — el movimiento debe ser de la cadera.'],
  variantes:['Solo frontales: calentamiento pre-RDL y pre-squat.','Solo laterales: calentamiento pre-prensa y pre-abductores.','Combinados: cuando se trabajan ambos patrones en la misma sesion.'],
  notas_columna:'Los leg swings son el calentamiento dinamico de cadera mas funcional del protocolo. A diferencia de los estiramientos estaticos, no reducen la produccion de fuerza muscular y mejoran la amplitud de movimiento activa disponible para la sesion. Fundamentales antes de la sesion de squat (viernes) para preparar la articulacion de la cadera.',
};

_PORT['couch-stretch'] = {
  nombre:'Couch stretch',
  categoria:'Estiramiento / Psoas iliaco',
  color:'#1E8A7A',
  descripcion:'Estiramiento profundo del psoas iliaco y el recto femoral en posicion de semiarrodillado con la pierna trasera elevada. El nombre viene de la posicion con la rodilla apoyada en el sofa. Es el estiramiento mas efectivo para el psoas iliaco — superior al hip flexor stretch clasico porque incorpora la extension de cadera y la flexion de rodilla simultaneamente.',
  posicion:'Semiarrodillado junto a una pared. La rodilla de la pierna a estirar apoyada en el suelo cerca de la pared. El pie de esa pierna contra la pared (empeine apoyado). El pie de la pierna delantera plantado al frente.',
  pasos:['Colocate de rodillas junto a la pared. La rodilla trasera en el suelo cerca de la pared, el pie trasero apoyado contra la pared en el empeine.','Lleva el pie delantero al frente con la rodilla a 90 grados.','Tronco erguido. Activa el gluteo de la pierna trasera — este es el movimiento que genera el estiramiento.','Siente el estiramiento en la parte anterior de la cadera y el muslo de la pierna trasera.','Mantén 45 segundos. La respiracion profunda aumenta el estiramiento en la exhala.'],
  errores:['No activar el gluteo trasero — sin esa contraccion el estiramiento es minimo.','Tronco inclinado hacia adelante — mantener completamente erguido.','Hiperlordosis lumbar para aumentar el estiramiento — retroversion pelvica ligera es correcta.','Rodilla trasera sin almohadilla en suelo duro — usar almohadilla.'],
  variantes:['S1-2: tronco erguido con manos en la rodilla delantera como apoyo.','S3-4: tronco erguido con manos en las caderas.','S5-6: tronco ligeramente inclinado hacia atras.','S7+: tronco vertical con pie trasero en la pared.'],
  notas_columna:'El psoas iliaco tiene insercion directa en los cuerpos vertebrales de L1-L5 y en el trocanter menor del femur. Su acortamiento — muy frecuente tras meses de sedestacion prolongada — genera una anteversion pelvica que aumenta la lordosis lumbar y la presion sobre los discos posteriores L4-L5 y L5-S1. El couch stretch es el estiramiento prioritario pre-cadena posterior (lunes) y pre-squat (viernes).',
};

// ══════════════════════════════════════════════
// FIN BLOQUE 8
// ══════════════════════════════════════════════

// ══════════════════════════════════════════════
// BLOQUE 9 — PISCINA + CIERRE
// ══════════════════════════════════════════════

_PORT['traccion-barra-agua'] = {
  nombre:'Traccion lumbar pasiva en barra (piscina)',
  categoria:'Descompresion acuatica / Traccion',
  color:'#185FA5',
  descripcion:'Traccion lumbar pasiva colgado de la barra en la piscina. El agua reduce el peso corporal un 70-90% segun la profundidad, lo que convierte la traccion pasiva en uno de los metodos de descompresion mas eficaces y seguros. La flotacion ayuda a separar los segmentos vertebrales sin la tension que generaria la misma posicion fuera del agua.',
  posicion:'Agarrado a la barra de la piscina con agarre prono. Cuerpo en el agua. Rodillas recogidas hacia el pecho.',
  pasos:['Agarra la barra con ambas manos en agarre prono (palmas hacia adelante) al ancho de hombros.','Deja que el cuerpo se hunda en el agua — no empujes con los brazos para salir.','Lleva las rodillas hacia el pecho — esto crea una flexion lumbar que maximiza la descompresion L5-S1.','Deja que el agua soporte el peso del cuerpo y que la gravedad traccione suavemente la columna.','Respira de forma continua. En cada exhala, las rodillas se acercan ligeramente mas al pecho.','Mantén el hold 30 segundos. Repite 3 veces con descanso entre series.'],
  errores:['Empujar con los brazos hacia arriba — esto comprime en lugar de descomprimir.','Piernas extendidas — las rodillas recogidas son necesarias para la flexion lumbar.','Tension en los hombros — los hombros deben estar relajados, solo los dedos sostienen.','Movimiento — mantener la posicion estatica para maximo efecto descompresivo.'],
  variantes:['Rodillas extendidas: menor componente de flexion lumbar.','Agarre neutro: si el agarre prono genera tension en el hombro.','Con chaleco de flotacion: para personas con menor flotacion natural.'],
  notas_columna:'La traccion pasiva en barra de piscina combina dos efectos: la traccion axial (la gravedad tira hacia abajo del cuerpo mientras los brazos sujetan) y la descompresion por flotacion (el agua reduce la carga sobre los discos). Es especialmente eficaz despues de sesiones de cadena posterior (lunes) donde la carga axial acumulada es maxima.',
};

_PORT['psoas-escalerilla'] = {
  nombre:'Estiramiento psoas en escalerilla (piscina)',
  categoria:'Estiramiento acuatico / Psoas',
  color:'#185FA5',
  descripcion:'Estiramiento del psoas iliaco en la escalerilla de la piscina. La flotacion del agua elimina la compresion lumbar que generaria el mismo estiramiento fuera del agua, permitiendo un estiramiento mas profundo y menos irritante. La posicion en la escalerilla proporciona estabilidad adicional.',
  posicion:'De pie en la escalerilla. Un pie adelantado en un escalon, el otro pie atras en el agua o en un escalon inferior. Manos en el borde de la piscina para estabilidad.',
  pasos:['Posicionarse en la escalerilla con un pie adelantado en un escalon superior y el otro atras.','Manos en el borde o en los laterales de la escalerilla para estabilidad.','Hunde la cadera de la pierna trasera hacia el agua — el agua proporciona resistencia suave.','Activa el gluteo de la pierna trasera para profundizar el estiramiento.','El tronco se mantiene erguido — no inclinarse hacia adelante.','Siente el estiramiento en la zona anterior de la cadera de la pierna trasera.','Mantén 40 segundos. Cambiar de lado.'],
  errores:['Inclinarse hacia adelante — el tronco debe permanecer erguido.','No activar el gluteo trasero — sin esa contraccion el estiramiento es superficial.','Pie trasero demasiado cerca del delantero — alejar para aumentar el rango.','Tension en el hombro por agarrarse demasiado fuerte.'],
  variantes:['Version mas suave: pie trasero en el mismo escalon que el delantero.','Version mas intensa: pie trasero en el suelo de la piscina.','Sin escalerilla: apoyado en el borde de la piscina con una pierna hacia atras.'],
  notas_columna:'El psoas estira de forma identica al hip flexor stretch clasico pero con la ventaja de la flotacion — la columna lumbar no soporta carga durante el estiramiento. Tras sesiones de cadena posterior donde el psoas se ha contraido activamente (RDL, hiperextension), este estiramiento es prioritario para restaurar la longitud muscular y reducir la presion anterior sobre L1-L5.',
};

_PORT['hamstring-barra-agua'] = {
  nombre:'Hamstring stretch en barra (piscina)',
  categoria:'Estiramiento acuatico / Isquiotibiales',
  color:'#185FA5',
  descripcion:'Estiramiento de isquiotibiales apoyado en la barra o el borde de la piscina. La flotacion del agua sostiene el peso de la pierna, reduciendo la tension sobre el nervio ciatico durante el estiramiento. Permite un mayor rango de movimiento que el estiramiento en tierra sin irritar el sistema nervioso.',
  posicion:'De espaldas a la pared de la piscina. Un talon apoyado en el borde o en la escalerilla. La otra pierna en el suelo de la piscina. Tronco erguido.',
  pasos:['Posicionarse de espaldas a la pared de la piscina.','Apoya un talon en el borde de la piscina o en un escalon de la escalerilla.','La pierna de apoyo en el suelo de la piscina, ligeramente flexionada.','Tronco erguido — no inclinarse hacia adelante.','Siente el estiramiento en la parte posterior del muslo de la pierna elevada.','Para aumentar el estiramiento: inclinar muy ligeramente el tronco hacia adelante desde la cadera.','Mantén 40 segundos. Cambiar de lado.'],
  errores:['Inclinar el tronco en exceso — puede irritar el nervio ciatico.','Pierna de apoyo rigida — mantener una ligera flexion.','Forzar el rango — el agua ya facilita el estiramiento sin necesidad de forzar.','Pie en lugar de talon apoyado — el talon es mas estable.'],
  variantes:['Con rodilla ligeramente flexionada: menor tension neural, mas seguro si hay irradiacion.','Pierna elevada horizontal: rango completo para estadios avanzados.','Con flexion de tobillo (dorsiflexion): aumenta la tension neural — solo si no hay irradiacion.'],
  notas_columna:'El estiramiento de isquiotibiales en el agua es superior al estiramiento en tierra para personas con irritacion del nervio ciatico. La flotacion reduce la tension gravitacional sobre el nervio, permitiendo un estiramiento del musculo sin la tension radicular adicional. Realizarlo siempre con rodilla ligeramente flexionada en dias con irradiacion activa.',
};

_PORT['rotacion-agua'] = {
  nombre:'Rotacion toracica en agua',
  categoria:'Movilidad toracica acuatica',
  color:'#185FA5',
  descripcion:'Rotacion de la columna toracica de pie en la piscina. La resistencia del agua convierte el movimiento de rotacion en un ejercicio activo de baja intensidad. La flotacion facilita el mantenimiento de la posicion erguida y reduce la carga sobre la columna durante el movimiento.',
  posicion:'De pie en la piscina a nivel del pecho. Brazos extendidos en la superficie del agua a los lados. Pies al ancho de hombros.',
  pasos:['De pie en la piscina, agua al nivel del pecho.','Extiende los brazos en la superficie del agua a los lados — como una T.','Activa el core ligeramente. Tronco erguido.','Gira el tronco hacia un lado llevando los brazos — el agua proporciona resistencia suave.','Solo debe girar la zona toracica — la pelvis permanece de frente.','Vuelve al centro y gira hacia el otro lado. Eso es 1 repeticion.','Velocidad lenta y controlada.'],
  errores:['Pelvis que rota con el tronco — el movimiento debe ser solo toracico.','Movimiento demasiado rapido — la resistencia del agua se pierde.','Brazos que se hunden — mantenerlos en la superficie.','Flexion de rodillas en exceso para compensar.'],
  variantes:['Con palmas hacia adelante: mayor resistencia del agua.','Con palmas hacia atras: menor resistencia.','Con mayor velocidad: componente cardio anadido.'],
  notas_columna:'La rotacion toracica en agua tiene la ventaja de que la resistencia del agua es proporcional a la velocidad — si el movimiento es lento, la resistencia es minima y el ejercicio es casi pasivo. Si se aumenta la velocidad ligeramente, se convierte en un ejercicio activo. Util como transicion entre el trabajo de fuerza y la vuelta a la calma.',
};

_PORT['flotacion-supino'] = {
  nombre:'Flotacion pasiva en supino',
  categoria:'Descompresion acuatica / Recuperacion',
  color:'#185FA5',
  descripcion:'Flotacion pasiva boca arriba en la piscina. La posicion supina en el agua es la posicion de descompresion total de la columna vertebral — la columna no soporta ninguna carga y la musculatura paravertebral se relaja completamente. La flotacion activa el sistema nervioso parasimpatico y facilita la recuperacion post-sesion.',
  posicion:'Tumbado boca arriba en la superficie del agua. Brazos en cruz. Piernas ligeramente separadas. Cabeza apoyada en el agua con los oidos sumergidos.',
  pasos:['Entra en posicion supina en la piscina — los oidos quedan sumergidos.','Brazos extendidos en cruz para maximizar la flotacion.','Piernas ligeramente separadas — dejar que la lordosis se autorregule naturalmente.','Cierra los ojos si es posible. Respiracion diafragmatica lenta.','Deja que el cuerpo se adapte a la temperatura del agua y que los musculos se relajen progresivamente.','Mantén el tiempo indicado sin moverte. Si hay dificultad para flotar, usar un flotador bajo el cuello.'],
  errores:['Tension muscular que impide flotar — es una respuesta normal al inicio, ceder progresivamente.','Respiracion superficial y rapida — respiracion diafragmatica lenta.','Intentar mantener la cabeza fuera del agua — los oidos sumergidos facilitan la relajacion.','Realizar en agua fria — la temperatura optima para la relajacion muscular es 30-34 grados.'],
  variantes:['Con flotador bajo el cuello: para personas con dificultad para flotar.','Con flotadores en los brazos: mayor estabilidad lateral.','Con musica bajo el agua: si el centro dispone de equipo.'],
  notas_columna:'La flotacion en supino es la posicion de menor presion intradiscal posible — inferior incluso al decubito supino en tierra porque la columna no soporta el peso de los brazos ni de las piernas. Despues de sesiones de alta carga (lunes, martes, viernes), es la herramienta de recuperacion mas eficaz del protocolo. El tiempo en flotacion post-sesion debe ser proporcional a la intensidad de la sesion.',
};

_PORT['sauna'] = {
  nombre:'Sauna o zona caliente',
  categoria:'Recuperacion / Vasodilatacion',
  color:'#185FA5',
  descripcion:'Exposicion controlada al calor en sauna o zona caliente del centro deportivo. El calor genera vasodilatacion periferica, reduce el espasmo muscular paravertebral y aumenta la eliminacion de metabolitos de la sesion. El efecto es superior al de la bolsa de calor porque es sistemico (todo el cuerpo) y no solo local.',
  posicion:'Sentado o tumbado en la sauna o zona caliente. Temperatura 38-42 grados Celsius.',
  pasos:['Hidratarse bien antes de entrar — al menos 500 ml de agua.','Entrar a la sauna o zona caliente cuando la temperatura este entre 38-42 grados.','Sentarse o tumbarse en una posicion comoda — preferiblemente tumbado si el espacio lo permite.','Respiracion lenta y diafragmatica — el calor aumenta la frecuencia respiratoria, resistir la tendencia.','Permanecer 10-15 minutos.','Salir si aparece mareo, nauseas o incomodidad excesiva — respetar los limites.','Hidratarse de nuevo al salir.'],
  errores:['Superar 42 grados Celsius — por encima de esta temperatura el efecto es contraproducente.','Entrar deshidratado — riesgo de hipotension.','Permanecer mas de 15-20 minutos.','Entrar directamente desde el ejercicio intenso sin una transicion de 5 minutos.','Hacer ejercicio intenso dentro de la sauna.'],
  variantes:['Sauna finlandesa (seca): 80-100 grados con baja humedad — tolerable 8-10 min.','Sauna de vapor (humeda): 38-45 grados con alta humedad — mas suave.','Bano caliente en casa: alternativa equivalente a 38-40 grados.','Bolsa de calor localizada: menos eficaz pero disponible siempre.'],
  notas_columna:'El calor sistemico reduce el espasmo de los musculos paravertebrales que es frecuente despues de sesiones de cadena posterior. El espasmo paravertebral comprime adicionalmente los discos ya extruidos — su reduccion mejora la descompresion. El efecto del calor dura 2-4 horas despues de la exposicion, por lo que es ideal como cierre de sesion antes de dormir.',
};

_PORT['ergometro'] = {
  nombre:'Ergometro de remo',
  categoria:'Cardio / Cadena posterior',
  color:'#185FA5',
  descripcion:'Cardio en ergometro de remo (rowing machine). Trabaja la cadena posterior (gluteo, isquiotibiales, erectores) y la cadena de tiro (dorsal, biceps) de forma coordinada. Es el ejercicio cardiovascular que mas se integra con el trabajo de fuerza del lunes — el patron de bisagra es identico al del RDL.',
  posicion:'Sentado en el ergometro. Pies en los soportes. Rodillas flexionadas. Manos en el manillar.',
  pasos:['Sentarse en el ergometro. Pies en los soportes con correas ajustadas.','Posicion inicial: rodillas flexionadas, tronco ligeramente inclinado hacia adelante (no redondeado), brazos extendidos.','El drive (potencia) se inicia con las piernas — empuja con los talones primero.','Cuando las piernas esten casi extendidas, inclina el tronco ligeramente hacia atras (hasta 11 en punto).','Finalmente tira con los brazos llevando el manillar al esternon.','La vuelta es la secuencia inversa: brazos primero, luego tronco, luego piernas.','Damper 3-4. FC objetivo 110-125 lpm.'],
  errores:['Iniciar el drive con los brazos o el tronco en lugar de con las piernas.','Redondear la espalda lumbar en la posicion inicial — lumbar neutra siempre.','Inclinar el tronco demasiado hacia atras — hasta 11 en punto es suficiente.','Frecuencia demasiado alta a baja intensidad — mantener FC 110-125.'],
  variantes:['Damper 3-4 (F2): resistencia moderada, cadencia moderada.','Damper 1-2: menor resistencia, mayor cadencia — menos carga lumbar.','Intervalos cortos: 500m trabajo / 1 min descanso — para variar el estimulo.'],
  notas_columna:'El ergometro es el cardio mas especifico para tu protocolo porque entrena el patron de bisagra en un contexto cardiovascular — preparando la columna y la cadena posterior para la sesion de fuerza que sigue. La clave es mantener la espalda neutra durante todo el stroke — si la lumbar se redondea en algun punto del ciclo, reducir la carga (damper) o la intensidad.',
};

_PORT['eliptica'] = {
  nombre:'Eliptica',
  categoria:'Cardio / Bajo impacto',
  color:'#185FA5',
  descripcion:'Cardio en maquina eliptica. El patron de movimiento eliptico simula la marcha y la carrera sin el impacto del suelo. La carga axial sobre la columna es minima porque los pies nunca se separan de los pedales. Es el cardio de menor impacto lumbar del protocolo despues del ergometro.',
  posicion:'De pie en la eliptica. Pies en los pedales. Manos en los manillares moviles o fijos. Tronco erguido.',
  pasos:['Subir a la eliptica. Pies en los pedales — los talones deben contactar el pedal en todo momento.','Agarra los manillares moviles para activar la cadena superior o los fijos para mayor estabilidad.','Inicia el movimiento con las piernas siguiendo el patron eliptico — no empujar con los brazos.','Tronco erguido durante todo el ejercicio — no inclinarse hacia adelante.','FC objetivo: 110-125 lpm. Resistencia 3-5.','Sin standing (levantarse de los pedales) en F2 — mantener el patron sentado o semisentado.'],
  errores:['Inclinarse hacia adelante sobre los manillares — aumenta la carga lumbar.','Standing (levantarse) — contraindicado en F2 por la carga axial.','FC por encima de 130 lpm en la zona de calentamiento — reducir resistencia.','Sujetar los manillares fijos con tension — relajar los brazos.'],
  variantes:['Resistencia 3: inicio F2.','Resistencia 5: progresion.','Sin manillares (brazos libres): mayor demanda de estabilidad de core.','Marcha atras: activa mas los gluteos y los isquiotibiales.'],
  notas_columna:'La eliptica genera el menor impacto articular de los equipos de cardio del gimnasio. La ausencia de fase de vuelo (los pies nunca se elevan) elimina el impacto de aterrizaje que genera la carrera y que comprime los discos. Es el cardio ideal para los dias de squat (viernes) porque no genera fatiga adicional de cadena posterior antes de la sesion principal.',
};

_PORT['bici-estatica'] = {
  nombre:'Bici estatica (spinning)',
  categoria:'Cardio / Bajo impacto',
  color:'#185FA5',
  descripcion:'Cardio en bicicleta estatica. La posicion sentada elimina la carga axial sobre la columna. La cadena cinetica cerrada (pie en el pedal) genera menos impacto que la carrera. En F2 se realiza sin standing para evitar cualquier carga axial.',
  posicion:'Sentado en la bicicleta. Altura del asiento regulada para que la rodilla quede ligeramente flexionada en la extension maxima del pedal. Tronco ligeramente inclinado hacia adelante con la espalda neutra.',
  pasos:['Ajustar la altura del asiento: en la extension maxima del pedal, la rodilla debe quedar ligeramente flexionada (5-10 grados).','Ajustar el manillar: la posicion del tronco debe ser comoda — entre 45 y 90 grados de inclinacion.','Espalda neutra durante todo el ejercicio — no redondear la zona lumbar.','Cadencia objetivo: 70-85 rpm. FC objetivo: 110-120 lpm.','Sin standing en F2 — permanecer sentado durante toda la sesion.','Respiracion continua y ritmica.'],
  errores:['Standing — contraindicado en F2 por la carga axial.','Asiento demasiado bajo — genera flexion excesiva de rodilla y puede irritar la zona lumbar.','Tronco demasiado inclinado hacia adelante — puede generar tension en la zona lumbar posterior.','Resistencia demasiado alta — dificulta la cadencia correcta.'],
  variantes:['Cadencia 70 rpm resistencia baja: recuperacion activa.','Cadencia 85 rpm resistencia media: cardio base.','Intervalos: 1 min cadencia alta / 2 min cadencia moderada.'],
  notas_columna:'La bicicleta estatica en posicion sentada es el cardio con menor carga axial del protocolo. La posicion semiflexionada de la cadera puede generar algo de tension en el psoas si la sesion es muy larga — hacer el couch stretch o el hip flexor stretch despues. No superar 20 minutos en F2 para evitar la fatiga del psoas que comprometeria la postura lumbar.',
};

_PORT['est-pectoral-agua'] = {
  nombre:'Estiramiento pectoral en esquina (piscina)',
  categoria:'Estiramiento acuatico / Pectoral',
  color:'#185FA5',
  descripcion:'Estiramiento del pectoral mayor en la esquina de la piscina. Los brazos apoyados en los bordes perpendiculares y el peso del cuerpo hundiendose hacia el agua generan un estiramiento efectivo del pectoral. La flotacion facilita el estiramiento sin la carga gravitacional del estiramiento en tierra.',
  posicion:'De pie en la esquina de la piscina. Un brazo en cada borde, perpendiculares entre si. Cuerpo de frente a la esquina.',
  pasos:['Colocarse en la esquina de la piscina con un brazo en cada borde a 90 grados.','Los codos a la altura de los hombros — si estan mas altos, aumenta el riesgo de impingement.','Hunde el pecho hacia el agua dejando que el cuerpo se incline hacia adelante en la esquina.','La flotacion del agua facilita el balance y el estiramiento pasivo.','Respira profundamente — en cada exhala, el pecho se hunde un poco mas.','Mantén 40 segundos.'],
  errores:['Codos por encima de los hombros — riesgo de impingement subacromial.','Inclinar el tronco en exceso hacia adelante — el estiramiento debe ser confortable.','Tension en el cuello — relajar los trapez ios.'],
  variantes:['Un brazo a la vez en el borde: estiramiento unilateral.','Con inclinacion lateral: estiramiento del pectoral inferior.'],
  notas_columna:'El pectoral tenso contribuye a la postura de hombros adelantados que genera tension toracica y cervical. Despues de sesiones de press (jueves), el estiramiento del pectoral restaura la longitud muscular y mejora la postura toracica — beneficiando indirectamente la mecanica lumbar.',
};

_PORT['est-dorsal-agua'] = {
  nombre:'Estiramiento dorsal en borde / trapecio en barra (piscina)',
  categoria:'Estiramiento acuatico / Dorsal',
  color:'#185FA5',
  descripcion:'Estiramiento del dorsal ancho y el trapecio inferior con traccion en el borde o barra de la piscina. El agua sostiene el peso del cuerpo mientras los brazos traccionan el dorsal en elongacion. Complementa el trabajo de remo y los jalones restaurando la longitud del dorsal tras la sesion.',
  posicion:'Agarrado al borde de la piscina o a una barra. Cuerpo en el agua. Brazos extendidos traccionando el dorsal.',
  pasos:['Agarra el borde de la piscina o la barra con ambas manos al ancho de hombros.','Deja que el cuerpo caiga hacia atras en el agua — los brazos traccionan el dorsal.','Para aumentar el estiramiento lateral: gira ligeramente el cuerpo hacia un lado mientras tracciona.','El agua sostiene el cuerpo — relajar la musculatura completamente.','Mantén 30 segundos en cada posicion.'],
  errores:['Tension en los hombros — el agarre debe ser relajado, solo la fuerza necesaria para sujetarse.','No girar el cuerpo lateralmente — el giro es lo que permite el estiramiento del dorsal especifico de cada lado.','Pies que empujan el suelo de la piscina — dejar que el cuerpo flote.'],
  variantes:['Con rotacion lateral del tronco: mas especifico para el dorsal de ese lado.','Solo traccion: version mas sencilla sin rotacion.','Con agarre neutro: menos estres en el hombro.'],
  notas_columna:'El dorsal ancho tiene insercion en las apofisis espinosas de T7 a L5, en el sacro y en la cresta iliaca. Su contraccion sin elongacion posterior genera una compression posterior sobre los discos lumbares. Este estiramiento restaura la longitud del dorsal despues del trabajo de remo y jalones, reduciendo la tension posterior sobre L4-L5 y L5-S1.',
};

_PORT['est-tfl-agua'] = {
  nombre:'Estiramiento TFL en borde (piscina)',
  categoria:'Estiramiento acuatico / TFL',
  color:'#185FA5',
  descripcion:'Estiramiento de la banda iliotibial y el tensor de la fascia lata (TFL) en el borde de la piscina. La posicion de pie de lado al muro con la pierna cruzada por delante genera un estiramiento efectivo del TFL. La flotacion facilita el equilibrio y reduce la carga sobre la cadera.',
  posicion:'De pie de lado al muro de la piscina. La pierna exterior cruzada por delante de la pierna interior. Cadera empujada hacia el muro.',
  pasos:['De pie de lado al muro, un hombro hacia el muro, mano en el borde.','Cruza la pierna exterior por delante de la pierna interior — el pie exterior queda al lado del pie interior.','Empuja la cadera del lado del muro hacia el muro — este movimiento estira el TFL.','El tronco permanece erguido.','Siente el estiramiento en la cara lateral del muslo y la cadera del lado del muro.','Mantén 45 segundos. Cambiar de lado.'],
  errores:['No cruzar la pierna suficientemente — el pie debe quedar al otro lado del pie de apoyo.','No empujar la cadera hacia el muro — ese es el movimiento que genera el estiramiento.','Inclinarse hacia el muro con el tronco — solo la cadera se acerca, no el tronco.'],
  variantes:['Con mayor cruce de pierna: mayor estiramiento.','Version en tierra: contra una pared, misma mecanica.'],
  notas_columna:'El TFL tenso puede tirar de la cresta iliaca y generar una inclinacion pelvica lateral que afecta a la carga sobre L4-L5 y L5-S1. Despues de sesiones de squat y abductores (viernes), el estiramiento del TFL corrige esta tension y restaura la alineacion pelvica.',
};

_PORT['est-gluteo-agua'] = {
  nombre:'Gluteo stretch / pigeon en escalerilla (piscina)',
  categoria:'Estiramiento acuatico / Gluteo y piriforme',
  color:'#185FA5',
  descripcion:'Estiramiento del gluteo mayor y el piriforme en la escalerilla de la piscina. La espinilla apoyada en un escalon superior y el cuerpo semi-sumergido replican la mecanica del pigeon pose con la ventaja de que el agua reduce el peso corporal, facilitando el estiramiento y reduciendo la compresion sobre la cadera.',
  posicion:'De pie en la escalerilla. La espinilla de la pierna a estirar apoyada en un escalon superior. Cuerpo semi-sumergido. Manos en los laterales de la escalerilla.',
  pasos:['Colocarse en la escalerilla con la espinilla de la pierna a estirar en un escalon superior.','La rodilla a 90 grados — espinilla horizontal apoyada en el escalon.','Cuerpo semi-sumergido, manos en los laterales para estabilidad.','Inclina ligeramente el tronco hacia adelante desde la cadera para profundizar el estiramiento.','El agua sostiene parte del peso corporal, facilitando el estiramiento.','Mantén 45 segundos. L5-S1 izquierdo primero.'],
  errores:['Rodilla que cuelga sin apoyo completo de la espinilla.','Tronco redondeado al inclinarse — la inclinacion debe venir de la cadera.','No comenzar por el lado izquierdo.'],
  variantes:['Solo apoyo de espinilla sin inclinacion de tronco: version mas suave.','Con mayor inclinacion de tronco: mayor estiramiento del piriforme.'],
  notas_columna:'El pigeon pose en escalerilla de piscina es la version mas relajada del estiramiento del piriforme del protocolo. La flotacion permite un estiramiento mas profundo y mantenido que en tierra. Especialmente importante despues de sesiones de hip y gluteo (martes) para restaurar la longitud del piriforme y reducir la tension sobre el nervio ciatico.',
};

_PORT['est-abductor-agua'] = {
  nombre:'Abductor stretch en escalerilla (piscina)',
  categoria:'Estiramiento acuatico / Abductores',
  color:'#185FA5',
  descripcion:'Estiramiento de los abductores de cadera (gluteo medio y TFL) en la escalerilla de la piscina. La pierna abierta lateralmente en un escalon y el centro de gravedad bajando hacia el agua generan un estiramiento efectivo de la cara lateral de la cadera.',
  posicion:'De pie en la escalerilla. Una pierna abierta lateralmente apoyada en un escalon. La otra pierna en el suelo de la piscina o en un escalon inferior.',
  pasos:['Colocarse en la escalerilla con una pierna abierta lateralmente en un escalon superior.','La pierna de apoyo en el suelo o en un escalon inferior.','Baja el centro de gravedad hacia el agua flexionando ligeramente la pierna de apoyo.','Siente el estiramiento en la cara lateral de la cadera y el muslo de la pierna elevada.','Mantén 40 segundos. Cambiar de lado.'],
  errores:['Inclinar el tronco hacia el lado de la pierna elevada — el tronco permanece erguido.','Rango excesivo — ir hasta donde el estiramiento es comodo.','Pierna de apoyo rigida — flexion ligera para mayor estabilidad.'],
  variantes:['Con mayor apertura lateral: mayor estiramiento.','Con inclinacion lateral del tronco al lado contrario: estiramiento del cuadrado lumbar anadido.'],
  notas_columna:'Los abductores tensos generan una inclinacion pelvica lateral que sobrecarga el disco L5-S1 del lado contrario. Despues de sesiones de abductores en maquina (viernes), este estiramiento es prioritario para restaurar la longitud muscular y mantener la alineacion pelvica.',
};

_PORT['est-deltoides-agua'] = {
  nombre:'Estiramiento deltoides posterior en agua',
  categoria:'Estiramiento acuatico / Hombro posterior',
  color:'#185FA5',
  descripcion:'Estiramiento del deltoides posterior y el manguito rotador posterior en el agua. El brazo cruzado frente al pecho mientras el agua actua como palanca suave genera un estiramiento efectivo sin el riesgo de compresion subacromial del estiramiento clasico en tierra.',
  posicion:'De pie en la piscina. Un brazo cruzado frente al pecho a la altura del hombro. La mano del otro brazo apoya en el codo del brazo cruzado.',
  pasos:['De pie en la piscina, agua al nivel del pecho.','Cruza el brazo a estirar frente al pecho — paralelo al suelo.','Con la mano contraria, sostén el codo del brazo cruzado.','Lleva el codo del brazo cruzado hacia el hombro contrario — la resistencia del agua ayuda.','Siente el estiramiento en la cara posterior del hombro y la parte alta del brazo.','Mantén 30 segundos. Cambiar de lado.'],
  errores:['Elevar el hombro del brazo cruzado durante el estiramiento.','Tirar del antebrazo en lugar del codo — puede generar tension en el codo.','Inclinarse hacia el lado del brazo cruzado.'],
  variantes:['Con el brazo mas elevado (a la altura del cuello): estira mas el infraespinoso.','Con el brazo mas bajo (a la altura del ombligo): estira mas el redondo menor.'],
  notas_columna:'El deltoides posterior y los rotadores externos del hombro pueden acortarse tras sesiones intensas de remo y jalones. Su tension puede irradiarse hacia el trapecio y generar tension cervical — que a su vez puede confundirse o sumarse al dolor lumbar. El estiramiento posterior del hombro en agua es el cierre natural de las sesiones de tiro vertical y horizontal.',
};

_PORT['est-cuadriceps-agua'] = {
  nombre:'Quadriceps stretch en borde (piscina)',
  categoria:'Estiramiento acuatico / Cuadriceps',
  color:'#185FA5',
  descripcion:'Estiramiento del cuadriceps y el recto femoral de pie junto al muro de la piscina. El talon llevado al gluteo estira el recto femoral (que cruza la articulacion de la cadera) ademas del cuadriceps. La flotacion facilita el equilibrio y la mano en el borde da estabilidad.',
  posicion:'De pie junto al muro de la piscina. Una mano en el borde para equilibrio. La otra mano agarra el tobillo de la pierna a estirar llevandolo hacia el gluteo.',
  pasos:['De pie junto al muro, una mano en el borde para equilibrio.','Flexiona la rodilla de la pierna a estirar llevando el talon hacia el gluteo.','Agarra el tobillo con la mano del mismo lado.','Las rodillas deben estar juntas — la rodilla de la pierna que estiras debe quedar cerca de la rodilla de apoyo.','Activa ligeramente el gluteo de la pierna estirada para aumentar el estiramiento del recto femoral.','Mantén 35 segundos. Cambiar de lado.'],
  errores:['Rodilla de la pierna estirada que se adelanta — debe quedar junto a la rodilla de apoyo.','Inclinar el tronco hacia adelante — tronco erguido.','Agarrar el pie en lugar del tobillo — riesgo de hiperflexion de la rodilla.'],
  variantes:['Con la cadera en ligera extension: mayor estiramiento del recto femoral.','Apoyado en el borde en posicion de lunge: version en tierra.'],
  notas_columna:'El recto femoral es el unico musculo del cuadriceps que cruza la articulacion de la cadera — su tension genera anteversion pelvica que aumenta la lordosis lumbar. Despues de sesiones de squat y prensa (viernes), este estiramiento corrige la anteversion pelvica generada por el trabajo de cuadriceps y restaura la alineacion lumbar.',
};

_PORT['dead-hang'] = {
  nombre:'Dead hang en barra',
  categoria:'Descompresion / Fuerza de agarre',
  color:'#0F6E56',
  descripcion:'Colgado pasivo de una barra con agarre prono. El peso del cuerpo genera una traccion axial suave sobre toda la columna vertebral. Ademas de la descompresion, mejora la fuerza de agarre y la resistencia del manguito rotador en posicion de carga. En estadios avanzados progresa al hollow body hang.',
  posicion:'Colgado de una barra con agarre prono (palmas hacia adelante) al ancho de hombros o ligeramente mas ancho. Brazos completamente extendidos. Pies sin apoyo.',
  pasos:['Agarra la barra con agarre prono al ancho de hombros.','Eleva los pies del suelo dejando que el cuerpo cuelgue libremente.','Las escapulas se elevan ligeramente — esto es normal y correcto en el dead hang pasivo.','Respira de forma continua. El cuerpo se relaja progresivamente.','Mantén el tiempo indicado segun el estadio.','Para bajar: flexiona ligeramente las rodillas y apoya los pies suavemente.'],
  errores:['Tension excesiva en los hombros intentando "sostener" activamente — dejar que las escapulas suban libremente.','Movimiento del cuerpo como un pendulo — mantener el cuerpo estatico.','Agarre demasiado estrecho — puede generar tension en el biceps.','Bajar bruscamente — los pies deben apoyar suavemente.'],
  variantes:['S1-2: 4x20 seg.','S3-4: 4x25 seg.','S5-6: 4x35 seg.','S7+: 4x45 seg.','F3: hollow body hang (core activado en la posicion colgada).'],
  notas_columna:'El dead hang genera una traccion axial sobre la columna que puede ser descompresiva — especialmente para los discos lumbares. Sin embargo, en presencia de extrusiones activas con migracion caudal, la traccion debe ser gradual. Comenzar con tiempos cortos (20 seg) y observar la respuesta — si aparece irradiacion durante o despues, suspender y consultar. En la mayoria de los casos es beneficioso y bien tolerado.',
};

_PORT['superman'] = {
  nombre:'Superman hold en suelo',
  categoria:'Extensores lumbares / Activacion suave',
  color:'#993C1D',
  descripcion:'Extension simultanea de brazos y piernas en decubito prono. Activa los erectores espinales, el gluteo y los isquiotibiales de forma suave. Es la version mas basica del trabajo de extension lumbar en el suelo — sin banco ni equipamiento. En dias neurales se usa como activacion suave de la cadena posterior.',
  posicion:'Tumbado boca abajo en el suelo. Brazos extendidos sobre la cabeza. Piernas extendidas.',
  pasos:['Tumbado boca abajo, brazos extendidos sobre la cabeza, piernas extendidas.','Activa el gluteo antes de elevar.','Eleva simultaneamente los brazos y las piernas del suelo.','La altura es minima — solo 5-10 cm — el objetivo es la activacion, no el rango.','Mantén la pausa indicada (2 segundos). Vuelve al suelo.','Respirar de forma continua.'],
  errores:['Elevar demasiado — el rango excesivo genera hiperlordosis lumbar.','No activar el gluteo antes de elevar — el gluteo debe liderar el movimiento.','Tension en el cuello — la cabeza se eleva con el tronco de forma natural.','Realizarlo si hay irradiacion activa — suspender si aparece irradiacion durante el ejercicio.'],
  variantes:['Solo brazos: menor demanda.','Solo piernas: activa mas el gluteo y los isquiotibiales.','Alternando (brazo derecho + pierna izquierda): version asimetrica.','Con pausa prolongada 5 seg: mayor tiempo bajo tension.'],
  notas_columna:'El superman es la alternativa al single leg reverse hyper cuando no hay banco disponible (dias en casa). Genera una activacion suave de los extensores lumbares sin la carga del banco de hiperextension. En dias neurales, el objetivo es mantener la activacion de la cadena posterior sin generar fatiga — el rango minimo y las pausas cortas son correctas para este fin.',
};

// ══════════════════════════════════════════════
// FIN BLOQUE 9
// ══════════════════════════════════════════════

_PORT['curl-barra'] = {
  nombre:'Curl de biceps en barra Z',categoria:'Biceps',color:'#185FA5',
  descripcion:'Curl con barra Z (EZ bar) sentado. La barra en Z reduce el estres en la muneca respecto a la barra recta. Aislamiento de biceps sin carga axial.',
  posicion:'Sentado en banco con respaldo o en banco Scott. Barra en manos con agarre supino (palmas arriba), codos pegados al torso.',
  pasos:['Agarra la barra Z en los angulos intermedios — ancho de hombros.','Mantén los codos completamente fijos durante todo el movimiento.','Sube la barra flexionando los codos hasta maxima contraccion.','Baja de forma controlada en 3 segundos — no dejes caer.','Al fondo: brazos casi extendidos pero sin bloquear completamente.'],
  errores:['Mover los codos hacia adelante al subir.','Usar impulso del torso.','No bajar completamente.'],
  variantes:['Barra recta: mas activacion biceps largo pero mas estres muneca.','Polea baja: tension constante durante todo el rango.','Concentrado en banco inclinado: mayor estiramiento.'],
  notas_columna:'Sentado obligatorio en F2. Codos fijos — cualquier compensacion lumbar indica peso excesivo. Sin carga axial.',
};
_PORT['curl-martillo'] = {
  nombre:'Curl martillo (hammer curl)',categoria:'Biceps / Braquial',color:'#185FA5',
  descripcion:'Curl con agarre neutro (palmas enfrentadas). Trabaja el braquial y braquiorradial ademas del biceps. Excelente para grosor de brazo.',
  posicion:'Sentado o de pie. Mancuernas a los lados con agarre neutro — palmas enfrentadas. Codos pegados al torso.',
  pasos:['Agarre neutro — no rotar la muneca durante el movimiento.','Sube la mancuerna manteniendo la muneca neutra.','Codos fijos al torso.','Baja de forma controlada.'],
  errores:['Rotar la muneca al subir.','Mover los codos.','Usar impulso.'],
  variantes:['Alternado: un brazo cada vez.','Bilateral: ambos a la vez.','En polea con cuerda: tension constante.'],
  notas_columna:'Sentado en F2. Identico en seguridad lumbar al curl estandar.',
};
_PORT['triceps-polea'] = {
  nombre:'Extension de triceps en polea alta',categoria:'Triceps',color:'#3C3489',
  descripcion:'Aislamiento de triceps en polea alta. Sin carga axial. Tension constante en todo el rango. Uno de los mejores ejercicios para triceps.',
  posicion:'De pie frente a la polea alta. Manos en cuerda o barra V. Codos flexionados a 90 grados, pegados al torso.',
  pasos:['Codos completamente fijos al cuerpo — solo se mueven los antebrazos.','Extiende los codos hasta bloquearlos completamente.','Con cuerda: separa los extremos al final para maxima contraccion.','Vuelve controlado en 2-3 seg.'],
  errores:['Mover los codos hacia adelante — pierdes el aislamiento.','Inclinar excesivamente el torso.','No bloquear al final.'],
  variantes:['Cuerda: mayor contraccion final.','Barra V o recta: mas peso posible.','Un brazo: corrige desequilibrios.'],
  notas_columna:'Sin carga axial. Seguro desde F2. Evitar extension sobre la cabeza hasta F3.',
};
_PORT['fondos-triceps'] = {
  nombre:'Fondos de triceps en banco',categoria:'Triceps / Pecho inferior',color:'#3C3489',
  descripcion:'Ejercicio de triceps usando el borde de un banco. Sin carga axial. Trabaja triceps, pecho inferior y deltoides anterior.',
  posicion:'Sentado en el borde del banco. Manos en el borde. Pies en el suelo, rodillas a 90 grados (version F2).',
  pasos:['Separa las caderas del banco apoyado en las manos.','Baja doblando los codos hasta 90 grados.','Empuja hasta extender los codos.','Mantener hombros bajos — no encoger.'],
  errores:['Bajar mas de 90 grados — estres excesivo en hombro.','Encoger hombros al subir.','Cuerpo demasiado separado del banco.'],
  variantes:['F2: rodillas a 90 — version mas facil.','F3: piernas extendidas — mas carga.'],
  notas_columna:'Sin carga axial directa. En F2 usar version con rodillas a 90.',
};
_PORT['press-smith'] = {
  nombre:'Press en maquina Smith 30 grados',categoria:'Pecho superior / Hombro / Triceps',color:'#3C3489',
  descripcion:'Press inclinado en maquina Smith. El respaldo elimina la carga axial lumbar. Trabaja pecho superior, hombro anterior y triceps.',
  posicion:'Banco inclinado 30 grados dentro de la maquina Smith. Espalda completamente apoyada. Pies plantados en el suelo. Barra a la altura del pecho superior.',
  pasos:['Agarra la barra algo mas ancho que los hombros.','Desengancha y baja la barra de forma controlada al pecho superior — 3 seg.','Empuja hacia arriba sin bloquear los codos.','Espalda siempre pegada al banco.'],
  errores:['Arquear la lumbar para empujar mas peso.','Codos a 90 grados — aumenta estres en hombro.','Rebotar la barra en el pecho.'],
  variantes:['F2: angulo 30-45 grados con respaldo obligatorio.','F3: press en banco libre cuando columna estabilizada.'],
  notas_columna:'El respaldo del banco es lo que hace seguro este ejercicio en F2. Sin respaldo, el press genera carga axial lumbar relevante. No realizar de pie o sin apoyo hasta F3 consolidada.',
};
_PORT['aperturas-cable'] = {
  nombre:'Aperturas en polea cruzada (cable)',categoria:'Pecho — Aislamiento',color:'#3C3489',
  descripcion:'Aislamiento de pecho en polea cruzada. La tension constante del cable es superior a la mancuerna en toda la amplitud del movimiento.',
  posicion:'De pie en el centro entre dos poleas altas. Un agarre en cada mano. Ligera inclinacion hacia adelante. Brazos extendidos a los lados, ligera flexion en codos.',
  pasos:['Desde posicion abierta, lleva ambas manos hacia el centro frente al pecho.','En el centro: los dorsos de las manos casi se tocan.','Vuelve a la posicion abierta de forma controlada.','Mantener la ligera flexion en codos durante todo el movimiento.'],
  errores:['Extender los codos completamente — se convierte en press.','Rango excesivo atras — capsula del hombro vulnerable.','Usar impulso del torso.'],
  variantes:['Poleas altas: pecho inferior.','Poleas bajas: pecho superior.','Polea unilateral: mas control.'],
  notas_columna:'De pie con tension en core. Sin carga axial relevante. El rango hacia atras debe limitarse a donde el hombro este comodo — no forzar apertura maxima en F2.',
};
_PORT['press-hombro-maq'] = {
  nombre:'Press de hombros en maquina (sentado)',categoria:'Hombro — Deltoides / Triceps',color:'#3C3489',
  descripcion:'Press vertical de hombros en maquina con respaldo. Trabaja deltoides anterior y medio, y triceps. En F2 obligatoriamente sentado con respaldo para eliminar la carga axial.',
  posicion:'Sentado en la maquina, espalda completamente apoyada. Agarra las asas a la altura de los hombros.',
  pasos:['Empuja hacia arriba hasta casi extender los codos — sin bloquear.','Baja de forma controlada en 3 seg hasta posicion inicial.','Espalda pegada al respaldo durante toda la serie.'],
  errores:['Arquear la lumbar para subir mas peso.','Bloquear los codos arriba.','Encogerse de hombros.'],
  variantes:['F2: maquina con respaldo — obligatorio.','F3: con mancuernas sentado — sin respaldo cuando columna estabilizada.'],
  notas_columna:'El press de hombros de pie esta contraindicado hasta F3 consolidada. El respaldo elimina el momento de flexion lumbar. Usar maquina antes que mancuernas libres.',
};
_PORT['elevaciones-lat'] = {
  nombre:'Elevaciones laterales con mancuernas',categoria:'Hombro — Deltoides medio',color:'#3C3489',
  descripcion:'Aislamiento del deltoides medio. Sin carga axial relevante. Puede hacerse de pie o sentado.',
  posicion:'De pie o sentado. Mancuernas a los lados, ligera flexion en codos (10-15 grados). Torso ligeramente inclinado.',
  pasos:['Eleva los brazos lateralmente hasta la altura de los hombros.','El codo debe estar ligeramente mas alto que la muneca en el punto alto.','Baja controlado en 3 seg.','No usar impulso del torso.'],
  errores:['Encogerse de hombros al subir.','Subir por encima de la altura de hombros.','Impulso del torso.'],
  variantes:['Sentado: elimina el impulso.','Un brazo con apoyo: mas control.','Cable lateral: tension constante.'],
  notas_columna:'Sin carga axial. Seguro desde F2. Pesos ligeros al inicio.',
};
_PORT['pajaros'] = {
  nombre:'Pajaros (rear delt) en maquina o mancuernas',categoria:'Hombro posterior — Deltoides posterior',color:'#3C3489',
  descripcion:'Ejercicio para el deltoides posterior. Muy importante para equilibrar el trabajo de press y prevenir la postura encorvada. Puede hacerse en maquina pec deck invertida o con mancuernas inclinado.',
  posicion:'En maquina: sentado mirando al almohadillado, brazos extendidos al frente. Con mancuernas: de pie inclinado 45 grados con apoyo lumbar, mancuernas colgando.',
  pasos:['Maquina: abre los brazos hacia atras controlando la escapula.','Mancuernas: eleva los brazos lateralmente hacia atras hasta hombros.','Pausa 1 seg en el punto alto — contrae el deltoides posterior.','Vuelve controlado.'],
  errores:['Usar el trapecio en lugar del deltoides posterior.','Peso excesivo — el deltoides posterior es pequeño.','No pausar en el punto alto.'],
  variantes:['Maquina pec deck invertida: mas facil de aislar.','Mancuernas inclinado con apoyo: sin carga lumbar.','Cable face pull: tambien trabaja el deltoides posterior.'],
  notas_columna:'Con mancuernas inclinado: usar apoyo frontal para no cargar la lumbar. La maquina es preferible en F2. El deltoides posterior es antagonista del pecho — su trabajo es protector del manguito rotador.',
};
_PORT['abduccion-maq'] = {
  nombre:'Abduccion de cadera en maquina',categoria:'Gluteo medio / TFL / Abductores',color:'#993C1D',
  descripcion:'Aislamiento del gluteo medio y abductores en maquina. Sin carga axial. Fundamental para estabilidad pelvica lateral.',
  posicion:'Sentado en la maquina de abduccion. Espalda apoyada. Piernas en los acolchados, rodillas a 90 grados.',
  pasos:['Abre las piernas contra la resistencia de forma controlada.','Llega al rango maximo comodo sin dolor en cadera.','Vuelve de forma controlada — no dejes caer.','Mantener espalda apoyada durante todo el movimiento.'],
  errores:['Inclinar el torso para ampliar el rango.','Rango excesivo si hay molestia en la articulacion.','Velocidad excesiva.'],
  variantes:['F2: rango parcial si hay molestia en la cadera.','Pie en suelo: abduccion de pie en polea baja.','Monster walk: version funcional con banda.'],
  notas_columna:'Rango parcial (F2 inicio): si hay molestia en la cadera lateral izquierda, el rango reducido permite trabajar el gluteo medio sin comprimir el trocanter mayor contra el acetabulo. La maquina es preferible a la polea de pie en F2 porque el asiento elimina cualquier carga axial lumbar durante el movimiento. Pie en suelo (polea baja): version de pie que activa adicionalmente el core de estabilizacion — introducir en S5+. Monster walk (version funcional): la transferencia al patron de marcha es mayor con el monster walk que con la maquina — complementar, no sustituir. El gluteo medio izquierdo debilitado por afectacion L5 genera colapso pelvico contralateral en la marcha: cada paso con el pie derecho apoyado, la pelvis cae hacia la derecha porque el gluteo medio izquierdo no puede sostenerla — patron de Trendelenburg que aumenta la cizalla sobre L5-S1 izquierdo en cada ciclo de marcha.',
};
_PORT['remo-polea-baja'] = {
  nombre:'Remo en polea baja sentado',categoria:'Espalda media — Romboides / Trapecio / Biceps',color:'#3C3489',
  descripcion:'Ejercicio de tiro horizontal en polea baja. Trabaja espalda media (romboides, trapecio medio), dorsal inferior y biceps. Sin carga axial cuando se mantiene el torso erguido.',
  posicion:'Sentado en el banco de remo. Espalda erguida. Pies en los apoyos. Agarra el tirador con ambas manos — agarre neutro o prono.',
  pasos:['Posicion inicial: brazos extendidos, espalda erguida — no inclinarse hacia adelante.','Tira del tirador hacia el abdomen manteniendo los codos pegados al torso.','En el punto final: omoplatos juntos, pecho abierto.','Vuelve controlado sin dejar que el torso se doble hacia adelante.'],
  errores:['Inclinarse hacia adelante para ampliar el rango — carga la lumbar.','Encogerse de hombros en lugar de retraer escapulas.','Usar impulso del torso.'],
  variantes:['Agarre ancho prono: mas trapecio.','Agarre estrecho neutro: mas dorsal.','Un brazo: corrige desequilibrios.'],
  notas_columna:'El error mas comun es inclinarse hacia adelante — esto genera flexion lumbar bajo carga. Mantener el torso perpendicular al suelo durante todo el movimiento.',
};
_PORT['press-hombro-smith'] = EX_DB['press-smith'];

_PORT['heel-sit'] = {
  nombre: 'Heel sit (posicion en talones)',
  categoria: 'Movilidad / Descompresion',
  color: '#0F6E56',
  descripcion: 'Posicion de rodillas con gluteos sobre talones. Combina descompresion lumbar pasiva, estiramiento del cuadriceps y activacion del control segmentario lumbar en posicion de carga minima.',
  posicion: 'De rodillas en el suelo o colchoneta. Empeines apoyados. Gluteos descendiendo hacia los talones. Tronco erguido, manos sobre los muslos o en el suelo para apoyo inicial.',
  pasos: [
    'Desde posicion de rodillas, baja lentamente los gluteos hacia los talones.',
    'Mantén el tronco erguido — no te inclines hacia adelante ni redondees la espalda.',
    'Si los gluteos no llegan a los talones, coloca una manta o toalla enrollada entre gluteos y talones.',
    'Activa ligeramente el abdomen para mantener la pelvis neutra — ni anteversion ni retroversion forzada.',
    'Respira lento y profundo. Mantén 45 segundos.',
    'Para salir: apoya las manos y vuelve a posicion de rodillas de forma controlada.'
  ],
  errores: [
    'Inclinar el tronco hacia adelante — pierde la descompresion lumbar.',
    'Forzar el descenso si hay dolor en las rodillas — usar apoyo entre gluteos y talones.',
    'Retroversion pelvica forzada — mantén la curvatura lumbar natural.',
    'Tensar los hombros — mantenlos relajados y bajos.'
  ],
  variantes: [
    'F2 inicio: con apoyo (toalla/manta) bajo los gluteos si no llegan a talones.',
    'F2 estandar: gluteos sobre talones 45 seg x2.',
    'F2 avanzada: combinacion con respiracion diafragmatica activa.',
    'F3: transicion directa a camel sin apoyo de manos.'
  ],
  notas_columna: 'El heel sit crea una traccion lumbar suave por el peso del tronco. La posicion reduce la presion intradiscal en L4-L5 y L5-S1 al eliminar la lordosis sin carga axial activa. Es el punto de partida ideal para la secuencia de movilidad matutina porque prepara la columna para los movimientos posteriores. Si hay irradiacion S1 en esta posicion, puede indicar tension en el nervio ciatico — reducir el tiempo y monitorizar.'
};

_PORT['camel'] = {
  nombre: 'Camel desde heel sit',
  categoria: 'Movilidad segmentaria',
  color: '#0F6E56',
  descripcion: 'Secuencia de extension progresiva desde heel sit pasando por posicion de rodillas hasta extension de cadera. Moviliza la columna lumbar y toracica en extension controlada, activa los extensores de cadera y prepara el patron de bisagra.',
  posicion: 'Inicio en heel sit. La secuencia pasa por: heel sit → rodillas verticales → extension de cadera completa con tronco erguido.',
  pasos: [
    'Desde heel sit, empuja las caderas hacia adelante y arriba para pasar a posicion de rodillas vertical.',
    'En posicion de rodillas: tronco erguido, caderas en extension completa, gluteos activos.',
    'Desde rodillas vertical: lleva las caderas ligeramente hacia adelante abriendo la extension de cadera.',
    'Opcional avanzado: lleva las manos hacia los talones abriendo el pecho hacia el techo.',
    'Mantén 2-3 segundos en el punto de maxima extension controlada.',
    'Vuelve lentamente a heel sit: caderas atras, gluteos hacia talones.'
  ],
  errores: [
    'Hiperlordosis lumbar en el punto alto — la extension debe venir de la cadera, no de la lumbar.',
    'Ir demasiado rapido — cada repeticion debe ser lenta y controlada (3-4 segundos por fase).',
    'Dejar caer la cabeza atras sin control — mantén el cuello alineado con la columna toracica.',
    'No activar el gluteo en el punto alto — la extension de cadera debe ser activa, no pasiva.'
  ],
  variantes: [
    'F2 inicio: solo la fase heel sit → rodillas vertical, sin extension adicional.',
    'F2 estandar: secuencia completa con manos en las caderas para apoyo.',
    'F2 avanzada: manos hacia talones en el punto alto si no hay irradiacion.',
    'F3: combinacion con respiracion — inhala en la extension, exhala al volver a heel sit.'
  ],
  notas_columna: 'El camel es uno de los pocos ejercicios que moviliza la extension lumbar de forma segmentaria en F2. La clave es que la extension provenga de la articulacion coxofemoral (cadera) y no de la hiperextension lumbar. Con extrusion L5-S1, evitar ir al punto maximo de extension en las primeras semanas — limitarse a la fase de rodillas vertical hasta que la irradiacion remita. Parar inmediatamente si aparece irradiacion S1 durante el movimiento.'
};

_PORT['outer-hip'] = {
  nombre: 'Outer hip dropset (rotadores externos progresivo)',
  categoria: 'Movilidad cadera / Piriforme',
  color: '#0F6E56',
  descripcion: 'Serie progresiva de tres niveles de rotacion externa de cadera en carga progresiva: pie, rodilla y pierna extendida. Trabaja el piriforme, obturador y rotadores externos profundos que tienen relacion directa con la compresion del nervio ciatico.',
  posicion: 'Sentado en una silla o banco. Nivel 1: pie apoyado sobre el muslo contrario. Nivel 2: rodilla apoyada. Nivel 3: pierna extendida en rotacion externa.',
  pasos: [
    'Nivel 1 (pie): sentado erguido, coloca el tobillo del lado a trabajar sobre el muslo contrario. Aplica suave presion hacia abajo sobre la rodilla flexionada. Mantén 10-15 seg.',
    'Sin pausa, Nivel 2 (rodilla): desde nivel 1, lleva la rodilla del mismo lado hacia el pecho y luego la llevas en rotacion hacia afuera apoyando la rodilla en el banco. Mantén 10-15 seg.',
    'Sin pausa, Nivel 3 (pierna extendida): extiende ligeramente la pierna manteniendo la rotacion externa — el pie queda rotado hacia afuera. Mantén 10-15 seg.',
    'Vuelve al centro y repite en el otro lado.',
    'PARAR en cualquier nivel si aparece irradiacion ciatica — el nervio ciatico pasa por el piriforme.'
  ],
  errores: [
    'Redondear la espalda al inclinarse sobre la pierna — mantén el tronco erguido.',
    'Forzar el nivel 3 desde el inicio — progresar solo cuando el nivel 2 sea comodo.',
    'Ignorar la irradiacion — cualquier reproduccion de sintomas ciaticos indica parar.',
    'Hacer el movimiento demasiado rapido — cada nivel debe mantenerse el tiempo indicado.'
  ],
  variantes: [
    'F2 reagudizacion: solo nivel 1 (pie) si hay irradiacion activa.',
    'F2 estandar: niveles 1 y 2.',
    'F2 avanzada: los tres niveles si no hay irradiacion.',
    'F3: añadir pequeña inclinacion del tronco hacia adelante en nivel 3 para mayor estiramiento del piriforme.'
  ],
  notas_columna: 'El piriforme es un rotador externo de cadera que, cuando esta en espasmo, puede comprimir directamente el nervio ciatico en su trayecto (sindrome del piriforme). En tu caso, con extrusion L5-S1 izquierda y contacto con la raiz S1, el trabajo de los rotadores externos reduce la tension neural secundaria. El nivel 3 debe hacerse con especial cuidado en el lado izquierdo — es el que mas estira el piriforme izquierdo y puede reproducir la irradiacion si hay inflamacion activa.'
};

_PORT['pigeon-strength'] = {
  nombre: 'Pigeon strength (isometrico rotadores externos)',
  categoria: 'Movilidad activa / Fuerza rotadores cadera',
  color: '#0F6E56',
  descripcion: 'Version activa del pigeon pose. Mientras se mantiene la posicion de pigeon en banco, se contrae isometricamente los rotadores externos de la cadera de la pierna apoyada. Convierte un estiramiento pasivo en un ejercicio de control neuromuscular.',
  posicion: 'Pierna de trabajo apoyada en el banco: espinilla horizontal, rodilla flexionada a 90 grados. Cuerpo ligeramente inclinado hacia adelante, manos en el banco para apoyo. Pierna posterior extendida hacia atras.',
  pasos: [
    'Adopta la posicion de pigeon en banco: espinilla de la pierna de trabajo apoyada horizontalmente.',
    'Ajusta la inclinacion del tronco hasta sentir un estiramiento suave en el gluteo — sin dolor.',
    'Ahora activa: intenta rotar externamente la pierna apoyada (como si quisieras bajar el pie hacia el suelo) SIN moverla — el banco la bloquea.',
    'Mantén esa contraccion isometrica durante 3-5 segundos.',
    'Relaja 2 segundos.',
    'Repite 10 veces manteniendo la posicion de pigeon durante toda la serie.',
    'Cambiar de lado.'
  ],
  errores: [
    'Rotar la pelvis para ampliar el estiramiento — mantén las caderas cuadradas.',
    'Hacer el movimiento sin la contraccion isometrica — si no hay contraccion activa es solo pigeon pose.',
    'Extension excesiva del tronco hacia atras — la inclinacion hacia adelante es la que genera el estiramiento.',
    'Forzar el rango en el lado izquierdo con irradiacion activa — reducir la inclinacion del tronco.'
  ],
  variantes: [
    'F2 inicio: sin contraccion isometrica — solo pigeon pose pasivo en banco.',
    'F2 estandar: contraccion isometrica 3 seg x10.',
    'F2 avanzada: contraccion 5 seg con mayor inclinacion del tronco.',
    'F3: pigeon pose en el suelo con contraccion isometrica completa.'
  ],
  notas_columna: 'La version activa del pigeon es superior a la pasiva porque combina el estiramiento del piriforme con la activacion neuromuscular de los rotadores externos. Esto es relevante para la estabilizacion lumbopelvica: un piriforme fuerte y flexible reduce la carga de compensacion sobre los multifidos lumbares. En el lado izquierdo (L5-S1 con contacto S1), la contraccion isometrica debe ser suave — una contraccion fuerte del piriforme sobre un nervio irritado puede reproducir la irradiacion.'
};

_PORT['inner-hip'] = {
  nombre: 'Inner hip dropset (rotadores internos progresivo)',
  categoria: 'Movilidad cadera / Rotadores internos',
  color: '#0F6E56',
  descripcion: 'Version de rotacion interna del outer hip dropset. Trabaja los rotadores internos de cadera (tensor de la fascia lata, gluteo menor, semimembranoso) en progresion de tres niveles. Complementa el trabajo de rotadores externos para el equilibrio de la articulacion coxofemoral.',
  posicion: 'Sentado en silla o banco. Nivel 1: pie en rotacion interna sobre el suelo. Nivel 2: rodilla llevada hacia adentro. Nivel 3: pierna en rotacion interna con mayor rango.',
  pasos: [
    'Nivel 1 (pie): sentado erguido, rota el pie hacia adentro (punta hacia el lado contrario) apoyado en el suelo. Mantén el control pelvico — no dejes que la cadera se compense. Mantén 10-15 seg.',
    'Nivel 2 (rodilla): desde nivel 1, lleva la rodilla suavemente hacia el lado contrario incrementando la rotacion interna de la cadera. Mantén 10-15 seg.',
    'Nivel 3 (pierna extendida): extiende ligeramente la pierna manteniendo la rotacion interna — el pie queda rotado hacia adentro. Mantén 10-15 seg.',
    'PARAR si hay irradiacion — igual que con el outer hip.'
  ],
  errores: [
    'Dejar que la pelvis rote compensatoriamente — el movimiento es de la cadera, no de la pelvis.',
    'Forzar el nivel 3 con irradiacion activa.',
    'Velocidad excesiva — mantener cada nivel el tiempo indicado.',
    'Inclinar el tronco lateralmente para ampliar el rango.'
  ],
  variantes: [
    'F2 reagudizacion: solo nivel 1.',
    'F2 estandar: niveles 1 y 2.',
    'F2 avanzada: los tres niveles.',
    'F3: con carga isometrica activa (igual que pigeon strength pero en rotacion interna).'
  ],
  notas_columna: 'La rotacion interna de cadera suele estar mas limitada que la externa en pacientes con patologia discal lumbar, debido al espasmo de los rotadores externos como mecanismo de proteccion. Trabajar la rotacion interna restaura el rango completo de la articulacion coxofemoral, lo que reduce la carga compensatoria sobre L4-L5 y L5-S1 durante la marcha. En el lado izquierdo, hacerlo con especial atencion — la rotacion interna puede aumentar la tension del nervio ciatico si hay irradiacion activa.'
};

_PORT['seated-gm'] = {
  nombre: 'Seated GM iso hold (bisagra de cadera sentado)',
  categoria: 'Patron bisagra / Movilidad activa',
  color: '#0F6E56',
  descripcion: 'Good morning isometrico en posicion sentada. Trabaja el patron de bisagra de cadera con la columna en descarga, activando los extensores de cadera e isquiotibiales sin carga axial. Es la version mas segura del patron de bisagra para F2.',
  posicion: 'Sentado en el borde de una silla o banco. Pies plantados en el suelo, separados al ancho de caderas. Espalda neutra — ni hiperlordosis ni flexion.',
  pasos: [
    'Sentado en el borde de la silla, coloca las manos en las caderas o en los muslos.',
    'Activa el core ligeramente — zona lumbar neutra, no aplanada.',
    'Realiza una bisagra de cadera hacia adelante: inclina el tronco desde la cadera, NO desde la espalda.',
    'El movimiento es como una reverencia: el tronco se inclina manteniendo la espalda completamente recta.',
    'Lleva hasta donde la tension de isquiotibiales lo permita sin que la espalda se redondee.',
    'Mantén esa posicion isometrica 20-30 segundos. Respira normalmente.',
    'Vuelve a la posicion erguida empujando las caderas hacia adelante.'
  ],
  errores: [
    'Redondear la espalda al inclinarse — toda la inclinacion debe venir de la articulacion de la cadera.',
    'Hacer el movimiento demasiado rapido — es un ejercicio de control, no de velocidad.',
    'Llegar mas alla del punto donde la espalda se redondea — el rango util es el que mantiene la neutralidad lumbar.',
    'No activar el core — sin tension abdominal minima, la lumbar compensa.'
  ],
  variantes: [
    'F2 inicio: inclinacion minima (20-30 grados) con manos en rodillas como apoyo.',
    'F2 estandar: inclinacion 45 grados iso hold 20-30 seg x3.',
    'F2 avanzada: manos cruzadas en el pecho, sin apoyo.',
    'F3: pasar al good morning de pie con banda elastica.'
  ],
  notas_columna: 'El seated GM iso hold es el ejercicio puente entre la movilidad pura y el patron de fuerza en bisagra. Al estar sentado, la carga axial sobre L4-L5 y L5-S1 es minima (inferior al estar de pie). La activacion isometrica de los isquiotibiales y extensores de cadera en elongacion genera una traccion suave sobre los multifidos lumbares que mejora la propiocepcion segmentaria. Este ejercicio directamente prepara el patron para el good morning con banda y el RDL — la progresion natural en F3.'
};

_PORT['hip-flexor'] = {
  nombre: 'Hip flexor stretch (estiramiento de psoas)',
  categoria: 'Estiramiento / Movilidad',
  color: '#0F6E56',
  descripcion: 'Estiramiento del musculo iliopsoas (psoas ilíaco y psoas mayor) en posicion de semiarrodillado. El psoas tiene insercion directa en los cuerpos vertebrales de L1 a L5 — su acortamiento genera anteversion pelvica y aumento de la presion discal lumbar.',
  posicion: 'Semiarrodillado: rodilla de la pierna a estirar apoyada en el suelo (con almohadilla si es necesario), pie de la otra pierna plantado adelante, rodilla delantera a 90 grados. Tronco erguido.',
  pasos: [
    'Adopta la posicion de semiarrodillado. Rodilla trasera en el suelo, pie delantero plantado, rodilla a 90 grados.',
    'Activa el gluteo de la pierna trasera — esto empuja la cadera hacia adelante y genera el estiramiento del psoas.',
    'Mantén el tronco completamente erguido — NO te inclines hacia adelante.',
    'El estiramiento debe sentirse en la parte anterior de la cadera/muslo de la pierna trasera.',
    'Mantén 40 segundos. Respira profundo — en la exhala, el estiramiento aumenta ligeramente.',
    'Cambiar de lado. Empezar siempre por el lado derecho (lado menos afectado).'
  ],
  errores: [
    'Inclinarse hacia adelante con el tronco — pierde el estiramiento del psoas y carga la lumbar.',
    'Hiperlordosis lumbar al intentar ampliar el estiramiento — retroversion pelvica ligera es correcta.',
    'No activar el gluteo trasero — sin esa contraccion el estiramiento es minimo.',
    'Rodilla delantera que supera la punta del pie — reduce la base de soporte y la estabilidad.'
  ],
  variantes: [
    'F2 inicio: con apoyo de manos en la rodilla delantera para estabilidad.',
    'F2 estandar: manos en las caderas, gluteo activo, 40 seg x2 cada lado.',
    'F2 avanzada: añadir elevacion ipsilateral del brazo para incorporar la fascia toracolumbar.',
    'F3: de pie con apoyo posterior (corredor de puerta) para mayor rango.'
  ],
  notas_columna: 'El psoas mayor tiene insercion directa en los procesos transversos y cuerpos vertebrales de L1-L5. Un psoas acortado (muy frecuente tras meses de sedestacion prolongada y posicion antalgica) genera una anteversion pelvica que aumenta la lordosis lumbar y la presion sobre los discos posteriores L4-L5 y L5-S1 — exactamente los segmentos afectados. Este estiramiento es uno de los mas importantes de tu protocolo y debe hacerse diariamente. La mejora de la flexibilidad del psoas reduce directamente la carga en los segmentos extruidos.'
};

_PORT['hamstring-squeeze'] = {
  nombre: 'Hamstring squeeze (isometrico en flexion)',
  categoria: 'Activacion isquiotibiales / Fuerza isometrica',
  color: '#0F6E56',
  descripcion: 'Contraccion isometrica de los isquiotibiales desde posicion de rodilla flexionada. Los isquios resisten la extension de rodilla contra la banda — el talon intenta ir al suelo pero no llega. Trabajo en rango corto-medio, sin tension neural sobre el nervio ciatico.',
  posicion: 'Tumbado boca arriba. Rodilla flexionada ~90 grados, planta del pie apoyada en el suelo. Banda elastica pasada por el talon o tobillo, anclada hacia delante (a un punto fijo) o sujetas los extremos con las manos.',
  pasos: [
    'Tumbado boca arriba, dobla la rodilla a ~90 grados con la planta del pie en el suelo.',
    'Pasa la banda por el talon o tobillo y ancla los extremos hacia delante — debe haber tension en la banda.',
    'Desde esa posicion, intenta extender la rodilla (llevar el talon al suelo, estirar la pierna) contra la resistencia de la banda.',
    'La pierna NO se mueve — contraccion isometrica pura de los isquiotibiales frenando la extension.',
    'Mantén la contraccion 5-8 segundos. Relaja 3 segundos.',
    'Repite 8 veces cada lado.',
    'PARAR si aparece irradiacion ciatica — reducir la intensidad de la contraccion.'
  ],
  errores: [
    'Dejar que la rodilla se extienda — la resistencia de la banda debe impedir cualquier movimiento.',
    'Contraccion demasiado fuerte al inicio — empezar suave (40-50% del maximo) y progresar.',
    'Levantar la cadera del suelo — mantener la pelvis neutra apoyada.',
    'Hacer el movimiento como un curl dinamico — es isometrico, la pierna no se mueve.'
  ],
  variantes: [
    'S1-4 suave: contraccion al 40% del maximo, 3-5 seg x8.',
    'F2 estandar: contraccion al 60-70%, 5-8 seg x8 cada lado.',
    'F2 avanzada: banda mas resistente o mayor angulo de flexion inicial (~110-120 grados).',
    'F3: progresar a curl excentrico dinamico con banda.'
  ],
  notas_columna: 'El isometrico en flexion trabaja los isquiotibiales en rango corto-medio, lo que lo hace seguro incluso con irritacion del nervio ciatico activa. Al no elongar el nervio, permite activar y fortalecer los isquios sin riesgo de provocar irradiacion. Es el punto de entrada antes de progresar al isometrico en elongacion (pierna elevada). Especialmente indicado para el lado izquierdo en fase aguda-subaguda: la contraccion isometrica genera tension protectora sin traccionar la raiz S1.'
};
_PORT['iso-hold-cinta'] = {
  nombre: 'Iso hold con cinta de yoga colgada de la puerta',
  categoria: 'Fuerza isometrica posterior / Descompresion activa',
  color: '#533AB7',
  descripcion: 'Cinta de yoga colgada del marco de la puerta a la altura del pecho o la cadera. Se sujeta con ambas manos y se realiza una tension isometrica hacia atras activando espalda alta, romboides y cadena posterior, sin carga axial sobre la columna.',
  posicion: 'De pie frente al marco de la puerta. Cinta pasada por encima del marco o enganchada en un gancho alto. Agarre con ambas manos, codos ligeramente flexionados, tronco ligeramente inclinado hacia atras.',
  pasos: [
    'Engancha la cinta de yoga en el marco superior de la puerta — altura de pecho a hombros.',
    'Agarra los extremos o los lazos con ambas manos. Da un paso atras hasta que la cinta quede tensa.',
    'Inclina el tronco ligeramente hacia atras manteniendo la columna neutra — no redondear.',
    'Activa espalda alta y romboides: tira isometricamente hacia atras sin mover el cuerpo. La cinta no cede.',
    'Mantén la tension 20 segundos respirando con normalidad.',
    'Relaja, da un paso hacia la puerta para soltar tension.',
    'Repite 3 veces.'
  ],
  errores: [
    'Redondear la espalda alta — mantener escápulas juntas y bajas durante toda la contraccion.',
    'Aguantar la respiracion — respirar con normalidad durante el iso hold.',
    'Tension demasiado alta al inicio — empezar con inclinacion minima y progresar.',
    'Usar solo los brazos — la tension debe sentirse en espalda alta y romboides, no solo en biceps.'
  ],
  variantes: [
    'S1-2: tension minima, cuerpo casi vertical, 3x10 seg.',
    'S3-4: inclinacion moderada, 3x15 seg.',
    'S5-6: inclinacion mayor, activacion escapular maxima, 3x20 seg.',
    'S7+: agarre unilateral alternado, 3x25 seg cada lado.',
    'F3: progresar a fila con cinta (movimiento concentrico-excentrico).'
  ],
  notas_columna: 'El iso hold con cinta en puerta activa la cadena posterior sin carga axial — a diferencia del remo o el jalón, el cuerpo no transmite compresion sobre L4-L5. La tension isometrica de romboides y trapecio medio mejora la estabilidad escapular y actua como antagonista de la posicion en flexion mantenida. Util en dias neurales como activacion funcional sin riesgo para los segmentos extruidos.'
};

_PORT['l-sit'] = {
  nombre: 'L-sit (progresion)',
  categoria: 'Fuerza core / Flexores cadera / Control lumbar',
  color: '#533AB7',
  descripcion: 'Ejercicio isometrico de suspension en el que el cuerpo forma una L con las piernas elevadas paralelas al suelo. Activa fuertemente el core, los flexores de cadera y el triceps. La progresion comienza con tucked L-sit (rodillas dobladas) hasta llegar al L-sit completo con piernas extendidas.',
  posicion: 'Sentado en el suelo entre dos sillas solidas (o paralelas, o bloques de yoga). Manos apoyadas en el asiento de cada silla a los lados de las caderas. Brazos extendidos.',
  pasos: [
    'Coloca dos sillas estables a la anchura de las caderas. Sientate en el suelo entre ellas con las manos en los asientos.',
    'Empuja hacia abajo con los brazos para elevar las caderas del suelo — brazos completamente extendidos.',
    'Segun el nivel: mantén las rodillas dobladas (tucked) o extiende una o ambas piernas hacia delante.',
    'Mantén la posicion el tiempo indicado segun variante. Columna neutra, sin hundirse en los hombros.',
    'Baja con control. Descansa igual tiempo y repite.'
  ],
  errores: [
    'Hundirse en los hombros — empujar activamente hacia abajo para mantener los hombros elevados.',
    'Redondear la espalda lumbar — columna neutra durante todo el hold.',
    'Extender las piernas antes de tener suficiente fuerza en tucked — respetar la progresion.',
    'Aguantar la respiracion — respirar con normalidad.'
  ],
  variantes: [
    'S1-2: tucked L-sit entre sillas 3x5 seg — rodillas al pecho.',
    'S3-4: tucked L-sit 3x8 seg — caderas bien elevadas.',
    'S5-6: un pie extendido alterno 3x8 seg cada lado.',
    'S7+: L-sit completo ambas piernas 3x10 seg.',
    'F3: L-sit en paralelas o anillas con pausa activa 3x12-15 seg.'
  ],
  notas_columna: 'El L-sit genera una fuerte activacion del core en posicion de descarga — las manos soportan el peso, no la columna. Los flexores de cadera trabajando con la columna en neutro es un patron seguro en F2 siempre que no aparezca irradiacion. Comenzar con tucked para minimizar el brazo de palanca sobre L4-L5. Si aparece tension en la zona lumbar al extender las piernas, volver a tucked hasta consolidar la base.'
};

_PORT['aperturas-cable']['id'] = 'aperturas-cable';

_PORT['scapular-pull'] = {
  nombre: 'Scapular pull en barra (dead hang escapular)',
  categoria: 'Control escapular / Traccion descompresiva',
  color: '#3C3489',
  descripcion: 'Colgado de la barra, se realiza solo la depresion y retraccion de las escapulas sin doblar los codos. Activa el trapecio inferior y el serrato anterior como estabilizadores primarios. Genera traccion descompresiva suave sobre L4-L5 y L5-S1 por el peso del tronco colgante.',
  posicion: 'Colgado de la barra con agarre prono (palmas hacia adelante) o neutro, separacion al ancho de hombros. Brazos completamente extendidos. Pies pueden rozar el suelo en S3-4 para controlar la carga.',
  pasos: [
    'Agarra la barra con los brazos completamente extendidos. Deja que el peso del cuerpo elongue la columna — siente la traccion en la zona lumbar.',
    'Sin doblar los codos: baja las escapulas (depresion) alejandolas de las orejas.',
    'Simultaneamente: lleva las escapulas hacia atras y hacia el centro (retraccion).',
    'Mantén la posicion 2 segundos apretando al maximo sin doblar los codos.',
    'Relaja volviendo a la posicion de hang pasivo.',
    'Repite. El movimiento es pequeño pero debe sentirse en la parte baja de las escapulas y el centro de la espalda.',
    'PARAR inmediatamente si aparece irradiacion en la pierna izquierda al colgar.'
  ],
  errores: [
    'Doblar los codos — el ejercicio se convierte en una dominada parcial y pierde el estimulo escapular especifico.',
    'Encogerse de hombros al colgar — dejar caer el peso pasivamente antes de iniciar la activacion.',
    'Retraccion sin depresion — las escapulas suben hacia las orejas en lugar de bajar y retroceder.',
    'Aguantar si aparece irradiacion — el hang descompresivo puede tensar el nervio S1 si hay inflamacion activa.'
  ],
  variantes: [
    'S1-2: banda de suspension — pie en banda, carga parcial del peso corporal.',
    'S3-4: barra agarre ancho, pies casi en suelo — ROM completo sin flexion de codo.',
    'S5-6: hang completo, pausa 2s en retraccion maxima.',
    'S7+: lastre ligero tobillera 1-2 kg para aumentar la traccion descompresiva.',
    'F3: progresar a dominada desde posicion de retraccion maxima.'
  ],
  notas_columna: 'El dead hang escapular es el unico ejercicio que combina activacion del trapecio inferior con traccion descompresiva lumbar simultanea. Al colgar, el peso del tronco genera una elongacion pasiva de L4-L5 y L5-S1 que reduce la presion intradiscal — efecto opuesto a la carga axial. La activacion escapular superpuesta sobre esa traccion enseña al sistema nervioso a estabilizar la escapula en descarga, patron que se transfiere directamente a los jalones y dominadas. Para L5-S1 izquierdo con extrusion activa: si el hang provoca irradiacion, reducir carga con banda hasta que la inflamacion remita.'
};

_PORT['ext-rotation-banda'] = {
  nombre: 'Rotacion externa con banda (manguito rotador)',
  categoria: 'Manguito rotador / Calentamiento hombro',
  color: '#1A6E3A',
  descripcion: 'Activacion especifica del infraespinoso y redondo menor mediante rotacion externa de hombro con resistencia de banda. Ejercicio de calentamiento y equilibrio del manguito rotador, especialmente importante antes de trabajo de empuje y hombro posterior.',
  posicion: 'De pie o sentado. Codo a 90 grados pegado al costado. Banda anclada al frente a la altura del codo. Antebrazo paralelo al suelo apuntando hacia la banda.',
  pasos: [
    'Coloca el codo a 90° bien pegado al costado — puede ayudar una toalla doblada entre el codo y el torso para mantener la posicion.',
    'Agarra la banda con la mano, antebrazo apuntando hacia el ancla.',
    'Rota externamente el hombro llevando el antebrazo hacia fuera, alejandolo del cuerpo.',
    'El codo NO se mueve — solo gira el humero en la articulacion del hombro.',
    'Llega hasta donde la resistencia lo permite sin compensar con el tronco.',
    'Mantén 1s en rotacion maxima. Vuelve controlado.',
    'Cambiar de lado.'
  ],
  errores: [
    'Separar el codo del costado — pierde el aislamiento del infraespinoso.',
    'Compensar con el tronco rotando el torso — el movimiento debe ser solo del hombro.',
    'Usar banda demasiado fuerte — es calentamiento, no fuerza maxima.'
  ],
  variantes: [
    'S1-2: banda muy ligera ROM parcial.',
    'S3-4: banda ligera ROM completo.',
    'S5-6: banda media pausa 1s en rotacion maxima.',
    'S7+: banda media + excentrico controlado 3s.'
  ],
  notas_columna: 'La debilidad de los rotadores externos del hombro es extremadamente comun tras periodos de sedestacion prolongada y postura antalgica — ambos presentes en tu caso. Un manguito debil transfiere estres al trapecio superior y a los escalenos, que tienen insercion cervical y pueden agravar la tension en la region cervicotoracica. El calentamiento del manguito antes del trabajo de hombro posterior reduce el riesgo de compensacion y mejora la calidad del estimulo en ejercicios como pajaros y face pull.'
};

_PORT['int-rotation-banda'] = {
  nombre: 'Rotacion interna con banda (manguito rotador)',
  categoria: 'Manguito rotador / Calentamiento hombro',
  color: '#1A6E3A',
  descripcion: 'Activacion especifica del subescapular mediante rotacion interna de hombro con resistencia de banda. Complementa la rotacion externa para equilibrar el ratio de fuerza rotadores internos/externos — fundamental para la salud del manguito.',
  posicion: 'De pie o sentado. Codo a 90 grados pegado al costado. Banda anclada al lado contrario a la altura del codo. Antebrazo paralelo al suelo apuntando hacia fuera.',
  pasos: [
    'Misma posicion que la rotacion externa pero banda anclada al lado opuesto.',
    'Antebrazo apunta hacia fuera (ya en rotacion externa ligera).',
    'Rota internamente llevando el antebrazo hacia el abdomen.',
    'Codo fijo al costado en todo momento.',
    'Llega hasta donde la resistencia lo permite.',
    'Mantén 1s. Vuelve controlado.',
    'Cambiar de lado.'
  ],
  errores: [
    'Separar el codo del costado.',
    'Llevar el antebrazo mas alla de la linea media del cuerpo — rango funcional termina en el abdomen.',
    'Usar banda mas fuerte que en rotacion externa — el subescapular es naturalmente mas fuerte, pero en calentamiento la carga debe ser igual.'
  ],
  variantes: [
    'S1-2: banda muy ligera.',
    'S3-4: banda ligera ROM completo.',
    'S5-6: banda media.',
    'S7+: banda media excentrico 3s.'
  ],
  notas_columna: 'El ratio rotacion externa/interna optimo es aproximadamente 2:3. Un subescapular dominante sobre un infraespinoso debil (patron muy comun) genera migracion anterior de la cabeza humeral que impinge el supraespinoso — origen de la mayoria de las tendinopatias de manguito. Trabajar ambas direcciones en el calentamiento equilibra el ratio y protege la articulacion durante el trabajo de hombro posterior del Viernes.'
};

_PORT['prone-y-banda'] = {
  nombre: 'Prone Y con banda (trapecio inferior)',
  categoria: 'Estabilizacion escapular / Calentamiento hombro',
  color: '#1A6E3A',
  descripcion: 'Tumbado boca abajo o inclinado en banco, se elevan los brazos en forma de Y (135 grados respecto al cuerpo) con resistencia de banda ligera. Activa especificamente el trapecio inferior y el supraespinoso — musculos clave para la estabilizacion escapulotoracica.',
  posicion: 'Tumbado boca abajo en banco inclinado o en el suelo. Brazos extendidos por encima de la cabeza en forma de Y (135° respecto al tronco). Frente apoyada en el banco o en el suelo.',
  pasos: [
    'Posicion boca abajo, frente apoyada. Brazos extendidos en Y, pulgares apuntando hacia arriba.',
    'Activa ligeramente el core — lumbar neutra, sin hiperlordosis.',
    'Eleva los brazos manteniendo la forma de Y — el movimiento viene de las escapulas bajando y retrocediendo, no del cuello.',
    'Lleva hasta la altura donde los pulgares queden al nivel de la cabeza.',
    'Pausa 1s en la posicion alta. Baja controlado.',
    'La cabeza NO se eleva — mantén el cuello neutro durante todo el movimiento.'
  ],
  errores: [
    'Elevar la cabeza al subir los brazos — el cuello se convierte en compensador.',
    'Encogerse de hombros (trapecio superior dominando) — las escapulas deben bajar, no subir.',
    'Angulo incorrecto: brazos en linea recta (T) o demasiado cerrados (I) — el Y a 135° es el angulo optimo para el trapecio inferior.',
    'Usar banda demasiado fuerte en calentamiento.'
  ],
  variantes: [
    'S1-2: sin banda, solo activacion con peso de brazos.',
    'S3-4: banda muy ligera 2x10.',
    'S5-6: banda ligera pausa 1s arriba.',
    'S7+: banda ligera + T (brazos a 90°) en la misma serie — Y+T combinado.'
  ],
  notas_columna: 'El trapecio inferior es uno de los musculos mas frecuentemente inhibidos en personas con dolor lumbar cronico y postura antalgica — la conexion es fascia toracolumbar y cadena cinetica posterior. Su debilidad permite la anteversion de las escapulas que aumenta la cifosis toracica y compensa cargando la region cervicotoracica. Para tu caso, este ejercicio tiene valor tanto como calentamiento de hombro como activacion de la cadena posterior toracica que descarga indirectamente la lumbar.'
};

_PORT['cable-pull-through'] = {
  nombre: 'Cable pull-through en polea baja',
  categoria: 'Patron bisagra / Cadena posterior',
  color: '#993C1D',
  descripcion: 'Bisagra de cadera de pie con resistencia de polea baja. La cuerda se agarra entre las piernas y la carga tira hacia atras — esto obliga a controlar la bisagra con isquiotibiales y gluteo mayor como motores primarios, manteniendo la columna neutra en todo momento. Es el ejercicio puente entre el glute bridge (cadena cerrada en suelo) y el RDL/good morning (F3).',
  posicion: 'De pie frente a la polea baja, a unos 60-80 cm. Agarra la cuerda por debajo de las piernas con ambas manos. Pies separados al ancho de caderas, ligera flexion de rodillas.',
  pasos: [
    'Ponte de pie frente a la polea con la cuerda agarrada entre las piernas. Da un paso al frente para crear tension inicial.',
    'Activa el core — zona lumbar neutra, ni hiperlordosis ni flexion.',
    'Realiza la bisagra: empuja las caderas hacia atras dejando que la cuerda tire suavemente. El tronco se inclina hacia adelante manteniendo la espalda completamente recta.',
    'Los isquiotibiales deben notarse en tension al final de la bisagra — eso indica que el patron es correcto.',
    'Desde esa posicion: activa el gluteo y empuja las caderas hacia adelante para volver a la extension.',
    'La extension es el objetivo: aprieta el gluteo al maximo en la posicion alta. Pausa 1s.',
    'Controla la bajada (excentrico) — no dejes que la polea te lleve.'
  ],
  errores: [
    'Flexionar la columna en lugar de la cadera — toda la inclinacion debe venir de la articulacion de la cadera.',
    'Hiperlordosis lumbar en la extension — señal de que los erectores lumbares estan compensando al gluteo.',
    'Doblar las rodillas en exceso — convierte el ejercicio en una sentadilla, pierde el patron bisagra.',
    'No mantener tension en la cuerda durante todo el movimiento — el excentrico controlado es la mitad del trabajo.',
    'Carga excesiva que obliga a redondear la espalda — empezar siempre ligero y priorizar el patron.'
  ],
  variantes: [
    'S1-2: carga muy ligera, bisagra parcial 30° — prioridad absoluta en patron correcto sin carga.',
    'S3-4: carga ligera, ROM completo, bisagra 45-60°.',
    'S5-6: carga media, excentrico controlado 3 seg.',
    'S7+: carga alta, pausa 1s en extension maxima apretando gluteo.',
    'F3: progresar a RDL con mancuernas y posteriormente RDL con barra.'
  ],
  notas_columna: 'El cable pull-through es el ejercicio bisagra mas seguro para L4-L5 y L5-S1 en Fase 2 porque la carga proviene de detras (la polea tira hacia atras y abajo) en lugar de comprimir axialmente desde arriba. Esto genera una tension posterior sobre los segmentos lumbares que es muy diferente — y mucho mas segura — que la carga axial de una sentadilla o un peso muerto. Los estudios de EMG muestran activacion del gluteo mayor equivalente al hip thrust con carga moderada pero con compresion discal significativamente menor. Para L5-S1 con extrusion izquierda activa: vigilar que la bisagra sea simetrica — la tendencia antalgica es desplazar la carga al lado derecho. Este ejercicio es el puente directo hacia el RDL con mancuernas en F3.'
};
for (const _k in _PORT) { if(!(_k in EX_DB)) EX_DB[_k] = _PORT[_k]; }

// Captura si el dispositivo esta realmente vacio ANTES de sembrar defaults/backup
const _LOCAL_EMPTY_AT_START = (Object.keys(loadWeights()).length===0 && Object.keys(loadEntries()).length===0);

// ═══ RESTORE FROM BACKUP 2026-04-16 ═══
(function(){
  const bkWts={
    "prensa":{"w65":20,"history":{"3":"green"},"lastLog":"S3: Avanzado (10/4/2026)"},
    "elevaciones-lat":{"w65":7.5,"history":{"3":"amber"},"lastLog":"S3: Mantenido (10/4/2026)"},
    "face-pull":{"w65":17,"history":{"3":"amber"},"lastLog":"S3: Mantenido (10/4/2026)"},
    "rdl-mancuernas":{"w65":7.5,"history":{"4":"green"},"lastLog":"S4: Avanzado (13/4/2026)"},
    "curl-barra":{"w65":7.5},
    "curl-martillo":{"w65":7.5},
    "jalon-ancho":{"w65":21.25,"history":{"4":"amber"},"lastLog":"S4: Mantenido (15/4/2026)"},
    "jalon-neutro":{"w65":21.25},
    "pull-over":{"w65":12.5,"history":{"4":"green"},"lastLog":"S4: Avanzado (15/4/2026)"}
  };
  const bkVStages={
    "Couch stretch":{"4":"S5-6"},
    "Good morning con banda elastica":{"4":"S5-6"},
    "Elephant walk estatico":{"4":"S3-4"},
    "RDL con mancuernas":{"4":"S3-4"},
    "RDL unilateral en banco — mancuerna":{"4":"S3-4"},
    "Bird dog con pausa":{"4":"S3-4"},
    "Dead bug con extension completa":{"4":"S5-6"},
    "Bloque 1 — Espalda tecnica (16 min ~40%)":{"4":"S3-4"},
    "Bloque 2 — Crol variado (16 min ~40%)":{"4":"S3-4"},
    "Bloque 3 — Braza con pull buoy (8 min ~20%)":{"4":"S3-4"},
    "Jalon al pecho agarre ancho":{"4":"S3-4"},
    "Pull-over en polea alta":{"4":"S5-6"},
    "Fondos de triceps en banco":{"4":"S7+"},
    "Extension de triceps en polea alta":{"4":"S5-6"}
  };
  // Merge weights — only write if no existing w65 or backup is newer
  const curWts=loadWeights();
  let changed=false;
  Object.entries(bkWts).forEach(([id,bk])=>{
    if(!curWts[id])curWts[id]={};
    if(!curWts[id].w65){curWts[id].w65=bk.w65;changed=true;}
    if(bk.history&&!curWts[id].history){curWts[id].history=bk.history;changed=true;}
    if(bk.lastLog&&!curWts[id].lastLog){curWts[id].lastLog=bk.lastLog;changed=true;}
  });
  if(changed)saveWeights(curWts);
  // Merge vStages — only write missing entries
  const curVS=loadVStages();
  let vsChanged=false;
  Object.entries(bkVStages).forEach(([ex,wkMap])=>{
    if(!curVS[ex]){curVS[ex]=wkMap;vsChanged=true;}
    else{
      Object.entries(wkMap).forEach(([wk,st])=>{
        if(!curVS[ex][wk]){curVS[ex][wk]=st;vsChanged=true;}
      });
    }
  });
  if(vsChanged)saveVStages(curVS);
})();

// ─── INIT ───
(async function init(){
  // Restauracion automatica desde Google Sheets si el dispositivo arranca vacio
  // (p. ej. navegador nuevo o datos borrados). No pisa datos locales existentes.
  if(_LOCAL_EMPTY_AT_START && getSheetsUrl()){
    try{
      const remote=await loadFromSheets();
      if(applyRemote_(remote))setSyncStatus('ok','Copia restaurada de Sheets');
    }catch(e){/* sin conexion: continuamos con datos locales */}
  }
  initDefaultWeights();
  updT();
  renderAll();
  renderWtSummary();
  setProgStage(PROG_STAGE);
  const _wd=document.getElementById('weekDisplay');if(_wd)_wd.textContent=WEEK_NUM;
})();
