addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

/* CONFIG */
const SITE_TITLE = "LLC Creative Technologies"
const LOGO_URL = "https://image2url.com/r2/default/gifs/1771931447321-b9c0bd19-ff5c-4d39-8d0a-06b9ab79821e.gif"
const BG_AUDIO_URL = "https://image2url.com/r2/default/audio/1771931706652-c6c30957-9354-46ef-869b-339a6e020cf6.mp3"
// the Globan dashboard audio (plays once)
const GLOBAN_DASH_AUDIO = "https://image2url.com/r2/default/audio/1772110775520-55e0902b-b85b-46e2-80e0-a5ff971dda44.m4a"
const THE_HUB_INVITE = "https://t.me/+7AcFN8RMcnc5N2U1"
const GLOBAN_BOT_INVITE = "https://t.me/globanllcbot_bot"
const ANONYCHAT_INVITE = "https://t.me/anonychatllc_bot/anonychatllc"
const ANONYCHAT_AUDIO_URL = "https://image2url.com/r2/default/audio/1772026713893-31ad5447-91c0-4842-8c51-b03c2331cf60.m4a"
const KV_KEY = "views"
/* end config */

/* registered groups list for Globan dashboard */
const GLOBAN_GROUPS = [
  "• ⌜💘⌟ 𝓐𝓯𝓪𝓶𝐇𝐔�NT𝐄𝐑𝐙",
  "• ⌜⌟ 𝐓𝐀𝐌🫟𝐃𝓮𝓻𝓸 ᴘʀᴇᴍɪᴜᴍ",
  "• ⌜️🏆⌟ 𝐕𝐀𝐑𝐒𝐈𝐓𝐘 ᴘʜ",
  "• [ 𝗧𝗔𝗠𝗕𝗔𝗬𝗔𝗡 𝗡𝗚 𝗠𝗚𝗔 𝗕𝗔𝗗𝗜𝗡𝗚 ]",
  "• 𝐂𝐚𝐦𝐩𝐮𝐬 𝐨𝐟 𝐆𝐨𝐝𝐝𝐞𝐬𝐬",
  "• 🅦 𝙷𝙸𝙳𝙴𝙾𝚄𝚃",
  "• 🇹𝖍𝖊 🇭✧🇴✧🇰",
  "• 𝕱𝖀𝕭𝖀 | 𝐅𝐮𝐧 𝐁𝐮𝐝𝐝𝐲",
  "• 𝐍𝐀𝐍𝐍𝐎'𝐒 𝐒𝐀𝐍𝐂𝐓𝐔𝐀𝐑𝐘",
  "• 𝑯𝑶𝑹𝑵𝒀 𝑪𝑰𝑻𝒀",
  "• 『 𝐂𝐇𝐀𝐓 𝐍' 𝐂𝐇𝐈𝐋𝐋 』",
  "• 『 𝗞𝗔𝗟𝗔𝗧 𝗚𝗔𝗟𝗟𝗘𝗥𝗜𝗔 』",
  "• 𝙎𝙖𝙣𝙜’𝙜𝙧𝙚 𝙇𝙪𝙭𝙚 𝙎𝙤𝙘𝙞𝙚𝙩𝙮🦋",
  "• ☬Ë™️|☞Escape The Mercy☜",
  "• ⌜⌟ 𝐓𝐀𝐌🫟𝐃𝓮𝓻𝓸 ғʀᴇᴇᴍɪᴜᴍ",
  "• 《◇TROPAPIP'Z 8.O◇》",
  "• Music jam",
  "• 『 𝗦𝗔𝗡𝗚𝗚𝗨𝗡𝗜𝗔𝗡𝗚 𝗞𝗔𝗟𝗜𝗕𝗨𝗚𝗔𝗡 』",
  "• 『 𝑻𝒉𝒆 𝑨𝒓𝒄𝒉𝒊𝒗𝒆𝒔 』",
  "• Pinoy Bi Hub"
]

let fallbackViews = 0

async function getAndIncrementViews() {
  try {
    if (typeof VIEWS_KV !== "undefined" && VIEWS_KV !== null) {
      const cur = await VIEWS_KV.get(KV_KEY)
      const n = cur ? parseInt(cur, 10) : 0
      const next = n + 1
      await VIEWS_KV.put(KV_KEY, String(next))
      return next
    }
  } catch (e) {
    // KV not available -> fallback
  }
  fallbackViews = fallbackViews + 1
  return fallbackViews
}

