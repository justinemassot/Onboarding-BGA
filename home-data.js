/* ============================================================
   BGA — Home Catalogue · DATA
   Catalogue de jeux + configuration des 4 profils joueurs.
   Vanilla JS, shared global scope.
   ============================================================ */

/* ---- Catalogue de jeux de référence (mock) ----
   color  : flat cover colour (neo-brut)
   icon   : Tabler icon name (thème du jeu)
   mech   : mécanique principale {fr,en}
   pmax   : nb max de joueurs · time : durée moy (min) · rating : /5
   year   : sortie · diff : difficulté 1-5 · buzz : % tendance
   commu  : joueurs actifs (k) · recent : jours depuis sortie (ou null)
*/
const GAMES = {
  thegang:      {title:'The Gang',          color:'#C0392B', icon:'spade',             img:'assets/the-gang.webp', mech:{fr:'Poker coopératif',en:'Cooperative poker'}, pmax:6, time:20, rating:4.6, year:2024, diff:2, buzz:58, commu:42, recent:null},
  challengers:  {title:'Challengers!',       color:'#8BC34A', icon:'trophy',             img:'assets/challengers.webp', mech:{fr:'Tournoi & deckbuilding',en:'Tournament & deckbuilding'}, pmax:8, time:45, rating:4.5, year:2022, diff:2, buzz:56, commu:48, recent:null},
  skyteam:      {title:'Sky Team',           color:'#2A8FC4', icon:'plane',              img:'assets/sky-team.jpeg', mech:{fr:'Coopératif & dés',en:'Cooperative & dice'}, pmax:2, time:15, rating:4.7, year:2023, diff:2, buzz:55, commu:46, recent:null},
  kumata:       {title:'Kumata',             color:'#1E9E8A', icon:'leaf',               img:'assets/kumata.webp', mech:{fr:'Observation & rapidité',en:'Spotting & speed'}, pmax:4, time:15, rating:4.3, year:2023, diff:1, buzz:45, commu:90, recent:null},
  azul:         {title:'Azul',               color:'#2E8FB0', icon:'grid-dots',          img:'assets/azul.webp', mech:{fr:'Tuiles & motifs',en:'Tile drafting'}, pmax:4, time:35, rating:4.6, year:2017, diff:2, buzz:30, commu:73, recent:null},
  paxpamir:     {title:'Pax Pamir',          color:'#4A2747', icon:'crown',              img:'assets/pax-pamir.webp', mech:{fr:'Influence & coalitions',en:'Influence & coalitions'}, pmax:5, time:60, rating:4.5, year:2019, diff:4, buzz:33, commu:67, recent:null},
  whitecastle:  {title:'The White Castle',    color:'#7A6E86', icon:'building-castle',    img:'assets/white-castle.webp', mech:{fr:'Dés & placement',en:'Dice & placement'}, pmax:4, time:80, rating:4.5, year:2023, diff:3, buzz:48, commu:55, recent:null},
  darwinsjourney:{title:"Darwin's Journey",   color:'#3E6E8C', icon:'compass',            img:'assets/darwins-journey.webp', mech:{fr:'Placement d\'ouvriers',en:'Worker placement'}, pmax:4, time:120, rating:4.5, year:2023, diff:4, buzz:46, commu:53, recent:null},
  ageofinnovation:{title:'Age of Innovation', color:'#A8512E', icon:'building-castle',    img:'assets/age-of-innovation.webp', mech:{fr:'Factions & territoires',en:'Factions & territory'}, pmax:5, time:120, rating:4.6, year:2023, diff:4, buzz:50, commu:54, recent:null},
  galacticcruise:{title:'Galactic Cruise',   color:'#4E8C9E', icon:'rocket',             boximg:'assets/galactic-cruise-box.webp', mech:{fr:'Placement & gestion',en:'Worker placement'}, pmax:4, time:120, rating:4.5, year:2024, diff:4, buzz:62, commu:36, recent:null},
  toybattle:    {title:'Toy Battle',          color:'#8CC63F', icon:'swords',             img:'assets/toy-battle.webp', mech:{fr:'Contrôle de zone',en:'Area control'}, pmax:2, time:15, rating:4.2, year:2023, diff:2, buzz:47, commu:40, recent:null},
  flip7:        {title:'Flip 7',              color:'#36B5C4', icon:'cards',              boximg:'assets/flip7-box.webp', mech:{fr:'Stop ou encore',en:'Push your luck'}, pmax:8, time:20, rating:4.4, year:2024, diff:1, buzz:64, commu:44, recent:null},
  hutan:        {title:'Hutan',               color:'#3E9A45', icon:'paw',               boximg:'assets/hutan-box.webp', mech:{fr:'Tuiles & habitats',en:'Tile-laying & habitats'}, pmax:4, time:30, rating:4.3, year:2024, diff:2, buzz:53, commu:42, recent:null},
  apiary:       {title:'Apiary',              color:'#E0772E', icon:'hexagon',            boximg:'assets/apiary-box.webp', mech:{fr:'Placement & moteur',en:'Worker placement'}, pmax:5, time:90, rating:4.4, year:2023, diff:3, buzz:49, commu:39, recent:null},
  emberleaf:    {title:'Emberleaf',           color:'#6FA83C', icon:'leaf',               boximg:'assets/emberleaf-box.webp', mech:{fr:'Aventure & cartes',en:'Adventure & cards'}, pmax:5, time:60, rating:4.4, year:2025, diff:3, buzz:58, commu:34, recent:null},
  catan:        {title:'Catan',             color:'#D9772E', icon:'hexagon',           img:'assets/catan-console.avif', mech:{fr:'Placement & commerce',en:'Placement & trading'}, pmax:4, time:75,  rating:4.4, year:1995, diff:2, buzz:18,  commu:128, recent:null},
  sevenwonders: {title:'7 Wonders',         color:'#C9A227', icon:'building-monument', img:'assets/7-wonders-cover.jpg', boximg:'assets/7-wonders-box.webp', mech:{fr:'Draft de cartes',en:'Card drafting'},            pmax:7, time:40,  rating:4.6, year:2010, diff:2, buzz:24,  commu:95,  recent:null},
  tickettoride: {title:'Ticket to Ride',    color:'#2E8B6F', icon:'train',             mech:{fr:'Collecte & réseau',en:'Set collect & routes'}, pmax:5, time:60,  rating:4.3, year:2004, diff:1, buzz:12,  commu:140, recent:null},
  avalon:       {title:'Collect',           color:'#E8922B', icon:'cards',             img:'assets/collect-banner-min.webp', mech:{fr:'Collection & set',en:'Set collection'},  pmax:10,time:30,  rating:4.5, year:2012, diff:2, buzz:33,  commu:88,  recent:null},
  wingspan:     {title:'Wingspan',          color:'#3F8F5F',  icon:'feather',           boximg:'assets/wingspan-box.jpg', mech:{fr:'Moteur & oiseaux',en:'Engine building'},        pmax:5, time:70,  rating:4.7, year:2019, diff:3, buzz:41,  commu:112, recent:null},
  terraforming: {title:'Terraforming Mars', color:'#C0492F', icon:'planet',            img:'assets/terraforming-banner.webp', boximg:'assets/terraforming-mars-box.webp', mech:{fr:'Moteur & tuiles',en:'Engine & tiles'},          pmax:5, time:120, rating:4.6, year:2016, diff:4, buzz:29,  commu:76,  recent:null},
  chess:        {title:'Chess',             color:'#3A3A3A', icon:'chess',             mech:{fr:'Abstrait',en:'Abstract'},                       pmax:2, time:30,  rating:4.8, year:1475, diff:5, buzz:9,   commu:210, recent:null},
  hanabi:       {title:'Hanabi',            color:'#B5407A', icon:'sparkles',          mech:{fr:'Coop & info cachée',en:'Co-op & deduction'},    pmax:5, time:25,  rating:4.2, year:2010, diff:2, buzz:15,  commu:64,  recent:null},
  scythe:       {title:'Scythe',            color:'#7A5230', icon:'settings',          mech:{fr:'Contrôle & moteur',en:'Area control & engine'},pmax:5, time:115, rating:4.5, year:2016, diff:4, buzz:22,  commu:58,  recent:null},
  dominion:     {title:'Dominion',          color:'#2E7D5B', icon:'cards',             mech:{fr:'Deckbuilding',en:'Deck building'},              pmax:4, time:30,  rating:4.3, year:2008, diff:2, buzz:11,  commu:71,  recent:null},
  pandemic:     {title:'Pandemic',          color:'#C23B3B', icon:'virus',             mech:{fr:'Coopératif',en:'Co-operative'},                 pmax:4, time:45,  rating:4.4, year:2008, diff:3, buzz:14,  commu:99,  recent:null},
  root:         {title:'Root',              color:'#4F7A2E', icon:'tree',              mech:{fr:'Asymétrique & guerre',en:'Asymmetric wargame'}, pmax:6, time:90,  rating:4.4, year:2018, diff:4, buzz:37,  commu:67,  recent:null},
  brass:        {title:'Brass Birmingham',  color:'#8A6A3A', icon:'building-factory',  mech:{fr:'Économie & réseau',en:'Economic network'},      pmax:4, time:120, rating:4.8, year:2018, diff:5, buzz:31,  commu:53,  recent:null},
  arknova:      {title:'Ark Nova',          color:'#2E8C8C', icon:'paw',               boximg:'assets/ark-nova-box.webp', mech:{fr:'Moteur & cartes',en:'Engine & cards'},          pmax:4, time:150, rating:4.7, year:2021, diff:4, buzz:52, commu:84, recent:21},
  wondrouscreatures:{title:'Wondrous Creatures', color:'#1F7A5F', icon:'paw', boximg:'assets/wondrous-creatures.webp', mech:{fr:'Engine building & faune',en:'Engine building & wildlife'}, pmax:4, time:90, rating:4.7, year:2024, diff:3, buzz:60, commu:38, recent:null},
  chateaucombo: {title:'Château Combo',     color:'#2E7DA8', icon:'cards',             img:'assets/chateau-combo.webp', mech:{fr:'Combo & placement de cartes',en:'Card combo & placement'}, pmax:4, time:30, rating:4.6, year:2024, diff:2, buzz:62, commu:40, recent:null},
  forestshuffle:{title:'Forest Shuffle',    color:'#3E7A33', icon:'tree',              boximg:'assets/forest-shuffle-box.webp', mech:{fr:'Cartes & moteur',en:'Card engine'}, pmax:5, time:60, rating:4.6, year:2023, diff:2, buzz:57, commu:50, recent:null},
  harmonies:    {title:'Harmonies',          color:'#2E7DA8', icon:'mountain',          boximg:'assets/harmonies-box.jpg', mech:{fr:'Tuiles & habitats',en:'Tile & habitats'}, pmax:4, time:45, rating:4.5, year:2024, diff:2, buzz:59, commu:44, recent:null},
  cascadia:     {title:'Cascadia',          color:'#5C8A3A', icon:'mountain',          mech:{fr:'Tuiles & puzzle',en:'Tile-laying puzzle'},      pmax:4, time:45,  rating:4.5, year:2021, diff:2, buzz:27,  commu:90,  recent:null},
  citadels:     {title:'Citadels',          color:'#9A3F6F', icon:'building-castle',   mech:{fr:'Rôles & bluff',en:'Roles & bluff'},             pmax:8, time:50,  rating:4.1, year:2000, diff:2, buzz:13,  commu:60,  recent:null},
  spiritisland: {title:'Spirit Island',     color:'#2F6F8C', icon:'flame',             mech:{fr:'Coop & pouvoirs',en:'Co-op & powers'},          pmax:4, time:120, rating:4.7, year:2017, diff:5, buzz:34,  commu:49,  recent:null},
  everdell:     {title:'Everdell',          color:'#3E8E5A', icon:'leaf',              img:'assets/everdell.webp', mech:{fr:'Placement & moteur',en:'Worker placement'},     pmax:4, time:80,  rating:4.6, year:2018, diff:3, buzz:38,  commu:73,  recent:null},
  lacrimosa:    {title:'Lacrimosa',         color:'#6A4A8C', icon:'music',             mech:{fr:'Main & programmation',en:'Hand & programming'}, pmax:4, time:90,  rating:4.3, year:2022, diff:3, buzz:44,  commu:31,  recent:12},
  mysterium:    {title:'Mysterium',         color:'#3F6FA0', icon:'ghost',             mech:{fr:'Coop & déduction',en:'Co-op deduction'},        pmax:7, time:45,  rating:4.2, year:2015, diff:2, buzz:19,  commu:57,  recent:null}
};
// fix one malformed colour (typo-proofing)
GAMES.wingspan.color = '#3FA66B';

