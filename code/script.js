"use strict";

/* ══════════════════════════════════════════════════════════
   SPLASH
══════════════════════════════════════════════════════════ */
(function () {
  const splash  = document.getElementById("splashScreen");
  const content = document.getElementById("splashContent");
  const bar     = document.getElementById("splashBar");
  let start = null;
  const TOTAL = 3200;
  function animBar(ts) {
    if (!start) start = ts;
    const pct = Math.min(((ts - start) / TOTAL) * 100, 100);
    bar.style.width = pct + "%";
    if (pct < 100) requestAnimationFrame(animBar);
  }
  requestAnimationFrame(animBar);
  setTimeout(() => content.classList.add("slide-out"), TOTAL - 600);
  setTimeout(() => {
    splash.classList.add("hidden");
    document.getElementById("mainMenu").classList.add("active");
  }, TOTAL);
})();

/* ══════════════════════════════════════════════════════════
   PARTICLES
══════════════════════════════════════════════════════════ */
(function () {
  const c = document.getElementById("particles");
  for (let i = 0; i < 28; i++) {
    const d = document.createElement("div");
    d.className = "ptcl";
    d.style.left = Math.random() * 100 + "%";
    d.style.animationDuration = 6 + Math.random() * 10 + "s";
    d.style.animationDelay = -Math.random() * 12 + "s";
    const sz = 1 + Math.random() * 2.5 + "px";
    d.style.width = d.style.height = sz;
    d.style.opacity = Math.random() * 0.8 + 0.2;
    c.appendChild(d);
  }
})();

/* ══════════════════════════════════════════════════════════
   SETTINGS
══════════════════════════════════════════════════════════ */
const settings = {
  menuMusic: true, battleMusic: true, volume: 0.7,
  cpu: false, cpuDiff: "medium", roundTime: 90,
  particles: true, fx: true, startHealth: 100, showFPS: false,
};
function toggleMenuMusic() {
  settings.menuMusic = !settings.menuMusic;
  document.getElementById("menuMusicTog").classList.toggle("on", settings.menuMusic);
  if (settings.menuMusic) playMenuTheme(); else stopMusic();
}
function toggleBattleMusic() {
  settings.battleMusic = !settings.battleMusic;
  document.getElementById("battleMusicTog").classList.toggle("on", settings.battleMusic);
  if (!settings.battleMusic) stopMusic();
}
function setVolume(v) {
  settings.volume = v / 100;
  document.getElementById("volVal").innerText = v;
  if (bgAudio) bgAudio.volume = settings.volume;
}
function toggleCPU() {
  settings.cpu = !settings.cpu;
  document.getElementById("cpuToggle").classList.toggle("on", settings.cpu);
  document.getElementById("cpuTog2").classList.toggle("on", settings.cpu);
}
function toggleParticles() {
  settings.particles = !settings.particles;
  document.getElementById("particleTog").classList.toggle("on", settings.particles);
  document.getElementById("particles").style.display = settings.particles ? "block" : "none";
}
function toggleFX() {
  settings.fx = !settings.fx;
  document.getElementById("fxTog").classList.toggle("on", settings.fx);
}
function toggleFPS() {
  settings.showFPS = !settings.showFPS;
  document.getElementById("fpsTog").classList.toggle("on", settings.showFPS);
  document.getElementById("fpsCounter").style.display = settings.showFPS ? "block" : "none";
}
function showQuitConfirm()  { document.getElementById("quitConfirm").classList.add("active"); }
function hideQuitConfirm() { document.getElementById("quitConfirm").classList.remove("active"); }
function doQuit() { window.location.href = "https://vj1xab.mimo.run/login.html";
}
document.getElementById("roundTime").addEventListener("change",   e => { settings.roundTime   = parseInt(e.target.value); });
document.getElementById("healthSelect").addEventListener("change", e => { settings.startHealth = parseInt(e.target.value); });

/* ══════════════════════════════════════════════════════════
   AUDIO
══════════════════════════════════════════════════════════ */
const TRACKS = {
  menu:   "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  battle: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
};
let bgAudio = null, currentTrack = null;
function stopMusic() {
  if (bgAudio) { bgAudio.pause(); bgAudio.currentTime = 0; bgAudio = null; }
  currentTrack = null;
}
function playTrack(key) {
  if (currentTrack === key) return;
  stopMusic();
  currentTrack = key;
  bgAudio = new Audio(TRACKS[key]);
  bgAudio.loop = true; bgAudio.volume = settings.volume;
  bgAudio.play().catch(() => {});
}
function playMenuTheme()   { if (settings.menuMusic)   playTrack("menu"); }
function playBattleTheme() { if (settings.battleMusic) playTrack("battle"); }
let audioStarted = false;
function startAudioOnce() {
  if (audioStarted) return; audioStarted = true; playMenuTheme();
}
document.addEventListener("click",      startAudioOnce, { once: true });
document.addEventListener("touchstart", startAudioOnce, { once: true });
document.addEventListener("keydown",    startAudioOnce, { once: true });

/* ══════════════════════════════════════════════════════════
   SCREEN NAV
══════════════════════════════════════════════════════════ */
const SCREENS = ["mainMenu","howToPlayScreen","characterScreen","battleScreen","settingsScreen","onlineLobbyScreen"];
function go(id) {
  SCREENS.forEach(s => document.getElementById(s).classList.toggle("active", s === id));
  if (id === "mainMenu")         { document.getElementById("touchControls").style.display = "none"; playMenuTheme(); }
  if (id === "characterScreen")  resetCS();
  if (id === "settingsScreen")   playMenuTheme();
  if (id === "battleScreen")     { const t = "ontouchstart" in window || navigator.maxTouchPoints > 0; document.getElementById("touchControls").style.display = t ? "block" : "none"; playBattleTheme(); }
  if (id === "onlineLobbyScreen") initLobby();
}

