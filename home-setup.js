/* ============================================================
   Modale de configuration de partie
   Pré-remplie selon les préférences de l'Acte 1 (localStorage
   'bga_prefs' = {temps,type,mode}) + le profil actif. Tout éditable.
   ============================================================ */

const SETUP_AVA = ['#378ADD','#EF9F27','#13CC63','#986AF3','#E5556B','#2AA7A0'];

function readPrefs(){
  try { return JSON.parse(localStorage.getItem('bga_prefs') || '{}') || {}; }
  catch(e){ return {}; }
}

let SETUP = null;

function defaultSetup(gid){
  const g = GAMES[gid], p = readPrefs();
  const minP = (typeof PMIN !== 'undefined' && PMIN[gid]) ? PMIN[gid] : 1;
  const profMode = PROF==='achiever' ? 'public' : PROF==='freespirit' ? 'solo' : 'amis';
  const mode = PROF==='socialiser' ? 'amis' : (p.mode || profMode);
  let joueurs = mode==='solo' ? Math.max(1,minP) : Math.min(g.pmax, 4);
  joueurs = Math.max(minP, Math.min(g.pmax, joueurs));
  // Le Sociable : pré-sélectionne ses amis en ligne par défaut
  const friends = (mode==='amis' && PROF==='socialiser')
    ? FRIENDS.filter(f=>f.online).slice(0, Math.max(0, g.pmax-1)).map(f=>f.name)
    : [];
  if(friends.length) joueurs = Math.max(joueurs, Math.min(g.pmax, friends.length+1));
  const format = PROF==='socialiser' ? 'tour' : 'reel';
  const vitesse = format==='tour' ? '1' : (({rapide:'rapide', moyen:'normale', long:'detendue'})[p.temps] || 'normale');
  return { gid, minP, maxP: g.pmax, mode, format, vitesse, niveau: PROF==='achiever' ? 'expert' : 'normal', joueurs, friends };
}

function seg(name, value, opts){
  return `<div class="seg-ctl" data-seg="${name}">` + opts.map(o => {
    const inner = o.sub ? `<span class="so-txt">${o.label}<small>${o.sub}</small></span>` : o.label;
    return `<button class="seg-opt${o.v===value?' on':''}" data-v="${o.v}">${o.icon?`<i class="ti ti-${o.icon}"></i>`:''}${inner}</button>`;
  }).join('') + `</div>`;
}

function friendsBlock(){
  const fr = LANG==='fr';
  return `<div class="set-block">
      <div class="set-lbl-row">
        <span class="set-lbl">${fr?'Inviter des amis':'Invite friends'}</span>
        <button class="fquick" data-quick><i class="ti ti-bolt"></i>${fr?'Amis en ligne':'Online friends'}</button>
      </div>
      <div class="set-friends">
        ${FRIENDS.map((f,i)=>`<button class="fchip${SETUP.friends.includes(f.name)?' on':''}${f.online?'':' off'}" data-friend="${f.name}">
            <span class="fav" style="background:${SETUP_AVA[i%SETUP_AVA.length]}">${f.name[0]}${f.online?'<span class="fdot"></span>':''}</span>${f.name}
          </button>`).join('')}
      </div>
    </div>`;
}