/* Mission / description courte par jeu (sous-titre des cartes "Sélection") */
const MISSIONS = {
  thegang:        {fr:'Réussissez le casse en équipe',        en:'Pull off the heist as a team'},
  challengers:    {fr:'Bâtis ton deck et remporte le tournoi',  en:'Build your deck, win the tournament'},
  skyteam:        {fr:'Posez l’avion à deux, en silence',       en:'Land the plane together, in silence'},
  sevenwonders:   {fr:'Bâtis la cité la plus prospère',         en:'Build the most prosperous city'},
  arknova:        {fr:'Conçois le zoo le plus réputé',          en:'Design the most renowned zoo'},
  whitecastle:    {fr:'Place tes clans au château d’Himeji',     en:'Place your clans in Himeji castle'},
  darwinsjourney: {fr:'Mène l’expédition aux Galápagos',         en:'Lead the expedition to the Galápagos'},
  ageofinnovation:{fr:'Développe ta faction et innove',         en:'Grow your faction and innovate'},
  wingspan:       {fr:'Attire les plus beaux oiseaux',          en:'Attract the finest birds'},
  cascadia:       {fr:'Compose l’habitat parfait',              en:'Compose the perfect habitat'},
  spiritisland:   {fr:'Défends ton île en esprit gardien',       en:'Defend your island as a spirit'},
  wondrouscreatures:{fr:'Réveille des créatures fabuleuses',     en:'Awaken fabulous creatures'},
  chateaucombo:   {fr:'Compose le combo le plus malin',          en:'Build the cleverest combo'},
  root:           {fr:'Conquiers la forêt, chacun sa faction',   en:'Conquer the forest, each its faction'},
  everdell:       {fr:'Fonde ta cité dans la vallée',           en:'Found your city in the valley'},
  terraforming:   {fr:'Transforme la planète rouge',           en:'Terraform the red planet'},
  catan:          {fr:'Colonise et commerce sur l’île',         en:'Settle and trade on the island'},
  galacticcruise: {fr:'Embarque pour une croisière galactique',  en:'Board the galactic cruise'},
  toybattle:      {fr:'Commande ton armée de jouets',          en:'Command your toy army'}
};

