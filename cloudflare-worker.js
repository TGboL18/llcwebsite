addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

/* CONFIG */
const SITE_TITLE = "LLC Creative Technologies"
const LOGO_URL = "https://image2url.com/r2/default/gifs/1771931447321-b9c0bd19-ff5c-4d39-8d0a-06b9ab79821e.gif"
const AUDIO_URL = "https://image2url.com/r2/default/audio/1772512586887-41c23277-3388-4b55-8625-2d76c6a61978.mp3"
// invite for The Hub (hidden)
const THE_HUB_INVITE = "https://t.me/+7AcFN8RMcnc5N2U1"
// anonychat invite (hidden)
const ANONYCHAT_INVITE = "https://t.me/anonychatllc_bot/anonychatllc"
// audio to play before redirect (the M4A you provided)
const ANONYCHAT_AUDIO_URL = "https://image2url.com/r2/default/audio/1772026713893-31ad5447-91c0-4842-8c51-b03c2331cf60.m4a"
// Globan bot link
const GLOBAN_BOT_URL = "https://t.me/globanllcbot_bot"
// Webhook for appeals
const APPEAL_WEBHOOK_URL = "https://your-worker.subdomain.workers.dev/webhook/appeal"
const APPEAL_WEBHOOK_SECRET = "globan192026"
const KV_KEY = "views"
/* end config */

let fallbackViews = 0