function setupBody(){
  const s = SETUP, g = GAMES[s.gid], fr = LANG==='fr';
  const cover = (g.img||g.boximg) ? `<img src="${g.img||g.boximg}" alt="">` : `<i class="ti ti-${g.icon}"></i>`;
  const range = s.minP===g.pmax ? `${g.pmax}` : `${s.minP}–${g.pmax}`;
  const turnBased = s.format==='tour';
  const vitLabel = turnBased ? (fr?'Tours par jour':'Turns per day') : (fr?'Vitesse de jeu':'Game speed');
  const vit = turnBased
    ? ['1','2','3','4'].map(n => ({v:n, label:n}))
    : [
        {v:'detendue',icon:'hourglass', label:fr?'Lente':'Slow',    sub:fr?'~5 min / tour':'~5 min / turn'},
        {v:'normale', icon:'clock',     label:fr?'Normale':'Normal',sub:fr?'~2 min / tour':'~2 min / turn'},
        {v:'rapide',  icon:'bolt',      label:fr?'Rapide':'Fast',   sub:fr?'~30 s / tour':'~30 s / turn'}
      ];
  return `
    <div class="setup-head">
      <div class="setup-cover" style="--cc:${g.color}">${cover}</div>
      <div class="setup-titles">
        <span class="setup-kicker"><i class="ti ti-sparkles"></i>${fr?'Pré-rempli selon tes préférences':'Pre-filled from your preferences'}</span>
        <h3>${esc(g.title)}</h3>
        <p>${esc(g.mech[LANG])} · ${range} ${fr?'joueurs':'players'}</p>
      </div>
      <button class="setup-x" data-close aria-label="${fr?'Fermer':'Close'}"><i class="ti ti-x"></i></button>
    </div>
    <div class="setup-body">
      <div class="set-block">
        <div class="set-lbl">${fr?'Adversaires':'Opponents'}</div>
        ${seg('mode', s.mode, [
          {v:'solo',  icon:'user',   label:fr?'Solo':'Solo'},
          {v:'amis',  icon:'users',  label:fr?'Amis':'Friends'},
          {v:'public',icon:'trophy', label:fr?'Compétitif':'Ranked'}
        ])}
      </div>
      ${s.mode==='amis' ? friendsBlock() : ''}
      <div class="set-block">
        <div class="set-lbl">${fr?'Nombre de joueurs':'Players'}</div>
        <div class="stepper" data-stepper>
          <button data-step="-1" aria-label="−">−</button>
          <span id="set-players">${s.joueurs}</span>
          <button data-step="1" aria-label="+">+</button>
        </div>
      </div>
      <div class="set-block">
        <div class="set-lbl">${fr?'Format de jeu':'Game format'}</div>
        ${seg('format', s.format, [
          {v:'reel', icon:'player-play-filled', label:fr?'Temps réel':'Real-time'},
          {v:'tour', icon:'calendar',           label:fr?'Tour par tour':'Turn-based'}
        ])}
      </div>
      <div class="set-block">
        <div class="set-lbl">${vitLabel}</div>
        ${seg('vitesse', s.vitesse, vit)}
      </div>
      <div class="set-block">
        <div class="set-lbl">${fr?'Niveau des adversaires':'Opponent level'}</div>
        ${seg('niveau', s.niveau, [
          {v:'debutant', label:fr?'Débutant':'Beginner'},
          {v:'normal',   label:fr?'Normal':'Normal'},
          {v:'expert',   label:'Expert'}
        ])}
      </div>
    </div>
    <div class="setup-foot">
      <button class="btn-ghost" data-close>${fr?'Annuler':'Cancel'}</button>
      <button class="btn-primary" data-launch><i class="ti ti-player-play-filled"></i>${fr?'Lancer la partie':'Start game'}</button>
    </div>`;
}

function ensureSetupEl(){
  let el = document.getElementById('setup-modal');
  if(!el){
    el = document.createElement('div');
    el.id = 'setup-modal';
    el.className = 'modal-overlay';
    el.hidden = true;
    el.innerHTML = '<div class="setup-sheet" role="dialog" aria-modal="true"></div>';
    document.body.appendChild(el);
    el.addEventListener('click', e => { if(e.target===el) closeSetup(); });
    document.addEventListener('keydown', e => { if(e.key==='Escape' && !el.hidden) closeSetup(); });
  }
  return el;
}

function stepperState(){
  const wrap = document.querySelector('#setup-modal [data-stepper]');
  if(!wrap) return;
  wrap.querySelector('#set-players').textContent = SETUP.joueurs;
  const min = SETUP.mode==='solo' ? 1 : SETUP.minP;
  wrap.querySelector('[data-step="-1"]').disabled = SETUP.joueurs <= min;
  wrap.querySelector('[data-step="1"]').disabled  = SETUP.joueurs >= SETUP.maxP;
}

function renderSetup(){
  const sheet = document.querySelector('#setup-modal .setup-sheet');
  sheet.innerHTML = setupBody();
  bindSetup(sheet);
  stepperState();
}