/* Nombre de joueurs (min) par jeu — pmax déjà dans GAMES */
const PMIN = {thegang:3,challengers:1,skyteam:2,kumata:2,azul:2,paxpamir:1,whitecastle:1,darwinsjourney:1,catan:3,citadels:2,sevenwonders:3,chess:2,brass:2,terraforming:1,scythe:1,wingspan:1,cascadia:1,arknova:1,spiritisland:1,wondrouscreatures:1,root:2,everdell:1};

/* ---- Bandeau "coupe-fil" : parties sociales en cours ----
   Parties actives avec place disponible. Priorité Socialiser, visible pour tous. */
const LIVE_TABLES = [
  {game:'avalon',       host:'Marin',    cur:7, max:10, tag:{fr:'commence dans 2 min',en:'starts in 2 min'}},
  {game:'sevenwonders', host:'Lou',      cur:4, max:7,  tag:{fr:'tour 2',en:'age II'}},
  {game:'catan',        host:'Théo',     cur:3, max:4,  tag:{fr:'amis bienvenus',en:'friends welcome'}},
  {game:'terraforming', host:'Inès',     cur:5, max:8,  tag:{fr:'détente',en:'casual'}}
];

/* ---- Bibliothèque universelle : 10 jeux, triables ---- */
const LIBRARY = ['arknova','galacticcruise','paxpamir','azul','wingspan','ageofinnovation','everdell','wondrouscreatures','terraforming','sevenwonders'];