/* ══════════════════════════════════════════════════════════
   CHARACTERS
══════════════════════════════════════════════════════════ */
const characters = [
  { name:"Luna",    image:"../assets/images/luna.jpg" },
  { name:"Sara",    image:"../assets/images/sara.jpg" },
  { name:"Ace",     image:"../assets/images/ace.png" },
  { name:"Blaze",   image:"../assets/images/blaze.jpg" },
  { name:"Vanessa", image:"../assets/images/vanessa.jpg" },
  { name:"Carl",    image:"../assets/images/carl.jpg" },
  { name:"Brian",   image:"../assets/images/brian.jpg" },
  { name:"Ed",      image:"../assets/images/ed.jpg" },
  { name:"Markus",  image:"../assets/images/markus.jpg" },
  { name:"Amelia",  image:"../assets/images/amelia.jpg" },
];
let curPlayer = 1, selChar = null, p1Char = null, p2Char = null;
const grid = document.getElementById("charGrid");
characters.forEach(ch => {
  const card = document.createElement("div");
  card.className = "char-card"; card.dataset.n = ch.name;
  card.innerHTML = `<div class="sel-indicator sel-p1" id="si1_${ch.name}">1</div><div class="sel-indicator sel-p2" id="si2_${ch.name}">2</div><img src="${ch.image}" loading="lazy"/><div class="char-name">${ch.name}</div>`;
  card.onclick = () => selectChar(ch, card);
  grid.appendChild(card);
});
function selectChar(ch, card) {
  if (curPlayer === 1 && p2Char && p2Char.name === ch.name) return;
  if (curPlayer === 2 && p1Char && p1Char.name === ch.name) return;
  document.querySelectorAll(".char-card").forEach(c => c.classList.remove("selected"));
  card.classList.add("selected"); selChar = ch;
}
function resetCS() {
  curPlayer = 1; selChar = null; p1Char = null; p2Char = null;
  document.getElementById("turnText").innerText = "Player 1 — Choose Your Fighter";
  document.getElementById("p1Img").style.display = "none";
  document.getElementById("p2Img").style.display = "none";
  document.getElementById("p1Lbl").innerText = "Player 1";
  document.getElementById("p2Lbl").innerText = "Player 2";
  document.querySelectorAll(".char-card").forEach(c => {
    c.classList.remove("selected"); c.style.opacity = "1";
    c.querySelectorAll(".sel-indicator").forEach(s => s.style.display = "none");
  });
  const btn = document.getElementById("lockBtn");
  btn.innerText = "Lock In"; btn.onclick = lockCharacter; btn.disabled = false;
}

/* ══════════════════════════════════════════════════════════
   NETWORK
══════════════════════════════════════════════════════════ */
const SERVER_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'ws://localhost:3000'
  : 'wss://gear-defenders-server.onrender.com';

let netWs = null;
let netRole = null;   // "host" | "guest" | null
let netReady = false;
let hostBroadcastInterval = null;

/*
  hostSideGuest — what the host knows about guest input RIGHT NOW.
  Written by onNetData. Read by game loop. Jumps/attacks are queues.
*/
const hostSideGuest = {
  left: false, right: false, block: false,
  jumps: [],     // drained by game loop
  attacks: [],   // drained by game loop
};

/*
  guestLocalInput — what the guest is pressing RIGHT NOW.
  Written by keyboard/touch handlers. Read+sent by game loop each frame.
  Jumps/attacks are queues drained after each send.
*/
const guestLocalInput = {
  left: false, right: false, block: false,
  jumps: [],     // one entry per jump press; cleared after send
  attacks: [],   // one entry per attack press; cleared after send
};

function setLobbyMode(mode) {
  document.getElementById("lobbyHostBtn").classList.toggle("active", mode === "host");
  document.getElementById("lobbyJoinBtn").classList.toggle("active", mode === "join");
  document.getElementById("hostPanel").style.display = mode === "host" ? "flex" : "none";
  document.getElementById("joinPanel").style.display = mode === "join" ? "flex" : "none";
  if (mode === "host") beginHosting(); else resetJoinPanel();
}
function initLobby() { setLobbyMode("host"); }

function genCode() {
  const c = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 3; i++) s += c[Math.floor(Math.random() * c.length)];
  s += "-";
  for (let i = 0; i < 3; i++) s += c[Math.floor(Math.random() * c.length)];
  return s;
}
function beginHosting() {
  destroyNet();
  setHostStatus("Generating room…", "");
  document.getElementById("hostCodeDisplay").textContent = "—";
  netWs = new WebSocket(SERVER_URL);
  netWs.onopen = () => {
    netWs.send(JSON.stringify({ type: 'createRoom' }));
  };
  netWs.onmessage = (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.type === 'roomCreated') {
      netRole = "host";
      document.getElementById("hostCodeDisplay").textContent = msg.code;
      setHostStatus("Waiting for opponent… Share your code!", "wait");
    } else if (msg.type === 'guestConnected') {
      setHostStatus("Opponent connected! Choose your character…", "ok");
      setTimeout(() => go("characterScreen"), 900);
    } else if (msg.type === 'error') {
      setHostStatus(msg.message || "Connection error. Try again.", "err");
    } else {
      onNetData(msg);
    }
  };
  netWs.onerror = () => { setHostStatus("Connection error. Try again.", "err"); };
  netWs.onclose = () => {
    if (document.getElementById("battleScreen").classList.contains("active")) {
      alert("Connection lost."); returnToMenu();
    }
    netReady = false; netWs = null;
  };
}
function resetJoinPanel() {
  document.getElementById("joinCodeInput").value = "";
  setJoinStatus("Enter the code your friend shared", "");
  const btn = document.getElementById("joinActionBtn");
  btn.disabled = false; btn.textContent = "Connect";
}
function doJoinGame() {
  const raw = document.getElementById("joinCodeInput").value.trim().toUpperCase();
  const code = raw.replace(/[^A-Z0-9]/g, "");
  if (code.length < 6) { setJoinStatus("Enter a valid room code", "err"); return; }
  setJoinStatus("Connecting…", "wait");
  destroyNet();
  const btn = document.getElementById("joinActionBtn");
  btn.disabled = true; btn.textContent = "Connecting…";
  netWs = new WebSocket(SERVER_URL);
  netWs.onopen = () => {
    netWs.send(JSON.stringify({ type: 'joinRoom', code }));
  };
  netWs.onmessage = (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.type === 'roomJoined') {
      netRole = "guest";
      setJoinStatus("Connected! Waiting for host…", "ok");
    } else if (msg.type === 'error') {
      setJoinStatus(msg.message || "Could not connect. Check the code.", "err");
      btn.disabled = false; btn.textContent = "Connect";
    } else if (msg.type === 'opponentDisconnected') {
      if (document.getElementById("battleScreen").classList.contains("active")) {
        alert("Opponent disconnected."); returnToMenu();
      }
      netReady = false; netWs = null;
    } else {
      onNetData(msg);
    }
  };
  netWs.onerror = () => {
    setJoinStatus("Could not connect. Check the code.", "err");
    btn.disabled = false; btn.textContent = "Connect";
  };
  netWs.onclose = () => {
    if (document.getElementById("battleScreen").classList.contains("active")) {
      alert("Connection lost."); returnToMenu();
    }
    netReady = false; netWs = null;
  };
}
function setupConn() {
  netWs.onmessage = (evt) => {
    const msg = JSON.parse(evt.data);
    if (msg.type === 'opponentDisconnected') {
      if (document.getElementById("battleScreen").classList.contains("active")) {
        alert("Opponent disconnected."); returnToMenu();
      }
      netReady = false; netWs = null;
    } else {
      onNetData(msg);
    }
  };
}

