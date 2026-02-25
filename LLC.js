addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

/* CONFIG */
const SITE_TITLE = "LLC Creative Technologies"
const LOGO_URL = "https://image2url.com/r2/default/gifs/1771931447321-b9c0bd19-ff5c-4d39-8d0a-06b9ab79821e.gif"
const AUDIO_URL = "https://image2url.com/r2/default/audio/1771931706652-c6c30957-9354-46ef-869b-339a6e020cf6.mp3"
const THE_HUB_INVITE = "https://t.me/+7AcFN8RMcnc5N2U1"
const KV_KEY = "views"
/* end config */

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

async function handleRequest(request) {
  if (request.method !== "GET") return new Response(null, { status: 405 })

  const views = await getAndIncrementViews()

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
<title>${escapeHtml(SITE_TITLE)}</title>
<meta name="theme-color" content="#000000" />
<style>
  :root{ --bg:#000; --fg:#fff; --muted:rgba(255,255,255,0.8); --gray:#9aa0a6; }
  html,body{height:100%;margin:0;background:var(--bg);color:var(--fg);font-family:Inter,system-ui,Arial,sans-serif;-webkit-font-smoothing:antialiased;}
  .wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;text-align:center;position:relative;overflow:hidden;}
  img.logo{width:280px;max-width:78%;height:auto;display:block;border:0;margin:0;}
  .title{margin-top:12px;font-weight:700;font-size:20px;letter-spacing:0.6px;}
  .meta{margin-top:6px;font-size:13px;color:var(--muted);}

  /* sections format */
  .sections{margin-top:18px;display:flex;flex-direction:column;gap:18px;align-items:center;}
  .section{width:100%;max-width:420px;text-align:left;}
  .section h3{margin:0 0 8px 0;font-size:14px;color:var(--muted);text-transform:lowercase;letter-spacing:0.6px}
  .list{background:rgba(255,255,255,0.02);padding:10px 12px;border-radius:10px;display:flex;flex-direction:column;gap:8px;}
  .link{color:var(--fg);text-decoration:none;font-weight:700;font-size:15px;display:inline-block;}

  /* bot animations */
  .bot1{background:linear-gradient(270deg,#ffffff,#ff1f1f,#ffffff);background-size:600% 600%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:slide 4s linear infinite;text-shadow:0 0 6px rgba(255,30,30,0.8);}
  .bot2{background:linear-gradient(270deg,#a855f7,#3b82f6,#fb7185,#a855f7);background-size:600% 600%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:slide 5s linear infinite;}
  @keyframes slide{0%{background-position:100% 50%}100%{background-position:0% 50%}}

  /* The Hub float & glow */
  .thehub{font-weight:800;font-size:18px;display:inline-block;padding:8px 12px;border-radius:999px;cursor:pointer;animation:floatY 3.6s ease-in-out infinite;}
  @keyframes floatY {0%{transform:translateY(0px)}50%{transform:translateY(-10px)}100%{transform:translateY(0px)}}
  .gc-glow{background:linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,0,0,0.85));-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:glowShift 2.4s linear infinite;text-shadow:0 0 30px rgba(255,80,80,0.9),0 0 60px rgba(255,60,60,0.6);}
  @keyframes glowShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

  /* our Other website (funtify) */
  .other-site{font-weight:800;font-size:18px;cursor:pointer;color:var(--fg);display:inline-block;padding:8px 12px;border-radius:8px;}

  /* popup for currently not available */
  .modal {
    position:fixed; left:50%; top:50%; transform:translate(-50%,-50%); background:rgba(10,10,10,0.96); color:#fff; padding:18px 22px; border-radius:12px; box-shadow:0 20px 60px rgba(0,0,0,0.6); opacity:0; pointer-events:none; transition: opacity 350ms ease, transform 350ms ease; z-index:2000;
  }
  .modal.show { opacity:1; pointer-events:auto; transform:translate(-50%,-50%) scale(1); }
  .modal.hide { opacity:0; pointer-events:none; transform:translate(-50%,-50%) scale(0.96); }

  /* rainer TH */
  .rainer{pointer-events:none;position:fixed;inset:0;overflow:hidden;z-index:999;}
  .th{position:absolute;top:-10%;left:0;font-weight:800;color:rgba(255,255,255,0.95);text-shadow:0 2px 8px rgba(0,0,0,0.6);animation:fall linear forwards;user-select:none;-webkit-user-select:none;}
  @keyframes fall{to{transform:translateY(120vh) rotate(720deg);opacity:0}}

  .info-row{ position:fixed; left:0; right:0; bottom:38px; display:flex; justify-content:space-between; align-items:center; padding:0 18px; box-sizing:border-box; font-size:13px; color:var(--muted); max-width:1100px; margin:0 auto; }
  .pill{ background: rgba(255,255,255,0.02); padding:8px 12px; border-radius:999px; }
  .footer{ position:fixed; bottom:10px; font-size:12px; opacity:0.6; width:100%; text-align:center; left:0; }

  @media(min-width:520px){ img.logo{ width:320px } }
</style>
</head>
<body>
  <main class="wrap" role="main" aria-label="${escapeHtml(SITE_TITLE)}">
    <img id="logo" class="logo" src="${escapeHtml(LOGO_URL)}" alt="${escapeHtml(SITE_TITLE)} logo">
    <div class="title">${escapeHtml(SITE_TITLE)}</div>
    <div class="meta">We create Tech</div>

    <div class="sections">
      <!-- our bots -->
      <div class="section">
        <h3>our bots</h3>
        <div class="list">
          <a class="link bot1" href="https://t.me/globanllcbot_bot" target="_blank" rel="noopener noreferrer">@globanllcbot_bot</a>
          <a class="link bot2" href="https://t.me/funmatchjrllc_bot" target="_blank" rel="noopener noreferrer">@funmatchjrllc_bot</a>
        </div>
      </div>

      <!-- our gc's -->
      <div class="section">
        <h3>our gc's</h3>
        <div class="list">
          <!-- The Hub visible text; href uses invite -->
          <a id="theHub" class="thehub gc-glow" href="${escapeHtml(THE_HUB_INVITE)}" target="_blank" rel="noopener noreferrer">The Hub</a>
        </div>
      </div>

      <!-- our Other website -->
      <div class="section">
        <h3>our Other website</h3>
        <div class="list">
          <!-- funtify clickable (shows popup) -->
          <span id="funtify" class="other-site" tabindex="0">funtify</span>
        </div>
      </div>
    </div>

    <div id="rainer" class="rainer" aria-hidden="true"></div>

    <!-- modal -->
    <div id="modal" class="modal hide" role="dialog" aria-modal="true" aria-hidden="true">Currently not available</div>

  </main>

  <div class="info-row" aria-hidden="false">
    <div class="pill" id="timeBox">${new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila", hour12:true, year:'numeric', month:'long', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' })}</div>
    <div class="pill">👁 ${views}</div>
  </div>

  <div class="footer">Powered by L © 2026 LLC Tech Corporation</div>

  <audio id="bgAudio" autoplay loop playsinline preload="auto" crossorigin="anonymous">
    <source src="${escapeHtml(AUDIO_URL)}" type="audio/mpeg">
  </audio>

<script>
  // Manila time
  function updateTime() {
    const opts = { timeZone: 'Asia/Manila', hour12: true, year:'numeric', month:'long', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' };
    document.getElementById('timeBox').textContent = new Date().toLocaleString('en-PH', opts);
  }
  setInterval(updateTime,1000);
  updateTime();

  // audio autoplay best-effort
  const audio = document.getElementById('bgAudio');
  async function tryPlay() {
    try { audio.muted = false; await audio.play(); return true; }
    catch (e) { return false; }
  }
  window.addEventListener('load', async () => {
    const ok = await tryPlay();
    if (!ok) {
      function startOnGesture() { audio.play().catch(()=>{}); removeGestureListeners(); }
      function removeGestureListeners() {
        document.removeEventListener('pointerdown', startOnGesture);
        document.removeEventListener('touchstart', startOnGesture);
        document.removeEventListener('click', startOnGesture);
      }
      document.addEventListener('pointerdown', startOnGesture, { once:true, passive:true });
      document.addEventListener('touchstart', startOnGesture, { once:true, passive:true });
      document.addEventListener('click', startOnGesture, { once:true, passive:true });
    }
  });

  // The Hub behaviour (float + glow + rain) - unchanged
  const theHub = document.getElementById('theHub');
  const rainer = document.getElementById('rainer');
  function createTH() {
    const el = document.createElement('div');
    el.className = 'th';
    el.textContent = 'TH';
    const startX = Math.random() * 100;
    el.style.left = startX + 'vw';
    const size = 18 + Math.random() * 36;
    el.style.fontSize = size + 'px';
    const rot = Math.random() * 360;
    el.style.transform = 'rotate(' + rot + 'deg)';
    const duration = 3500 + Math.random() * 3200;
    el.style.animationDuration = duration + 'ms';
    el.style.color = 'rgba(255,255,255,' + (0.9 - Math.random()*0.4) + ')';
    rainer.appendChild(el);
    el.addEventListener('animationend', ()=> el.remove());
  }
  function hubClicked(e) {
    theHub.classList.add('gc-active');
    const bursts = 120;
    const burstInterval = 25;
    let spawned = 0;
    const iv = setInterval(()=> {
      createTH(); spawned++;
      if (spawned >= bursts) { clearInterval(iv); setTimeout(()=> theHub.classList.remove('gc-active'),1700); }
    }, burstInterval);
    theHub.style.pointerEvents='none';
    setTimeout(()=> theHub.style.pointerEvents='',2500);
  }
  theHub.addEventListener('click', hubClicked, { passive:true });

  // funtify popup: fade in/out + (no navigation)
  const funtify = document.getElementById('funtify');
  const modal = document.getElementById('modal');

  function showModal(msg, duration=1800) {
    modal.textContent = msg;
    modal.classList.remove('hide'); modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    // auto hide
    setTimeout(()=> {
      modal.classList.remove('show'); modal.classList.add('hide');
      modal.setAttribute('aria-hidden','true');
    }, duration);
  }

  funtify.addEventListener('click', (e) => {
    // prevent default navigation because this is not a link
    e.preventDefault();
    showModal('Currently not available', 1800);
  }, { passive:false });

  // keyboard activation
  funtify.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') {
      ev.preventDefault();
      showModal('Currently not available', 1800);
    }
  });

  // logo click toggles audio
  const logo = document.getElementById('logo');
  logo.addEventListener('click', () => {
    if (audio.paused) audio.play().catch(()=>{});
    else audio.pause();
  }, { passive:true });

  // accessibility: close modal on Escape
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') { modal.classList.remove('show'); modal.classList.add('hide'); modal.setAttribute('aria-hidden','true'); }
  });

</script>
</body>
</html>`

  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store, private, max-age=0"
    }
  })
}

/* small helper */
function escapeHtml (str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