function bindSetup(sheet){
  sheet.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', closeSetup));

  sheet.querySelectorAll('.seg-ctl').forEach(ctl => {
    const name = ctl.dataset.seg;
    ctl.querySelectorAll('.seg-opt').forEach(opt => opt.addEventListener('click', () => {
      if(SETUP[name] === opt.dataset.v) return;
      SETUP[name] = opt.dataset.v;
      if(name==='mode'){
        const min = SETUP.mode==='solo' ? 1 : SETUP.minP;
        if(SETUP.mode==='solo'){ SETUP.joueurs = Math.max(1, SETUP.minP); SETUP.friends = []; }
        else if(SETUP.joueurs < Math.max(min,2)) SETUP.joueurs = Math.min(SETUP.maxP, Math.max(min,2));
        SETUP.joueurs = Math.max(min, Math.min(SETUP.maxP, SETUP.joueurs));
        renderSetup(); // affiche/masque le bloc amis
        return;
      }
      if(name==='format'){
        if(SETUP.format==='tour' && !['1','2','3','4'].includes(SETUP.vitesse)) SETUP.vitesse='2';
        if(SETUP.format==='reel' && !['detendue','normale','rapide'].includes(SETUP.vitesse)) SETUP.vitesse='normale';
        renderSetup(); return;
      }
      ctl.querySelectorAll('.seg-opt').forEach(o => o.classList.remove('on'));
      opt.classList.add('on');
    }));
  });

  sheet.querySelectorAll('[data-stepper] [data-step]').forEach(b => b.addEventListener('click', () => {
    const min = SETUP.mode==='solo' ? 1 : SETUP.minP;
    SETUP.joueurs = Math.max(min, Math.min(SETUP.maxP, SETUP.joueurs + (+b.dataset.step)));
    stepperState();
  }));

  sheet.querySelectorAll('.fchip').forEach(chip => chip.addEventListener('click', () => {
    const name = chip.dataset.friend;
    const idx = SETUP.friends.indexOf(name);
    if(idx>=0) SETUP.friends.splice(idx,1);
    else if(SETUP.friends.length < SETUP.maxP-1) SETUP.friends.push(name);
    chip.classList.toggle('on', SETUP.friends.includes(name));
    if(SETUP.friends.length){
      SETUP.joueurs = Math.max(SETUP.joueurs, Math.min(SETUP.maxP, SETUP.friends.length+1));
      stepperState();
    }
  }));

  const quick = sheet.querySelector('[data-quick]');
  if(quick) quick.addEventListener('click', () => {
    SETUP.friends = FRIENDS.filter(f=>f.online).slice(0, SETUP.maxP-1).map(f=>f.name);
    SETUP.joueurs = Math.max(SETUP.joueurs, Math.min(SETUP.maxP, SETUP.friends.length+1));
    renderSetup();
  });

  sheet.querySelector('[data-launch]').addEventListener('click', () => {
    const gid = SETUP.gid;
    try { document.dispatchEvent(new CustomEvent('setup.validated', {detail:{...SETUP}})); } catch(e){}
    closeSetup();
    openLaunch(gid);
  });
}

/* ---- Écran de transition / partie en cours ---- */
function ensureLaunchEl(){
  let el = document.getElementById('launch-screen');
  if(!el){
    el = document.createElement('div');
    el.id = 'launch-screen';
    el.hidden = true;
    document.body.appendChild(el);
  }
  return el;
}