/* ── Net message handler ── */
function onNetData(msg) {
  if (!msg || !msg.type) return;

  /* HOST → GUEST: authoritative world state */
  if (msg.type === "state" && netRole === "guest") {
    if (!gameRunning) return;
    p1s.x = msg.p1x; p1s.y = msg.p1y; p1s.onG = msg.p1g;
    p2s.x = msg.p2x; p2s.y = msg.p2y; p2s.onG = msg.p2g;
    p1s.hp = msg.p1hp; p1s.sp = msg.p1sp;
    p2s.hp = msg.p2hp; p2s.sp = msg.p2sp;
    if (typeof msg.timeLeft === "number") updateTimerDisplay(msg.timeLeft);
    applyPositions(); updateBars();
    if (msg.win) handleNetWin(msg.win);
    return;
  }

  /* GUEST → HOST: raw input frame */
  if (msg.type === "input" && netRole === "host") {
    // Held state: just overwrite with latest
    hostSideGuest.left  = !!msg.left;
    hostSideGuest.right = !!msg.right;
    hostSideGuest.block = !!msg.block;
    // One-shot queues: APPEND (never drop events)
    for (let i = 0; i < (msg.jumps || 0); i++) hostSideGuest.jumps.push(1);
    if (msg.attacks) msg.attacks.forEach(a => hostSideGuest.attacks.push(a));
    return;
  }

  /* HOST → GUEST: start char select */
  if (msg.type === "startCharSelect" && netRole === "guest") {
    go("characterScreen");
    document.getElementById("turnText").innerText = "You — Choose Your Fighter (P2)";
    return;
  }

  /* GUEST → HOST: guest chose their character */
  if (msg.type === "guestChar" && netRole === "host") {
    p2Char = characters.find(c => c.name === msg.name) || characters[1];
    const img = document.getElementById("p2Img");
    img.src = p2Char.image; img.style.display = "block";
    document.getElementById("p2Lbl").innerText = p2Char.name;
    document.getElementById("si2_"+p2Char.name).style.display = "flex";
    document.getElementById("turnText").innerText = "⚔ Ready to Battle!";
    const btn = document.getElementById("lockBtn");
    btn.innerText = "▶ Fight!"; btn.disabled = false;
    btn.onclick = () => {
      sendNet({ type:"charSync", p1:p1Char.name, p2:p2Char.name, roundTime:settings.roundTime });
      go("battleScreen"); startBattleNet();
    };
    return;
  }

  /* HOST → GUEST: both chars locked, fight! */
  if (msg.type === "charSync" && netRole === "guest") {
    p1Char = characters.find(c => c.name === msg.p1) || characters[0];
    p2Char = characters.find(c => c.name === msg.p2) || characters[1];
    if (typeof msg.roundTime === "number") settings.roundTime = msg.roundTime;
    netReady = true; go("battleScreen"); startBattleNet();
    return;
  }
}

function sendNet(obj) {
  if (netWs && netWs.readyState === WebSocket.OPEN) {
    try { netWs.send(JSON.stringify(obj)); } catch(e) {}
  }
}

/* Lobby UI helpers */
function setHostStatus(txt, cls) { const el = document.getElementById("hostStatus"); el.textContent = txt; el.className = "lobby-status" + (cls ? " "+cls : ""); }
function setJoinStatus(txt, cls) { const el = document.getElementById("joinStatus");  el.textContent = txt; el.className = "lobby-status" + (cls ? " "+cls : ""); }
function copyRoomCode() {
  const code = document.getElementById("hostCodeDisplay").textContent;
  if (code === "—") return;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.querySelector(".lobby-copy-btn"), orig = btn.textContent;
    btn.textContent = "✅ Copied!"; setTimeout(() => btn.textContent = orig, 1500);
  }).catch(() => prompt("Your room code:", code));
}
function cancelLobby() { destroyNet(); go("mainMenu"); }
function leaveLobby()  { destroyNet(); go("mainMenu"); }
function destroyNet() {
  if (hostBroadcastInterval) { clearInterval(hostBroadcastInterval); hostBroadcastInterval = null; }
  if (netWs) {
    try {
      if (netWs.readyState === WebSocket.OPEN) netWs.send(JSON.stringify({ type: 'disconnect' }));
      netWs.close();
    } catch(e) {}
    netWs = null;
  }
  netRole = null; netReady = false;
  hostSideGuest.left = false; hostSideGuest.right = false; hostSideGuest.block = false;
  hostSideGuest.jumps = []; hostSideGuest.attacks = [];
  guestLocalInput.left = false; guestLocalInput.right = false; guestLocalInput.block = false;
  guestLocalInput.jumps = []; guestLocalInput.attacks = [];
}

