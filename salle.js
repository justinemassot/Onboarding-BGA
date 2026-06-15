/* ============================================================
   Salle de jeu — page profil
   Lit le profil depuis ?p= ou localStorage 'bga_profile'.
   Carte d'identité pré-remplie par profil + image de salle + partage.
   ============================================================ */
(function(){
  const $ = (s,r=document)=>r.querySelector(s);
  const esc = s => (''+s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  let LANG = 'fr';
  try { LANG = localStorage.getItem('bga_lang') || 'fr'; } catch(e){}
  function nick(){ try { return (localStorage.getItem('bga_nick')||'').trim(); } catch(e){ return ''; } }

  const PICON = {socialiser:'users', achiever:'trophy', philanthropist:'heart-handshake', freespirit:'compass'};
  const ORDER = ['socialiser','achiever','philanthropist','freespirit'];

  // Niveaux de badge (échelle XP du projet)
  const NIVEAUX = [
    {min:0,    max:200,  fr:'Novice',      en:'Novice'},
    {min:200,  max:500,  fr:'Explorateur', en:'Explorer'},
    {min:500,  max:1000, fr:'Confirmé',    en:'Skilled'},
    {min:1000, max:2500, fr:'Expert',      en:'Expert'},
    {min:2500, max:null, fr:'Légende',     en:'Legend'}
  ];
  function levelFor(xp){ return NIVEAUX.find(n=>n.max===null || xp<n.max) || NIVEAUX[NIVEAUX.length-1]; }

  // Points d'intérêt cliquables sur l'image (position en % du cadre)
  const SPOTS_DEFAULT = [
    {key:'biblio',  fr:'Ma bibliothèque',     en:'My library',         x:84, y:42},
    {key:'badges',  fr:'Trophées & badges',   en:'Trophies & badges',  x:30, y:28},
    {key:'bureau',  fr:'Mes parties',          en:'My games',           x:49, y:55},
    {key:'cheminee',fr:'Ma communauté',       en:'My community',       x:11, y:64},
    {key:'statues', fr:'Mon profil joueur',   en:'My player profile',  x:56, y:84}
  ];
  // Jeux ajoutés à la bibliothèque (mock)
  const LIBRARY = ['thegang','catan','sevenwonders','terraforming','arknova','wingspan','everdell','cascadia','galacticcruise','wondrouscreatures'];

  // Carte d'identité — données par profil
  const ROOMS = {
    socialiser: {
      title:{fr:'La Taverne',en:'The Tavern'},
      role:{fr:'Le Sociable',en:'The Connector'},
      level:{fr:'Hôte de soirée',en:'Game-night host'}, xp:150,
      stats:[ {v:'128', l:{fr:'Parties jouées',en:'Games played'}}, {v:'34', l:{fr:'Amis',en:'Friends'}}, {v:'9', l:{fr:'Tables créées',en:'Tables hosted'}} ],
      fav:'thegang',
      room:'assets/room-social.webp'
    },
    achiever: {
      title:{fr:"L'Arène",en:'The Arena'},
      role:{fr:'Le Compétiteur',en:'The Achiever'},
      level:{fr:'Jeune recrue',en:'Recruit'}, xp:140,
      stats:[ {v:'47', l:{fr:'Parties jouées',en:'Games played'}}, {v:'68%', l:{fr:'Victoires',en:'Win rate'}}, {v:'#214', l:{fr:'Classement',en:'Ranking'}} ],
      fav:'arknova',
      room:'assets/room-arena.webp',
      spots:[
        {key:'biblio',  fr:'Ma bibliothèque', en:'My library',  x:30, y:28},
        {key:'rewards', fr:'Trophées et badges', en:'Trophies & badges',  x:88, y:60},
        {key:'bureau',  fr:'Mes parties',      en:'My games',    x:49, y:55},
        {key:'cheminee',fr:'Ma communauté',    en:'My community', x:11, y:64},
        {key:'statues', fr:'Mon profil joueur', en:'My player profile',  x:56, y:84}
      ]
    },
    philanthropist: {
      title:{fr:"L'Atelier",en:'The Workshop'},
      role:{fr:'Le Bâtisseur',en:'The Philanthropist'},
      level:{fr:'Mentor confirmé',en:'Trusted mentor'}, xp:760,
      stats:[ {v:'212', l:{fr:'Parties jouées',en:'Games played'}}, {v:'58', l:{fr:'Débutants guidés',en:'Players taught'}}, {v:'31', l:{fr:'Avis postés',en:'Reviews'}} ],
      fav:'wingspan',
      room:'assets/room-builder.webp'
    },
    freespirit: {
      title:{fr:'Le Cosmodrome',en:'The Cosmodrome'},
      role:{fr:"L'Explorateur",en:'The Free Spirit'},
      level:{fr:'Éclaireur',en:'Scout'}, xp:430,
      stats:[ {v:'73', l:{fr:'Parties jouées',en:'Games played'}}, {v:'41', l:{fr:'Nouveautés testées',en:'New games tried'}}, {v:'12', l:{fr:'Découvertes',en:'Discoveries'}} ],
      fav:'galacticcruise',
      room:'assets/room-freespirit.webp'
    }
  };

  let PROF = 'socialiser';
  const q = new URLSearchParams(location.search).get('p');
  if(q && PROFILES[q]) PROF = q;
  else { try { const s=localStorage.getItem('bga_profile'); if(s&&PROFILES[s]) PROF=s; } catch(e){} }

  function applyTheme(){
    const th = PROFILES[PROF].theme;
    document.documentElement.style.setProperty('--p', th.p);
    document.documentElement.style.setProperty('--p-soft', th.soft);
    document.documentElement.style.setProperty('--p-text', th.text);
  }

  function renderTabs(){
    $('#tabs').innerHTML = ORDER.map(k=>{
      const P = PROFILES[k];
      return `<button class="ptab${k===PROF?' active':''}" data-prof="${k}" style="--tc:${P.theme.p}" title="${esc(P.tab[LANG])}"><i class="ti ti-${PICON[k]}"></i></button>`;
    }).join('');
    $('#tabs').querySelectorAll('.ptab').forEach(b => b.addEventListener('click', () => {
      PROF = b.dataset.prof;
      try { localStorage.setItem('bga_profile', PROF); } catch(e){}
      const u = new URL(location.href); u.searchParams.set('p', PROF); history.replaceState(null,'',u);
      render();
    }));
  }

  function render(){
    applyTheme();
    renderTabs();
    const R = ROOMS[PROF], P = PROFILES[PROF], fr = LANG==='fr';
    const n = nick();
    const ini = (n || 'Joueur').trim().slice(0,2).toUpperCase();
    const g = GAMES[R.fav];
    const favCover = (g.img||g.boximg) ? `<img src="${g.img||g.boximg}" alt="">` : `<i class="ti ti-${g.icon}"></i>`;
    const lv = levelFor(R.xp);
    const lvMax = lv.max || R.xp;
    const pct = lv.max ? Math.round((R.xp - lv.min) / (lv.max - lv.min) * 100) : 100;

    // visuel de la salle par profil
    const slot = $('#room-img');
    slot.style.backgroundImage = R.room ? `url('${R.room}')` : 'none';
    slot.style.backgroundColor = R.room ? 'transparent' : 'var(--p-soft)';
    renderHotspots(fr);

    $('#room-tag span').textContent = (fr?'Salle · ':'Room · ') + R.title[LANG];
    $('#back-txt').textContent = fr?'Catalogue':'Catalogue';
    $('#share-txt').textContent = fr?'Partager ma salle':'Share my room';

    $('#idcard').innerHTML = `
      <div class="id-top">
        <div class="id-ava">${ini}<span class="id-prof"><i class="ti ti-${PICON[PROF]}"></i></span></div>
        <div>
          <div class="id-name">${esc(n || (fr?'Joueur':'Player'))}</div>
          <span class="id-role"><i class="ti ti-${PICON[PROF]}"></i>${esc(P.name[LANG])}</span>
        </div>
      </div>
      <span class="id-divider"></span>
      <div class="id-grid">
        ${R.stats.map(s=>`<div class="id-stat"><b>${esc(s.v)}</b><span>${esc(s.l[LANG])}</span></div>`).join('')}
      </div>
      <span class="id-divider"></span>
      <div class="id-fav">
        <span class="fav-cover">${favCover}</span>
        <div><div class="fav-t">${fr?'Jeu de prédilection':'Signature game'}</div><div class="fav-n">${esc(g.title)}</div></div>
      </div>
      <span class="id-divider"></span>
      <div class="id-gauge">
        <div class="id-gauge-top"><span><b>${esc(lv[LANG])}</b></span><span>${R.xp} / ${lvMax} XP</span></div>
        <div class="id-bar"><span style="width:${pct}%"></span></div>
      </div>`;
  }

  function renderHotspots(fr){
    const spots = ROOMS[PROF].spots || SPOTS_DEFAULT;
    const ovl = ROOMS[PROF].spotLabels || {};
    const host = $('#hotspots');
    host.innerHTML = spots.map(s=>{ const label = ovl[s.key] ? (fr?ovl[s.key].fr:ovl[s.key].en) : (fr?s.fr:s.en); return `<button class="hotspot" data-key="${s.key}" style="left:${s.x}%;top:${s.y}%"><span class="hs-tip">${label}</span></button>`; }).join('');
    host.querySelectorAll('.hotspot').forEach(b=>b.addEventListener('click',()=>{
      const label = b.querySelector('.hs-tip').textContent;
      if(b.dataset.key==='biblio') openLibrary(label);
      else toast(label + (fr?' — bientôt':' — coming soon'));
    }));
  }

  function openLibrary(title){
    const fr = LANG==='fr';
    title = title || (fr?'Ma bibliothèque':'My library');
    let ov = $('#lib-overlay');
    if(!ov){ ov = document.createElement('div'); ov.id='lib-overlay'; ov.className='lib-overlay'; document.body.appendChild(ov); }
    const games = LIBRARY.filter(k=>GAMES[k]);
    ov.innerHTML = `<div class="lib-sheet">
      <div class="lib-head"><h2>${esc(title)}</h2><span class="lib-count">${games.length} ${fr?'jeux':'games'}</span><button class="lib-x" id="lib-x" aria-label="close"><i class="ti ti-x"></i></button></div>
      <div class="lib-grid">${games.map(k=>{ const g=GAMES[k]; const cover=(g.img||g.boximg)?`<img src="${g.img||g.boximg}" alt="">`:`<i class="ti ti-${g.icon}"></i>`; return `<div class="lib-card"><div class="lib-cover" style="background:${g.color||'var(--p)'}">${cover}</div><div class="lib-meta"><div class="lib-name">${esc(g.title)}</div><div class="lib-mech">${g.mech?esc(g.mech[LANG]):''}</div></div></div>`; }).join('')}</div>
    </div>`;
    requestAnimationFrame(()=>ov.classList.add('open'));
    const close = ()=>ov.classList.remove('open');
    $('#lib-x').addEventListener('click', close);
    ov.addEventListener('click', e=>{ if(e.target===ov) close(); });
    document.addEventListener('keydown', function onEsc(e){ if(e.key==='Escape'){ close(); document.removeEventListener('keydown', onEsc); } });
  }

  function toast(msg){
    const t = $('#toast'); t.textContent = msg;
    t.style.opacity='1'; t.style.transform='translateX(-50%) translateY(0)';
    clearTimeout(toast._t); toast._t = setTimeout(()=>{ t.style.opacity='0'; t.style.transform='translateX(-50%) translateY(20px)'; }, 2200);
  }

  document.addEventListener('DOMContentLoaded', () => {
    render();
    $('#share-btn').addEventListener('click', () => {
      const fr = LANG==='fr';
      const url = location.origin + location.pathname + '?p=' + PROF;
      const done = () => { const b=$('#share-btn'); b.classList.add('copied'); $('#share-txt').textContent = fr?'Lien copié !':'Link copied!'; toast(fr?'Lien de ta salle copié':'Room link copied'); setTimeout(()=>{ b.classList.remove('copied'); $('#share-txt').textContent = fr?'Partager ma salle':'Share my room'; }, 2000); };
      if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done).catch(done);
      else done();
    });
  });
})();