// Registered groups for globan dashboard
const REGISTERED_GROUPS = [
  "⌜💘⌟ 𝓐𝓯𝓪𝓶𝐇𝐔𝐍𝐓𝐄𝐑𝐙",
  "⌜⌟ 𝐓𝐀𝐌🫟𝐃𝓮𝓻𝓸 ᴘʀᴇᴍɪᴜᴍ",
  "⌜️🏆⌟ 𝐕𝐀𝐑𝐒𝐈𝐓𝐘 ᴘʜ",
  "[ 𝗧𝗔𝗠𝗕𝗔𝗬𝗔𝗡 𝗡𝗚 𝗠𝗚𝗔 𝗕𝗔𝗗𝗜𝗡𝗚 ]",
  "𝐂𝐚𝐦𝐩𝐮𝐬 𝐨𝐟 𝐆𝐨𝐝𝐝𝐞𝐬𝐬",
  "🅦 𝙷𝙸𝙳𝙴𝙾𝚄𝚃",
  "🇹𝖍𝖊 🇭✧🇴✧🇰",
  "𝕱𝖀𝕭𝖀 | 𝐅𝐮𝐧 𝐁𝐮𝐝𝐝𝐲",
  "𝐍𝐀𝐍𝐍𝐎'𝐒 𝐒𝐀𝐍𝐂𝐓𝐔𝐀𝐑𝐘",
  "𝑯𝑶𝑹𝑵𝒀 𝑪𝑰𝑻𝒀",
  "『 𝐂𝐇𝐀𝐓 𝐍' 𝐂𝐇𝐈𝐋𝐋 』",
  "『 𝗞𝗔𝗟𝗔𝗧 𝗚𝗔𝗟𝗟𝗘𝗥𝗜𝗔 』",
  "𝙎𝙖𝙣𝙜'𝙜𝙧𝙚 𝙇𝙪𝙭𝙚 𝙎𝙤𝙘𝙞𝙚𝙩𝙮🦋",
  "☬Ë™️|☞Escape The Mercy☜",
  "⌜⌟ 𝐓𝐀𝐌🫟𝐃𝓮𝓻𝓸 ғʀᴇᴍɪᴜᴍ",
  "《◇TROPAPIP'Z 8.O◇》",
  "Music jam",
  "『 𝗦𝗔𝗡𝗚𝗚𝗨𝗡𝗜𝗔𝗡𝗚 𝗞𝗔𝗟𝗜𝗕𝗨𝗚𝗔𝗡 』",
  "『 𝑻𝒉𝒆 𝑨𝒓𝒄𝒉𝒊𝒗𝒆𝒔 』",
  "Pinoy Bi Hub"
]

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
  // Handle webhook endpoint for appeals
  if (request.url.includes("/webhook/appeal")) {
    return handleAppealWebhook(request)
  }
  
  if (request.method !== "GET") return new Response(null, { status: 405 })

  const views = await getAndIncrementViews()

  const groupsHtml = REGISTERED_GROUPS.map(group => 
    `<div class="group-item">${escapeHtml(group)}</div>`
  ).join('')

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
<title>${escapeHtml(SITE_TITLE)}</title>
<meta name="theme-color" content="#000000" />
<meta name="referrer" content="no-referrer" />
<style>
  :root{ --bg:#000; --fg:#fff; --muted:rgba(255,255,255,0.8); --gray:#9aa0a6; --accent:#ff1f1f; --accent2:#a855f7; }
  * { box-sizing: border-box; }
  html,body{height:100%;margin:0;background:var(--bg);color:var(--fg);font-family:Inter,system-ui,Arial,sans-serif;-webkit-font-smoothing:antialiased;}
  .wrap { min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; text-align:center; position:relative; overflow:hidden; }
  img.logo{ width:280px; max-width:78%; height:auto; display:block; border:0; margin:0 auto; }
  .title{ margin-top:12px; font-weight:700; font-size:20px; letter-spacing:0.6px; }
  .meta{ margin-top:6px; font-size:13px; color:var(--muted); }

  .sections{ margin-top:18px; display:flex; flex-direction:column; gap:18px; align-items:center; width:100%; }
  .section{ width:100%; max-width:420px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:8px; }
  .section h3{ margin:0; font-size:14px; color:var(--muted); text-transform:lowercase; letter-spacing:0.6px; }
  .list{ width:100%; background:rgba(255,255,255,0.02); padding:10px 12px; border-radius:10px; display:flex; flex-direction:column; gap:8px; align-items:center; }
  .link{ color:var(--fg); text-decoration:none; font-weight:700; font-size:15px; display:inline-block; text-align:center; width:100%; max-width:320px; padding:6px 8px; }

  .bot1{ background:linear-gradient(270deg,#ffffff,#ff1f1f,#ffffff); background-size:600% 600%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:slide 4s linear infinite; text-shadow:0 0 6px rgba(255,30,30,0.8); }
  .bot2{ background:linear-gradient(270deg,#a855f7,#3b82f6,#fb7185,#a855f7); background-size:600% 600%; -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:slide 5s linear infinite; }
  @keyframes slide{0%{background-position:100% 50%}100%{background-position:0% 50%}}

  .thehub{ font-weight:800; font-size:18px; display:inline-block; padding:8px 12px; border-radius:999px; cursor:pointer; animation:floatY 3.6s ease-in-out infinite; text-align:center; }
  @keyframes floatY {0%{transform:translateY(0px)}50%{transform:translateY(-10px)}100%{transform:translateY(0px)}}
  .gc-glow{ background:linear-gradient(90deg, rgba(255,255,255,0.95), rgba(255,0,0,0.85)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; animation:glowShift 2.4s linear infinite; text-shadow:0 0 30px rgba(255,80,80,0.9),0 0 60px rgba(255,60,60,0.6); }
  @keyframes glowShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}

  .anony { font-weight:800; font-size:18px; cursor:pointer; display:inline-block; padding:8px 12px; border-radius:8px; color:var(--fg); animation:jump 1.2s ease-in-out infinite; }
  @keyframes jump { 0%{transform:translateY(0)}25%{transform:translateY(-8px)}50%{transform:translateY(0)}75%{transform:translateY(-4px)}100%{transform:translateY(0)} }

  .other-site{ font-weight:800; font-size:18px; cursor:pointer; color:var(--fg); display:inline-block; padding:8px 12px; border-radius:8px; text-align:center; }

  .modal { position:fixed; left:50%; top:50%; transform:translate(-50%,-50%) scale(0.96); background:rgba(10,10,10,0.96); color:#fff; padding:18px 22px; border-radius:12px; box-shadow:0 20px 60px rgba(0,0,0,0.6); opacity:0; pointer-events:none; transition: opacity 350ms ease, transform 350ms ease; z-index:2000; text-align:center; }
  .modal.show { opacity:1; pointer-events:auto; transform:translate(-50%,-50%) scale(1); }
  .modal.hide { opacity:0; pointer-events:none; transform:translate(-50%,-50%) scale(0.96); }

  .fade-overlay { position:fixed; inset:0; background:#000; opacity:0; pointer-events:none; transition: opacity 900ms ease; z-index:3000; }
  .fade-overlay.visible { opacity:1; pointer-events:auto; }

  .rainer{ pointer-events:none; position:fixed; inset:0; overflow:hidden; z-index:999; }
  .th{ position:absolute; top:-10%; left:0; font-weight:800; color:rgba(255,255,255,0.95); text-shadow:0 2px 8px rgba(0,0,0,0.6); animation:fall linear forwards; user-select:none; -webkit-user-select:none; }
  @keyframes fall{ to{ transform:translateY(120vh) rotate(720deg); opacity:0 } }

  .info-row{ position:fixed; left:0; right:0; bottom:38px; display:flex; justify-content:space-between; align-items:center; padding:0 18px; box-sizing:border-box; font-size:13px; color:var(--muted); max-width:1100px; margin:0 auto; }
  .pill{ background: rgba(255,255,255,0.02); padding:8px 12px; border-radius:999px; }
  .footer{ position:fixed; bottom:10px; font-size:12px; opacity:0.6; width:100%; text-align:center; left:0; }

  .landscape-overlay { position:fixed; inset:0; display:flex; align-items:center; justify-content:center; background:rgba(0,0,0,0.92); color:#fff; font-size:30px; font-weight:900; text-align:center; z-index:4000; opacity:0; pointer-events:none; transition: opacity 200ms ease; }
  .landscape-overlay.show { opacity:1; pointer-events:auto; }

  /* Dashboard Styles */
  .dashboard-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.97); z-index:5000; display:none; flex-direction:column; align-items:center; justify-content:center; padding:20px; box-sizing:border-box; overflow-y:auto; }
  .dashboard-overlay.active { display:flex; }
  
  .dashboard-close { position:absolute; top:20px; right:20px; background:rgba(255,255,255,0.1); border:none; color:#fff; font-size:24px; width:40px; height:40px; border-radius:50%; cursor:pointer; display:flex; align-items:center; justify-content:center; }
  .dashboard-close:hover { background:rgba(255,255,255,0.2); }
  
  .dashboard-logo { width:180px; max-width:60%; height:auto; margin-bottom:15px; }
  .dashboard-title { font-size:26px; font-weight:800; margin-bottom:6px; background:linear-gradient(90deg, #ff1f1f, #ffffff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .dashboard-subtitle { font-size:13px; color:var(--muted); margin-bottom:20px; }
  
  .dashboard-groups { width:100%; max-width:420px; max-height:25vh; overflow-y:auto; background:rgba(255,255,255,0.03); border-radius:16px; padding:12px; display:flex; flex-direction:column; gap:6px; margin-bottom:20px; }
  .dashboard-groups::-webkit-scrollbar { width:6px; }
  .dashboard-groups::-webkit-scrollbar-track { background:rgba(255,255,255,0.05); border-radius:3px; }
  .dashboard-groups::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.2); border-radius:3px; }
  
  .group-item { background:rgba(255,255,255,0.06); padding:10px 12px; border-radius:8px; font-size:12px; font-weight:600; text-align:left; word-break:break-word; }

  .dashboard-form { width:100%; max-width:420px; display:flex; flex-direction:column; gap:12px; margin-bottom:15px; }
  .form-group { text-align:left; }
  .form-label { display:block; font-size:12px; color:var(--muted); margin-bottom:6px; font-weight:600; }
  .form-input { width:100%; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:12px 15px; color:#fff; font-size:14px; font-family:inherit; outline:none; transition: border-color 0.2s, background 0.2s; }
  .form-input:focus { border-color:var(--accent); background:rgba(255,255,255,0.12); }
  .form-input::placeholder { color:rgba(255,255,255,0.4); }
  textarea.form-input { resize:vertical; min-height:80px; }
  
  .dashboard-btn { background:linear-gradient(135deg, #ff1f1f, #ff5050); color:#fff; font-weight:800; font-size:14px; padding:12px 24px; border:none; border-radius:50px; cursor:pointer; text-decoration:none; display:inline-block; transition: transform 0.2s, box-shadow 0.2s; box-shadow:0 4px 20px rgba(255,31,31,0.4); margin:4px; }
  .dashboard-btn:hover { transform:scale(1.03); box-shadow:0 6px 30px rgba(255,31,31,0.6); }
  .dashboard-btn:active { transform:scale(0.98); }
  .dashboard-btn:disabled { opacity:0.6; cursor:not-allowed; transform:none; }
  
  .dashboard-btn-secondary { background:rgba(255,255,255,0.1); color:#fff; font-weight:700; }
  .dashboard-btn-secondary:hover { background:rgba(255,255,255,0.15); box-shadow:none; }

  .user-info { display:flex; align-items:center; gap:10px; background:rgba(255,255,255,0.05); padding:10px 14px; border-radius:10px; margin-bottom:10px; }
  .user-avatar { width:40px; height:40px; border-radius:50%; background:linear-gradient(135deg, var(--accent), var(--accent2)); display:flex; align-items:center; justify-content:center; font-weight:800; font-size:16px; }
  .user-details { flex:1; text-align:left; }
  .user-name { font-weight:700; font-size:14px; }
  .user-id { font-size:11px; color:var(--muted); }

  .success-message { background:rgba(34,197,94,0.15); border:1px solid rgba(34,197,94,0.3); color:#22c55e; padding:12px 16px; border-radius:10px; font-size:13px; margin-top:10px; }
  .error-message { background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.3); color:#ef4444; padding:12px 16px; border-radius:10px; font-size:13px; margin-top:10px; }

  .button-row { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; }

  /* DANCE MODE STYLES */
  .dance-btn { 
    background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
    background-size: 300% 300%;
    animation: rainbow-bg 2s ease infinite;
    color: #fff !important;
    font-weight: 800;
    font-size: 16px;
    padding: 12px 24px;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
    margin-top: 15px;
    text-shadow: 0 0 10px rgba(255,255,255,0.8);
    box-shadow: 0 0 20px rgba(255,0,255,0.6);
    animation: rainbow-bg 1s linear infinite, pulse 0.5s ease-in-out infinite alternate;
  }
  
  .dance-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 0 40px rgba(255,0,255,0.9);
  }
  
  @keyframes rainbow-bg {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  @keyframes pulse {
    from { transform: scale(1); }
    to { transform: scale(1.05); }
  }
  
  /* Dance mode - rainbow text */
  .dance-mode .title,
  .dance-mode .meta,
  .dance-mode .section h3,
  .dance-mode .link,
  .dance-mode .thehub,
  .dance-mode .anony,
  .dance-mode .other-site {
    background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000);
    background-size: 400% 400%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: rainbow-text 0.5s linear infinite;
    text-shadow: none !important;
  }
  
  @keyframes rainbow-text {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  /* Dance mode - spinning */
  .dance-mode .logo {
    animation: spin 0.5s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg) scale(1); }
    to { transform: rotate(360deg) scale(1.1); }
  }
  
  /* Dance mode - rainbow background */
  .dance-mode {
    animation: rainbow-bg-full 0.5s linear infinite;
  }
  
  @keyframes rainbow-bg-full {
    0% { background: linear-gradient(90deg, #ff0000, #ff7f00); }
    25% { background: linear-gradient(90deg, #ff7f00, #ffff00); }
    50% { background: linear-gradient(90deg, #ffff00, #00ff00); }
    75% { background: linear-gradient(90deg, #00ff00, #0000ff); }
    100% { background: linear-gradient(90deg, #0000ff, #ff0000); }
  }
  
  .dance-mode body,
  .dance-mode html {
    background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
    background-size: 400% 400%;
    animation: rainbow-bg-full 0.5s linear infinite;
  }
  
  /* Beat effect */
  @keyframes beat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  
  .dance-beat {
    animation: beat 0.3s ease-in-out infinite;
  }
  
  /* Big DANCE text overlay */
  .dance-text-overlay {
    position: fixed;
    inset: 0;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9000;
    pointer-events: none;
  }
  
  .dance-text-overlay.active {
    display: flex;
  }
  
  .dance-text {
    font-size: 15vw;
    font-weight: 900;
    color: #fff;
    text-shadow: 
      0 0 10px #ff0000,
      0 0 20px #ff7f00,
      0 0 30px #ffff00,
      0 0 40px #00ff00,
      0 0 50px #0000ff,
      0 0 60px #4b0082,
      0 0 70px #9400d3;
    animation: flash-glow 0.3s ease-in-out infinite alternate;
    opacity: 0;
    transition: opacity 0.1s;
  }
  
  .dance-text.show {
    opacity: 1;
  }
  
  @keyframes flash-glow {
    from { 
      text-shadow: 
        0 0 10px #ff0000,
        0 0 20px #ff7f00,
        0 0 30px #ffff00,
        0 0 40px #00ff00,
        0 0 50px #0000ff;
      transform: scale(1);
    }
    to { 
      text-shadow: 
        0 0 20px #ff0000,
        0 0 40px #ff7f00,
        0 0 60px #ffff00,
        0 0 80px #00ff00,
        0 0 100px #0000ff,
        0 0 120px #4b0082;
      transform: scale(1.1);
    }
  }

  @media(min-width:520px){ img.logo{ width:320px } }
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
          <a id="globanBot" class="link bot1" href="javascript:void(0)" rel="noopener noreferrer">@globanllcbot_bot</a>
          <a class="link bot2" href="https://t.me/funmatchjrllc_bot" target="_blank" rel="noopener noreferrer">@funmatchjrllc_bot</a>
        </div>
      </div>

      <div class="section">
        <h3>our gc's</h3>
        <div class="list">
          <a id="theHub" class="link thehub gc-glow" href="${escapeHtml(THE_HUB_INVITE)}" target="_blank" rel="noopener noreferrer">The Hub</a>
        </div>
      </div>

      <div class="section">
        <h3>our Other website</h3>
        <div class="list">
          <span id="funtify" class="other-site" tabindex="0">funtify</span>
          <span id="anonychat" class="anony" tabindex="0">anonychat</span>
        </div>
      </div>
      

    </div>

    <div id="rainer" class="rainer" aria-hidden="true"></div>

    <div id="modal" class="modal hide" role="dialog" aria-modal="true" aria-hidden="true">Currently not available</div>
    <div id="fadeOverlay" class="fade-overlay" aria-hidden="true"></div>
    <div id="landOverlay" class="landscape-overlay" aria-hidden="true">no fucking landscape!</div>
    
    <!-- Dance Text Overlay -->
    <div id="danceOverlay" class="dance-text-overlay">
      <div id="danceText" class="dance-text">DANCE</div>
    </div>
  </main>

  <!-- Globan Dashboard -->
  <div id="dashboardOverlay" class="dashboard-overlay">
    <button id="closeDashboard" class="dashboard-close">&times;</button>
    <img class="dashboard-logo" src="${escapeHtml(LOGO_URL)}" alt="Logo">
    <div class="dashboard-title">GLOBAN</div>
    <div class="dashboard-subtitle">Registered Groups</div>
    
    <div class="dashboard-groups">
      ${groupsHtml}
    </div>
    
    <!-- Simplified Appeal Form -->
    <form class="dashboard-form" id="appealForm" style="display:none;">
      <div class="form-group">
        <label class="form-label">Your Telegram Username</label>
        <input type="text" class="form-input" id="appealUsername" placeholder="@username" required>
      </div>
      <div class="form-group">
        <label class="form-label">Your Appeal Message</label>
        <textarea class="form-input" id="appealMessage" placeholder="Explain your situation and why you should be unbanned..." required></textarea>
      </div>
      <button type="submit" class="dashboard-btn" id="submitAppeal">Submit Appeal</button>
    </form>
    
    <div id="formMessage"></div>
    
    <div class="button-row">
      <a id="continueToBot" class="dashboard-btn dashboard-btn-secondary" href="${escapeHtml(GLOBAN_BOT_URL)}" target="_blank" rel="noopener noreferrer">Continue to Bot</a>
      <button id="showAppealBtn" class="dashboard-btn">Submit Appeal</button>
    </div>
  </div>

  <div class="info-row" aria-hidden="false">
    <div class="pill" id="timeBox">${new Date().toLocaleString("en-PH", { timeZone: "Asia/Manila", hour12:true, year:'numeric', month:'long', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' })}</div>
    <div class="pill">👁 ${views}</div>
  </div>

  <div class="footer">Powered by L © 2026 LLC Tech Corporation</div>

  <!-- background audio (loops) -->
  <audio id="bgAudio" autoplay loop playsinline preload="auto" crossorigin="anonymous">
    <source src="${escapeHtml(AUDIO_URL)}" type="audio/mpeg">
  </audio>

<script>
  // Prevent back button and history manipulation
  (function() {
    history.replaceState(null, document.title, location.href);
    history.pushState(null, document.title, location.href);
    
    window.addEventListener('popstate', function(event) {
      history.pushState(null, document.title, location.href);
    });
    
    document.addEventListener('contextmenu', function(e) {
      e.preventDefault();
      return false;
    });
    
    document.addEventListener('selectstart', function(e) {
      e.preventDefault();
      return false;
    });
    
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
      const now = Date.now();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  })();

  // helper: update Manila time
  function updateTimeDisplay() {
    const opts = { timeZone: 'Asia/Manila', hour12: true, year:'numeric', month:'long', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit' };
    document.getElementById('timeBox').textContent = new Date().toLocaleString('en-PH', opts);
  }
  setInterval(updateTimeDisplay,1000);
  updateTimeDisplay();

  // background audio autoplay best-effort
  const audio = document.getElementById('bgAudio');
  async function tryPlay() {
    try { audio.muted = false; await audio.play(); return true; }
    catch (e) { return false; }
  }
  window.addEventListener('load', async () => {
    const ok = await tryPlay();
    if (!ok) {
      function startOnGesture() { audio.play().catch(()=>{}); removeListeners(); }
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

  // The Hub behaviour: float + glow + rain
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

  // funtify popup
  const funtify = document.getElementById('funtify');
  const modal = document.getElementById('modal');
  function showModal(msg, duration=1800) {
    modal.textContent = msg;
    modal.classList.remove('hide'); modal.classList.add('show');
    modal.setAttribute('aria-hidden','false');
    setTimeout(()=> {
      modal.classList.remove('show'); modal.classList.add('hide');
      modal.setAttribute('aria-hidden','true');
    }, duration);
  }
  funtify.addEventListener('click', (e) => { e.preventDefault(); showModal('Currently not available', 1800); }, { passive:false });
  funtify.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); showModal('Currently not available', 1800); } });

  // ANONYCHAT behaviour: play provided M4A, fade overlay when sound plays, redirect when sound ends
  const anony = document.getElementById('anonychat');
  const fadeOverlay = document.getElementById('fadeOverlay');

  function startAnonySequence() {
    anony.style.pointerEvents = 'none';
    try { audio.pause(); } catch(e) {}

    const redirectAudio = new Audio(${JSON.stringify(ANONYCHAT_AUDIO_URL)});
    redirectAudio.preload = 'auto';
    redirectAudio.addEventListener('playing', () => {
      fadeOverlay.classList.add('visible');
      fadeOverlay.setAttribute('aria-hidden','false');
    }, { once: true });

    redirectAudio.addEventListener('ended', () => {
      try { window.location.href = ${JSON.stringify(ANONYCHAT_INVITE)}; } catch (e) { }
    }, { once: true });

    redirectAudio.addEventListener('loadedmetadata', () => {
      const dur = redirectAudio.duration && isFinite(redirectAudio.duration) ? (redirectAudio.duration * 1000) + 1200 : 8000;
      setTimeout(() => {
        try { window.location.href = ${JSON.stringify(ANONYCHAT_INVITE)}; } catch(e){}
      }, dur);
    }, { once: true });

    redirectAudio.play().catch((err) => {
      fadeOverlay.classList.add('visible');
      fadeOverlay.setAttribute('aria-hidden','false');
      setTimeout(()=> { try { window.location.href = ${JSON.stringify(ANONYCHAT_INVITE)}; } catch(e){} }, 950);
    });
  }

  anony.addEventListener('click', (e) => {
    e.preventDefault();
    startAnonySequence();
  }, { passive:false });

  anony.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); startAnonySequence(); }
  });

  // landscape detection overlay
  const landOverlay = document.getElementById('landOverlay');
  function checkLandscape() {
    const isLandscape = (window.innerWidth > window.innerHeight);
    if (isLandscape) {
      landOverlay.classList.add('show');
      landOverlay.setAttribute('aria-hidden','false');
    } else {
      landOverlay.classList.remove('show');
      landOverlay.setAttribute('aria-hidden','true');
    }
  }
  window.addEventListener('load', checkLandscape);
  window.addEventListener('resize', checkLandscape);
  window.addEventListener('orientationchange', () => { setTimeout(checkLandscape, 120); });

  landOverlay.addEventListener('click', () => {
    landOverlay.classList.remove('show');
    landOverlay.setAttribute('aria-hidden','true');
  });

  // logo toggles dance mode
  const logo = document.getElementById('logo');
  logo.addEventListener('click', () => {
    if (isDancing) {
      stopDanceMode();
    } else {
      startDanceMode();
    }
  }, { passive:true });

  // close modal on Escape
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') { 
      modal.classList.remove('show'); 
      modal.classList.add('hide'); 
      modal.setAttribute('aria-hidden','true');
      closeDashboard();
    }
  });

  // ========== DANCE MODE ==========
  const danceOverlay = document.getElementById('danceOverlay');
  const danceText = document.getElementById('danceText');
  const body = document.body;
  const html = document.documentElement;
  const mainWrap = document.querySelector('.wrap');
  
  let isDancing = false;
  let danceInterval = null;
  let danceAudio = null;
  let beatInterval = null;
  let flashInterval = null;
  
  function startDanceMode() {
    if (isDancing) return;
    isDancing = true;
    
    // Pause background audio before starting dance audio
    try { audio.pause(); } catch(e) {}
    
    // Add dance class to body for rainbow background
    body.classList.add('dance-mode');
    html.classList.add('dance-mode');
    mainWrap.classList.add('dance-mode');
    
    // Play the audio loop
    try {
      danceAudio = new Audio(${JSON.stringify(AUDIO_URL)});
      danceAudio.loop = true;
      danceAudio.play().catch(() => {});
      
      // Add beat effect to the music
      danceAudio.addEventListener('timeupdate', () => {
        // Beat effect every beat (roughly based on BPM)
        const beatPosition = danceAudio.currentTime % 0.5;
        if (beatPosition < 0.1) {
          mainWrap.classList.add('dance-beat');
        } else {
          mainWrap.classList.remove('dance-beat');
        }
      });
    } catch(e) {}
    
    // Start firing TH every 1 second
    danceInterval = setInterval(() => {
      createTH();
    }, 1000);
    
    // Show and flash DANCE text
    danceOverlay.classList.add('active');
    flashInterval = setInterval(() => {
      danceText.classList.toggle('show');
    }, 150);
  }
  
  function stopDanceMode() {
    if (!isDancing) return;
    isDancing = false;
    
    // Remove dance classes
    body.classList.remove('dance-mode');
    html.classList.remove('dance-mode');
    mainWrap.classList.remove('dance-mode');
    mainWrap.classList.remove('dance-beat');
    
    // Stop audio
    if (danceAudio) {
      danceAudio.pause();
      danceAudio = null;
    }
    
    // Stop TH interval
    if (danceInterval) {
      clearInterval(danceInterval);
      danceInterval = null;
    }
    
    // Hide dance text
    danceOverlay.classList.remove('active');
    if (flashInterval) {
      clearInterval(flashInterval);
      flashInterval = null;
    }
    
    // Resume normal background audio
    try { audio.play().catch(() => {}); } catch(e) {}
  }
  


  // ========== Globan Dashboard Functionality ==========
  const globanBot = document.getElementById('globanBot');
  const dashboardOverlay = document.getElementById('dashboardOverlay');
  const closeDashboardBtn = document.getElementById('closeDashboard');
  const appealForm = document.getElementById('appealForm');
  const formMessage = document.getElementById('formMessage');
  const submitBtn = document.getElementById('submitAppeal');
  const showAppealBtn = document.getElementById('showAppealBtn');
  const continueToBot = document.getElementById('continueToBot');

  function openDashboard() {
    try { audio.pause(); } catch(e) {}
    dashboardOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    history.pushState({dashboard: true}, document.title, location.href);
    
    // Reset to initial state
    appealForm.style.display = 'none';
    formMessage.innerHTML = '';
    showAppealBtn.textContent = 'Submit Appeal';
    showAppealBtn.style.display = 'inline-block';
  }

  function closeDashboard() {
    try { audio.play(); } catch(e) {}
    dashboardOverlay.classList.remove('active');
    document.body.style.overflow = '';
    history.replaceState({dashboard: false}, document.title, location.href);
    
    // Reset form
    appealForm.reset();
    appealForm.style.display = 'none';
    formMessage.innerHTML = '';
    showAppealBtn.style.display = 'inline-block';
  }

  globanBot.addEventListener('click', (e) => {
    e.preventDefault();
    openDashboard();
  }, { passive:false });

  globanBot.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' || ev.key === ' ') { 
      ev.preventDefault(); 
      openDashboard(); 
    }
  });

  closeDashboardBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeDashboard();
  }, { passive:false });

  window.addEventListener('popstate', function(event) {
    if (dashboardOverlay.classList.contains('active')) {
      closeDashboard();
      history.pushState({dashboard: false}, document.title, location.href);
    }
  });

  // Show appeal form - simplified (no login required)
  showAppealBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showAppealBtn.style.display = 'none';
    appealForm.style.display = 'flex';
  });

  // Continue to bot button
  continueToBot.addEventListener('click', () => {
    setTimeout(() => {
      closeDashboard();
    }, 100);
  });

  // Handle form submission
  appealForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const appealUsername = document.getElementById('appealUsername').value.trim()
    const appealMessage = document.getElementById('appealMessage').value.trim()
    
    if (!appealUsername) {
      formMessage.innerHTML = '<div class="error-message">Please enter your Telegram username</div>';
      return;
    }
    
    if (!appealMessage) {
      formMessage.innerHTML = '<div class="error-message">Please enter your appeal message</div>';
      return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Submitting...';
    formMessage.innerHTML = '';
    
    const appealData = {
      username: appealUsername,
      appeal_message: appealMessage,
      timestamp: new Date().toISOString()
    };
    
    try {
      const response = await fetch(${JSON.stringify(APPEAL_WEBHOOK_URL)}, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${APPEAL_WEBHOOK_SECRET}'
        },
        body: JSON.stringify(appealData)
      });
      
      if (response.ok) {
        formMessage.innerHTML = '<div class="success-message">Appeal submitted successfully! The administrators will review your case.</div>';
        submitBtn.textContent = 'Submitted!';
        setTimeout(() => {
          closeDashboard();
        }, 2000);
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      formMessage.innerHTML = '<div class="error-message">Failed to submit appeal. Please try again or contact support directly.</div>';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Appeal';
    }
  });
<\/script>
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

// Handle appeal webhook
async function handleAppealWebhook(request) {
  try {
    // Verify authorization
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    const token = authHeader.replace('Bearer ', '')
    if (token !== APPEAL_WEBHOOK_SECRET) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Parse the appeal data
    const appealData = await request.json()
    
    // Validate required fields
    if (!appealData.user_id || !appealData.appeal_message) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Process the appeal (you can customize this)
    // For now, just log it - you can add database storage or forward to Telegram
    console.log('New Appeal Received:', JSON.stringify(appealData, null, 2))
    
    // Here you can add:
    // - Save to KV/Database
    // - Send to Telegram admin bot
    // - Send confirmation to user
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Appeal received',
      appeal_id: Date.now()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
    
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Handle Telegram Login Widget authentication
async function handleTelegramAuth(request) {
  try {
    // Telegram Login Widget sends data as query params after user authorizes
    const url = new URL(request.url)
    const params = url.searchParams
    
    // Get user data from query params (Telegram Widget sends it this way)
    const id = params.get('id')
    const first_name = params.get('first_name')
    const last_name = params.get('last_name')
    const username = params.get('username')
    const photo_url = params.get('photo_url')
    const auth_date = params.get('auth_date')
    const hash = params.get('hash')
    
    if (!id) {
      // Try to parse from request body if not in params
      if (request.method === 'POST') {
        const formData = await request.formData()
        const data = Object.fromEntries(formData)
        // Redirect back to main page with user data in URL hash
        const userData = JSON.stringify({
          user_id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          username: data.username,
          photo_url: data.photo_url,
          auth_date: data.auth_date
        })
        return new Response(null, {
          status: 302,
          headers: {
            'Location': '/?telegram_auth=' + encodeURIComponent(btoa(userData))
          }
        })
      }
      return new Response(JSON.stringify({ error: 'No user data received' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    
    // Redirect back to main page with user data encoded in URL
    const userData = JSON.stringify({
      user_id: id,
      first_name: first_name,
      last_name: last_name,
      username: username,
      photo_url: photo_url,
      auth_date: auth_date
    })
    
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/?telegram_auth=' + encodeURIComponent(btoa(userData))
      }
    })
    
  } catch (error) {
    console.error('Telegram Auth Error:', error)
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/?auth_error=1'
      }
    })
  }
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
