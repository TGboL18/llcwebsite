addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

/* CONFIG */
const SITE_TITLE = "LLC Creative Technologies"
const LOGO_URL = "https://image2url.com/r2/default/gifs/1771931447321-b9c0bd19-ff5c-4d39-8d0a-06b9ab79821e.gif"
const BG_AUDIO_URL = "https://image2url.com/r2/default/audio/1771931706652-c6c30957-9354-46ef-869b-339a6e020cf6.mp3"
const GLOBAN_DASH_AUDIO = "https://image2url.com/r2/default/audio/1772110775520-55e0902b-b85b-46e2-80e0-a5ff971dda44.m4a"
const THE_HUB_INVITE = "https://t.me/+7AcFN8RMcnc5N2U1"
const GLOBAN_BOT_INVITE = "https://t.me/globanllcbot_bot"
const KV_KEY = "views"
/* end config */

/* registered groups to show on the Globan dashboard */
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
    headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store, private, max-age=0" }
  })
}

async function handleRequest(request) {
  const url = new URL(request.url)
  const pathname = url.pathname.replace(/\/+$/, "") || "/"
  // increment views for main page only
  const views = await getAndIncrementViews()

  if (pathname === "/globan") {
    // Globan dashboard page
    const groupsHtml = GLOBAN_GROUPS.map(g => `<li>${escapeHtml(g)}</li>`).join("\n")
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHtml(SITE_TITLE)} — Globan Dashboard</title>
<meta name="theme-color" content="#000"/>
<style>
  :root{ --bg:#000; --fg:#fff; --muted:rgba(255,255,255,0.85); --accent:#ff4d4d; }
  html,body{height:100%;margin:0;background:var(--bg);color:var(--fg);font-family:Inter,system-ui,Arial,sans-serif;-webkit-font-smoothing:antialiased;}
  .wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:28px 18px;box-sizing:border-box;gap:18px;}
  .top{width:100%;max-width:900px;display:flex;align-items:center;gap:14px;}
  .logo{width:72px;height:72px;border-radius:12px;object-fit:cover;border:0;}
  .headerTitle{font-weight:800;font-size:18px;}
  .subtitle{color:var(--muted);font-size:13px;}
  .content{width:100%;max-width:900px;background:rgba(255,255,255,0.03);padding:16px;border-radius:12px;box-shadow:0 18px 50px rgba(0,0,0,0.6);display:flex;flex-direction:column;gap:14px;}
  .groups{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:8px;font-weight:700}
  .groups li{padding:8px 12px;border-radius:8px;background:rgba(255,255,255,0.02);font-size:15px}
  .actions{display:flex;gap:12px;flex-wrap:wrap;}
  .btn{background:linear-gradient(90deg,#ff8a8a,#ff4d4d);color:#051423;padding:10px 14px;border-radius:12px;border:none;font-weight:800;cursor:pointer;text-decoration:none}
  .btn.secondary{background:transparent;border:1px solid rgba(255,255,255,0.06);color:var(--muted)}
  .small{font-size:13px;color:var(--muted)}
  .footer{margin-top:8px;font-size:12px;color:rgba(255,255,255,0.6)}
  @media (max-width:520px){ .top{flex-direction:row;align-items:center} .logo{width:64px;height:64px} .content{padding:12px} }
</style>
</head>
<body>
  <main class="wrap" role="main">
    <div class="top">
      <img class="logo" src="${escapeHtml(LOGO_URL)}" alt="logo">
      <div>
        <div class="headerTitle">Globan Dashboard</div>
        <div class="subtitle">Registered groups — preview</div>
      </div>
    </div>

    <section class="content" aria-label="registered groups">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
        <div style="display:flex;flex-direction:column;">
          <div style="font-weight:800;font-size:16px">Registered Groups</div>
          <div class="small">Total: ${GLOBAN_GROUPS.length}</div>
        </div>
        <div class="actions">
          <a class="btn" id="continueBtn" href="${GLOBAN_BOT_INVITE}" target="_blank" rel="noopener noreferrer">Continue to bot (Telegram)</a>
          <a class="btn secondary" id="backBtn" href="/" style="text-decoration:none;">Back</a>
        </div>
      </div>

      <ul class="groups" role="list">
        ${groupsHtml}
      </ul>

      <div class="footer">Powered by L © 2026 LLC Tech Corporation</div>
    </section>
  </main>

  <!-- Globan dashboard audio -->
  <audio id="globanAudio" preload="auto" playsinline>
    <source src="${escapeHtml(GLOBAN_DASH_AUDIO)}" type="audio/mpeg">
    Your browser does not support the audio element.
  </audio>

<script>
  // try to play the dashboard audio. The navigation from main page to here is a user gesture,
  // so autoplay usually succeeds — but we still handle blocked cases.
  const dashAudio = document.getElementById('globanAudio');

  async function tryPlayDash() {
    try {
      dashAudio.muted = false;
      await dashAudio.play();
      return true;
    } catch (err) {
      // If blocked, attach one-time gesture to play (user already clicked but some browsers still block)
      const playOnGesture = () => { dashAudio.play().catch(()=>{}); removeListeners(); };
      const removeListeners = () => {
        document.removeEventListener('pointerdown', playOnGesture);
        document.removeEventListener('touchstart', playOnGesture);
        document.removeEventListener('click', playOnGesture);
      };
      document.addEventListener('pointerdown', playOnGesture, { once:true, passive:true });
      document.addEventListener('touchstart', playOnGesture, { once:true, passive:true });
      document.addEventListener('click', playOnGesture, { once:true, passive:true });
      return false;
    }
  }

  window.addEventListener('load', () => {
    tryPlayDash();
    // for safety: if audio fails to start, try again on visibilitychange
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) tryPlayDash();
    });
  });

  // Pause any background audio (if the main page used a looping bg audio) by posting a simple client hint:
  // In standard navigation this isn't necessary, but in single-page navigation you'd pause background.
  try { window.top && window.top.postMessage && window.top.postMessage({ type: 'pause-bg' }, '*'); } catch (e){}

  // analytics: continue button opens Telegram in new tab, back button returns to home (already href="/")