/* ══════════════════════════════════════════════════════════
   CHARACTER SELECT — LOCK IN
══════════════════════════════════════════════════════════ */
function lockCharacter() {
  if (!selChar) { alert("Choose a fighter first!"); return; }
  const card = [...document.querySelectorAll(".char-card")].find(c => c.dataset.n === selChar.name);

  if (netRole === "guest") {
    p2Char = selChar;
    const img = document.getElementById("p2Img");
    img.src = p2Char.image; img.style.display = "block";
    document.getElementById("p2Lbl").innerText = p2Char.name;
    document.getElementById("si2_"+p2Char.name).style.display = "flex";
    if (card) card.style.opacity = ".45";
    document.getElementById("turnText").innerText = "Waiting for host to start…";
    document.getElementById("lockBtn").disabled = true;
    document.querySelectorAll(".char-card").forEach(c => c.classList.remove("selected"));
    selChar = null;
    sendNet({ type:"guestChar", name:p2Char.name });
    return;
  }

  if (curPlayer === 1) {
    p1Char = selChar;
    const img = document.getElementById("p1Img");
    img.src = p1Char.image; img.style.display = "block";
    document.getElementById("p1Lbl").innerText = p1Char.name;
    document.getElementById("si1_"+p1Char.name).style.display = "flex";
    if (card) card.style.opacity = ".45";
    curPlayer = 2;
    if (netRole === "host") {
      sendNet({ type:"startCharSelect" });
      document.getElementById("turnText").innerText = "Waiting for opponent to choose…";
      document.getElementById("lockBtn").disabled = true;
      document.querySelectorAll(".char-card").forEach(c => c.classList.remove("selected"));
      selChar = null; return;
    }
    document.getElementById("turnText").innerText = "Player 2 — Choose Your Fighter";
  } else {
    p2Char = selChar;
    const img = document.getElementById("p2Img");
    img.src = p2Char.image; img.style.display = "block";
    document.getElementById("p2Lbl").innerText = p2Char.name;
    document.getElementById("si2_"+p2Char.name).style.display = "flex";
    if (card) card.style.opacity = ".45";
    document.getElementById("turnText").innerText = "⚔ Ready to Battle!";
    const btn = document.getElementById("lockBtn");
    btn.innerText = "▶ Fight!"; btn.onclick = startBattle;
  }
  document.querySelectorAll(".char-card").forEach(c => c.classList.remove("selected"));
  selChar = null;
}

/* ══════════════════════════════════════════════════════════
   ROUND TIMER
══════════════════════════════════════════════════════════ */
let roundTimeLeft = 0, timerInterval = null;
function startTimer() {
  stopTimer();
  roundTimeLeft = settings.roundTime;
  const el = document.getElementById("roundTimer");
  if (!settings.roundTime) { el.classList.add("hidden"); return; }
  el.classList.remove("hidden");
  updateTimerDisplay(roundTimeLeft);
  timerInterval = setInterval(() => {
    if (!gameRunning) { stopTimer(); return; }
    roundTimeLeft--;
    updateTimerDisplay(roundTimeLeft);
    if (roundTimeLeft <= 0) { stopTimer(); handleTimerExpiry(); }
  }, 1000);
}
function stopTimer() { if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } }
function updateTimerDisplay(val) {
  const el = document.getElementById("roundTimerVal"); if (!el) return;
  el.textContent = Math.max(0, val);
  if (val <= 10 && val > 0 && settings.roundTime > 0) el.classList.add("danger");
  else el.classList.remove("danger");
}
function handleTimerExpiry() {
  if (!gameRunning) return; gameRunning = false;
  const winner = p1s.hp > p2s.hp ? p1Char.name : p2s.hp > p1s.hp ? p2Char.name : null;
  setTimeout(() => {
    document.getElementById("winTitle").innerText = winner ? winner + " Wins!" : "Time's Up — Draw!";
    document.getElementById("winSub").innerText   = winner ? "Time's Up!" : "Both fighters survive";
    document.getElementById("winOverlay").classList.add("active");
    document.getElementById("touchControls").style.display = "none";
  }, 300);
}

/* ══════════════════════════════════════════════════════════
   PHYSICS CONSTANTS
══════════════════════════════════════════════════════════ */
const PLAYER_W    = 80;
const PLAYER_H    = 160;
const GRAVITY     = 0.65;
const JUMP_VEL    = -16;
const MOVE_SPEED  = 4.5;
const PUSH_GAP    = 4;
let   GROUND_Y    = 110;
function calcGround() { GROUND_Y = Math.floor(window.innerHeight * 0.12); }
calcGround();
window.addEventListener("resize", () => { calcGround(); resetPositions(); });

/* ══════════════════════════════════════════════════════════
   GAME STATE
══════════════════════════════════════════════════════════ */
const p1s = { x:0, y:0, vy:0, onG:true, prevOnG:true, hp:100, sp:1 };
const p2s = { x:0, y:0, vy:0, onG:true, prevOnG:true, hp:100, sp:1 };

/* localKeys: used by HOST (P1) and LOCAL (both players) */
const localKeys = {};

/* animation state */
const animSt = { f1:{ cur:"a-idle", lockTimer:null }, f2:{ cur:"a-idle", lockTimer:null } };
const atkCD  = { f1:false, f2:false };
let gameRunning = false;

/* ══════════════════════════════════════════════════════════
   ANIMATION HELPERS
══════════════════════════════════════════════════════════ */
const ALL_ANIMS = ["a-idle","a-run","a-jump","a-land","a-light","a-heavy","a-super","a-ultra","a-hit"];
function setAnim(who, cls, lockMs) {
  const el = document.getElementById(who), st = animSt[who];
  if (st.lockTimer) { clearTimeout(st.lockTimer); st.lockTimer = null; }
  ALL_ANIMS.forEach(a => el.classList.remove(a));
  void el.offsetWidth;
  el.classList.add(cls); st.cur = cls;
  if (lockMs > 0) st.lockTimer = setTimeout(() => { st.lockTimer = null; setAnim(who, "a-idle", 0); }, lockMs);
}
function isLocked(who) { return animSt[who].lockTimer !== null; }

/* ══════════════════════════════════════════════════════════
   POSITION HELPERS
══════════════════════════════════════════════════════════ */
function resetPositions() {
  const W = window.innerWidth;
  p1s.x = Math.floor(W*0.2); p1s.y = 0; p1s.vy = 0; p1s.onG = true; p1s.prevOnG = true;
  p2s.x = Math.floor(W*0.75); p2s.y = 0; p2s.vy = 0; p2s.onG = true; p2s.prevOnG = true;
  applyPositions();
}
function applyPositions() {
  const W = window.innerWidth;
  p1s.x = Math.max(0, Math.min(W-PLAYER_W, p1s.x));
  p2s.x = Math.max(0, Math.min(W-PLAYER_W, p2s.x));
  const f1 = document.getElementById("f1"), f2 = document.getElementById("f2");
  f1.style.left   = Math.round(p1s.x)+"px"; f2.style.left   = Math.round(p2s.x)+"px";
  f1.style.bottom = Math.round(GROUND_Y+p1s.y)+"px"; f2.style.bottom = Math.round(GROUND_Y+p2s.y)+"px";
  f1.style.top = "unset"; f2.style.top = "unset";
}

