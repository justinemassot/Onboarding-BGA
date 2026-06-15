/* ============================================================
   BGA — Home Catalogue · RENDER
   Vanilla JS. Depends on home-data.js (GAMES, PROFILES, …).
   ============================================================ */

let LANG = 'fr';
let PROF = 'socialiser';

const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const T  = ()=>HOME_I18N[LANG];
const esc=s=>(''+s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function nick(){try{return (localStorage.getItem('bga_nick')||'').trim();}catch(e){return '';}}

/* ---------- COVER (poster card) ---------- */
function cover(gid, {size='lg', badge=null, tone='p', featured=false}={}){
  const g = GAMES[gid]; if(!g) return '';
  const sm = size==='sm';
  return `<button class="gcard${sm?' g-sm':''}${featured?' feat':''}" data-game="${gid}" style="--cc:${g.color}">
    <span class="gc-art"><i class="ti ti-${g.icon}"></i></span>
    <span class="gc-scrim"></span>
    ${badge?`<span class="cbadge t-${tone}">${esc(badge)}</span>`:''}
    <span class="gc-body">
      <span class="gc-title">${esc(g.title)}</span>
      <span class="gc-mech">${esc(g.mech[LANG])}</span>
      <span class="gc-cta solid"><i class="ti ti-player-play-filled"></i>${T().play}</span>
    </span>
  </button>`;
}

/* 3D tilt on hover */
function tilt(card){
  card.addEventListener('pointermove',e=>{
    if(e.pointerType==='touch') return;
    const r=card.getBoundingClientRect();
    const px=(e.clientX-r.left)/r.width-0.5, py=(e.clientY-r.top)/r.height-0.5;
    card.style.transform=`rotateY(${px*12}deg) rotateX(${-py*12}deg) translateY(-7px) scale(1.035)`;
  });
  const reset=()=>{card.style.transform='';};
  card.addEventListener('pointerleave',reset);
  card.addEventListener('pointercancel',reset);
}

/* ---------- THEME ---------- */
function applyTheme(){
  const th = PROFILES[PROF].theme, rs = document.documentElement.style;
  rs.setProperty('--p', th.p); rs.setProperty('--p-soft', th.soft); rs.setProperty('--p-text', th.text);
}

/* ---------- NAVBAR + TABS ---------- */
function renderChrome(){
  const t = T();
  $('#nav-browse').textContent = t.nav_browse;
  $('#nav-community').textContent = t.nav_community;
  $('#nav-ranking').textContent = t.nav_ranking;
  $('#search').placeholder = t.search;
  $('#collection-cta span').textContent = t.collection;
  const n = nick();
  const nameEl=$('#avatar-name'); if(nameEl) nameEl.textContent = n || 'Player';
  $('#avatar-mono').textContent = (n||'P').slice(0,1).toUpperCase();

  // profile switcher (icon-only, in the header)
  const PICON={socialiser:'users',achiever:'trophy',philanthropist:'heart-handshake',freespirit:'compass'};
  $('#tabs').innerHTML = PROFILE_ORDER.map(k=>{
    const P = PROFILES[k];
    return `<button class="ptab${k===PROF?' active':''}" data-prof="${k}" style="--tc:${P.theme.p}" title="${esc(P.tab[LANG])}"><i class="ti ti-${PICON[k]}"></i></button>`;
  }).join('');
  $$('#tabs .ptab').forEach(b=>b.addEventListener('click',()=>setProfile(b.dataset.prof)));

  // lang
  $$('#lang button').forEach(b=>b.classList.toggle('active', b.dataset.lang===LANG));
}

/* ---------- BANNER (coupe-fil) ---------- */
function renderBanner(){
  const t = T();
  const P = PROFILES[PROF];
  $('#banner-title').textContent = (P.bannerTitle && P.bannerTitle[LANG]) || t.banner_title;
  $('#banner-sub').textContent   = t.banner_sub;
  $('#banner-tag').textContent   = LANG==='fr'?'Pour toi':'For you';
  $('#banner-pulse-txt').textContent = LANG==='fr'?'Sélection BGA':'BGA picks';
  $('#banner-cards').innerHTML = P.picks.map(p=>{
    const g = GAMES[p.g];
    const sub = (MISSIONS[p.g] || g.mech)[LANG];
    return `<div class="live" style="--cc:${g.color}" data-game="${p.g}">
      ${(g.img||g.boximg)?`<img class="live-img" src="${g.img||g.boximg}" alt="" />`:`<span class="live-art"><i class="ti ti-${g.icon}"></i></span>`}
      <span class="live-scrim"></span>
      <span class="live-body">
        <span class="live-title">${esc(g.title)}</span>
        <span class="live-desc">${esc(sub)}</span>
        <button class="live-join">${t.play}<i class="ti ti-player-play-filled"></i></button>
      </span>
    </div>`;
  }).join('');
  $$('#banner-cards .live-join').forEach(b=>b.addEventListener('click',e=>{
    e.stopPropagation();
    const game = b.closest('.live').dataset.game;
    openGame(game);
  }));
  $$('#banner-cards .live').forEach(tilt);
}

/* ---------- HERO (per profile) ---------- */
function heroSocial(t){
  const opts = [
    {ic:'b', icon:'user-plus',   cic:'send',        title:t.g_invite_t, desc:t.g_invite_d, cta:t.g_invite_cta},
    {ic:'y', icon:'users-group', cic:'arrow-right', title:t.g_join_t,   desc:t.g_join_d,   cta:t.g_join_cta},
    {ic:'r', icon:'circle-plus', cic:'plus',        title:t.g_create_t, desc:t.g_create_d, cta:t.g_create_cta}
  ];
  const cards = opts.map(o=>`<div class="grp-card">
      <span class="grp-ic ${o.ic}"><i class="ti ti-${o.icon}"></i></span>
      <div class="grp-title">${esc(o.title)}</div>
      <p class="grp-desc">${esc(o.desc)}</p>
      <button class="hero-cta grp-cta"><i class="ti ti-${o.cic}"></i>${esc(o.cta)}</button>
    </div>`).join('');
  return `<div class="hero-head"><span class="hero-ic"><i class="ti ti-users-group"></i></span><h2>${t.s_groups}</h2></div>
    <div class="grp-grid">${cards}</div>`;
}
function heroProgress(t){
  const d = PROFILES.achiever.heroData;
  const SL = {
    done:  {fr:'Débloquée',   en:'Unlocked', ic:'circle-check-filled'},
    next:  {fr:'Prochaine',   en:'Next',     ic:'target-arrow'},
    locked:{fr:'Verrouillée',  en:'Locked',   ic:'lock'}
  };
  const parts = [];
  d.keys.forEach((k,i)=>{
    if(i>0) parts.push(`<span class="seg${d.keys[i-1].done?' on':''}"></span>`);
    const s = k.done ? 'done' : (k.active ? 'next' : 'locked');
    const sl = SL[s];
    parts.push(`<div class="stop ${s}">
        <div class="gwrap"><div class="gem"><span class="rim"></span><span class="face"></span><i class="ti ti-key"></i><span class="gn">${i+1}</span></div></div>
        <span class="klabel">${esc(k.label[LANG])}</span>
        <span class="kstate"><i class="ti ti-${sl.ic}"></i>${sl[LANG]}</span>
      </div>`);
  });
  const lastDone = d.keys[d.keys.length-1].done;
  const done = d.keys.filter(k=>k.done).length;
  const wing = `<svg class="rw-wing l" viewBox="0 0 80 70" aria-hidden="true"><path d="M78 35 C60 14 34 10 6 18 C26 22 40 30 48 38 C34 32 18 32 6 38 C24 42 38 48 46 54 C34 50 22 52 12 58 C36 64 64 58 78 35 Z"/></svg>`;
  const pct = Math.round(d.xp/d.xpMax*100);
  return `<div class="hero-head"><span class="hero-ic"><i class="ti ti-trophy"></i></span><h2>${t.a_keys}</h2></div>
    <div class="prog">
      ${parts.join('')}
      <span class="seg big${lastDone?' on':''}"></span>
      <div class="stop reward locked">
        <div class="gwrap">
          <span class="rw-crown"><i class="ti ti-crown"></i></span>
          ${wing}${wing.replace('rw-wing l','rw-wing r')}
          <div class="gem"><span class="rim"></span><span class="face"></span><i class="ti ti-lock"></i></div>
        </div>
        <span class="rw-ribbon">${LANG==='fr'?'Apprenti':'Apprentice'}</span>
        <span class="rw-count">${done}/3 ${LANG==='fr'?'clefs':'keys'}</span>
      </div>
    </div>
    <div class="xp"><div class="xp-bar"><span style="width:${pct}%"></span></div><span class="xp-txt">${d.xp} / ${d.xpMax} ${t.a_xp} · ${esc(d.level[LANG])}</span></div>`;
}
function heroStats(t){
  const d = PROFILES.philanthropist.heroData, g = GAMES[d.fav];
  const cells = d.stats.map(s=>`<div class="stat">
      <div class="stat-top"><b>${esc(s.value)}</b><span class="trend ${s.dir}"><i class="ti ti-${s.dir==='up'?'trending-up':'trending-down'}"></i>${esc(s.delta)}</span></div>
      <span class="stat-l">${esc(s.label[LANG])}</span>
    </div>`).join('');
  return `<div class="hero-head"><span class="hero-ic"><i class="ti ti-heart-handshake"></i></span><h2>${LANG==='fr'?'Cette semaine':'This week'} · ${esc(g.title)}</h2><span class="wk-note">${LANG==='fr'?'vs semaine dernière':'vs last week'}</span></div>
    <div class="stat-row">
      <div class="stat-cover" style="--cc:${g.color}">${(g.img||g.boximg)?`<img src="${g.img||g.boximg}" alt="${esc(g.title)}" />`:`<i class="ti ti-${g.icon}"></i>`}</div>
      <div class="stat-grid">${cells}</div>
    </div>
    <button class="hero-cta"><i class="ti ti-school"></i>${t.p_cta}</button>`;
}
function heroRelease(t){
  const d = PROFILES.freespirit.heroData, g = GAMES[d.game];
  const title = d.title || g.title, mech = (d.mech || g.mech)[LANG];
  const cells = d.metrics.map(m=>`<div class="metric"><b>${esc(m.value)}</b><span>${esc(m.label[LANG])}</span></div>`).join('');
  return `<span class="rel-bg" style="background-image:url('${d.img}')"></span>
    <span class="rel-scrim"></span>
    <span class="rel-tag"><i class="ti ti-sparkles"></i>${esc(d.tag[LANG])}</span>
    <div class="rel-content">
      <h2 class="rel-title">${esc(title)}</h2>
      <p class="rel-mech">${esc(mech)}</p>
      <div class="metric-grid">${cells}</div>
      <button class="hero-cta"><i class="ti ti-compass"></i>${t.f_cta}</button>
    </div>`;
}
function renderHero(){
  const t = T(), P = PROFILES[PROF], box = $('#hero');
  box.className = 'hero hero-'+P.hero;
  box.innerHTML = ({social:heroSocial, progress:heroProgress, stats:heroStats, release:heroRelease}[P.hero])(t);
  // hero interactions
  $$('#hero .fr-invite:not([disabled])').forEach(b=>b.addEventListener('click',()=>{
    b.classList.add('sent'); b.textContent = LANG==='fr'?'Invité ✓':'Invited ✓';
  }));
  $$('#hero .hero-cta').forEach(b=>b.addEventListener('click',()=>pulse(b)));
}

/* ---------- RAYONS ---------- */
function renderShelves(){
  const P = PROFILES[PROF];
  $('#shelf1-title').textContent = P.rayon1.title[LANG];
  const sh1 = $('#shelf1');
  if(P.rayon1.type==='topgames'){
    sh1.classList.add('topg');
    sh1.innerHTML = P.rayon1.games.map((it,i)=>{
      const g = GAMES[it.g];
      const front = (g.boximg || g.img)
        ? `<img src="${g.boximg || g.img}" alt="">`
        : `<span class="rb-ico"><i class="ti ti-${g.icon}"></i></span>`;
      const meta = P.rayon1.metric==='mastery'
        ? `<span class="tg-diff"><i class="ti ti-trophy"></i>${LANG==='fr'?'Maîtrise':'Mastery'} ${P.rayon1.mastery[i]}%</span>`
        : P.rayon1.metric==='release'
        ? `<div class="tg-rev"><i class="ti ti-calendar-event"></i>${LANG==='fr'?`Sortie il y a ${P.rayon1.since[i]} jours`:`Released ${P.rayon1.since[i]} days ago`}</div>`
        : `<div class="tg-rev"><i class="ti ti-star-filled"></i>${it.reviews.toLocaleString(LANG==='fr'?'fr-FR':'en-US')} ${LANG==='fr'?'avis':'reviews'}</div>`;
      return `<div class="tg-card">
          <div class="tg-stage">
            <span class="tg-rank">${i+1}</span>
            <div class="tg-box">
              <span class="rb-shadow"></span>
              <div class="rb-cube" style="--cc:${g.color}">
                <span class="rb-face rb-top"></span>
                <span class="rb-face rb-spine"></span>
                <span class="rb-face rb-front">${front}<span class="rb-gloss"></span></span>
              </div>
            </div>
          </div>
          <div class="tg-name">${esc(g.title)}</div>
          ${meta}
        </div>`;
    }).join('');
  } else {
    sh1.classList.remove('topg');
    sh1.innerHTML = P.rayon1.items.map(it=>cover(it.g,{size:'lg',badge:it.badge[LANG],tone:it.tone,featured:it.featured})).join('');
    bindCovers();
  }
}

/* ---------- LIBRARY ---------- */
let curSort = 0;
function renderLibrary(){
  const t = T(), P = PROFILES[PROF];
  $('#lib-title').textContent = t.library;
  $('#lib-sortlabel').textContent = t.sort_by;
  $('#lib-sorts').innerHTML = P.sorts.map((s,i)=>`<button class="chip${i===curSort?' active':''}" data-i="${i}">${esc(s.label[LANG])}</button>`).join('');
  $$('#lib-sorts .chip').forEach(c=>c.addEventListener('click',()=>{curSort=+c.dataset.i; renderLibrary();}));

  const sort = P.sorts[curSort];
  const ids = [...LIBRARY].sort((a,b)=>(GAMES[a][sort.key]-GAMES[b][sort.key])*sort.dir).slice(0,8);
  $('#lib-rows').innerHTML = ids.map(gid=>{
    const g = GAMES[gid];
    const pl = g.pmax<=2 ? (''+g.pmax) : ('2–'+g.pmax);
    return `<button class="gcard" data-game="${gid}" style="--cc:${g.color}">
      <span class="gc-add" title="${LANG==='fr'?'Ajouter à ma bibliothèque':'Add to my library'}"><i class="ti ti-plus"></i></span>
      ${(g.img||g.boximg)?`<img class="gc-img" src="${g.img||g.boximg}" alt="" />`:`<span class="gc-art"><i class="ti ti-${g.icon}"></i></span>`}
      <span class="gc-scrim"></span>
      <span class="gc-body">
        <span class="gc-title">${esc(g.title)}</span>
        <span class="gc-mech">${esc(g.mech[LANG])}</span>
        <span class="gc-meta">
          <span class="m"><i class="ti ti-users"></i>${pl}</span>
          <span class="m"><i class="ti ti-clock"></i>${g.time}${LANG==='fr'?' min':'m'}</span>
          <span class="m"><i class="ti ti-star-filled"></i>${g.rating.toFixed(1)}</span>
        </span>
        <span class="gc-cta solid"><i class="ti ti-player-play-filled"></i>${T().play}</span>
      </span>
    </button>`;
  }).join('');
  $$('#lib-rows .gcard').forEach(c=>{
    c.addEventListener('click',()=>openGame(c.dataset.game));
    tilt(c);
    const add = c.querySelector('.gc-add');
    add.addEventListener('click',e=>{
      e.stopPropagation();
      const on = add.classList.toggle('added');
      add.innerHTML = on ? '<i class="ti ti-check"></i>' : '<i class="ti ti-plus"></i>';
      const name = GAMES[c.dataset.game].title;
      pulseToast(on ? (LANG==='fr'?`${name} ajouté à ta bibliothèque`:`${name} added to your library`)
                    : (LANG==='fr'?`${name} retiré`:`${name} removed`));
    });
  });
}

/* ---------- helpers ---------- */
function bindCovers(){ $$('.shelf .gcard').forEach(c=>{c.addEventListener('click',()=>openGame(c.dataset.game)); tilt(c);}); }
function openGame(gid){ openSetup(gid); }
function pulse(el){ el.animate([{transform:'translate(2px,2px)'},{transform:'none'}],{duration:140}); }
let toastT;
function pulseToast(msg){
  let el=$('#toast'); el.textContent=msg; el.classList.add('show');
  clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove('show'),1400);
}

