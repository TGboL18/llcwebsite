addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

/* CONFIG */
const SITE_TITLE = "LLC Creative Technologies"
const LOGO_URL = "https://image2url.com/r2/default/gifs/1771931447321-b9c0bd19-ff5c-4d39-8d0a-06b9ab79821e.gif"
const AUDIO_URL = "https://image2url.com/r2/default/audio/1771931706652-c6c30957-9354-46ef-869b-339a6e020cf6.mp3"
// the invite (DO NOT display raw URL; it's used as href)
const THE_HUB_INVITE = "https://t.me/+7AcFN8RMcnc5N2U1"
const KV_KEY = "views" // name used in KV
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
    // KV not bound or error — fall through to fallback
    console.warn("KV error or not bound:", e)
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

    .links{margin-top:14px;display:flex;flex-direction:column;gap:10px;align-items:center;}

    .bot-link{font-weight:700;font-size:15px;text-decoration:none;position:relative;padding:6px 12px;border-radius:8px;display:inline-block;cursor:pointer;}
    /* red/white glowing bot */
    .bot1{
      background:linear-gradient(270deg,#ffffff,#ff1f1f,#ffffff);
      background-size:600% 600%;
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
      animation:slide 4s linear infinite;
      text-shadow: 0 0 6px rgba(255,30,30,0.8);
    }
    /* violet-blue-pink animated (no glow) */
    .bot2{
      background:linear-gradient(270deg,#a855f7,#3b82f6,#fb7185,#a855f7);
      background-size:600% 600%;
      -webkit-background-clip:text;
      -webkit-text-fill-color:transparent;
      animation:slide 5s linear infinite;
      text-shadow:none;
    }

    @keyframes slide{
      0%{background-position:100% 50%}
      100%{background-position:0% 50%}
    }

    /* our gc's block */
    .gcs{margin-top:12px;display:flex;flex-direction:column;gap:10px;align-items:center;}
    .gc-link{
      font-weight:800;
      font-size:18px;
      text-decoration:none;
      color:var(--fg);
      padding:10px 18px;
      border-radius:999px;
      position:relative;
      display:inline-block;
      cursor:pointer;
      transform-origin:center;
      will-change:transform,text-shadow;
      /* initial floating */
      animation:floatY 3.6s ease-in-out infinite;
    }

    /* floating movement */
    @keyframes floatY {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }

    /* super glow effect (animated gradient glow surrounding text) */
    .gc-glow {
      background: linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,0,0,0.85));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation:glowShift 2.4s linear infinite;
      text-shadow: 0 0 30px rgba(255,80,80,0.9), 0 0 60px rgba(255,60,60,0.6);
    }
    @keyframes glowShift {
      0%{background-position:0% 50%}
      50%{background-position:100% 50%}
      100%{background-position:0% 50%}
    }

    /* active state when clicked - grows bigger */
    .gc-active {
      transform: scale(1.8);
      font-size:36px;
      transition: transform 260ms ease-out, font-size 260ms ease-out;
      z-index:9999;
      pointer-events:none;
    }

    /* container for raining TH text */
    .rainer {
      pointer-events:none;
      position:fixed;
      inset:0;
      overflow:hidden;
      z-index:999;
    }
    .th {
      position:absolute;
      top:-10%;
      left:0;
      font-weight:800;
      color:rgba(255,255,255,0.95);
      text-shadow:0 2px 8px rgba(0,0,0,0.6);
      animation:fall linear forwards;
      user-select:none;
      -webkit-user-select:none;
    }
    @keyframes fall {
      to { transform: translateY(120vh) rotate(720deg); opacity:0; }
    }

    .info-row{ position:fixed; left:0; right:0; bottom:38px; display:flex; justify-content:space-between; align-items:center; padding:0 18px; box-sizing:border-box; font-size:13px; color:var(--muted); max-width:1100px; margin:0 auto; }
    .pill{ background: rgba(255,255,255,0.02); padding:8px 12px; border-radius:999px; }
    .footer{ position:fixed; bottom:10px; font-size:12px; opacity:0.6; width:100%; text-align:center; left:0; }

    /* Sidebar */
    .sidebar {
      position:fixed;
      right:0;
      top:50%;
      transform:translateY(-50%);
      background: rgba(255,255,255,0.02);
      padding:10px 14px;
      border-radius:8px 0 0 8px;
      display:flex;
      align-items:center;
      justify-content:center;
      z-index:800;
      max-width:160px;
      min-width:120px;
      box-sizing:border-box;
    }
    .sidebar .label {
      color: var(--gray);
      font-weight:700;
      font-size:13px;
      line-height:1.2;
      text-align:center;
      white-space:nowrap;
    }

    @media(min-width:520px){ img.logo{ width:320px } }
  </style>