function openLaunch(gid){
  const g = GAMES[gid], fr = LANG==='fr';
  const img = g.img || g.boximg || '';
  const el = ensureLaunchEl();
  el.innerHTML = `
    <div class="lx-bg" style="background-image:url('${img}')"></div>
    <div class="lx-card">
      ${img ? `<div class="lx-cover"><img src="${img}" alt=""></div>` : `<div class="lx-ico" style="--cc:${g.color}"><i class="ti ti-${g.icon}"></i></div>`}
      <div class="lx-spin" aria-hidden="true"></div>
      <div class="lx-text">
        <div class="lx-title">${esc(g.title)}</div>
        <div class="lx-sub">${fr?'Préparation de la table…':'Setting up the table…'}</div>
      </div>
      <button class="lx-finish" hidden data-finish><i class="ti ti-flag-checkered"></i>${fr?'Finir la partie':'Finish game'}</button>
    </div>`;
  el.hidden = false;
  const btn = el.querySelector('[data-finish]');
  clearTimeout(el._t);
  el._t = setTimeout(() => {
    el.querySelector('.lx-spin').style.display = 'none';
    el.querySelector('.lx-sub').textContent = fr?'Partie terminée':'Game finished';
    btn.hidden = false;
  }, 3000);
  btn.addEventListener('click', () => {
    el.hidden = true;
    try { document.dispatchEvent(new CustomEvent('game.played', {detail:{game:gid}})); } catch(e){}
    openReward();
  });
}

/* ---- Modale de récompense : 1ʳᵉ clef débloquée ---- */
function ensureRewardEl(){
  let el = document.getElementById('reward-modal');
  if(!el){
    el = document.createElement('div');
    el.id = 'reward-modal';
    el.hidden = true;
    document.body.appendChild(el);
    el.addEventListener('click', e => { if(e.target===el) el.hidden = true; });
  }
  return el;
}

function openReward(){
  const fr = LANG==='fr';
  const el = ensureRewardEl();
  const sparks = [1,2,3,4,5,6].map(i=>`<span class="kx-spark s${i}"></span>`).join('');
  const next = (PROFILES.achiever.heroData.next || []).slice(0,4);
  const nextRow = next.map(b=>`<div class="kx-nb">
      <span class="kx-nb-medal"><i class="ti ti-${b.icon}"></i><span class="kx-nb-lock"><i class="ti ti-lock"></i></span></span>
      <span class="kx-nb-name">${esc(b.name[LANG])}</span>
    </div>`).join('');
  el.innerHTML = `
    <div class="kx-burst"></div>
    <div class="kx-card">
      <div class="kx-gemwrap">
        <span class="kx-glow"></span>
        ${sparks}
        <div class="kx-gem"><span class="rim"></span><span class="face"></span><i class="ti ti-key"></i><span class="gloss"></span></div>
      </div>
      <span class="kx-kicker"><i class="ti ti-sparkles"></i>${fr?'Clef débloquée':'Key unlocked'}</span>
      <div class="kx-title">${fr?'1ʳᵉ partie lancée\u00a0!':'1st game launched!'}</div>
      <div class="kx-sub">+50 XP</div>
      <div class="kxg">
        <div class="kxg-row">
          <span class="kxg-key done"><i class="ti ti-key"></i></span>
          <span class="kxg-seg on"><span class="kxg-segfill"></span></span>
          <span class="kxg-key"><i class="ti ti-lock"></i></span>
          <span class="kxg-seg"></span>
          <span class="kxg-key"><i class="ti ti-lock"></i></span>
          <span class="kxg-seg"></span>
          <span class="kxg-badge"><i class="ti ti-award"></i><span class="kx-nb-lock"><i class="ti ti-lock"></i></span></span>
        </div>
        <div class="kxg-label"><b>1 / 3</b> ${fr?'clefs · badge':'keys · badge'} <b>Apprenti</b></div>
      </div>
      <div class="kx-next">
        <div class="kx-next-head">${fr?'Badges suivants':'Next badges'}</div>
        <div class="kx-next-row">${nextRow}</div>
      </div>
      <button class="kx-cta" data-rclose><i class="ti ti-compass"></i>${fr?'Continuer l\u2019exploration':'Keep exploring'}</button>
    </div>`;
  el.hidden = false;
  el.querySelector('[data-rclose]').addEventListener('click', () => { el.hidden = true; });
}

function openSetup(gid){
  if(!GAMES[gid]) return;
  SETUP = defaultSetup(gid);
  const el = ensureSetupEl();
  renderSetup();
  el.hidden = false;
  el.querySelector('.setup-sheet').scrollTop = 0;
}

function closeSetup(){
  const el = document.getElementById('setup-modal');
  if(el) el.hidden = true;
}