/* ══════════════════════════════════════════════════════════
   PHYSICS
══════════════════════════════════════════════════════════ */
function doJump(ps, who) {
  if (ps.onG) { ps.vy = JUMP_VEL; ps.onG = false; setAnim(who, "a-jump", 350); }
}
function applyGravity(ps) {
  if (!ps.onG) { ps.vy += GRAVITY; ps.y -= ps.vy; if (ps.y <= 0) { ps.y = 0; ps.vy = 0; ps.onG = true; } }
}
let _p1px = 0, _p2px = 0;
function resolveCollision() {
  const W = window.innerWidth, minSep = PLAYER_W + PUSH_GAP;
  const m1 = Math.abs(p1s.x - _p1px) > 0, m2 = Math.abs(p2s.x - _p2px) > 0;
  if (p1s.x <= p2s.x) {
    const ov = p1s.x + minSep - p2s.x;
    if (ov > 0) { if (m1 && !m2) p1s.x -= ov; else if (m2 && !m1) p2s.x += ov; else { p1s.x -= ov/2; p2s.x += ov/2; } }
  } else {
    const ov = p2s.x + minSep - p1s.x;
    if (ov > 0) { if (m1 && !m2) p1s.x += ov; else if (m2 && !m1) p2s.x -= ov; else { p2s.x -= ov/2; p1s.x += ov/2; } }
  }
  p1s.x = Math.max(0, Math.min(W-PLAYER_W, p1s.x));
  p2s.x = Math.max(0, Math.min(W-PLAYER_W, p2s.x));
}

/* ══════════════════════════════════════════════════════════
   COMMON BATTLE INIT
══════════════════════════════════════════════════════════ */
function _initBattleCommon() {
  document.getElementById("f1Spr").src = p1Char.image; document.getElementById("f2Spr").src = p2Char.image;
  document.getElementById("f1Name").innerText   = p1Char.name; document.getElementById("f2Name").innerText   = p2Char.name;
  document.getElementById("p1HBName").innerText = p1Char.name; document.getElementById("p2HBName").innerText = p2Char.name;
  p1s.hp = settings.startHealth; p1s.sp = 1;
  p2s.hp = settings.startHealth; p2s.sp = 1;
  resetPositions(); updateBars();
  setAnim("f1","a-idle",0); setAnim("f2","a-idle",0);
  atkCD.f1 = false; atkCD.f2 = false;
  gameRunning = true;
  // clear all input buffers
  Object.keys(localKeys).forEach(k => { localKeys[k] = false; });
  hostSideGuest.left = false; hostSideGuest.right = false; hostSideGuest.block = false;
  hostSideGuest.jumps = []; hostSideGuest.attacks = [];
  guestLocalInput.left = false; guestLocalInput.right = false; guestLocalInput.block = false;
  guestLocalInput.jumps = []; guestLocalInput.attacks = [];
}

/* ══════════════════════════════════════════════════════════
   LOCAL BATTLE
══════════════════════════════════════════════════════════ */
function startBattle() {
  document.getElementById("onlineBadge").classList.remove("visible");
  go("battleScreen"); _initBattleCommon(); startTimer();
}

/* ══════════════════════════════════════════════════════════
   ONLINE BATTLE
══════════════════════════════════════════════════════════ */
function startBattleNet() {
  if (hostBroadcastInterval) { clearInterval(hostBroadcastInterval); hostBroadcastInterval = null; }
  _initBattleCommon();
  const badge = document.getElementById("onlineBadge");
  badge.classList.add("visible");
  document.getElementById("onlineBadgeText").textContent = netRole === "host" ? "Online · Host (P1)" : "Online · Guest (P2)";

  if (netRole === "host") {
    startTimer();
    // Host broadcasts authoritative state every 50ms (bandwidth-friendly)
    hostBroadcastInterval = setInterval(() => {
      if (!gameRunning || !netConn) return;
      sendNet({
        type:"state",
        p1x:p1s.x, p1y:p1s.y, p1g:p1s.onG, p1hp:p1s.hp, p1sp:p1s.sp,
        p2x:p2s.x, p2y:p2s.y, p2g:p2s.onG, p2hp:p2s.hp, p2sp:p2s.sp,
        timeLeft: roundTimeLeft,
        win: (p1s.hp<=0||p2s.hp<=0) ? (p1s.hp<=0 ? p2Char.name : p1Char.name) : null,
      });
    }, 50);
  } else {
    // Guest shows timer (updated from host packets)
    const timerEl = document.getElementById("roundTimer");
    if (settings.roundTime > 0) { timerEl.classList.remove("hidden"); updateTimerDisplay(settings.roundTime); }
    else timerEl.classList.add("hidden");
    // Guest does NOT set up any send interval here.
    // Input is sent every frame in the rAF loop (gameLoop branch GUEST).
  }

  const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  document.getElementById("touchControls").style.display = touch ? "block" : "none";
  playBattleTheme();
}

function handleNetWin(winnerName) {
  if (!gameRunning) return; gameRunning = false; stopTimer();
  setTimeout(() => {
    document.getElementById("winTitle").innerText = winnerName + " Wins!";
    document.getElementById("winSub").innerText   = "Victory";
    document.getElementById("winOverlay").classList.add("active");
    document.getElementById("touchControls").style.display = "none";
  }, 300);
}