/* ---- Amis (roster pour l'invitation rapide dans la modale de setup) ---- */
const FRIENDS = [
  {name:'Lou',     online:true},
  {name:'Marin',   online:true},
  {name:'Théo',    online:true},
  {name:'Sacha',   online:true},
  {name:'Inès',    online:false},
  {name:'Camille', online:false}
];

/* ---- Configuration des 4 profils ----
   theme  : couleurs (principal / fond clair / texte)
   tab    : libellé d'onglet
   hero   : type d'encart + data
   rayon1/2 : titres + items {g, badge{fr,en}, tone}
   sorts  : 4 tris (libellés + clé de tri + ordre)
   metric : colonne de métrique affichée en bibliothèque {label, get}
*/

/* ---- Top 5 communauté (partagé par tous les profils) ---- */
const TOP5_COMMUNITY = {type:'topgames', title:{fr:'Top 5 de la communauté',en:'Community top 5'}, games:[
  {g:'wingspan',     reviews:790},
  {g:'forestshuffle',reviews:712},
  {g:'arknova',      reviews:1345},
  {g:'everdell',     reviews:870},
  {g:'apiary',       reviews:648}
]};

const PROFILES = {
  socialiser: {
    theme:{p:'#378ADD', soft:'#E6F1FB', text:'#0C447C'},
    tab:{fr:'Le Sociable',en:'The Connector'},
    name:{fr:'Le Sociable',en:'The Connector'},
    bannerTitle:{fr:'Parfaits pour jouer entre amis',en:'Perfect for playing with friends'},
    hero:'social',
    picks:[
      {g:'thegang',      why:{fr:'Parfait à plusieurs',en:'Great with a crowd'}},
      {g:'challengers',  why:{fr:'Négocie avec tes amis',en:'Trade with friends'}},
      {g:'skyteam',      why:{fr:'Bluff entre amis',en:'Bluff with friends'}},
      {g:'sevenwonders', why:{fr:'Jusqu’à 7 joueurs',en:'Up to 7 players'}}
    ],
    heroData:{
      friends:[
        {name:'Lou',   game:{fr:'joue à 7 Wonders',en:'playing 7 Wonders'}, online:true},
        {name:'Marin', game:{fr:'cherche une partie',en:'looking for a game'}, online:true},
        {name:'Inès',  game:{fr:'hors ligne',en:'offline'}, online:false}
      ]
    },
    rayon1:TOP5_COMMUNITY,
    rayon2:{title:{fr:'Plébiscités par la communauté',en:'Loved by the community'}, items:[
      {g:'wingspan',badge:{fr:'★ 4.7',en:'★ 4.7'},tone:'soft'},
      {g:'everdell',badge:{fr:'★ 4.6',en:'★ 4.6'},tone:'soft'},
      {g:'cascadia',badge:{fr:'★ 4.5',en:'★ 4.5'},tone:'soft'},
      {g:'mysterium',badge:{fr:'coop',en:'co-op'},tone:'soft'},
      {g:'hanabi',badge:{fr:'coop',en:'co-op'},tone:'soft'},
      {g:'tickettoride',badge:{fr:'famille',en:'family'},tone:'soft'}
    ]},
    sorts:[
      {label:{fr:'Plus de joueurs',en:'Most players'}, key:'commu', dir:-1},
      {label:{fr:'Communauté active',en:'Active community'}, key:'commu', dir:-1},
      {label:{fr:'Mieux notés',en:'Top rated'}, key:'rating', dir:-1},
      {label:{fr:'Parties rapides',en:'Quick games'}, key:'time', dir:1}
    ],
    metric:{label:{fr:'Joueurs actifs',en:'Active players'}, fmt:g=>g.commu+'k'}
  },

  achiever: {
    theme:{p:'#EF9F27', soft:'#FAEEDA', text:'#633806'},
    tab:{fr:'Le Compétiteur',en:'The Achiever'},
    name:{fr:'Le Compétiteur',en:'The Achiever'},
    bannerTitle:{fr:'Affronter les plus grands défis',en:'Take on the toughest challenges'},
    hero:'progress',
    picks:[
      {g:'arknova',      why:{fr:'Stratégie pure',en:'Pure strategy'}},
      {g:'whitecastle',  why:{fr:'Optimise ton moteur',en:'Optimize your engine'}},
      {g:'darwinsjourney', why:{fr:'Vise le score max',en:'Chase the high score'}},
      {g:'ageofinnovation', why:{fr:'Défi élevé',en:'High challenge'}}
    ],
    heroData:{
      xp:140, xpMax:200, level:{fr:'Jeune recrue',en:'Recruit'},
      keys:[
        {done:false, active:true, label:{fr:'1ʳᵉ partie lancée',en:'1st game launched'}},
        {done:false, label:{fr:'10 parties jouées',en:'10 games played'}},
        {done:false, label:{fr:'1ᵉʳ avis posté',en:'1st review posted'}}
      ],
      next:[
        {name:{fr:'Explorateur',en:'Explorer'},        icon:'beach',       keys:3},
        {name:{fr:'Génie',en:'Genius'},                icon:'chess',           keys:3},
        {name:{fr:'Guerrier',en:'Warrior'},            icon:'trophy',          keys:3},
        {name:{fr:'Légende',en:'Legend'},             icon:'crown',           keys:5}
      ],
      badge:{fr:'Badge mystère',en:'Mystery badge'}
    },
    rayon1:{...TOP5_COMMUNITY, title:{fr:'Continue ta progression',en:'Keep progressing'}, metric:'mastery', mastery:[96,88,74,61,43]},
    rayon2:{title:{fr:'Ton ratio défi / maîtrise',en:'Your challenge / mastery mix'}, items:[
      {g:'spiritisland',badge:{fr:'Diff. 5',en:'Diff. 5'},tone:'red'},
      {g:'root',badge:{fr:'Diff. 4',en:'Diff. 4'},tone:'p'},
      {g:'arknova',badge:{fr:'Diff. 4',en:'Diff. 4'},tone:'p'},
      {g:'dominion',badge:{fr:'Diff. 2',en:'Diff. 2'},tone:'soft'},
      {g:'sevenwonders',badge:{fr:'Diff. 2',en:'Diff. 2'},tone:'soft'},
      {g:'catan',badge:{fr:'Diff. 2',en:'Diff. 2'},tone:'soft'}
    ]},
    sorts:[
      {label:{fr:'Plus difficiles',en:'Hardest'}, key:'diff', dir:-1},
      {label:{fr:'Mieux notés',en:'Top rated'}, key:'rating', dir:-1},
      {label:{fr:'Compétitifs',en:'Competitive'}, key:'diff', dir:-1},
      {label:{fr:'Parties longues',en:'Long games'}, key:'time', dir:-1}
    ],
    metric:{label:{fr:'Difficulté',en:'Difficulty'}, fmt:g=>'◆'.repeat(g.diff)}
  },

  philanthropist: {
    theme:{p:'#13CC63', soft:'#E1F5EE', text:'#085041'},
    tab:{fr:'Le Bâtisseur',en:'The Philanthropist'},
    name:{fr:'Le Bâtisseur',en:'The Philanthropist'},
    bannerTitle:{fr:'Plongez dans leur univers',en:'Dive into their worlds'},
    hero:'stats',
    picks:[
      {g:'wingspan',     why:{fr:'Complète ta collection',en:'Complete your collection'}},
      {g:'terraforming', why:{fr:'Idéal pour débuter',en:'Great to teach'}},
      {g:'arknova',      why:{fr:'À partager',en:'Worth sharing'}},
      {g:'catan',        why:{fr:'Coop à guider',en:'Co-op to lead'}}
    ],
    heroData:{
      fav:'wingspan',
      stats:[
        {label:{fr:'Parties jouées',en:'Games played'}, value:'6',     delta:'+2',     dir:'up'},
        {label:{fr:'Temps de jeu',en:'Play time'},       value:'4h30',  delta:'+45 min',dir:'up'},
        {label:{fr:'XP gagnés',en:'XP earned'},           value:'180',   delta:'−40',    dir:'down'},
        {label:{fr:'Parties gagnées',en:'Games won'},     value:'4',     delta:'+1',     dir:'up'}
      ]
    },
    rayon1:{...TOP5_COMMUNITY, title:{fr:'Jeux comme Wingspan',en:'Games like Wingspan'}},
    rayon2:{title:{fr:'Rejoins des débutants',en:'Join newcomers'}, items:[
      {g:'tickettoride',badge:{fr:'Accessible',en:'Beginner'},tone:'soft'},
      {g:'catan',badge:{fr:'Accessible',en:'Beginner'},tone:'soft'},
      {g:'cascadia',badge:{fr:'Accessible',en:'Beginner'},tone:'soft'},
      {g:'hanabi',badge:{fr:'Coop',en:'Co-op'},tone:'soft'},
      {g:'pandemic',badge:{fr:'Coop',en:'Co-op'},tone:'soft'},
      {g:'mysterium',badge:{fr:'Coop',en:'Co-op'},tone:'soft'}
    ]},
    sorts:[
      {label:{fr:'Ouvragés',en:'Crafted'}, key:'diff', dir:1},
      {label:{fr:'Communauté apprécie',en:'Community favourite'}, key:'rating', dir:-1},
      {label:{fr:'Accessibles',en:'Accessible'}, key:'diff', dir:1},
      {label:{fr:'Plus de joueurs',en:'Most players'}, key:'commu', dir:-1}
    ],
    metric:{label:{fr:'Difficulté',en:'Difficulty'}, fmt:g=>'◆'.repeat(g.diff)}
  },

  freespirit: {
    theme:{p:'#986AF3', soft:'#EEEDFE', text:'#26215C'},
    tab:{fr:"L'Explorateur",en:'The Free Spirit'},
    name:{fr:"L'Explorateur",en:'The Free Spirit'},
    bannerTitle:{fr:'Amusez-vous sans retenue',en:'Have fun without limits'},
    hero:'release',
    picks:[
      {g:'chateaucombo', why:{fr:'Sortie récente',en:'Fresh release'}},
      {g:'galacticcruise', why:{fr:'Mécaniques inédites',en:'Unusual mechanics'}},
      {g:'toybattle',   why:{fr:'Univers original',en:'Original world'}},
      {g:'avalon',      why:{fr:'En plein buzz',en:'Buzzing now'}}
    ],
    heroData:{
      game:'arknova',
      title:'Galactic Cruise',
      mech:{fr:'Placement & gestion spatiale',en:'Space worker placement'},
      img:'assets/galactic-cruise-banner.webp',
      tag:{fr:'Nouveau',en:'New'},
      metrics:[
        {label:{fr:'Note',en:'Rating'}, value:'4.7'},
        {label:{fr:'Parties jouées',en:'Games played'}, value:'8.4k'},
        {label:{fr:'Recommandé',en:'Recommended'}, value:'96%'}
      ]
    },
    rayon1:{...TOP5_COMMUNITY, title:{fr:'Les top nouveautés',en:'Top new releases'}, metric:'release', since:[4,10,18,25,29], games:[
      {g:'galacticcruise'},{g:'toybattle'},{g:'flip7'},{g:'hutan'},{g:'emberleaf'}
    ]},
    rayon2:{title:{fr:'En train de buzzer',en:'Buzzing right now'}, items:[
      {g:'arknova',badge:{fr:'+52%',en:'+52%'},tone:'red'},
      {g:'lacrimosa',badge:{fr:'+44%',en:'+44%'},tone:'red'},
      {g:'avalon',badge:{fr:'+33%',en:'+33%'},tone:'p'},
      {g:'everdell',badge:{fr:'+38%',en:'+38%'},tone:'p'},
      {g:'root',badge:{fr:'+37%',en:'+37%'},tone:'p'},
      {g:'spiritisland',badge:{fr:'+34%',en:'+34%'},tone:'soft'}
    ]},
    sorts:[
      {label:{fr:'Plus récents',en:'Newest'}, key:'year', dir:-1},
      {label:{fr:'En train de buzzer',en:'Buzzing'}, key:'buzz', dir:-1},
      {label:{fr:'Mécaniques inédites',en:'Fresh mechanics'}, key:'buzz', dir:-1},
      {label:{fr:'Moins joués',en:'Least played'}, key:'commu', dir:1}
    ],
    metric:{label:{fr:'Buzz',en:'Buzz'}, fmt:g=>'+'+g.buzz+'%'}
  }
};