function responseHTML(html) {
  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store, private, max-age=0"
    }
  })
}

async function handleRequest(request) {
  const url = new URL(request.url)
  const path = (url.pathname || "/").replace(/\/+$/, "") || "/"
  // increment views for main page only
  const views = await getAndIncrementViews()

  if (path === "/globan") {
    // Globan dashboard (plays dashboard M4A once — no loop)
    const groupsHtml = GLOBAN_GROUPS.map(g => `<li>${escapeHtml(g)}</li>`).join("\n")
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHtml(SITE_TITLE)} — Globan Dashboard</title>
<meta name="theme-color" content="#000"/>
<style>
:root{--bg:#000;--fg:#fff;--muted:rgba(255,255,255,0.85);--accent:#ff6b6b}
html,body{height:100%;margin:0;background:var(--bg);color:var(--fg);font-family:Inter,system-ui,Arial,sans-serif;-webkit-font-smoothing:antialiased; -webkit-touch-callout: none; -webkit-user-select: none;}
.wrap{min-height:100vh;display:flex;flex-direction:column;gap:18px;align-items:center;padding:22px;box-sizing:border-box;}
.top{display:flex;gap:12px;align-items:center;width:100%;max-width:980px}
.logo{width:72px;height:72px;border-radius:12px;object-fit:cover;border:0}
.headerTitle{font-weight:800;font-size:18px}
.subtitle{color:var(--muted);font-size:13px}
.content{width:100%;max-width:980px;background:rgba(255,255,255,0.02);padding:16px;border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,0.6)}
.groups{list-style:none;margin:12px 0 0 0;padding:0;display:flex;flex-direction:column;gap:8px;font-weight:700}
.groups li{padding:10px;border-radius:8px;background:rgba(255,255,255,0.02);font-size:15px}
.actions{display:flex;gap:12px;align-items:center;justify-content:flex-end}
.btn{background:linear-gradient(90deg,#ffd0d0,#ff6b6b);color:#04121b;padding:10px 14px;border-radius:12px;border:0;font-weight:800;cursor:pointer}
.btn.secondary{background:transparent;border:1px solid rgba(255,255,255,0.06);color:var(--muted)}
.footer{margin-top:8px;font-size:12px;color:rgba(255,255,255,0.6);text-align:center}
@media(max-width:520px){.top{gap:10px}.headerTitle{font-size:16px}}
</style>
</head>
<body>
<main class="wrap" id="globanWrap" role="main">
  <div class="top">
    <img class="logo" src="${escapeHtml(LOGO_URL)}" alt="logo">
    <div>
      <div class="headerTitle">Globan Dashboard</div>
      <div class="subtitle">Registered groups — preview</div>
    </div>
  </div>

  <section class="content" aria-label="registered groups">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:12px">
      <div>
        <div style="font-weight:800;font-size:16px">Registered Groups</div>
        <div style="font-size:13px;color:var(--muted)">Total: ${GLOBAN_GROUPS.length}</div>
      </div>

      <div class="actions">
        <button id="continueBtn" class="btn" aria-label="Continue to bot">Continue to bot (Telegram)</button>
        <button id="backBtn" class="btn secondary" aria-label="Back">Back</button>
      </div>
    </div>

    <ul class="groups" role="list">
      ${groupsHtml}
    </ul>

    <div class="footer">Powered by L © 2026 LLC Tech Corporation</div>
  </section>
</main>

<!-- dashboard audio: plays once (no loop) -->
<audio id="globanAudio" preload="auto" playsinline>
  <source src="${escapeHtml(GLOBAN_DASH_AUDIO)}" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>

<script>
  // prevent long-press contextmenu / selection
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('touchstart', e => { /* allow gestures but prevent default long-press menu on some devices */ }, { passive:true });
  document.documentElement.style.webkitTouchCallout = 'none';
  document.documentElement.style.webkitUserSelect = 'none';

  // try to play dashboard audio once (no loop). navigation to here is a user gesture so it should usually start.
  const dash = document.getElementById('globanAudio');
  async function tryPlayDash() {
    try {
      dash.muted = false;
      await dash.play();
    } catch (err) {
      // if blocked, attach single gesture listener
      const handler = () => { dash.play().catch(()=>{}); document.removeEventListener('pointerdown', handler); };
      document.addEventListener('pointerdown', handler, { once:true, passive:true });
    }
  }
  window.addEventListener('load', tryPlayDash);

  // Continue button: open Telegram in a new tab/window (use JS so it isn't an anchor that long-press reveals easily)
  document.getElementById('continueBtn').addEventListener('click', () => {
    // open in new tab/window
    try { window.open(${JSON.stringify(GLOBAN_BOT_INVITE)}, '_blank', 'noopener'); } catch (e) { window.location.href = ${JSON.stringify(GLOBAN_BOT_INVITE)}; }
  });

  // Back button: go back to homepage
  document.getElementById('backBtn').addEventListener('click', () => {
    // pause dash audio
    try { dash.pause(); } catch(e){}
    window.location.href = '/';
  });

  // Block long press reveal attempts on this page
  ['mouseup','mousedown','touchstart','touchend','contextmenu'].forEach(evt => {
    document.addEventListener(evt, e => { /* noop to consume */ }, { passive:true });
  });

  // also disable selection via keyboard
  document.addEventListener('selectstart', e => e.preventDefault());
</script>
</body>
</html>`
    return responseHTML(html)
  }

  // Default: main page
  const mainHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"/>
<title>${escapeHtml(SITE_TITLE)}</title>
<meta name="theme-color" content="#000"/>
<style>
:root{--bg:#000;--fg:#fff;--muted:rgba(255,255,255,0.8);--gray:#9aa0a6}
*{box-sizing:border-box}
html,body{height:100%;margin:0;background:var(--bg);color:var(--fg);font-family:Inter,system-ui,Arial,sans-serif;-webkit-font-smoothing:antialiased; -webkit-touch-callout:none; -webkit-user-select:none;}
.wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;text-align:center;position:relative;overflow:hidden;}
.logo{width:280px;max-width:78%;height:auto;display:block;border:0;margin:0 auto;}
.title{margin-top:12px;font-weight:700;font-size:20px;letter-spacing:0.6px;}
.meta{margin-top:6px;font-size:13px;color:var(--muted);}

.sections{margin-top:18px;display:flex;flex-direction:column;gap:18px;align-items:center;width:100%;}
.section{width:100%;max-width:420px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;}
.section h3{margin:0;font-size:14px;color:var(--muted);text-transform:lowercase;letter-spacing:0.6px;}
.list{width:100%;background:rgba(255,255,255,0.02);padding:10px 12px;border-radius:10px;display:flex;flex-direction:column;gap:8px;align-items:center;}
.btnlink{ appearance:none; border:0; background:rgba(255,255,255,0.02); color:var(--fg); font-weight:800; font-size:15px; padding:10px; border-radius:8px; width:100%; max-width:320px; text-align:center; cursor:pointer; -webkit-user-select:none; touch-action:manipulation; }

.bot-gradient-1{ background:linear-gradient(270deg,#fff,#ff1f1f,#fff); background-size:600% 600%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:slide1 4s linear infinite; text-shadow:0 0 6px rgba(255,30,30,0.8); }
.bot-gradient-2{ background:linear-gradient(270deg,#a855f7,#3b82f6,#fb7185,#a855f7); background-size:600% 600%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:slide2 5s linear infinite; }
@keyframes slide1{0%{background-position:100% 50%}100%{background-position:0% 50%}} @keyframes slide2{0%{background-position:100% 50%}100%{background-position:0% 50%}}

.thehub{font-weight:800;font-size:18px;padding:8px 12px;border-radius:999px;cursor:pointer;animation:floatY 3.6s ease-in-out infinite}
@keyframes floatY{0%{transform:translateY(0)}50%{transform:translateY(-10px)}100%{transform:translateY(0)}}
.gc-glow{background:linear-gradient(90deg,#fff,#ff1f1f);-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:glowShift 2.4s linear infinite;text-shadow:0 0 30px rgba(255,80,80,0.9)}
@keyframes glowShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

.anony{font-weight:800;font-size:18px;cursor:pointer;padding:8px 12px;border-radius:8px;animation:jump 1.2s ease-in-out infinite}
@keyframes jump{0%{transform:translateY(0)}25%{transform:translateY(-8px)}50%{transform:translateY(0)}75%{transform:translateY(-4px)}100%{transform:translateY(0)}}

.modal{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%) scale(0.96);background:rgba(10,10,10,0.96);color:#fff;padding:18px 22px;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,0.6);opacity:0;pointer-events:none;transition:opacity 350ms ease, transform 350ms ease;z-index:2000;text-align:center}
.modal.show{opacity:1;pointer-events:auto;transform:translate(-50%,-50%) scale(1)} .modal.hide{opacity:0;pointer-events:none;transform:translate(-50%,-50%) scale(0.96)}

.fade-overlay{position:fixed;inset:0;background:#000;opacity:0;pointer-events:none;transition:opacity 900ms ease;z-index:3000}.fade-overlay.visible{opacity:1;pointer-events:auto}
.rainer{pointer-events:none;position:fixed;inset:0;overflow:hidden;z-index:999}
.th{position:absolute;top:-10%;left:0;font-weight:800;color:rgba(255,255,255,0.95);text-shadow:0 2px 8px rgba(0,0,0,0.6);animation:fall linear forwards;user-select:none;-webkit-user-select:none}
@keyframes fall{to{transform:translateY(120vh) rotate(720deg);opacity:0}}

.info-row{position:fixed;left:0;right:0;bottom:38px;display:flex;justify-content:space-between;align-items:center;padding:0 18px;box-sizing:border-box;font-size:13px;color:var(--muted);max-width:1100px;margin:0 auto}
.pill{background:rgba(255,255,255,0.02);padding:8px 12px;border-radius:999px}
.footer{position:fixed;bottom:10px;font-size:12px;opacity:0.6;width:100%;text-align:center;left:0}

.landscape-overlay{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.92);color:#fff;font-size:30px;font-weight:900;text-align:center;z-index:4000;opacity:0;pointer-events:none;transition:opacity 200ms ease}
.landscape-overlay.show{opacity:1;pointer-events:auto}

@media(min-width:520px){.logo{width:320px}}
</style>
</head>
<body>
<main class="wrap" role="main" aria-label="${escapeHtml(SITE_TITLE)}">
  <img id="logo" class="logo" src="${escapeHtml(LOGO_URL)}" alt="${escapeHtml(SITE_TITLE)} logo">
  <div class="title">${escapeHtml(SITE_TITLE)}</div>
  <div class="meta">We create Tech</div>

  <div class="sections" aria-hidden="false">
    <div class="section">
      <h3>our bots</h3>
      <div class="list">
        <!-- Buttons instead of anchors to avoid long-press reveal -->
        <button id="globanBtn" class="btnlink bot-gradient-1" aria-label="@globanllcbot_bot">@globanllcbot_bot</button>
        <button id="funmatchBtn" class="btnlink bot-gradient-2" aria-label="@funmatchjrllc_bot">@funmatchjrllc_bot</button>
      </div>
    </div>

    <div class="section">
      <h3>our gc's</h3>
      <div class="list">
        <button id="theHubBtn" class="btnlink thehub gc-glow" aria-label="The Hub">The Hub</button>
      </div>
    </div>

    <div class="section">
      <h3>our Other website</h3>
      <div class="list">
        <button id="funtify" class="btnlink" aria-label="funtify">funtify</button>
        <button id="anonychat" class="btnlink anony" aria-label="anonychat">anonychat</button>
      </div>
    </div>
  </div>

  <div id="rainer" class="rainer" aria-hidden="true"></div>

  <div id="modal" class="modal hide" role="dialog" aria-modal="true" aria-hidden="true">Currently not available</div>
  <div id="fadeOverlay" class="fade-overlay" aria-hidden="true"></div>
  <div id="landOverlay" class="landscape-overlay" aria-hidden="true">no fucking landscape!</div>
</main>

<div class="info-row" aria-hidden="false">
  <div class="pill" id="timeBox">${new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila", hour12:true, year:'numeric', month:'long', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' })}</div>
  <div class="pill">👁 ${views}</div>
</div>

<div class="footer">Powered by L © 2026 LLC Tech Corporation</div>

<!-- background audio (looping) -->
<audio id="bgAudio" autoplay loop playsinline preload="auto" crossorigin="anonymous">
  <source src="${escapeHtml(BG_AUDIO_URL)}" type="audio/mpeg">
</audio>

<script>
  // Block page-level context menu and selection to reduce long-press reveal
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('selectstart', e => e.preventDefault());
  document.documentElement.style.webkitTouchCallout = 'none';
  document.documentElement.style.webkitUserSelect = 'none';

  // Update Manila time
  function updateTimeDisplay() {
    const opts = { timeZone: 'Asia/Manila', hour12: true, year:'numeric', month:'long', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' };
    document.getElementById('timeBox').textContent = new Date().toLocaleString('en-PH', opts);
  }
  setInterval(updateTimeDisplay,1000);
  updateTimeDisplay();

  // Background audio autoplay best-effort
  const bgAudio = document.getElementById('bgAudio');
  async function tryPlayBg() {
    try { bgAudio.muted = false; await bgAudio.play(); return true; }
    catch (e) { return false; }
  }
  window.addEventListener('load', async () => {
    const ok = await tryPlayBg();
    if (!ok) {
      function startOnGesture() { bgAudio.play().catch(()=>{}); removeListeners(); }
      function removeListeners() {
        document.removeEventListener('pointerdown', startOnGesture);
        document.removeEventListener('touchstart', startOnGesture);
        document.removeEventListener('click', startOnGesture);
      }
      document.addEventListener('pointerdown', startOnGesture, { once:true, passive:true });
      document.addEventListener('touchstart', startOnGesture, { once:true, passive:true });
      document.addEventListener('click', startOnGesture, { once:true, passive:true });
    }
  });

  // Helper that prevents long-press reveal on target by using JS navigation and pausing bg audio
  function safeNavigate(targetUrl) {
    try { bgAudio.pause(); } catch (e) {}
    // small delay to ensure audio pauses before navigation
    setTimeout(()=> { window.location.href = targetUrl; }, 80);
  }

  // Globan button: navigate to internal dashboard /globan via JS (not anchor)
  const globanBtn = document.getElementById('globanBtn');
  globanBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // Pause bg audio and navigate. This click is a user gesture so the dashboard audio should play.
    try { bgAudio.pause(); } catch(e){}
    window.location.href = '/globan';
  }, { passive:false });

  // Funmatch button: open external telegram in new tab using JS to avoid anchor long-press
  const funmatchBtn = document.getElementById('funmatchBtn');
  funmatchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    try { window.open('https://t.me/funmatchjrllc_bot', '_blank', 'noopener'); } catch (err) { window.location.href = 'https://t.me/funmatchjrllc_bot'; }
  }, { passive:false });

  // The Hub button: open invite in new tab; also trigger hub animation/rain (same as before)
  const theHubBtn = document.getElementById('theHubBtn');
  theHubBtn.addEventListener('click', (e) => {
    e.preventDefault();
    // spawn same TH effect as before
    const rainer = document.getElementById('rainer');
    function createTH() {
      const el = document.createElement('div'); el.className='th'; el.textContent='TH';
      const startX = Math.random()*100; el.style.left = startX + 'vw';
      const size = 18 + Math.random()*36; el.style.fontSize = size + 'px';
      const rot = Math.random()*360; el.style.transform = 'rotate(' + rot + 'deg)';
      const duration = 3500 + Math.random()*3200; el.style.animationDuration = duration + 'ms';
      el.style.color = 'rgba(255,255,255,' + (0.9 - Math.random()*0.4) + ')';
      rainer.appendChild(el); el.addEventListener('animationend', ()=> el.remove());
    }
    // small burst
    for (let i=0;i<24;i++) setTimeout(createTH, i*30 + Math.random()*120);
    // open invite in new tab (JS) after a tiny delay
    setTimeout(()=> {
      try { window.open(${JSON.stringify(THE_HUB_INVITE)}, '_blank', 'noopener'); } catch (err) { window.location.href = ${JSON.stringify(THE_HUB_INVITE)}; }
    }, 220);
  }, { passive:false });

  // funtify popup (fade in/out)
  const funtifyBtn = document.getElementById('funtify');
  const modal = document.getElementById('modal');
  function showModal(msg, duration=1800) {
    modal.textContent = msg;
    modal.classList.remove('hide'); modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    setTimeout(()=> { modal.classList.remove('show'); modal.classList.add('hide'); modal.setAttribute('aria-hidden','true'); }, duration);
  }
  funtifyBtn && funtifyBtn.addEventListener('click', (e)=> { e.preventDefault(); showModal('Currently not available'); }, { passive:false });
  funtifyBtn && funtifyBtn.addEventListener('keydown', (ev)=> { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); showModal('Currently not available'); } });

  // anonychat: play redirect audio (M4A) and fade & redirect when audio plays/ends
  const anonyBtn = document.getElementById('anonychat');
  const fadeOverlay = document.getElementById('fadeOverlay');
  async function startAnonySequence() {
    anonyBtn.style.pointerEv