/* ══════════════════════════════════════════════════════════
   CPU AI
══════════════════════════════════════════════════════════ */
function updateCPU() {
  if (!settings.cpu || !gameRunning || netRole) return;
  const diff = document.getElementById("cpuDiff").value;
  const dist = p1s.x - p2s.x, absDist = Math.abs(dist), atkRange = PLAYER_W+PUSH_GAP+60;
  const retChance = diff==="hard"?0.008:diff==="medium"?0.015:0.025;
  const atkChance = diff==="hard"?0.045:diff==="medium"?0.022:0.01;
  localKeys["j"] = false; localKeys["l"] = false;
  if (Math.random() < retChance) { localKeys[dist>0?"j":"l"] = true; return; }
  if (absDist > atkRange) localKeys[dist>0?"l":"j"] = true;
  if (Math.random() < 0.003 && p2s.onG) doJump(p2s,"f2");
  if (absDist < atkRange && Math.random() < atkChance) {
    const r = Math.random();
    if      (r<0.55 && !atkCD.f2)               triggerAtk(2,"light",5);
    else if (r<0.82 && !atkCD.f2)               triggerAtk(2,"heavy",10);
    else if (p2s.sp>=2 && !atkCD.f2) { p2s.sp-=2; triggerAtk(2,"super",25); updateBars(); }
  }
  if (absDist<atkRange && p2s.sp>=3 && Math.random()<0.012 && !atkCD.f2) { p2s.sp=0; triggerAtk(2,"ultra",40); updateBars(); }
}

/* ══════════════════════════════════════════════════════════
   ATTACKS
══════════════════════════════════════════════════════════ */
function triggerAtk(player, type, dmg) {
  const who = "f"+player;
  const ms  = { light:220, heavy:340, super:460, ultra:580 }[type];
  const cls = { light:"a-light", heavy:"a-heavy", super:"a-super", ultra:"a-ultra" }[type];
  atkCD[who] = true;
  setTimeout(() => atkCD[who] = false, ms+60);
  setAnim(who, cls, ms);
  if (type==="super"||type==="ultra") triggerFlash(player, type);
  doAtk(player, dmg, type);
}
function triggerFlash(p, type) {
  const fl = document.getElementById("screenFlash");
  fl.className = type==="ultra" ? "fl-ultra" : p===1 ? "fl-p1" : "fl-p2";
  fl.style.animation = "none"; void fl.offsetWidth;
  fl.style.animation = "sflash .45s ease-out forwards";
}
function spawnFX(x, y, dmg, type) {
  if (!settings.fx) return;
  const bs = document.getElementById("battleScreen");
  const sparks = { light:"✦", heavy:"💥", super:"⚡", ultra:"🌟" };
  const sp = document.createElement("div"); sp.className = "spark"; sp.innerText = sparks[type]||"✦";
  sp.style.left   = x+PLAYER_W/2+"px";
  sp.style.bottom = y+GROUND_Y+PLAYER_H*0.6+"px";
  bs.appendChild(sp); setTimeout(()=>sp.remove(),500);
  const col = {light:"#fff",heavy:"#ffcc44",super:"#00bbff",ultra:"#ff4444"}[type];
  const fz  = {light:"18px",heavy:"22px",super:"26px",ultra:"32px"}[type];
  const num = document.createElement("div"); num.className = "dmg-num";
  num.style.color = col; num.style.fontSize = fz;
  num.style.left  = x+PLAYER_W/2+"px"; num.style.bottom = y+GROUND_Y+PLAYER_H*0.8+"px";
  num.innerText = dmg; bs.appendChild(num); setTimeout(()=>num.remove(),800);
}
function inRange(a, d) {
  return Math.abs(a.x+PLAYER_W/2-(d.x+PLAYER_W/2)) < PLAYER_W+PUSH_GAP+50 && Math.abs(a.y-d.y) < PLAYER_H*0.8;
}
function doAtk(player, dmg, type) {
  const atk = player===1?p1s:p2s, def = player===1?p2s:p1s, defWho = player===1?"f2":"f1";
  if (!inRange(atk, def)) return;
  atk.sp = Math.min(3, atk.sp+0.3);
  // Blocking: host mode — P2 block comes from hostSideGuest.block; local — from localKeys
  const blocking = player===1
    ? (netRole==="host" ? hostSideGuest.block : !!localKeys["k"])
    : !!localKeys["s"];
  if (!blocking) { def.hp -= dmg; setAnim(defWho,"a-hit",250); spawnFX(def.x,def.y,dmg,type); }
  def.hp = Math.max(0, def.hp); p1s.hp = Math.max(0,p1s.hp); p2s.hp = Math.max(0,p2s.hp);
  updateBars(); checkWin();
}

/* ══════════════════════════════════════════════════════════
   BARS & WIN
══════════════════════════════════════════════════════════ */
function updateBars() {
  const mx = settings.startHealth;
  document.getElementById("p1Fill").style.width = Math.max(0, p1s.hp/mx*100)+"%";
  document.getElementById("p2Fill").style.width = Math.max(0, p2s.hp/mx*100)+"%";
  function upS(id,v) { const b=document.getElementById(id).children; for(let i=0;i<3;i++) b[i].classList.toggle("filled",i<Math.floor(v)); }
  upS("p1SR",p1s.sp); upS("p2SR",p2s.sp);
}
function checkWin() {
  if (p1s.hp>0&&p2s.hp>0) return; if (!gameRunning) return;
  gameRunning = false; stopTimer();
  const winner = p1s.hp<=0 ? p2Char.name : p1Char.name;
  setTimeout(() => {
    document.getElementById("winTitle").innerText = winner+" Wins!";
    document.getElementById("winSub").innerText   = "Victory";
    document.getElementById("winOverlay").classList.add("active");
    document.getElementById("touchControls").style.display = "none";
  }, 300);
}
function returnToCS() {
  gameRunning=false; stopTimer();
  document.getElementById("winOverlay").classList.remove("active");
  document.getElementById("onlineBadge").classList.remove("visible");
  if (netRole) destroyNet(); go("characterScreen");
}
function returnToMenu() {
  gameRunning=false; stopTimer();
  document.getElementById("winOverlay").classList.remove("active");
  document.getElementById("onlineBadge").classList.remove("visible");
  if (netRole) destroyNet(); go("mainMenu");
}