/* ---- Chrome i18n (navbar, sections, boutons partagés) ---- */
const HOME_I18N = {
  fr:{
    nav_browse:'Catalogue', nav_community:'Communauté', nav_ranking:'Classements',
    search:'Rechercher un jeu, un mécanisme…',
    collection:'Ma salle de jeu',
    banner_title:'Notre sélection pour vous',
    banner_sub:'4 jeux que tu devrais adorer.',
    join:'Rejoindre', seats_left:'place(s) libre(s)', seats_avail:'places disponibles', play:'Jouer',
    hero_kicker:'Pour toi',
    library:'Catalogue', sort_by:'Trier par',
    players:'joueurs', minutes:'min',
    // hero pieces
    s_friends:'Tes amis en ligne', s_invite:'Inviter', s_create:'Créer une table',
    s_groups:'Ma communauté',
    g_invite_t:'Inviter mes amis à jouer', g_invite_d:'Envoie un lien à tes amis et lancez une partie ensemble en quelques secondes.', g_invite_cta:'Inviter',
    g_join_t:'Rejoindre un groupe', g_join_d:'Parcours les groupes ouverts et rejoins une communauté de joueurs près de toi.', g_join_cta:'Rejoindre',
    g_create_t:'Créer un groupe', g_create_d:'Monte ton propre cercle de joueurs et organise vos soirées jeux.', g_create_cta:'Créer',
    s_empty:'Personne pour l’instant — invite tes amis !', s_invitefriend:'Inviter un ami',
    a_keys:'Mission : cartographier les territoires inexplorés.', a_xp:'XP', a_cta:'Lancer une partie pour débloquer la clef 2',
    a_locked:'Badge mystère',
    p_fav:'Ton jeu préféré', p_cta:'Lancer le jeu',
    f_cta:'Découvrir en premier', f_play:'Jouer maintenant'
  },
  en:{
    nav_browse:'Browse', nav_community:'Community', nav_ranking:'Rankings',
    search:'Search a game, a mechanic…',
    collection:'My playroom',
    banner_title:'Our selection for you',
    banner_sub:'4 games you should love.',
    join:'Join', seats_left:'seat(s) left', seats_avail:'seats available', play:'Play',
    hero_kicker:'For you',
    library:'Catalogue', sort_by:'Sort by',
    players:'players', minutes:'min',
    s_friends:'Your friends online', s_invite:'Invite', s_create:'Create a table',
    s_groups:'My community',
    g_invite_t:'Invite my friends to play', g_invite_d:'Send a link to your friends and start a game together in seconds.', g_invite_cta:'Invite',
    g_join_t:'Join a group', g_join_d:'Browse open groups and join a community of players near you.', g_join_cta:'Join',
    g_create_t:'Create a group', g_create_d:'Build your own circle of players and host your game nights.', g_create_cta:'Create',
    s_empty:'No one yet — invite your friends!', s_invitefriend:'Invite a friend',
    a_keys:'Mission: map the unexplored territories.', a_xp:'XP', a_cta:'Play a game to unlock key 2',
    a_locked:'Mystery badge',
    p_fav:'Your favourite game', p_cta:'Launch the game',
    f_cta:'Discover it first', f_play:'Play now'
  }
};

const PROFILE_ORDER = ['socialiser','achiever','philanthropist','freespirit'];