/* ---------- orchestration ---------- */
function renderAll(){ applyTheme(); renderChrome(); renderBanner(); renderHero(); renderShelves(); renderLibrary(); buildGlitter(); }

/* paillettes dorées — semées une seule fois */
function buildGlitter(){
  const box = $('#banner-glitter'); if(!box || box.childElementCount) return;
  const N = 46;
  let html = '';
  for(let i=0;i<N;i++){
    const x = (Math.random()*100).toFixed(2);
    const y = (Math.random()*100).toFixed(2);
    const s = (4 + Math.random()*7).toFixed(1);
    const dur = (2.4 + Math.random()*3.2).toFixed(2);
    const del = (Math.random()*4).toFixed(2);
    const op = (0.5 + Math.random()*0.5).toFixed(2);
    html += `<span style="left:${x}%;top:${y}%;width:${s}px;height:${s}px;--dur:${dur}s;--del:${del}s;filter:drop-shadow(0 0 ${(+s/2).toFixed(0)}px rgba(245,200,66,${op}))"></span>`;
  }
  box.innerHTML = html;
}
function setProfile(k){ if(!PROFILES[k])return; PROF=k; curSort=0; try{localStorage.setItem('bga_profile',k);}catch(e){} renderAll(); window.scrollTo({top:0,behavior:'smooth'}); }
function setLang(l){ LANG=l; try{localStorage.setItem('bga_lang',l);}catch(e){} renderAll(); }

function boot(){
  try{ LANG = localStorage.getItem('bga_lang')||'fr'; }catch(e){}
  const q = new URLSearchParams(location.search).get('p');
  if(q && PROFILES[q]) PROF=q;
  else { try{const s=localStorage.getItem('bga_profile'); if(s&&PROFILES[s]) PROF=s;}catch(e){} }
  $$('#lang button').forEach(b=>b.addEventListener('click',()=>setLang(b.dataset.lang)));
  const cta=$('#collection-cta'); if(cta) cta.addEventListener('click',()=>{ location.href='salle-de-jeu.html?p='+PROF; });
  renderAll();
}
document.addEventListener('DOMContentLoaded', boot);