/* ══════════════════════════════════════════════════════════
   KEYBOARD INPUT
══════════════════════════════════════════════════════════ */
document.addEventListener("keydown", e => {
  const k = e.key.toLowerCase();
  if (!document.getElementById("battleScreen").classList.contains("active")) return;
  if (["a","d","w","s","j","l","i","k","q","e","z","x","u","o","n","m"].includes(k)) e.preventDefault();

  if (netRole === "guest") {
    // Guest routes held-state to guestLocalInput; one-shots pushed to queues
    if (k==="j") guestLocalInput.left  = true;
    if (k==="l") guestLocalInput.right = true;
    if (k==="k") guestLocalInput.block = true;
    if (k==="i") guestLocalInput.jumps.push(1);
    if (k==="u") guestLocalInput.attacks.push({type:"light"});
    if (k==="o") guestLocalInput.attacks.push({type:"heavy"});
    if (k==="n") guestLocalInput.attacks.push({type:"super"});
    if (k==="m") guestLocalInput.attacks.push({type:"ultra"});
    return;
  }

  // Host P1 or local
  localKeys[k] = true;
  if (k==="w") doJump(p1s,"f1");                       // P1 jump
  if (!netRole && k==="i") doJump(p2s,"f2");           // P2 jump (local only)

  // P1 attacks (host or local)
  if (k==="q" && !atkCD.f1)               triggerAtk(1,"light",5);
  if (k==="e" && !atkCD.f1)               triggerAtk(1,"heavy",10);
  if (k==="z" && p1s.sp>=2 && !atkCD.f1) { p1s.sp-=2; triggerAtk(1,"super",25); updateBars(); }
  if (k==="x" && p1s.sp>=3 && !atkCD.f1) { p1s.sp=0;  triggerAtk(1,"ultra",40); updateBars(); }

  // P2 attacks (local only — online handled via queue)
  if (!netRole) {
    if (k==="u" && !atkCD.f2)               triggerAtk(2,"light",5);
    if (k==="o" && !atkCD.f2)               triggerAtk(2,"heavy",10);
    if (k==="n" && p2s.sp>=2 && !atkCD.f2) { p2s.sp-=2; triggerAtk(2,"super",25); updateBars(); }
    if (k==="m" && p2s.sp>=3 && !atkCD.f2) { p2s.sp=0;  triggerAtk(2,"ultra",40); updateBars(); }
  }
});

document.addEventListener("keyup", e => {
  const k = e.key.toLowerCase();
  localKeys[k] = false;
  if (netRole==="guest") {
    if (k==="j") guestLocalInput.left  = false;
    if (k==="l") guestLocalInput.right = false;
    if (k==="k") guestLocalInput.block = false;
  }
});

/* ══════════════════════════════════════════════════════════
   GAME LOOP — rAF, three mutually-exclusive branches

   GUEST branch also sends input each frame, eliminating
   the 50ms polling lag that caused jerky P2 movement.
══════════════════════════════════════════════════════════ */
function gameLoop() {
  requestAnimationFrame(gameLoop);
  if (!document.getElementById("battleScreen").classList.contains("active")) return;
  if (!gameRunning) return;

  const f1el = document.getElementById("f1"), f2el = document.getElementById("f2");

  /* ── BRANCH A: GUEST ── */
  if (netRole === "guest") {
    // Send input THIS FRAME — no 50ms delay, no missed held-state.
    if (netConn && netConn.open) {
      const jumpCount = guestLocalInput.jumps.length;
      const attacks   = guestLocalInput.attacks.slice();
      sendNet({
        type:    "input",
        left:    guestLocalInput.left,
        right:   guestLocalInput.right,
        block:   guestLocalInput.block,
        jumps:   jumpCount,
        attacks: attacks,
      });
      // Clear one-shot queues AFTER sending
      guestLocalInput.jumps   = [];
      guestLocalInput.attacks = [];
    }

    // Visuals only — host drives all positions
    if (p1s.x < p2s.x) f1el.classList.remove("flip"); else f1el.classList.add("flip");
    if (p2s.x > p1s.x) f2el.classList.add("flip");    else f2el.classList.remove("flip");
    if (!isLocked("f2")) {
      if (!p2s.onG)   { if (animSt.f2.cur!=="a-jump") setAnim("f2","a-jump",0); }
      else { const w=(guestLocalInput.left||guestLocalInput.right)?"a-run":"a-idle"; if(animSt.f2.cur!==w) setAnim("f2",w,0); }
    }
    if (!isLocked("f1")) {
      const w = !p1s.onG ? "a-jump" : "a-idle"; if (animSt.f1.cur!==w) setAnim("f1",w,0);
    }
    return;
  }

  /* ── BRANCH B: HOST ── */
  if (netRole === "host") {
    _p1px = p1s.x; _p2px = p2s.x;

    // P1 movement (host local keys)
    if (localKeys["a"]) p1s.x -= MOVE_SPEED;
    if (localKeys["d"]) p1s.x += MOVE_SPEED;

    // P2 movement (from hostSideGuest, written by onNetData)
    if (hostSideGuest.left)  p2s.x -= MOVE_SPEED;
    if (hostSideGuest.right) p2s.x += MOVE_SPEED;

    // P2 queued jumps — drain all
    while (hostSideGuest.jumps.length > 0) {
      hostSideGuest.jumps.shift();
      doJump(p2s, "f2");
    }

    // P2 queued attacks — drain all
    while (hostSideGuest.attacks.length > 0) {
      const atk = hostSideGuest.attacks.shift();
      if (atkCD.f2) continue;
      if      (atk.type==="light")               triggerAtk(2,"light",5);
      else if (atk.type==="heavy")               triggerAtk(2,"heavy",10);
      else if (atk.type==="super" && p2s.sp>=2)  { p2s.sp-=2; triggerAtk(2,"super",25); updateBars(); }
      else if (atk.type==="ultra" && p2s.sp>=3)  { p2s.sp=0;  triggerAtk(2,"ultra",40); updateBars(); }
    }

    applyGravity(p1s); applyGravity(p2s);
    resolveCollision(); applyPositions();

    if (!p1s.prevOnG && p1s.onG && !isLocked("f1")) setAnim("f1","a-land",180);
    if (!p2s.prevOnG && p2s.onG && !isLocked("f2")) setAnim("f2","a-land",180);
    p1s.prevOnG = p1s.onG; p2s.prevOnG = p2s.onG;

    if (!isLocked("f1")) {
      if (!p1s.onG) { if(animSt.f1.cur!=="a-jump") setAnim("f1","a-jump",0); }
      else { const w=(localKeys["a"]||localKeys["d"])?"a-run":"a-idle"; if(animSt.f1.cur!==w) setAnim("f1",w,0); }
    }
    if (!isLocked("f2")) {
      if (!p2s.onG) { if(animSt.f2.cur!=="a-jump") setAnim("f2","a-jump",0); }
      else { const w=(hostSideGuest.left||hostSideGuest.right)?"a-run":"a-idle"; if(animSt.f2.cur!==w) setAnim("f2",w,0); }
    }
    if (p1s.x<p2s.x) f1el.classList.remove("flip"); else f1el.classList.add("flip");
    if (p2s.x>p1s.x) f2el.classList.add("flip");    else f2el.classList.remove("flip");
    return;
  }

  /* ── BRANCH C: LOCAL ── */
  updateCPU();
  _p1px = p1s.x; _p2px = p2s.x;

  if (localKeys["a"]) p1s.x -= MOVE_SPEED;
  if (localKeys["d"]) p1s.x += MOVE_SPEED;
  if (localKeys["j"]) p2s.x -= MOVE_SPEED;
  if (localKeys["l"]) p2s.x += MOVE_SPEED;

  applyGravity(p1s); applyGravity(p2s);
  resolveCollision(); applyPositions();

  if (!p1s.prevOnG && p1s.onG && !isLocked("f1")) setAnim("f1","a-land",180);
  if (!p2s.prevOnG && p2s.onG && !isLocked("f2")) setAnim("f2","a-land",180);
  p1s.prevOnG = p1s.onG; p2s.prevOnG = p2s.onG;

  if (!isLocked("f1")) {
    if (!p1s.onG) { if(animSt.f1.cur!=="a-jump") setAnim("f1","a-jump",0); }
    else { const w=(localKeys["a"]||localKeys["d"])?"a-run":"a-idle"; if(animSt.f1.cur!==w) setAnim("f1",w,0); }
  }
  if (!isLocked("f2")) {
    if (!p2s.onG) { if(animSt.f2.cur!=="a-jump") setAnim("f2","a-jump",0); }
    else { const w=(localKeys["j"]||localKeys["l"])?"a-run":"a-idle"; if(animSt.f2.cur!==w) setAnim("f2",w,0); }
  }
  if (p1s.x<p2s.x) f1el.classList.remove("flip"); else f1el.classList.add("flip");
  if (p2s.x>p1s.x) f2el.classList.add("flip");    else f2el.classList.remove("flip");
}