</head>
<body>
  <main class="wrap" role="main" aria-label="${escapeHtml(SITE_TITLE)}">
    <img id="logo" class="logo" src="${escapeHtml(LOGO_URL)}" alt="${escapeHtml(SITE_TITLE)} logo">
    <div class="title">${escapeHtml(SITE_TITLE)}</div>
    <!-- REPLACED SUBTITLE -->
    <div class="meta">We create Tech</div>

    <div class="links" aria-hidden="false">
      <a class="bot-link bot1" href="https://t.me/globanllcbot_bot" target="_blank" rel="noopener noreferrer">@globanllcbot_bot</a>
      <a class="bot-link bot2" href="https://t.me/funmatchjrllc_bot" target="_blank" rel="noopener noreferrer">@funmatchjrllc_bot</a>
    </div>

    <div style="height:12px"></div>

    <div class="gcs" aria-hidden="false">
      <!-- The Hub: visible text only; href uses invite -->
      <a id="theHub" class="gc-link" href="${escapeHtml(THE_HUB_INVITE)}" target="_blank" rel="noopener noreferrer">The Hub</a>
    </div>

    <!-- raining container -->
    <div id="rainer" class="rainer" aria-hidden="true"></div>

  </main>

  <!-- Sidebar: Funtify currently unavailable (gray text) -->
  <aside class="sidebar" aria-hidden="false">
    <div class="label">Funtify currently unavailable</div>
  </aside>

  <div class="info-row" aria-hidden="false">
    <div class="pill" id="timeBox">${new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila", hour12:true, year:'numeric', month:'long', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' })}</div>
    <div class="pill">👁 ${views}</div>
  </div>

  <div class="footer">Powered by L © 2026 LLC Tech Corporation</div>

  <audio id="bgAudio" autoplay loop playsinline preload="auto" crossorigin="anonymous">
    <source src="${escapeHtml(AUDIO_URL)}" type="audio/mpeg">
  </audio>

  <script>
    // live manila clock
    function updateTime() {
      const opts = { timeZone: 'Asia/Manila', hour12: true, year:'numeric', month:'long', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' };
      document.getElementById('timeBox').textContent = new Date().toLocaleString('en-PH', opts);
    }
    setInterval(updateTime, 1000);
    updateTime();

    // audio autoplay best-effort
    const audio = document.getElementById('bgAudio');
    async function tryPlay() {
      try {
        audio.muted = false;
        await audio.play();
        return true;
      } catch (e) {
        // blocked - attach one-time gesture listeners to start playback (no visible UI)
        return false;
      }
    }
    window.addEventListener('load', async () => {
      const ok = await tryPlay();
      if (!ok) {
        function startOnGesture() {
          audio.play().catch(()=>{});
          removeGestureListeners();
        }
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

    // THE HUB behaviour: float + glow; on click -> enlarge + rain "TH"
    const theHub = document.getElementById('theHub');
    const rainer = document.getElementById('rainer');

    // add initial glowing class (super glow) for The Hub
    function addGlow() {
      theHub.classList.add('gc-glow');
    }
    addGlow();

    // create a single "rain" item
    function createTH() {
      const el = document.createElement('div');
      el.className = 'th';
      el.textContent = 'TH';
      // random horizontal start
      const startX = Math.random() * 100; // vw
      el.style.left = startX + 'vw';
      // random size and duration
      const size = 18 + Math.random() * 36; // 18-54px
      el.style.fontSize = size + 'px';
      // random rotation start
      const rot = Math.random() * 360;
      el.style.transform = 'rotate(' + rot + 'deg)';
      // random fall duration
      const duration = 3500 + Math.random() * 3200; // ms
      el.style.animationDuration = duration + 'ms';
      // slight color variance
      el.style.color = 'rgba(255,255,255,' + (0.9 - Math.random()*0.4) + ')';
      rainer.appendChild(el);
      // cleanup after animation ends
      el.addEventListener('animationend', () => {
        el.remove();
      });
    }

    // when user clicks The Hub: enlarge text, start rain burst
    function hubClicked(e) {
      // enlarge
      theHub.classList.add('gc-active');
      // spawn multiple TH elements quickly
      const bursts = 120; // number of TH pieces total
      const burstInterval = 25; // ms between spawns
      let spawned = 0;
      const iv = setInterval(() => {
        createTH();
        spawned++;
        if (spawned >= bursts) {
          clearInterval(iv);
          // after a delay, shrink back to normal
          setTimeout(()=> {
            theHub.classList.remove('gc-active');
          }, 1700);
        }
      }, burstInterval);
      // disable repeated immediate triggers
      theHub.style.pointerEvents = 'none';
      setTimeout(()=>{ theHub.style.pointerEvents = ''; }, 2500);
    }

    theHub.addEventListener('click', hubClicked, { passive:true });

    // Optional: allow logo click to toggle audio
    const logo = document.getElementById('logo');
    logo.addEventListener('click', () => {
      if (audio.paused) audio.play().catch(()=>{});
      else audio.pause();
    }, { passive:true });

    // accessibility: keyboard activation for The Hub
    theHub.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        hubClicked();
      }
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