</script>
</body>
</html>`
    return responseHTML(html)
  }

  // default: main page
  const mainHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${escapeHtml(SITE_TITLE)}</title>
<meta name="theme-color" content="#000"/>
<style>
  :root{ --bg:#000; --fg:#fff; --muted:rgba(255,255,255,0.8); --gray:#9aa0a6; }
  html,body{height:100%;margin:0;background:var(--bg);color:var(--fg);font-family:Inter,system-ui,Arial,sans-serif;-webkit-font-smoothing:antialiased;}
  .wrap{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;text-align:center;position:relative;overflow:hidden;}
  .logo{width:260px;max-width:78%;height:auto;border:0;margin:0 auto;display:block;}
  .title{margin-top:12px;font-weight:700;font-size:20px;letter-spacing:0.6px;}
  .meta{margin-top:6px;font-size:13px;color:var(--muted);}

  .sections{margin-top:18px;display:flex;flex-direction:column;gap:18px;align-items:center;width:100%;}
  .section{width:100%;max-width:420px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:8px;}
  .section h3{margin:0;font-size:14px;color:var(--muted);text-transform:lowercase;letter-spacing:0.6px;}
  .list{width:100%;background:rgba(255,255,255,0.02);padding:10px 12px;border-radius:10px;display:flex;flex-direction:column;gap:8px;align-items:center;}
  .link{color:var(--fg);text-decoration:none;font-weight:700;font-size:15px;display:inline-block;text-align:center;width:100%;max-width:320px;padding:6px 8px;}

  .bot1{background:linear-gradient(270deg,#ffffff,#ff1f1f,#ffffff);background-size:600% 600%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:slide 4s linear infinite;text-shadow:0 0 6px rgba(255,30,30,0.8);}
  .bot2{background:linear-gradient(270deg,#a855f7,#3b82f6,#fb7185,#a855f7);background-size:600% 600%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:slide 5s linear infinite;}
  @keyframes slide{0%{background-position:100% 50%}100%{background-position:0% 50%}}

  .list a.globan-link{ /* link to internal dashboard */
    color:var(--fg);
    text-decoration:none;
    font-weight:800;
    font-size:15px;
    display:inline-block;
    width:100%;
    max-width:320px;
    padding:10px;
    border-radius:8px;
    background: rgba(255,255,255,0.02);
  }

  .info-row{ position:fixed; left:0; right:0; bottom:38px; display:flex; justify-content:space-between; align-items:center; padding:0 18px; box-sizing:border-box; font-size:13px; color:var(--muted); max-width:1100px; margin:0 auto; }
  .pill{ background: rgba(255,255,255,0.02); padding:8px 12px; border-radius:999px; }
  .footer{ position:fixed; bottom:10px; font-size:12px; opacity:0.6; width:100%; text-align:center; left:0; }
  @media(min-width:520px){ .logo{ width:320px } }
</style>
</head>
<body>
  <main class="wrap" role="main">
    <img class="logo" src="${escapeHtml(LOGO_URL)}" alt="logo">
    <div class="title">${escapeHtml(SITE_TITLE)}</div>
    <div class="meta">We create Tech</div>

    <div class="sections">
      <div class="section">
        <h3>our bots</h3>
        <div class="list">
          <!-- Globan now goes to internal dashboard -->
          <a class="globan-link" href="/globan" rel="noopener">@globanllcbot_bot</a>
          <a class="link bot2" href="https://t.me/funmatchjrllc_bot" target="_blank" rel="noopener noreferrer">@funmatchjrllc_bot</a>
        </div>
      </div>

      <div class="section">
        <h3>our gc's</h3>
        <div class="list">
          <a class="link" href="${THE_HUB_INVITE}" target="_blank" rel="noopener noreferrer">The Hub</a>
        </div>
      </div>

      <div class="section">
        <h3>our Other website</h3>
        <div class="list">
          <span class="link" id="funtify">funtify</span>
          <span class="link" id="anonychat">anonychat</span>
        </div>
      </div>
    </div>

    <div id="rainer" class="rainer" aria-hidden="true"></div>
  </main>

  <div class="info-row">
    <div class="pill" id="timeBox">${new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila", hour12:true, year:'numeric', month:'long', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' })}</div>
    <div class="pill">👁 ${views}</div>
  </div>

  <div class="footer">Powered by L © 2026 LLC Tech Corporation</div>

  <!-- background audio -->
  <audio id="bgAudio" autoplay loop playsinline preload="auto" crossorigin="anonymous">
    <source src="${escapeHtml(BG_AUDIO_URL)}" type="audio/mpeg">
  </audio>

<script>
  // main page helpers (clock, autoplay)
  function updateTime(){ const opts={timeZone:'Asia/Manila',hour12:true,year:'numeric',month:'long',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'}; document.getElementById('timeBox').textContent = new Date().toLocaleString('en-PH', opts); }
  setInterval(updateTime,1000); updateTime();

  const audio = document.getElementById('bgAudio');
  async function tryPlay() { try { audio.muted=false; await audio.play(); return true;} catch(e){ return false; } }
  window.addEventListener('load', async ()=> { const ok = await tryPlay(); if(!ok){ function startOnGesture(){ audio.play().catch(()=>{}); remove(); } function remove(){ document.removeEventListener('pointerdown',startOnGesture); document.removeEventListener('touchstart',startOnGesture); document.removeEventListener('click',startOnGesture); } document.addEventListener('pointerdown',startOnGesture,{once:true,passive:true}); document.addEventListener('touchstart',startOnGesture,{once:true,passive:true}); document.addEventListener('click',startOnGesture,{once:true,passive:true}); } });

  // funtify and anonychat behaviors: keep previous actions (popup / redirect) if desired...
  // Minimal funtify popup
  const funtify = document.getElementById('funtify');
  const anony = document.getElementById('anonychat');
  const modal = document.createElement('div');
  modal.style.position='fixed'; modal.style.left='50%'; modal.style.top='50%'; modal.style.transform='translate(-50%,-50%) scale(0.96)'; modal.style.background='rgba(10,10,10,0.96)'; modal.style.color='#fff'; modal.style.padding='18px 22px'; modal.style.borderRadius='12px'; modal.style.boxShadow='0 20px 60px rgba(0,0,0,0.6)'; modal.style.opacity='0'; modal.style.pointerEvents='none'; modal.style.transition='opacity 350ms ease, transform 350ms ease'; modal.style.zIndex='2000'; modal.id='miniModal';
  document.body.appendChild(modal);
  function showMini(msg,d=1600){ modal.textContent=msg; modal.style.transform='translate(-50%,-50%) scale(1)'; modal.style.opacity='1'; modal.style.pointerEvents='auto'; setTimeout(()=>{ modal.style.transform='translate(-50%,-50%) scale(0.96)'; modal.style.opacity='0'; modal.style.pointerEvents='none'; }, d); }
  funtify && funtify.addEventListener('click', (e)=>{ e.preventDefault(); showMini('Currently not available'); }, {passive:false});
  funtify && funtify.addEventListener('keydown', (ev)=>{ if(ev.key==='Enter'||ev.key===' '){ ev.preventDefault(); showMini('Currently not available'); } });

  // anonychat quick redirect with fade (keeps previous behavior)
  anony && anony.addEventListener('click', (e)=>{ e.preventDefault(); try{ audio.pause(); }catch(e){}; // play click handled earlier by your other code if desired
    // create redirect audio and fade
    const redirectAudio = new Audio(${JSON.stringify(THE_HUB_INVITE)}); // no-op if invalid; keep original behavior separate
    // fallback: simple redirect to invite
    window.location.href = ${JSON.stringify("https://t.me/anonychatllc_bot/anonychatllc")};
  }, {passive:false});

  // landscape overlay (if wanted on main page too - optional)
  // left intentionally minimal; main behavior lives in earlier Worker versions

</script>
</body>
</html>`

  return responseHTML(mainHtml)
}

// small HTML escaper
function escapeHtml (str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