requestAnimationFrame(gameLoop);

/* ══════════════════════════════════════════════════════════
   TOUCH CONTROLS
══════════════════════════════════════════════════════════ */
function bindHold(id, onFn, offFn) {
  const btn = document.getElementById(id); if (!btn) return;
  btn.addEventListener("touchstart",  e => { e.preventDefault(); e.stopPropagation(); onFn();  }, {passive:false});
  btn.addEventListener("touchend",    e => { e.preventDefault(); e.stopPropagation(); offFn(); }, {passive:false});
  btn.addEventListener("touchcancel", e => { e.preventDefault(); e.stopPropagation(); offFn(); }, {passive:false});
}
function bindTap(id, fn) {
  const btn = document.getElementById(id); if (!btn) return;
  btn.addEventListener("touchstart", e => { e.preventDefault(); e.stopPropagation(); fn(); }, {passive:false});
}

// P1 movement — always local
bindHold("tb_p1l", ()=>{localKeys["a"]=true;},  ()=>{localKeys["a"]=false;});
bindHold("tb_p1r", ()=>{localKeys["d"]=true;},  ()=>{localKeys["d"]=false;});
bindTap ("tb_p1u", ()=>doJump(p1s,"f1"));

// P2 movement — route to guestLocalInput if guest, otherwise local
bindHold("tb_p2l",
  ()=>{ if(netRole==="guest") guestLocalInput.left =true;  else localKeys["j"]=true;  },
  ()=>{ if(netRole==="guest") guestLocalInput.left =false; else localKeys["j"]=false; }
);
bindHold("tb_p2r",
  ()=>{ if(netRole==="guest") guestLocalInput.right=true;  else localKeys["l"]=true;  },
  ()=>{ if(netRole==="guest") guestLocalInput.right=false; else localKeys["l"]=false; }
);
bindTap("tb_p2u", ()=>{
  if (netRole==="guest") guestLocalInput.jumps.push(1);
  else doJump(p2s,"f2");
});

// P1 attacks
bindTap("tb_p1q", ()=>{ if(!atkCD.f1) triggerAtk(1,"light",5); });
bindTap("tb_p1e", ()=>{ if(!atkCD.f1) triggerAtk(1,"heavy",10); });
bindTap("tb_p1z", ()=>{ if(p1s.sp>=2&&!atkCD.f1){p1s.sp-=2;triggerAtk(1,"super",25);updateBars();} });
bindTap("tb_p1x", ()=>{ if(p1s.sp>=3&&!atkCD.f1){p1s.sp=0; triggerAtk(1,"ultra",40);updateBars();} });

// P2 attacks — queue if guest, direct if local
bindTap("tb_p2u2", ()=>{ if(netRole==="guest") guestLocalInput.attacks.push({type:"light"}); else if(!atkCD.f2) triggerAtk(2,"light",5); });
bindTap("tb_p2o",  ()=>{ if(netRole==="guest") guestLocalInput.attacks.push({type:"heavy"}); else if(!atkCD.f2) triggerAtk(2,"heavy",10); });
bindTap("tb_p2n",  ()=>{ if(netRole==="guest") guestLocalInput.attacks.push({type:"super"}); else if(p2s.sp>=2&&!atkCD.f2){p2s.sp-=2;triggerAtk(2,"super",25);updateBars();} });
bindTap("tb_p2m",  ()=>{ if(netRole==="guest") guestLocalInput.attacks.push({type:"ultra"}); else if(p2s.sp>=3&&!atkCD.f2){p2s.sp=0; triggerAtk(2,"ultra",40);updateBars();} });

/* ══════════════════════════════════════════════════════════
   FPS COUNTER
══════════════════════════════════════════════════════════ */
let fpsF = 0, fpsL = performance.now();
(function fpsLoop() {
  fpsF++;
  const now = performance.now();
  if (now-fpsL >= 1000) { document.getElementById("fpsCounter").textContent = "FPS: "+fpsF; fpsF=0; fpsL=now; }
  requestAnimationFrame(fpsLoop);
})();
